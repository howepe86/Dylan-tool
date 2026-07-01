"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export function NewClientForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        company: company || undefined,
        email: email || undefined,
        notes: notes || undefined,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError(json.error ?? "Failed to create client");
      setLoading(false);
      return;
    }

    window.location.href = `/clients/${json.client.id}`;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <Input
        label="Client name"
        required
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Input
        label="Company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Textarea
        label="Notes"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
      />
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add client"}
      </Button>
    </form>
  );
}
