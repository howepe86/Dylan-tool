import { ActivityLogForm } from "@/components/dashboard/ActivityLogForm";
import { listClients } from "@/lib/db/clients";
import { createClient } from "@/lib/supabase-server";

export default async function LogActivityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const clients = await listClients(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Log activity</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manual text entry, optional expense and deal fields, or upload a voice memo.
        </p>
      </div>
      <div className="max-w-2xl">
        <ActivityLogForm clients={clients} />
      </div>
    </div>
  );
}
