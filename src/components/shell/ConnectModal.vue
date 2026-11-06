<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { ArrowUpRight, ChevronLeft, ChevronRight, Search, Wallet, X } from 'lucide-vue-next';
import WalletIcon from './WalletIcon.vue';
import { useSessionStore } from '../../stores/session';
import walletDirectory from '../../data/wallet-directory.json';

const session = useSessionStore();
const query = ref('');
const directoryQuery = ref('');
const view = ref<'list' | 'all'>('list');
const certifiedOnly = ref(true);
const pageError = ref('');

type WalletDef = {
  id: string;
  name: string;
  href: string;
  image?: string;
  badge?: 'qr' | 'installed';
};

const catalog = walletDirectory as WalletDef[];

function listed(name: string, badge?: WalletDef['badge']): WalletDef {
  const found = catalog.find((wallet) => wallet.name.toLowerCase() === name.toLowerCase());
  return {
    id: found?.id ?? name,
    name,
    href: found?.href || 'https://walletconnect.com/',
    image: found?.image,
    badge,
  };
}

const featured: WalletDef[] = [
  { id: 'walletconnect', name: 'WalletConnect', href: 'https://walletconnect.com/', badge: 'qr' },
  listed('MetaMask', 'installed'),
  listed('Phantom', 'installed'),
  listed('My Wallet'),
  listed('Trust Wallet'),
];

const showPicker = computed(() => session.pickerOpen || (session.modalOpen && !session.gateOpen));
const showOverlay = computed(() => session.gateOpen || session.pickerOpen || session.modalOpen);

const visible = computed(() => {
  const term = query.value.trim().toLowerCase();
  if (!term) return featured;
  return featured.filter((wallet) => wallet.name.toLowerCase().includes(term));
});

const visibleDirectory = computed(() => {
  const term = directoryQuery.value.trim().toLowerCase();
  if (!term) return catalog;
  return catalog.filter((wallet) => wallet.name.toLowerCase().includes(term));
});

function dismissPicker() {
  session.closePicker();
  session.closeModal();
}

function onKey(event: KeyboardEvent) {
  if (event.key !== 'Escape') return;
  if (view.value === 'all') {
    view.value = 'list';
    return;
  }
  if (session.pickerOpen) dismissPicker();
  else session.closeGate();
}

function closeAll() {
  view.value = 'list';
  pageError.value = '';
  session.error = '';
  if (session.gateOpen) dismissPicker();
  else session.closeGate();
}

onMounted(() => window.addEventListener('keydown', onKey));
onUnmounted(() => window.removeEventListener('keydown', onKey));

function choose(wallet: WalletDef) {
  if (session.connecting) return;
  window.open(wallet.href, '_blank', 'noopener,noreferrer');
  const message = `${wallet.name} could not complete the connection.`;
  pageError.value = message;
  session.error = message;
}
</script>

