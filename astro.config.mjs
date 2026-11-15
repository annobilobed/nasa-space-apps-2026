// @ts-check
import { defineConfig } from 'astro/config';

// PORTABLE=1 builds flat .html files that the post-build script rewrites to
// relative links, so the site runs from any folder or static host sub-path.
const portable = process.env.PORTABLE === '1';
// Some static hosts reserve names that start with "_" — keep output names clean.
const clean = (/** @type {string} */ n) => n.replace(/[^A-Za-z0-9.-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'chunk';

export default defineConfig({
  site: process.env.SITE_URL || 'https://airxon.example',
  trailingSlash: portable ? 'ignore' : 'always',
  build: { format: portable ? 'file' : 'directory', inlineStylesheets: 'auto', assets: 'assets' },
  compressHTML: true,
  devToolbar: { enabled: false },
  vite: {
    build: {
      rollupOptions: {
        output: {
          entryFileNames: (c) => `assets/${clean(c.name)}.[hash].js`,
          chunkFileNames: (c) => `assets/${clean(c.name)}.[hash].js`,
          assetFileNames: (a) => `assets/${clean((a.names?.[0] ?? a.name ?? 'asset').replace(/\.[^.]+$/, ''))}.[hash][extname]`,
        },
      },
    },
  },
});
