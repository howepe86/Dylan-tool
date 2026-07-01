import type { InputHTMLAttributes } from "react";

interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <textarea
        id={inputId}
        className={`min-h-[120px] w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
