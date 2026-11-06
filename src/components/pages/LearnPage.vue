<script setup lang="ts">
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import VideoFrame from '../learn/VideoFrame.vue';
import { learnGlossary, learnLesson, learnLessons, learnPath, learnTracks, learnVideos, type LearnTrack } from '../../data/learn';

const query = ref('');
const track = ref<LearnTrack | 'All'>('All');
const activeVideo = ref(learnVideos[0].id);

const visible = computed(() => {
  const term = query.value.trim().toLowerCase();
  return learnLessons.filter((lesson) => {
    if (track.value !== 'All' && lesson.track !== track.value) return false;
    if (!term) return true;
    return `${lesson.title} ${lesson.summary} ${lesson.track}`.toLowerCase().includes(term);
  });
});

const pathLessons = computed(() => learnPath.map((slug) => learnLesson(slug)).filter((lesson) => lesson != null));
const playing = computed(() => learnVideos.find((video) => video.id === activeVideo.value) ?? learnVideos[0]);
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 py-10">
    <p class="text-xs font-bold uppercase tracking-[0.18em] text-mint">Learning center</p>
    <h1 class="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">Learn the market before you size a trade</h1>
    <p class="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
      Eight lessons on what a coin is, how a price is quoted, how a candle is built, and how funding and margin change a position. The videos are public lectures. The notes are original summaries, not trade signals.
    </p>

    <form class="mt-6 max-w-xl" role="search" @submit.prevent>
      <label>
        <span class="sr-only">Search lessons</span>
        <input v-model="query" class="field w-full rounded-xl border border-line bg-elev px-4 py-3" placeholder="Search lessons, funding, candles, wallets" />
      </label>
    </form>

    <div class="mt-8 grid items-stretch gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="panel p-5">
        <p class="text-xs font-bold uppercase tracking-[0.16em] text-mint">Start here</p>
        <ol class="mt-4 list-none space-y-4 p-0">
        <li v-for="(lesson, index) in pathLessons" :key="lesson.slug">
          <RouterLink :to="`/learn/${lesson.slug}`" class="flex gap-3 rounded-xl hover:text-mint">
            <span class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-mint text-sm font-bold text-mint-ink">{{ index + 1 }}</span>
            <span>
              <span class="block text-sm font-semibold">{{ lesson.title }}</span>
              <span class="mt-1 block text-xs text-muted">{{ lesson.track }} · {{ lesson.minutes }} min</span>
            </span>
          </RouterLink>
        </li>
        </ol>
      </div>
      <figure class="panel overflow-hidden">
        <img src="/blog/markets.jpg" alt="Photograph of a monitor showing red and green candlesticks and moving-average lines." class="h-full max-h-80 w-full object-cover" />
        <figcaption class="px-4 py-3 text-[11px] text-muted">Photograph via Unsplash. The chart is an illustration of how candles are drawn, not a live signal.</figcaption>
      </figure>
    </div>

    <div class="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Lesson tracks">
      <button
        v-for="item in learnTracks"
        :key="item"
        type="button"
        role="tab"
        class="rounded-full px-3 py-1 text-xs font-semibold"
        :class="track === item ? 'bg-mint text-mint-ink' : 'bg-elev text-muted'"
        :aria-selected="track === item"
        @click="track = item"
      >
        {{ item }}
      </button>
    </div>

    <p v-if="visible.length === 0" class="mt-10 text-sm text-muted">No lesson matches this search or track.</p>
    <div v-else class="mt-6 grid gap-5 lg:grid-cols-3">
      <RouterLink v-for="lesson in visible" :key="lesson.slug" :to="`/learn/${lesson.slug}`" class="panel overflow-hidden transition hover:border-mint/40">
        <img :src="lesson.image" :alt="lesson.imageAlt" class="h-44 w-full object-cover" />
        <div class="p-4">
          <p class="text-[11px] font-bold uppercase tracking-[0.14em] text-mint">{{ lesson.track }} · {{ lesson.minutes }} min</p>
          <h2 class="mt-2 text-lg font-semibold leading-snug">{{ lesson.title }}</h2>
          <p class="mt-2 text-sm leading-relaxed text-muted">{{ lesson.summary }}</p>
        </div>
      </RouterLink>
    </div>

    <div class="mt-12">
      <p class="text-xs font-bold uppercase tracking-[0.18em] text-mint">Watch</p>
      <h2 class="mt-2 text-2xl font-semibold">Public lectures on YouTube</h2>
      <p class="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        These lectures are hosted by their authors. XELORA Research writes the lessons above. Use a lecture for the picture, then use the lesson and the calculators for the numbers.
      </p>
      <div class="mt-5 grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <VideoFrame :id="playing.id" :title="`${playing.title} by ${playing.channel}`" />
          <p class="mt-3 text-sm font-semibold">{{ playing.title }}</p>
          <p class="mt-1 text-xs text-muted">{{ playing.channel }} · {{ playing.note }}</p>
        </div>
        <div class="grid gap-3" role="list">
          <button
            v-for="video in learnVideos"
            :key="video.id"
            type="button"
            class="panel flex gap-3 p-2 text-left"
            :class="video.id === playing.id ? 'border-mint' : ''"
            :aria-pressed="video.id === playing.id"
            @click="activeVideo = video.id"
          >
            <img :src="`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`" :alt="''" class="h-16 w-28 shrink-0 rounded-lg object-cover" />
            <span>
              <span class="block text-sm font-semibold leading-snug">{{ video.title }}</span>
              <span class="mt-1 block text-xs text-muted">{{ video.channel }}</span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="mt-12">
      <h2 class="text-2xl font-semibold">Terms used on the ticket</h2>
      <dl class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="item in learnGlossary" :key="item.term" class="panel p-4">
          <dt class="text-sm font-semibold">{{ item.term }}</dt>
          <dd class="mt-2 text-sm leading-relaxed text-muted">{{ item.meaning }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
