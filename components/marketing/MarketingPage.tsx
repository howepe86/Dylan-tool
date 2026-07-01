import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketingShell } from "@/components/marketing/primitives";
import { SiteHeader } from "@/components/marketing/SiteHeader";

type MarketingPageVariant = "default" | "auth";

const mainClasses: Record<MarketingPageVariant, string> = {
  default: "mx-auto max-w-6xl px-6 py-16 sm:py-20",
  auth: "flex flex-1 items-center justify-center px-6 py-12",
};

export async function MarketingPage({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: MarketingPageVariant;
  className?: string;
}) {
  const isAuth = variant === "auth";

  return (
    <MarketingShell>
      <SiteHeader />
      {isAuth ? (
        <div className="flex min-h-[calc(100dvh-3.5rem)] flex-col">
          <main className={`${mainClasses.auth} ${className}`}>{children}</main>
          <SiteFooter />
        </div>
      ) : (
        <>
          <main className={`${mainClasses.default} ${className}`}>
            {children}
          </main>
          <SiteFooter />
        </>
      )}
    </MarketingShell>
  );
}
