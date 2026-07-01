import Link from "next/link";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import {
  CheckList,
  MarketingButton,
  SectionHeader,
} from "@/components/marketing/primitives";
import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <MarketingPage variant="default" className="space-y-24">
      <section className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-400">
          Client relationship ROI
        </p>
        <h1 className="mt-4 text-4xl font-semibold leading-heading text-white sm:text-5xl">
          Know what client time costs — and what it earns
        </h1>
        <p className="mt-6 text-lg leading-body text-zinc-400">
          Log lunches, dinners, golf outings, and meetings from your calendar,
          a quick text note, or a voice memo. See expenses, time invested, and
          revenue closed by client, quarter, and year.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <MarketingButton href="/signup">Start free</MarketingButton>
          <MarketingButton href="/login" variant="secondary">
            Log in
          </MarketingButton>
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
          <div
            key={feature.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
          >
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-zinc-400">{feature.body}</p>
          </div>
        ))}
      </section>

      <section id="how-it-works" className="space-y-8">
        <SectionHeader
          eyebrow="How it works"
          title="From golf outing to closed deal"
          description="Every touchpoint rolls up into a client P&L you can actually use."
        />
        <div className="mx-auto max-w-xl">
          <CheckList
            items={[
              "Add clients you are actively pursuing or serving",
              "Log time and expenses per interaction (lunch, dinner, golf, calls)",
              "Record deal value when revenue closes",
              "Review quarterly and yearly reports by client",
            ]}
          />
        </div>
        <div className="text-center">
          <Link href="/signup" className="text-sm text-sky-400 hover:text-sky-300">
            Create your account →
          </Link>
        </div>
      </section>
    </MarketingPage>
  );
}
