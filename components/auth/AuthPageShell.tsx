import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
      <Card className="w-full max-w-md border-slate-200/80 shadow-xl shadow-indigo-100/30 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </MarketingPage>
  );
}
