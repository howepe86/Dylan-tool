import Link from "next/link";

import { MarketingLogo } from "@/components/marketing/primitives";
import { createClient } from "@/lib/supabase-server";

export async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <MarketingLogo size="sm" />
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
          <Link href="/#features" className="hover:text-white">
            Features
          </Link>
          <Link href="/#how-it-works" className="hover:text-white">
            How it works
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <MarketingButton href="/dashboard" variant="primary">
              Dashboard
            </MarketingButton>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-300 hover:text-white"
              >
                Log in
              </Link>
              <MarketingButton href="/signup" variant="primary">
                Get started
              </MarketingButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MarketingButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
    >
      {children}
    </Link>
  );
}
