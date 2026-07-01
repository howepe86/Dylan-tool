"use client";

import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { useState } from "react";

export function QuickLogFab() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2" data-quick-fab>
      {expanded ? (
        <>
          <Link
            href="/clients/new"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50"
            onClick={() => setExpanded(false)}
          >
            <Plus className="h-4 w-4" aria-hidden />
            New client
          </Link>
          <Link
            href="/log"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-lg ring-1 ring-slate-200 transition-all hover:bg-slate-50"
            onClick={() => setExpanded(false)}
          >
            <PenLine className="h-4 w-4" aria-hidden />
            Log activity
          </Link>
        </>
      ) : null}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-300 transition-all hover:bg-indigo-500 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        aria-label={expanded ? "Close quick actions" : "Quick actions"}
      >
        <Plus
          className={`h-6 w-6 transition-transform ${expanded ? "rotate-45" : ""}`}
          aria-hidden
        />
      </button>
    </div>
  );
}
