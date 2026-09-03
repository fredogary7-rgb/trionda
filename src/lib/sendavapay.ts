import { createHmac, timingSafeEqual } from "crypto";

const BASE_URL = "https://sendavapay.com/api/sdk/v1";

interface CreatePaymentParams {
  amount: number;
  currency?: string;
  description?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  payerCountry?: string;
  webhookUrl?: string;
  externalReference?: string;
  metadata?: Record<string, string>;
}

async function request(
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean; timeoutMs?: number } = {}
) {
  const { method = "GET", body, auth = true, timeoutMs = 12000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (auth) headers.Authorization = `Bearer ${process.env.SENDAVAPAY_SDK_KEY}`;

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
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

export function createPayment(params: CreatePaymentParams) {
  return request("/create-payment", { method: "POST", body: params });
}

export function verifyPayment(reference: string) {
  return request("/verify-payment", { method: "POST", body: { reference } });
}

export function getPaymentStatus(reference: string) {
  return request(`/payment-status/${reference}`, { method: "GET" });
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.SENDAVAPAY_WEBHOOK_SECRET;
  if (!signature || !secret) return false;

  // Format SDK v3 : X-SendavaPay-Signature: sha256={hex}
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

