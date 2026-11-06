<script setup lang="ts">
import { computed, ref } from 'vue';
import { ArrowDownUp, ChevronDown, RefreshCw, Settings, Wallet } from 'lucide-vue-next';
import CoinIcon from './CoinIcon.vue';
import { markets } from '../data/markets';
import { formatPrice } from '../lib/format';
import { useLiveTick, wobble } from '../lib/live';
import { useSessionStore } from '../stores/session';

const session = useSessionStore();
const tick = useLiveTick();

const tradable = computed(() => {
  const seen = new Set<string>();
  return markets.filter((market) => {
    if (market.kind !== 'spot' || market.symbol === 'USDC' || seen.has(market.symbol)) return false;
    seen.add(market.symbol);
    return true;
  });
});

const paySymbol = ref('USDC');
const receiveSymbol = ref('');
const amount = ref('');
const slippage = ref(0.5);
const settingsOpen = ref(false);
const marketOpen = ref(false);
const assetMenu = ref<'pay' | 'receive' | ''>('');
const notice = ref('');
const refreshing = ref(false);

const assets = computed(() => [{ symbol: 'USDC' }, ...tradable.value.map((market) => ({ symbol: market.symbol }))]);

function priceOf(symbol: string) {
  void tick.value;
  if (!symbol || symbol === 'USDC') return 1;
  const found = markets.find((market) => market.symbol === symbol && market.kind === 'spot')
    ?? markets.find((market) => market.symbol === symbol);
  return found ? wobble(found.price, symbol.length) : 1;
}

const hasMarket = computed(() => Boolean(receiveSymbol.value));

const output = computed(() => {
  const qty = Number(amount.value);
  if (!hasMarket.value || !Number.isFinite(qty) || qty <= 0) return 0;
  return (qty * priceOf(paySymbol.value)) / priceOf(receiveSymbol.value);
});

function chooseMarket(symbol: string) {
  paySymbol.value = 'USDC';
  receiveSymbol.value = symbol;
  marketOpen.value = false;
  assetMenu.value = '';
  notice.value = '';
}

function toggleAsset(side: 'pay' | 'receive') {
  marketOpen.value = false;
  assetMenu.value = assetMenu.value === side ? '' : side;
}

function chooseAsset(symbol: string) {
  if (assetMenu.value === 'pay') paySymbol.value = symbol;
  if (assetMenu.value === 'receive') receiveSymbol.value = symbol;
  assetMenu.value = '';
  notice.value = '';
}

function flip() {
  if (!receiveSymbol.value || receiveSymbol.value === paySymbol.value) return;
  const nextPay = receiveSymbol.value;
  receiveSymbol.value = paySymbol.value;
  paySymbol.value = nextPay;
}

function refreshQuote() {
  refreshing.value = true;
  notice.value = '';
  window.setTimeout(() => {
    refreshing.value = false;
  }, 700);
}

function submit() {
  notice.value = '';
  if (!session.address) {
    session.openPicker();
    return;
  }
  if (!hasMarket.value || !output.value) {
    notice.value = 'Select a market and enter an amount.';
    return;
  }
  notice.value = 'Preview only. No swap was sent.';
}
</script>

