import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { readAdrs } from '../src/instructions.mjs';
import { statusBadge } from './src/adr-status.mjs';

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
    if (node.type !== 'link' || !/^[^:#/][^:#]*\.md(#.*)?$/.test(node.url)) return;
    const [path, fragment = ''] = node.url.toLowerCase().split(/(?=#)/);
    node.url = up + path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '/') + fragment;
  });
  // Starlight renders the frontmatter title: drop the heading that repeats it.
  const first = tree.children.findIndex((node) => node.type === 'heading');
  if (first >= 0 && tree.children[first].depth === 1) tree.children.splice(first, 1);
  // Starlight does not show the frontmatter, which is where an ADR holds its
  // ruling: open the page with it. The CLI reads it, so that the site and
  // AGENTS.md cannot disagree.
  const adr = readAdrs(repository).find((a) => file.path.endsWith(a.path.replace(/^docs/, '')));
  if (!adr) return;
  const badge = statusBadge(adr.status);
  const ruling = [{
    type: 'html',
    value: `<p><span class="adr-status ${badge.class ?? badge.variant}">${badge.text}</span></p>`,
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
  integrations: [
    mermaid(),
    starlight({
      title: 'ontrack',
      logo: { src: '../docs/assets/logo.png' },
      favicon: '/logo.png',
      customCss: ['./src/adr.css'],
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/trivoallan/ontrack' }],
    }),
  ],
});
