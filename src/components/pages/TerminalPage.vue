<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FavoriteStar from '../FavoriteStar.vue';
import CandleChart from '../CandleChart.vue';
import CoinIcon from '../CoinIcon.vue';
import { marketKey, markets, type Market } from '../../data/markets';
import { buildCandles } from '../../lib/candles';
import { changeClass, formatCompact, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';
import { parseTradePath, tradePath } from '../../lib/pairs';
import { useSessionStore } from '../../stores/session';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';

const route = useRoute();
const router = useRouter();
const ui = useUiStore();
const session = useSessionStore();
const trade = useTradeStore();
const tick = useLiveTick();

const side = ref<'long' | 'short'>('long');
const orderType = ref<'limit' | 'market'>('market');
const size = ref('');
const leverage = ref(10);
const takeProfit = ref(false);
const reduceOnly = ref(false);
const message = ref('');
const bookTab = ref<'book' | 'trades'>('book');
const bottomTab = ref<'positions' | 'history'>('positions');
const interval = ref('1H');
const intervals = ['1m', '5m', '15m', '30m', '1H', '4H', '24H'];

const kind = computed(() => {
  const parsed = parseTradePath(route.path);
  if (parsed) return parsed.kind;
  return route.path.startsWith('/spot') ? 'spot' : 'perp';
});

const universe = computed(() => markets.filter((market) => market.kind === (kind.value === 'perp' ? 'perp' : 'spot')));

const selected = computed<Market>(() => {
  const parsed = parseTradePath(route.path);
  const found = parsed && universe.value.find((market) => market.symbol === parsed.symbol);
  return found ?? universe.value[0];
});

const livePrice = computed(() => {
  void tick.value;
  return wobble(selected.value.price, selected.value.symbol.length);
});

const limitPrice = ref(0);
watch(livePrice, (price) => {
  if (orderType.value === 'market' || limitPrice.value === 0) limitPrice.value = Number(price.toFixed(price >= 100 ? 2 : 4));
}, { immediate: true });

const entry = computed(() => (orderType.value === 'market' ? livePrice.value : Number(limitPrice.value) || livePrice.value));
const sizeNum = computed(() => Number(size.value) || 0);
const value = computed(() => sizeNum.value * entry.value);
const margin = computed(() => (kind.value === 'perp' ? value.value / leverage.value : value.value));
const liq = computed(() => {
  if (kind.value !== 'perp' || !sizeNum.value) return 0;
  const move = entry.value / leverage.value * 0.9;
  return side.value === 'long' ? entry.value - move : entry.value + move;
});

const candles = computed(() =>
  buildCandles(selected.value.symbol, selected.value.price, selected.value.change, interval.value),
);

function bookStep(price: number) {
  if (price >= 1000) return Math.max(1, Math.round(price * 0.00008));
  if (price >= 100) return price * 0.00015;
  if (price >= 1) return price * 0.0004;
  if (price >= 0.01) return price * 0.0008;
  return price * 0.0015;
}

function bookSize(seed: number, price: number) {
  const unit = price >= 1000 ? 0.00014 : price >= 1 ? 0.02 : 8;
  const bump = seed % 7 === 0 ? unit * 180 : unit * (1 + (seed % 9));
  return bump;
}

const book = computed(() => {
  const mid = livePrice.value;
  const step = bookStep(mid);
  const asksNear = Array.from({ length: 10 }, (_, index) => ({
    price: mid + step * (index + 1),
    size: bookSize(index + 3, mid),
    total: 0,
  })).sort((a, b) => a.price - b.price);
  let askTotal = 0;
  for (const level of asksNear) {
    askTotal += level.price * level.size;
    level.total = askTotal;
  }
  const bids = Array.from({ length: 10 }, (_, index) => ({
    price: Math.max(mid - step * (index + 1), mid * 0.2),
    size: bookSize(index + 5, mid),
    total: 0,
  })).sort((a, b) => b.price - a.price);
  let bidTotal = 0;
  for (const level of bids) {
    bidTotal += level.price * level.size;
    level.total = bidTotal;
  }
  const asks = [...asksNear].reverse();
  const bestAsk = asksNear[0].price;
  const bestBid = bids[0].price;
  const spread = bestAsk - bestBid;
  const askSize = asks.reduce((sum, level) => sum + level.size, 0);
  const bidSize = bids.reduce((sum, level) => sum + level.size, 0);
  const maxSize = Math.max(...asks.map((level) => level.size), ...bids.map((level) => level.size));
  return {
    asks,
    bids,
    spread,
    spreadPct: mid > 0 ? (spread / mid) * 100 : 0,
    maxSize,
    buyPct: ((bidSize / (bidSize + askSize)) * 100) || 50,
    sellPct: ((askSize / (bidSize + askSize)) * 100) || 50,
    mark: mid,
  };
});

function bookPrice(value: number) {
  if (value >= 100) return value.toLocaleString('en-US', { maximumFractionDigits: value >= 1000 ? 0 : 2 });
  return formatPrice(value);
}

function bookSizeText(value: number) {
  if (value >= 1) return value.toFixed(3);
  if (value >= 0.01) return value.toFixed(5).replace(/0+$/, '').replace(/\.$/, '');
  return value.toFixed(5);
}

const prints = computed(() =>
  book.value.bids.slice(0, 8).map((level, index) => ({
    price: index % 2 === 0 ? level.price : book.value.asks[index].price,
    size: level.size,
    side: index % 2 === 0 ? 'buy' : 'sell',
  })),
);

const pairOrders = computed(() => trade.orders.filter((order) => order.pair === selected.value.pair));

function choosePair(event: Event) {
  const symbol = (event.target as HTMLSelectElement).value;
  void router.push(tradePath(symbol, kind.value === 'perp' ? 'perp' : 'spot'));
}

function fillPercent(percent: number) {
  const balance = 12500;
  const notional = kind.value === 'perp' ? balance * leverage.value * (percent / 100) : balance * (percent / 100);
  size.value = (notional / entry.value).toFixed(selected.value.price >= 1000 ? 4 : 3);
}

function submit() {
  message.value = '';
  if (!session.address) {
    message.value = ui.t('terminal.needWallet');
    session.openPicker();
    return;
  }
  if (!sizeNum.value) {
    message.value = ui.t('terminal.needSize');
    return;
  }
  const label = kind.value === 'perp'
    ? (side.value === 'long' ? ui.t('terminal.long') : ui.t('terminal.short'))
    : (side.value === 'long' ? ui.t('terminal.buy') : ui.t('terminal.sell'));
  trade.addOrder({
    pair: selected.value.pair,
    side: label,
    orderType: orderType.value,
    price: entry.value,
    size: sizeNum.value,
    leverage: kind.value === 'perp' ? leverage.value : 1,
  });
  size.value = '';
  bottomTab.value = 'positions';
  message.value = ui.locale === 'fa' ? 'سفارش نمونه در همین مرورگر ثبت شد.' : 'Preview order stored in this browser.';
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-[1440px] flex-col gap-3 px-3 py-3 lg:h-[calc(100dvh-4rem)]">
    <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
      <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
        XELORA · {{ kind === 'perp' ? ui.t('terminal.futures') : ui.t('terminal.spot') }}
      </p>
      <p class="ms-auto text-xs font-semibold text-muted">
        {{ session.address ? session.shortAddress : ui.t('terminal.notConnected') }}
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-4">
      <label class="flex items-center gap-2">
        <CoinIcon :symbol="selected.symbol" :size="28" />
        <span class="sr-only">Market</span>
        <select class="rounded-lg bg-soft px-2 py-1 text-sm font-bold" :value="selected.symbol" @change="choosePair">
          <option v-for="market in universe" :key="market.pair" :value="market.symbol">{{ market.pair }}</option>
        </select>
      </label>
      <FavoriteStar :id="marketKey(selected)" />
      <p class="text-2xl font-semibold num">{{ formatPrice(livePrice) }}</p>
      <p class="text-sm font-semibold num" :class="changeClass(selected.change)">{{ formatSigned(selected.change) }}</p>
      <dl class="flex flex-wrap gap-4 text-xs text-muted">
        <div><dt>24h high</dt><dd class="font-semibold text-ink num">{{ formatPrice(livePrice * 1.012) }}</dd></div>
        <div><dt>24h low</dt><dd class="font-semibold text-ink num">{{ formatPrice(livePrice * 0.988) }}</dd></div>
        <div><dt>Volume</dt><dd class="font-semibold text-ink num">{{ formatCompact(selected.volume) }}</dd></div>
        <div v-if="selected.funding !== undefined"><dt>Funding</dt><dd class="font-semibold text-ink num">{{ selected.funding.toFixed(4) }}%</dd></div>
      </dl>
    </div>

    <div class="grid min-h-0 flex-1 gap-3 lg:grid-cols-[minmax(0,1fr)_260px_280px]">
      <div class="panel flex min-h-[320px] flex-col p-3">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-lg bg-mint px-2 py-1 text-xs font-bold text-mint-ink">{{ ui.t('terminal.pro') }}</span>
          <button
            v-for="item in intervals"
            :key="item"
            type="button"
            class="inline-flex h-7 min-w-9 items-center justify-center rounded-md px-2 text-xs font-semibold"
            :class="interval === item ? 'bg-soft text-ink' : 'text-muted'"
            @click="interval = item"
          >
            {{ item }}
          </button>
          <span class="ms-auto text-[11px] font-semibold text-[#e0b84d]">MA 12</span>
        </div>
        <CandleChart class="mt-2" :candles="candles" :interval="interval" :mark="livePrice" />
      </div>

      <div class="panel flex min-h-[280px] flex-col overflow-hidden p-0">
        <div class="grid grid-cols-2 border-b border-line text-center text-[11px] font-bold uppercase tracking-[0.08em]">
          <button type="button" class="py-2.5" :class="bookTab === 'book' ? 'border-b-2 border-mint text-ink' : 'text-muted'" @click="bookTab = 'book'">Order book</button>
          <button type="button" class="py-2.5" :class="bookTab === 'trades' ? 'border-b-2 border-mint text-ink' : 'text-muted'" @click="bookTab = 'trades'">Trades</button>
        </div>
        <template v-if="bookTab === 'book'">
          <div class="mx-3 mt-2 flex h-1 overflow-hidden rounded-sm bg-ask">
            <div class="h-full bg-bid" :style="{ width: `${book.buyPct}%` }" />
          </div>
          <div class="flex justify-between px-3 py-1 text-[10px] font-semibold">
            <span class="text-bid">{{ book.buyPct.toFixed(1) }}% Buy</span>
            <span class="text-ask">{{ book.sellPct.toFixed(1) }}% Sell</span>
          </div>
          <div class="grid grid-cols-3 px-3 pb-1 text-[9px] font-bold uppercase tracking-wide text-muted">
            <span>Price</span>
            <span class="text-end">Size ({{ selected.symbol }})</span>
            <span class="text-end">Total (USDC)</span>
          </div>
          <div class="num text-[11px] leading-5">
            <div v-for="level in book.asks" :key="`a${level.price}`" class="relative grid grid-cols-3 px-3">
              <span class="absolute inset-y-0 end-0 bg-ask/20" :style="{ width: `${(level.size / book.maxSize) * 100}%` }" />
              <span class="relative text-ask">{{ bookPrice(level.price) }}</span>
              <span class="relative text-end text-ink">{{ bookSizeText(level.size) }}</span>
              <span class="relative text-end text-muted">{{ formatPrice(level.total) }}</span>
            </div>
            <div class="my-1 grid grid-cols-[1fr_auto] items-center gap-2 border-y border-line px-3 py-1">
              <span class="text-sm font-bold text-bid">↑ {{ bookPrice(book.mark) }}</span>
              <span class="text-[10px] font-semibold uppercase tracking-wide text-muted">Spread {{ bookPrice(book.spread) }} ({{ book.spreadPct.toFixed(3) }}%)</span>
            </div>
            <div v-for="level in book.bids" :key="`b${level.price}`" class="relative grid grid-cols-3 px-3">
              <span class="absolute inset-y-0 end-0 bg-bid/20" :style="{ width: `${(level.size / book.maxSize) * 100}%` }" />
              <span class="relative text-bid">{{ bookPrice(level.price) }}</span>
              <span class="relative text-end text-ink">{{ bookSizeText(level.size) }}</span>
              <span class="relative text-end text-muted">{{ formatPrice(level.total) }}</span>
            </div>
          </div>
          <p class="mt-auto px-3 py-2 text-[10px] text-muted">{{ book.asks.length }} asks · {{ book.bids.length }} bids</p>
        </template>
        <ul v-else class="space-y-1 px-3 py-3 text-xs">
          <li class="grid grid-cols-3 text-[9px] font-bold uppercase tracking-wide text-muted">
            <span>Price</span><span class="text-end">Size</span><span class="text-end">Side</span>
          </li>
          <li v-for="(print, index) in prints" :key="index" class="grid grid-cols-3 num">
            <span :class="print.side === 'buy' ? 'text-bid' : 'text-ask'">{{ bookPrice(print.price) }}</span>
            <span class="text-end">{{ bookSizeText(print.size) }}</span>
            <span class="text-end uppercase" :class="print.side === 'buy' ? 'text-bid' : 'text-ask'">{{ print.side }}</span>
          </li>
        </ul>
      </div>

      <form class="panel flex flex-col gap-3 p-3" @submit.prevent="submit">
        <h2 class="text-sm font-semibold">{{ ui.t('terminal.place') }}</h2>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" class="rounded-xl py-2 text-sm font-bold" :class="side === 'long' ? 'bg-mint text-mint-ink' : 'bg-soft text-muted'" @click="side = 'long'">
            {{ kind === 'perp' ? ui.t('terminal.long') : ui.t('terminal.buy') }}
          </button>
          <button type="button" class="rounded-xl py-2 text-sm font-bold" :class="side === 'short' ? 'bg-ask text-white' : 'bg-soft text-muted'" @click="side = 'short'">
            {{ kind === 'perp' ? ui.t('terminal.short') : ui.t('terminal.sell') }}
          </button>
        </div>
        <div class="flex gap-3 text-sm font-semibold">
          <button type="button" :class="orderType === 'limit' ? 'text-ink' : 'text-muted'" @click="orderType = 'limit'">{{ ui.t('terminal.limit') }}</button>
          <button type="button" :class="orderType === 'market' ? 'text-mint' : 'text-muted'" @click="orderType = 'market'">{{ ui.t('terminal.market') }}</button>
          <span v-if="kind === 'perp'" class="ms-auto text-xs text-muted">{{ ui.t('terminal.cross') }}</span>
        </div>
        <label v-if="orderType === 'limit'" class="block text-xs text-muted">
          {{ ui.t('terminal.price') }}
          <input v-model.number="limitPrice" class="field mt-1 rounded-xl bg-soft px-3 py-2 text-base font-semibold text-ink num" inputmode="decimal" />
        </label>
        <label class="block text-xs text-muted">
          {{ ui.t('terminal.size') }} · {{ selected.symbol }}
          <input v-model="size" class="field mt-1 rounded-xl bg-soft px-3 py-2 text-base font-semibold text-ink num" inputmode="decimal" placeholder="0.00" />
        </label>
        <div class="grid grid-cols-5 gap-1">
          <button v-for="percent in [10, 25, 50, 75, 100]" :key="percent" type="button" class="rounded-lg bg-soft py-1 text-[11px] font-bold" @click="fillPercent(percent)">
            {{ percent }}%
          </button>
        </div>
        <div v-if="kind === 'perp'">
          <div class="flex justify-between text-xs text-muted">
            <span>{{ ui.t('terminal.leverage') }}</span>
            <span class="text-ink">{{ leverage }}×</span>
          </div>
          <input v-model.number="leverage" class="mt-2 w-full accent-[var(--mint)]" type="range" min="1" :max="selected.maxLeverage" step="1" />
        </div>
        <label v-if="kind === 'perp'" class="flex items-center gap-2 text-xs text-muted">
          <input v-model="takeProfit" type="checkbox" /> {{ ui.t('terminal.tp') }}
        </label>
        <label v-if="kind === 'perp'" class="flex items-center gap-2 text-xs text-muted">
          <input v-model="reduceOnly" type="checkbox" /> {{ ui.t('terminal.reduce') }}
        </label>
        <dl class="space-y-1 text-xs text-muted">
          <div class="flex justify-between"><dt>{{ ui.t('terminal.value') }}</dt><dd class="text-ink num">{{ formatPrice(value) }} USDC</dd></div>
          <div class="flex justify-between"><dt>{{ ui.t('terminal.margin') }}</dt><dd class="text-ink num">{{ formatPrice(margin) }} USDC</dd></div>
          <div v-if="kind === 'perp'" class="flex justify-between"><dt>{{ ui.t('terminal.liq') }}</dt><dd class="text-ink num">{{ liq ? formatPrice(liq) : '—' }}</dd></div>
        </dl>
        <button type="submit" class="mint-btn h-11 w-full">{{ session.address ? ui.t('terminal.submit') : ui.t('action.connect') }}</button>
        <p v-if="message" class="text-xs text-mint">{{ message }}</p>
      </form>
    </div>

    <div class="panel p-3">
      <div class="flex gap-4 text-sm font-semibold">
        <button type="button" :class="bottomTab === 'positions' ? 'text-ink' : 'text-muted'" @click="bottomTab = 'positions'">
          {{ ui.t('terminal.positions') }} {{ pairOrders.length }}
        </button>
        <button type="button" :class="bottomTab === 'history' ? 'text-ink' : 'text-muted'" @click="bottomTab = 'history'">{{ ui.t('terminal.history') }}</button>
      </div>
      <p v-if="pairOrders.length === 0" class="py-6 text-sm text-muted">
        {{ ui.t('terminal.empty') }}. {{ ui.t('terminal.emptyHint') }}
      </p>
      <table v-else class="mt-3 w-full text-sm">
        <thead class="text-xs text-muted">
          <tr>
            <th class="py-1 text-start font-medium">Side</th>
            <th class="py-1 text-end font-medium">Size</th>
            <th class="py-1 text-end font-medium">Price</th>
            <th class="py-1 text-end font-medium">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in pairOrders" :key="order.id" class="border-t border-line">
            <td class="py-2">{{ order.side }}</td>
            <td class="py-2 text-end num">{{ order.size }}</td>
            <td class="py-2 text-end num">{{ formatPrice(order.price) }}</td>
            <td class="py-2 text-end">{{ order.orderType }}<span v-if="order.leverage > 1"> · {{ order.leverage }}×</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
