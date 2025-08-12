'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedItem {
  id: string;
  imageUrl: string;
  title?: string;
}

interface SavedState {
  items: SavedItem[];
  save: (item: SavedItem) => void;
  unsave: (id: string) => void;
  toggleSave: (item: SavedItem) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      items: [],
      save: (item) => set((state) => {
        if (state.items.some((it) => it.id === item.id)) return state;
        return { items: [item, ...state.items] };
      }),
      unsave: (id) => set((state) => ({ items: state.items.filter((it) => it.id !== id) })),
      toggleSave: (item) => {
        const exists = get().items.some((it) => it.id === item.id);
        if (exists) {
          set((state) => ({ items: state.items.filter((it) => it.id !== item.id) }));
        } else {
          set((state) => ({ items: [item, ...state.items] }));
        }
      },
      isSaved: (id) => get().items.some((it) => it.id === id),
    }),
    { name: 'artenis_saved_local' }
  )
);


