"use client";

import { useState } from "react";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
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
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <AppSidebar
        email={email}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          onSearchClick={() => setOpen(true)}
          periodLabel={periodLabel}
        />
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0" id="main-content">
          <div className="mx-auto max-w-content px-4 py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
      <MobileBottomNav />
      <QuickLogFab />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
