"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().min(1, "Client name is required"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewClientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", company: "", email: "", notes: "" },
  });

  async function onSubmit(values: FormValues) {
    const response = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name,
        company: values.company || undefined,
        email: values.email || undefined,
        notes: values.notes || undefined,
      }),
    });

    const json = await response.json();
    if (!response.ok) {
      setError("root", { message: json.error ?? "Failed to create client" });
      return;
    }

    window.location.href = `/clients/${json.client.id}`;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Client name</Label>
        <Input id="name" aria-describedby={errors.name ? "name-error" : undefined} {...register("name")} />
        {errors.name ? (
          <p id="name-error" className="text-sm text-rose-600">
            {errors.name.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input id="company" {...register("company")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="text-sm text-rose-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>
      {errors.root ? (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <LoadingSpinner label="Saving…" /> : "Add client"}
      </Button>
    </form>
  );
}
