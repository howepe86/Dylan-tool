import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Client<span className="text-indigo-600">Ledger</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <Link href="/#features" className="hover:text-slate-900">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-slate-900">
            How it works
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Log in
              </Link>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
