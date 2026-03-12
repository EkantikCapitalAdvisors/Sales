"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { StageColumn } from "./stage-column";
import { ProspectCard } from "./prospect-card";
import { PIPELINE_STAGES } from "@/lib/constants";
import { useProspects, useUpdateProspect } from "@/hooks/use-prospects";
import { useCreateActivity } from "@/hooks/use-activities";
import { usePipelineStore } from "@/stores/pipeline-store";
import type { Prospect } from "@/lib/db/schema";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export function PipelineBoard() {
  const { data: prospects = [], isLoading } = useProspects();
  const updateProspect = useUpdateProspect();
  const createActivity = useCreateActivity();
  const { filters, setFilter } = usePipelineStore();
  const [activeProspect, setActiveProspect] = useState<Prospect | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Filter prospects
  const filtered = prospects.filter((p) => {
    if (p.stage === "lost" || p.stage === "paused") return false;
    if (filters.search) {
      const search = filters.search.toLowerCase();
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      if (!name.includes(search) && !p.email.toLowerCase().includes(search))
        return false;
    }
    if (filters.temperature && p.temperature !== filters.temperature)
      return false;
    if (filters.source && p.source !== filters.source) return false;
    if (
      filters.capitalMin &&
      Number(p.investableCapital) < filters.capitalMin
    )
      return false;
    if (
      filters.capitalMax &&
      Number(p.investableCapital) > filters.capitalMax
    )
      return false;
    return true;
  });

  const handleDragStart = (event: DragStartEvent) => {
    const prospect = prospects.find((p) => p.id === event.active.id);
    setActiveProspect(prospect || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveProspect(null);
    const { active, over } = event;
    if (!over) return;

    const prospectId = active.id as string;
    const targetStage = over.id as string;
    const prospect = prospects.find((p) => p.id === prospectId);
    if (!prospect || prospect.stage === targetStage) return;

    // Update stage
    updateProspect.mutate({
      id: prospectId,
      stage: targetStage,
      stageEnteredAt: new Date().toISOString(),
    });

    // Auto-log stage change activity
    createActivity.mutate({
      prospectId,
      type: "stage_change",
      title: `Stage changed: ${prospect.stage} → ${targetStage}`,
      notes: `Moved via pipeline drag-and-drop`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search prospects..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md border border-gray-200"
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-3 flex-wrap p-3 bg-white rounded-lg border border-gray-200">
          <Select
            value={filters.temperature || ""}
            onChange={(e) =>
              setFilter("temperature", e.target.value || null)
            }
            className="w-36"
          >
            <option value="">All Temps</option>
            <option value="hot">Hot</option>
            <option value="warm">Warm</option>
            <option value="cold">Cold</option>
          </Select>
          <Select
            value={filters.source || ""}
            onChange={(e) => setFilter("source", e.target.value || null)}
            className="w-36"
          >
            <option value="">All Sources</option>
            <option value="referral">Referral</option>
            <option value="linkedin">LinkedIn</option>
            <option value="personal">Personal</option>
            <option value="other">Other</option>
          </Select>
        </div>
      )}

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map((stage) => (
            <StageColumn
              key={stage.id}
              id={stage.id}
              label={stage.label}
              color={stage.color}
              prospects={filtered.filter((p) => p.stage === stage.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeProspect ? (
            <ProspectCard prospect={activeProspect} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
