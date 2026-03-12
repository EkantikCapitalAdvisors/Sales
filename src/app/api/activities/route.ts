import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const prospectId = request.nextUrl.searchParams.get("prospectId");

  let query = supabase
    .from("activities")
    .select("*")
    .order("created_at", { ascending: false });

  if (prospectId) {
    query = query.eq("prospect_id", prospectId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const activity = {
    prospect_id: body.prospectId,
    type: body.type,
    title: body.title,
    notes: body.notes || null,
    duration_minutes: body.durationMinutes || null,
    outcome: body.outcome || null,
    metadata: body.metadata || null,
    compliance_flag: body.complianceFlag || false,
  };

  const { data, error } = await supabase
    .from("activities")
    .insert(activity)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
