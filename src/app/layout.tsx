import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const siteUrl = "https://devispay.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DevisPay — Get paid before the job starts",
    template: "%s | DevisPay",
  },
  description:
    "Contractor deposit software for Canada and the US. Send a quote, collect a deposit by card or Interac, then start the job. Roofing, HVAC, plumbing, remodels.",
  applicationName: "DevisPay",
  authors: [{ name: "DevisPay" }],
  keywords: [
    "contractor deposit software",
    "get paid before starting a job",
    "Interac deposit contractor",
    "roofing deposit",
    "HVAC quote payment",
    "plumber deposit Canada",
    "collect deposit from customer",
    "acompte entrepreneur",
    "devis acompte Interac",
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
    title: "DevisPay — Get paid before the job starts",
    description:
      "Quote → one link → deposit. Card or Interac. For trades in Canada and the US.",
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
    title: "DevisPay — Get paid before the job starts",
    description:
      "Quote → link → deposit. Card or Interac. Canada and the US.",
    images: ["/twitter-image", "/og.jpg"],
  },
  alternates: {
    canonical: "https://devispay.com",
    languages: {
      "en-CA": "https://devispay.com",
      "fr-CA": "https://devispay.com/entrepreneurs",
    },
  },
  verification: {
    google: "jAv6ZcC0zCzW8JgpzWH6LUyUCrYDp4-v0ECxRLdbcOU",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA" className={`${jakarta.variable} ${display.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "DevisPay",
                  url: "https://devispay.com",
                  logo: "https://devispay.com/icon.svg",
                  areaServed: ["CA", "US"],
                },
                {
                  "@type": "SoftwareApplication",
                  name: "DevisPay",
                  applicationCategory: "BusinessApplication",
                  operatingSystem: "Web",
                  url: "https://devispay.com",
                  description:
                    "Send a quote and collect a deposit by card or Interac before the job starts.",
                  offers: {
                    "@type": "Offer",
                    price: "39.00",
                    priceCurrency: "CAD",
                  },
                },
                {
                  "@type": "WebSite",
                  name: "DevisPay",
                  url: "https://devispay.com",
                  inLanguage: ["en-CA", "fr-CA"],
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
