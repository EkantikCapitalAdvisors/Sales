"use client";

import { useActivities, useCreateActivity } from "@/hooks/use-activities";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MailOpen,
  Link,
  Eye,
  Video,
  Handshake,
  FileText,
  StickyNote,
  ArrowRight,
  Clock,
  AlertTriangle,
  Send,
} from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Phone,
  Mail,
  MailOpen,
  Link,
  Eye,
  Video,
  Handshake,
  FileText,
  StickyNote,
  ArrowRight,
  Clock,
  AlertTriangle,
  Send,
};

interface ActivityTimelineProps {
  prospectId: string;
}

export function ActivityTimeline({ prospectId }: ActivityTimelineProps) {
  const { data: activities = [], isLoading } = useActivities(prospectId);
  const createActivity = useCreateActivity();
  const [newType, setNewType] = useState("note");
  const [newTitle, setNewTitle] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [filterType, setFilterType] = useState("");

  const handleQuickLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await createActivity.mutateAsync({
      prospectId,
      type: newType,
      title: newTitle,
      notes: newNotes || undefined,
    });

    setNewTitle("");
    setNewNotes("");
  };

  const filtered = filterType
    ? activities.filter((a) => a.type === filterType)
    : activities;

  return (
    <div className="space-y-4">
      {/* Quick-log bar */}
      <form
        onSubmit={handleQuickLog}
        className="flex items-end gap-2 p-3 bg-white rounded-lg border border-gray-200"
      >
        <div className="w-40">
          <Select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
          >
            {ACTIVITY_TYPES.filter(
              (t) => t.id !== "stage_change" && t.id !== "follow_up_set"
            ).map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex-1">
          <Input
            placeholder="Activity title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <Input
          placeholder="Notes (optional)"
          value={newNotes}
          onChange={(e) => setNewNotes(e.target.value)}
          className="flex-1 hidden md:flex"
        />
        <Button type="submit" size="sm" disabled={createActivity.isPending}>
          Log
        </Button>
      </form>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="w-48"
        >
          <option value="">All Activities</option>
          {ACTIVITY_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </Select>
        <span className="text-sm text-gray-400">
          {filtered.length} activities
        </span>
      </div>

      {/* Timeline */}
      {isLoading ? (
        <div className="flex items-center justify-center h-16">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1B2A4A]" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((activity) => {
            const actType = ACTIVITY_TYPES.find((t) => t.id === activity.type);
            const Icon = actType
              ? iconMap[actType.icon] || StickyNote
              : StickyNote;
            return (
              <div
                key={activity.id}
                className="flex gap-3 p-3 bg-white rounded-lg border border-gray-100"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.title}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {activity.complianceFlag && (
                        <Badge variant="outline" className="text-[10px]">
                          Compliance
                        </Badge>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {activity.notes && (
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.notes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">
              No activities yet. Log your first activity above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