<template>
  <div>
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 class="text-[1.65rem] font-semibold tracking-tight">Swap</h2>
      <span class="rounded-full border border-mint/40 px-3 py-1 text-xs font-medium text-mint">Hyperliquid Spot</span>
    </div>

    <section class="rounded-[1.6rem] border border-line bg-elev p-3 sm:p-4">
      <div class="flex items-center gap-2 rounded-full border border-line bg-soft/80 px-2 py-1.5">
        <button
          type="button"
          class="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mint"
          aria-label="Refresh markets"
          @click="refreshQuote"
        >
          <RefreshCw class="h-4 w-4" :class="refreshing ? 'animate-spin' : ''" />
        </button>
        <div class="relative min-w-0">
          <button
            type="button"
            class="inline-flex max-w-full items-center gap-1 text-sm font-semibold"
            :aria-expanded="marketOpen"
            @click="assetMenu = ''; marketOpen = !marketOpen"
          >
            <span class="truncate">{{ hasMarket ? `${receiveSymbol}/${paySymbol}` : 'Select a market' }}</span>
            <ChevronDown class="h-4 w-4 shrink-0 text-muted" />
          </button>
          <div v-if="marketOpen" class="absolute start-0 top-full z-20 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
            <button
              v-for="market in tradable"
              :key="market.symbol"
              type="button"
              class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
              @click="chooseMarket(market.symbol)"
            >
              <CoinIcon :symbol="market.symbol" :size="20" />
              {{ market.pair }}
            </button>
          </div>
        </div>
        <span class="rounded-full bg-mint px-2 py-0.5 text-[10px] font-bold tracking-wide text-mint-ink">SPOT</span>
        <span class="ms-auto inline-flex items-center gap-1 rounded-full bg-amber-400/15 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Syncing
        </span>
        <button type="button" class="grid h-8 w-8 place-items-center rounded-full text-muted" aria-label="Swap settings" @click="settingsOpen = !settingsOpen">
          <Settings class="h-4 w-4" />
        </button>
      </div>

      <div v-if="settingsOpen" class="mt-3 rounded-xl bg-soft p-3">
        <p class="text-xs font-semibold text-muted">Slippage</p>
        <div class="mt-2 flex gap-2">
          <button
            v-for="value in [0.1, 0.5, 1]"
            :key="value"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-bold"
            :class="slippage === value ? 'bg-mint text-mint-ink' : 'bg-bg text-muted'"
            @click="slippage = value"
          >
            {{ value }}%
          </button>
        </div>
      </div>

      <div class="mt-3 rounded-2xl border border-line bg-bg/40 p-3">
        <div class="flex items-start justify-between gap-3 text-sm">
          <span class="font-medium">You pay</span>
          <span class="text-xs text-muted">
            Available
            <button v-if="!session.address" type="button" class="font-semibold text-mint" @click="session.openPicker()">Connect wallet</button>
            <span v-else class="font-semibold text-ink">12,500 USDC</span>
          </span>
        </div>
        <div class="mt-3 flex items-center gap-3">
          <div class="relative" :class="assetMenu === 'pay' ? 'z-30' : ''">
            <button type="button" class="inline-flex h-11 items-center gap-2 rounded-full bg-soft py-1 pe-3 ps-1" :aria-expanded="assetMenu === 'pay'" @click="toggleAsset('pay')">
              <CoinIcon :symbol="paySymbol" :size="32" />
              <span class="text-start leading-tight">
                <span class="block text-sm font-semibold">{{ paySymbol }}</span>
                <span class="block text-[11px] text-muted">Spot asset</span>
              </span>
              <ChevronDown class="h-4 w-4 text-muted" />
            </button>
            <div v-if="assetMenu === 'pay'" class="absolute start-0 top-full z-30 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
              <button
                v-for="asset in assets"
                :key="`pay-${asset.symbol}`"
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
                @click="chooseAsset(asset.symbol)"
              >
                <CoinIcon :symbol="asset.symbol" :size="20" />
                {{ asset.symbol }}
              </button>
            </div>
          </div>
          <div class="ms-auto text-end">
            <input
              v-model="amount"
              class="field w-28 text-end text-2xl font-semibold num"
              inputmode="decimal"
              placeholder="0.00"
              aria-label="Quantity in base token"
            />
            <p class="text-[11px] text-muted">{{ session.address ? 'Quantity in base token' : 'Connect to verify balance' }}</p>
          </div>
        </div>
      </div>

      <div class="relative z-10 -my-3 flex justify-center">
        <button type="button" class="grid h-9 w-9 place-items-center rounded-full border border-line bg-elev" aria-label="Reverse assets" @click="flip">
          <ArrowDownUp class="h-4 w-4" />
        </button>
      </div>

      <div class="rounded-2xl border border-line bg-bg/40 p-3">
        <div class="flex items-start justify-between gap-3 text-sm">
          <span class="font-medium">You receive</span>
          <span class="text-xs text-muted">Estimated output</span>
        </div>
        <div class="mt-3 flex items-center gap-3">
          <div class="relative" :class="assetMenu === 'receive' ? 'z-30' : ''">
            <button type="button" class="inline-flex h-11 items-center gap-2 rounded-full bg-soft py-1 pe-3 ps-1" :aria-expanded="assetMenu === 'receive'" @click="toggleAsset('receive')">
              <CoinIcon :symbol="receiveSymbol || 'USDC'" :size="32" />
              <span class="text-start leading-tight">
                <span class="block text-sm font-semibold">{{ receiveSymbol || '—' }}</span>
                <span class="block text-[11px] text-muted">Spot asset</span>
              </span>
              <ChevronDown class="h-4 w-4 text-muted" />
            </button>
            <div v-if="assetMenu === 'receive'" class="absolute start-0 top-full z-30 mt-2 max-h-64 w-52 overflow-auto rounded-xl border border-line bg-elev p-1">
              <button
                v-for="asset in assets"
                :key="`receive-${asset.symbol}`"
                type="button"
                class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-soft"
                @click="chooseAsset(asset.symbol)"
              >
                <CoinIcon :symbol="asset.symbol" :size="20" />
                {{ asset.symbol }}
              </button>
            </div>
          </div>
          <div class="ms-auto text-end">
            <p class="text-2xl font-semibold num">{{ output ? formatPrice(output) : '—' }}</p>
            <p class="text-[11px] text-muted">{{ output ? 'Actual fill can differ' : 'Awaiting executable quote' }}</p>
          </div>
        </div>
      </div>

      <button type="button" class="mint-btn btn-square mt-3 h-12 w-full text-base" @click="submit">
        <Wallet class="h-4 w-4" />
        {{ session.address ? 'Preview swap' : 'Connect wallet' }}
      </button>
      <button type="button" class="mt-2 w-full py-2 text-center text-sm text-muted" @click="refreshQuote">Refresh quote</button>
      <p v-if="notice" class="mt-2 text-center text-sm text-mint">{{ notice }}</p>
      <p class="mt-1 text-center text-[11px] text-muted">Fees follow your Hyperliquid fee tier. Partial fills are possible.</p>
    </section>
  </div>
</template>
