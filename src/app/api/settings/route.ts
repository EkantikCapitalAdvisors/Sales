import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SEED_SETTINGS } from "@/lib/db/seed";

export async function GET() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("settings").select("*");

  // Build settings object from DB rows, falling back to seed defaults
  const result: Record<string, unknown> = {};
  for (const seed of SEED_SETTINGS) {
    const dbRow = settings?.find((s) => s.key === seed.key);
    result[seed.key] = dbRow?.value ?? seed.value;
  }

  return NextResponse.json(result);
}

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const updates = Object.entries(body).map(([key, value]) => ({
    key,
    value: value as Record<string, unknown>,
    updated_at: new Date().toISOString(),
  }));

  for (const update of updates) {
    await supabase.from("settings").upsert(update, { onConflict: "key" });
  }

  return NextResponse.json({ success: true });
}
