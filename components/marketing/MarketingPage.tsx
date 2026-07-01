import type { ReactNode } from "react";

import { SiteFooter } from "@/components/marketing/SiteFooter";
import { SiteHeader } from "@/components/marketing/SiteHeader";

type MarketingPageVariant = "default" | "auth";

export async function MarketingPage({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: MarketingPageVariant;
}) {
  const isAuth = variant === "auth";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <SiteHeader />
      <main
        className={
          isAuth
            ? "gradient-mesh relative flex flex-1 items-center justify-center px-6 py-12"
            : "mx-auto w-full max-w-content flex-1 px-6 lg:px-8"
        }
      >
        {children}
      </main>
      {!isAuth ? <SiteFooter /> : null}
    </div>
  );
}
