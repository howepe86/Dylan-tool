import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser, getDataClient } from "@/lib/auth/session";
import { deleteClient, getClient, updateClient } from "@/lib/db/clients";

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  company: z.string().max(200).nullable().optional(),
  email: z.string().email().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await getClient(user.id, id);
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ client });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    const client = await updateClient(user.id, id, body);
    return NextResponse.json({ client });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteClient(user.id, id);
  return NextResponse.json({ ok: true });
}
