import { getAuthUser } from "@/lib/auth/session";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();
  const year = new Date().getFullYear();
  const quarter = Math.floor(new Date().getMonth() / 3) + 1;
  const periodLabel = `Q${quarter} ${year}`;

  return (
    <DashboardShell email={user?.email} periodLabel={periodLabel}>
      {children}
    </DashboardShell>
  );
}
