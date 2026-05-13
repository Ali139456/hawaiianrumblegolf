import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { LIVE_SITE_TAG, deepMerge } from "@/lib/site-live";

async function requireAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!adminEmail) return { error: "ADMIN_EMAIL is not configured" as const };

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user?.email) return { error: "Unauthorized" as const };
  if (user.email.toLowerCase() !== adminEmail) return { error: "Forbidden" as const };
  return { user };
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if ("error" in auth && auth.error === "ADMIN_EMAIL is not configured") {
    return NextResponse.json({ error: auth.error }, { status: 500 });
  }
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.error === "Forbidden" ? 403 : 401 });
  }

  const db = getSupabaseAdmin();
  if (!db) {
    return NextResponse.json({ error: "Supabase service role is not configured" }, { status: 503 });
  }

  let patch: Record<string, unknown>;
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Expected a JSON object" }, { status: 400 });
    }
    patch = body as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { data: row, error: readErr } = await db.from("site_settings").select("content").eq("id", 1).maybeSingle();
  if (readErr) {
    return NextResponse.json({ error: readErr.message }, { status: 500 });
  }

  const existing =
    row?.content && typeof row.content === "object" && !Array.isArray(row.content)
      ? (row.content as Record<string, unknown>)
      : {};

  const next = deepMerge(existing, patch);

  const { error: writeErr } = await db.from("site_settings").upsert(
    {
      id: 1,
      content: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (writeErr) {
    return NextResponse.json({ error: writeErr.message }, { status: 500 });
  }

  revalidateTag(LIVE_SITE_TAG, "default");
  return NextResponse.json({ ok: true });
}
