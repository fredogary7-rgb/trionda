import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { planId } = await req.json();
    if (!planId) return NextResponse.json({ error: "Plan requis" }, { status: 400 });

    const plan = await prisma.investmentPlan.findUnique({ where: { id: planId } });
    if (!plan || !plan.isActive) return NextResponse.json({ error: "Plan indisponible" }, { status: 404 });

    const amount = Number(plan.minAmount);
    const dailyGain = Number(plan.dailyReturn) * amount / 100;
    const durationDays = plan.durationDays;
    const endDate = new Date(Date.now() + durationDays * 86400000);

    // Vérifier/créer wallet
    let wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) {
      wallet = await prisma.wallet.create({ data: { userId, balance: 0, totalInvested: 0, totalGains: 0 } });
    }

    if (Number(wallet.balance) < amount) {
      return NextResponse.json({ error: "Solde insuffisant. Veuillez recharger votre compte." }, { status: 400 });
    }

    // Créer investissement + débiter + tx en transaction
    const [investment] = await prisma.$transaction([
      prisma.userInvestment.create({
        data: { userId, planId, amount, dailyGain, endDate, totalGain: 0 },
      }),
      prisma.wallet.update({
        where: { userId },
        data: {
          balance: { decrement: amount },
          totalInvested: { increment: amount },
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: "investment",
          amount: -amount,
          description: `Achat ${plan.name} - ${amount.toLocaleString("fr-FR")} FCFA`,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      investment: {
        id: investment.id,
        plan: plan.name,
        amount,
        dailyGain,
        durationDays,
        endDate,
        totalGain: amount * Number(plan.dailyReturn) * durationDays / 100,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Invest error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}