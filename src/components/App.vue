<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './shell/AppHeader.vue';
import TickerTape from './shell/TickerTape.vue';
import AppFooter from './shell/AppFooter.vue';
import MobileNav from './shell/MobileNav.vue';
import ConnectModal from './shell/ConnectModal.vue';
import HumanCheck from './shell/HumanCheck.vue';
import { useUiStore } from '../stores/ui';
import { humanCheckPassed, markHumanCheckPassed } from '../lib/human-check';

const route = useRoute();
const ui = useUiStore();
const cleared = ref(humanCheckPassed());

watch(
  () => route.path,
  () => {
    ui.menuOpen = false;
  },
);

watch(
  cleared,
  (ok) => {
    if (typeof document === 'undefined' || ok) return;
    document.title = 'Verify you are human | XELORA';
  },
  { immediate: true },
);

function pass() {
  markHumanCheckPassed();
  cleared.value = true;
  const title = typeof route.meta.title === 'string' ? route.meta.title : 'XELORA';
  document.title = title.startsWith('XELORA') ? title : `${title} | XELORA`;
}
</script>

<template>
  <HumanCheck v-if="!cleared" @pass="pass" />
  <div v-else class="flex min-h-dvh flex-col bg-bg text-ink">
    <AppHeader />
    <TickerTape />
    <main class="flex-1 pb-24 lg:pb-0">
      <RouterView />
    </main>
    <AppFooter />
    <MobileNav />
    <ConnectModal />
  </div>
</template>
