"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/layout/command-palette";
import { QuickLogFab } from "@/components/layout/quick-log-fab";
import { TopBar } from "@/components/layout/top-bar";

export function DashboardShell({
  email,
  periodLabel,
  children,
}: {
  email?: string | null;
  periodLabel?: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { open, setOpen } = useCommandPalette();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar
        email={email}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setOpen(true)}
          periodLabel={periodLabel}
        />
        <main className="flex-1 overflow-auto" id="main-content">
          <div className="mx-auto max-w-content px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <QuickLogFab />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
