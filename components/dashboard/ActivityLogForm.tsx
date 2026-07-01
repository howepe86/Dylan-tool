"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
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
      <p className="text-sm text-zinc-400">
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
      <Select
        label="Client"
        value={clientId}
        onChange={(event) => setClientId(event.target.value)}
        options={clients.map((client) => ({
          value: client.id,
          label: client.company
            ? `${client.name} (${client.company})`
            : client.name,
        }))}
      />
      <Input
        label="Activity title"
        placeholder="Client lunch at Nobu"
        required
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <Select
        label="Activity type"
        value={activityType}
        onChange={(event) => setActivityType(event.target.value)}
        options={ACTIVITY_TYPES.map((item) => ({
          value: item.id,
          label: item.label,
        }))}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="When"
          type="datetime-local"
          required
          value={occurredAt}
          onChange={(event) => setOccurredAt(event.target.value)}
        />
        <Input
          label="Duration (minutes)"
          type="number"
          min={0}
          required
          value={durationMinutes}
          onChange={(event) => setDurationMinutes(event.target.value)}
        />
      </div>
      <Textarea
        label="Notes"
        placeholder="Discussed Q3 expansion, follow up with proposal..."
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Expense (optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Amount (USD)"
            type="number"
            min={0}
            step="0.01"
            placeholder="125.00"
            value={expenseAmount}
            onChange={(event) => setExpenseAmount(event.target.value)}
          />
          <Select
            label="Category"
            value={expenseCategory}
            onChange={(event) => setExpenseCategory(event.target.value)}
            options={EXPENSE_CATEGORIES.map((item) => ({
              value: item,
              label: item.charAt(0).toUpperCase() + item.slice(1),
            }))}
          />
        </div>
        <Input
          label="Expense description"
          placeholder="Lunch for two"
          value={expenseDescription}
          onChange={(event) => setExpenseDescription(event.target.value)}
        />
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-4">
        <h3 className="text-sm font-semibold text-white">Deal / revenue (optional)</h3>
        <Input
          label="Deal title"
          placeholder="Annual services contract"
          value={dealTitle}
          onChange={(event) => setDealTitle(event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Amount (USD)"
            type="number"
            min={0}
            step="0.01"
            placeholder="50000"
            value={dealAmount}
            onChange={(event) => setDealAmount(event.target.value)}
          />
          <Select
            label="Status"
            value={dealStatus}
            onChange={(event) => setDealStatus(event.target.value)}
            options={[
              { value: "pipeline", label: "Pipeline" },
              { value: "closed", label: "Closed" },
              { value: "lost", label: "Lost" },
            ]}
          />
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-white">Voice memo (optional)</h3>
        <p className="text-xs text-zinc-500">
          Record a quick recap on your phone and upload the audio file. Transcription
          comes in a later phase.
        </p>
        <input
          type="file"
          accept="audio/*"
          onChange={(event) => setVoiceFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:text-zinc-200"
        />
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save activity"}
      </Button>
    </form>
  );
}
