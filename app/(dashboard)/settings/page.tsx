import { GOOGLE_CLIENT_ID } from "@/lib/env";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
    </div>
  );
}
