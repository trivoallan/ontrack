import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsSchema } from '@astrojs/starlight/schema';
import { statusBadge } from './adr-status.mjs';

// The catalogue's directory in the site, as astro.config.mjs names it.
const CATALOGUE = 'ontrack-engineering';

// Two globs feed one collection: Starlight renders one. A glob deletes the
// entries it did not find, so each sees only its own ids in the store.
const both = (pages: Loader, catalogue: Loader): Loader => ({
  name: 'docs-and-catalogue',
  load: async (context) => {
    const view = (own: (id: string) => boolean) =>
      new Proxy(context.store, {
        get: (store, key) => {
          if (key === 'keys') return () => store.keys().filter(own);
          const value = Reflect.get(store, key);
          return typeof value === 'function' ? value.bind(store) : value;
        },
      });
    // The catalogue's ids are those of its files, all ADRs: a page of docs/ may
    // sit in the same directory.
    const inCatalogue = (id: string) => id.startsWith(`${CATALOGUE}/adr-`);
    await pages.load({ ...context, store: view((id) => !inCatalogue(id)) });
    await catalogue.load({ ...context, store: view(inCatalogue) });
  },
});

export const collections = {
  docs: defineCollection({
    loader: both(
      glob({
        pattern: '**/*.{md,mdx}',
        base: './src/content/docs',
        // The id is the file path: the default takes the `slug:` key of an
        // ADR's frontmatter, which would serve every ADR at the site root.
        generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').toLowerCase(),
      }),
      // The catalogue: the blank conventions of the reference track, read where
      // npm installed the release this repository depends on.
      glob({
        pattern: '*.md',
        base: '../node_modules/engineering/adr',
        generateId: ({ entry }) => `${CATALOGUE}/${entry.replace(/\.md$/, '').toLowerCase()}`,
      }),
    ),
    // A page that declares a `status:`, as every ADR does, gets it as a
    // sidebar badge, and one that declares an `adr:` identifier gets it
    // before its title in the sidebar, so that a reader holding a number
    // finds the page. The ADRs are imported copies and cannot ask for it.
    schema: (context) =>
      docsSchema({ extend: z.object({ status: z.string().optional(), adr: z.string().optional() }) })(context).transform(
        (page) => ({
          ...page,
          sidebar: {
            ...page.sidebar,
            label: page.sidebar.label ?? (page.adr ? `${page.adr} ${page.title}` : undefined),
            badge: page.sidebar.badge ?? (page.status ? statusBadge(page.status) : undefined),
          },
        }),
      ),
  }),
};
