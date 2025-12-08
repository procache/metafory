// @ts-check
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import netlify from '@astrojs/netlify';

// https://astro.build/config
export default {
  output: 'static', // Static-first: pages are static by default, API routes are serverless functions
  adapter: netlify({
    edgeMiddleware: false,
  }),

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
};
