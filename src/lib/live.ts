import { useEffect, useState } from 'react';

let liveTick = 0;
const listeners = new Set<() => void>();
const globalKey = '__xeloraLiveTimer__';

type Host = typeof globalThis & { [globalKey]?: number };

function ensureTimer() {
  if (typeof window === 'undefined') return;
  const host = globalThis as Host;
  if (host[globalKey]) return;
  host[globalKey] = window.setInterval(() => {
    liveTick += 1;
    listeners.forEach((listener) => listener());
  }, 4000);
}

export function useLiveTick() {
  const [value, setValue] = useState(liveTick);
  useEffect(() => {
    ensureTimer();
    const listener = () => setValue(liveTick);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);
  return value;
}

export function wobble(base: number, salt = 0) {
  const wave = Math.sin(liveTick * 0.7 + salt + base / 1000);
  return base * (1 + wave * 0.00035);
}
