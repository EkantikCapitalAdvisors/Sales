"use client";

import { create } from "zustand";
import type { StageId } from "@/lib/constants";

interface PipelineFilters {
  temperature: string | null;
  capitalMin: number | null;
  capitalMax: number | null;
  source: string | null;
  search: string;
}

interface PipelineStore {
  filters: PipelineFilters;
  sortBy: string;
  draggedProspectId: string | null;
  setFilter: (key: keyof PipelineFilters, value: string | number | null) => void;
  setSortBy: (sort: string) => void;
  setDraggedProspectId: (id: string | null) => void;
  resetFilters: () => void;
}

const defaultFilters: PipelineFilters = {
  temperature: null,
  capitalMin: null,
  capitalMax: null,
  source: null,
  search: "",
};

export const usePipelineStore = create<PipelineStore>((set) => ({
  filters: defaultFilters,
  sortBy: "temperature",
  draggedProspectId: null,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setSortBy: (sort) => set({ sortBy: sort }),
  setDraggedProspectId: (id) => set({ draggedProspectId: id }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
