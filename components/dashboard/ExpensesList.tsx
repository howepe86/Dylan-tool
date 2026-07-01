"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Receipt } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { ReceiptScanner } from "@/components/dashboard/ReceiptScanner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/format/currency";
import { EXPENSE_CATEGORIES } from "@/lib/reports";
import type { Client, Expense } from "@/types/database";

export function ExpensesList({
  expenses,
  clients,
}: {
  expenses: Expense[];
  clients: Client[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [category, setCategory] = useState<string>("meals");

  const totalCents = expenses.reduce((s, e) => s + e.amount_cents, 0);

  async function handleDelete(id: string) {
    if (!confirm("Delete this expense?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/expenses/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        amountCents: Math.round(Number(form.get("amount")) * 100),
        category,
        description: form.get("description") || undefined,
        incurredAt: new Date(form.get("incurredAt") as string).toISOString(),
      }),
    });

    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error ?? "Failed to create expense");
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Total expenses</p>
          <p className="text-2xl font-semibold tabular-nums text-rose-600">
            {formatCurrency(totalCents, { compact: true })}
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>Add expense</Button>
      </div>

      {showForm ? (
        <Card className="p-6">
          <form onSubmit={handleCreate} className="grid max-w-lg gap-4">
            <ReceiptScanner
              onParsed={({ amount, description, category: cat }) => {
                const amountEl = document.getElementById("expense-amount") as HTMLInputElement | null;
                const descEl = document.getElementById("description") as HTMLInputElement | null;
                if (amountEl) amountEl.value = String(amount);
                if (descEl && description) descEl.value = description;
                if (cat) setCategory(cat);
              }}
            />
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select value={clientId} onValueChange={setClientId} required>
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input id="expense-amount" name="amount" type="number" min="0" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="incurredAt">Date</Label>
              <Input
                id="incurredAt"
                name="incurredAt"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? <LoadingSpinner label="Saving…" /> : "Save expense"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {expenses.length === 0 ? (
        <EmptyState
          title="No expenses logged"
          description="Track meals, entertainment, and travel tied to client relationships."
          actionLabel="Log activity with expense"
          actionHref="/log"
          icon={Receipt}
        />
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => {
                const client = clients.find((c) => c.id === expense.client_id);
                return (
                  <TableRow key={expense.id}>
                    <TableCell className="text-slate-500">
                      {new Date(expense.incurred_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">{client?.name ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{expense.category}</Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {expense.description ?? "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-rose-600">
                      −{formatCurrency(expense.amount_cents)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-rose-600"
                        disabled={deletingId === expense.id}
                        onClick={() => handleDelete(expense.id)}
                      >
                        {deletingId === expense.id ? (
                          <LoadingSpinner />
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
