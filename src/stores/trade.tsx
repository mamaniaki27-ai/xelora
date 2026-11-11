import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

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

type TradeValue = {
  favorites: string[];
  orders: PreviewOrder[];
  toggleFavorite: (key: string) => void;
  isFavorite: (key: string) => boolean;
  addOrder: (order: Omit<PreviewOrder, 'id' | 'createdAt'>) => void;
};

const TradeContext = createContext<TradeValue | null>(null);

function readFavorites() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('xelora-favorites') || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function TradeProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(readFavorites);
  const [orders, setOrders] = useState<PreviewOrder[]>([]);
  const [nextId, setNextId] = useState(1);

  const value = useMemo<TradeValue>(() => {
    return {
      favorites,
      orders,
      toggleFavorite: (key: string) => {
        const next = favorites.includes(key) ? favorites.filter((item) => item !== key) : [...favorites, key];
        setFavorites(next);
        localStorage.setItem('xelora-favorites', JSON.stringify(next));
      },
      isFavorite: (key: string) => favorites.includes(key),
      addOrder: (order) => {
        setOrders((current) => [{ ...order, id: nextId, createdAt: new Date().toISOString() }, ...current]);
        setNextId((id) => id + 1);
      },
    };
  }, [favorites, orders, nextId]);

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
}

export function useTradeStore() {
  const value = useContext(TradeContext);
  if (!value) throw new Error('useTradeStore must be used within TradeProvider');
  return value;
}
