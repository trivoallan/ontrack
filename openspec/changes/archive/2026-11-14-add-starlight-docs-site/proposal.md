# Proposal

## Why

[ADR-0008](../../../docs/adr/trivoallan/ADR-0008-documentation.md) rules `docs.tool: starlight`, but no site exists: the documentation is `README.md` and the ADRs, read on GitHub ([issue 34](https://github.com/trivoallan/ontrack/issues/34)). The ruling is not followed until a Starlight site builds from `docs/`.

## What Changes

- Add a Starlight site as a separate Node.js project in `site/`, with its own `package.json` and lockfile. It reads its pages from `docs/` through Astro's `glob` loader.
- Serve every Markdown page under `docs/` at a URL that mirrors its path, with navigation generated from the directory tree. The imported ADRs are published as they are: no ADR file is edited.
- Make links between pages work on the site: a relative link to another `.md` page, as the ADRs use, leads to that page.
- Render Mermaid diagrams in the browser with `astro-mermaid`.
- Add `docs/index.md`, a short landing page, so that the site has a home page.
- Add a CI workflow that builds the site and checks its internal links on every pull request, and deploys it to GitHub Pages on every push to `main`.
- Document the site commands in the "Development" section of `README.md`.

Not in this change:

- Moving the content of `README.md` into documentation pages, or writing new pages. The Diátaxis classification applies page by page, when each is written.
- The arc42 document and the LikeC4 model of ADR-0010.
- A custom domain, versioned documentation or translations.

## Capabilities

### New Capabilities

- `docs-site`: the documentation site built from `docs/`: which files become pages, their URLs, navigation, links between pages, diagrams, the build check and publication.

### Modified Capabilities

None. No `ontrack` command changes: `docs/index.md` sits outside `docs/adr/`, which is the only directory the commands read.

## Impact

- **New files**: `site/` (`package.json`, `package-lock.json`, `astro.config.mjs`, `src/content.config.ts`, a link check script), `docs/index.md`, `.github/workflows/docs.yml`.
- **Changed files**: `.gitignore` (build output of the site), `README.md` (site commands).
- **Dependencies**: `astro`, `@astrojs/starlight`, `@astrojs/markdown-remark`, `astro-mermaid` and `mermaid`, in `site/` only. The root package, its lockfile and what it ships (`bin/`, `src/`) do not change.
- **Node.js**: Astro 7 requires Node 22.23.4 or later. The site is built with the version in `.nvmrc` (24). The CLI keeps supporting Node 20.19.
- **Repository settings**: GitHub Pages must be enabled with "GitHub Actions" as its source. This is a manual step for the repository owner.
- **Audience**: the site is public (`docs.audience: public`). It publishes only what is already public in the repository.
