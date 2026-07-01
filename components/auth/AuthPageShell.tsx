import { MarketingPage } from "@/components/marketing/MarketingPage";
import { MarketingCard } from "@/components/marketing/primitives";

export async function AuthPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <MarketingPage variant="auth">
      <MarketingCard highlighted className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
        <div className="mt-6">{children}</div>
      </MarketingCard>
    </MarketingPage>
  );
}
