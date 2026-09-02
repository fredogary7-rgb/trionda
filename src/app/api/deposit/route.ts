import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { amount, phone } = await req.json();
    const amt = parseInt(amount);
    if (!amt || amt < 500) return NextResponse.json({ error: "Montant minimum 500 FCFA." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Numéro de téléphone requis." }, { status: 400 });

    const deposit = await prisma.transaction.create({
      data: {
        userId,
        type: "deposit",
        amount: amt,
        status: "pending",
        description: `Dépôt Orange Money - ${phone}`,
      },
    });

    return NextResponse.json({ success: true, deposit }, { status: 201 });

  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}