import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { firstName, lastName, email } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Prénom et nom requis." }, { status: 400 });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Format d'email invalide." }, { status: 400 });
      }
      const existing = await prisma.user.findFirst({
        where: { email, id: { not: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName, email: email || null },
      select: {
        id: true, firstName: true, lastName: true, phone: true, email: true,
        referralCode: true, createdAt: true,
      },
    });

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}