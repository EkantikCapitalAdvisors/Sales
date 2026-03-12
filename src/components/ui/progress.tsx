import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const color =
    percentage < 33
      ? "bg-red-500"
      : percentage < 66
      ? "bg-amber-500"
      : "bg-green-500";

  return (
    <div
      className={cn("relative h-3 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 rounded-full", color)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export { Progress };
