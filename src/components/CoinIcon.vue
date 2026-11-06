<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { coinFiles } from '../data/coin-files';

const props = withDefaults(defineProps<{ symbol: string; size?: number; bare?: boolean }>(), { size: 32, bare: false });

const key = computed(() => {
  const upper = props.symbol.toUpperCase();
  if (coinFiles[upper]) return upper;
  return upper.replace(/USDT|USDC|USD/gi, '');
});
const src = ref('/coins/default.png');

watch(
  key,
  (next) => {
    const file = coinFiles[next];
    src.value = file ? `/coins/${file}` : '/coins/default.png';
  },
  { immediate: true },
);

function fallback() {
  src.value = '/coins/default.png';
}
</script>

<template>
  <img
    :src="src"
    :width="size"
    :height="size"
    :class="bare ? 'h-full w-full object-contain p-0.5' : 'shrink-0 rounded-full bg-soft object-contain'"
    :alt="`${key} logo`"
    @error="fallback"
  />
</template>
