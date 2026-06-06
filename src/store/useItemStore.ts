import { create } from 'zustand';
import type { ServiceItem, GuideScene } from '@/types';
import { serviceItems, guideScenes } from '@/mock/items';

interface ItemStore {
  items: ServiceItem[];
  currentItem: ServiceItem | null;
  guideScenes: GuideScene[];
  fetchItems: (filters?: { category?: string; keyword?: string }) => void;
  fetchItemDetail: (id: string) => ServiceItem | undefined;
  setCurrentItem: (item: ServiceItem | null) => void;
  getCategories: () => string[];
}

export const useItemStore = create<ItemStore>((set, get) => ({
  items: serviceItems,
  currentItem: null,
  guideScenes,

  fetchItems: (filters) => {
    let result = [...serviceItems];
    if (filters?.category) {
      result = result.filter((item) => item.category === filters.category);
    }
    if (filters?.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(keyword) ||
          item.description.toLowerCase().includes(keyword)
      );
    }
    set({ items: result });
  },

  fetchItemDetail: (id: string) => {
    const item = serviceItems.find((i) => i.id === id);
    if (item) {
      set({ currentItem: item });
    }
    return item;
  },

  setCurrentItem: (item: ServiceItem | null) => {
    set({ currentItem: item });
  },

  getCategories: () => {
    const categories = new Set(serviceItems.map((item) => item.category));
    return Array.from(categories);
  }
}));
