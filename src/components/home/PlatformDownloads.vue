<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';
import { Check, Download, Laptop, Monitor, Smartphone } from 'lucide-vue-next';

const platforms = [
  {
    id: 'windows',
    label: 'Windows',
    icon: Monitor,
    kicker: 'Optimized for Windows 10 & 11',
    note: 'Desktop build for the trading board, wallet preview, and market list.',
    headline: 'Trade and manage your Web3 assets on Windows.',
    compat: 'Compatible with supported Windows devices',
  },
  {
    id: 'mac',
    label: 'Mac',
    icon: Laptop,
    kicker: 'Optimized for macOS',
    note: 'Desktop build for Mac.',
    headline: 'Trade and manage your Web3 assets on Mac.',
    compat: 'Compatible with supported macOS devices',
  },
  {
    id: 'android',
    label: 'Android',
    icon: Smartphone,
    kicker: 'Optimized for Android phones & tablets',
    note: 'Mobile build for Android phones and tablets.',
    headline: 'Trade and manage your Web3 assets on Android.',
    compat: 'Compatible with supported Android devices',
  },
] as const;

const points = [
  'Connect your wallet with a simple and secure experience',
  'Track markets with real-time trading information',
  'Stay updated with important account activity',
];

const selectedId = ref<(typeof platforms)[number]['id']>('windows');
const notice = ref('');
const completedId = ref('');
let timer = 0;

const selected = computed(() => platforms.find((item) => item.id === selectedId.value) ?? platforms[0]);

function confirmDownload() {
  completedId.value = selected.value.id;
  notice.value = `${selected.value.label} download complete.`;
  window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    notice.value = '';
  }, 8000);
}

onUnmounted(() => window.clearTimeout(timer));
</script>

<template>
  <section class="mx-auto w-full max-w-[1100px] px-4 py-6">
    <div class="rounded-[1.75rem] border border-mint/25 bg-elev px-5 py-12 shadow-[0_0_80px_rgba(14,203,129,0.07)] sm:px-10">
      <p class="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-mint">Cross-platform access</p>
      <h2 class="mx-auto mt-4 max-w-xl text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
        Choose your platform.
        <span class="mt-1 block text-muted">Official client downloads</span>
      </h2>
      <p class="mx-auto mt-4 max-w-lg text-center text-sm leading-relaxed text-muted">
        Pick Windows, Mac, or Android. The download button confirms when the package is ready.
      </p>

      <div class="mt-8 flex justify-center" role="tablist" aria-label="Download platform">
        <div class="inline-flex rounded-full bg-soft p-1">
          <button
            v-for="platform in platforms"
            :key="platform.id"
            type="button"
            role="tab"
            class="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
            :class="selectedId === platform.id ? 'bg-mint text-mint-ink' : 'text-muted'"
            :aria-selected="selectedId === platform.id"
            @click="selectedId = platform.id"
          >
            <component :is="platform.icon" class="h-4 w-4" />
            {{ platform.label }}
          </button>
        </div>
      </div>

      <div class="mt-10 grid items-center gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{{ selected.kicker }}</p>
          <p class="mt-2 text-sm text-muted">{{ selected.note }}</p>
          <h3 class="mt-5 max-w-md text-2xl font-bold tracking-tight">{{ selected.headline }}</h3>
          <ul class="mt-5 space-y-2.5">
            <li v-for="point in points" :key="point" class="flex items-start gap-2 text-sm text-ink">
              <Check class="mt-0.5 h-4 w-4 shrink-0 text-mint" />
              {{ point }}
            </li>
          </ul>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <button type="button" class="mint-btn h-11 px-4" @click="confirmDownload">
              <Download class="h-4 w-4" />
              Download for {{ selected.label }}
            </button>
            <p class="text-xs text-muted">{{ selected.compat }}</p>
          </div>
        </div>

        <div class="grid min-h-52 place-items-center rounded-2xl border border-dashed border-line px-6 py-8 text-center">
          <div v-if="completedId === selected.id">
            <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-mint/15 text-mint">
              <Check class="h-6 w-6" />
            </span>
            <p class="mt-4 font-semibold">Download complete</p>
          </div>
          <div v-else>
            <Download class="mx-auto h-7 w-7 text-muted" />
            <p class="mt-4 font-semibold">{{ selected.label }} package ready</p>
            <p class="mt-1 text-sm leading-relaxed text-muted">Use the button to confirm this package.</p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="notice"
      class="fixed end-4 top-20 z-[80] flex max-w-sm items-center gap-3 rounded-2xl border border-mint/40 bg-elev px-4 py-3 text-sm font-semibold shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
      role="status"
      aria-live="polite"
    >
      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-mint-ink">
        <Check class="h-4 w-4" />
      </span>
      {{ notice }}
    </div>
  </section>
</template>
