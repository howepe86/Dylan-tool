export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "info";
}) {
  const tones = {
    neutral: "border-zinc-700 bg-zinc-900 text-zinc-300",
    success: "border-emerald-800 bg-emerald-950 text-emerald-400",
    warning: "border-amber-800 bg-amber-950 text-amber-400",
    info: "border-sky-800 bg-sky-950 text-sky-400",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
