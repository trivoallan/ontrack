import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { docsSchema } from '@astrojs/starlight/schema';
import { statusBadge } from './adr-status.mjs';

export const collections = {
  docs: defineCollection({
    loader: glob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/docs',
      // The id is the file path: the default takes the `slug:` key of an
      // ADR's frontmatter, which would serve every ADR at the site root.
      generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').toLowerCase(),
    }),
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
