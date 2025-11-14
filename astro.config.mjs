// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
// Note: import the server entry from the package's exports
import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Build a server output so the Node adapter can run runtime routes (if any).
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  }
});