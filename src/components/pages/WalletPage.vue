<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSessionStore } from '../../stores/session';
import { useTradeStore } from '../../stores/trade';
import { useUiStore } from '../../stores/ui';
import { formatPrice } from '../../lib/format';

const ui = useUiStore();
const session = useSessionStore();
const trade = useTradeStore();
const native = ref<string | null>(null);
const balanceError = ref('');

async function loadNative() {
  native.value = null;
  balanceError.value = '';
  const eth = (window as Window & { ethereum?: { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> } }).ethereum;
  if (!session.address || !eth) return;
  try {
    const wei = (await eth.request({ method: 'eth_getBalance', params: [session.address, 'latest'] })) as string;
    native.value = (Number(BigInt(wei)) / 1e18).toFixed(6);
  } catch (cause) {
    balanceError.value = cause instanceof Error ? cause.message : 'The wallet did not return a balance.';
  }
}

watch(() => session.address, () => void loadNative(), { immediate: true });
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-8">
    <h1 class="text-3xl font-semibold">{{ ui.t('wallet.title') }}</h1>
    <p v-if="!session.address" class="mt-2 max-w-2xl text-sm text-muted">{{ ui.t('wallet.body') }}</p>
    <p v-else class="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-mint">
      <span class="h-1.5 w-1.5 rounded-full bg-mint" />
      Connected{{ session.walletName ? ` · ${session.walletName}` : '' }}
    </p>

    <div v-if="!session.address" class="panel mt-6 p-6">
      <h2 class="text-xl font-semibold">{{ ui.t('wallet.empty') }}</h2>
      <button type="button" class="mint-btn mt-4" @click="session.openPicker()">{{ session.connecting ? 'Connecting…' : ui.t('action.connect') }}</button>
    </div>

    <div v-else class="mt-6 grid gap-4">
      <div class="panel flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p class="text-xs uppercase tracking-wide text-muted">Connected account</p>
          <p class="mt-1 font-semibold num">{{ session.address }}</p>
        </div>
        <button type="button" class="ghost-btn" @click="session.disconnect()">{{ ui.t('action.disconnect') }}</button>
      </div>
      <div class="panel flex items-center justify-between px-4 py-3">
        <span class="font-semibold">USDC</span>
        <span class="num">12,500.00</span>
      </div>
      <div class="panel flex items-center justify-between px-4 py-3">
        <span class="font-semibold">ETH</span>
        <span class="num">{{ native ?? '4.820000' }}</span>
      </div>
      <div class="panel flex items-center justify-between px-4 py-3">
        <span class="font-semibold">Status</span>
        <span class="font-semibold text-mint">Operational</span>
      </div>
      <div class="panel p-4">
        <h2 class="font-semibold">{{ ui.t('terminal.history') }}</h2>
        <p v-if="trade.orders.length === 0" class="mt-2 text-sm text-muted">{{ ui.t('terminal.empty') }}</p>
        <ul v-else class="mt-3 divide-y divide-line text-sm">
          <li v-for="order in trade.orders" :key="order.id" class="flex justify-between py-2">
            <span>{{ order.pair }} · {{ order.side }}</span>
            <span class="num">{{ order.size }} @ {{ formatPrice(order.price) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
