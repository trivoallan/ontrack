import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { LikeC4VitePlugin } from 'likec4/vite-plugin';
import { readAdrs } from '../src/instructions.ts';
import { statusTone } from './src/adr-status.mjs';

export const base = '/ontrack';

const repository = new URL('..', import.meta.url).pathname;

const escape = (text) => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

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
    // The reference is what `ontrack review` takes. The search does not split
    // it at the slash, so the number is also there on its own, for the search
    // and for screen readers, and weighted. The weight alone does not put
    // this page first: a page that cites `ADR-0011` a dozen times outranks
    // it. The number is in the title of the search result too, which does,
    // and which tells this page from the pages that cite it.
    value:
      `<p><span class="adr-status ${statusTone(adr.status)}">${adr.status}</span> ` +
      `<span class="sr-only" data-pagefind-weight="10" data-pagefind-meta="title[data-title]" ` +
      `data-title="${escape(`${adr.id} ${adr.title ?? ''}`.trim())}">${adr.id}</span> <code>${adr.ref}</code></p>`,
  }];
  if (adr.traits) ruling.push({ type: 'code', lang: 'yaml', meta: 'title="Decided traits"', value: adr.traits.join('\n') });
  tree.children.unshift(...ruling);
};

export default defineConfig({
  site: 'https://trivoallan.github.io',
  base,
  // Pages renamed when a source became a track: links published before still arrive.
  redirects: {
    '/find-a-source': `${base}/find-a-track/`,
    '/write-your-own-source': `${base}/write-your-own-track/`,
  },
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
      // stay one click away, collapsed at the end of the reference.
      // Grouped by what the reader came to do, and the guides by who they
      // are: a repository that installs a track, or the author of one. The
      // model is read right after the tutorial, before either set of guides.
      sidebar: [
        { label: 'Start here', items: ['tutorial', 'how-it-works'] },
        { label: 'Use a track', items: ['find-a-track', 'run-ontrack-in-ci', 'draft-a-change-from-an-issue'] },
        { label: 'Maintain a track', items: ['write-your-own-track', 'revise-a-question'] },
        {
          label: 'Reference',
          items: [
            'commands',
            'file-formats',
            // The glossary is section 12 of the arc42 document, listed here
            // because users need its terms too. Its frontmatter hides it from
            // the Architecture group, so it has one entry.
            'architecture/arc42/12-glossary',
            // This repository's own decisions and architecture: how ontrack
            // is made, after what a reader looks up to use it. One subgroup
            // per namespace: `local`, the repository's own ADRs, then each
            // imported track.
            { label: 'Decisions', collapsed: true, items: [{ autogenerate: { directory: 'adr', collapsed: true } }] },
            { label: 'Architecture', collapsed: true, items: [{ autogenerate: { directory: 'architecture/arc42' } }] },
          ],
        },
      ],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/trivoallan/ontrack' }],
      // The edit link and the date of each page: Starlight looks for both
      // under site/, where the pages are a symbolic link.
      routeMiddleware: './src/route-data.ts',
    }),
  ],
});
