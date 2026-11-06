<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { pageSections } from '../../data/sections';
import { infoPages } from '../../data/pages';

const route = useRoute();
const query = ref('');
const page = computed(() => infoPages.find((item) => item.path === route.path));
const sections = computed(() => pageSections[route.path] ?? (page.value ? [{ title: page.value.title, body: page.value.lede }] : []));
const visible = computed(() => {
  const q = query.value.trim().toLowerCase();
  return sections.value.filter((section) => !q || `${section.title} ${section.body}`.toLowerCase().includes(q));
});
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-8">
    <template v-if="page">
      <p class="text-xs font-bold uppercase tracking-[0.16em] text-mint">XELORA</p>
      <h1 class="mt-2 text-4xl font-semibold">{{ page.title }}</h1>
      <p class="mt-3 text-sm leading-relaxed text-muted">{{ page.lede }}</p>
      <form class="mt-5" role="search" @submit.prevent>
        <label>
          <span class="sr-only">Search {{ page.title }}</span>
          <input v-model="query" class="field w-full rounded-xl border border-line bg-elev px-4 py-2.5" :placeholder="`Search ${page.title.toLowerCase()}...`" />
        </label>
      </form>
      <article v-for="section in visible" :key="section.title" class="panel mt-3 p-4">
        <h2 class="text-lg font-semibold">{{ section.title }}</h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">{{ section.body }}</p>
      </article>
      <p v-if="visible.length === 0" class="py-8 text-center text-sm text-muted">Nothing on this page matches that search.</p>
      <RouterLink to="/markets" class="ghost-btn mt-6">Back to markets</RouterLink>
    </template>
    <template v-else>
      <h1 class="text-4xl font-semibold">Page not found</h1>
      <p class="mt-4 text-muted">That route is not part of this front end.</p>
      <RouterLink to="/" class="mint-btn mt-6">Home</RouterLink>
    </template>
  </section>
</template>
