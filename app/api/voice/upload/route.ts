import { NextResponse } from "next/server";

import { getAuthUser, getDataClient } from "@/lib/auth/session";

const MAX_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing audio file" }, { status: 400 });
    }

    if (!file.type.startsWith("audio/")) {
      return NextResponse.json({ error: "File must be audio" }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
    }

    const extension = file.name.split(".").pop() ?? "webm";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;

    const supabase = await getDataClient();
    const { error: uploadError } = await supabase.storage
      .from("voice-memos")
      .upload(path, file, { contentType: file.type, upsert: false });

    if (uploadError) throw uploadError;

    const {
      data: { publicUrl },
    } = supabase.storage.from("voice-memos").getPublicUrl(path);

    return NextResponse.json({ url: publicUrl, path });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Voice upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
