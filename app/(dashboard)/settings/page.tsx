import { Button } from "@/components/ui/Button";
import { GOOGLE_CLIENT_ID } from "@/lib/env";

export default function SettingsPage() {
  const calendarEnabled = Boolean(GOOGLE_CLIENT_ID);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Connect integrations and manage your workspace.
        </p>
      </div>

      <section className="max-w-xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white">Google Calendar</h2>
        <p className="text-sm text-zinc-400">
          Sync client meetings automatically. OAuth wiring is scaffolded — add{" "}
          <code className="text-zinc-300">GOOGLE_CLIENT_ID</code> and{" "}
          <code className="text-zinc-300">GOOGLE_CLIENT_SECRET</code> to enable.
        </p>
        <Button disabled={!calendarEnabled} variant="secondary">
          {calendarEnabled ? "Connect Google Calendar" : "Coming soon — add Google OAuth keys"}
        </Button>
      </section>

      <section className="max-w-xl space-y-3 rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-lg font-semibold text-white">Voice memos</h2>
        <p className="text-sm text-zinc-400">
          Voice files upload to Supabase Storage today. Automatic transcription
          (Whisper or similar) is planned for phase 2.
        </p>
      </section>
    </div>
  );
}
