import { prisma } from "@/lib/prisma";

const REFERRAL_LEVELS = [10, 2, 1]; // Lv1 10%, Lv2 2%, Lv3 1%

/**
 * Valide un dépôt en attente : marque la transaction "completed",
 * crédite le solde du wallet et, s'il s'agit du premier dépôt,
 * distribue les bonus de parrainage (3 niveaux).
 * Retourne false si la transaction n'existe pas ou n'est plus en attente
 * (permet l'idempotence).
 */
export async function approveDeposit(txId: string): Promise<boolean> {
  const tx = await prisma.transaction.findUnique({
    where: { id: txId },
    include: {
      user: {
        select: {
          id: true,
          referredById: true,
          firstDepositDone: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!tx || tx.type !== "deposit" || tx.status !== "pending") return false;

  const ops: any[] = [];

  ops.push(
    prisma.transaction.update({ where: { id: txId }, data: { status: "completed" } }),
    prisma.wallet.upsert({
      where: { userId: tx.userId },
      update: { balance: { increment: tx.amount } },
      create: { userId: tx.userId, balance: tx.amount },
    })
  );

  // Premier dépôt → distribuer les bonus de parrainage
  if (!tx.user.firstDepositDone && tx.user.referredById) {
    const depositAmount = Number(tx.amount);
    let nextId: string | null = tx.user.referredById;

    for (let level = 0; level < 3; level++) {
      if (!nextId) break;
      const currentId: string = nextId;
      const bonusAmount = Math.round((depositAmount * REFERRAL_LEVELS[level]) / 100);

      const parentData = await prisma.user.findUnique({
        where: { id: currentId },
        select: { referredById: true, id: true },
      });
      if (!parentData) break;

      ops.push(
        prisma.referralBonus.create({
          data: {
            receiverId: parentData.id,
            fromUserId: tx.userId,
            depositAmount,
            level: level + 1,
            amount: bonusAmount,
          },
        }),
        prisma.transaction.create({
          data: {
            userId: parentData.id,
            type: "referral",
            amount: bonusAmount,
            status: "completed",
            description: `Bonus parrainage Lv${level + 1} - ${tx.user.firstName} ${tx.user.lastName} - ${depositAmount.toLocaleString("fr-FR")} FCFA`,
          },
        }),
        prisma.wallet.upsert({
          where: { userId: parentData.id },
          update: { balance: { increment: bonusAmount }, totalGains: { increment: bonusAmount } },
          create: { userId: parentData.id, balance: bonusAmount, totalGains: bonusAmount },
        })
      );

      nextId = parentData.referredById;
    }

    ops.push(prisma.user.update({ where: { id: tx.userId }, data: { firstDepositDone: true } }));
  }

  await prisma.$transaction(ops);
  return true;
}
