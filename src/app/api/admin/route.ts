import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user as { isAdmin: boolean }).isAdmin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const [users, pendingDeposits, pendingWithdrawals, transactions, stats] = await Promise.all([
    prisma.user.findMany({ select: { id: true, firstName: true, lastName: true, phone: true, email: true, isBanned: true, isAdmin: true, createdAt: true }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ where: { type: "deposit", status: "pending" }, include: { user: { select: { firstName: true, lastName: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ where: { type: "withdrawal", status: "pending" }, include: { user: { select: { firstName: true, lastName: true, phone: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.transaction.findMany({ include: { user: { select: { firstName: true, lastName: true, phone: true } } }, orderBy: { createdAt: "desc" }, take: 50 }),
    prisma.user.aggregate({ _count: { id: true } }),
  ]);

  return NextResponse.json({
    users,
    pendingDeposits,
    pendingWithdrawals,
    transactions,
    totalUsers: stats._count.id,
  });
}