"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, daysSince, isOverdue } from "@/lib/utils";
import type { Prospect } from "@/lib/db/schema";
import {
  Clock,
  AlertTriangle,
  ThermometerSun,
  ThermometerSnowflake,
  Flame,
} from "lucide-react";
import Link from "next/link";

interface ProspectCardProps {
  prospect: Prospect;
}

const tempIcon = {
  hot: Flame,
  warm: ThermometerSun,
  cold: ThermometerSnowflake,
};

export function ProspectCard({ prospect }: ProspectCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: prospect.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const daysInStage = daysSince(prospect.stageEnteredAt);
  const overdue = isOverdue(prospect.nextFollowUp);
  const TempIcon = tempIcon[prospect.temperature] || ThermometerSun;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between mb-2">
        <Link
          href={`/prospects/${prospect.id}`}
          className="font-medium text-sm text-[#1B2A4A] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {prospect.firstName} {prospect.lastName}
        </Link>
        <Badge
          variant={prospect.temperature as "hot" | "warm" | "cold"}
          className="text-[10px] px-1.5 py-0"
        >
          <TempIcon className="h-3 w-3 mr-0.5" />
          {prospect.temperature}
        </Badge>
      </div>

      <p className="text-xs text-gray-500 mb-2">
        {formatCurrency(Number(prospect.investableCapital))}
      </p>

      <div className="flex items-center justify-between text-[10px] text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {daysInStage}d in stage
        </span>
        {overdue && (
          <span className="flex items-center gap-1 text-red-500">
            <AlertTriangle className="h-3 w-3" />
            Overdue
          </span>
        )}
      </div>

      {prospect.nextFollowUp && !overdue && (
        <p className="text-[10px] text-gray-400 mt-1">
          Follow-up: {new Date(prospect.nextFollowUp).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
