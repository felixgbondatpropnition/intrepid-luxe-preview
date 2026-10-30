import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// SITE_URL and SITE_BASE let the same code build for the real domain or for a preview in a sub-folder.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://intrepidluxe.co.uk',
  base: process.env.SITE_BASE ?? '/',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
