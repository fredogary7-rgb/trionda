import { createHmac, timingSafeEqual } from "crypto";

const BASE_URL = "https://sendavapay.com/api";

interface CreatePaymentParams {
  amount: number;
  currency?: string;
  description?: string;
  externalReference?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  redirectUrl?: string;
  metadata?: Record<string, string>;
}

export async function createSendavaPayment(params: CreatePaymentParams) {
  const res = await fetch(`${BASE_URL}/v1/create-payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDAVAPAY_SDK_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  return res.json();
}

export async function verifySendavaPayment(reference: string) {
  const res = await fetch(`${BASE_URL}/v1/verify-payment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SENDAVAPAY_SDK_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reference }),
  });
  return res.json();
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.SENDAVAPAY_WEBHOOK_SECRET;
  if (!signature || !secret) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
