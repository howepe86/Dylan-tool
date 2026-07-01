"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Loader2,
  PenLine,
  Search,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

type SearchResult = {
  type: "client" | "activity" | "deal";
  id: string;
  title: string;
  subtitle: string;
  href: string;
};

const typeIcons = {
  client: Users,
  activity: PenLine,
  deal: Briefcase,
};

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results ?? []);
      setSelected(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else {
          document.dispatchEvent(new CustomEvent("open-command-palette"));
        }
      }
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === "Enter" && results[selected]) {
        router.push(results[selected].href);
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, results, selected, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close search"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-slate-100 px-4">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients, activities, deals…"
            className="flex-1 bg-transparent py-4 text-sm outline-none placeholder:text-slate-400"
          />
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden />
          ) : (
            <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-400 sm:inline">
              esc
            </kbd>
          )}
        </div>
        {results.length > 0 ? (
          <ul className="max-h-72 overflow-y-auto py-2">
            {results.map((result, i) => {
              const Icon = typeIcons[result.type];
              return (
                <li key={`${result.type}-${result.id}`}>
                  <button
                    type="button"
                    onClick={() => {
                      router.push(result.href);
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors",
                      i === selected ? "bg-indigo-50 text-indigo-900" : "hover:bg-slate-50"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{result.title}</p>
                      <p className="truncate text-xs text-slate-500">{result.subtitle}</p>
                    </div>
                    <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-xs capitalize text-slate-500">
                      {result.type}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : query && !loading ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">No results found</p>
        ) : !query ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">
            <p>Type to search across your workspace</p>
            <p className="mt-2 text-xs text-slate-400">
              <kbd className="rounded border px-1">⌘K</kbd> to toggle anytime
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    document.addEventListener("open-command-palette", onOpen);
    return () => document.removeEventListener("open-command-palette", onOpen);
  }, []);

  return { open, setOpen };
}
