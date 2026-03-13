"use client";

import { useState } from "react";

interface AIRequest {
  type: "PROSPECT_INSIGHTS" | "SALES_COACH" | "DRAFT_MESSAGE" | "OBJECTION_RESPONSE";
  prospect: Record<string, unknown>;
  context?: Record<string, unknown>;
}

interface AIResponse {
  content: string;
  type: string;
}

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = async (request: AIRequest): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "AI request failed");
      }

      const data: AIResponse = await response.json();
      return data.content;
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI request failed";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { query, loading, error };
}
