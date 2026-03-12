"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Prospect } from "@/lib/db/schema";

async function fetchProspects(): Promise<Prospect[]> {
  const res = await fetch("/api/prospects");
  if (!res.ok) throw new Error("Failed to fetch prospects");
  return res.json();
}

async function fetchProspect(id: string): Promise<Prospect> {
  const res = await fetch(`/api/prospects/${id}`);
  if (!res.ok) throw new Error("Failed to fetch prospect");
  return res.json();
}

async function createProspect(data: Record<string, unknown>): Promise<Prospect> {
  const res = await fetch("/api/prospects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create prospect");
  return res.json();
}

async function updateProspect({
  id,
  ...data
}: Record<string, unknown> & { id: string }): Promise<Prospect> {
  const res = await fetch(`/api/prospects/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update prospect");
  return res.json();
}

async function deleteProspect(id: string): Promise<void> {
  const res = await fetch(`/api/prospects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete prospect");
}

export function useProspects() {
  return useQuery({ queryKey: ["prospects"], queryFn: fetchProspects });
}

export function useProspect(id: string) {
  return useQuery({
    queryKey: ["prospects", id],
    queryFn: () => fetchProspect(id),
    enabled: !!id,
  });
}

export function useCreateProspect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProspect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
    },
  });
}

export function useUpdateProspect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProspect,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
      queryClient.invalidateQueries({ queryKey: ["prospects", data.id] });
    },
  });
}

export function useDeleteProspect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProspect,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prospects"] });
    },
  });
}
