import Link from "next/link";

export function BrandMark({
  href = "/",
  size = "md",
}: {
  href?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: { mark: "h-7 w-7 text-[11px]", text: "text-base" },
    md: { mark: "h-8 w-8 text-xs", text: "text-lg" },
    lg: { mark: "h-10 w-10 text-sm", text: "text-xl" },
  }[size];

  return (
    <Link href={href} className="group inline-flex items-center gap-2.5">
      <span
        className={`${sizes.mark} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 font-black text-black shadow-[0_0_24px_-4px_rgba(245,185,66,0.55)] ring-1 ring-white/20 transition group-hover:scale-[1.03]`}
      >
        D
      </span>
      <span
        className={`${sizes.text} font-bold tracking-tight text-white`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        Devis<span className="text-amber-400">Pay</span>
      </span>
    </Link>
  );
}
