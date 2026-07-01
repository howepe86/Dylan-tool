import { NextResponse } from "next/server";
import { z } from "zod";

import { getAuthUser, getDataClient } from "@/lib/auth/session";

const activitySchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1).max(300),
  notes: z.string().max(5000).optional(),
  activityType: z.enum([
    "lunch",
    "dinner",
    "golf",
    "meeting",
    "call",
    "email",
    "other",
  ]),
  occurredAt: z.string().datetime(),
  durationMinutes: z.number().int().min(0).max(24 * 60),
  inputSource: z.enum(["manual", "calendar", "voice"]).default("manual"),
  voiceMemoUrl: z.string().url().optional(),
  expense: z
    .object({
      amountCents: z.number().int().min(0),
      category: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
    })
    .optional(),
  deal: z
    .object({
      title: z.string().min(1).max(300),
      amountCents: z.number().int().min(0),
      status: z.enum(["pipeline", "closed", "lost"]),
    })
    .optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = activitySchema.parse(await request.json());
    const supabase = await getDataClient();

    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("id")
      .eq("id", body.clientId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (clientError) throw clientError;
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const { data: interaction, error: interactionError } = await supabase
      .from("interactions")
      .insert({
        user_id: user.id,
        client_id: body.clientId,
        title: body.title,
        notes: body.notes ?? null,
        activity_type: body.activityType,
        occurred_at: body.occurredAt,
        duration_minutes: body.durationMinutes,
        input_source: body.inputSource,
        voice_memo_url: body.voiceMemoUrl ?? null,
      })
      .select("*")
      .single();

    if (interactionError) throw interactionError;

    let expense = null;
    if (body.expense) {
      const { data, error } = await supabase
        .from("expenses")
        .insert({
          user_id: user.id,
          client_id: body.clientId,
          interaction_id: interaction.id,
          amount_cents: body.expense.amountCents,
          category: body.expense.category,
          description: body.expense.description ?? null,
          incurred_at: body.occurredAt,
        })
        .select("*")
        .single();

      if (error) throw error;
      expense = data;
    }

    let deal = null;
    if (body.deal) {
      const { data, error } = await supabase
        .from("deals")
        .insert({
          user_id: user.id,
          client_id: body.clientId,
          title: body.deal.title,
          amount_cents: body.deal.amountCents,
          status: body.deal.status,
          closed_at: body.deal.status === "closed" ? body.occurredAt : null,
        })
        .select("*")
        .single();

      if (error) throw error;
      deal = data;
    }

    return NextResponse.json({ interaction, expense, deal });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message ?? "Invalid input"
        : error instanceof Error
          ? error.message
          : "Failed to save activity";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
