"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  useSortable,
  CSS,
} from "@dnd-kit/sortable";
import { Plus, GripVertical, Calendar, Target, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format/currency";
import type { Client, Deal, DealStatus } from "@/types/database";

// Pipeline stages configuration
const PIPELINE_STAGES: Array<{
  id: DealStatus;
  title: string;
  color: string;
  description: string;
}> = [
  {
    id: "lead",
    title: "Lead",
    color: "bg-slate-100 text-slate-700",
    description: "Initial interest"
  },
  {
    id: "qualified",
    title: "Qualified",
    color: "bg-blue-100 text-blue-700",
    description: "Qualified opportunity"
  },
  {
    id: "proposal",
    title: "Proposal",
    color: "bg-amber-100 text-amber-700",
    description: "Proposal sent"
  },
  {
    id: "negotiation",
    title: "Negotiation",
    color: "bg-orange-100 text-orange-700",
    description: "In negotiation"
  },
  {
    id: "closed",
    title: "Closed Won",
    color: "bg-emerald-100 text-emerald-700",
    description: "Deal won"
  },
  {
    id: "lost",
    title: "Lost",
    color: "bg-red-100 text-red-700",
    description: "Deal lost"
  }
];

interface DealCardProps {
  deal: Deal;
  client: Client | undefined;
}

function DealCard({ deal, client }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""}`}
      {...attributes}
    >
      <Card className="cursor-grab hover:shadow-md transition-shadow">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 truncate">{deal.title}</p>
              <p className="text-sm text-slate-500 truncate">
                {client?.name ?? "Unknown Client"}
              </p>
            </div>
            <div
              {...listeners}
              className="shrink-0 p-1 hover:bg-slate-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold tabular-nums text-emerald-700">
              {formatCurrency(deal.amount_cents)}
            </p>
            {deal.probability_percent > 0 && (
              <Badge variant="outline" className="text-xs">
                {deal.probability_percent}%
              </Badge>
            )}
          </div>

          {deal.expected_close_date && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="h-3 w-3" />
              Expected: {new Date(deal.expected_close_date).toLocaleDateString()}
            </div>
          )}

          {deal.notes && (
            <p className="text-xs text-slate-600 line-clamp-2">{deal.notes}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface PipelineColumnProps {
  stage: typeof PIPELINE_STAGES[0];
  deals: Deal[];
  clients: Client[];
  onAddDeal: (stage: DealStatus) => void;
}

function PipelineColumn({ stage, deals, clients, onAddDeal }: PipelineColumnProps) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.amount_cents, 0);
  const averageProbability = deals.length > 0 
    ? Math.round(deals.reduce((sum, deal) => sum + deal.probability_percent, 0) / deals.length)
    : 0;

  return (
    <div className="flex-1 min-w-[300px]">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">
                {stage.title}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-1">
                {stage.description}
              </p>
            </div>
            <Badge className={`text-xs ${stage.color}`}>
              {deals.length}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-500">Value</p>
              <p className="font-semibold tabular-nums">
                {formatCurrency(totalValue, { compact: true })}
              </p>
            </div>
            {stage.id !== 'closed' && stage.id !== 'lost' && (
              <div>
                <p className="text-slate-500">Avg Probability</p>
                <p className="font-semibold tabular-nums">
                  {averageProbability}%
                </p>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <SortableContext 
            items={deals.map(d => d.id)} 
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3 min-h-[200px]">
              {deals.map((deal) => {
                const client = clients.find(c => c.id === deal.client_id);
                return <DealCard key={deal.id} deal={deal} client={client} />;
              })}
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full border-2 border-dashed border-slate-200 hover:border-slate-300"
                onClick={() => onAddDeal(stage.id)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Deal
              </Button>
            </div>
          </SortableContext>
        </CardContent>
      </Card>
    </div>
  );
}

export function KanbanPipeline({
  deals,
  clients,
}: {
  deals: Deal[];
  clients: Client[];
}) {
  const router = useRouter();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedStage, setSelectedStage] = useState<DealStatus>("lead");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;
  const activeClient = activeDeal ? clients.find(c => c.id === activeDeal.client_id) : undefined;

  // Group deals by stage
  const dealsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals
      .filter(d => d.status === stage.id)
      .sort((a, b) => a.stage_position - b.stage_position);
    return acc;
  }, {} as Record<DealStatus, Deal[]>);

  // Calculate pipeline metrics
  const pipelineValue = deals
    .filter(d => !['closed', 'lost'].includes(d.status))
    .reduce((sum, deal) => sum + deal.amount_cents, 0);
  
  const closedValue = deals
    .filter(d => d.status === 'closed')
    .reduce((sum, deal) => sum + deal.amount_cents, 0);

  async function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    // Find the target stage from the over element
    let targetStage: DealStatus | null = null;
    
    // Check if dropped on another deal (same column)
    const targetDeal = deals.find(d => d.id === overId);
    if (targetDeal) {
      targetStage = targetDeal.status;
    } else {
      // Check if dropped on a stage column
      const stage = PIPELINE_STAGES.find(s => s.id === overId);
      if (stage) {
        targetStage = stage.id;
      }
    }

    if (!targetStage) return;

    const activeDeal = deals.find(d => d.id === activeId);
    if (!activeDeal || activeDeal.status === targetStage) return;

    // Update deal status
    try {
      const res = await fetch(`/api/deals/${activeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: targetStage,
          closedAt: targetStage === "closed" ? new Date().toISOString() : null,
          probabilityPercent: getDefaultProbability(targetStage),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to update deal");
        return;
      }

      setError(null);
      router.refresh();
    } catch (err) {
      setError("Failed to update deal");
    }
  }

  function getDefaultProbability(status: DealStatus): number {
    const probabilities: Record<DealStatus, number> = {
      lead: 10,
      qualified: 25,
      proposal: 50,
      negotiation: 75,
      pipeline: 50, // backward compatibility
      closed: 100,
      lost: 0,
    };
    return probabilities[status];
  }

  function handleAddDeal(stage: DealStatus) {
    setSelectedStage(stage);
    setShowForm(true);
  }

  async function handleCreateDeal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const form = new FormData(e.currentTarget);
    
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: form.get("clientId"),
          title: form.get("title"),
          amountCents: Math.round(Number(form.get("amount")) * 100),
          status: selectedStage,
          probabilityPercent: getDefaultProbability(selectedStage),
          expectedCloseDate: form.get("expectedCloseDate") || null,
          notes: form.get("notes") || null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to create deal");
        return;
      }

      setShowForm(false);
      router.refresh();
    } catch (err) {
      setError("Failed to create deal");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-slate-500">Pipeline Value</p>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {formatCurrency(pipelineValue, { compact: true })}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {deals.filter(d => !['closed', 'lost'].includes(d.status)).length} active deals
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-slate-500">Closed Revenue</p>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-700">
              {formatCurrency(closedValue, { compact: true })}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {dealsByStage.closed?.length || 0} won deals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-slate-500">Win Rate</p>
            </div>
            <p className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
              {deals.length > 0 
                ? Math.round((dealsByStage.closed?.length || 0) / deals.length * 100)
                : 0}%
            </p>
            <p className="mt-1 text-xs text-slate-400">
              All time conversion
            </p>
          </CardContent>
        </Card>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* New Deal Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              Add New Deal - {PIPELINE_STAGES.find(s => s.id === selectedStage)?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDeal} className="grid max-w-2xl gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientId">Client</Label>
                  <Select name="clientId" required>
                    <SelectTrigger>
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
                  <Label htmlFor="title">Deal Title</Label>
                  <Input id="title" name="title" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                  <Input 
                    id="expectedCloseDate" 
                    name="expectedCloseDate" 
                    type="date"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input id="notes" name="notes" placeholder="Deal details, next steps..." />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create Deal"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              deals={dealsByStage[stage.id] || []}
              clients={clients}
              onAddDeal={handleAddDeal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeDeal ? (
            <DealCard deal={activeDeal} client={activeClient} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}