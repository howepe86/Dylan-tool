"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/types/database";

const schema = z.object({
  name: z.string().min(1, "Client name is required"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function EditClientForm({ client }: { client: Client }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: client.name,
      company: client.company ?? "",
      email: client.email ?? "",
      notes: client.notes ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch(`/api/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        company: values.company || null,
        email: values.email || null,
        notes: values.notes || null,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError("root", { message: json.error ?? "Failed to update client" });
      return;
    }

    router.push(`/clients/${client.id}`);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this client and all related data?")) return;
    const res = await fetch(`/api/clients/${client.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/clients");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Client name</Label>
        <Input id="name" {...register("name")} />
        {errors.name ? (
          <p className="text-sm text-rose-600">{errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register("company")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email ? (
          <p className="text-sm text-rose-600">{errors.email.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>
      {errors.root ? (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-rose-600 hover:text-rose-700"
          onClick={handleDelete}
        >
          Delete client
        </Button>
      </div>
    </form>
  );
}
