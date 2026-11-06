<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { RefreshCw, Search } from 'lucide-vue-next';
import FavoriteStar from '../FavoriteStar.vue';
import CoinIcon from '../CoinIcon.vue';
import Sparkline from '../Sparkline.vue';
import { marketKey, markets, tagFilters, type Market } from '../../data/markets';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { tradePath } from '../../lib/pairs';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
const trade = useTradeStore();
const route = useRoute();
const router = useRouter();
const tick = useLiveTick();

const query = ref('');
const kind = ref<'all' | 'spot' | 'perp'>('all');
const tag = ref('all');
const favoritesOnly = ref(false);
const updated = ref<Date | null>(null);
const spinning = ref(false);

function refresh() {
  spinning.value = true;
  updated.value = new Date();
  window.setTimeout(() => {
    spinning.value = false;
  }, 500);
}

const updatedLabel = computed(() =>
  updated.value
    ? updated.value.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'not yet updated',
);

const rows = computed(() => {
  void tick.value;
  const q = query.value.trim().toLowerCase();
  return markets
    .filter((market) => (kind.value === 'all' ? true : market.kind === kind.value))
    .filter((market) => (tag.value === 'all' ? true : market.tags.includes(tag.value)))
    .filter((market) => (favoritesOnly.value ? trade.isFavorite(marketKey(market)) : true))
    .filter((market) => !q || `${market.symbol} ${market.pair} ${market.tags.join(' ')}`.toLowerCase().includes(q))
    .map((market) => ({ ...market, live: wobble(market.price, market.symbol.length + (market.kind === 'spot' ? 3 : 0)) }));
});

const volume = computed(() => rows.value.reduce((sum, market) => sum + market.volume, 0));

function openPath(market: Market) {
  return tradePath(market.symbol, market.kind);
}

