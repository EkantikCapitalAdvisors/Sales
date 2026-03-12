"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CheckSquare,
  BarChart3,
  MessageSquare,
  Settings,
  Upload,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/prospects", label: "Prospects", icon: Users },
  { href: "/checklist", label: "Launch Checklist", icon: CheckSquare },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/messaging", label: "Messaging", icon: MessageSquare },
  { href: "/import", label: "Import Data", icon: Upload },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-[#1B2A4A] text-white min-h-screen">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold font-[Georgia,serif] text-[#C8A951]">
          Ekantik Capital
        </h1>
        <p className="text-xs text-white/60 mt-1">Founding Member CRM</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-white/10 text-[#C8A951]"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors w-full">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
