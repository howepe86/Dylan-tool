import { CalendarPageClient } from "@/components/dashboard/ActivityCalendar";
import { getAuthUser } from "@/lib/auth/session";
import { listClients, listInteractions } from "@/lib/db/clients";

export default async function CalendarPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [clients, interactions] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
  ]);

  return <CalendarPageClient interactions={interactions} clients={clients} />;
}
