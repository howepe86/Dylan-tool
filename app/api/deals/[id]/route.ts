import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth/session";
import { deleteDeal, updateDeal } from "@/lib/db/clients";

const schema = z.object({
  title: z.string().min(1).max(300).optional(),
  amountCents: z.number().int().min(0).optional(),
  status: z.enum(["pipeline", "closed", "lost"]).optional(),
  closedAt: z.string().datetime().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = schema.parse(await request.json());

    const deal = await updateDeal(user.id, id, {
      title: body.title,
      amount_cents: body.amountCents,
      status: body.status,
      closed_at: body.closedAt,
      notes: body.notes,
    });

    return NextResponse.json({ deal });
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
  await deleteDeal(user.id, id);
  return NextResponse.json({ ok: true });
}
