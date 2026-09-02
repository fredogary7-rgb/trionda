"use strict";
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding investment plans...");

  const plans = [
    { amount: 7000, name: "Plan Découverte", dailyReturn: 6, durationDays: 80, color: "#3388FF" },
    { amount: 12000, name: "Plan Standard", dailyReturn: 6, durationDays: 80, color: "#4d8fff" },
    { amount: 21000, name: "Plan Confort", dailyReturn: 6, durationDays: 80, color: "#1a70ff" },
    { amount: 25000, name: "Plan Premium", dailyReturn: 6, durationDays: 80, color: "#5865F2" },
    { amount: 35000, name: "Plan Business", dailyReturn: 6, durationDays: 80, color: "#7B61FF" },
    { amount: 50000, name: "Plan Elite", dailyReturn: 6, durationDays: 80, color: "#9B59B6" },
    { amount: 100000, name: "Plan Platinum", dailyReturn: 6, durationDays: 80, color: "#F0A500" },
    { amount: 150000, name: "Plan Diamant", dailyReturn: 6, durationDays: 80, color: "#FF3B30" },
  ];

  for (const p of plans) {
    await prisma.investmentPlan.upsert({
      where: { id: `plan-${p.amount}` },
      update: { name: p.name, minAmount: p.amount, dailyReturn: p.dailyReturn, durationDays: p.durationDays, color: p.color },
      create: { id: `plan-${p.amount}`, name: p.name, minAmount: p.amount, dailyReturn: p.dailyReturn, durationDays: p.durationDays, color: p.color },
    });
  }

  console.log("✅ Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());