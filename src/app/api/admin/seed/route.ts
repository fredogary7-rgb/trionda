import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await prisma.user.findFirst({ where: { isAdmin: true } });
  if (admin) return NextResponse.json({ message: "Admin existe déjà" });

  const hash = await bcrypt.hash("Admin@2026!", 12);
  await prisma.user.create({
    data: {
      phone: "+22600000000",
      email: "admin@trionda.com",
      firstName: "Super",
      lastName: "Admin",
      passwordHash: hash,
      referralCode: "TRD-ADMIN-001",
      isAdmin: true,
    },
  });

  return NextResponse.json({ message: "Admin créé !", credentials: { phone: "+22600000000", email: "admin@trionda.com", password: "Admin@2026!" } });
}