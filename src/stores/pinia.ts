import type { Pinia } from 'pinia';
import { createPinia } from 'pinia';

const key = '__xeloraPinia__';

type Host = typeof globalThis & { [key]?: Pinia };

export function getPinia() {
  const host = globalThis as Host;
  if (!host[key]) host[key] = createPinia();
  return host[key];
}
