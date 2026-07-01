import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth/session";
import { createDeal, listDeals } from "@/lib/db/clients";
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
  clientId: z.string().uuid(),
  title: z.string().min(1).max(300),
  amountCents: z.number().int().min(0),
  status: z.enum(["lead", "qualified", "proposal", "negotiation", "pipeline", "closed", "lost"]).default("lead"),
  closedAt: z.string().datetime().optional(),
  notes: z.string().max(5000).optional(),
  probabilityPercent: z.number().int().min(0).max(100).default(10),
  expectedCloseDate: z.string().date().optional(),
});

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const deals = await listDeals(user.id);
  return NextResponse.json({ deals });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.parse(await request.json());
    const deal = await createDeal(user.id, {
      client_id: body.clientId,
      title: body.title,
      amount_cents: body.amountCents,
      currency: "USD",
      status: body.status,
      closed_at: body.status === "closed" ? (body.closedAt ?? new Date().toISOString()) : null,
      notes: body.notes ?? null,
      stage_position: getStagePosition(body.status),
      probability_percent: body.probabilityPercent,
      expected_close_date: body.expectedCloseDate ?? null,
      last_activity_date: new Date().toISOString(),
    });

    return NextResponse.json({ deal });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create deal";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
