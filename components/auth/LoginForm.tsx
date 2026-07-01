"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

type LoginValues = { email: string; password: string };

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setError,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    if (devBypass) {
      await fetch("/api/auth/dev-login", { method: "POST" });
      router.push(searchParams.get("next") ?? "/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword(values);

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }

    router.push(searchParams.get("next") ?? "/dashboard");
    router.refresh();
  }

  const callbackError =
    searchParams.get("error") === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {devBypass ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Dev mode: click Log in to skip authentication.
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
      </div>
      {callbackError ? (
        <p className="text-sm text-rose-600">{callbackError}</p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
          Sign up
        </Link>
      </p>
    </form>
  );
}
