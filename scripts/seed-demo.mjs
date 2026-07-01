#!/usr/bin/env node
/**
 * Seeds demo user + sample clients, activities, expenses, and deals.
 * Usage: node scripts/seed-demo.mjs
 * Requires SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in env.
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.DEMO_LOGIN_EMAIL ?? "demo@clientledger.app";
const password = process.env.DEMO_LOGIN_PASSWORD ?? "DemoPass123!";

if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureDemoUser() {
  const { data: list } = await admin.auth.admin.listUsers();
  let user = list.users.find((u) => u.email === email);

  if (!user) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: "Demo User" },
    });
    if (error) throw error;
    user = data.user;
    console.log("Created demo user:", email);
  } else {
    console.log("Demo user exists:", email);
  }

  return user;
}

async function seedData(userId) {
  await admin.from("clients").delete().eq("user_id", userId);

  const clients = [
    {
      name: "Sarah Chen",
      company: "Acme Corp",
      email: "sarah@acme.com",
      notes: "Enterprise renewal; golf contact.",
    },
    {
      name: "Marcus Webb",
      company: "Northwind Logistics",
      email: "marcus@northwind.io",
      notes: "$120k platform implementation in pipeline.",
    },
    {
      name: "Elena Ruiz",
      company: "Brightpath Consulting",
      email: null,
      notes: "Referral from Sarah; advisory retainer.",
    },
  ];

  const insertedClients = [];
  for (const c of clients) {
    const { data, error } = await admin
      .from("clients")
      .insert({ ...c, user_id: userId })
      .select("*")
      .single();
    if (error) throw error;
    insertedClients.push(data);
  }

  const [sarah, marcus, elena] = insertedClients;
  const year = new Date().getFullYear();
  const qStart = new Date(year, Math.floor(new Date().getMonth() / 3) * 3, 15);

  const activities = [
    {
      client_id: sarah.id,
      title: "Strategy lunch",
      activity_type: "lunch",
      duration_minutes: 90,
      occurred_at: new Date(qStart.getTime() + 86400000 * 2).toISOString(),
      notes: "Discussed renewal terms.",
      expense: { amount_cents: 14500, category: "meals", description: "Lunch for two" },
    },
    {
      client_id: sarah.id,
      title: "Golf outing",
      activity_type: "golf",
      duration_minutes: 240,
      occurred_at: new Date(qStart.getTime() + 86400000 * 14).toISOString(),
      notes: "Relationship building.",
      expense: { amount_cents: 32000, category: "entertainment", description: "Green fees + cart" },
    },
    {
      client_id: marcus.id,
      title: "Discovery dinner",
      activity_type: "dinner",
      duration_minutes: 120,
      occurred_at: new Date(qStart.getTime() + 86400000 * 5).toISOString(),
      expense: { amount_cents: 21000, category: "meals", description: "Client dinner" },
    },
    {
      client_id: marcus.id,
      title: "Platform demo call",
      activity_type: "call",
      duration_minutes: 45,
      occurred_at: new Date(qStart.getTime() + 86400000 * 10).toISOString(),
    },
    {
      client_id: elena.id,
      title: "Intro coffee",
      activity_type: "meeting",
      duration_minutes: 60,
      occurred_at: new Date(qStart.getTime() + 86400000 * 7).toISOString(),
      expense: { amount_cents: 1800, category: "meals", description: "Coffee meeting" },
    },
  ];

  for (const act of activities) {
    const { expense, ...interaction } = act;
    const { data: row, error } = await admin
      .from("interactions")
      .insert({
        ...interaction,
        user_id: userId,
        input_source: "manual",
      })
      .select("*")
      .single();
    if (error) throw error;

    if (expense) {
      await admin.from("expenses").insert({
        ...expense,
        user_id: userId,
        client_id: act.client_id,
        interaction_id: row.id,
        incurred_at: act.occurred_at,
        currency: "USD",
      });
    }
  }

  const deals = [
    {
      client_id: sarah.id,
      title: "Annual support renewal",
      amount_cents: 8500000,
      status: "closed",
      closed_at: new Date(qStart.getTime() + 86400000 * 20).toISOString(),
    },
    {
      client_id: marcus.id,
      title: "Platform implementation",
      amount_cents: 12000000,
      status: "pipeline",
    },
    {
      client_id: elena.id,
      title: "Advisory retainer",
      amount_cents: 3600000,
      status: "pipeline",
    },
  ];

  for (const deal of deals) {
    const { error } = await admin.from("deals").insert({
      ...deal,
      user_id: userId,
      currency: "USD",
    });
    if (error) throw error;
  }

  console.log("Seeded", insertedClients.length, "clients,", activities.length, "activities,", deals.length, "deals");
}

const user = await ensureDemoUser();
await seedData(user.id);
console.log("\nDemo credentials:");
console.log("  Email:", email);
console.log("  Password:", password);
