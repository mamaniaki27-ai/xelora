<script setup lang="ts">
import { Star } from 'lucide-vue-next';
import { useTradeStore } from '../stores/trade';

const props = defineProps<{ id: string }>();
const trade = useTradeStore();

function toggle() {
  trade.toggleFavorite(props.id);
}
</script>

<template>
  <button
    type="button"
    class="grid h-8 w-8 shrink-0 place-items-center rounded-none"
    :aria-pressed="trade.isFavorite(id)"
    aria-label="Recommend"
    @click.stop="toggle"
  >
    <Star
      class="h-4 w-4"
      :class="trade.isFavorite(id) ? 'text-[#f5c518]' : 'text-muted'"
      :fill="trade.isFavorite(id) ? '#f5c518' : 'none'"
      :stroke="trade.isFavorite(id) ? '#f5c518' : 'currentColor'"
    />
  </button>
</template>
