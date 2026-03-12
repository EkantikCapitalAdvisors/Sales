"use client";

import { useAnalytics } from "@/hooks/use-analytics";
import { Badge } from "@/components/ui/badge";

export function SeatCounter() {
  const { data } = useAnalytics();
  const remaining = data?.seatsRemaining ?? 25;
  const cap = data?.seatCap ?? 25;
  const isLow = remaining <= 5;

  return (
    <div className="flex items-center gap-2">
      <Badge variant={isLow ? "hot" : "gold"} className="text-sm px-3 py-1">
        {remaining}/{cap} Seats Remaining
      </Badge>
    </div>
  );
}
