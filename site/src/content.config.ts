import { defineCollection } from 'astro:content';
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsSchema } from '@astrojs/starlight/schema';
import path from 'node:path';
import { statusBadge } from './adr-status.mjs';
import { tracks } from './track.mjs';

// A glob per track feeds one collection with the pages: Starlight renders
// one. A glob deletes the entries it did not find, so each sees only its own
// ids in the store.
const all = (pages: Loader, catalogues: { prefix: string; loader: Loader }[]): Loader => ({
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
    // A catalogue's ids are those of its files, all ADRs, under the track's
    // name: a page of docs/ may sit in the same directory.
    const owns = (prefix: string) => (id: string) => id.startsWith(`${prefix}/adr-`);
    await pages.load({ ...context, store: view((id) => !catalogues.some(({ prefix }) => owns(prefix)(id))) });
    for (const { prefix, loader } of catalogues) await loader.load({ ...context, store: view(owns(prefix)) });
  },
});

export const collections = {
  docs: defineCollection({
    loader: all(
      glob({
        pattern: '**/*.{md,mdx}',
        base: './src/content/docs',
        // The id is the file path: the default takes the `slug:` key of an
        // ADR's frontmatter, which would serve every ADR at the site root.
        generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').toLowerCase(),
      }),
      // The catalogues: the blank conventions of each track, read where npm
      // installed the release this repository depends on.
      tracks.map((track) => ({
        prefix: track.name,
        loader: glob({
          pattern: '*.md',
          base: path.relative(process.cwd(), track.adrDir),
          generateId: ({ entry }) => `${track.name}/${entry.replace(/\.md$/, '').toLowerCase()}`,
        }),
      })),
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
