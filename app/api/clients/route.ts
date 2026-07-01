import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase-server";

const clientSchema = z.object({
  name: z.string().min(1).max(200),
  company: z.string().max(200).optional(),
  email: z.string().email().optional(),
  notes: z.string().max(5000).optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = clientSchema.parse(await request.json());
    const { data, error } = await supabase
      .from("clients")
      .insert({ ...body, user_id: user.id })
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json({ client: data });
  } catch (error) {
    const message =
      error instanceof z.ZodError
        ? error.issues[0]?.message ?? "Invalid input"
        : error instanceof Error
          ? error.message
          : "Failed to create client";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
