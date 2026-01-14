import { create } from 'zustand'

interface FilterState {
  selectedColor: string | null
  selectedTag: string | null
  setColorFilter: (color: string | null) => void
  setTagFilter: (tag: string | null) => void
  clearFilters: () => void
}

export const useFilterStore = create<FilterState>((set) => ({
  selectedColor: null,
  selectedTag: null,
  setColorFilter: (color) => set({ selectedColor: color }),
  setTagFilter: (tag) => set({ selectedTag: tag }),
  clearFilters: () => set({ selectedColor: null, selectedTag: null }),
}))
