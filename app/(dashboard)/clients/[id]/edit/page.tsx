import Link from "next/link";
import { notFound } from "next/navigation";

import { EditClientForm } from "@/components/dashboard/EditClientForm";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthUser } from "@/lib/auth/session";
import { getClient } from "@/lib/db/clients";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) return null;

  const client = await getClient(user.id, id);
  if (!client) notFound();

  return (
    <div className="space-y-8">
      <Link
        href={`/clients/${id}`}
        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
      >
        ← Back to client
      </Link>
      <PageHeader title="Edit client" description={client.name} />
      <EditClientForm client={client} />
    </div>
  );
}
