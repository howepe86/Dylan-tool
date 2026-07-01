import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth/session";
import { listClients, listDeals, listInteractions } from "@/lib/db/clients";

export async function GET(request: Request) {
  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const [clients, interactions, deals] = await Promise.all([
    listClients(user.id),
    listInteractions(user.id),
    listDeals(user.id),
  ]);

  const clientMap = new Map(clients.map((c) => [c.id, c]));

  const results = [
    ...clients
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.company?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((c) => ({
        type: "client" as const,
        id: c.id,
        title: c.name,
        subtitle: c.company ?? c.email ?? "Client",
        href: `/clients/${c.id}`,
      })),
    ...interactions
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.notes?.toLowerCase().includes(q) ||
          clientMap.get(i.client_id)?.name.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((i) => ({
        type: "activity" as const,
        id: i.id,
        title: i.title,
        subtitle: `${clientMap.get(i.client_id)?.name ?? "Unknown"} · ${i.activity_type}`,
        href: `/clients/${i.client_id}`,
      })),
    ...deals
      .filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          clientMap.get(d.client_id)?.name.toLowerCase().includes(q)
      )
      .slice(0, 5)
      .map((d) => ({
        type: "deal" as const,
        id: d.id,
        title: d.title,
        subtitle: `${clientMap.get(d.client_id)?.name ?? "Unknown"} · ${d.status}`,
        href: `/deals`,
      })),
  ].slice(0, 12);

  return NextResponse.json({ results });
}
