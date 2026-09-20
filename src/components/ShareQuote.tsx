"use client";

import { nativeShare, smsHref, whatsappHref } from "@/lib/share";

export function ShareQuote({
  text,
  url,
  title = "DevisPay",
  tone = "light",
}: {
  text: string;
  url: string;
  title?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const ghost = dark
    ? "rounded-full border border-white/25 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
    : "dp-btn-ghost !px-3 !py-2 text-xs";
  const primary = dark
    ? "rounded-full bg-white px-3 py-2 text-xs font-bold text-black"
    : "dp-btn-primary !px-3 !py-2 text-xs";

  return (
    <div className="flex flex-wrap gap-2">
      <a href={smsHref(text)} className={primary}>
        Text
      </a>
      <a href={whatsappHref(text)} target="_blank" rel="noreferrer" className={ghost}>
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => void nativeShare({ title, text, url })}
        className={ghost}
      >
        Share
      </button>
    </div>
  );
}
