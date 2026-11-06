<script setup lang="ts">
import { computed, reactive } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { tools } from '../../data/tools';
import { formatPrice } from '../../lib/format';

const route = useRoute();
const tool = computed(() => tools.find((item) => item.slug === String(route.params.slug ?? '')));

const form = reactive({
  entry: 100,
  exit: 110,
  size: 1,
  fee: 0.05,
  account: 10000,
  risk: 1,
  stop: 95,
  leverage: 10,
  mmr: 0.5,
  side: 'long' as 'long' | 'short',
  periods: 3,
  rate: 0.01,
  cost: 1000,
  value: 1250,
  supply: 1000000,
  cap: 25000000,
  buys: 4,
  apr: 12,
  compounds: 12,
});

const result = computed(() => {
  const fee = form.fee / 100;
  const direction = form.side === 'long' ? 1 : -1;
  switch (tool.value?.slug) {
    case 'profit-calculator': {
      const gross = (form.exit - form.entry) * form.size * direction;
      const fees = (form.entry + form.exit) * form.size * fee;
      return { label: 'Net PnL', value: `${formatPrice(gross - fees)} USDC` };
    }
    case 'position-risk-calculator': {
      const riskUsd = form.account * (form.risk / 100);
      const distance = Math.abs(form.entry - form.stop);
      const size = distance > 0 ? riskUsd / distance : 0;
      return { label: 'Position size', value: `${size.toFixed(4)} units · risk ${formatPrice(riskUsd)} USDC` };
    }
    case 'liquidation-calculator': {
      const mm = form.mmr / 100;
      const move = form.entry * (1 / form.leverage - mm);
      const price = form.side === 'long' ? form.entry - move : form.entry + move;
      return { label: 'Estimated liquidation', value: formatPrice(Math.max(price, 0)) };
    }
    case 'futures-pnl-calculator': {
      const gross = (form.exit - form.entry) * form.size * direction;
      const fees = (form.entry + form.exit) * form.size * fee;
      return { label: 'Futures PnL', value: `${formatPrice(gross - fees)} USDC` };
    }
    case 'funding-rate-calculator': {
      const notional = form.entry * form.size * form.leverage;
      const payment = notional * (form.rate / 100) * form.periods * direction;
      return { label: 'Funding over periods', value: `${formatPrice(payment)} USDC` };
    }
    case 'leverage-calculator': {
      const notional = form.entry * form.size;
      const lev = form.account > 0 ? notional / form.account : 0;
      return { label: 'Leverage', value: `${lev.toFixed(2)}×` };
    }
    case 'roi-calculator': {
      const roi = form.cost > 0 ? ((form.value - form.cost) / form.cost) * 100 : 0;
      return { label: 'ROI', value: `${roi.toFixed(2)}%` };
    }
    case 'break-even-calculator': {
      const price = form.side === 'long' ? form.entry * (1 + fee) / (1 - fee) : form.entry * (1 - fee) / (1 + fee);
      return { label: 'Break-even price', value: formatPrice(price) };
    }
    case 'stop-loss-calculator': {
      const loss = form.account * (form.risk / 100);
      const distance = form.size > 0 ? loss / form.size : 0;
      const price = form.side === 'long' ? form.entry - distance : form.entry + distance;
      return { label: 'Stop price', value: formatPrice(Math.max(price, 0)) };
    }
    case 'take-profit-calculator': {
      const risk = Math.abs(form.entry - form.stop);
      const price = form.side === 'long' ? form.entry + risk * 2 : form.entry - risk * 2;
      return { label: 'Take-profit (2R)', value: formatPrice(Math.max(price, 0)) };
    }
    case 'market-cap-calculator':
      return { label: 'Market cap', value: formatPrice(form.entry * form.supply) };
    case 'token-price-calculator':
      return { label: 'Token price', value: formatPrice(form.supply > 0 ? form.cap / form.supply : 0) };
    case 'dca-calculator':
      return { label: 'Total spent', value: `${formatPrice(form.entry * form.buys)} across ${form.buys} buys` };
    case 'apr-calculator':
      return { label: 'Monthly return', value: `${(form.apr / 12).toFixed(3)}%` };
    case 'apy-calculator': {
      const apy = (Math.pow(1 + form.apr / 100 / form.compounds, form.compounds) - 1) * 100;
      return { label: 'APY', value: `${apy.toFixed(2)}%` };
    }
    default:
      return null;
  }
});

const sideTools = new Set([
  'profit-calculator',
  'futures-pnl-calculator',
  'liquidation-calculator',
  'break-even-calculator',
  'stop-loss-calculator',
  'take-profit-calculator',
  'funding-rate-calculator',
]);

const usesSide = computed(() => sideTools.has(tool.value?.slug ?? ''));

