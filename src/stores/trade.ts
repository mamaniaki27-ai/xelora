import { defineStore } from 'pinia';
import { ref } from 'vue';

export type PreviewOrder = {
  id: number;
  pair: string;
  side: string;
  orderType: 'limit' | 'market';
  price: number;
  size: number;
  leverage: number;
  createdAt: string;
};

export const useTradeStore = defineStore('trade', () => {
  const favorites = ref<string[]>(readFavorites());
  const orders = ref<PreviewOrder[]>([]);
  let nextId = 1;

  function toggleFavorite(key: string) {
    favorites.value = favorites.value.includes(key)
      ? favorites.value.filter((item) => item !== key)
      : [...favorites.value, key];
    localStorage.setItem('xelora-favorites', JSON.stringify(favorites.value));
  }

  function isFavorite(key: string) {
    return favorites.value.includes(key);
  }

  function addOrder(order: Omit<PreviewOrder, 'id' | 'createdAt'>) {
    orders.value.unshift({
      ...order,
      id: nextId++,
      createdAt: new Date().toISOString(),
    });
  }

  return { favorites, orders, toggleFavorite, isFavorite, addOrder };
});

function readFavorites() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('xelora-favorites') || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}
