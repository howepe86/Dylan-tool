import Link from "next/link";

import { NewClientForm } from "@/components/dashboard/NewClientForm";
import { PageHeader } from "@/components/dashboard/page-header";

export default function NewClientPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Add client"
        description="Create a client to start logging time and expenses."
      />
      <NewClientForm />
    </div>
  );
}
