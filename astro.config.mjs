import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/postcss';

export default defineConfig({
  devToolbar: { enabled: false },
  integrations: [vue({ appEntrypoint: '/src/app' })],
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
});
