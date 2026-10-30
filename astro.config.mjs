import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://evenbutterbakeshop.com',
  integrations: [sitemap()],
  // CSS is ~14KB; inlining removes the render-blocking request on first paint.
  build: { inlineStylesheets: 'always' },
});