const tabs = computed(() => [
  { id: 'all', label: ui.t('markets.all') },
  { id: 'spot', label: ui.t('markets.spot') },
  { id: 'perp', label: ui.t('markets.futures') },
]);
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-4">
    <h1 class="sr-only">{{ route.path === '/crypto-prices' ? 'Crypto prices' : ui.t('nav.markets') }}</h1>
    <label class="flex items-center gap-2 border-b border-line py-2.5">
      <Search class="h-4 w-4 shrink-0 text-muted" />
      <span class="sr-only">Search markets</span>
      <input v-model="query" class="field h-8 text-sm" placeholder="Search markets..." />
    </label>

    <div class="flex gap-6 border-b border-line" role="tablist" aria-label="Market type">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="relative h-9 text-sm font-semibold"
        :class="kind === tab.id && !favoritesOnly ? 'text-ink' : 'text-muted'"
        @click="kind = tab.id as 'all' | 'spot' | 'perp'; favoritesOnly = false"
      >
        {{ tab.label }}
        <span v-if="kind === tab.id && !favoritesOnly" class="absolute inset-x-0 -bottom-px h-[2px] bg-mint" />
      </button>
      <button
        type="button"
        class="relative h-9 text-sm font-semibold"
        :class="favoritesOnly ? 'text-ink' : 'text-muted'"
        @click="favoritesOnly = !favoritesOnly"
      >
        {{ ui.t('markets.favorites') }}
        <span v-if="favoritesOnly" class="absolute inset-x-0 -bottom-px h-[2px] bg-mint" />
      </button>
    </div>

    <div class="mt-3 flex gap-2 overflow-x-auto pb-1">
      <button
        type="button"
        class="inline-flex h-7 shrink-0 items-center rounded px-3 text-xs font-semibold leading-none"
        :class="tag === 'all' ? 'border border-mint/70 bg-mint/10 text-mint' : 'border border-line bg-elev text-muted'"
        @click="tag = 'all'"
      >
        All tags
      </button>
      <button
        v-for="item in tagFilters"
        :key="item"
        type="button"
        class="inline-flex h-7 shrink-0 items-center rounded px-3 text-xs font-semibold leading-none"
        :class="tag === item ? 'border border-mint/70 bg-mint/10 text-mint' : 'border border-line bg-elev text-muted'"
        @click="tag = item"
      >
        {{ item }}
      </button>
    </div>

    <div class="mt-3 flex items-center justify-between gap-3 text-xs text-muted">
      <p>
        <span class="text-mint">●</span>
        {{ updated ? 'Live' : 'Connecting…' }} · updated {{ updatedLabel }} · {{ rows.length }} · {{ formatCompact(volume) }}
      </p>
      <button type="button" class="inline-grid h-[30px] w-[30px] place-items-center rounded-none text-muted" aria-label="Refresh markets" @click="refresh()">
        <RefreshCw class="h-4 w-4" :class="spinning ? 'animate-spin' : ''" />
      </button>
    </div>

    <div class="mt-2">
      <div class="hidden grid-cols-[minmax(0,2.6fr)_minmax(7rem,1fr)_minmax(8rem,1fr)_minmax(7rem,1fr)_5.5rem] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted md:grid">
        <span>Market</span>
        <span class="text-end">Price</span>
        <span class="text-end">24h Change</span>
        <span class="text-end">24h Volume</span>
        <span class="text-end">Chart</span>
      </div>
      <div
        v-for="market in rows"
        :key="marketKey(market)"
        role="link"
        tabindex="0"
        class="grid cursor-pointer grid-cols-1 items-center rounded-none border-t border-line px-4 py-3 transition-colors hover:bg-white/[0.02] md:grid-cols-[minmax(0,2.6fr)_minmax(7rem,1fr)_minmax(8rem,1fr)_minmax(7rem,1fr)_5.5rem]"
        @click="router.push(openPath(market))"
        @keydown.enter="router.push(openPath(market))"
      >
        <div class="flex min-w-0 items-center gap-2">
          <FavoriteStar :id="marketKey(market)" />
          <CoinIcon :symbol="market.symbol" :size="32" />
          <div class="min-w-0 leading-tight">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-sm font-bold">{{ market.symbol }}</span>
              <span v-if="market.featured" class="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold leading-none text-amber-500">FEATURED</span>
              <span class="rounded bg-white/[0.06] px-1 py-0.5 text-[9px] font-bold leading-none text-slate-400">{{ market.kind === 'perp' ? 'PERP' : 'SPOT' }}</span>
              <span v-if="market.kind === 'perp'" class="rounded bg-amber-500/10 px-1 py-0.5 text-[9px] font-bold leading-none text-amber-500">{{ market.maxLeverage }}×</span>
            </div>
            <p class="mt-0.5 text-[10px] font-medium text-slate-400">{{ market.pair }}</p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span v-for="item in market.tags" :key="item" class="rounded bg-sky-400/10 px-1 py-0.5 text-[8px] leading-none text-sky-300">{{ item }}</span>
            </div>
          </div>
        </div>
        <p class="mt-2 text-end text-sm font-bold num text-[#a8dccb] md:mt-0">{{ formatPrice(market.live) }}</p>
        <div class="mt-1 text-end md:mt-0">
          <p class="text-sm font-bold num" :class="changeClass(market.change)">{{ formatSigned(market.change) }}</p>
          <p v-if="market.funding !== undefined" class="text-[10px] text-slate-400">fund {{ market.funding.toFixed(4) }}% · {{ market.nextFundingMin }}m</p>
        </div>
        <div class="mt-1 text-end text-sm num text-slate-400 md:mt-0">
          <p>{{ formatCompact(market.volume) }}</p>
          <p v-if="market.openInterest" class="text-[10px]">OI {{ formatCompact(market.openInterest) }}</p>
        </div>
        <div class="mt-2 flex justify-end md:mt-0">
          <Sparkline :symbol="market.symbol" :price="market.price" :change="market.change" />
        </div>
      </div>
      <p v-if="rows.length === 0" class="py-10 text-center text-sm text-muted">{{ ui.t('markets.empty') }}</p>
    </div>
  </section>
</template>
