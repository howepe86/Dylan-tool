import { NextResponse } from "next/server";

import {
  isDevAuthBypassEnabled,
} from "@/lib/auth/dev-bypass";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  if (!isDevAuthBypassEnabled()) {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const email = process.env.DEV_LOGIN_EMAIL;
  const password = process.env.DEV_LOGIN_PASSWORD;

  if (email && password) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ ok: true });
}
