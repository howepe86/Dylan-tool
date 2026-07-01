import { ActivityTimelinePage } from "@/components/dashboard/ActivityTimeline";
import { getAuthUser } from "@/lib/auth/session";
import { listClients, listInteractions } from "@/lib/db/clients";

export default async function ActivitiesPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [clients, interactions] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
  ]);

  return <ActivityTimelinePage interactions={interactions} clients={clients} />;
}
