import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { accrueGains } from "@/lib/gains";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  // Créditer les revenus dus avant de lister l'historique
  try {
    await accrueGains(userId);
  } catch (e) {
    console.error("Accrue gains error:", e);
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 500,
  });

  return NextResponse.json({ transactions });
}
