<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { blogPost, blogPosts } from '../../data/blog';

const route = useRoute();
const post = computed(() => blogPost(String(route.params.slug ?? '')));
const related = computed(() => blogPosts.filter((item) => item.slug !== post.value?.slug && item.category === post.value?.category).slice(0, 2));

function formatDate(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-10">
    <template v-if="post">
      <RouterLink to="/blog" class="text-xs font-semibold text-mint">← All posts</RouterLink>
      <p class="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{{ post.category }}</p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight">{{ post.title }}</h1>
      <p class="mt-3 text-sm text-muted">{{ formatDate(post.date) }} · XELORA Research</p>
      <img :src="post.image" :alt="post.imageAlt" class="mt-6 h-72 w-full rounded-2xl object-cover sm:h-96" />
      <p class="mt-2 text-[11px] text-muted">Photograph via Unsplash.</p>
      <div class="mt-6 space-y-4 text-sm leading-7 text-ink/90">
        <p v-for="(paragraph, index) in post.paragraphs" :key="index">{{ paragraph }}</p>
      </div>
      <p class="mt-8 text-sm text-muted">
        Background reading:
        <a :href="post.sourceUrl" class="font-semibold text-mint" target="_blank" rel="noopener noreferrer">{{ post.sourceLabel }}</a>
      </p>
      <div v-if="related.length" class="mt-10">
        <h2 class="text-lg font-semibold">More in {{ post.category }}</h2>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <RouterLink v-for="item in related" :key="item.slug" :to="`/blog/${item.slug}`" class="panel overflow-hidden">
            <img :src="item.image" :alt="item.imageAlt" class="h-32 w-full object-cover" />
            <p class="p-3 text-sm font-semibold">{{ item.title }}</p>
          </RouterLink>
        </div>
      </div>
    </template>
    <template v-else>
      <h1 class="text-4xl font-semibold">Post not found</h1>
      <p class="mt-3 text-sm text-muted">That article is not on the desk.</p>
      <RouterLink to="/blog" class="mint-btn mt-6">Back to the blog</RouterLink>
    </template>
  </section>
</template>
