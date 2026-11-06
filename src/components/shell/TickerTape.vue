<script setup lang="ts">
import { computed } from 'vue';
import CoinIcon from '../CoinIcon.vue';
import { tickerFeed } from '../../data/ticker';
import { changeClass, formatPrice, formatSigned } from '../../lib/format';
import { useLiveTick, wobble } from '../../lib/live';

const tick = useLiveTick();

const items = computed(() => {
  void tick.value;
  return tickerFeed.map((item) => ({
    ...item,
    live: wobble(item.price, item.symbol.length),
  }));
});

const loop = computed(() => [...items.value, ...items.value]);
</script>

<template>
  <div class="ticker-mask border-b border-line bg-bg">
    <div class="ticker-track">
      <span
        v-for="(item, index) in loop"
        :key="`${item.symbol}-${index}`"
        class="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold"
      >
        <CoinIcon :symbol="item.symbol" :size="16" />
        <span class="text-ink">{{ item.symbol }}</span>
        <span class="num text-ink/80">{{ formatPrice(item.live) }}</span>
        <span class="num" :class="changeClass(item.change)">{{ formatSigned(item.change) }}</span>
      </span>
    </div>
  </div>
</template>
