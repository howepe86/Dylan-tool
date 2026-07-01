import { ExpensesList } from "@/components/dashboard/ExpensesList";
import { PageHeader } from "@/components/dashboard/page-header";
import { getAuthUser } from "@/lib/auth/session";
import { listClients, listExpenses } from "@/lib/db/clients";

export default async function ExpensesPage() {
  const user = await getAuthUser();
  if (!user) return null;

  const [expenses, clients] = await Promise.all([
    listExpenses(user.id),
    listClients(user.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Expenses"
        description="Client entertainment, meals, and travel."
      />
      <ExpensesList expenses={expenses} clients={clients} />
    </div>
  );
}
