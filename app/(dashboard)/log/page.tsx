import { SmartActivityLogForm } from "@/components/dashboard/SmartActivityLogForm";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthUser } from "@/lib/auth/session";
import { listClients, listInteractions } from "@/lib/db/clients";

export default async function LogActivityPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [clients, interactions] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Activity Log"
        description="AI-powered suggestions for activity types, durations, and expenses based on your patterns."
      />
      <div className="max-w-3xl">
        <SmartActivityLogForm clients={clients} existingActivities={interactions} />
      </div>
    </div>
  );
}
