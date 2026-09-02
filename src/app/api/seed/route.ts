export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const PLANS = [
  { id: "plan-7000", name: "Plan Découverte", amount: 7000, dailyReturn: 6, duration: 80, color: "#3388FF" },
  { id: "plan-12000", name: "Plan Standard", amount: 12000, dailyReturn: 6, duration: 80, color: "#4d8fff" },
  { id: "plan-21000", name: "Plan Confort", amount: 21000, dailyReturn: 6, duration: 80, color: "#1a70ff" },
  { id: "plan-25000", name: "Plan Premium", amount: 25000, dailyReturn: 6, duration: 80, color: "#5865F2" },
  { id: "plan-35000", name: "Plan Business", amount: 35000, dailyReturn: 6, duration: 80, color: "#7B61FF" },
  { id: "plan-50000", name: "Plan Elite", amount: 50000, dailyReturn: 6, duration: 80, color: "#9B59B6" },
  { id: "plan-100000", name: "Plan Platinum", amount: 100000, dailyReturn: 6, duration: 80, color: "#F0A500" },
  { id: "plan-150000", name: "Plan Diamant", amount: 150000, dailyReturn: 6, duration: 80, color: "#FF3B30" },
];

export async function GET() {
  for (const p of PLANS) {
    await prisma.investmentPlan.upsert({
      where: { id: p.id },
      update: { name: p.name, minAmount: p.amount, dailyReturn: p.dailyReturn, durationDays: p.duration, color: p.color },
      create: { id: p.id, name: p.name, minAmount: p.amount, dailyReturn: p.dailyReturn, durationDays: p.duration, color: p.color },
    });
  }
  return NextResponse.json({ ok: true, count: PLANS.length });
}