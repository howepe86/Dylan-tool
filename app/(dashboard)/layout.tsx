import { AppSidebar } from "@/components/layout/app-sidebar";
import { getAuthUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AppSidebar email={user?.email} />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-content px-6 py-8 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
