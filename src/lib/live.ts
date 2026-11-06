import { ref } from 'vue';

const tick = ref(0);
const globalKey = '__xeloraLiveTimer__';

type Host = typeof globalThis & { [globalKey]?: number };

function ensureTimer() {
  if (typeof window === 'undefined') return;
  const host = globalThis as Host;
  if (host[globalKey]) return;
  host[globalKey] = window.setInterval(() => {
    tick.value += 1;
  }, 4000);
}

ensureTimer();

export function useLiveTick() {
  ensureTimer();
  return tick;
}

export function wobble(base: number, salt = 0) {
  const wave = Math.sin(tick.value * 0.7 + salt + base / 1000);
  return base * (1 + wave * 0.00035);
}
