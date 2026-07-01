import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser } from "@/lib/auth/session";
import { createExpense, listExpenses } from "@/lib/db/clients";

const schema = z.object({
  clientId: z.string().uuid(),
  interactionId: z.string().uuid().optional(),
  amountCents: z.number().int().min(0),
  category: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  incurredAt: z.string().datetime(),
});

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const expenses = await listExpenses(user.id);
  return NextResponse.json({ expenses });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = schema.parse(await request.json());
    const expense = await createExpense(user.id, {
      client_id: body.clientId,
      interaction_id: body.interactionId ?? null,
      amount_cents: body.amountCents,
      currency: "USD",
      category: body.category,
      description: body.description ?? null,
      incurred_at: body.incurredAt,
    });

    return NextResponse.json({ expense });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create expense";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
