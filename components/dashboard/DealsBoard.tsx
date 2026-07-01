"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";

import { EmptyState } from "@/components/dashboard/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatCurrency } from "@/lib/format/currency";
import type { Client, Deal } from "@/types/database";

const statusLabels: Record<Deal["status"], string> = {
  pipeline: "Pipeline",
  closed: "Closed",
  lost: "Lost",
};

const statusVariant: Record<
  Deal["status"],
  "default" | "secondary" | "revenue" | "expense"
> = {
  pipeline: "secondary",
  closed: "revenue",
  lost: "expense",
};

export function DealsBoard({
  deals,
  clients,
}: {
  deals: Deal[];
  clients: Client[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [updatingDealId, setUpdatingDealId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [status, setStatus] = useState<Deal["status"]>("pipeline");

  const pipeline = deals.filter((d) => d.status === "pipeline");
  const closed = deals.filter((d) => d.status === "closed");
  const lost = deals.filter((d) => d.status === "lost");

  const pipelineTotal = pipeline.reduce((s, d) => s + d.amount_cents, 0);
  const closedTotal = closed.reduce((s, d) => s + d.amount_cents, 0);

  async function updateStatus(dealId: string, status: Deal["status"]) {
    setUpdatingDealId(dealId);
    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          closedAt: status === "closed" ? new Date().toISOString() : null,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to update deal");
        return;
      }
      setError(null);
      router.refresh();
    } finally {
      setUpdatingDealId(null);
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId,
        title: form.get("title"),
        amountCents: Math.round(Number(form.get("amount")) * 100),
        status,
      }),
    });

    const json = await res.json();
    setSaving(false);
    if (!res.ok) {
      setError(json.error ?? "Failed to create deal");
      return;
    }
    setShowForm(false);
    router.refresh();
  }

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<Deal["status"] | null>(null);

  const columns: { status: Deal["status"]; deals: Deal[]; total: number }[] = [
    { status: "pipeline", deals: pipeline, total: pipelineTotal },
    { status: "closed", deals: closed, total: closedTotal },
    { status: "lost", deals: lost, total: lost.reduce((s, d) => s + d.amount_cents, 0) },
  ];

  async function handleDrop(status: Deal["status"], dealId: string) {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.status === status) return;
    await updateStatus(dealId, status);
    setDropTarget(null);
    setDraggingId(null);
  }

  function DealCard({ deal }: { deal: Deal }) {
    const client = clients.find((c) => c.id === deal.client_id);
    const isUpdating = updatingDealId === deal.id;
    return (
      <Card
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/deal-id", deal.id);
          setDraggingId(deal.id);
        }}
        onDragEnd={() => setDraggingId(null)}
        className={`cursor-grab active:cursor-grabbing ${draggingId === deal.id ? "opacity-50" : ""}`}
      >
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-slate-900">{deal.title}</p>
              <p className="text-sm text-slate-500">{client?.name ?? "Unknown"}</p>
            </div>
            <Badge variant={statusVariant[deal.status]}>
              {statusLabels[deal.status]}
            </Badge>
          </div>
          <p className="text-lg font-semibold tabular-nums text-emerald-700">
            {formatCurrency(deal.amount_cents)}
          </p>
          {deal.status === "pipeline" ? (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={isUpdating}
                onClick={() => updateStatus(deal.id, "closed")}
              >
                {isUpdating ? <LoadingSpinner /> : "Mark closed"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-rose-600"
                disabled={isUpdating}
                onClick={() => updateStatus(deal.id, "lost")}
              >
                {isUpdating ? <LoadingSpinner /> : "Lost"}
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Pipeline value</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {formatCurrency(pipelineTotal, { compact: true })}
            </p>
            <p className="mt-1 text-xs text-slate-400">{pipeline.length} deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-slate-500">Closed (all time)</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">
              {formatCurrency(closedTotal, { compact: true })}
            </p>
            <p className="mt-1 text-xs text-slate-400">{closed.length} deals</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          New deal
        </Button>
      </div>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {showForm ? (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleCreate} className="grid max-w-lg gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="title">Deal title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input id="amount" name="amount" type="number" min="0" step="0.01" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Deal["status"])}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pipeline">Pipeline</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {error ? <p className="text-sm text-rose-600">{error}</p> : null}
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? <LoadingSpinner label="Saving…" /> : "Create deal"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {deals.length === 0 && !showForm ? (
        <EmptyState
          title="No deals yet"
          description="Track pipeline and closed revenue to measure client ROI."
          actionLabel="Add deal"
          actionHref="/deals"
          icon={Briefcase}
        />
      ) : deals.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map(({ status, deals: columnDeals, total }) => (
            <section
              key={status}
              className={`min-h-[200px] rounded-xl border-2 border-dashed p-3 transition-colors ${
                dropTarget === status
                  ? "border-indigo-400 bg-indigo-50/50"
                  : "border-slate-200 bg-slate-50/30"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDropTarget(status);
              }}
              onDragLeave={() => setDropTarget(null)}
              onDrop={(e) => {
                e.preventDefault();
                const dealId = e.dataTransfer.getData("text/deal-id") || draggingId;
                if (dealId) handleDrop(status, dealId);
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">
                  {statusLabels[status]}
                </h2>
                <span className="text-xs text-slate-500">
                  {columnDeals.length} · {formatCurrency(total, { compact: true })}
                </span>
              </div>
              <div className="space-y-3">
                {columnDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
                {columnDeals.length === 0 ? (
                  <p className="py-8 text-center text-xs text-slate-400">
                    Drop deals here
                  </p>
                ) : null}
              </div>
            </section>
          ))}
        </div>
      ) : null}
    </div>
  );
}
