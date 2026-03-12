"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Activity } from "@/lib/db/schema";

async function fetchActivities(prospectId: string): Promise<Activity[]> {
  const res = await fetch(`/api/activities?prospectId=${prospectId}`);
  if (!res.ok) throw new Error("Failed to fetch activities");
  return res.json();
}

async function createActivity(
  data: Record<string, unknown>
): Promise<Activity> {
  const res = await fetch("/api/activities", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create activity");
  return res.json();
}

export function useActivities(prospectId: string) {
  return useQuery({
    queryKey: ["activities", prospectId],
    queryFn: () => fetchActivities(prospectId),
    enabled: !!prospectId,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["activities", data.prospectId],
      });
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
    },
  });
}
