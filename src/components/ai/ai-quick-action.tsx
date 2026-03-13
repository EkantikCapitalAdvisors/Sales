"use client";

import { useState } from "react";
import { useAI } from "@/hooks/use-ai";
import { Sparkles, Loader2, X } from "lucide-react";

interface AIQuickActionProps {
  prospect: Record<string, unknown>;
  onClose: () => void;
}

export function AIQuickAction({ prospect, onClose }: AIQuickActionProps) {
  const { query, loading, error } = useAI();
  const [result, setResult] = useState<string | null>(null);

  const handleCoach = async () => {
    const content = await query({
      type: "SALES_COACH",
      prospect,
    });
    setResult(content);
  };

  return (
    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-[#C8A951]" />
          <span className="text-xs font-semibold text-[#1B2A4A]">AI Coach</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {!result && !loading && (
        <button
          onClick={handleCoach}
          className="w-full px-3 py-2 bg-[#1B2A4A] text-white rounded-lg text-xs font-medium hover:bg-[#1B2A4A]/90 transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="h-3 w-3" />
          Get Coaching for {prospect.firstName as string}
        </button>
      )}

      {loading && (
        <div className="flex items-center justify-center py-4 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-xs">Analyzing...</span>
        </div>
      )}

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="text-xs text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto leading-relaxed">
          {result}
        </div>
      )}
    </div>
  );
}
