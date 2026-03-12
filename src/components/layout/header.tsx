"use client";

import { Menu } from "lucide-react";
import { SeatCounter } from "@/components/pipeline/seat-counter";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-md"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="lg:hidden">
          <h1 className="text-lg font-bold font-[Georgia,serif] text-[#1B2A4A]">
            Ekantik CRM
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SeatCounter />
      </div>
    </header>
  );
}
