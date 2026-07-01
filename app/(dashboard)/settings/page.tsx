import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GOOGLE_CLIENT_ID } from "@/lib/env";

export default function SettingsPage() {
  const calendarEnabled = Boolean(GOOGLE_CLIENT_ID);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Connect integrations and manage your workspace."
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Google Calendar</CardTitle>
          <CardDescription>
            Sync client meetings automatically. Add Google OAuth keys to enable.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled={!calendarEnabled} variant="outline">
            {calendarEnabled
              ? "Connect Google Calendar"
              : "Add GOOGLE_CLIENT_ID to enable"}
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Voice memos</CardTitle>
          <CardDescription>
            Audio uploads go to Supabase Storage. Transcription is planned for
            phase 2.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Legal &amp; accessibility</CardTitle>
          <CardDescription>
            Policies governing use of ClientLedger and our accessibility commitment.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/terms">Terms of Service</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/privacy">Privacy Policy</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/accessibility">Accessibility</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
