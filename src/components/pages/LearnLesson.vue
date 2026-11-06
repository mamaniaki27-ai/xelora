<script setup lang="ts">
import { computed, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import VideoFrame from '../learn/VideoFrame.vue';
import { learnLesson, learnLessons, learnVideo } from '../../data/learn';

const route = useRoute();
const lesson = computed(() => learnLesson(String(route.params.slug ?? '')));
const related = computed(() => learnLessons.filter((item) => item.slug !== lesson.value?.slug && item.track === lesson.value?.track).slice(0, 2));
const video = computed(() => (lesson.value?.videoId ? learnVideo(lesson.value.videoId) : undefined));

watch(
  lesson,
  (value) => {
    if (typeof document === 'undefined') return;
    document.title = value ? `${value.title} | XELORA` : 'Learning center | XELORA';
  },
  { immediate: true },
);
</script>

<template>
  <section class="mx-auto w-full max-w-3xl px-4 py-10">
    <template v-if="lesson">
      <RouterLink to="/learn" class="text-xs font-semibold text-mint">← All lessons</RouterLink>
      <p class="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-mint">{{ lesson.track }} · {{ lesson.minutes }} min read</p>
      <h1 class="mt-2 text-4xl font-semibold tracking-tight">{{ lesson.title }}</h1>
      <p class="mt-3 text-sm leading-relaxed text-muted">{{ lesson.summary }}</p>
      <img :src="lesson.image" :alt="lesson.imageAlt" class="mt-6 h-72 w-full rounded-2xl object-cover sm:h-96" />
      <p class="mt-2 text-[11px] text-muted">Photograph via Unsplash.</p>

      <div class="mt-8 space-y-8">
        <section v-for="section in lesson.sections" :key="section.heading">
          <h2 class="text-xl font-semibold">{{ section.heading }}</h2>
          <div class="mt-3 space-y-4 text-sm leading-7 text-ink/90">
            <p v-for="(paragraph, index) in section.paragraphs" :key="index">{{ paragraph }}</p>
          </div>
        </section>
      </div>

      <section v-if="lesson.example" class="panel mt-8 p-5">
        <h2 class="text-lg font-semibold">{{ lesson.example.title }}</h2>
        <dl class="mt-4 divide-y divide-line">
          <div v-for="row in lesson.example.rows" :key="row.label" class="flex items-baseline justify-between gap-4 py-2 text-sm">
            <dt class="text-muted">{{ row.label }}</dt>
            <dd class="text-end font-semibold">{{ row.value }}</dd>
          </div>
        </dl>
        <p class="mt-3 text-sm leading-relaxed text-muted">{{ lesson.example.note }}</p>
      </section>

      <section v-if="video" class="mt-8">
        <h2 class="text-lg font-semibold">Watch with this lesson</h2>
        <p class="mt-2 text-sm text-muted">{{ video.title }} · {{ video.channel }}</p>
        <div class="mt-3">
          <VideoFrame :id="video.id" :title="`${video.title} by ${video.channel}`" />
        </div>
      </section>

      <div class="mt-8 flex flex-wrap items-center gap-3">
        <RouterLink v-if="lesson.practice" :to="lesson.practice.to" class="mint-btn">{{ lesson.practice.label }}</RouterLink>
        <a :href="lesson.sourceUrl" class="ghost-btn" target="_blank" rel="noopener noreferrer">{{ lesson.sourceLabel }}</a>
      </div>

      <div v-if="related.length" class="mt-10">
        <h2 class="text-lg font-semibold">More in {{ lesson.track }}</h2>
        <div class="mt-3 grid gap-3 sm:grid-cols-2">
          <RouterLink v-for="item in related" :key="item.slug" :to="`/learn/${item.slug}`" class="panel overflow-hidden">
            <img :src="item.image" :alt="item.imageAlt" class="h-32 w-full object-cover" />
            <p class="p-3 text-sm font-semibold">{{ item.title }}</p>
          </RouterLink>
        </div>
      </div>
    </template>
    <template v-else>
      <h1 class="text-4xl font-semibold">Lesson not found</h1>
      <p class="mt-3 text-sm text-muted">That lesson is not in the learning center.</p>
      <RouterLink to="/learn" class="mint-btn mt-6">Back to lessons</RouterLink>
    </template>
  </section>
</template>
