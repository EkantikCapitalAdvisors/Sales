import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data: sections, error: secError } = await supabase
    .from("checklist_sections")
    .select("*")
    .order("sort_order");

  if (secError)
    return NextResponse.json({ error: secError.message }, { status: 500 });

  const { data: items, error: itemError } = await supabase
    .from("checklist_items")
    .select("*")
    .order("sort_order");

  if (itemError)
    return NextResponse.json({ error: itemError.message }, { status: 500 });

  const result = (sections || []).map((section) => ({
    ...section,
    items: (items || []).filter((item) => item.section_id === section.id),
  }));

  return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  const { data, error } = await supabase
    .from("checklist_items")
    .update({
      completed: body.completed,
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
