"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ProspectCard } from "./prospect-card";
import { formatCurrency } from "@/lib/utils";
import type { Prospect } from "@/lib/db/schema";

interface StageColumnProps {
  id: string;
  label: string;
  color: string;
  prospects: Prospect[];
}

export function StageColumn({
  id,
  label,
  color,
  prospects,
}: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  const totalValue = prospects.reduce(
    (sum, p) => sum + Number(p.estimatedAum || p.investableCapital || 0),
    0
  );

  return (
    <div
      className={`flex flex-col min-w-[280px] lg:min-w-0 lg:flex-1 rounded-lg bg-gray-50 border ${
        isOver ? "border-[#C8A951] bg-[#C8A951]/5" : "border-gray-200"
      }`}
    >
      {/* Column header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
          <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 ml-auto">
            {prospects.length}
          </span>
        </div>
        <p className="text-xs text-gray-400">{formatCurrency(totalValue)}</p>
      </div>

      {/* Prospect cards */}
      <div ref={setNodeRef} className="flex-1 p-2 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)]">
        <SortableContext
          items={prospects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {prospects.map((prospect) => (
            <ProspectCard key={prospect.id} prospect={prospect} />
          ))}
        </SortableContext>
        {prospects.length === 0 && (
          <p className="text-xs text-gray-300 text-center py-8">
            No prospects
          </p>
        )}
      </div>
    </div>
  );
}
