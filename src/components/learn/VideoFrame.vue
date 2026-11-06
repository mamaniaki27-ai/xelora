<script setup lang="ts">
defineProps<{ id: string; title: string }>();
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-line bg-black">
    <iframe
      class="aspect-video w-full"
      :src="`https://www.youtube-nocookie.com/embed/${id}?rel=0`"
      :title="title"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    />
  </div>
</template>
