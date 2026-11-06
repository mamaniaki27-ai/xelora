<script setup lang="ts">
import { computed, ref } from 'vue';

type Entry = {
  id: number;
  pair: string;
  side: 'long' | 'short';
  entry: number;
  exit: number;
  size: number;
  note: string;
  at: string;
};

const storageKey = 'xelora-journal';
const entries = ref<Entry[]>(readEntries());
const query = ref('');
const pair = ref('BTC/USDC');
const side = ref<'long' | 'short'>('long');
const entry = ref('100');
const exit = ref('110');
const size = ref('1');
const note = ref('');

const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  return entries.value.filter((item) => !q || `${item.pair} ${item.side} ${item.note}`.toLowerCase().includes(q));
});

const stats = computed(() => {
  const rows = visible.value.map((item) => pnl(item));
  const wins = rows.filter((value) => value > 0).length;
  const net = rows.reduce((sum, value) => sum + value, 0);
  return {
    count: rows.length,
    winRate: rows.length ? (wins / rows.length) * 100 : 0,
    net,
  };
});

function pnl(item: Entry) {
  const sign = item.side === 'long' ? 1 : -1;
  return (item.exit - item.entry) * item.size * sign;
}

function add() {
  const entryNum = Number(entry.value);
  const exitNum = Number(exit.value);
  const sizeNum = Number(size.value);
  if (!pair.value.trim() || !entryNum || !exitNum || !sizeNum) return;
  entries.value = [{
    id: Date.now(),
    pair: pair.value.trim(),
    side: side.value,
    entry: entryNum,
    exit: exitNum,
    size: sizeNum,
    note: note.value.trim(),
    at: new Date().toISOString(),
  }, ...entries.value];
  note.value = '';
  localStorage.setItem(storageKey, JSON.stringify(entries.value));
}

function remove(id: number) {
  entries.value = entries.value.filter((item) => item.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(entries.value));
}

function readEntries(): Entry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item && typeof item.pair === 'string' && typeof item.entry === 'number');
  } catch {
    return [];
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-8">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Explore</p>
    <h1 class="mt-2 text-3xl font-semibold">Trading Journal</h1>
    <p class="mt-2 max-w-3xl text-sm text-muted">
      A private log of planned and closed trades. Entries stay in this browser. Nothing is sent to a server and nothing here places an order.
    </p>

    <div class="mt-6 grid gap-3 sm:grid-cols-3">
      <article class="panel p-4"><p class="text-xs text-muted">Logged trades</p><p class="mt-1 text-2xl font-semibold num">{{ stats.count }}</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Win rate</p><p class="mt-1 text-2xl font-semibold num">{{ stats.winRate.toFixed(1) }}%</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Net result</p><p class="mt-1 text-2xl font-semibold num" :class="stats.net < 0 ? 'text-ask' : 'text-bid'">{{ stats.net.toFixed(2) }}</p></article>
    </div>

    <form class="panel mt-4 grid gap-3 p-4 md:grid-cols-6" @submit.prevent="add()">
      <label class="text-sm md:col-span-2">
        <span class="text-xs text-muted">Pair</span>
        <input v-model="pair" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
      </label>
      <label class="text-sm">
        <span class="text-xs text-muted">Side</span>
        <select v-model="side" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3">
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </label>
      <label class="text-sm">
        <span class="text-xs text-muted">Entry</span>
        <input v-model="entry" inputmode="decimal" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
      </label>
      <label class="text-sm">
        <span class="text-xs text-muted">Exit</span>
        <input v-model="exit" inputmode="decimal" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
      </label>
      <label class="text-sm">
        <span class="text-xs text-muted">Size</span>
        <input v-model="size" inputmode="decimal" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" />
      </label>
      <label class="text-sm md:col-span-5">
        <span class="text-xs text-muted">Note</span>
        <input v-model="note" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3" placeholder="Setup, invalidation, what you would repeat" />
      </label>
      <button type="submit" class="mint-btn h-10 self-end">Save trade</button>
    </form>

    <div class="mt-4 flex items-center justify-between gap-3">
      <label class="w-full max-w-sm">
        <span class="sr-only">Search journal</span>
        <input v-model="query" class="field h-10 rounded-xl border border-line bg-elev px-3 text-sm" placeholder="Search pair, side, or note" />
      </label>
      <p class="text-xs text-muted">{{ visible.length }} shown</p>
    </div>

    <div class="panel mt-3 overflow-x-auto">
      <p v-if="visible.length === 0" class="px-4 py-8 text-sm text-muted">No journal rows yet. Save a closed trade to start the log.</p>
      <table v-else class="w-full min-w-[760px] text-sm">
        <thead class="text-xs uppercase tracking-wide text-muted">
          <tr>
            <th class="px-3 py-2 text-start font-medium">When</th>
            <th class="px-3 py-2 text-start font-medium">Pair</th>
            <th class="px-3 py-2 text-start font-medium">Side</th>
            <th class="px-3 py-2 text-end font-medium">Entry</th>
            <th class="px-3 py-2 text-end font-medium">Exit</th>
            <th class="px-3 py-2 text-end font-medium">Result</th>
            <th class="px-3 py-2 text-start font-medium">Note</th>
            <th class="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in visible" :key="item.id" class="border-t border-line">
            <td class="px-3 py-3 text-muted">{{ new Date(item.at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
            <td class="px-3 py-3 font-semibold">{{ item.pair }}</td>
            <td class="px-3 py-3 capitalize" :class="item.side === 'long' ? 'text-bid' : 'text-ask'">{{ item.side }}</td>
            <td class="px-3 py-3 text-end num">{{ item.entry }}</td>
            <td class="px-3 py-3 text-end num">{{ item.exit }}</td>
            <td class="px-3 py-3 text-end num" :class="pnl(item) < 0 ? 'text-ask' : 'text-bid'">{{ pnl(item).toFixed(2) }}</td>
            <td class="px-3 py-3 text-muted">{{ item.note || '—' }}</td>
            <td class="px-3 py-3 text-end"><button type="button" class="text-xs text-muted" @click="remove(item.id)">Remove</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
