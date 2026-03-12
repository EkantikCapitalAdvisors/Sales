"use client";

import Link from "next/link";
import { useProspects } from "@/hooks/use-prospects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { PIPELINE_STAGES } from "@/lib/constants";
import { Plus, Search } from "lucide-react";
import { useState } from "react";

export default function ProspectsPage() {
  const { data: prospects = [], isLoading } = useProspects();
  const [search, setSearch] = useState("");

  const filtered = prospects.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  const getStageLabel = (stageId: string) =>
    PIPELINE_STAGES.find((s) => s.id === stageId)?.label || stageId;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1B2A4A]">Prospects</h1>
        <Link href="/prospects/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Prospect
          </Button>
        </Link>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search prospects..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1B2A4A]" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Capital
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Stage
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Temp
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">
                    Follow-Up
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/prospects/${p.id}`}
                        className="font-medium text-[#1B2A4A] hover:underline"
                      >
                        {p.firstName} {p.lastName}
                      </Link>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatCurrency(Number(p.investableCapital))}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">{getStageLabel(p.stage)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={p.temperature as "hot" | "warm" | "cold"}
                      >
                        {p.temperature}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {p.source}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {p.nextFollowUp
                        ? new Date(p.nextFollowUp).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No prospects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
