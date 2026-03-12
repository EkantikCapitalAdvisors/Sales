"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { DEFAULT_THRESHOLDS } from "@/lib/constants";
import {
  Users,
  DollarSign,
  Armchair,
  TrendingUp,
  Clock,
  Flame,
  AlertTriangle,
  Activity,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const FUNNEL_COLORS = [
  "#6B7280",
  "#3B82F6",
  "#8B5CF6",
  "#F59E0B",
  "#10B981",
  "#C8A951",
];

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  const kpis = [
    {
      label: "Pipeline Size",
      value: data.pipelineSize,
      format: (v: number) => v.toString(),
      icon: Users,
      alert: data.pipelineSize < DEFAULT_THRESHOLDS.pipelineSize,
    },
    {
      label: "Pipeline Value",
      value: data.pipelineValue,
      format: formatCurrency,
      icon: DollarSign,
      alert: data.pipelineValue < DEFAULT_THRESHOLDS.pipelineValue,
    },
    {
      label: "Seats Remaining",
      value: data.seatsRemaining,
      format: (v: number) => `${v}/${data.seatCap}`,
      icon: Armchair,
      alert: data.seatsRemaining < DEFAULT_THRESHOLDS.seatsRemaining,
    },
    {
      label: "Conversion Rate",
      value: data.conversionRate,
      format: (v: number) => `${v.toFixed(1)}%`,
      icon: TrendingUp,
      alert: data.conversionRate < DEFAULT_THRESHOLDS.conversionRate,
    },
    {
      label: "Avg Days to Close",
      value: data.avgDaysToClose,
      format: (v: number) => `${Math.round(v)} days`,
      icon: Clock,
      alert: data.avgDaysToClose > DEFAULT_THRESHOLDS.avgDaysToClose,
    },
    {
      label: "Hot Prospects",
      value: data.hotProspectCount,
      format: (v: number) => v.toString(),
      icon: Flame,
      alert: data.hotProspectCount < DEFAULT_THRESHOLDS.hotProspectCount,
    },
    {
      label: "Overdue Follow-Ups",
      value: data.overdueFollowUps,
      format: (v: number) => v.toString(),
      icon: AlertTriangle,
      alert: data.overdueFollowUps > DEFAULT_THRESHOLDS.overdueFollowUps,
    },
    {
      label: "Weekly Activities",
      value: data.weeklyActivityVolume,
      format: (v: number) => v.toString(),
      icon: Activity,
      alert: data.weeklyActivityVolume < DEFAULT_THRESHOLDS.weeklyActivityVolume,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Analytics</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className={kpi.alert ? "border-red-300 bg-red-50/50" : ""}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <kpi.icon
                  className={`h-5 w-5 ${
                    kpi.alert ? "text-red-500" : "text-gray-400"
                  }`}
                />
                {kpi.alert && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="text-2xl font-bold text-[#1B2A4A]">
                {kpi.format(kpi.value)}
              </p>
              <p className="text-xs text-gray-500">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel Chart */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4">
            Pipeline Funnel
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.funnelData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="stage"
                  width={120}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [String(value), "Prospects"]}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.funnelData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={FUNNEL_COLORS[index % FUNNEL_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
