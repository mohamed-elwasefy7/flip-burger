import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

/*
 * Static files that live at the project root (per the required architecture)
 * and must be shipped verbatim into dist/ next to the hashed bundles.
 */
const STATIC_ENTRIES = [
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
  '404.html',
  'data',
  'assets',
];

/*
 * The hero flames webp are referenced by <source srcset> in index.html, which
 * Vite rewrites to hashed files in bundle/. Their verbatim copies under
 * assets/images/ would ship unused — skip them (the .jpg <img> fallback IS
 * vite-ignored and must stay).
 */
function skipVerbatim(src) {
  return !/[\\/]flames-stage-\d+\.webp$/.test(src);
}

function copyStaticPlugin() {
  return {
    name: 'flip:copy-static',
    apply: 'build',
    closeBundle() {
      const out = resolve(ROOT, 'dist');
      mkdirSync(out, { recursive: true });
      for (const entry of STATIC_ENTRIES) {
        const src = resolve(ROOT, entry);
        if (existsSync(src)) {
          cpSync(src, resolve(out, entry), { recursive: true, filter: skipVerbatim });
        }
      }
      // GitHub Pages: skip Jekyll processing entirely.
      writeFileSync(resolve(out, '.nojekyll'), '');
    },
  };
}

export default defineConfig({
  // Relative base → works on GitHub Pages under any repo name and on custom domains.
  base: './',
  publicDir: false,
  plugins: [copyStaticPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'bundle',
    rollupOptions: {
      input: {
        main: resolve(ROOT, 'index.html'),
        // Internal brand-system preview (temporary dev route, noindex).
        brand: resolve(ROOT, 'brand.html'),
      },
    },
    sourcemap: false,
    target: 'es2020',
    cssMinify: true,
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  preview: {
    port: 4175,
    strictPort: true,
  },
});
