import Link from "next/link";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSessionUser } from "@/lib/auth/session";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <MarketingPage>
      <div className="space-y-20">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-600">
            Client relationship ROI
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Know what client time costs — and what it earns
          </h1>
          <p className="mt-6 text-lg text-slate-600">
            Log lunches, dinners, golf outings, and meetings. See expenses, time
            invested, and revenue closed by client, quarter, and year.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/signup">Start free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Calendar or manual",
              body: "Connect Google Calendar or log activities by text or voice memo.",
            },
            {
              title: "Expense tracking",
              body: "Attach meal, travel, and entertainment costs to each client interaction.",
            },
            {
              title: "Quarterly ROI",
              body: "Compare spend and hours against pipeline and closed revenue.",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{feature.body}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="how-it-works" className="mx-auto max-w-xl space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-900">
              From golf outing to closed deal
            </h2>
            <p className="mt-2 text-slate-600">
              Every touchpoint rolls up into a client P&amp;L you can actually use.
            </p>
          </div>
          <ul className="space-y-4">
            {[
              "Add clients you are actively pursuing or serving",
              "Log time and expenses per interaction",
              "Record deal value when revenue closes",
              "Review quarterly and yearly reports by client",
            ].map((item) => (
              <li key={item} className="flex gap-3 text-sm text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </MarketingPage>
  );
}
