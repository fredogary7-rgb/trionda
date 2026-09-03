import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/sendavapay";
import { approveDeposit } from "@/lib/deposits";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sendavapay-signature");
  const event = req.headers.get("x-sendavapay-event");

  // Vérifier la signature HMAC-SHA256 (format : sha256={hex})
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  try {
    // payload.event (fallback) ou header X-SendavaPay-Event
    const evt = event || payload?.event;

    if (evt === "payment.completed") {
      // externalReference = notre tx.id (passé à create-payment)
      const txId = payload?.externalReference;
      if (txId) {
        await approveDeposit(txId);
      }
    }
    // payment.failed / payment.expired / withdrawal.* : rien à faire ici

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook sendavapay error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