const fields = computed(() => {
  const slug = tool.value?.slug ?? '';
  const rows: { key: keyof typeof form; label: string; min?: number }[] = [];
  const add = (key: keyof typeof form, label: string, min?: number) => rows.push({ key, label, min });
  if (!['roi-calculator', 'token-price-calculator', 'apr-calculator', 'apy-calculator'].includes(slug)) add('entry', 'Entry price ($)');
  if (['profit-calculator', 'futures-pnl-calculator'].includes(slug)) add('exit', 'Exit price ($)');
  if (!['roi-calculator', 'market-cap-calculator', 'token-price-calculator', 'apr-calculator', 'apy-calculator'].includes(slug)) add('size', 'Position size (units)');
  if (['profit-calculator', 'futures-pnl-calculator', 'break-even-calculator'].includes(slug)) add('fee', 'Fee (%)');
  if (['position-risk-calculator', 'stop-loss-calculator', 'leverage-calculator'].includes(slug)) add('account', 'Account (USDC)');
  if (['position-risk-calculator', 'stop-loss-calculator'].includes(slug)) add('risk', 'Risk (%)');
  if (['position-risk-calculator', 'take-profit-calculator'].includes(slug)) add('stop', 'Stop price ($)');
  if (['liquidation-calculator', 'funding-rate-calculator', 'profit-calculator', 'futures-pnl-calculator'].includes(slug)) add('leverage', 'Leverage', 1);
  if (slug === 'liquidation-calculator') add('mmr', 'Maintenance margin (%)');
  if (slug === 'funding-rate-calculator') add('rate', 'Funding rate (%)');
  if (slug === 'funding-rate-calculator') add('periods', 'Periods', 1);
  if (slug === 'roi-calculator') add('cost', 'Cost ($)');
  if (slug === 'roi-calculator') add('value', 'Current value ($)');
  if (slug === 'market-cap-calculator' || slug === 'token-price-calculator') add('supply', 'Circulating supply');
  if (slug === 'token-price-calculator') add('cap', 'Market cap ($)');
  if (slug === 'dca-calculator') add('buys', 'Number of buys', 1);
  if (slug === 'apr-calculator' || slug === 'apy-calculator') add('apr', 'APR (%)');
  if (slug === 'apy-calculator') add('compounds', 'Compounds per year', 1);
  return rows;
});
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-8">
    <template v-if="tool && result">
      <p class="text-sm text-muted">
        <RouterLink to="/tools" class="hover:text-ink">Tools</RouterLink>
        <span class="px-2">/</span>
        <span class="text-ink">{{ tool.title }}</span>
      </p>
      <h1 class="mt-4 text-4xl font-semibold tracking-tight">{{ tool.title }}</h1>
      <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">{{ tool.summary }}</p>

      <form class="mt-6 rounded-2xl border border-line bg-elev/40 p-5" @submit.prevent>
        <fieldset v-if="usesSide" class="mb-4">
          <legend class="text-sm font-semibold">Position side</legend>
          <div class="mt-2 flex flex-wrap gap-6 text-sm">
            <label class="inline-flex items-center gap-2">
              <input v-model="form.side" class="accent-mint" type="radio" value="long" />
              Long / Buy
            </label>
            <label class="inline-flex items-center gap-2">
              <input v-model="form.side" class="accent-mint" type="radio" value="short" />
              Short / Sell
            </label>
          </div>
        </fieldset>

        <div class="grid gap-4 sm:grid-cols-2">
          <label v-for="field in fields" :key="field.key" class="text-sm font-medium">
            {{ field.label }}
            <input
              v-model.number="form[field.key]"
              class="mt-1.5 h-11 w-full rounded-lg border border-line bg-[#12161b] px-3 text-base font-normal text-ink outline-none"
              type="number"
              :min="field.min"
              step="any"
            />
          </label>
        </div>

        <div class="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p class="text-xs text-muted">{{ result.label }}</p>
            <p class="mt-1 text-lg font-semibold num">{{ result.value }}</p>
          </div>
          <button type="submit" class="mint-btn h-10 px-5">Calculate</button>
        </div>
      </form>

      <div class="mt-8 max-w-2xl space-y-3 text-sm leading-relaxed text-muted">
        <h2 class="text-lg font-semibold text-ink">How to use this tool</h2>
        <ol class="list-decimal space-y-1 ps-5">
          <li>Enter the prices and size the label asks for.</li>
          <li>Set the side when the trade can be long or short.</li>
          <li>Read the result under the form. It updates from the numbers on this page.</li>
        </ol>
      </div>
    </template>
    <template v-else>
      <h1 class="text-3xl font-semibold">Calculator not found</h1>
      <RouterLink to="/tools" class="mint-btn mt-4">Back to tools</RouterLink>
    </template>
  </section>
</template>
