"use client";

import Link from "next/link";
import { PenLine, Search } from "lucide-react";

import { MobileMenuButton } from "@/components/layout/app-sidebar";
import { cn } from "@/lib/utils";

export function TopBar({
  onMenuClick,
  onSearchClick,
  periodLabel,
}: {
  onMenuClick: () => void;
  onSearchClick: () => void;
  periodLabel?: string;
}) {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl lg:px-8">
      <MobileMenuButton onClick={onMenuClick} />

      <button
        type="button"
        onClick={onSearchClick}
        className={cn(
          "flex flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500",
          "transition-colors hover:border-indigo-200 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
        )}
      >
        <Search className="h-4 w-4 shrink-0" aria-hidden />
        <span className="hidden sm:inline">Search clients, activities, deals…</span>
        <span className="sm:hidden">Search…</span>
        <kbd className="ml-auto hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-xs text-slate-400 md:inline">
          ⌘K
        </kbd>
      </button>

      {periodLabel ? (
        <span className="hidden shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 sm:inline">
          {periodLabel}
        </span>
      ) : null}

      <Link
        href="/log"
        className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
      >
        <PenLine className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Log</span>
      </Link>
    </header>
  );
}
