"use client";

import { useChecklist, useToggleChecklistItem } from "@/hooks/use-checklist";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Square } from "lucide-react";

export default function ChecklistPage() {
  const { data: sections = [], isLoading } = useChecklist();
  const toggleItem = useToggleChecklistItem();

  const totalItems = sections.reduce(
    (sum, s) => sum + (s.items?.length || 0),
    0
  );
  const completedItems = sections.reduce(
    (sum, s) => sum + (s.items?.filter((i) => i.completed).length || 0),
    0
  );
  const overallPct = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B2A4A]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B2A4A]">
          Launch Readiness Tracker
        </h1>
        <div className="mt-4 max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Overall Readiness
            </span>
            <span className="text-sm font-bold text-[#1B2A4A]">
              {Math.round(overallPct)}%
            </span>
          </div>
          <Progress value={overallPct} />
          <p className="text-xs text-gray-400 mt-1">
            {completedItems} of {totalItems} tasks complete
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {sections.map((section) => {
          const sectionTotal = section.items?.length || 0;
          const sectionDone =
            section.items?.filter((i) => i.completed).length || 0;
          const sectionPct =
            sectionTotal > 0 ? (sectionDone / sectionTotal) * 100 : 0;

          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{section.name}</CardTitle>
                  <span className="text-sm text-gray-500">
                    {sectionDone}/{sectionTotal}
                  </span>
                </div>
                <Progress value={sectionPct} className="mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {section.items?.map((item) => (
                    <button
                      key={item.id}
                      onClick={() =>
                        toggleItem.mutate({
                          id: item.id,
                          completed: !item.completed,
                        })
                      }
                      className="flex items-start gap-3 w-full text-left p-2 rounded hover:bg-gray-50 transition-colors min-h-[44px]"
                    >
                      {item.completed ? (
                        <CheckSquare className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          item.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
