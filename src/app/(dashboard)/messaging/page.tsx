"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProspects } from "@/hooks/use-prospects";
import { interpolateTemplate, formatCurrency } from "@/lib/utils";
import { PIPELINE_STAGES, type MessageChannel } from "@/lib/constants";
import { AIMessageDrafter } from "@/components/ai/ai-message-drafter";
import { Send, Mail, MessageCircle, Check } from "lucide-react";

const channelTabs: { id: MessageChannel; label: string; icon: React.ElementType }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "telegram", label: "Telegram", icon: Send },
];

export default function MessagingPage() {
  const { data: prospects = [] } = useProspects();
  const [channel, setChannel] = useState<MessageChannel>("email");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [filterStage, setFilterStage] = useState("");
  const [filterTemp, setFilterTemp] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sentCount, setSentCount] = useState(0);

  // Filter prospects based on criteria
  const filtered = prospects.filter((p) => {
    if (p.stage === "lost" || p.stage === "paused") return false;
    if (filterStage && p.stage !== filterStage) return false;
    if (filterTemp && p.temperature !== filterTemp) return false;
    // Channel availability check
    if (channel === "whatsapp" && !p.whatsappNumber) return false;
    if (channel === "telegram" && !p.telegramUsername) return false;
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const handleSend = async () => {
    if (selectedIds.size === 0 || !body.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messaging/${channel}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prospectIds: Array.from(selectedIds),
          subject: channel === "email" ? subject : undefined,
          body,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSentCount(data.sentCount || selectedIds.size);
        setSelectedIds(new Set());
        setSubject("");
        setBody("");
      }
    } finally {
      setSending(false);
    }
  };

  // Preview with first selected prospect
  const previewProspect = prospects.find((p) => selectedIds.has(p.id));
  const previewBody = previewProspect
    ? interpolateTemplate(body, {
        first_name: previewProspect.firstName,
        last_name: previewProspect.lastName,
        capital_level: formatCurrency(Number(previewProspect.investableCapital)),
        stage:
          PIPELINE_STAGES.find((s) => s.id === previewProspect.stage)?.label ||
          previewProspect.stage,
      })
    : body;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1B2A4A]">Messaging Center</h1>

      {sentCount > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md flex items-center gap-2">
          <Check className="h-4 w-4" />
          Successfully queued {sentCount} messages for delivery.
        </div>
      )}

      {/* Channel Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {channelTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setChannel(tab.id);
              setSelectedIds(new Set());
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-colors ${
              channel === tab.id
                ? "bg-[#1B2A4A] text-white"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {channel === "email" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject line..."
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message Body
              </label>
              <Textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={8}
                placeholder={`Type your message... Use {{first_name}}, {{last_name}}, {{capital_level}}, {{stage}} for personalization.`}
              />
              <p className="text-xs text-gray-400 mt-1">
                Variables: {"{{first_name}}"}, {"{{last_name}}"},{" "}
                {"{{capital_level}}"}, {"{{stage}}"}
              </p>
            </div>

            {/* AI Message Drafter */}
            {previewProspect && (
              <AIMessageDrafter
                prospect={previewProspect as unknown as Record<string, unknown>}
                channel={channel}
                onUseDraft={(content, subjectLine) => {
                  setBody(content);
                  if (subjectLine) setSubject(subjectLine);
                }}
              />
            )}

            {/* Preview */}
            {previewProspect && body && (
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-xs font-medium text-gray-500 mb-1">
                  Preview ({previewProspect.firstName}{" "}
                  {previewProspect.lastName}):
                </p>
                {channel === "email" && subject && (
                  <p className="text-sm font-medium mb-1">
                    {interpolateTemplate(subject, {
                      first_name: previewProspect.firstName,
                    })}
                  </p>
                )}
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {previewBody}
                </p>
              </div>
            )}

            <Button
              onClick={handleSend}
              disabled={sending || selectedIds.size === 0 || !body.trim()}
              className="w-full"
            >
              <Send className="h-4 w-4 mr-2" />
              {sending
                ? "Sending..."
                : `Send to ${selectedIds.size} recipient${
                    selectedIds.size !== 1 ? "s" : ""
                  }`}
            </Button>
          </CardContent>
        </Card>

        {/* Recipients */}
        <Card>
          <CardHeader>
            <CardTitle>
              Select Recipients ({selectedIds.size}/{filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Filters */}
            <div className="flex gap-2">
              <Select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="flex-1"
              >
                <option value="">All Stages</option>
                {PIPELINE_STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </Select>
              <Select
                value={filterTemp}
                onChange={(e) => setFilterTemp(e.target.value)}
                className="w-28"
              >
                <option value="">All</option>
                <option value="hot">Hot</option>
                <option value="warm">Warm</option>
                <option value="cold">Cold</option>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={selectAll}>
              {selectedIds.size === filtered.length
                ? "Deselect All"
                : "Select All"}
            </Button>

            <div className="max-h-96 overflow-y-auto space-y-1">
              {filtered.map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggleSelect(p.id)}
                  className={`flex items-center justify-between w-full text-left p-2 rounded text-sm transition-colors ${
                    selectedIds.has(p.id)
                      ? "bg-[#1B2A4A]/5 border border-[#1B2A4A]/20"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-xs text-gray-400">
                      {channel === "whatsapp"
                        ? p.whatsappNumber
                        : channel === "telegram"
                        ? p.telegramUsername
                        : p.email}
                    </p>
                  </div>
                  <Badge
                    variant={p.temperature as "hot" | "warm" | "cold"}
                    className="text-[10px]"
                  >
                    {p.temperature}
                  </Badge>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  {channel !== "email"
                    ? `No prospects with ${channel} contact info.`
                    : "No prospects match filters."}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
