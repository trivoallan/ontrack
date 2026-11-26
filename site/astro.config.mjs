import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import starlight from '@astrojs/starlight';
import mermaid from 'astro-mermaid';
import { LikeC4VitePlugin } from 'likec4/vite-plugin';
import { readAdrs } from '../src/instructions.ts';
import { statusTone } from './src/adr-status.mjs';
import { tracks, trackOf } from './src/track.mjs';

// docs.yml builds `main` under next/ once a release exists (ADR-0008).
export const base = process.env.SITE_BASE ?? '/ontrack';

const repository = new URL('..', import.meta.url).pathname;

// Each track has three pages under docs/, written by hand: without one, its
// entry in the sidebar would lead nowhere.
for (const track of tracks) {
  for (const page of [track.name, `${track.name}/use-it`, `${track.name}/conventions`]) {
    if (!['md', 'mdx'].some((ext) => existsSync(new URL(`../docs/${page}.${ext}`, import.meta.url)))) {
      throw new Error(`track ${track.name} has no page docs/${page}.mdx`);
    }
  }
}

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
  // A status written as code, `accepted`, is shown as the badge the ADR pages
  // and the sidebar use, in its colour. On GitHub it stays code.
  walk(tree, (node) => {
    if (node.type === 'inlineCode' && ['proposed', 'accepted', 'rejected'].includes(node.value)) {
      Object.assign(node, { type: 'html', value: `<span class="adr-status ${statusTone(node.value)}">${node.value}</span>` });
    }
  });
  // GitHub's alerts (`> [!NOTE]`) become Starlight's asides: one syntax that
  // renders on both. Starlight's own directive step runs after this one.
  walk(tree, (node) => {
    node.children?.forEach((child, index) => {
      const first = child.type === 'blockquote' && child.children[0]?.type === 'paragraph' ? child.children[0] : null;
      const kind = first?.children[0]?.type === 'text' && first.children[0].value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/);
      if (!kind) return;
      first.children[0].value = first.children[0].value.slice(kind[0].length);
      if (!first.children[0].value) first.children.shift();
      if (first.children[0]?.type === 'break') first.children.shift();
      if (!first.children.length) child.children.shift();
      const name = { NOTE: 'note', TIP: 'tip', IMPORTANT: 'note', WARNING: 'caution', CAUTION: 'danger' }[kind[1]];
      node.children[index] = { type: 'containerDirective', name, attributes: {}, children: child.children };
    });
  });
  // Starlight renders the frontmatter title: drop the heading that repeats it.
  const first = tree.children.findIndex((node) => node.type === 'heading');
  if (first >= 0 && tree.children[first].depth === 1) tree.children.splice(first, 1);
  // Starlight does not show the frontmatter, which is where an ADR holds its
  // ruling: open the page with it. The CLI reads it, so that the site and
  // AGENTS.md cannot disagree.
  // A convention of the catalogue opens as a repository receives it, and with
  // none of this repository's rulings: its status, its blank traits, and a
  // link to how ontrack ruled on it.
  const track = trackOf(file.path);
  if (track) {
    const name = file.path.split('/').pop();
    const source = readFileSync(file.path, 'utf8');
    const status = source.match(/^status:\s*(\S+)/m)?.[1] ?? 'proposed';
    const ruled = existsSync(new URL(`../docs/adr/${track.alias}/${name}`, import.meta.url));
    const block = [{
      type: 'html',
      value:
        `<p><span class="adr-status ${statusTone(status)}">${status}</span> ` +
        (/^check:\s*\S/m.test(source) ? '<span class="adr-status tip">checked</span> ' : '') +
        `A convention of ${track.name} ${track.version}.` +
        (ruled ? ` <a href="../../adr/${track.alias}/${name.replace(/\.md$/, '').toLowerCase()}/">How ontrack ruled on it</a>.` : '') +
        '</p>',
    }];
    const traits = source.match(/^traits:\n(?:[ \t].*\n?)*/m)?.[0];
    if (traits) block.push({ type: 'code', lang: 'yaml', meta: 'title="Traits to rule on"', value: traits.trimEnd() });
    tree.children.unshift(...block);
    return;
  }
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
    // Pages renamed when a question became a convention.
    '/revise-a-question': `${base}/revise-a-convention/`,
    '/ontrack-engineering/questions': `${base}/ontrack-engineering/conventions/`,
    // The rulings on the track, once under the alias trivoallan.
    ...Object.fromEntries(
      readdirSync(new URL('../docs/adr/engineering/', import.meta.url))
        .filter((file) => file.endsWith('.md'))
        .map((file) => file.replace(/\.md$/, '').toLowerCase())
        .map((name) => [`/adr/trivoallan/${name}`, `${base}/adr/engineering/${name}/`]),
    ),
  },
  // The logo is the favicon too: serve docs/assets as static files.
  publicDir: '../docs/assets',
  markdown: { remarkPlugins: [pages] },
  // The architecture model (ADR-0010): its views are components the arc42
  // pages embed, laid out at build time. An invalid model fails the build.
  vite: {
    plugins: [LikeC4VitePlugin({ workspace: '../docs/architecture/model', throwIfInvalid: true })],
    // The pages are under docs/, outside site/: an MDX page imports
    // Starlight's components from site/node_modules, which npm does not reach
    // from there.
    resolve: {
      alias: [{ find: /^@astrojs\/starlight\/components$/, replacement: new URL('./node_modules/@astrojs/starlight/dist/components.ts', import.meta.url).pathname }],
    },
  },
  integrations: [
    mermaid(),
    // LikeC4 views are React components, rendered in the browser.
    react(),
    starlight({
      title: 'ontrack',
      logo: { src: '../docs/assets/logo.png' },
      favicon: '/logo.png',
      customCss: ['./src/theme.css', './src/adr.css'],
      // Search ranks the guides and the reference before the ADRs and the
      // architecture document: see src/search.mjs. A long page is not a worse
      // answer: the commands reference is the longest, and the one most
      // searches are for. And a word that only starts like the one searched
      // counts for less: "track" is not "tracking", the subject of an ADR.
      pagefind: { ranking: { pageLength: 0.1, termSimilarity: 5 } },
      components: {
        PageTitle: './src/components/PageTitle.astro',
        SiteTitle: './src/components/SiteTitle.astro',
        MarkdownContent: './src/components/MarkdownContent.astro',
      },
      // The 404 page is site/src/pages/404.astro.
      disable404Route: true,
      // The prompts `review` prints are single lines of a thousand characters,
      // documented as they are in the commands reference: wrap code blocks
      // rather than scroll them sideways.
      expressiveCode: { defaultProps: { wrap: true } },
      // Labels a reader understands, not directory names. What ontrack is
      // for comes first; this repository's own decisions and architecture
      // stay one click away, collapsed at the end of the reference.
      // Grouped by what the reader came to do, and the guides by who they
      // are: a repository that installs a track, or the author of one. The
      // notions, then the model, are read right after the tutorial, before
      // either set of guides. Automate is what a repository runs on GitHub
      // Actions, with or without a track.
      sidebar: [
        // Why, then what ontrack does, come before the tutorial: they are read
        // to decide whether to follow it.
        { label: 'Start here', items: ['why-ontrack', 'features', 'tutorial', 'concepts', 'how-it-works'] },
        // The tracks this repository depends on, next to the tutorial that
        // installs one: for each, what it is, how to use it, and its
        // conventions as the installed release asks them.
        {
          label: 'Tracks catalogue',
          items: tracks.map((track) => ({
            label: track.name,
            items: [
              { slug: track.name, label: 'Overview' },
              { slug: `${track.name}/use-it`, label: 'Use it' },
              // One page lists the conventions; the sidebar does not. The
              // sidebar is narrow: the label says less than the page heading.
              { slug: `${track.name}/conventions`, label: `Conventions (${track.version})` },
            ],
          })),
        },
        // The decisions a repository took without a track, recorded once.
        { label: 'Your repository', items: ['record-the-decisions-you-never-wrote-down'] },
        // Any other track: find one, or write and revise your own.
        { label: 'Tracks', items: ['find-a-track', 'write-your-own-track', 'revise-a-convention'] },
        { label: 'GitHub Actions', items: ['run-ontrack-in-ci', 'draft-a-change-from-an-issue', 'why-you-call-ontracks-workflows'] },
        {
          label: 'Reference',
          items: [
            'commands',
            'file-formats',
            'propose-and-apply-workflows',
            // What each version changed is on the forge, written by the release.
            { label: 'Release notes', link: 'https://github.com/trivoallan/ontrack/releases' },
            // Upgrading ontrack itself, next to what each version changed.
            'upgrade-ontrack',
            // The glossary is section 12 of the arc42 document, listed here
            // because users need its terms too. Its frontmatter hides it from
            // the Architecture group, so it has one entry.
            'architecture/arc42/12-glossary',
            'error-messages',
            // This repository's own decisions and architecture: how ontrack
            // is made, after what a reader looks up to use it. The decisions
            // are also an example of a repository ruling on a track. One
            // subgroup per namespace: `local`, the repository's own ADRs,
            // then each imported track.
            { label: 'Example: how ontrack ruled', collapsed: true, items: [{ autogenerate: { directory: 'adr', collapsed: true } }] },
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
