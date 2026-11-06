<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { ArrowUpRight, LineChart, Wallet, Zap } from 'lucide-vue-next';
import CoinIcon from '../CoinIcon.vue';
import PlatformDownloads from '../home/PlatformDownloads.vue';
import TokenLaunch from '../home/TokenLaunch.vue';
import { markets, marketKey, type Market } from '../../data/markets';
import { tickerFeed } from '../../data/ticker';
import { changeClass, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { tradePath } from '../../lib/pairs';
import SwapCard from '../SwapCard.vue';

const tick = useLiveTick();
const order = ['BTC', 'ETH', 'SOL', 'HYPE', 'BNB', 'DOGE'];
const activeTab = ref('hot');

const spotlight = computed(() => {
  void tick.value;
  return order.flatMap((symbol) => {
    const market = markets.find((item) => item.symbol === symbol && item.kind === 'perp');
    if (!market) return [];
    return [{ ...market, live: wobble(market.price, market.symbol.length) }];
  });
});

const pulseRows = computed(() => {
  const rows = [...spotlight.value];
  if (activeTab.value === 'gainers') return rows.sort((a, b) => b.change - a.change);
  if (activeTab.value === 'losers') return rows.sort((a, b) => a.change - b.change);
  return rows;
});

const tabs = [
  { id: 'hot', label: 'Hot' },
  { id: 'top', label: 'Top' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
];

const infrastructure = [
  { href: '/markets', title: 'Markets', kicker: 'Market discovery', body: 'Browse the markets interface', icon: LineChart },
  { href: '/spot', title: 'Spot', kicker: 'Spot interface', body: 'Open the spot trading route', icon: ArrowUpRight },
  { href: '/futures', title: 'Futures', kicker: 'Futures interface', body: 'Open the futures route', icon: Zap },
  { href: '/wallet', title: 'Wallet', kicker: 'Wallet access', body: 'Review wallet connection options', icon: Wallet },
];

function pathFor(market: Market) {
  return tradePath(market.symbol, market.kind);
}

function boardPrice(value: number) {
  if (value >= 1) return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return formatPrice(value);
}
</script>

<template>
  <div>
    <section class="relative overflow-hidden">
      <div
        class="pointer-events-none absolute inset-0"
        style="background: radial-gradient(640px 320px at 80% 20%, var(--glow), transparent 70%)"
      />
      <div class="relative mx-auto grid w-full max-w-[1280px] items-center gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.9fr] lg:py-16">
        <div>
          <p class="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-mint">
            <span class="h-1.5 w-1.5 rounded-full bg-mint" />
            Non-custodial web3 exchange
          </p>
          <h1 class="mt-5 max-w-xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl">
            Trade Crypto
            <span class="mt-1 block text-mint">Without Limits.</span>
          </h1>
          <p class="mt-5 max-w-md text-base leading-relaxed text-muted">
            XELORA is a non-custodial crypto trading platform built for secure swaps, spot markets and perpetual trading. Connect your wallet and keep full control of your assets.
          </p>
          <div class="mt-7 flex flex-wrap gap-3">
            <RouterLink to="/swap" class="mint-btn btn-square h-11 px-5">Start Swapping</RouterLink>
            <RouterLink to="/markets" class="ghost-btn btn-square h-11 px-5">Explore Markets</RouterLink>
            <RouterLink to="/futures" class="ghost-btn btn-square h-11 px-5">Trade Futures</RouterLink>
          </div>
          <div class="mt-10 grid max-w-lg grid-cols-2 gap-6 border-t border-line pt-6">
            <div>
              <p class="text-4xl font-semibold num">{{ tickerFeed.length }}</p>
              <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Market symbols returned</p>
            </div>
            <div>
              <p class="text-4xl font-semibold text-mint">Connected</p>
              <p class="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">Ticker feed status</p>
            </div>
          </div>
        </div>
        <div class="mx-auto w-full max-w-[460px]">
          <SwapCard />
        </div>
      </div>
    </section>

    <section class="mx-auto w-full max-w-[1100px] px-4 pt-4">
      <h2 class="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Live cryptocurrency prices today</h2>
      <div class="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <RouterLink
          v-for="market in spotlight"
          :key="marketKey(market)"
          :to="pathFor(market)"
          class="rounded-2xl border border-line bg-elev px-3 py-3 hover:border-mint/50"
        >
          <span class="flex items-center gap-2">
            <CoinIcon :symbol="market.symbol" :size="22" />
            <span class="text-sm font-bold">{{ market.symbol }}</span>
            <span class="ms-auto rounded-full bg-ask/15 px-1.5 py-0.5 text-[10px] font-bold num" :class="changeClass(market.change)">
              {{ formatSigned(market.change) }}
            </span>
          </span>
          <span class="mt-3 block text-lg font-semibold num">{{ boardPrice(market.live) }}</span>
        </RouterLink>
      </div>
    </section>

    <section class="mx-auto grid w-full max-w-[1100px] gap-4 px-4 py-8 lg:grid-cols-[1.45fr_0.7fr]">
      <div class="rounded-[1.5rem] border border-line bg-elev p-5">
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 class="text-3xl font-bold tracking-tight">Market Pulse</h2>
            <p class="mt-1 text-sm text-muted">Live market statistics and trends</p>
          </div>
          <div class="inline-flex rounded-full bg-soft p-1" role="tablist">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              role="tab"
              class="rounded-full px-4 py-1.5 text-sm font-semibold"
              :class="activeTab === tab.id ? 'bg-bg text-mint' : 'text-muted'"
              :aria-selected="activeTab === tab.id"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <ul class="mt-4">
          <li v-for="market in pulseRows" :key="marketKey(market) + activeTab">
            <RouterLink :to="pathFor(market)" class="flex items-center gap-3 border-t border-line/70 py-3.5">
              <CoinIcon :symbol="market.symbol" :size="36" />
              <span class="min-w-0">
                <span class="block font-bold">{{ market.symbol }}</span>
                <span class="block text-xs text-muted num">Vol: {{ Math.round(market.volume).toLocaleString('en-US') }}</span>
              </span>
              <span class="ms-auto text-end">
                <span class="block font-semibold num">{{ boardPrice(market.live) }}</span>
                <span class="block text-xs font-semibold num" :class="changeClass(market.change)">{{ formatSigned(market.change) }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <aside class="flex min-h-full flex-col rounded-[1.5rem] border border-line bg-elev p-5">
        <h2 class="text-2xl font-bold tracking-tight">Transparency Hub</h2>
        <div class="grid flex-1 place-items-center py-16 text-center">
          <p class="text-sm text-muted">No published announcements.</p>
        </div>
        <RouterLink to="/announcements" class="ghost-btn h-11 w-full">View all announcements</RouterLink>
      </aside>
    </section>

    <section class="mx-auto w-full max-w-[1100px] px-4 pb-6">
      <div class="rounded-[1.75rem] border border-mint/25 bg-elev px-5 py-12 shadow-[0_0_80px_rgba(14,203,129,0.07)] sm:px-8">
        <h2 class="text-center text-4xl font-extrabold tracking-tight">XCOINO Infrastructure</h2>
        <p class="mx-auto mt-3 max-w-xl text-center text-sm leading-relaxed text-muted">
          Explore the product areas available in this application. Live data and trading actions depend on their connected services.
        </p>
        <div class="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <RouterLink
            v-for="item in infrastructure"
            :key="item.href"
            :to="item.href"
            class="rounded-2xl border border-line bg-bg/40 px-4 py-8 text-center hover:border-mint/40"
          >
            <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint/12 text-mint">
              <component :is="item.icon" class="h-5 w-5" />
            </span>
            <span class="mt-5 block text-2xl font-extrabold">{{ item.title }}</span>
            <span class="mt-1 block text-[11px] font-bold uppercase tracking-[0.14em] text-mint">{{ item.kicker }}</span>
            <span class="mt-2 block text-sm text-muted">{{ item.body }}</span>
          </RouterLink>
        </div>
      </div>
    </section>

    <PlatformDownloads />
    <TokenLaunch />
  </div>
</template>
