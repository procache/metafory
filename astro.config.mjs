// @ts-check
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default {
  site: 'https://metafory.cz',
  output: 'static', // Static-first: pages are static by default, API routes are serverless functions
  adapter: netlify({
    edgeMiddleware: false,
  }),

  integrations: [react(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        usePolling: true, // Fix for WSL2 file watching
        interval: 100
      }
    }
  }
};
