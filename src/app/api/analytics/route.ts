import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PIPELINE_STAGES, DEFAULT_SEAT_CAP } from "@/lib/constants";

export async function GET() {
  const supabase = await createClient();

  // Fetch all prospects
  const { data: rawProspects } = await supabase
    .from("prospects")
    .select("*");
  const prospects = rawProspects || [];

  // Fetch settings for seat cap
  const { data: seatCapSetting } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "founding_seat_cap")
    .single();

  const seatCap = (seatCapSetting?.value as number) || DEFAULT_SEAT_CAP;

  // Fetch weekly activity count
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { count: weeklyActivities } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .gte("created_at", weekAgo.toISOString());

  // Calculate KPIs
  const active = prospects.filter(
    (p) => p.stage !== "lost" && p.stage !== "paused"
  );
  const closed = prospects.filter((p) => p.stage === "close");
  const hot = active.filter((p) => p.temperature === "hot");
  const overdue = active.filter(
    (p) => p.next_follow_up && new Date(p.next_follow_up) < new Date()
  );

  const pipelineValue = active.reduce(
    (sum, p) =>
      sum + Number(p.estimated_aum || p.investable_capital || 0),
    0
  );

  const totalOutreach = prospects.length;
  const conversionRate =
    totalOutreach > 0 ? (closed.length / totalOutreach) * 100 : 0;

  // Average days to close
  let avgDays = 0;
  if (closed.length > 0) {
    const totalDays = closed.reduce((sum, p) => {
      const created = new Date(p.created_at).getTime();
      const now = new Date().getTime();
      return sum + (now - created) / (1000 * 60 * 60 * 24);
    }, 0);
    avgDays = totalDays / closed.length;
  }

  // Funnel data
  const funnelData = PIPELINE_STAGES.map((stage) => {
    const stageProspects = active.filter((p) => p.stage === stage.id);
    return {
      stage: stage.label,
      count: stageProspects.length,
      value: stageProspects.reduce(
        (sum, p) =>
          sum + Number(p.estimated_aum || p.investable_capital || 0),
        0
      ),
    };
  });

  return NextResponse.json({
    pipelineSize: active.length,
    pipelineValue,
    seatsRemaining: Math.max(0, seatCap - closed.length),
    seatCap,
    conversionRate,
    avgDaysToClose: avgDays,
    hotProspectCount: hot.length,
    overdueFollowUps: overdue.length,
    weeklyActivityVolume: weeklyActivities || 0,
    funnelData,
  });
}
