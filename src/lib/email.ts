import { Resend } from "resend";
import { money } from "./money";
import type { Quote, User } from "./types";
import { remainingBalanceCents } from "./types";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

function fromAddress(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    "DevisPay <onboarding@resend.dev>"
  );
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://devispay.com"
  );
}

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  return new Resend(key);
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPayLinkEmail(opts: {
  quote: Quote;
  business: User;
  to?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    return {
      ok: false,
      error: "Email not configured — set RESEND_API_KEY on Netlify",
    };
  }

  const to = (opts.to || opts.quote.customerEmail).trim().toLowerCase();
  if (!to) return { ok: false, error: "No recipient email" };

  const fr = opts.quote.lang === "fr";
  const cur = opts.quote.currency || "cad";
  const loc = fr ? "fr-CA" : "en-CA";
  const payUrl = `${siteUrl()}/q/${opts.quote.publicToken}`;
  const deposit = money(opts.quote.depositAmountCents, cur, loc);
  const total = money(opts.quote.totalCents, cur, loc);
  const biz = opts.business.businessName;

  const subject = fr
    ? `${biz} — Acompte de ${deposit} pour « ${opts.quote.title} »`
    : `${biz} — Deposit of ${deposit} for “${opts.quote.title}”`;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#141416;border-radius:16px;border:1px solid #27272a;padding:32px;">
        <tr><td>
          <p style="margin:0;font-size:11px;letter-spacing:0.15em;color:#a1a1aa;text-transform:uppercase;font-weight:700;">DevisPay</p>
          <h1 style="margin:16px 0 8px;font-size:22px;color:#fafafa;line-height:1.2;">${esc(opts.quote.title)}</h1>
          <p style="margin:0 0 20px;color:#a1a1aa;font-size:14px;">
            ${fr ? "De" : "From"} <strong style="color:#e4e4e7;">${esc(biz)}</strong>
            ${fr ? " pour " : " for "}
            <strong style="color:#e4e4e7;">${esc(opts.quote.customerName)}</strong>
          </p>
          <table width="100%" style="margin:0 0 24px;">
            <tr>
              <td style="color:#71717a;font-size:13px;padding:6px 0;">${fr ? "Total du projet" : "Project total"}</td>
              <td align="right" style="color:#e4e4e7;font-size:13px;font-weight:600;">${esc(total)}</td>
            </tr>
            <tr>
              <td style="color:#f5b942;font-size:15px;font-weight:700;padding:6px 0;">${fr ? "À payer maintenant" : "Due now"}</td>
              <td align="right" style="color:#f5b942;font-size:18px;font-weight:800;">${esc(deposit)}</td>
            </tr>
          </table>
          <a href="${esc(payUrl)}" style="display:block;text-align:center;background:linear-gradient(180deg,#ffd36a,#f5b942);color:#0a0a0a;text-decoration:none;font-weight:800;font-size:15px;padding:14px 20px;border-radius:999px;">
            ${fr ? `Payer ${esc(deposit)}` : `Pay ${esc(deposit)}`}
          </a>
          <p style="margin:20px 0 0;font-size:12px;color:#52525b;line-height:1.5;word-break:break-all;">
            ${fr ? "Lien :" : "Link:"} ${esc(payUrl)}
          </p>
          <p style="margin:16px 0 0;font-size:11px;color:#3f3f46;">
            ${fr ? "Paiement sécurisé · Pas un compte d'escrow" : "Secure payment · Not a bank escrow account"}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: [to],
      subject,
      html,
      replyTo: opts.business.email || undefined,
    });
    if (error) {
      console.error("[email pay link]", error);
      return { ok: false, error: error.message || "Send failed" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email pay link]", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Send failed",
    };
  }
}

export async function sendReceiptEmail(opts: {
  quote: Quote;
  business: User;
  to?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const resend = getResend();
  if (!resend) {
    return {
      ok: false,
      error: "Email not configured — set RESEND_API_KEY on Netlify",
    };
  }

  const to = (opts.to || opts.quote.customerEmail).trim().toLowerCase();
  if (!to) return { ok: false, error: "No recipient email" };

  const fr = opts.quote.lang === "fr";
  const cur = opts.quote.currency || "cad";
  const loc = fr ? "fr-CA" : "en-CA";
  const receiptUrl = `${siteUrl()}/q/${opts.quote.publicToken}/receipt`;
  const deposit = money(opts.quote.depositAmountCents, cur, loc);
  const total = money(opts.quote.totalCents, cur, loc);
  const remaining = remainingBalanceCents(opts.quote);
  const rem = money(remaining, cur, loc);
  const biz = opts.business.businessName;
  const paidWhen = opts.quote.paidAt
    ? new Date(opts.quote.paidAt).toLocaleString(loc)
    : "";
  const via =
    opts.quote.paidVia === "manual"
      ? fr
        ? "virement / Interac"
        : "bank / Interac"
      : fr
        ? "carte"
        : "card";

  const subject = fr
    ? `Reçu — acompte de ${deposit} · ${opts.quote.title}`
    : `Receipt — deposit of ${deposit} · ${opts.quote.title}`;

  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e4e4e7;padding:32px;">
        <tr><td>
          <p style="margin:0;font-size:11px;letter-spacing:0.12em;color:#a1a1aa;text-transform:uppercase;font-weight:700;">
            ${fr ? "Reçu d'acompte" : "Deposit receipt"}
          </p>
          <h1 style="margin:12px 0 4px;font-size:20px;color:#18181b;">${esc(opts.quote.title)}</h1>
          <p style="margin:0 0 20px;color:#71717a;font-size:14px;">${esc(biz)}</p>
          <p style="margin:0 0 8px;color:#18181b;font-size:14px;">
            <strong>${fr ? "Client :" : "Client:"}</strong> ${esc(opts.quote.customerName)}
          </p>
          <p style="margin:0 0 20px;color:#52525b;font-size:13px;">
            ${fr ? "Acompte reçu" : "Deposit received"}: <strong>${esc(deposit)}</strong>
            ${paidWhen ? ` · ${esc(paidWhen)}` : ""}
            · ${esc(via)}
          </p>
          <table width="100%" style="margin:0 0 24px;border-top:1px solid #f4f4f5;padding-top:12px;">
            <tr>
              <td style="color:#71717a;font-size:13px;padding:4px 0;">${fr ? "Total du projet" : "Project total"}</td>
              <td align="right" style="font-size:13px;font-weight:600;">${esc(total)}</td>
            </tr>
            ${
              remaining > 0
                ? `<tr>
              <td style="color:#71717a;font-size:13px;padding:4px 0;">${fr ? "Solde restant" : "Remaining balance"}</td>
              <td align="right" style="font-size:13px;">${esc(rem)}</td>
            </tr>`
                : ""
            }
          </table>
          <a href="${esc(receiptUrl)}" style="display:block;text-align:center;background:#18181b;color:#fafafa;text-decoration:none;font-weight:700;font-size:14px;padding:12px 18px;border-radius:999px;">
            ${fr ? "Voir le reçu" : "View full receipt"}
          </a>
          <p style="margin:20px 0 0;font-size:11px;color:#a1a1aa;">
            ${fr ? "Généré par DevisPay · devispay.com" : "Generated by DevisPay · devispay.com"}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    const { error } = await resend.emails.send({
      from: fromAddress(),
      to: [to],
      subject,
      html,
      replyTo: opts.business.email || undefined,
    });
    if (error) {
      console.error("[email receipt]", error);
      return { ok: false, error: error.message || "Send failed" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email receipt]", e);
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Send failed",
    };
  }
}
