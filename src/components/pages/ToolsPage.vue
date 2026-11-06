<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { toolCategoryLabel, toolPath, tools, type ToolCategory } from '../../data/tools';

const query = ref('');
const category = ref<ToolCategory | 'all'>('all');

const counts = computed(() => ({
  all: tools.length,
  risk: tools.filter((tool) => tool.category === 'risk').length,
  market: tools.filter((tool) => tool.category === 'market').length,
  yield: tools.filter((tool) => tool.category === 'yield').length,
}));

const rows = computed(() => {
  const q = query.value.trim().toLowerCase();
  return tools
    .filter((tool) => (category.value === 'all' ? true : tool.category === category.value))
    .filter((tool) => !q || `${tool.title} ${tool.summary} ${toolCategoryLabel[tool.category]}`.toLowerCase().includes(q));
});

const chips: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'risk', label: 'Trading & risk' },
  { id: 'market', label: 'Market & valuation' },
  { id: 'yield', label: 'Yield & funding' },
];
</script>

<template>
  <section class="mx-auto w-full max-w-[1100px] px-4 py-8">
    <p class="text-sm text-muted">Tools</p>
    <h1 class="mt-3 text-4xl font-semibold tracking-tight">Smart tools for smarter trades</h1>
    <p class="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
      Calculators for entries, risk, and funding. Each result is computed from the numbers you enter on this device.
    </p>

    <form class="mt-6" role="search" @submit.prevent>
      <label class="block">
        <span class="sr-only">Search calculators</span>
        <input v-model="query" class="field h-11 rounded-lg border border-line bg-elev px-4" placeholder="e.g. funding, risk, token price" />
      </label>
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="chip in chips"
          :key="chip.id"
          type="button"
          class="inline-flex h-8 items-center rounded px-3 text-xs font-semibold"
          :class="category === chip.id ? 'bg-mint text-mint-ink' : 'border border-line text-muted'"
          @click="category = chip.id"
        >
          {{ chip.label }} ({{ counts[chip.id] }})
        </button>
      </div>
    </form>

    <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <RouterLink
        v-for="tool in rows"
        :key="tool.slug"
        :to="toolPath(tool.slug)"
        class="block rounded-lg border border-line bg-elev/40 p-4 hover:border-mint"
      >
        <p class="text-[11px] font-semibold uppercase tracking-wide text-mint">{{ toolCategoryLabel[tool.category] }}</p>
        <h2 class="mt-2 text-lg font-semibold">{{ tool.title }}</h2>
        <p class="mt-1 text-sm leading-relaxed text-muted">{{ tool.summary }}</p>
      </RouterLink>
    </div>
    <p v-if="rows.length === 0" class="py-10 text-center text-sm text-muted">No calculator matches that search.</p>
  </section>
</template>
