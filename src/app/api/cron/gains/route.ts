import { NextResponse } from "next/server";
import { accrueGains } from "@/lib/gains";

/**
 * Endpoint de crédit quotidien des gains.
 * À planifier via un cron (Railway, cron-job.org, etc.) pour créditer
 * les revenus de tous les utilisateurs chaque jour.
 *
 * Sécurisé par un secret optionnel : envoyer l'en-tête
 *   Authorization: Bearer <CRON_SECRET>
 * et définir la variable d'environnement CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await accrueGains();
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Cron gains error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
