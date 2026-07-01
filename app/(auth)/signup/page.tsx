import { AuthPageShell } from "@/components/auth/AuthPageShell";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthPageShell
      title="Create your account"
      description="Start tracking client ROI in minutes."
    >
      <SignupForm />
    </AuthPageShell>
  );
}
