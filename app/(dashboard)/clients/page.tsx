import Link from "next/link";

import { listClients } from "@/lib/db/clients";
import { createClient } from "@/lib/supabase-server";

export default async function ClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const clients = await listClients(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Clients</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Every lunch, dinner, and outing rolls up here.
          </p>
        </div>
        <Link
          href="/clients/new"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
        >
          Add client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center text-sm text-zinc-500">
          No clients yet.{" "}
          <Link href="/clients/new" className="text-sky-400 hover:text-sky-300">
            Add your first client
          </Link>
          .
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 hover:border-zinc-700"
            >
              <h2 className="text-lg font-semibold text-white">{client.name}</h2>
              {client.company ? (
                <p className="text-sm text-zinc-400">{client.company}</p>
              ) : null}
              {client.email ? (
                <p className="mt-2 text-xs text-zinc-500">{client.email}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
