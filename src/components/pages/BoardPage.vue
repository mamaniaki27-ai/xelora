<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CoinIcon from '../CoinIcon.vue';
import FavoriteStar from '../FavoriteStar.vue';
import Sparkline from '../Sparkline.vue';
import { marketKey, markets, tagFilters, type Market } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';

const props = defineProps<{ mode: 'pulse' | 'funding' | 'screener' }>();

const query = ref('');
const tag = ref('all');

const title = computed(() => {
  if (props.mode === 'funding') return 'Funding & liquidation radar';
  if (props.mode === 'screener') return 'Indicator screener';
  return 'Market pulse & watchlist';
});

const rows = computed(() => {
  const q = query.value.trim().toLowerCase();
  return markets
    .filter((market) => market.kind === 'perp')
    .filter((market) => (tag.value === 'all' ? true : market.tags.includes(tag.value)))
    .filter((market) => !q || `${market.symbol} ${market.pair} ${market.tags.join(' ')}`.toLowerCase().includes(q))
    .slice()
    .sort((a, b) => {
      if (props.mode === 'funding') return Math.abs(b.funding ?? 0) - Math.abs(a.funding ?? 0);
      return Math.abs(b.change) - Math.abs(a.change);
    });
});

function openPath(market: Market) {
  return tradePath(market.symbol, market.kind);
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1100px] px-4 py-8">
    <h1 class="text-3xl font-semibold">{{ title }}</h1>
    <p class="mt-2 text-sm text-muted">Search the published perpetual list. Figures are the local market snapshot.</p>
    <form class="mt-5" role="search" @submit.prevent>
      <label class="block">
        <span class="sr-only">Search markets</span>
        <input v-model="query" class="field w-full rounded-xl border border-line bg-elev px-4 py-2.5 sm:max-w-md" placeholder="Search markets..." />
      </label>
    </form>
    <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
      <button type="button" class="inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold" :class="tag === 'all' ? 'bg-ink text-bg' : 'bg-soft text-ink'" @click="tag = 'all'">All tags</button>
      <button v-for="item in tagFilters" :key="item" type="button" class="inline-flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold" :class="tag === item ? 'bg-ink text-bg' : 'bg-soft text-ink'" @click="tag = item">{{ item }}</button>
    </div>
    <div class="mt-4 overflow-x-auto">
      <table class="w-full min-w-[720px] text-sm">
        <thead class="text-xs uppercase text-muted">
          <tr>
            <th class="px-2 py-2 text-start font-medium">Market</th>
            <th class="px-2 py-2 text-end font-medium">Price</th>
            <th class="px-2 py-2 text-end font-medium">{{ mode === 'funding' ? 'Funding' : '24h' }}</th>
            <th class="px-2 py-2 text-end font-medium">Chart</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="market in rows" :key="marketKey(market)" class="border-t border-line">
            <td class="px-2 py-3">
              <div class="flex items-center gap-2">
                <FavoriteStar :id="marketKey(market)" />
                <CoinIcon :symbol="market.symbol" :size="32" />
                <RouterLink :to="openPath(market)">
                  <span class="block font-semibold">{{ market.symbol }}</span>
                  <span class="block text-xs text-muted">{{ market.pair }}</span>
                </RouterLink>
              </div>
            </td>
            <td class="px-2 py-3 text-end font-semibold num">{{ formatPrice(market.price) }}</td>
            <td class="px-2 py-3 text-end font-semibold num" :class="changeClass(mode === 'funding' ? (market.funding ?? 0) : market.change)">
              {{ mode === 'funding' ? `${(market.funding ?? 0).toFixed(4)}%` : formatSigned(market.change) }}
            </td>
            <td class="px-2 py-3">
              <div class="flex justify-end"><Sparkline :symbol="market.symbol" :price="market.price" :change="market.change" /></div>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="rows.length === 0" class="py-10 text-center text-sm text-muted">No markets match that search.</p>
    </div>
    <p class="mt-4 text-xs text-muted">{{ rows.length }} markets · {{ formatCompact(rows.reduce((sum, market) => sum + market.volume, 0)) }} volume</p>
  </section>
</template>
