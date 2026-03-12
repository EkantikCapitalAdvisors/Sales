"use client";

import { useQuery } from "@tanstack/react-query";

export interface AnalyticsData {
  pipelineSize: number;
  pipelineValue: number;
  seatsRemaining: number;
  seatCap: number;
  conversionRate: number;
  avgDaysToClose: number;
  hotProspectCount: number;
  overdueFollowUps: number;
  weeklyActivityVolume: number;
  funnelData: { stage: string; count: number; value: number }[];
}

async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch("/api/analytics");
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}

export function useAnalytics() {
  return useQuery({
    queryKey: ["analytics"],
    queryFn: fetchAnalytics,
    refetchInterval: 30000, // refresh every 30s
  });
}
