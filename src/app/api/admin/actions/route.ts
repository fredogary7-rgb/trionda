import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const REFERRAL_LEVELS = [15, 2, 1]; // Lv1 15%, Lv2 2%, Lv3 1%

// Approve deposit
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { isAdmin: boolean }).isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const { txId } = await req.json();

  const tx = await prisma.transaction.findUnique({
    where: { id: txId },
    include: { user: { select: { id: true, referredById: true, firstDepositDone: true, firstName: true, lastName: true } } },
  });
  if (!tx) return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });

  const ops: any[] = [];

  if (tx.type === "deposit" && tx.status === "pending") {
    ops.push(
      prisma.transaction.update({ where: { id: txId }, data: { status: "completed" } }),
      prisma.wallet.upsert({
        where: { userId: tx.userId },
        update: { balance: { increment: tx.amount } },
        create: { userId: tx.userId, balance: tx.amount },
      })
    );

    // First deposit → distribute referral bonuses
    if (!tx.user.firstDepositDone && tx.user.referredById) {
      const depositAmount = Number(tx.amount);

      // Build the chain: Lv1, Lv2, Lv3
      let currentParentId: string | null = tx.user.referredById;

      for (let level = 0; level < 3 && currentParentId; level++) {
        const bonusAmount = Math.round(depositAmount * REFERRAL_LEVELS[level] / 100);

        // Get parent info
        const parentUser = await prisma.user.findUnique({
          where: { id: currentParentId },
          select: { referredById: true, id: true },
        });

        if (!parentUser) break;

        ops.push(
          prisma.referralBonus.create({
            data: { receiverId: parentUser.id, fromUserId: tx.userId, depositAmount, level: level + 1, amount: bonusAmount },
          }),
          prisma.transaction.create({
            data: { userId: parentUser.id, type: "referral", amount: bonusAmount, status: "completed", description: `Bonus parrainage Lv${level + 1} - ${tx.user.firstName} ${tx.user.lastName} - ${depositAmount.toLocaleString("fr-FR")} FCFA` },
          }),
          prisma.wallet.upsert({
            where: { userId: parentUser.id },
            update: { balance: { increment: bonusAmount }, totalGains: { increment: bonusAmount } },
            create: { userId: parentUser.id, balance: bonusAmount, totalGains: bonusAmount },
          })
        );

        currentParentId = parentUser.referredById;
      }

      // Mark first deposit done
      ops.push(prisma.user.update({ where: { id: tx.userId }, data: { firstDepositDone: true } }));
    }

  } else if (tx.type === "withdrawal" && tx.status === "pending") {
    ops.push(prisma.transaction.update({ where: { id: txId }, data: { status: "completed" } }));
  }

  await prisma.$transaction(ops);
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

  const { userId, amount, description } = await req.json();
  const amt = parseFloat(amount);
  if (!amt || isNaN(amt)) return NextResponse.json({ error: "Montant invalide" }, { status: 400 });

  const isCredit = amt > 0;

  await prisma.$transaction([
    prisma.transaction.create({ data: { userId, type: isCredit ? "credit" : "debit", amount: amt, description: description || (isCredit ? "Crédit admin" : "Débit admin") } }),
    prisma.wallet.upsert({
      where: { userId },
      update: { balance: { increment: amt } },
      create: { userId, balance: amt },
    }),
  ]);

  return NextResponse.json({ success: true });
}