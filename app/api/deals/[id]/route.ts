import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth/session";
import { deleteDeal, updateDeal } from "@/lib/db/clients";
import type { DealStatus } from "@/types/database";

function getStagePosition(status: DealStatus): number {
  const positions: Record<DealStatus, number> = {
    lead: 1,
    qualified: 2,
    proposal: 3,
    negotiation: 4,
    pipeline: 2, // backward compatibility
    closed: 5,
    lost: 6,
  };
  return positions[status];
}

const schema = z.object({
  title: z.string().min(1).max(300).optional(),
  amountCents: z.number().int().min(0).optional(),
  status: z.enum(["lead", "qualified", "proposal", "negotiation", "pipeline", "closed", "lost"]).optional(),
  closedAt: z.string().datetime().nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  probabilityPercent: z.number().int().min(0).max(100).optional(),
  expectedCloseDate: z.string().date().nullable().optional(),
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

    const updateData: any = {
      title: body.title,
      amount_cents: body.amountCents,
      status: body.status,
      closed_at: body.closedAt,
      notes: body.notes,
      probability_percent: body.probabilityPercent,
      expected_close_date: body.expectedCloseDate,
    };

    // Update stage position if status changed
    if (body.status) {
      updateData.stage_position = getStagePosition(body.status);
    }

    const deal = await updateDeal(user.id, id, updateData);

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
