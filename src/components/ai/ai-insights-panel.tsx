"use client";

import { useState } from "react";
import { useAI } from "@/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Sparkles, Brain, MessageSquare, Shield, Loader2 } from "lucide-react";

interface AIInsightsPanelProps {
  prospect: Record<string, unknown>;
  activities?: Record<string, unknown>[];
  objections?: Record<string, unknown>[];
  linksSent?: Record<string, unknown>[];
}

type TabType = "insights" | "coach" | "objection";

export function AIInsightsPanel({ prospect, activities, objections, linksSent }: AIInsightsPanelProps) {
  const { query, loading, error } = useAI();
  const [activeTab, setActiveTab] = useState<TabType>("insights");
  const [results, setResults] = useState<Record<TabType, string | null>>({
    insights: null,
    coach: null,
    objection: null,
  });
  const [objectionText, setObjectionText] = useState("");

  const daysInStage = prospect.stageEnteredAt
    ? Math.floor(
        (Date.now() - new Date(prospect.stageEnteredAt as string).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  const prospectWithDays = { ...prospect, daysInStage };

  const handleGenerate = async (tab: TabType) => {
    let result: string | null = null;

    switch (tab) {
      case "insights":
        result = await query({
          type: "PROSPECT_INSIGHTS",
          prospect: prospectWithDays,
          context: { activities: activities?.slice(0, 10), objections },
        });
        break;
      case "coach":
        result = await query({
          type: "SALES_COACH",
          prospect: prospectWithDays,
          context: { activities: activities?.slice(0, 10), linksSent },
        });
        break;
      case "objection":
        if (!objectionText.trim()) return;
        result = await query({
          type: "OBJECTION_RESPONSE",
          prospect: prospectWithDays,
          context: { objection: objectionText },
        });
        break;
    }

    setResults((prev) => ({ ...prev, [tab]: result }));
  };

  const tabs = [
    { key: "insights" as TabType, label: "Insights", icon: Brain },
    { key: "coach" as TabType, label: "Coach", icon: Sparkles },
    { key: "objection" as TabType, label: "Objection", icon: Shield },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-[#C8A951]" />
          <h3 className="font-semibold text-[#1B2A4A]">AI Assistant</h3>
        </div>

        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-[#1B2A4A] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === "objection" && (
          <div className="mb-3">
            <input
              type="text"
              placeholder="Enter the objection (e.g., 'I need to think about it')"
              value={objectionText}
              onChange={(e) => setObjectionText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A951] focus:border-transparent"
            />
          </div>
        )}

        <Button
          onClick={() => handleGenerate(activeTab)}
          disabled={loading || (activeTab === "objection" && !objectionText.trim())}
          className="w-full mb-3"
          variant="default"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              {activeTab === "insights" && "Analyze Prospect"}
              {activeTab === "coach" && "Get Coaching"}
              {activeTab === "objection" && "Handle Objection"}
            </>
          )}
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 mb-3">
            {error}
          </div>
        )}

        {results[activeTab] && (
          <div className="prose prose-sm max-w-none">
            <div className="p-3 bg-gradient-to-br from-[#1B2A4A]/5 to-[#C8A951]/5 rounded-lg border border-[#C8A951]/20">
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {results[activeTab]}
              </div>
            </div>
          </div>
        )}

        {!results[activeTab] && !loading && (
          <p className="text-xs text-gray-400 text-center">
            {activeTab === "insights" && "Get AI-powered analysis of this prospect's profile and deal health."}
            {activeTab === "coach" && "Get specific next actions and talking points for this prospect."}
            {activeTab === "objection" && "Enter an objection to get a tailored response strategy."}
          </p>
        )}
      </div>
    </div>
  );
}
