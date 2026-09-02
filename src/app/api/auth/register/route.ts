import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

function generateReferralCode(firstName: string, lastName: string): string {
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TRD-${initials}-${random}`;
}

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, password, promoCode } = await req.json();

    // Validation
    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json({ error: "Prénom, nom, téléphone et mot de passe sont obligatoires." }, { status: 400 });
    }

    // Nettoyer téléphone
    const cleanPhone = phone.replace(/[\s.-]/g, "");
    if (!/^\+?\d{8,15}$/.test(cleanPhone)) {
      return NextResponse.json({ error: "Numéro de téléphone invalide." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "6 caractères minimum pour le mot de passe." }, { status: 400 });
    }

    // Email optionnel — valider si fourni
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
      }
    }

    // Vérifier téléphone unique
    const existingPhone = await prisma.user.findUnique({ where: { phone: cleanPhone } });
    if (existingPhone) {
      return NextResponse.json({ error: "Ce numéro de téléphone est déjà utilisé." }, { status: 409 });
    }

    // Vérifier email unique si fourni
    if (email) {
      const existingEmail = await prisma.user.findUnique({ where: { email } });
      if (existingEmail) {
        return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
      }
    }

    // Gérer le code promo / parrainage
    let referredById: string | null = null;
    if (promoCode) {
      // Essayer comme code promo admin
      const promo = await prisma.promoCode.findUnique({ where: { code: promoCode.toUpperCase() } });
      if (promo && promo.isActive && promo.uses < promo.maxUses && (!promo.expiresAt || promo.expiresAt > new Date())) {
        await prisma.promoCode.update({ where: { id: promo.id }, data: { uses: { increment: 1 } } });
        referredById = promo.createdById;
      } else {
        // Essayer comme code de parrainage utilisateur
        const referrer = await prisma.user.findUnique({ where: { referralCode: promoCode.toUpperCase() } });
        if (referrer) {
          referredById = referrer.id;
        } else {
          return NextResponse.json({ error: "Code promo ou code de parrainage invalide." }, { status: 400 });
        }
      }
    }

    // Générer code de parrainage unique
    let referralCode = generateReferralCode(firstName, lastName);
    let attempts = 0;
    while (await prisma.user.findUnique({ where: { referralCode } })) {
      referralCode = generateReferralCode(firstName, lastName);
      if (++attempts > 10) referralCode = `TRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        phone: cleanPhone,
        email: email || null,
        passwordHash,
        referralCode,
        referredById,
      },
    });

    return NextResponse.json({
      message: "Compte créé avec succès.",
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        name: `${user.firstName} ${user.lastName}`,
        referralCode: user.referralCode,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}