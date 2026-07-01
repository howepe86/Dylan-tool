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

export async function updateClient(
  userId: string,
  clientId: string,
  input: Partial<Pick<Client, "name" | "company" | "email" | "notes">>
) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("clients")
    .update(input)
    .eq("user_id", userId)
    .eq("id", clientId)
    .select("*")
    .single();
  if (error) throw error;
  return data as Client;
}

export async function deleteClient(userId: string, clientId: string) {
  const supabase = await getDataClient();
  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("user_id", userId)
    .eq("id", clientId);
  if (error) throw error;
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

export async function deleteInteraction(userId: string, id: string) {
  const supabase = await getDataClient();
  const { error } = await supabase
    .from("interactions")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
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

export async function createExpense(
  userId: string,
  input: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">
) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("expenses")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data as Expense;
}

export async function deleteExpense(userId: string, id: string) {
  const supabase = await getDataClient();
  const { error } = await supabase
    .from("expenses")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
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

export async function createDeal(
  userId: string,
  input: Omit<Deal, "id" | "user_id" | "created_at" | "updated_at">
) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("deals")
    .insert({ ...input, user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data as Deal;
}

export async function updateDeal(
  userId: string,
  id: string,
  input: Partial<
    Pick<Deal, "title" | "amount_cents" | "status" | "closed_at" | "notes">
  >
) {
  const supabase = await getDataClient();
  const { data, error } = await supabase
    .from("deals")
    .update(input)
    .eq("user_id", userId)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Deal;
}

export async function deleteDeal(userId: string, id: string) {
  const supabase = await getDataClient();
  const { error } = await supabase
    .from("deals")
    .delete()
    .eq("user_id", userId)
    .eq("id", id);
  if (error) throw error;
}
