import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSessionUser } from "@/lib/auth/session";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-bold text-slate-900">
          Client<span className="text-indigo-600">Ledger</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link href="/#use-cases" className="transition-colors hover:text-slate-900">
            Use cases
          </Link>
          <Link href="/#features" className="transition-colors hover:text-slate-900">
            Platform
          </Link>
          <Link href="/#case-studies" className="transition-colors hover:text-slate-900">
            Results
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
                className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 sm:block"
              >
                Log in
              </Link>
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Try demo</Link>
              </Button>
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
