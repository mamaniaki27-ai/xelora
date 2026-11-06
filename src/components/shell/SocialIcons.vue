<script setup lang="ts">
const links = [
  { label: 'X', href: 'https://x.com' },
  { label: 'YouTube', href: 'https://www.youtube.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com' },
  { label: 'Discord', href: 'https://discord.com' },
];
</script>

<template>
  <ul class="flex items-center justify-center gap-5">
    <li v-for="link in links" :key="link.label">
      <a
        :href="link.href"
        class="grid h-8 w-8 place-items-center text-muted/80 hover:text-ink"
        :aria-label="link.label"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg v-if="link.label === 'X'" viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M14.23 10.16 22.14 1.5h-1.87l-6.86 7.52L7.9 1.5H1.5l8.3 11.37L1.5 22.5h1.87l7.26-7.96 5.8 7.96h6.4l-8.6-11.84Zm-2.57 2.82-.84-1.14L4.26 2.86h2.88l5.4 7.3.84 1.14 7.02 9.5h-2.88l-5.86-7.82Z" />
        </svg>
        <svg v-else-if="link.label === 'YouTube'" viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6ZM9.8 15.5v-6.6l6.2 3.3-6.2 3.3Z" />
        </svg>
        <svg v-else-if="link.label === 'LinkedIn'" viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M4.7 3.2a2.2 2.2 0 1 0 .02 4.4 2.2 2.2 0 0 0-.02-4.4ZM3 8.7h3.4V21H3V8.7Zm5.5 0h3.3v1.7h.05c.46-.87 1.58-1.8 3.25-1.8 3.48 0 4.12 2.29 4.12 5.27V21H16v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H8.5V8.7Z" />
        </svg>
        <svg v-else viewBox="0 0 24 24" class="h-4 w-4" aria-hidden="true">
          <path fill="currentColor" d="M19.27 5.33A16.4 16.4 0 0 0 15.3 4l-.45.87a14.6 14.6 0 0 1 3.67 1.4 15.3 15.3 0 0 0-12.96 0A12.3 12.3 0 0 1 9.2 4.87L8.74 4a16.4 16.4 0 0 0-3.97 1.33C2.1 8.62 1.4 11.9 1.58 15.14a16.7 16.7 0 0 0 5.06 2.56l.64-1.05a11 11 0 0 1-1.63-.78l.4-.3a12.7 12.7 0 0 0 10.9 0l.4.3c-.52.32-1.07.58-1.63.78l.64 1.05a16.7 16.7 0 0 0 5.06-2.56c.3-3.7-.52-6.94-2.15-9.81ZM8.7 13.7c-.78 0-1.42-.74-1.42-1.64 0-.9.62-1.64 1.42-1.64.8 0 1.44.74 1.42 1.64 0 .9-.62 1.64-1.42 1.64Zm6.6 0c-.78 0-1.42-.74-1.42-1.64 0-.9.63-1.64 1.42-1.64.79 0 1.44.74 1.42 1.64 0 .9-.63 1.64-1.42 1.64Z" />
        </svg>
      </a>
    </li>
  </ul>
</template>
