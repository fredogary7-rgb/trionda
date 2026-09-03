import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { accrueGains } from "@/lib/gains";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Créditer les revenus quotidiens dus avant de renvoyer les données
  try {
    await accrueGains(userId);
  } catch (e) {
    console.error("Accrue gains error:", e);
  }

  const [user, wallet, investments, transactions, referralCount, plans] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, phone: true, email: true, referralCode: true, createdAt: true },
    }),
    prisma.wallet.findUnique({ where: { userId } }),
    prisma.userInvestment.findMany({
      where: { userId },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.user.count({ where: { referredById: userId } }),
    prisma.investmentPlan.findMany({ where: { isActive: true }, orderBy: { minAmount: "asc" } }),
  ]);

  return NextResponse.json({
    user,
    wallet: wallet || { balance: "0", totalInvested: "0", totalGains: "0" },
    investments,
    transactions,
    referralCount,
    plans,
  });
}