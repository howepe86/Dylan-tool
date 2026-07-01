import Link from "next/link";
import { Check } from "lucide-react";

import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "during beta",
    description: "For solo consultants tracking a handful of key accounts.",
    features: [
      "Unlimited clients & activities",
      "Quarterly ROI reports",
      "Expense & deal tracking",
      "Demo data on signup",
    ],
    cta: "Start free",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For AEs and founders who entertain clients weekly.",
    features: [
      "Everything in Starter",
      "Receipt OCR & smart categorization",
      "Advanced analytics & compare",
      "CSV & tax-ready exports",
      "Calendar sync (coming soon)",
    ],
    cta: "Join waitlist",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$79",
    period: "/month",
    description: "For small firms sharing client relationship data.",
    features: [
      "Everything in Pro",
      "Multi-user workspace",
      "Shared pipeline board",
      "Admin controls",
      "Priority support",
    ],
    cta: "Contact us",
    href: "mailto:hello@clientledger.app",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-content px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Simple pricing for relationship ROI
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Start free during beta. Upgrade when you need OCR, team features, or calendar sync.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "border-indigo-200 shadow-lg shadow-indigo-100 ring-1 ring-indigo-600"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-3xl font-bold text-slate-900">
                  {plan.price}
                  <span className="text-base font-normal text-slate-500">{plan.period}</span>
                </p>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-xl text-center text-sm text-slate-500">
          All plans include Supabase-backed auth, row-level security, and encrypted sessions.
          No credit card required for Starter.
        </p>
      </section>
    </MarketingPage>
  );
}
