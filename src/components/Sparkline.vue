<script setup lang="ts">
import { computed } from 'vue';
import { buildCandles } from '../lib/candles';

const props = defineProps<{ symbol: string; price: number; change: number }>();

const points = computed(() => {
  const closes = buildCandles(props.symbol, props.price, props.change, '1H').slice(-20).map((bar) => bar.close);
  const max = Math.max(...closes);
  const min = Math.min(...closes);
  const span = max - min || 1;
  return closes.map((value, index) => `${index * 3.6},${2 + ((max - value) / span) * 28}`).join(' ');
});
</script>

<template>
  <svg viewBox="0 0 70 32" class="h-8 w-[70px]" aria-hidden="true">
    <polyline
      fill="none"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke="change >= 0 ? 'var(--bid)' : 'var(--ask)'"
      :points="points"
    />
  </svg>
</template>
