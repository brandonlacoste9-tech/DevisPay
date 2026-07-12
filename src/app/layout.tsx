import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevisPay — Devis → acompte en un lien",
    template: "%s | DevisPay",
  },
  description:
    "Créez un devis, envoyez un lien, encaissez l'acompte par carte. Pour les métiers au Canada.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
