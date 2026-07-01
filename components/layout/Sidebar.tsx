import Link from "next/link";

import { createClient } from "@/lib/supabase-server";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/clients", label: "Clients" },
  { href: "/log", label: "Log activity" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export async function Sidebar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <div className="border-b border-zinc-800 px-6 py-5">
        <Link href="/dashboard" className="text-lg font-semibold text-white">
          Client<span className="text-zinc-500">Ledger</span>
        </Link>
        <p className="mt-1 truncate text-xs text-zinc-500">{user?.email}</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900 hover:text-white"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action="/api/auth/signout" method="post" className="border-t border-zinc-800 p-4">
        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white"
        >
          Sign out
        </button>
      </form>
    </aside>
  );
}
