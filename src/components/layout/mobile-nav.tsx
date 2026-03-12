"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, Users, BarChart3, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileNavItems = [
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/prospects", label: "Prospects", icon: Users },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/messaging", label: "Messages", icon: MessageSquare },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 min-w-[44px] min-h-[44px] justify-center",
                isActive ? "text-[#1B2A4A]" : "text-gray-400"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
