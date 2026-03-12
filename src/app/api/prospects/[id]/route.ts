import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const body = await request.json();

  // Convert camelCase to snake_case for DB
  const updates: Record<string, unknown> = {};
  const mapping: Record<string, string> = {
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    phone: "phone",
    whatsappNumber: "whatsapp_number",
    telegramUsername: "telegram_username",
    mailingAddress: "mailing_address",
    dateOfBirth: "date_of_birth",
    spouseName: "spouse_name",
    spouseEmail: "spouse_email",
    investableCapital: "investable_capital",
    annualIncome: "annual_income",
    currentAdvisor: "current_advisor",
    currentFeePct: "current_fee_pct",
    investmentExperience: "investment_experience",
    riskTolerance: "risk_tolerance",
    tenYearGoal: "ten_year_goal",
    targetMonthlyIncome: "target_monthly_income",
    source: "source",
    sourceDetail: "source_detail",
    temperature: "temperature",
    stage: "stage",
    stageEnteredAt: "stage_entered_at",
    foundingVsStandard: "founding_vs_standard",
    customPlanSent: "custom_plan_sent",
    customPlanDate: "custom_plan_date",
    nextFollowUp: "next_follow_up",
    estimatedCloseDate: "estimated_close_date",
    estimatedAum: "estimated_aum",
    notes: "notes",
    lostReason: "lost_reason",
    lostReasonDetail: "lost_reason_detail",
  };

  for (const [key, value] of Object.entries(body)) {
    if (key === "id") continue;
    const dbKey = mapping[key] || key;
    updates[dbKey] = value === "" ? null : value;
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("prospects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("prospects").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
