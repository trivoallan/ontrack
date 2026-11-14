# Design

## Context

See proposal.md for the motivation. The facts that shape the design were observed in the repository and in a throwaway prototype (Astro 7.4.12, Starlight 0.43.1, astro-mermaid 2.2.0), built over a copy of `docs/`:

- `docs/` holds 15 ADRs under `docs/adr/trivoallan/` and a logo. `ontrack apply` imports the ADRs from their source, and `ontrack plan` compares them to it, so the site must publish them without editing them.
- Every ADR already has a `title:`. Every ADR also has a `slug:` (`slug: documentation`). Astro's `glob` loader uses `slug:` as the page id, so with the configuration quoted in ADR-0008 the pages were built at `/documentation/`, `/commits/`… in one flat list, not under `adr/trivoallan/`.
- ADRs link to each other with relative `.md` links (52 links). Astro does not rewrite them: on the built page they stayed `href="ADR-0001-record-architecture-decisions.md"`, which is a 404.
- Every ADR body opens with `# <title>`. Starlight also renders the frontmatter title, so each page showed two level-one headings.
- Astro 7 processes Markdown with Sätteri by default. `markdown.remarkPlugins` only works once `@astrojs/markdown-remark` is installed.
- Astro 7.4 declares Node 22.23.4 or later. The CLI declares Node 20.19 or later, and CI runs its tests on 20.19.
- The root `src/` is the CLI source and ships in the npm package (`"files": ["bin/", "src/"]`). Astro expects `src/content.config.ts`.
- `docs/` has no `index.md`: the prototype built no home page.

## Goals / Non-Goals

**Goals:**

- A site that builds from `docs/` as it is, with the ADRs untouched.
- A build that fails on a broken internal link, in CI.
- Nothing added to the root package or to what it ships.

**Non-Goals:**

- Theming, custom components or a custom domain.
- An "Edit this page" link, a sitemap tuned for search engines, analytics.
- Embedding LikeC4 views (ADR-0010 is a separate ruling to follow).

## Decisions

### The site is a separate package in `site/`

`site/` holds `package.json` (private), `package-lock.json`, `astro.config.mjs` and `src/content.config.ts`.

*Why not the root package:* `src/content.config.ts` would ship to every consumer of `ontrack`, and the Node 20.19 job would install packages that declare Node 22.23.4. ADR-0008 already names the site "a second Node.js project".

### `site/src/content/docs` is a symbolic link to `docs/`

The loader reads `base: './src/content/docs'`, and that path is a committed symbolic link to `../../../docs`. The pages are still read in place.

*Why not `base: '../docs'`, as ADR-0008 quotes:* found while implementing. Starlight 0.43.1 builds its sidebar tree by stripping `src/content/docs/` from each file path (its `utils/collection.js` says the folder structure is still "fixed for now"). With `../docs` the sidebar showed the groups `..` › `docs` › `adr` instead of `adr` › `trivoallan`. With the link, Starlight sees the folder it expects. *Trade-off:* a checkout on Windows needs symbolic links enabled to build the site; CI and macOS do not.

### Page ids come from the file path, not from `slug:`

The `glob` loader gets a `generateId` that returns the path without its extension, in lower case:

```ts
generateId: ({ entry }) => entry.replace(/\.mdx?$/, '').toLowerCase()
```

This serves ADR-0008 at `adr/trivoallan/adr-0008-documentation/`.

*Why not remove `slug:` from the ADRs:* they are imported copies, and the key belongs to their source.

### One small remark plugin, inline in `astro.config.mjs`

It does two things to each page, about fifteen lines in all:

- **Links.** A relative link whose path ends in `.md` (with an optional fragment) is rewritten to the target's page: lower case, no extension, a trailing slash, and one `../` more because a page is served as a directory. A page that is an `index.md` gets `./` instead. Relative output works under any base path.
- **Title.** When the first heading of the body is level one, it is removed.

It needs `@astrojs/markdown-remark` (already a peer dependency of Starlight).

*Why not a published plugin for links:* the rule is three lines for this layout, and a dependency would have to be checked against Astro 7's loader ids. *Why not hide the frontmatter title instead:* Starlight builds the page header and the table of contents from it.

### Internal links are checked by a script, after the build

`site/check-links.mjs` walks `dist/`, reads every `href` and `src` that is relative or starts with the base path, and fails when the target is neither a file nor a directory with an `index.html`. `npm run build` is `astro build && node check-links.mjs`, so CI and a local build run the same check.

*Why not `starlight-links-validator`:* tried in the prototype. It ignores relative links unless told to reject them, and it rejected every rewritten absolute link to an ADR (52 of 52), most likely because it derives page URLs from `slug:`. A check on the built files does not depend on how ids are derived.

### The logo is also the favicon

Starlight links a `favicon.svg` that does not exist unless the project provides one; the link check caught it. `publicDir` points at `docs/assets`, and `favicon` is `/logo.png`, so no image is copied into `site/`. Every file in `docs/assets` is therefore served at the root of the site.

### Mermaid through `astro-mermaid`

As ADR-0008 says. The integration is listed before Starlight. In the prototype a `mermaid` block was emitted as a client-rendered element.

### One workflow, `.github/workflows/docs.yml`

- `build` job, on pull requests and pushes to `main`: checkout, Node from `.nvmrc`, `npm ci` and `npm run build` in `site/`, then, on a push only, `actions/upload-pages-artifact` on `site/dist`.
- `deploy` job, only on a push to `main`: `actions/deploy-pages`, with `pages: write` and `id-token: write`, in the `github-pages` environment.

`astro.config.mjs` sets `site: 'https://trivoallan.github.io'` and `base: '/ontrack'`.

*Why not a job in `test.yml`:* deployment needs permissions the test workflow should not hold.

### A minimal `docs/index.md`

A `title:`, two or three sentences saying what ontrack is, and links to the decision records and to the repository. It links to at least one ADR with a relative `.md` link, so the link rule is exercised from an index page on every build.

## Risks / Trade-offs

- [GitHub Pages is not enabled] → the `deploy` job fails on the first push to `main`. Enabling Pages with "GitHub Actions" as the source is a task, done by the repository owner before merging.
- [The remark plugin rewrites a link it should not] → it only matches relative paths ending in `.md`; the link check fails the build if a rewritten link leads nowhere.
- [A page lists itself in lower case while its file is not] → URLs are lower case by rule, stated in the spec; the link rule applies the same transformation.
- [Astro and Starlight move fast] → the lockfile pins what was built; the build check catches a breaking upgrade.
- [Removing the first `#` heading hides a heading that differs from the title] → accepted: every page under `docs/` today repeats its title there.
- [A second lockfile to keep up to date] → accepted in ADR-0008's consequences.

## Migration Plan

Nothing to migrate: the site is new. To roll back, delete `site/`, `docs/index.md` and the workflow, and disable Pages.
