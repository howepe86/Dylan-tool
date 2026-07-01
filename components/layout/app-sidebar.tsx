"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  Calendar,
  GitCompare,
  LayoutDashboard,
  Lightbulb,
  List,
  Menu,
  PenLine,
  Receipt,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/log", label: "Log activity", icon: PenLine },
  { href: "/activities", label: "Timeline", icon: List },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

function NavLinks({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
              active
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function AppSidebar({
  email,
  mobileOpen,
  onMobileClose,
}: {
  email?: string | null;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onMobileClose?.();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const sidebarContent = (
    <>
      <div className="border-b border-slate-200 px-6 py-5">
        <Link href="/dashboard" className="text-lg font-bold text-slate-900">
          Client<span className="text-indigo-600">Ledger</span>
        </Link>
        {email ? (
          <p className="mt-1 truncate text-xs text-slate-500">{email}</p>
        ) : null}
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
        <NavLinks pathname={pathname} onNavigate={onMobileClose} />
      </nav>
      <form action="/api/auth/signout" method="post" className="border-t border-slate-200 p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Sign out
        </button>
      </form>
    </>
  );

  return (
    <>
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        {sidebarContent}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onMobileClose}
            aria-label="Close menu"
          />
          <aside className="relative flex h-full w-72 flex-col bg-white shadow-xl">
            <button
              type="button"
              onClick={onMobileClose}
              className="absolute right-4 top-5 rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      ) : null}
    </>
  );
}

export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
