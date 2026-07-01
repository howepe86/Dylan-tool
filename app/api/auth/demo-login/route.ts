import { NextResponse } from "next/server";

import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth/demo";
import { seedDemoUserData } from "@/lib/seed/demo-data";
import { createAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase-server";

export async function POST() {
  try {
    const admin = createAdminClient();
    const supabase = await createClient();

    const { data: existing } = await admin.auth.admin.listUsers();
    let demoUser = existing.users.find(
      (u) => u.email?.toLowerCase() === DEMO_EMAIL.toLowerCase()
    );

    if (!demoUser) {
      const { data, error: createError } = await admin.auth.admin.createUser({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "Demo User" },
      });
      if (createError) throw createError;
      demoUser = data.user;
    }

    await seedDemoUserData(demoUser.id);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
    });

    if (signInError) throw signInError;

    return NextResponse.json({ ok: true, email: DEMO_EMAIL });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Demo login failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
