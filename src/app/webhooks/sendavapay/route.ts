import { NextResponse } from "next/server";
import { verifySendavaPayment, verifyWebhookSignature } from "@/lib/sendavapay";
import { approveDeposit } from "@/lib/deposits";

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-sendavapay-signature");
  const event = req.headers.get("x-sendavapay-event");

  // Vérifier la signature HMAC-SHA256
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
    if (event === "payment.completed") {
      const reference = payload?.data?.reference;
      if (reference) {
        // Re-vérifier côté SendavaPay pour récupérer l'externalReference (notre txId)
        const verification = await verifySendavaPayment(reference);
        if (verification?.data?.status === "completed" && verification?.data?.externalReference) {
          await approveDeposit(verification.data.externalReference);
        }
      }
    }
    // payment.failed / credit.completed : rien à faire ici

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook sendavapay error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
