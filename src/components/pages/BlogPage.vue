<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { blogCategories, blogPosts, type BlogCategory } from '../../data/blog';

const query = ref('');
const category = ref<BlogCategory | 'All'>('All');

const visible = computed(() => {
  const term = query.value.trim().toLowerCase();
  return blogPosts.filter((post) => {
    if (category.value !== 'All' && post.category !== category.value) return false;
    if (!term) return true;
    return `${post.title} ${post.excerpt} ${post.category}`.toLowerCase().includes(term);
  });
});

const trending = [
  { label: 'Trade Futures', to: '/futures' },
  { label: 'Free Tools', to: '/tools' },
  { label: 'Crypto Prices', to: '/crypto-prices' },
  { label: 'Trading Fees', to: '/trading-fees' },
  { label: 'Proof of Reserves', to: '/proof-of-reserves' },
  { label: 'Security Audit', to: '/security-audit' },
];

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-10">
    <p class="text-xs font-bold uppercase tracking-[0.18em] text-mint">Web3 Insights</p>
    <h1 class="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Discover the future of crypto</h1>
    <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
      Notes from the desk on funding, position size, wallets, and how to read the market list. The write-ups summarize public guides. They are not trade signals.
    </p>

    <form class="mt-6 max-w-xl" role="search" @submit.prevent>
      <label>
        <span class="sr-only">Search articles</span>
        <input v-model="query" class="field w-full rounded-xl border border-line bg-elev px-4 py-3" placeholder="Search articles, tokens, or trends" />
      </label>
    </form>

    <div class="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="Article categories">
      <button
        v-for="item in blogCategories"
        :key="item"
        type="button"
        role="tab"
        class="rounded-full px-3 py-1 text-xs font-semibold"
        :class="category === item ? 'bg-mint text-mint-ink' : 'bg-elev text-muted'"
        :aria-selected="category === item"
        @click="category = item"
      >
        {{ item === 'All' ? 'All' : item }}
      </button>
    </div>

    <p v-if="visible.length === 0" class="mt-10 text-sm text-muted">No published posts match this search or category.</p>

    <div v-else class="mt-8 grid gap-5 lg:grid-cols-3">
      <RouterLink
        v-for="post in visible"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
        class="panel overflow-hidden transition hover:border-mint/40"
      >
        <img :src="post.image" :alt="post.imageAlt" class="h-44 w-full object-cover" />
        <div class="p-4">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-mint">{{ post.category }}</p>
          <h2 class="mt-2 text-lg font-semibold leading-snug">{{ post.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ post.excerpt }}</p>
          <p class="mt-3 text-xs text-muted">{{ formatDate(post.date) }} · XELORA Research</p>
        </div>
      </RouterLink>
    </div>

    <div class="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <article class="panel p-5">
        <h2 class="text-lg font-semibold">XELORA newsletter</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Occasional product and security notes would go here. Signup is not enabled. No email is collected, and no trading or wallet data is attached.
        </p>
      </article>
      <article class="panel p-5">
        <h2 class="text-lg font-semibold">Trending now</h2>
        <ul class="mt-3 flex flex-wrap gap-2">
          <li v-for="item in trending" :key="item.to">
            <RouterLink :to="item.to" class="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted hover:text-ink">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </article>
    </div>

    <div class="mt-6 grid gap-4 md:grid-cols-3">
      <article class="panel p-4">
        <h2 class="font-semibold">Non-custodial design</h2>
        <p class="mt-2 text-sm text-muted">The interface asks a wallet to sign. It does not hold the assets or the recovery phrase.</p>
      </article>
      <article class="panel p-4">
        <h2 class="font-semibold">Wallet-first access</h2>
        <p class="mt-2 text-sm text-muted">Connect a supported wallet to review balances and preview orders in this browser.</p>
      </article>
      <article class="panel p-4">
        <h2 class="font-semibold">Built for Web3 trading</h2>
        <p class="mt-2 text-sm text-muted">Spot, perpetuals, and swaps share one market list, one journal, and one set of calculators.</p>
      </article>
    </div>
  </section>
</template>
