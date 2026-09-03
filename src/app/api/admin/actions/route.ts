import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { approveDeposit } from "@/lib/deposits";

// Approve deposit
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { isAdmin: boolean }).isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { txId } = await req.json();

  const tx = await prisma.transaction.findUnique({ where: { id: txId } });
  if (!tx) return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });

  if (tx.type === "deposit" && tx.status === "pending") {
    await approveDeposit(txId);
  } else if (tx.type === "withdrawal" && tx.status === "pending") {
    await prisma.transaction.update({ where: { id: txId }, data: { status: "completed" } });
  }

  return NextResponse.json({ success: true });
}

// Ban/Unban user
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { isAdmin: boolean }).isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { userId, action } = await req.json();
  const ban = action === "ban";

  await prisma.user.update({ where: { id: userId }, data: { isBanned: ban } });
  return NextResponse.json({ success: true, banned: ban });
}

// Credit/Debit
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { isAdmin: boolean }).isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { phone, amount, description } = await req.json();
  const amt = parseFloat(amount);
  if (!amt || isNaN(amt)) return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
  if (!phone) return NextResponse.json({ error: "Numéro de téléphone requis." }, { status: 400 });

  // Normaliser le téléphone (préfixe +226 si absent)
  const clean = String(phone).replace(/[\s.-]/g, "");
  const normalized = clean.startsWith("+") ? clean : `+226${clean}`;

  const user = await prisma.user.findUnique({ where: { phone: normalized } });
  if (!user) return NextResponse.json({ error: "Utilisateur introuvable pour ce numéro." }, { status: 404 });

  const isCredit = amt > 0;

  await prisma.$transaction([
    prisma.transaction.create({ data: { userId: user.id, type: isCredit ? "credit" : "debit", amount: amt, description: description || (isCredit ? "Crédit admin" : "Débit admin") } }),
    prisma.wallet.upsert({
      where: { userId: user.id },
      update: { balance: { increment: amt } },
      create: { userId: user.id, balance: amt },
    }),
  ]);

  return NextResponse.json({ success: true });
}