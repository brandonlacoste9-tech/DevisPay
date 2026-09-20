import { money } from "./money";

export function quotePayUrl(token: string, origin?: string) {
  const base =
    origin ||
    (typeof window !== "undefined" ? window.location.origin : "https://devispay.com");
  return `${base.replace(/\/$/, "")}/q/${token}`;
}

export function quoteShareText(input: {
  title: string;
  customerName?: string;
  depositCents: number;
  currency?: string;
  lang?: "fr" | "en";
  url: string;
}) {
  const fr = input.lang === "fr";
  const amount = money(input.depositCents, input.currency || "cad", fr ? "fr-CA" : "en-CA");
  if (fr) {
    return `Devis — ${input.title}\nAcompte ${amount} pour commencer.\n${input.url}`;
  }
  return `${input.title}\nDeposit ${amount} to start the job.\n${input.url}`;
}

export function whatsappHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function smsHref(text: string) {
  return `sms:?&body=${encodeURIComponent(text)}`;
}

export async function nativeShare(input: { title: string; text: string; url: string }) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: input.title, text: input.text, url: input.url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
