import { prisma } from "@/lib/prisma";

const DAY_MS = 86400000;

/**
 * Crédite les revenus quotidiens dus pour les investissements actifs.
 * Chaque jour complet écoulé (plafonné à la durée du cycle) est crédité
 * sur le solde du wallet et ajouté aux gains cumulés de l'investissement.
 * À la fin du cycle, l'investissement passe au statut "completed".
 *
 * Si `userId` est fourni, seuls les investissements de cet utilisateur sont traités.
 * Fonction idempotente : peut être appelée plusieurs fois sans double crédit.
 */
export async function accrueGains(userId?: string) {
  const now = Date.now();

  const investments = await prisma.userInvestment.findMany({
    where: {
      status: "active",
      ...(userId ? { userId } : {}),
    },
    include: { plan: true },
  });

  let credited = 0;

  for (const inv of investments) {
    const dailyGain = Number(inv.dailyGain);
    const creditedGain = Number(inv.totalGain);
    const durationDays = inv.plan.durationDays;

    const elapsedDays = Math.min(
      durationDays,
      Math.max(0, Math.floor((now - new Date(inv.startDate).getTime()) / DAY_MS))
    );
    const creditedDays = dailyGain > 0 ? Math.round(creditedGain / dailyGain) : 0;
    const daysToCredit = Math.max(0, elapsedDays - creditedDays);
    const shouldComplete = now >= new Date(inv.endDate).getTime();

    if (daysToCredit <= 0 && !shouldComplete) continue;

    const creditAmount = Math.round(daysToCredit * dailyGain * 100) / 100;

    await prisma.$transaction(async (tx) => {
      await tx.userInvestment.update({
        where: { id: inv.id },
        data: {
          ...(creditAmount > 0 ? { totalGain: { increment: creditAmount } } : {}),
          status: shouldComplete ? "completed" : "active",
        },
      });

      if (creditAmount > 0) {
        const wallet = await tx.wallet.findUnique({ where: { userId: inv.userId } });
        if (wallet) {
          await tx.wallet.update({
            where: { userId: inv.userId },
            data: {
              balance: { increment: creditAmount },
              totalGains: { increment: creditAmount },
            },
          });
        } else {
          await tx.wallet.create({
            data: {
              userId: inv.userId,
              balance: creditAmount,
              totalInvested: 0,
              totalGains: creditAmount,
            },
          });
        }

        await tx.transaction.create({
          data: {
            userId: inv.userId,
            type: "gain",
            amount: creditAmount,
            description: `Revenu quotidien — ${inv.plan.name}`,
          },
        });
      }
    });

    if (creditAmount > 0) credited++;
  }

  return { credited };
}
