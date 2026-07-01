import type { ReactNode } from "react";

import { MarketingPage } from "@/components/marketing/MarketingPage";

export function LegalDocument({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <MarketingPage>
      <article className="mx-auto max-w-3xl py-8">
        <header className="mb-10 border-b border-slate-200 pb-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: {lastUpdated}</p>
        </header>
        <div className="legal-prose space-y-8 text-slate-700">{children}</div>
      </article>
    </MarketingPage>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

LegalDocument.Section = Section;
