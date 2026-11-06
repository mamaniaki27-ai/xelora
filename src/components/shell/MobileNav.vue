<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ArrowLeftRight, CandlestickChart, House, LineChart, Wallet } from 'lucide-vue-next';
import { useUiStore } from '../../stores/ui';

const route = useRoute();
const ui = useUiStore();

const items = computed(() => [
  { label: ui.t('nav.home'), to: '/', icon: House, fab: false },
  { label: ui.t('nav.markets'), to: '/markets', icon: LineChart, fab: false },
  { label: ui.t('nav.swap'), to: '/swap', icon: ArrowLeftRight, fab: true },
  { label: ui.t('nav.trade'), to: '/futures', icon: CandlestickChart, fab: false },
  { label: ui.t('nav.wallet'), to: '/wallet', icon: Wallet, fab: false },
]);

function active(path: string) {
  if (path === '/') return route.path === '/';
  if (path === '/futures') return route.path === '/futures' || route.path === '/spot' || route.path.startsWith('/trade/');
  return route.path === path;
}
</script>

<template>
  <nav
    class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 backdrop-blur lg:hidden"
    aria-label="Main mobile navigation"
  >
    <ul class="grid grid-cols-5 px-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1">
      <li v-for="item in items" :key="item.to" class="flex justify-center">
        <RouterLink
          :to="item.to"
          class="flex min-h-14 w-full flex-col items-center justify-end gap-1 pb-1 text-[10px] font-semibold"
          :class="active(item.to) ? 'text-mint' : 'text-muted'"
        >
          <span
            v-if="item.fab"
            class="-mt-7 grid h-14 w-14 place-items-center rounded-full bg-mint text-mint-ink"
          >
            <component :is="item.icon" class="h-5 w-5" />
          </span>
          <component :is="item.icon" v-else class="h-5 w-5" />
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
