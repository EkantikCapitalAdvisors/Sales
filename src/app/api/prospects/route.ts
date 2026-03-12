import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prospects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const body = await request.json();

  // Batch import
  if (body.batch) {
    const prospects = body.batch.map((p: Record<string, string>) => ({
      first_name: p.firstName,
      last_name: p.lastName,
      email: p.email,
      investable_capital: Number(p.investableCapital) || 0,
      source: p.source || "other",
      phone: p.phone || null,
      temperature: p.temperature || "warm",
      stage: "outreach",
      stage_entered_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from("prospects")
      .insert(prospects)
      .select();

    if (error)
      return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ count: data.length });
  }

  // Single create
  const prospect = {
    first_name: body.firstName,
    last_name: body.lastName,
    email: body.email,
    phone: body.phone || null,
    whatsapp_number: body.whatsappNumber || null,
    telegram_username: body.telegramUsername || null,
    mailing_address: body.mailingAddress || null,
    date_of_birth: body.dateOfBirth || null,
    spouse_name: body.spouseName || null,
    spouse_email: body.spouseEmail || null,
    investable_capital: Number(body.investableCapital) || 0,
    annual_income: body.annualIncome ? Number(body.annualIncome) : null,
    current_advisor: body.currentAdvisor || null,
    current_fee_pct: body.currentFeePct ? Number(body.currentFeePct) : null,
    investment_experience: body.investmentExperience || null,
    risk_tolerance: body.riskTolerance || null,
    ten_year_goal: body.tenYearGoal || null,
    target_monthly_income: body.targetMonthlyIncome
      ? Number(body.targetMonthlyIncome)
      : null,
    source: body.source || "other",
    source_detail: body.sourceDetail || null,
    temperature: body.temperature || "warm",
    founding_vs_standard: body.foundingVsStandard || "undecided",
    estimated_aum: body.estimatedAum ? Number(body.estimatedAum) : null,
    estimated_close_date: body.estimatedCloseDate || null,
    next_follow_up: body.nextFollowUp || null,
    notes: body.notes || null,
    stage: "outreach",
    stage_entered_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("prospects")
    .insert(prospect)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
