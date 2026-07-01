import { Suspense } from "react";

import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Welcome back"
      description="Log in to track client time, expenses, and revenue."
    >
      <Suspense fallback={<p className="text-sm text-zinc-400">Loading...</p>}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
