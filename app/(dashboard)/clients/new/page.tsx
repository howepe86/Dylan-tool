import { NewClientForm } from "@/components/dashboard/NewClientForm";

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Add client</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Create a client to start logging time and expenses.
        </p>
      </div>
      <NewClientForm />
    </div>
  );
}
