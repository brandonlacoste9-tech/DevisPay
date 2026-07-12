import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "DevisPay — Get paid to start",
    template: "%s | DevisPay",
  },
  description:
    "The premium way to send a quote and collect a deposit. Card or bank. Multi-currency. Built for service businesses worldwide.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "DevisPay — Get paid to start",
    description:
      "Professional quote → one link → deposit. Card or bank/Interac. Global.",
    type: "website",
    siteName: "DevisPay",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevisPay — Get paid to start",
    description: "Quote → link → deposit. Venmo-simple pay-to-start.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${syne.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
