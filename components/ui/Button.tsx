import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonTone = "dark" | "light";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  fullWidth?: boolean;
}

const darkVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-sky-600 text-white hover:bg-sky-500 disabled:bg-sky-600/50",
  secondary:
    "border border-zinc-700 bg-zinc-900 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-50",
  ghost: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50",
};

const lightVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800 disabled:bg-zinc-400",
  secondary:
    "border border-zinc-300 bg-white text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50",
  ghost: "text-zinc-600 hover:bg-zinc-100 disabled:opacity-50",
};

export function Button({
  variant = "primary",
  tone = "dark",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const variantClasses =
    tone === "light" ? lightVariantClasses : darkVariantClasses;

  return (
    <button
      className={`rounded-lg px-6 py-3 text-sm font-semibold shadow-sm ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
