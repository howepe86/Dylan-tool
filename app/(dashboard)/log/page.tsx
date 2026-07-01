import { ActivityLogForm } from "@/components/dashboard/ActivityLogForm";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthUser } from "@/lib/auth/session";
import { listClients } from "@/lib/db/clients";

export default async function LogActivityPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const clients = await listClients(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Log activity"
        description="Manual entry, optional expense and deal fields, or upload a voice memo."
      />
      <div className="max-w-2xl">
        <ActivityLogForm clients={clients} />
      </div>
    </div>
  );
}
