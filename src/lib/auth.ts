import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifiant et mot de passe requis");
        }

        // Chercher par téléphone OU email
        const isPhone = /^\+?\d{8,15}$/.test(credentials.identifier.replace(/[\s-]/g, ""));
        const user = isPhone
          ? await prisma.user.findUnique({ where: { phone: credentials.identifier.replace(/[\s-]/g, "") } })
          : await prisma.user.findUnique({ where: { email: credentials.identifier } });

        if (!user) {
          throw new Error("Identifiant ou mot de passe incorrect");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Identifiant ou mot de passe incorrect");
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; }
      if (user) { token.isAdmin = (user as { isAdmin?: boolean }).isAdmin ?? false; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
        (session.user as { isAdmin: boolean }).isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};