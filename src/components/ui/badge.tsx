import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#1B2A4A] text-white",
        hot: "bg-red-100 text-red-700",
        warm: "bg-amber-100 text-amber-700",
        cold: "bg-blue-100 text-blue-700",
        success: "bg-green-100 text-green-700",
        outline: "border border-gray-300 text-gray-700",
        gold: "bg-[#C8A951]/20 text-[#A68B3C]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
