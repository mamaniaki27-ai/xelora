<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ArrowUpRight, Check, Droplets, Lock, Shield, X } from 'lucide-vue-next';
import LogoMark from '../shell/LogoMark.vue';

const storageKey = 'xelora-xco-waitlist';
const open = ref(false);
const email = ref('');
const joined = ref(false);
const error = ref('');

const allocation = [
  { label: 'Ecosystem Rewards', pct: 40, color: '#0ecb81' },
  { label: 'Treasury (DAO)', pct: 20, color: '#14b8a6' },
  { label: 'Team & Advisors', pct: 15, color: '#2dd4bf' },
  { label: 'Liquidity Provision', pct: 10, color: '#34d399' },
  { label: 'Development & Marketing', pct: 7, color: '#5eead4' },
  { label: 'Community Airdrop', pct: 5, color: '#86efac' },
  { label: 'Founder & Early Contributor', pct: 3, color: '#a7f3d0' },
];

const phases = [
  { phase: 'Phase 1', title: 'Wallet, Swap & Landing', status: 'Completed', tone: 'done' },
  { phase: 'Phase 2', title: 'Xelo Token Launch', status: 'In progress', tone: 'active' },
  { phase: 'Phase 3', title: 'Earn & Governance', status: 'Planned', tone: 'planned' },
];

const assurances = [
  { icon: Lock, title: 'Multisig Treasury', body: 'Treasury will be secured via MultiSig + Timelock after deployment.' },
  { icon: Shield, title: 'Security Review', body: 'Independent security review planned before any public deployment.' },
  { icon: Droplets, title: 'Liquidity Lock', body: 'Initial liquidity will be locked with a public, verifiable lock after launch.' },
];

onMounted(() => {
  joined.value = Boolean(localStorage.getItem(storageKey));
});

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitWaitlist() {
  const next = email.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
    error.value = 'Enter a valid email address.';
    return;
  }
  localStorage.setItem(storageKey, next);
  joined.value = true;
  error.value = '';
  open.value = false;
}
</script>

