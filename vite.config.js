import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import htmlInclude from './src/plugins/html-include.js';

export default defineConfig({
  plugins: [htmlInclude()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    open: true,
  },
});
