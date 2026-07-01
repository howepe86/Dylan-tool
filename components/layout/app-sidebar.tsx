"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Briefcase,
  LayoutDashboard,
  PenLine,
  Receipt,
  Settings,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/log", label: "Log activity", icon: PenLine },
  { href: "/deals", label: "Deals", icon: Briefcase },
  { href: "/expenses", label: "Expenses", icon: Receipt },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ email }: { email?: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-6 py-5">
        <Link href="/dashboard" className="text-lg font-semibold text-slate-900">
          Client<span className="text-indigo-600">Ledger</span>
        </Link>
        {email ? (
          <p className="mt-1 truncate text-xs text-slate-500">{email}</p>
        ) : null}
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <form action="/api/auth/signout" method="post" className="border-t border-slate-200 p-3">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
