import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPayment } from "@/lib/sendavapay";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const userId = (session.user as { id: string }).id;

  try {
    const { amount, phone, name, email, country, currency } = await req.json();
    const amt = parseInt(amount);
    if (!amt || amt < 100) return NextResponse.json({ error: "Montant minimum 100." }, { status: 400 });
    if (!phone) return NextResponse.json({ error: "Numéro de téléphone requis." }, { status: 400 });
    if (!country) return NextResponse.json({ error: "Pays requis." }, { status: 400 });

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

    const payment = await createPayment({
      amount: amt,
      currency: currency || "XOF",
      description: "Dépôt Trionda",
      externalReference: tx.id,
      customerPhone: phone,
      customerName: name || undefined,
      customerEmail: email || undefined,
      payerCountry: country,
      webhookUrl: process.env.SENDAVAPAY_WEBHOOK_URL || undefined,
      metadata: { userId, txId: tx.id },
    });

    if (!payment?.success || !payment?.data?.paymentToken) {
      return NextResponse.json(
        { error: payment?.error || payment?.code || "Impossible de créer le paiement." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      paymentToken: payment.data.paymentToken,
      reference: payment.data.reference,
    });
  } catch (error) {
    console.error("Pay error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
