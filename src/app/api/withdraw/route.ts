import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { amount, phone, name } = await req.json();
    const amt = parseInt(amount);
    if (!amt || amt < 500) return NextResponse.json({ error: "Montant minimum 500 FCFA." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Numéro requis." }, { status: 400 });

    // Vérifier si l'utilisateur a au moins un investissement actif
    const activeInvestments = await prisma.userInvestment.findFirst({
      where: { userId, status: "active" },
    });

    if (!activeInvestments) {
      return NextResponse.json({
        error: "Vous devez avoir un investissement actif pour effectuer un retrait.",
      }, { status: 400 });
    }

    // Vérifier le solde
    const wallet = await prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || Number(wallet.balance) < amt) {
      return NextResponse.json({ error: "Solde insuffisant." }, { status: 400 });
    }

    const [tx] = await prisma.$transaction([
      prisma.transaction.create({
        data: { userId, type: "withdrawal", amount: -amt, status: "pending",
          description: `Retrait vers ${phone} - ${name || "Client"}` },
      }),
      prisma.wallet.update({
        where: { userId },
        data: { balance: { decrement: amt } },
      }),
    ]);

    return NextResponse.json({ success: true, withdrawal: tx }, { status: 201 });

  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}