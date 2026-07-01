import Link from "next/link";

import { ClientsGrid } from "@/components/dashboard/ClientsGrid";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { getAuthUser } from "@/lib/auth/session";
import {
  listClients,
  listDeals,
  listExpenses,
  listInteractions,
} from "@/lib/db/clients";
import { buildClientHealthScores } from "@/lib/insights";
import { Users } from "lucide-react";

export default async function ClientsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const year = new Date().getFullYear();
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;

  const [clients, interactions, expenses, deals] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
    listExpenses(user.id),
    listDeals(user.id),
  ]);

  const healthScores = buildClientHealthScores(
    clients,
    interactions,
    expenses,
    deals,
    year,
    quarter
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description={`${clients.length} relationships tracked · sorted by health, revenue, or last contact`}
        actions={
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href="/compare">Compare</Link>
            </Button>
            <Button asChild>
              <Link href="/clients/new">Add client</Link>
            </Button>
          </div>
        }
      />

      {clients.length === 0 ? (
        <EmptyState
          title="No clients yet"
          description="Add the clients you entertain and pursue to start building ROI reports."
          actionLabel="Add your first client"
          actionHref="/clients/new"
          icon={Users}
        />
      ) : (
        <ClientsGrid clients={clients} healthScores={healthScores} />
      )}
    </div>
  );
}
