import Link from "next/link";
import { Calendar, Lock, Mic, Plug, Shield, Users } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GOOGLE_CLIENT_ID } from "@/lib/env";

const integrations = [
  {
    name: "Google Calendar",
    description: "Import client meetings with context into your activity timeline.",
    icon: Calendar,
    status: GOOGLE_CLIENT_ID ? "available" : "needs_config",
    action: "Connect",
  },
  {
    name: "Voice memos",
    description: "Upload audio recaps from your phone. Transcription coming soon.",
    icon: Mic,
    status: "active",
    action: "Use on Log page",
    href: "/log",
  },
  {
    name: "CSV & tax export",
    description: "Download quarterly reports and tax-deductible expense summaries.",
    icon: Plug,
    status: "active",
    action: "Go to Reports",
    href: "/reports",
  },
  {
    name: "Team workspace",
    description: "Share clients and pipeline with your firm. On the roadmap.",
    icon: Users,
    status: "coming_soon",
    action: "Join waitlist",
    href: "/pricing",
  },
] as const;

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Integrations, security, and compliance tools."
      />

      <Card className="max-w-2xl border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Shield className="h-4 w-4 text-emerald-600" aria-hidden />
            Security &amp; privacy
          </CardTitle>
          <CardDescription>
            Your data is isolated per account with Supabase row-level security. Sessions use
            HTTP-only cookies. Demo accounts are public — don&apos;t enter real client secrets.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/terms">Terms of Service</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Integrations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="h-4 w-4 text-indigo-600" aria-hidden />
                    {item.name}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {"href" in item && item.href ? (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={item.href}>{item.action}</Link>
                    </Button>
                  ) : item.status === "available" ? (
                    <Button variant="outline" size="sm">
                      {item.action}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled>
                      {item.status === "needs_config"
                        ? "Add GOOGLE_CLIENT_ID"
                        : item.status === "coming_soon"
                          ? "Coming soon"
                          : item.action}
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-slate-600" aria-hidden />
            Compliance &amp; tax exports
          </CardTitle>
          <CardDescription>
            Export tax-deductible client entertainment expenses by category for your accountant.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <a
              href={`/api/reports/tax-export?year=${new Date().getFullYear()}&quarter=${Math.ceil((new Date().getMonth() + 1) / 3)}`}
            >
              Download tax summary (CSV)
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/accessibility">Accessibility</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