<template>
  <section id="xco-token" class="mx-auto w-full max-w-[1100px] px-4 py-6 pb-16">
    <div class="relative overflow-hidden rounded-[1.75rem] border border-mint/30 bg-[#070b09] px-5 py-8 text-white shadow-[0_0_90px_rgba(14,203,129,0.09)] sm:px-8 sm:py-10">
      <div class="pointer-events-none absolute -end-24 -top-24 h-64 w-64 rounded-full bg-mint/10 blur-3xl" />
      <div class="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div class="max-w-2xl">
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-mint">
              <span class="h-1.5 w-1.5 rounded-full bg-mint" />
              Xelo token — pre-launch
            </span>
            <span class="text-[10px] font-bold uppercase tracking-[0.16em] text-mint">Ecosystem governance</span>
          </div>
          <h2 class="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Xelo Token — Pre-launch Information
          </h2>
          <p class="mt-4 max-w-xl text-sm leading-relaxed text-white/60">
            Xelo Token is marked pre-launch. Token utility, incentives and availability remain unconfirmed until the relevant token documentation is published and approved.
          </p>
        </div>
        <button type="button" class="mint-btn h-11 shrink-0 px-4" @click="open = true">
          {{ joined ? 'Waitlist joined' : 'Join the waitlist' }}
          <ArrowUpRight class="h-4 w-4" />
        </button>
      </div>

      <div class="relative mt-8 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <article class="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p class="pointer-events-none absolute end-4 top-10 select-none text-7xl font-black tracking-tight text-white/[0.04]">Xelo</p>
          <div class="flex items-center gap-3">
            <span class="grid h-11 w-11 place-items-center rounded-2xl bg-mint/15">
              <LogoMark />
            </span>
            <span>
              <span class="block font-bold">Xelo Token</span>
              <span class="block text-xs text-white/50">ERC-20 · Arbitrum One</span>
            </span>
          </div>

          <dl class="mt-5 grid grid-cols-2 gap-3">
            <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
              <dt class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Max supply</dt>
              <dd class="mt-2 text-sm font-semibold num">1,000,000,000 Xelo</dd>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
              <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Standard</dt>
              <dd class="mt-2 text-sm font-semibold">ERC-20</dd>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
              <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Network</dt>
              <dd class="mt-2 text-sm font-semibold">Arbitrum One</dd>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/30 p-3">
              <dt class="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Launch price</dt>
              <dd class="mt-2 text-sm font-semibold">TBA</dd>
            </div>
          </dl>

          <div id="allocation" class="mt-5 scroll-mt-24">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">Token allocation</p>
            <div class="mt-3 flex h-2 overflow-hidden rounded-full" aria-hidden="true">
              <span v-for="slice in allocation" :key="slice.label" class="h-full" :style="{ width: `${slice.pct}%`, background: slice.color }" />
            </div>
            <ul class="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
              <li v-for="slice in allocation" :key="slice.label" class="flex items-center gap-2 text-[11px] text-white/70">
                <span class="h-1.5 w-1.5 shrink-0 rounded-full" :style="{ background: slice.color }" />
                <span class="min-w-0 flex-1 truncate">{{ slice.label }}</span>
                <span class="num font-semibold text-white/90">{{ slice.pct }}%</span>
              </li>
            </ul>
          </div>

          <div class="mt-5 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
            <p class="text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Contract address</p>
            <p class="mt-1 text-lg font-semibold">To be announced</p>
          </div>

          <button type="button" class="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-mint/15 text-sm font-bold text-mint" @click="jump('allocation')">
            View full tokenomics & vesting
            <ArrowUpRight class="h-4 w-4" />
          </button>
        </article>

        <div>
          <div class="flex items-center justify-between gap-3">
            <h3 class="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Roadmap</h3>
            <button type="button" class="text-xs font-semibold text-mint" @click="jump('roadmap')">Full roadmap →</button>
          </div>
          <ol id="roadmap" class="mt-3 space-y-3 scroll-mt-24">
            <li v-for="item in phases" :key="item.phase" class="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span class="flex min-w-0 items-center gap-3">
                <span
                  class="h-2.5 w-2.5 shrink-0 rounded-full"
                  :class="item.tone === 'done' ? 'bg-mint' : item.tone === 'active' ? 'bg-amber-400' : 'bg-white/25'"
                />
                <span class="min-w-0">
                  <span class="block text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">{{ item.phase }}</span>
                  <span class="block truncate font-semibold">{{ item.title }}</span>
                </span>
              </span>
              <span
                class="shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                :class="item.tone === 'done' ? 'border-mint/40 text-mint' : item.tone === 'active' ? 'border-amber-400/50 text-amber-300' : 'border-white/15 text-white/45'"
              >
                {{ item.status }}
              </span>
            </li>
          </ol>

          <ul class="mt-3 space-y-3">
            <li v-for="item in assurances" :key="item.title" class="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <p class="flex items-center gap-2 font-semibold">
                <component :is="item.icon" class="h-4 w-4 text-mint" />
                {{ item.title }}
              </p>
              <p class="mt-1 text-sm leading-relaxed text-white/55">{{ item.body }}</p>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="open" class="fixed inset-0 z-[70] grid place-items-center bg-black/70 px-4" @click.self="open = false">
      <form class="w-full max-w-md rounded-3xl border border-line bg-elev p-5 text-ink" @submit.prevent="submitWaitlist">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-mint">Xelo pre-launch</p>
            <h3 class="mt-1 text-xl font-bold">Join the waitlist</h3>
          </div>
          <button type="button" class="grid h-8 w-8 place-items-center rounded-full text-muted" aria-label="Close waitlist" @click="open = false">
            <X class="h-4 w-4" />
          </button>
        </div>
        <p class="mt-3 text-sm leading-relaxed text-muted">
          Leave an email for the launch notice. It stays in this browser. No sale is open.
        </p>
        <label class="mt-4 block">
          <span class="text-xs font-semibold text-muted">Email</span>
          <input v-model="email" type="email" required class="field mt-1 rounded-xl border border-line bg-bg px-3 py-2.5" placeholder="name@email.com" />
        </label>
        <p v-if="error" class="mt-2 text-sm text-ask">{{ error }}</p>
        <p v-if="joined" class="mt-2 flex items-center gap-2 text-sm font-semibold text-mint">
          <Check class="h-4 w-4" />
          This browser is already on the waitlist.
        </p>
        <button type="submit" class="mint-btn mt-4 h-11 w-full">Save my place</button>
      </form>
    </div>
  </section>
</template>
