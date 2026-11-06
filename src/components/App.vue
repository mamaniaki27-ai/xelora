<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './shell/AppHeader.vue';
import TickerTape from './shell/TickerTape.vue';
import AppFooter from './shell/AppFooter.vue';
import MobileNav from './shell/MobileNav.vue';
import ConnectModal from './shell/ConnectModal.vue';
import { useUiStore } from '../stores/ui';

const route = useRoute();
const ui = useUiStore();

watch(
  () => route.path,
  () => {
    ui.menuOpen = false;
  },
);
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-bg text-ink">
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
