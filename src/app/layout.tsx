import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "DevisPay — Pay this quote. Get paid to start.",
    template: "%s | DevisPay",
  },
  description:
    "Professional quote → one link → deposit by card or bank. Venmo-simple pay-to-start for any service business, worldwide. Not a bank escrow.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "DevisPay — Get paid to start",
    description:
      "Quote → link → deposit. Card or bank/Interac. Multi-currency. For any service business.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
