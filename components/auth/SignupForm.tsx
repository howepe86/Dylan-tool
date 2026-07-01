"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { createClient } from "@/lib/supabase";

type SignupValues = {
  fullName: string;
  email: string;
  password: string;
};

export function SignupForm() {
  const router = useRouter();
  const devBypass = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true";
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    setError,
  } = useForm<SignupValues>({
    defaultValues: { fullName: "", email: "", password: "" },
  });

  async function demoLogin() {
    setDemoLoading(true);
    try {
      const res = await fetch("/api/auth/demo-login", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError("root", { message: json.error ?? "Demo login failed" });
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setDemoLoading(false);
    }
  }

  async function onSubmit(values: SignupValues) {
    if (devBypass) {
      await fetch("/api/auth/dev-login", { method: "POST" });
      router.push("/dashboard");
      router.refresh();
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { full_name: values.fullName } },
    });

    if (authError) {
      setError("root", { message: authError.message });
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  const busy = demoLoading || isSubmitting;

  return (
    <div className="space-y-4">
      {errors.root ? (
        <p className="text-sm text-rose-600">{errors.root.message}</p>
      ) : null}
      <Button
        type="button"
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-200 hover:from-indigo-500 hover:to-violet-500"
        onClick={demoLogin}
        disabled={busy}
      >
        {demoLoading ? (
          <LoadingSpinner label="Setting up demo…" />
        ) : (
          <>
            <Sparkles className="h-4 w-4" aria-hidden />
            Continue as Demo User
          </>
        )}
      </Button>
      <p className="text-center text-xs text-slate-500">
        Pre-loaded with sample clients, activities &amp; deals
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-slate-400">Or sign up</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {devBypass ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Dev mode: click Create account to skip authentication.
          </p>
        ) : null}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" autoComplete="name" {...register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
        </div>
        <p className="text-center text-xs text-slate-500">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">
            Privacy Policy
          </Link>
          .
        </p>
        <Button type="submit" className="w-full" disabled={busy}>
          {isSubmitting ? (
            <LoadingSpinner label="Creating account…" />
          ) : (
            "Create account"
          )}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
