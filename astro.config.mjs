// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default defineConfig({
  output: 'static', // Static-first: pages are static by default, API routes are serverless functions
  adapter: netlify(),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});