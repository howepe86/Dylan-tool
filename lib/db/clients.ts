import type { Client, Deal, Expense, Interaction } from "@/types/database";
import { getDataClient } from "@/lib/auth/session";

export async function listClients(userId: string) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .order("name");

  if (error) throw error;
  return (data ?? []) as Client[];
}

export async function getClient(userId: string, clientId: string) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .eq("user_id", userId)
    .eq("id", clientId)
    .maybeSingle();

  if (error) throw error;
  return data as Client | null;
}

export async function createClientRecord(
  userId: string,
  input: Pick<Client, "name" | "company" | "email" | "notes">
) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("clients")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();

  if (error) throw error;
  return data as Client;
}

export async function listInteractions(userId: string, clientId?: string) {
  const supabase = await getDataClient();
  let query = supabase
    .from("interactions")
    .select("*")
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Interaction[];
}

export async function listExpenses(userId: string, clientId?: string) {
  const supabase = await getDataClient();
  let query = supabase
    .from("expenses")
    .select("*")
    .eq("user_id", userId)
    .order("incurred_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Expense[];
}

export async function listDeals(userId: string, clientId?: string) {
  const supabase = await getDataClient();
  let query = supabase
    .from("deals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (clientId) query = query.eq("client_id", clientId);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Deal[];
}
