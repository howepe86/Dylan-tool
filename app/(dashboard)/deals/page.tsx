import { KanbanPipeline } from "@/components/dashboard/KanbanPipeline";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthUser } from "@/lib/auth/session";
import { listClients, listDeals } from "@/lib/db/clients";

export default async function DealsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [deals, clients] = await Promise.all([
    listDeals(user.id),
    listClients(user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Deal Pipeline"
        description="Manage your sales pipeline with drag-and-drop kanban board."
      />
      <KanbanPipeline deals={deals} clients={clients} />
    </div>
  );
}
