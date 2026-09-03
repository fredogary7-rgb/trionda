import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSendavaPayment } from "@/lib/sendavapay";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { amount, phone, name, email, operator } = await req.json();
    const amt = parseInt(amount);
    if (!amt || amt < 500) return NextResponse.json({ error: "Montant minimum 500 FCFA." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Numéro de téléphone requis." }, { status: 400 });

    // Transaction en attente — sera validée par le webhook
    const tx = await prisma.transaction.create({
      data: {
        userId,
        type: "deposit",
        amount: amt,
        status: "pending",
        description: `Dépôt SendavaPay - ${phone}`,
      },
    });

    const payment = await createSendavaPayment({
      amount: amt,
      currency: "XOF",
      description: `Dépôt Trionda${operator ? ` - ${operator}` : ""}`,
      externalReference: tx.id,
      customerPhone: phone,
      ...(name ? { customerName: name } : {}),
      ...(email ? { customerEmail: email } : {}),
      redirectUrl: process.env.SENDAVAPAY_REDIRECT_URL || undefined,
      metadata: { userId, txId: tx.id, ...(operator ? { operator } : {}) },
    });

    if (!payment?.success || !payment?.data?.paymentUrl) {
      return NextResponse.json(
        { error: payment?.error || "Impossible de créer le paiement." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentUrl: payment.data.paymentUrl,
      reference: payment.data.reference,
    });
  } catch (error) {
    console.error("Pay error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
