import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  id,
  options,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label htmlFor={selectId} className="block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm text-white focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/20 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-zinc-900">
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
