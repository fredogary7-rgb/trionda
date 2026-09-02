import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Trionda | Investissez dans l'avenir du Burkina Faso",
  description: "Trionda — La plateforme d'investissement de référence au Burkina Faso.",
  keywords: ["investissement", "Burkina Faso", "Trionda", "finance", "placement"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-surface">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}