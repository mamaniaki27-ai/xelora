<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CoinIcon from '../CoinIcon.vue';
import Sparkline from '../Sparkline.vue';
import { markets, marketKey } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { tradePath } from '../../lib/pairs';

const tick = useLiveTick();
const watchlist = ref<string[]>(readList());
const pick = ref('');

const live = computed(() => {
  void tick.value;
  return markets.map((market) => ({ ...market, live: wobble(market.price, market.symbol.length) }));
});

const movers = computed(() => [...live.value].sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 10));
const saved = computed(() => live.value.filter((market) => watchlist.value.includes(marketKey(market))));

function add() {
  if (!pick.value || watchlist.value.includes(pick.value)) return;
  watchlist.value = [pick.value, ...watchlist.value];
  localStorage.setItem('xelora-watchlist', JSON.stringify(watchlist.value));
  pick.value = '';
}

function remove(key: string) {
  watchlist.value = watchlist.value.filter((item) => item !== key);
  localStorage.setItem('xelora-watchlist', JSON.stringify(watchlist.value));
}

function readList() {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem('xelora-watchlist') || '[]');
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : [];
  } catch {
    return [];
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-8">
    <p class="text-xs font-semibold uppercase tracking-[0.16em] text-mint">Explore</p>
    <h1 class="mt-2 text-3xl font-semibold">Market Pulse</h1>
    <p class="mt-2 max-w-3xl text-sm text-muted">
      A clearer view of verified market moves, data freshness, and the assets you follow. Prices on this page are the local market book, refreshed while the tab is open.
    </p>

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <article class="panel p-4"><p class="text-xs text-muted">Verified movers</p><p class="mt-1 text-2xl font-semibold num">{{ movers.length }}</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Selectable</p><p class="mt-1 text-2xl font-semibold num">{{ live.length }}</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Watchlist</p><p class="mt-1 text-2xl font-semibold num">{{ saved.length }}</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Shared market stream</p><p class="mt-1 text-lg font-semibold text-mint">live</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Perpetual context</p><p class="mt-1 text-lg font-semibold">{{ live.filter((m) => m.kind === 'perp').length }} markets</p></article>
    </div>

    <div class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
      <section class="panel p-4" aria-label="Largest 24-hour moves">
        <h2 class="text-lg font-semibold">Largest 24-hour moves</h2>
        <p class="mt-1 text-sm text-muted">Up to 10 markets with a previous-day comparison and a fresh local context.</p>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full min-w-[640px] text-sm">
            <thead class="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th class="px-2 py-2 text-start font-medium">Market</th>
                <th class="px-2 py-2 text-end font-medium">Last</th>
                <th class="px-2 py-2 text-end font-medium">24h</th>
                <th class="px-2 py-2 text-end font-medium">Volume</th>
                <th class="px-2 py-2 text-end font-medium">Chart</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="market in movers" :key="marketKey(market)" class="border-t border-line">
                <td class="px-2 py-3">
                  <RouterLink :to="tradePath(market.symbol, market.kind)" class="flex items-center gap-2 font-semibold">
                    <CoinIcon :symbol="market.symbol" :size="28" />
                    {{ market.pair }}
                    <span class="text-xs font-medium text-muted">{{ market.kind === 'perp' ? 'Perp' : 'Spot' }}</span>
                  </RouterLink>
                </td>
                <td class="px-2 py-3 text-end num">{{ formatPrice(market.live) }}</td>
                <td class="px-2 py-3 text-end num" :class="changeClass(market.change)">{{ formatSigned(market.change) }}</td>
                <td class="px-2 py-3 text-end num text-muted">{{ formatCompact(market.volume) }}</td>
                <td class="px-2 py-3"><Sparkline :symbol="market.symbol" :price="market.price" :change="market.change" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="grid gap-4">
        <section class="panel p-4" aria-label="Build your Watchlist">
          <h2 class="text-lg font-semibold">Build your Watchlist</h2>
          <p class="mt-1 text-sm text-muted">Only markets in the published catalog can be added. Saved in this browser.</p>
          <label class="mt-3 block text-sm">
            <span class="text-xs text-muted">Select a market</span>
            <select v-model="pick" class="field mt-1 h-10 rounded-xl border border-line bg-bg px-3">
              <option value="">Choose from verified markets</option>
              <option v-for="market in live" :key="marketKey(market)" :value="marketKey(market)">{{ market.pair }} · {{ market.kind === 'perp' ? 'Perpetual' : 'Spot' }}</option>
            </select>
          </label>
          <button type="button" class="mint-btn mt-3 h-10 w-full" :disabled="!pick" @click="add()">Add to Watchlist</button>
        </section>
        <section class="panel p-4" aria-label="Your Watchlist">
          <h2 class="text-lg font-semibold">Your Watchlist</h2>
          <p v-if="saved.length === 0" class="mt-3 text-sm text-muted">Your list starts here. Add a verified Spot or Perpetual market above.</p>
          <ul v-else class="mt-3 divide-y divide-line text-sm">
            <li v-for="market in saved" :key="marketKey(market)" class="flex items-center justify-between gap-3 py-2">
              <span class="flex items-center gap-2 font-semibold"><CoinIcon :symbol="market.symbol" :size="22" />{{ market.pair }}</span>
              <span class="num" :class="changeClass(market.change)">{{ formatSigned(market.change) }}</span>
              <button type="button" class="text-xs text-muted" @click="remove(marketKey(market))">Remove</button>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <section class="panel mt-4 p-4">
      <h2 class="text-lg font-semibold">Data transparency</h2>
      <p class="mt-2 max-w-3xl text-sm text-muted">
        Read-only market analytics. The tape refreshes while this page is visible. Capture time is when this browser last drew the book, not an exchange confirmation.
      </p>
    </section>
  </section>
</template>