<template>
  <div v-if="showOverlay" class="fixed inset-0 z-50 grid place-items-center px-4">
    <div
      class="absolute inset-0"
      :class="showPicker ? 'bg-black/45 backdrop-blur-md' : 'bg-[#050807]'"
    />
    <div v-if="!showPicker" class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,203,129,0.18),transparent_55%)]" />

    <section
      v-if="!showPicker"
      class="relative w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#14181c] px-8 py-9 text-center shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Connect your wallet"
    >
      <button type="button" class="text-xs text-muted hover:text-ink" @click="session.closeGate()">← Back to XELORA</button>
      <div class="mx-auto mt-6 grid h-14 w-14 place-items-center rounded-2xl border border-mint/40 text-mint">
        <Wallet class="h-6 w-6" />
      </div>
      <h2 class="mt-5 text-xl font-semibold">Connect your wallet</h2>
      <p class="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
        Connect to review your Hyperliquid balances, positions and account activity. Available actions depend on your network and account mode.
      </p>
      <button type="button" class="mint-btn btn-square mt-6 h-12 w-full text-base" @click="session.openPicker()">Connect Wallet</button>
      <p class="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
        <span class="h-1.5 w-1.5 rounded-full bg-mint" />
        Wallet connection required to view account data
      </p>
    </section>

    <section
      v-else-if="view === 'list'"
      class="relative z-10 w-full max-w-[380px] rounded-2xl border border-white/10 bg-[#1c2127] p-4 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="Connect Wallet"
    >
      <div class="flex items-center gap-2 px-1 pb-3">
        <span class="grid h-6 w-6 place-items-center rounded-full border border-line text-muted">
          <Wallet class="h-3.5 w-3.5" />
        </span>
        <h2 class="flex-1 text-center text-sm font-semibold">Connect Wallet</h2>
        <button type="button" class="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Close" @click="closeAll">
          <X class="h-4 w-4" />
        </button>
      </div>

      <p v-if="pageError" role="alert" class="mb-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{{ pageError }}</p>

      <ul class="space-y-1">
        <li v-for="wallet in visible" :key="wallet.id">
          <button
            type="button"
            class="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-start hover:bg-white/5"
            @click="choose(wallet)"
          >
            <WalletIcon :id="wallet.id" :src="wallet.image" :size="40" />
            <span class="text-sm font-semibold">{{ wallet.name }}</span>
            <span v-if="wallet.badge === 'qr'" class="ms-auto rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sky-300">QR code</span>
            <span v-else-if="wallet.badge === 'installed'" class="ms-auto text-[10px] font-bold uppercase tracking-wide text-mint">Installed</span>
            <ChevronRight class="h-4 w-4 text-muted" :class="wallet.badge ? '' : 'ms-auto'" />
          </button>
        </li>
      </ul>

      <div class="mt-3 flex items-center gap-2 rounded-xl border border-line bg-black/30 px-3 py-2.5 text-sm text-muted">
        <Search class="h-4 w-4 shrink-0" />
        <input v-model="query" class="field" placeholder="Search Wallet" aria-label="Search Wallet" />
        <button type="button" class="inline-flex items-center gap-1 rounded-md px-1 text-[11px] font-semibold text-muted hover:text-ink" aria-label="All wallets" @click="view = 'all'">
          {{ catalog.length }}
          <ChevronRight class="h-3.5 w-3.5" />
        </button>
      </div>
      <p class="mt-3 text-center text-[11px] text-muted">UX by reown</p>
    </section>

    <section
      v-else
      class="relative z-10 w-full max-w-[420px] rounded-2xl border border-white/10 bg-[#1c2127] p-4 shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-label="All Wallets"
    >
      <div class="flex items-center gap-2 px-1 pb-3">
        <button type="button" class="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Back" @click="view = 'list'">
          <ChevronLeft class="h-4 w-4" />
        </button>
        <h2 class="flex-1 text-center text-sm font-semibold">All Wallets</h2>
        <button type="button" class="grid h-7 w-7 place-items-center rounded-md text-muted hover:text-ink" aria-label="Close" @click="closeAll">
          <X class="h-4 w-4" />
        </button>
      </div>
      <p v-if="pageError" role="alert" class="mb-2 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{{ pageError }}</p>
      <div class="flex items-center gap-2">
        <label class="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-line bg-black/30 px-3 py-2 text-sm text-muted">
          <Search class="h-4 w-4 shrink-0" />
          <input v-model="directoryQuery" class="field" placeholder="Search wallet" aria-label="Search wallet" />
        </label>
        <button
          type="button"
          class="relative h-7 w-12 shrink-0 rounded-full transition"
          :class="certifiedOnly ? 'bg-sky-500' : 'bg-white/15'"
          :aria-pressed="certifiedOnly"
          aria-label="WalletConnect wallets"
          @click="certifiedOnly = !certifiedOnly"
        >
          <span class="absolute top-0.5 grid h-6 w-6 place-items-center rounded-full bg-white text-[10px] font-bold text-sky-600 transition" :class="certifiedOnly ? 'start-5' : 'start-0.5'">W</span>
        </button>
      </div>
      <p class="mt-2 text-[11px] text-muted">{{ visibleDirectory.length }} wallets</p>
      <div class="mt-2 grid max-h-[min(70vh,640px)] grid-cols-3 gap-1 overflow-y-auto pe-1">
        <button
          v-for="wallet in visibleDirectory"
          :key="wallet.id"
          type="button"
          class="flex flex-col items-center gap-2 rounded-xl px-2 py-3 text-center hover:bg-white/5"
          @click="choose(wallet)"
        >
          <span class="relative">
            <WalletIcon :id="wallet.id" :src="wallet.image" :size="56" />
            <ArrowUpRight class="absolute -bottom-1 -end-1 h-3.5 w-3.5 rounded-full bg-[#1c2127] text-muted" />
          </span>
          <span class="max-w-full truncate text-xs font-medium">{{ wallet.name }}</span>
        </button>
      </div>
    </section>
  </div>
  <p v-if="pageError && showOverlay" role="alert" class="fixed start-1/2 top-4 z-[80] w-[min(100%-2rem,420px)] -translate-x-1/2 rounded-xl border border-rose-400/50 bg-[#2a1216] px-4 py-3 text-center text-sm text-rose-100 shadow-lg">
    {{ pageError }}
  </p>
</template>
