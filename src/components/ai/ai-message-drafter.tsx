"use client";

import { useState } from "react";
import { useAI } from "@/hooks/use-ai";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Copy, Check } from "lucide-react";

interface AIMessageDrafterProps {
  prospect: Record<string, unknown>;
  channel: "email" | "whatsapp" | "telegram";
  onUseDraft: (content: string, subject?: string) => void;
}

const PURPOSES = [
  { value: "initial-outreach", label: "Initial Outreach" },
  { value: "follow-up", label: "Follow-Up" },
  { value: "share-dashboard", label: "Share Dashboard Link" },
  { value: "schedule-call", label: "Schedule a Call" },
  { value: "post-meeting", label: "Post-Meeting Summary" },
  { value: "re-engage", label: "Re-Engage Cold Lead" },
  { value: "founding-close", label: "Founding Member Close" },
];

export function AIMessageDrafter({ prospect, channel, onUseDraft }: AIMessageDrafterProps) {
  const { query, loading, error } = useAI();
  const [draft, setDraft] = useState<string | null>(null);
  const [purpose, setPurpose] = useState("follow-up");
  const [customInstructions, setCustomInstructions] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    const result = await query({
      type: "DRAFT_MESSAGE",
      prospect,
      context: {
        channel,
        purpose,
        customInstructions: customInstructions || undefined,
      },
    });
    setDraft(result);
  };

  const handleUseDraft = () => {
    if (!draft) return;

    if (channel === "email") {
      const lines = draft.split("\n");
      const subjectLine = lines.find((l) => l.toLowerCase().startsWith("subject:"));
      const subject = subjectLine?.replace(/^subject:\s*/i, "").trim();
      const body = lines
        .filter((l) => !l.toLowerCase().startsWith("subject:"))
        .join("\n")
        .trim();
      onUseDraft(body, subject);
    } else {
      onUseDraft(draft);
    }
  };

  const handleCopy = async () => {
    if (!draft) return;
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-[#C8A951]/30 rounded-lg bg-gradient-to-br from-[#1B2A4A]/5 to-[#C8A951]/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-[#C8A951]" />
        <span className="text-sm font-semibold text-[#1B2A4A]">AI Draft</span>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Purpose</label>
          <select
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
          >
            {PURPOSES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Custom Instructions (optional)
          </label>
          <input
            type="text"
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            placeholder="e.g., Mention their interest in tech stocks"
            className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={loading}
          size="sm"
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Drafting...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Generate {channel === "email" ? "Email" : channel === "whatsapp" ? "WhatsApp" : "Telegram"} Draft
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          {error}
        </div>
      )}

      {draft && (
        <div className="mt-3">
          <div className="p-3 bg-white rounded-lg border border-gray-200 text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
            {draft}
          </div>
          <div className="flex gap-2 mt-2">
            <Button onClick={handleUseDraft} size="sm" className="flex-1">
              Use This Draft
            </Button>
            <Button onClick={handleCopy} size="sm" variant="outline">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
