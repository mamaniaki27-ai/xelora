<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LogoMark from './LogoMark.vue';
import SocialIcons from './SocialIcons.vue';
import { footerGroups } from '../../data/pages';
import { useUiStore } from '../../stores/ui';

const ui = useUiStore();
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto w-full max-w-[1200px] px-4 pt-14">
      <div class="flex flex-col items-center text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2.5 text-mint">
          <LogoMark />
          <span class="text-2xl font-extrabold tracking-[0.08em] text-ink">XELORA</span>
        </RouterLink>
        <p class="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{{ ui.t('footer.tagline') }}</p>
        <div class="mt-5">
          <SocialIcons />
        </div>
      </div>

      <div class="mt-8 border-t border-line pt-8">
        <div class="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7">
          <nav v-for="group in footerGroups" :key="group.title" :aria-label="group.title">
            <h2 class="text-[11px] font-bold uppercase tracking-[0.14em] text-ink">{{ group.title }}</h2>
            <ul class="mt-4 space-y-2.5">
              <li v-for="link in group.links" :key="link.path + link.label">
                <RouterLink :to="link.path" class="text-sm text-muted hover:text-ink">{{ link.label }}</RouterLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-line py-5">
        <p class="text-xs uppercase tracking-wide text-muted">© 2026 XELORA. All rights reserved.</p>
        <RouterLink to="/status" class="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink">
          <span class="h-1.5 w-1.5 rounded-full bg-mint" />
          System status
        </RouterLink>
      </div>
    </div>
  </footer>
</template>
