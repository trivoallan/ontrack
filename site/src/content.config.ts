import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
  docs: defineCollection({
    loader: glob({
      pattern: '**/*.{md,mdx}',
      base: './src/content/docs',
      // The id is the file path: the default takes the `slug:` key of an
      // ADR's frontmatter, which would serve every ADR at the site root.
      generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').toLowerCase(),
    }),
    schema: docsSchema(),
  }),
};
