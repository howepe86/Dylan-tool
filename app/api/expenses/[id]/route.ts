import { NextResponse } from "next/server";

import { getAuthUser } from "@/lib/auth/session";
import { deleteExpense } from "@/lib/db/clients";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await deleteExpense(user.id, id);
  return NextResponse.json({ ok: true });
}
