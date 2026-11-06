<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import CoinIcon from '../CoinIcon.vue';
import { markets } from '../../data/markets';
import { buildCandles } from '../../lib/candles';
import { formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';
import { useTradeStore } from '../../stores/trade';

type Row = {
  symbol: string;
  pair: string;
  close: number;
  change: number;
  rsi: number;
  atr: number;
  trend: 'Bullish' | 'Bearish';
};

const trade = useTradeStore();
const query = ref('');
const resultQuery = ref('');
const timeframe = ref<'15m' | '1H' | '4H' | '24H'>('15m');
const selected = ref<string[]>(['BTC', 'ETH', 'SOL']);
const preset = ref<'all' | 'oversold' | 'overbought' | 'bull' | 'bear' | 'gainers' | 'losers' | 'favorites'>('all');
const sortKey = ref<'change' | 'rsi' | 'close' | 'atr' | 'symbol'>('change');
const direction = ref<'desc' | 'asc'>('desc');
const scanned = ref<Row[]>([]);
const ran = ref(false);

const universe = computed(() => {
  const q = query.value.trim().toLowerCase();
  return markets.filter((market) => market.kind === 'perp' && (!q || market.symbol.toLowerCase().includes(q)));
});

const visible = computed(() => {
  const q = resultQuery.value.trim().toLowerCase();
  const rows = scanned.value.filter((row) => {
    if (q && !row.symbol.toLowerCase().includes(q)) return false;
    if (preset.value === 'oversold') return row.rsi < 35;
    if (preset.value === 'overbought') return row.rsi > 65;
    if (preset.value === 'bull') return row.trend === 'Bullish';
    if (preset.value === 'bear') return row.trend === 'Bearish';
    if (preset.value === 'gainers') return row.change > 0;
    if (preset.value === 'losers') return row.change < 0;
    if (preset.value === 'favorites') return trade.favorites.some((key) => key.startsWith(`perp:${row.symbol}`));
    return true;
  });
  const sign = direction.value === 'desc' ? -1 : 1;
  return [...rows].sort((a, b) => {
    if (sortKey.value === 'symbol') return a.symbol.localeCompare(b.symbol) * sign;
    return (a[sortKey.value] - b[sortKey.value]) * sign;
  });
});

function toggle(symbol: string) {
  if (selected.value.includes(symbol)) {
    selected.value = selected.value.filter((item) => item !== symbol);
    return;
  }
  if (selected.value.length >= 15) return;
  selected.value = [...selected.value, symbol];
}

function majors() {
  selected.value = ['BTC', 'ETH', 'SOL'];
}

function rsi(closes: number[]) {
  let gain = 0;
  let loss = 0;
  for (let index = 1; index < closes.length; index += 1) {
    const delta = closes[index] - closes[index - 1];
    if (delta >= 0) gain += delta;
    else loss -= delta;
  }
  const count = closes.length - 1;
  if (!count || loss === 0) return 100;
  const relative = gain / loss;
  return 100 - 100 / (1 + relative);
}

function scan() {
  const map: Record<string, string> = { '15m': '15m', '1H': '1H', '4H': '4H', '24H': '24H' };
  scanned.value = selected.value.flatMap((symbol) => {
    const market = markets.find((item) => item.symbol === symbol && item.kind === 'perp');
    if (!market) return [];
    const candles = buildCandles(symbol, market.price, market.change, map[timeframe.value]);
    const closes = candles.map((bar) => bar.close);
    const atr = candles.slice(-14).reduce((sum, bar) => sum + (bar.high - bar.low), 0) / 14;
    const sma = closes.slice(-12).reduce((sum, value) => sum + value, 0) / 12;
    return [{
      symbol,
      pair: market.pair,
      close: market.price,
      change: ((closes[closes.length - 1] - closes[0]) / closes[0]) * 100,
      rsi: rsi(closes.slice(-15)),
      atr,
      trend: market.price >= sma ? 'Bullish' as const : 'Bearish' as const,
    }];
  });
  ran.value = true;
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-8">
    <h1 class="text-3xl font-semibold">Market Screener</h1>
    <p class="mt-2 max-w-3xl text-sm text-muted">
      Scan perpetual candles, calculate RSI, ATR, and trend alignment in the browser, then filter and rank the results locally. No order is submitted.
    </p>

    <div class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <article class="panel p-4"><p class="text-xs text-muted">Markets returned</p><p class="mt-1 text-2xl font-semibold num">{{ visible.length }} / {{ selected.length }}</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Ready</p><p class="mt-1 text-2xl font-semibold num">{{ scanned.length }}</p><p class="text-xs text-muted">Indicators with available inputs</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Partial / failed</p><p class="mt-1 text-2xl font-semibold num">0</p></article>
      <article class="panel p-4"><p class="text-xs text-muted">Saved favorites</p><p class="mt-1 text-2xl font-semibold num">{{ trade.favorites.length }}</p><p class="text-xs text-muted">Stored in this browser only</p></article>
    </div>

    <section class="panel mt-4 p-4" aria-label="Choose markets">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-mint">01 · Universe</p>
      <div class="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-lg font-semibold">Choose markets</h2>
        <div class="flex gap-2">
          <button type="button" class="ghost-btn h-8 px-3 text-xs" @click="majors()">Major markets</button>
          <button type="button" class="ghost-btn h-8 px-3 text-xs" @click="selected = []">Clear selection</button>
          <button type="button" class="mint-btn h-8 px-3 text-xs" :disabled="selected.length === 0" @click="scan()">Run scan</button>
        </div>
      </div>
      <label class="mt-3 flex items-center gap-2">
        <span class="sr-only">Find a perpetual market</span>
        <input v-model="query" class="field h-10 rounded-xl border border-line bg-bg px-3 text-sm" placeholder="Search BTC, ETH, SOL…" />
      </label>
      <div class="mt-3 flex max-h-40 flex-wrap gap-2 overflow-y-auto">
        <button
          v-for="market in universe"
          :key="market.symbol"
          type="button"
          class="h-8 rounded-full border px-3 text-xs font-semibold"
          :class="selected.includes(market.symbol) ? 'border-mint bg-mint/15 text-mint' : 'border-line text-ink'"
          :aria-pressed="selected.includes(market.symbol)"
          @click="toggle(market.symbol)"
        >
          {{ market.symbol }} Perpetual
        </button>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span v-for="symbol in selected" :key="symbol" class="inline-flex h-7 items-center gap-2 rounded-full bg-soft px-3 text-xs font-semibold">
          {{ symbol }}
          <button type="button" :aria-label="`Remove ${symbol}`" @click="toggle(symbol)">×</button>
        </span>
        <label class="ms-auto text-sm">
          <span class="sr-only">Candle timeframe</span>
          <select v-model="timeframe" class="field h-9 rounded-xl border border-line bg-bg px-3">
            <option value="15m">15 minutes</option>
            <option value="1H">1 hour</option>
            <option value="4H">4 hours</option>
            <option value="24H">1 day</option>
          </select>
        </label>
      </div>
    </section>

    <section class="panel mt-4 p-4" aria-label="Filter and rank locally">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-mint">02 · Results</p>
      <h2 class="mt-2 text-lg font-semibold">Filter &amp; rank locally</h2>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input v-model="resultQuery" class="field h-9 w-56 rounded-xl border border-line bg-bg px-3 text-sm" placeholder="Filter current results…" />
        <button v-for="item in ['all', 'oversold', 'overbought', 'bull', 'bear', 'gainers', 'losers', 'favorites']" :key="item" type="button" class="h-8 rounded-full px-3 text-xs font-semibold capitalize" :class="preset === item ? 'bg-mint text-mint-ink' : 'bg-soft text-ink'" @click="preset = item as typeof preset">
          {{ item === 'bull' ? 'Bullish alignment' : item === 'bear' ? 'Bearish alignment' : item }}
        </button>
        <select v-model="sortKey" class="field h-9 rounded-xl border border-line bg-bg px-3 text-sm" aria-label="Sort by">
          <option value="change">Window change %</option>
          <option value="rsi">RSI 14</option>
          <option value="close">Last close</option>
          <option value="atr">ATR 14</option>
          <option value="symbol">Symbol</option>
        </select>
        <select v-model="direction" class="field h-9 rounded-xl border border-line bg-bg px-3 text-sm" aria-label="Direction">
          <option value="desc">High to low</option>
          <option value="asc">Low to high</option>
        </select>
      </div>

      <p v-if="!ran" class="mt-8 text-center text-sm text-muted">Choose up to 15 perpetual markets and run a scan. Filtering and indicator math stay in this browser.</p>
      <p v-else-if="visible.length === 0" class="mt-8 text-center text-sm text-muted">No rows match the current filter.</p>
      <div v-else class="mt-4 overflow-x-auto">
        <table class="w-full min-w-[720px] text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th class="px-2 py-2 text-start font-medium">Symbol</th>
              <th class="px-2 py-2 text-end font-medium">Last close</th>
              <th class="px-2 py-2 text-end font-medium">Window change</th>
              <th class="px-2 py-2 text-end font-medium">RSI 14</th>
              <th class="px-2 py-2 text-end font-medium">ATR 14</th>
              <th class="px-2 py-2 text-end font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in visible" :key="row.symbol" class="border-t border-line">
              <td class="px-2 py-3">
                <RouterLink :to="tradePath(row.symbol, 'perp')" class="flex items-center gap-2 font-semibold">
                  <CoinIcon :symbol="row.symbol" :size="24" />{{ row.pair }}
                </RouterLink>
              </td>
              <td class="px-2 py-3 text-end num">{{ formatPrice(row.close) }}</td>
              <td class="px-2 py-3 text-end num" :class="row.change < 0 ? 'text-ask' : 'text-bid'">{{ formatSigned(row.change) }}</td>
              <td class="px-2 py-3 text-end num" :class="row.rsi < 35 ? 'text-bid' : row.rsi > 65 ? 'text-ask' : ''">{{ row.rsi.toFixed(1) }}</td>
              <td class="px-2 py-3 text-end num">{{ formatPrice(row.atr) }}</td>
              <td class="px-2 py-3 text-end" :class="row.trend === 'Bullish' ? 'text-bid' : 'text-ask'">{{ row.trend }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
