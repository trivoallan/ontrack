# Run 6 desk test: group-1 scoring

The ADR traits are identical in all five clones (same md5). The clones also hold `AGENTS.md`, `docs/adr/` and a `package.json` change added by the harness. Those were ignored.

| repo | ADR | keys | all visible | unseen key(s) and where they live | agent said unseen | agent's evidence true | note |
|---|---|---|---|---|---|---|---|
| immerjs__immer | 0002 Localization | default, documentation, commits, code, comments | yes | | | yes | `website/docusaurus.config.js:14` `defaultLocale: "en"`, zh-CN is a locale only; `git log` subjects in English |
| immerjs__immer | 0003 Architecture | pattern | yes | | | yes | `src/core`, `src/plugins`. The agent hedged ("Likely `monolithic`") |
| immerjs__immer | 0004 Languages | main.name | yes | | | yes | `tsconfig.json`, `src/*.ts` |
| immerjs__immer | 0005 Validation | boundary, data_files | yes | | | yes | No schema library in `package.json`. The agent hedged between `rejected` and `boundary: none` |
| immerjs__immer | 0008 Documentation | tool, root, audience, channels | yes | | | yes | `website/docusaurus.config.js` (url `immerjs.github.io`), `website/docs/`, `.github/workflows/docs-public.yml` (push to `main` → gh-pages). The agent stated no `channels` value |
| immerjs__immer | 0010 Architecture docs | document, model, diagrams | yes | | | yes | There is no `docs/architecture/` (an absence) |
| immerjs__immer | 0012 Delivery | target, environments, release_tool, release_notes, registry, deployment.manifests | yes | | | yes | `release.yml` (push to `main`, `id-token: write`, `npm run release`), `package.json:42` `semantic-release --branches main` (default notes generator). The agent stated no value for `release_notes`, `registry` or `manifests` |
| immerjs__immer | 0013 Frontend | framework | yes | | | yes | Library only (`rejected`) |
| immerjs__immer | 0014 Work tracking | tool, project | yes | | | yes | `.github/ISSUE_TEMPLATE/`, `package.json:64` `bugs` |
| immerjs__immer | 0015 Secrets | storage, guard | **no** | `storage`: the repository does handle secrets (a Coveralls `repo_token` committed in `.coveralls.yml`), so `none` does not hold. Where secrets live while people work is on the maintainers' machines, outside the clone | no | yes | `guard: none` is visible (husky runs only `pretty-quick`, `package.json:46`; no gitleaks). `.env` is gitignored (`.gitignore:58`). The agent gave no value for `storage` |
| immerjs__immer | 0016 Changes | framework, schema | yes | | | yes | There is no `openspec/` |
| immerjs__immer | 0017 Agent tooling | hosts | yes | | | yes | No `.claude/`, `opencode.json` or copilot instructions |
| immerjs__immer | 0020 Adding deps | approver, install_scripts | **no** | `approver` (`person`/`agent`): a people policy, not written in the clone | yes ("Nothing says who approves a new dependency") | yes | `install_scripts: allowed` is visible (Yarn 1, no `.npmrc` or `.yarnrc`) |
| immerjs__immer | 0023 License | spdx | yes | | | yes | `LICENSE`, `package.json` `"license": "MIT"` |
| immerjs__immer | 0025 Tools | manager | yes | | | yes | No mise, aqua or `.tool-versions` |
| koajs__koa | 0002 Localization | (5 keys) | yes | | | yes | Code, docs and `git log` are in English |
| koajs__koa | 0003 Architecture | pattern | yes | | | yes | `lib/application.js`, `context.js`, `request.js`, `response.js` |
| koajs__koa | 0004 Languages | main.name | yes | | | yes | `lib/*.js`, `package.json` |
| koajs__koa | 0005 Validation | boundary, data_files | yes | | | yes | No schema library |
| koajs__koa | 0010 Architecture docs | document, model, diagrams | yes | | | yes | `docs/` holds guides only |
| koajs__koa | 0013 Frontend | framework | yes | | | yes | `rejected` |
| koajs__koa | 0014 Work tracking | tool, project | yes | | | yes (weak) | `package.json:27` `"repository": "koajs/koa"`. The only mention of issues in the Readme is line 173, a security note that says not to open an issue. There is no `ISSUE_TEMPLATE` |
| koajs__koa | 0015 Secrets | storage, guard | **no** | `storage`: CI reads `secrets.CODECOV_TOKEN` (`node.js.yml:30`), which is stored in GitHub, so the repository handles a secret and `none` does not hold. Where maintainers keep secrets locally is outside the clone | no | yes (no `.env`), but "no local secrets" is inferred | `guard: none` is visible (no gitleaks) |
| koajs__koa | 0016 Changes | framework, schema | yes | | | yes | There is no `openspec/` |
| koajs__koa | 0017 Agent tooling | hosts | yes | | | yes | No agent settings |
| koajs__koa | 0018 Dependencies | updater, automerge | yes | | | yes | `.github/dependabot.yml`; no automerge workflow |
| koajs__koa | 0023 License | spdx | yes | | | yes | `LICENSE`, `package.json:37` |
| koajs__koa | 0025 Tools | manager | yes | | | yes | No mise, aqua or script |
| pmndrs__zustand | 0002 Localization | (5 keys) | yes | | | yes | English everywhere |
| pmndrs__zustand | 0003 Architecture | pattern | yes | | | yes | `src/vanilla`, `src/react`, `src/middleware`. The agent named no value ("a value drawn from the `src/` layout") |
| pmndrs__zustand | 0004 Languages | main.name | yes | | | yes | `tsconfig.json`, `src/*.ts` |
| pmndrs__zustand | 0010 Architecture docs | document, model, diagrams | yes | | | yes | There is no `docs/architecture/` |
| pmndrs__zustand | 0013 Frontend | framework | yes | | | yes | `examples/` only |
| pmndrs__zustand | 0015 Secrets | storage, guard | yes | | | yes | No `secrets.*` in any workflow; `publish.yml:15` `id-token: write`; no `.env`; no gitleaks |
| pmndrs__zustand | 0016 Changes | framework, schema | yes | | | yes | There is no `openspec/` |
| pmndrs__zustand | 0018 Dependencies | updater, automerge | yes | | | yes | `.github/dependabot.yml`; no automerge workflow |
| pmndrs__zustand | 0019 Vulnerabilities | sbom, scanner, fail_on | **no** | `scanner` (and `fail_on`, which follows it): ADR-0019 allows `github` (Dependabot alerts), which is switched on in the GitHub repository settings. `none` cannot be read from the clone | no | yes (no scanner file, no SBOM step in `publish.yml`) | `sbom: none` is visible. The other four agents put 0019 in group 2 for this reason |
| pmndrs__zustand | 0023 License | spdx | yes | | | yes | `LICENSE`, `package.json` |
| pmndrs__zustand | 0025 Tools | manager | yes | | | yes | Nothing outside pnpm |
| remarkjs__remark | 0002 Localization | (5 keys) | yes | | | yes | English everywhere |
| remarkjs__remark | 0003 Architecture | pattern | yes | | | yes | `package.json:13` `workspaces`, `packages/` (4) |
| remarkjs__remark | 0004 Languages | main.name | yes | | | yes | `.js` files with JSDoc; `tsconfig.json:3` `checkJs: true` |
| remarkjs__remark | 0005 Validation | boundary, data_files | yes | | | yes | `packages/remark-cli/package.json:14` `unified-args` |
| remarkjs__remark | 0007 Tests | coverage_target | yes | | | yes | `package.json:37` `c8 --100` |
| remarkjs__remark | 0010 Architecture docs | document, model, diagrams | yes | | | yes | `doc/` holds three guides only |
| remarkjs__remark | 0013 Frontend | framework | yes | | | yes | Libraries plus a CLI |
| remarkjs__remark | 0014 Work tracking | tool, project | yes | | | yes | `package.json:7` `bugs` |
| remarkjs__remark | 0016 Changes | framework, schema | yes | | | yes | There is no `openspec/` |
| remarkjs__remark | 0018 Dependencies | updater, automerge | yes | | | yes | No `dependabot.yml` or `renovate.json`; no Dependabot or Renovate authors in `git log` |
| remarkjs__remark | 0021 Build provenance | build_level | yes | | | yes | Neither `bb.yml` nor `main.yml` publishes, so level `0` can be read from the clone. The agent itself put 0012 in group 2 (the publish happens on the maintainer's machine) |
| remarkjs__remark | 0023 License | spdx | yes | | | yes | `license`, `package.json:4` |
| remarkjs__remark | 0025 Tools | manager | yes | | | yes | No mise, aqua or script |
| vercel__swr | 0002 Localization | (5 keys) | yes | | | yes | English everywhere |
| vercel__swr | 0003 Architecture | pattern | yes | | | yes | `src/{index,infinite,mutation,…}`, `_internal` |
| vercel__swr | 0004 Languages | main.name | yes | | | yes | `tsconfig.json`; `package.json:155` `typescript` 7.0.2 |
| vercel__swr | 0005 Validation | boundary, data_files | yes | | | yes | `.oxlintrc.json:2`, `.oxfmtrc.json:2` `$schema` |
| vercel__swr | 0007 Tests | coverage_target | yes | | | yes | `jest.config.js` has no `coverageThreshold`, so `none` |
| vercel__swr | 0010 Architecture docs | document, model, diagrams | yes | | | yes | Absent |
| vercel__swr | 0013 Frontend | framework | yes | | | yes | Hooks library |
| vercel__swr | 0014 Work tracking | tool, project | yes | | | yes | `.github/CONTRIBUTING.md:11`, `.github/ISSUE_TEMPLATE/` |
| vercel__swr | 0015 Secrets | storage, guard | yes | | | yes | `.gitignore:5` `.env`; `.husky/pre-commit` runs lint-staged and types only; `trigger-release.yml` OIDC, no `secrets.*` |
| vercel__swr | 0016 Changes | framework, schema | yes | | | yes | Absent |
| vercel__swr | 0023 License | spdx | yes | | | yes | `LICENSE`, `package.json:97` |
| vercel__swr | 0025 Tools | manager | yes | | | yes | `scripts/` holds only `bump-next-version.js`, not a tool installer |
| vercel__swr | 0026 Agent identity | identity | **no** | `identity` (`maintainer`/`own`): the GitHub identity an agent commits under lives in GitHub accounts and credentials, outside the clone | no | yes (`.github/CODEOWNERS`: `@shuding @huozhi`) | The agent named no value. It argued from scope ("covers only one-person repositories"), an inference from people |

## Counts

| repo | group-1 rows | failing rows | failing, left unstated by the agent | rows with false evidence | group-2 rows | group-2 rows naming an unseen value and where it lives |
|---|---|---|---|---|---|---|
| immerjs__immer | 15 (the heading says 14) | 2 (0015, 0020) | 1 (0015) | 0 | 10 | 10 |
| koajs__koa | 13 | 1 (0015) | 1 | 0 | 12 | 12 |
| pmndrs__zustand | 11 | 1 (0019) | 1 | 0 | 14 | 14 (0005, 0007 and 0020 say "no file records it" rather than naming a place) |
| remarkjs__remark | 13 | 0 | 0 | 0 | 12 | 12 |
| vercel__swr | 13 | 1 (0026) | 1 | 0 | 12 | 12 |
| total | 65 | 5 | 4 | 0 | 60 | 60 |

The weak but not false evidence was in koa 0014: the Readme's only mention of issues is a security note.
