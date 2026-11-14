# Tasks

## 1. Site package

- [x] 1.1 Create `site/package.json` (private, `"type": "module"`, scripts `dev`, `build`, `preview`) and install `astro`, `@astrojs/starlight`, `@astrojs/markdown-remark`, `astro-mermaid` and `mermaid`; verify `npm ci` succeeds in `site/` and that the root `package.json` and `package-lock.json` are unchanged (`git status`)
- [x] 1.2 Add `site/dist/` and `site/.astro/` to `.gitignore`; verify `git status` shows neither after a build
- [x] 1.3 Create `site/src/content.config.ts` with the `glob` loader on `src/content/docs`, a symbolic link to `docs/`, and a `generateId` based on the file path; verify the build serves ADR-0008 at `dist/adr/trivoallan/adr-0008-documentation/index.html` and that `dist/documentation/` does not exist
- [x] 1.4 Create `site/astro.config.mjs` with `site`, `base: '/ontrack'`, `astro-mermaid` and Starlight (title `ontrack`, logo `docs/assets/logo.png`, a link to the GitHub repository); verify `npx astro build` completes and the sidebar of a built page lists the ADRs under `adr/trivoallan`

## 2. Pages

- [x] 2.1 Add `docs/index.md` with a `title:`, a short introduction and a relative `.md` link to at least one ADR; verify `dist/index.html` exists after a build
- [x] 2.2 Add the remark plugin to `astro.config.mjs`: rewrite relative `.md` links and remove a leading level-one heading; verify on the built ADR-0008 page that the link to ADR-0001 is `../adr-0001-record-architecture-decisions/` and that the page holds exactly one `<h1>`
- [x] 2.3 Verify a `mermaid` code block renders: add one temporarily to `docs/index.md`, open the page with `npm run preview`, see the diagram, then remove the block

## 3. Link check

- [x] 3.1 Write `site/check-links.mjs` and chain it in the `build` script (`astro build && node check-links.mjs`); verify `npm run build` exits with `0`
- [x] 3.2 Verify the check fails: add a link to `ADR-9999-missing.md` in `docs/index.md`, confirm `npm run build` exits non-zero and names the page and the link, then remove the link

## 4. Continuous integration and publication

- [ ] 4.1 Add `.github/workflows/docs.yml` with the `build` job (pull requests and pushes to `main`) and the `deploy` job (pushes to `main` only); verify the `build` job passes on the pull request and that no deployment ran
- [ ] 4.2 Ask the repository owner to enable GitHub Pages with "GitHub Actions" as the source; verify in the repository settings before merging
- [ ] 4.3 After the merge, verify `https://trivoallan.github.io/ontrack/` serves the home page and that a link between two ADRs works there

## 5. Isolation and documentation

- [x] 5.1 Verify the CLI is untouched: `npm test` passes at the root, and `npm pack --dry-run` lists no file under `site/`
- [x] 5.2 Add the site commands (`npm ci`, `npm run dev`, `npm run build` in `site/`, Node 24) to the "Development" section of `README.md`; verify the commands run as written
- [x] 5.3 Verify `git status` reports no change under `docs/adr/` and that `npx ontrack plan` gives the same output as before the change
