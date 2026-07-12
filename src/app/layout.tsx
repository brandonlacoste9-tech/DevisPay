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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevisPay — Get paid to start",
    template: "%s | DevisPay",
  },
  description:
    "The premium way to send a quote and collect a deposit. Card or bank. Multi-currency. Built for service businesses worldwide.",
  applicationName: "DevisPay",
  authors: [{ name: "DevisPay" }],
  keywords: [
    "quote deposit",
    "pay on quote",
    "Interac deposit",
    "Stripe deposit",
    "service business payments",
    "DevisPay",
  ],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  openGraph: {
    title: "DevisPay — Get paid to start",
    description:
      "Professional quote → one link → deposit. Card or bank/Interac. Global.",
    type: "website",
    siteName: "DevisPay",
    locale: "en_CA",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "DevisPay — Get paid to start",
      },
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "DevisPay",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevisPay — Get paid to start",
    description: "Quote → link → deposit. Venmo-simple pay-to-start.",
    images: ["/twitter-image", "/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
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
