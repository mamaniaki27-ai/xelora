<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { RefreshCw } from 'lucide-vue-next';
import CoinIcon from '../CoinIcon.vue';
import { markets } from '../../data/markets';
import { formatPrice, formatSigned } from '../../lib/format';
import { tradePath } from '../../lib/pairs';
import { useSessionStore } from '../../stores/session';
import { useTradeStore } from '../../stores/trade';

const session = useSessionStore();
const trade = useTradeStore();
const captured = ref<string | null>(null);
const spinning = ref(false);

const rows = computed(() =>
  markets
    .filter((market) => market.kind === 'perp' && typeof market.funding === 'number')
    .map((market) => ({ ...market, hourly: (market.funding ?? 0) / 8 }))
    .sort((a, b) => Math.abs(b.hourly) - Math.abs(a.hourly)),
);

function refresh() {
  spinning.value = true;
  captured.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  window.setTimeout(() => {
    spinning.value = false;
  }, 500);
}

function distance(entry: number, leverage: number) {
  const maintenance = 0.005;
  return Math.max(0, (1 / leverage - maintenance) * 100);
}
</script>

<template>
  <section class="mx-auto w-full max-w-[1440px] px-4 py-8">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-mint">A2 · Read-only risk data</p>
        <h1 class="mt-2 text-3xl font-semibold">Funding &amp; Liquidation Radar</h1>
        <p class="mt-2 max-w-3xl text-sm text-muted">
          Published perpetual markets only. The funding field is the reported hourly rate, not APR and not a prediction. An 8-hour formula is divided by eight for the hourly display.
        </p>
      </div>
      <button type="button" class="icon-btn inline-grid" aria-label="Refresh data" @click="refresh()">
        <RefreshCw class="h-4 w-4" :class="spinning ? 'animate-spin' : ''" />
      </button>
    </div>

    <div class="mt-6 grid gap-3 sm:grid-cols-2">
      <article class="panel p-4">
        <p class="text-xs uppercase tracking-wide text-muted">Public funding context</p>
        <p class="mt-2 text-sm">Captured: {{ captured ?? 'not captured' }}</p>
      </article>
      <article class="panel p-4">
        <p class="text-xs uppercase tracking-wide text-muted">Wallet position snapshot</p>
        <p class="mt-2 text-sm">Captured: {{ session.address && trade.orders.length ? captured ?? 'this session' : 'not captured' }}</p>
      </article>
    </div>

    <section class="panel mt-4 p-4" aria-label="Open positions">
      <h2 class="text-lg font-semibold">Open positions · reported liquidation distance</h2>
      <p class="mt-1 text-sm text-muted">Connect a wallet to view account positions. Read-only. This page does not ask for or store wallet secrets.</p>
      <p v-if="!session.address" class="mt-4 text-sm">No wallet is connected.</p>
      <button v-if="!session.address" type="button" class="mint-btn mt-3 h-10" @click="session.openPicker()">Connect wallet</button>
      <p v-else-if="trade.orders.length === 0" class="mt-4 text-sm text-muted">{{ session.shortAddress }} has no preview positions in this session.</p>
      <div v-else class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[640px] text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th class="px-2 py-2 text-start font-medium">Position</th>
              <th class="px-2 py-2 text-end font-medium">Entry</th>
              <th class="px-2 py-2 text-end font-medium">Size</th>
              <th class="px-2 py-2 text-end font-medium">Liq. distance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in trade.orders" :key="order.id" class="border-t border-line">
              <td class="px-2 py-3 font-semibold">{{ order.pair }} · {{ order.side }}</td>
              <td class="px-2 py-3 text-end num">{{ formatPrice(order.price) }}</td>
              <td class="px-2 py-3 text-end num">{{ order.size }}</td>
              <td class="px-2 py-3 text-end num" :class="distance(order.price, order.leverage) < 5 ? 'text-ask' : 'text-ink'">
                {{ distance(order.price, order.leverage).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="panel mt-4 p-4" aria-label="Highest absolute current hourly funding rates">
      <h2 class="text-lg font-semibold">Highest absolute current hourly funding rates</h2>
      <p class="mt-1 text-sm text-muted">Reported interval rate, percent per hour. No 24-hour or annualized projection is inferred.</p>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[640px] text-sm">
          <thead class="text-xs uppercase tracking-wide text-muted">
            <tr>
              <th class="px-2 py-2 text-start font-medium">Market</th>
              <th class="px-2 py-2 text-end font-medium">Mark</th>
              <th class="px-2 py-2 text-end font-medium">Hourly</th>
              <th class="px-2 py-2 text-end font-medium">8h reported</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="market in rows" :key="market.pair" class="border-t border-line">
              <td class="px-2 py-3">
                <RouterLink :to="tradePath(market.symbol, 'perp')" class="flex items-center gap-2 font-semibold">
                  <CoinIcon :symbol="market.symbol" :size="24" />
                  {{ market.pair }}
                </RouterLink>
              </td>
              <td class="px-2 py-3 text-end num">{{ formatPrice(market.price) }}</td>
              <td class="px-2 py-3 text-end num" :class="market.hourly < 0 ? 'text-ask' : 'text-bid'">{{ formatSigned(market.hourly) }}</td>
              <td class="px-2 py-3 text-end num">{{ formatSigned(market.funding ?? 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="mt-3 text-xs text-muted">
        The 5% liquidation-distance message is only a conservative display warning around a reported level. It is not a liquidation prediction.
      </p>
    </section>
  </section>
</template>
