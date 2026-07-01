import { CTASection } from "@/components/marketing/CTASection";
import { HeroSection } from "@/components/marketing/HeroSection";
import { MetricsSection } from "@/components/marketing/MetricsSection";
import { PlatformSection } from "@/components/marketing/PlatformSection";
import { UseCaseTabs } from "@/components/marketing/UseCaseTabs";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { getSessionUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <MarketingPage>
      <HeroSection />
      <UseCaseTabs />
      <MetricsSection />
      <PlatformSection />
      <CTASection />
    </MarketingPage>
  );
}
