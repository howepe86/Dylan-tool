import Link from "next/link";

import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthUser } from "@/lib/auth/session";
import { listClients } from "@/lib/db/clients";
import { Users } from "lucide-react";

export default async function ClientsPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const clients = await listClients(user.id);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="Track time, expenses, and revenue for each relationship."
        actions={
          <Button asChild>
            <Link href="/clients/new">Add client</Link>
          </Button>
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {client.name}
                  </h2>
                  {client.company ? (
                    <p className="mt-1 text-sm text-slate-500">{client.company}</p>
                  ) : null}
                  {client.email ? (
                    <p className="mt-3 text-xs text-slate-400">{client.email}</p>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
