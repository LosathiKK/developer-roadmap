// https://astro.build/config
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import compress from '@otterlord/astro-compress';
import { defineConfig } from 'astro/config';
import rehypeExternalLinks from 'rehype-external-links';
import { fileURLToPath } from 'node:url';
import { serializeSitemap, shouldIndexPage } from './sitemap.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://roadmap.sh/',
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: '_blank',
          rel: function (element) {
            const href = element.properties.href;
            const whiteListedStarts = [
              '/',
              '#',
              'mailto:',
              'https://github.com/kamranahmedse',
              'https://thenewstack.io',
              'https://cs.fyi',
              'https://roadmap.sh',
            ];

            if (whiteListedStarts.some((start) => href.startsWith(start))) {
              return [];
            }

            return 'noopener noreferrer nofollow';
          },
        },
      ],
    ],
  },
  build: {
    format: 'file',
  },
  integrations: [
    {
      name: 'client-authenticated',
      hooks: {
        'astro:config:setup'(options) {
          options.addClientDirective({
            name: 'authenticated',
            entrypoint: fileURLToPath(
              new URL(
                './src/directives/client-authenticated.mjs',
                import.meta.url
              )
            ),
          });
        },
      },
    },
    tailwind({
      config: {
        applyBaseStyles: false,
      },
    }),
    sitemap({
      filter: shouldIndexPage,
      serialize: serializeSitemap,
    }),
    compress({
      css: false,
      js: false,
    }),
    preact(),
  ],
});
