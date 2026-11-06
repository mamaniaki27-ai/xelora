<script setup lang="ts">
import { computed, ref } from 'vue';
import { useSessionStore } from '../../stores/session';

const session = useSessionStore();
const copied = ref(false);
const code = computed(() => (session.address ? `XEL-${session.address.slice(2, 8).toUpperCase()}` : 'XEL-GUEST'));
const link = computed(() => `https://xelora.local/r/${code.value}`);

async function copy() {
  await navigator.clipboard.writeText(link.value);
  copied.value = true;
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-semibold">Referrals</h1>
    <p class="mt-2 text-sm text-muted">Share a preview code. Connecting a wallet changes the code to that session.</p>
    <form class="mt-5" role="search" @submit.prevent>
      <input class="field w-full rounded-xl border border-line bg-elev px-4 py-2.5" :value="code" readonly aria-label="Search referrals" />
    </form>
    <div class="panel mt-4 p-4">
      <p class="text-xs font-semibold uppercase tracking-wide text-muted">Your code</p>
      <p class="mt-2 text-3xl font-semibold tracking-wide">{{ code }}</p>
      <p class="mt-3 break-all text-sm text-muted">{{ link }}</p>
      <button type="button" class="mint-btn mt-4 h-10 px-4" @click="copy">{{ copied ? 'Copied' : 'Copy link' }}</button>
    </div>
    <ul class="mt-4 grid gap-3 sm:grid-cols-3">
      <li class="panel p-4"><p class="text-2xl font-semibold num">0</p><p class="text-xs text-muted">Invites joined</p></li>
      <li class="panel p-4"><p class="text-2xl font-semibold num">0</p><p class="text-xs text-muted">Qualified traders</p></li>
      <li class="panel p-4"><p class="text-2xl font-semibold num">0</p><p class="text-xs text-muted">Rewards</p></li>
    </ul>
  </section>
</template>
