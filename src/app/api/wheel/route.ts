import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Prix avec poids (plus le poids est élevé, plus la chance est grande)
const PRIZES = [
  { label: "0 FCFA", amount: 0, weight: 40, color: "#CBD5E1" },
  { label: "25 FCFA", amount: 25, weight: 25, color: "#93C5FD" },
  { label: "50 FCFA", amount: 50, weight: 15, color: "#60A5FA" },
  { label: "100 FCFA", amount: 100, weight: 10, color: "#3B82F6" },
  { label: "200 FCFA", amount: 200, weight: 6, color: "#F59E0B" },
  { label: "300 FCFA", amount: 300, weight: 3, color: "#F97316" },
  { label: "400 FCFA", amount: 400, weight: 0.8, color: "#EF4444" },
  { label: "500 FCFA", amount: 500, weight: 0.2, color: "#8B5CF6" },
];

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Vérifier si l'utilisateur a déjà joué aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyPlayed = await prisma.transaction.findFirst({
    where: {
      userId,
      type: "wheel",
      createdAt: { gte: today },
    },
  });

  if (alreadyPlayed) {
    return NextResponse.json({ error: "Vous avez déjà joué aujourd'hui. Revenez demain !" }, { status: 400 });
  }

  // Tirage pondéré
  const totalWeight = PRIZES.reduce((s, p) => s + p.weight, 0);
  let random = Math.random() * totalWeight;
  let selectedPrize = PRIZES[0];

  for (const prize of PRIZES) {
    random -= prize.weight;
    if (random <= 0) {
      selectedPrize = prize;
      break;
    }
  }

  const prizeIndex = PRIZES.indexOf(selectedPrize);

  // Créditer le gain si > 0
  if (selectedPrize.amount > 0) {
    await prisma.$transaction([
      prisma.transaction.create({
        data: {
          userId,
          type: "wheel",
          amount: selectedPrize.amount,
          status: "completed",
          description: `Gain Lucky Wheel - ${selectedPrize.label}`,
        },
      }),
      prisma.wallet.upsert({
        where: { userId },
        update: {
          balance: { increment: selectedPrize.amount },
          totalGains: { increment: selectedPrize.amount },
        },
        create: {
          userId,
          balance: selectedPrize.amount,
          totalGains: selectedPrize.amount,
        },
      }),
    ]);
  } else {
    // Enregistrer même si gain = 0
    await prisma.transaction.create({
      data: {
        userId,
        type: "wheel",
        amount: 0,
        status: "completed",
        description: "Lucky Wheel - 0 FCFA",
      },
    });
  }

  return NextResponse.json({
    prizeIndex,
    prize: selectedPrize,
  });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const alreadyPlayed = await prisma.transaction.findFirst({
    where: { userId, type: "wheel", createdAt: { gte: today } },
  });

  return NextResponse.json({
    canPlay: !alreadyPlayed,
    prizes: PRIZES.map(p => ({ label: p.label, color: p.color, amount: p.amount })),
  });
}