import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

import htmlInclude from './src/plugins/html-include.js';

export default defineConfig({
  // относительные пути в сборке: работает из любой папки
  // (GitHub Pages /jet_bridge/, локально, любой хостинг)
  base: './',
  // сборка в docs/ — GitHub Pages раздаёт её напрямую (Settings → Pages → main + /docs)
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
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
