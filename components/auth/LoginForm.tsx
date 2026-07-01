"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase";

type LoginValues = { email: string; password: string };

function safeNextPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (
    !raw.startsWith("/") ||
    raw.startsWith("//") ||
    raw.includes("\\") ||
    raw.startsWith("/login") ||
    raw.startsWith("/signup")
  ) {
    return "/dashboard";
  }
  return raw;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<LoginValues>({
    defaultValues: { email: "", password: "" },
  });

  async function demoLogin() {
    const res = await fetch("/api/auth/demo-login", { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      setError("root", { message: json.error ?? "Demo login failed" });
      return;
    }
    router.push(safeNextPath(searchParams.get("next")));
    router.refresh();
  }

  async function onSubmit(values: LoginValues) {
    if (devBypass) {
      await fetch("/api/auth/dev-login", { method: "POST" });
      router.push(safeNextPath(searchParams.get("next")));
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword(values);

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }

    router.push(safeNextPath(searchParams.get("next")));
    router.refresh();
  }

  const callbackError =
    searchParams.get("error") === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null;

  return (
    <div className="space-y-4">
      {callbackError ? (
        <p className="text-sm text-rose-600">{callbackError}</p>
      ) : null}
      {errors.root ? (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      ) : null}
      <Button
        type="button"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500"
        onClick={demoLogin}
      >
        <Sparkles className="mr-2 h-4 w-4" aria-hidden />
        Continue as Demo User
      </Button>
      <p className="text-center text-xs text-slate-500">
        Pre-loaded with clients, activities &amp; deals — no setup needed
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or sign in</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {devBypass ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Dev mode: auth bypass enabled locally.
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
        <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Log in with email"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
