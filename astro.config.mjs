import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yanvic.github.io',
  base: '/My-Portfolio',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // a raiz só redireciona para /pt ou /en
    sitemap({ filter: (page) => !page.endsWith('/My-Portfolio/') }),
  ],
});
