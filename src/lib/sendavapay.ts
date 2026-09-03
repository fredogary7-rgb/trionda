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

async function postSendava(path: string, body: unknown, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SENDAVAPAY_SDK_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { success: false, error: `Réponse invalide (statut ${res.status})` };
    }
  } catch (err: any) {
    console.error("SendavaPay fetch error:", err?.name, err?.message);
    return {
      success: false,
      error: err?.name === "AbortError" ? "Délai dépassé (SendavaPay injoignable)" : "Erreur réseau",
    };
  } finally {
    clearTimeout(timer);
  }
}

export function createSendavaPayment(params: CreatePaymentParams) {
  return postSendava("/v1/create-payment", params);
}

export function verifySendavaPayment(reference: string) {
  return postSendava("/v1/verify-payment", { reference });
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
