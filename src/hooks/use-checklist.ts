"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface ChecklistSection {
  id: string;
  name: string;
  sortOrder: number;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  sectionId: string;
  title: string;
  completed: boolean;
  owner: string | null;
  dueDate: string | null;
  notes: string | null;
  sortOrder: number;
}

async function fetchChecklist(): Promise<ChecklistSection[]> {
  const res = await fetch("/api/checklist");
  if (!res.ok) throw new Error("Failed to fetch checklist");
  return res.json();
}

async function toggleChecklistItem(data: {
  id: string;
  completed: boolean;
}): Promise<ChecklistItem> {
  const res = await fetch("/api/checklist", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update checklist item");
  return res.json();
}

export function useChecklist() {
  return useQuery({ queryKey: ["checklist"], queryFn: fetchChecklist });
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: toggleChecklistItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist"] });
    },
  });
}
