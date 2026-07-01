import Link from "next/link";
import type { ReactNode } from "react";

/** Marketing design system — flat dark shell (Vercel/Linear-style). */
export function MarketingShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
      {children}
    </div>
  );
}

export function MarketingCard({
  children,
  className = "",
  highlighted = false,
}: {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlighted
          ? "border-zinc-700 bg-zinc-900"
          : "border-zinc-800 bg-zinc-950"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function MarketingLogo({ size = "md" }: { size?: "sm" | "md" }) {
  const box =
    size === "sm" ? "h-7 w-7 text-sm rounded-lg" : "h-9 w-9 text-lg rounded-xl";
  const text = size === "sm" ? "text-lg" : "text-2xl";
  return (
    <>
      <span
        className={`flex shrink-0 items-center justify-center border border-zinc-700 bg-zinc-900 font-bold text-zinc-100 ${box}`}
      >
        C
      </span>
      <span className={`font-bold leading-heading ${text}`}>
        <span className="text-zinc-100">Client</span>
        <span className="text-zinc-500">Ledger</span>
      </span>
    </>
  );
}

export function MarketingButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
}) {
  const variants = {
    primary: "bg-sky-600 text-white hover:bg-sky-500",
    secondary:
      "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800",
    ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`font-semibold leading-heading text-zinc-100 ${eyebrow ? "mt-4" : ""} text-2xl sm:text-3xl lg:text-4xl`}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-body text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-4 text-sm leading-body text-zinc-300">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-800 text-xs text-zinc-300">
            ✓
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
