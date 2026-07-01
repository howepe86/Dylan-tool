"use client";

import { FormEvent, useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { ACTIVITY_TYPES, EXPENSE_CATEGORIES } from "@/lib/reports";
import type { Client } from "@/types/database";

export function ActivityLogForm({ clients }: { clients: Client[] }) {
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [activityType, setActivityType] = useState("meeting");
  const [occurredAt, setOccurredAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [durationMinutes, setDurationMinutes] = useState("60");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("meals");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [dealAmount, setDealAmount] = useState("");
  const [dealTitle, setDealTitle] = useState("");
  const [dealStatus, setDealStatus] = useState("pipeline");
  const [voiceFile, setVoiceFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (clients.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Add a client first before logging activities.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let voiceMemoUrl: string | undefined;

      if (voiceFile) {
        const formData = new FormData();
        formData.append("file", voiceFile);
        const uploadRes = await fetch("/api/voice/upload", {
          method: "POST",
          body: formData,
        });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Voice upload failed");
        voiceMemoUrl = uploadJson.url;
      }

      const response = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId,
          title,
          notes: notes || undefined,
          activityType,
          occurredAt: new Date(occurredAt).toISOString(),
          durationMinutes: Number(durationMinutes),
          inputSource: voiceFile ? "voice" : "manual",
          voiceMemoUrl,
          expense:
            expenseAmount.trim() !== ""
              ? {
                  amountCents: Math.round(Number(expenseAmount) * 100),
                  category: expenseCategory,
                  description: expenseDescription || undefined,
                }
              : undefined,
          deal:
            dealAmount.trim() !== ""
              ? {
                  title: dealTitle || title,
                  amountCents: Math.round(Number(dealAmount) * 100),
                  status: dealStatus,
                }
              : undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok) throw new Error(json.error ?? "Failed to save activity");

      setMessage("Activity saved.");
      setTitle("");
      setNotes("");
      setExpenseAmount("");
      setExpenseDescription("");
      setDealAmount("");
      setDealTitle("");
      setVoiceFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="client">Client</Label>
        <Select value={clientId} onValueChange={setClientId}>
          <SelectTrigger id="client">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.company
                  ? `${client.name} (${client.company})`
                  : client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Activity title</Label>
        <Input
          id="title"
          placeholder="Client lunch at Nobu"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="activityType">Activity type</Label>
        <Select value={activityType} onValueChange={setActivityType}>
          <SelectTrigger id="activityType">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIVITY_TYPES.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="occurredAt">When</Label>
          <Input
            id="occurredAt"
            type="datetime-local"
            required
            value={occurredAt}
            onChange={(event) => setOccurredAt(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min={0}
            required
            value={durationMinutes}
            onChange={(event) => setDurationMinutes(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Discussed Q3 expansion, follow up with proposal..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Expense (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Amount (USD)</Label>
              <Input
                id="expenseAmount"
                type="number"
                min={0}
                step="0.01"
                placeholder="125.00"
                value={expenseAmount}
                onChange={(event) => setExpenseAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expenseCategory">Category</Label>
              <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                <SelectTrigger id="expenseCategory">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expenseDescription">Description</Label>
            <Input
              id="expenseDescription"
              placeholder="Lunch for two"
              value={expenseDescription}
              onChange={(event) => setExpenseDescription(event.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Deal / revenue (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dealTitle">Deal title</Label>
            <Input
              id="dealTitle"
              placeholder="Annual services contract"
              value={dealTitle}
              onChange={(event) => setDealTitle(event.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dealAmount">Amount (USD)</Label>
              <Input
                id="dealAmount"
                type="number"
                min={0}
                step="0.01"
                placeholder="50000"
                value={dealAmount}
                onChange={(event) => setDealAmount(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dealStatus">Status</Label>
              <Select value={dealStatus} onValueChange={setDealStatus}>
                <SelectTrigger id="dealStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pipeline">Pipeline</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Voice memo (optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-slate-500">
            Upload an audio recap from your phone. Transcription comes in phase 2.
          </p>
          <Input
            type="file"
            accept="audio/*"
            onChange={(event) => setVoiceFile(event.target.files?.[0] ?? null)}
          />
        </CardContent>
      </Card>

      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-600">{message}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save activity"}
      </Button>
    </form>
  );
}
