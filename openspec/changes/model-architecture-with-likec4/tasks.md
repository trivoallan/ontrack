# Tasks

## 1. Prerequisites

- [ ] 1.1 Verify `site/` builds (`npm ci && npm run build` in `site/`) and `docs/architecture/arc42/` holds its twelve files; if either is missing, stop and report which change has to land first

## 2. Model

- [ ] 2.1 Add `likec4` to `site/package.json` dev dependencies; verify `npx likec4 --version` runs from `site/`
- [ ] 2.2 Write `docs/architecture/model/specification.c4` (element and deployment node kinds) and `model.c4` (actors, `ontrack` with one module per file of `src/`, externals, relationships); verify `npx likec4 validate ../docs/architecture/model` exits `0`, and that every `import` edge printed by `grep -n "^import" src/*.mjs src/commands/*.mjs | grep -v node:` (or the `.ts` equivalents) has a relationship in the model
- [ ] 2.3 Write `views.c4` with the deployment model and the three views `context`, `building-blocks`, `deployment`; verify all three open in `npx likec4 serve ../docs/architecture/model` and show no element without a relationship

## 3. Embed in the document

- [ ] 3.1 Add the LikeC4 Vite plugin to `site/astro.config.mjs`, pointed at `../docs/architecture/model`; verify `npm run build` in `site/` still completes
- [ ] 3.2 `git mv` sections `03-context-and-scope`, `05-building-block-view` and `07-deployment-view` from `.md` to `.mdx`, replace each one's "diagram comes from the model" line with its view component and a link to the model directory; verify in `npm run preview` that each page shows its view, and that links from other pages to these three sections still resolve
- [ ] 3.3 Verify no Mermaid block under `docs/architecture/arc42/` draws modules or neighbours that the model holds (`grep -n 'mermaid' -A3` shows only sequence or state diagrams)

## 4. CI and record

- [ ] 4.1 Add a `likec4 validate` step before the build in the `docs` job; verify the check passes on the pull request, and fails on a temporary commit that references an undefined element (then drop that commit)
- [ ] 4.2 Add one sentence to the body of `docs/adr/trivoallan/ADR-0010-architecture-documentation.md` recording that sections 3, 5 and 7 are `.mdx`; verify `ontrack plan` still reports the ADR as up to date
- [ ] 4.3 Add to the README's development section how to preview the model (`npx likec4 serve` from `site/`); verify the command works as written and that `git diff --stat -- package.json package-lock.json` at the root is empty
