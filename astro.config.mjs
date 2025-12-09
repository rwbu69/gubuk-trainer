// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://rwbu69.github.io',
  base: '/gubuk-trainer',
  vite: {
    plugins: [tailwindcss()]
  }
});