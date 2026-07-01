import { createAdminClient } from "@/lib/supabase-admin";

function daysAgo(n: number, hour = 12): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

async function clearUserData(userId: string) {
  const admin = createAdminClient();
  await admin.from("expenses").delete().eq("user_id", userId);
  await admin.from("interactions").delete().eq("user_id", userId);
  await admin.from("deals").delete().eq("user_id", userId);
  await admin.from("clients").delete().eq("user_id", userId);
}

export async function seedDemoUserData(
  userId: string,
  options?: { force?: boolean }
) {
  const admin = createAdminClient();

  const { count } = await admin
    .from("clients")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (count && count > 0 && !options?.force) return false;

  if (count && count > 0) {
    await clearUserData(userId);
  }

  const clients = [
    {
      name: "Sarah Chen",
      company: "Acme Corp",
      email: "sarah@acme.com",
      notes: "Enterprise renewal champion. Golf partner.",
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
      email: "elena@brightpath.co",
      notes: "Referral from Sarah; advisory retainer.",
    },
    {
      name: "James Park",
      company: "Vertex Analytics",
      email: "jpark@vertex.io",
      notes: "Data platform upsell opportunity.",
    },
    {
      name: "Diana Torres",
      company: "Redwood Partners",
      email: "diana@redwood.vc",
      notes: "Portfolio company intros; quarterly check-ins.",
    },
    {
      name: "Alex Kim",
      company: "SwiftScale",
      email: "alex@swiftscale.com",
      notes: "PLG conversion — high product usage.",
    },
    {
      name: "Priya Patel",
      company: "Horizon Media",
      email: "priya@horizonmedia.com",
      notes: "Agency partnership; events sponsor.",
    },
    {
      name: "Tom O'Brien",
      company: "Legacy Systems",
      email: "tom@legacysys.com",
      notes: "Dormant account — needs re-engagement.",
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

  const [sarah, marcus, elena, james, diana, alex, priya, tom] = insertedClients;

  type SeedActivity = {
    client_id: string;
    title: string;
    activity_type: string;
    duration_minutes: number;
    occurred_at: string;
    notes?: string;
    expense?: { amount_cents: number; category: string; description: string };
  };

  const activities: SeedActivity[] = [
    // This week — visible on calendar today
    { client_id: sarah.id, title: "Q2 check-in lunch", activity_type: "lunch", duration_minutes: 90, occurred_at: daysAgo(0), notes: "Renewal discussion.", expense: { amount_cents: 16800, category: "meals", description: "Business lunch" } },
    { client_id: marcus.id, title: "Contract review call", activity_type: "call", duration_minutes: 45, occurred_at: daysAgo(1), notes: "Final terms for platform deal." },
    { client_id: alex.id, title: "Product walkthrough", activity_type: "meeting", duration_minutes: 60, occurred_at: daysAgo(2), notes: "Upsell to enterprise tier." },
    { client_id: james.id, title: "Executive dinner", activity_type: "dinner", duration_minutes: 120, occurred_at: daysAgo(3), expense: { amount_cents: 28500, category: "meals", description: "Steakhouse dinner" } },
    { client_id: priya.id, title: "Campaign planning", activity_type: "meeting", duration_minutes: 75, occurred_at: daysAgo(5) },
    { client_id: diana.id, title: "Portfolio intro email", activity_type: "email", duration_minutes: 15, occurred_at: daysAgo(6) },

    // Last 2 weeks
    { client_id: sarah.id, title: "Golf outing", activity_type: "golf", duration_minutes: 240, occurred_at: daysAgo(10), notes: "Relationship building.", expense: { amount_cents: 32000, category: "entertainment", description: "Green fees + cart" } },
    { client_id: marcus.id, title: "Discovery dinner", activity_type: "dinner", duration_minutes: 120, occurred_at: daysAgo(12), expense: { amount_cents: 21000, category: "meals", description: "Client dinner" } },
    { client_id: elena.id, title: "Advisory kickoff", activity_type: "meeting", duration_minutes: 90, occurred_at: daysAgo(14), expense: { amount_cents: 2400, category: "meals", description: "Coffee & pastries" } },
    { client_id: james.id, title: "Technical deep-dive", activity_type: "call", duration_minutes: 60, occurred_at: daysAgo(16) },
    { client_id: alex.id, title: "Usage review", activity_type: "call", duration_minutes: 30, occurred_at: daysAgo(18) },

    // Last month
    { client_id: sarah.id, title: "Strategy lunch", activity_type: "lunch", duration_minutes: 90, occurred_at: daysAgo(25), expense: { amount_cents: 14500, category: "meals", description: "Lunch for two" } },
    { client_id: marcus.id, title: "Platform demo", activity_type: "call", duration_minutes: 45, occurred_at: daysAgo(28) },
    { client_id: elena.id, title: "Intro coffee", activity_type: "meeting", duration_minutes: 60, occurred_at: daysAgo(30), expense: { amount_cents: 1800, category: "meals", description: "Coffee meeting" } },
    { client_id: priya.id, title: "Event sponsorship call", activity_type: "call", duration_minutes: 45, occurred_at: daysAgo(32) },
    { client_id: diana.id, title: "LP dinner", activity_type: "dinner", duration_minutes: 150, occurred_at: daysAgo(35), expense: { amount_cents: 45000, category: "entertainment", description: "Fund dinner" } },
    { client_id: james.id, title: "POC review", activity_type: "meeting", duration_minutes: 60, occurred_at: daysAgo(38) },

    // 2–3 months ago
    { client_id: sarah.id, title: "Quarterly business review", activity_type: "meeting", duration_minutes: 120, occurred_at: daysAgo(45) },
    { client_id: marcus.id, title: "Site visit", activity_type: "meeting", duration_minutes: 180, occurred_at: daysAgo(52), expense: { amount_cents: 8500, category: "travel", description: "Flight + parking" } },
    { client_id: alex.id, title: "Onboarding lunch", activity_type: "lunch", duration_minutes: 75, occurred_at: daysAgo(60), expense: { amount_cents: 9200, category: "meals", description: "Team lunch" } },
    { client_id: priya.id, title: "Media kit review", activity_type: "email", duration_minutes: 20, occurred_at: daysAgo(65) },
    { client_id: james.id, title: "Contract negotiation", activity_type: "call", duration_minutes: 90, occurred_at: daysAgo(70) },
    { client_id: diana.id, title: "Founder roundtable", activity_type: "meeting", duration_minutes: 120, occurred_at: daysAgo(75) },
    { client_id: elena.id, title: "Scope workshop", activity_type: "meeting", duration_minutes: 180, occurred_at: daysAgo(80) },

    // 4–6 months ago (prior quarter history)
    { client_id: sarah.id, title: "Holiday gift drop-off", activity_type: "other", duration_minutes: 30, occurred_at: daysAgo(95), expense: { amount_cents: 15000, category: "gifts", description: "Client gifts" } },
    { client_id: marcus.id, title: "RFP presentation", activity_type: "meeting", duration_minutes: 90, occurred_at: daysAgo(110) },
    { client_id: tom.id, title: "Legacy system audit", activity_type: "meeting", duration_minutes: 120, occurred_at: daysAgo(120) },
    { client_id: tom.id, title: "Follow-up call", activity_type: "call", duration_minutes: 30, occurred_at: daysAgo(125) },
    { client_id: james.id, title: "Initial discovery", activity_type: "call", duration_minutes: 45, occurred_at: daysAgo(140) },
    { client_id: priya.id, title: "Conference meetup", activity_type: "meeting", duration_minutes: 45, occurred_at: daysAgo(150), expense: { amount_cents: 12000, category: "entertainment", description: "Event tickets" } },
    { client_id: alex.id, title: "First demo", activity_type: "call", duration_minutes: 45, occurred_at: daysAgo(160) },
    { client_id: diana.id, title: "Intro lunch", activity_type: "lunch", duration_minutes: 90, occurred_at: daysAgo(170), expense: { amount_cents: 11000, category: "meals", description: "Intro lunch" } },
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
    { client_id: sarah.id, title: "Annual support renewal", amount_cents: 8500000, status: "closed", closed_at: daysAgo(20) },
    { client_id: sarah.id, title: "Professional services add-on", amount_cents: 2400000, status: "pipeline" },
    { client_id: marcus.id, title: "Platform implementation", amount_cents: 12000000, status: "pipeline" },
    { client_id: elena.id, title: "Advisory retainer Q3", amount_cents: 3600000, status: "pipeline" },
    { client_id: james.id, title: "Data platform license", amount_cents: 5400000, status: "closed", closed_at: daysAgo(40) },
    { client_id: james.id, title: "Analytics module upsell", amount_cents: 1800000, status: "pipeline" },
    { client_id: diana.id, title: "Portfolio referral package", amount_cents: 7500000, status: "pipeline" },
    { client_id: alex.id, title: "Enterprise tier upgrade", amount_cents: 4800000, status: "closed", closed_at: daysAgo(15) },
    { client_id: priya.id, title: "Annual agency partnership", amount_cents: 9600000, status: "pipeline" },
    { client_id: tom.id, title: "Legacy migration project", amount_cents: 3200000, status: "lost", closed_at: daysAgo(90) },
    { client_id: tom.id, title: "Maintenance contract", amount_cents: 1200000, status: "pipeline" },
  ];

  for (const deal of deals) {
    const { error } = await admin.from("deals").insert({
      ...deal,
      user_id: userId,
      currency: "USD",
    });
    if (error) throw error;
  }

  return true;
}
