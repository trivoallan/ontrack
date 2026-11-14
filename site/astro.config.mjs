import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { LikeC4VitePlugin } from 'likec4/vite-plugin';
import { readAdrs } from '../src/instructions.ts';
import { statusTone } from './src/adr-status.mjs';

export const base = '/ontrack';

const repository = new URL('..', import.meta.url).pathname;

const walk = (node, visit) => {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
};

// Pages under docs/ are written to be read on GitHub too, and the ADRs are
// imported copies that must not be edited. So the two differences between a
// file on GitHub and a page of the site are fixed here, at build time.
const pages = () => (tree, file) => {
  // A page is served as a directory, so its neighbours are one level up,
  // except for an index page, which is served at its own directory.
  const up = /(^|\/)index\.mdx?$/.test(file.path) ? './' : '../';
  walk(tree, (node) => {
    if (node.type !== 'link' || !/^[^:#/][^:#]*\.mdx?(#.*)?$/.test(node.url)) return;
    const [path, fragment = ''] = node.url.toLowerCase().split(/(?=#)/);
    node.url = up + path.replace(/(^|\/)index\.mdx?$/, '$1').replace(/\.mdx?$/, '/') + fragment;
  });
  // Starlight renders the frontmatter title: drop the heading that repeats it.
  const first = tree.children.findIndex((node) => node.type === 'heading');
  if (first >= 0 && tree.children[first].depth === 1) tree.children.splice(first, 1);
  // Starlight does not show the frontmatter, which is where an ADR holds its
  // ruling: open the page with it. The CLI reads it, so that the site and
  // AGENTS.md cannot disagree.
  const adr = readAdrs(repository).find((a) => file.path.endsWith(a.path.replace(/^docs/, '')));
  if (!adr) return;
  const ruling = [{
    type: 'html',
    value: `<p><span class="adr-status ${statusTone(adr.status)}">${adr.status}</span></p>`,
  }];
  if (adr.traits) ruling.push({ type: 'code', lang: 'yaml', meta: 'title="Decided traits"', value: adr.traits.join('\n') });
  tree.children.unshift(...ruling);
};

export default defineConfig({
  site: 'https://trivoallan.github.io',
  base,
  // The logo is the favicon too: serve docs/assets as static files.
  publicDir: '../docs/assets',
  markdown: { remarkPlugins: [pages] },
  // The architecture model (ADR-0010): its views are components the arc42
  // pages embed, laid out at build time. An invalid model fails the build.
  vite: {
    plugins: [LikeC4VitePlugin({ workspace: '../docs/architecture/model', throwIfInvalid: true })],
  },
  integrations: [
    mermaid(),
    // LikeC4 views are React components, rendered in the browser.
    react(),
    starlight({
      title: 'ontrack',
      logo: { src: '../docs/assets/logo.png' },
      favicon: '/logo.png',
      customCss: ['./src/adr.css'],
      // The prompts `review` prints are single lines of a thousand characters,
      // documented as they are in the commands reference: wrap code blocks
      // rather than scroll them sideways.
      expressiveCode: { defaultProps: { wrap: true } },
      // Labels a reader understands, not directory names. What ontrack is
      // for comes first; this repository's own decisions and architecture
      // stay one click away, collapsed.
      sidebar: [
        { slug: 'tutorial' },
        { slug: 'how-it-works' },
        { slug: 'write-your-own-source' },
        { slug: 'revise-a-question' },
        { slug: 'run-ontrack-in-ci' },
        { slug: 'commands' },
        { slug: 'file-formats' },
        // ponytail: lists the one imported namespace; make it `adr` once the
        // repository has ADRs of its own or a second source.
        { label: 'ontrack on itself', collapsed: true, items: [{ autogenerate: { directory: 'adr/trivoallan' } }] },
        { label: 'For contributors', collapsed: true, items: [{ autogenerate: { directory: 'architecture/arc42' } }] },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/trivoallan/ontrack' }],
    }),
  ],
});
