I'll start with the survey and write nothing. First I'll read every ADR and look at the repository.
---
I've read all 25 ADRs. Now I'm gathering repository evidence (files, CI, config, history) so I can build the survey.
---
Still surveying. I have most of the evidence, and I'm checking two last things (coverage thresholds and `openspec`/agent files) before I write it up.
---
I've read all 25 ADRs and looked at the repository. I wrote nothing. Every count comes from a command I ran, and I name the command.

The ADRs run `nub` rather than `pnpm`/`npm`, and `AGENTS.md` and `package.json` are already modified in your working tree, as the git status says.

## Group 1: every value is shown by this repository (5 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| ADR-0004 Languages | `languages.main.name` | `TypeScript` | `AGENTS.md` (`CLAUDE.md` is a symlink to it): "All tests must be written in TypeScript - never use JavaScript". `shows the value` |
| ADR-0007 Tests | `tests.coverage_target` | `none` | Grep for `thresholds\|coverage` in every `package.json`, `vitest*.ts`, `vitest*.mjs` and `test.yml` found no match, so no number is held. The coverage command in `AGENTS.md` sets no target. `shows the value` (by absence) |
| ADR-0014 Work tracking | `tracking.tool` | `github-issues` | `package.json`: `"bugs": {"url": "https://github.com/colinhacks/zod/issues"}`. `shows the value` |
| ADR-0014 Work tracking | `tracking.project` | `colinhacks/zod` | The same `bugs.url`. `shows the value` |
| ADR-0016 Changes | `changes.framework` | `none` | There is no `openspec/` directory at the root (`ls -a`) and no reference to it outside `docs/adr/` (Grep). `shows the value` (by absence) |
| ADR-0016 Changes | `changes.schema` | `none` | Same as above, since `none` goes with `framework: none`. `shows the value` (by absence) |
| ADR-0023 License | `license.spdx` | `MIT` | `"license": "MIT"` in `packages/zod/package.json:5`, and in five other packages. `LICENSE` opens with "MIT License". `shows the value` |

## Group 2: at least one value is not shown (20 ADRs)

Only the values I could not show are listed.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| ADR-0002 | `language.default` | a choice people make | `AGENTS.md` is written in English. `next to it` |
| ADR-0002 | `documentation`, `commits`, `code`, `comments` | a choice people make | none |
| ADR-0003 | `architecture.pattern` | a choice people make | `AGENTS.md` mentions `core/` and the `check:circular` script excludes `v4/core`. `next to it` |
| ADR-0005 | `validation.boundary` | a choice people make | `"zod": "workspace:*"` in `package.json:52`. This repo is the zod library itself. `next to it` |
| ADR-0005 | `validation.data_files` | a choice people make | The tracked data files are `FUNDING.yml`, `tea.yaml` and `pnpm-lock.yaml`. A `git ls-files` search found no schema file. `next to it` |
| ADR-0006 | `commits.scopes` | a choice people make | Of the last 300 subjects, 259 are in conventional format (`git log -n 300 --format=%s`). Top scopes by count: `fix(v4)` 65, `feat(v4)` 18, `perf(v4)` 10, `fix(locales)` 7, `fix(docs)` 7. `next to it` |
| ADR-0008 | `docs.tool` | a choice people make | `packages/docs` has `next.config.mjs` and `source.config.ts`, so it is not Starlight, Docusaurus or MkDocs. `next to it` |
| ADR-0008 | `docs.root` | a choice people make | The pages seem to live in `packages/docs/content`, while `docs/` holds only `adr/`. `next to it` |
| ADR-0008 | `docs.audience` | a choice people make | none |
| ADR-0008 | `docs.channels` | the Vercel deploy settings | `packages/docs/vercel.json` and `should-build-site.sh`. `next to it` |
| ADR-0009 | `branching.model` | the forge settings and contributor habit | `CONTRIBUTING.md:16-19` describes branch, push, then pull request. `next to it` |
| ADR-0009 | `branching.merge` | the GitHub repository settings | 202 of the last 300 subjects end in `(#NNNN)` (`git log -n 300 --format=%s`). The full history has 315 merge commits (`git rev-list --count --merges HEAD`). `next to it` |
| ADR-0009 | `branching.prefixes` | a choice people make | `CONTRIBUTING.md:16` uses the example branch name `your-feature-name`, with no prefix. `next to it` |
| ADR-0010 | `architecture.document`, `model`, `diagrams` | a choice people make | `docs/` holds only `adr/`. `wiki/` holds `compile.md` and `optionality.md`, and `rfcs/index.md` exists. `next to it` |
| ADR-0011 | `forge.gate` | a GitHub ruleset, outside the repo | `test.yml` runs on `pull_request` to `main` and `v4`. `next to it` |
| ADR-0011 | `forge.audit` | unknown | `release.yml:115` has an inline `# zizmor: ignore[adhoc-packages]`, but Grep finds no workflow that runs zizmor. `next to it` |
| ADR-0012 | `delivery.target` | `package` is the likely value | `release.yml` stages and publishes `packages/zod` and `packages/mini` to npm. `next to it` |
| ADR-0012 | `delivery.environments` | a choice people make | `release.yml` uses the environments `npm` (line 91) and `release-approval` (line 196), dispatch only. They do not map onto merge, tag or manual. `next to it` |
| ADR-0012 | `delivery.release_notes` | a choice people make | `release.yml` requires a `notes` input that becomes the GitHub release body. `next to it` |
| ADR-0013 | `frontend.framework` | a choice people make | `packages/docs` is a Next.js site, but it is a documentation site and the product has no UI. `next to it` |
| ADR-0015 | `secrets.storage` | the maintainers' machines | CI uses the GitHub secret `RELEASE_TAG_KEY`, which is not working storage. `next to it` |
| ADR-0017 | `agent.hosts` | a choice contributors make | `.cursorrules` and `CLAUDE.md` are symlinks to `AGENTS.md`. `.codex/skills` points to `.claude/skills`. `claude.yml`, `claude-code-review.yml` and `pullfrog.yml` exist. There is no `.claude/settings.json` and no `opencode.json`. `next to it` |
| ADR-0018 | `dependencies.updater` | possibly a GitHub setting (Dependabot security updates need no file) | There is no `.github/dependabot.yml` or Renovate config. `git log --all` on those paths is empty. `next to it` |
| ADR-0018 | `dependencies.automerge` | follows `updater` | same as above. `next to it` |
| ADR-0019 | `vulnerabilities.scanner` | GitHub settings (Dependabot alerts count as `github`) | No Grype or Trivy workflow. `next to it` |
| ADR-0019 | `vulnerabilities.fail_on` | follows `scanner` | none |
| ADR-0020 | `admission.approver` | a choice people make | none |
| ADR-0020 | `admission.install_scripts` | the package manager configuration | `.npmrc` sets no `ignore-scripts` and no `allowScripts`. Installs go through Nub. `next to it` |
| ADR-0021 | `supply_chain.build_level` | the npm registry and GitHub | `release.yml` passes `--provenance` (lines 143 and 149) and grants `id-token: write` (line 96). `next to it` |
| ADR-0022 | `review.by`, `review.approvals` | a GitHub ruleset, outside the repo | There is no `.claude/settings.json`, so there are no deny entries. `next to it` |
| ADR-0024 | `code_scanning.tool`, `fail_on` | GitHub code scanning default setup or the ruleset | None of the 8 files in `.github/workflows/` is a CodeQL workflow. The ADR says default setup is recorded in no file. `next to it` |
| ADR-0025 | `tools.manager` | depends on which other ADRs you accept | There is no `mise.toml` or `aqua.yaml` at the root. `.github/scripts/npm-stage-publish.sh` exists. `next to it` |
| ADR-0026 | `agent.identity` | GitHub and the maintainer's machine | `pullfrog[bot]` appears as a commit author. `next to it` |

I judged these values shown by absence or by the release workflow, so they have no row above:
- `commits.tool` is `none`: `.husky` has only `pre-commit` and `pre-push`, and there is no commitlint.
- `secrets.guard` is `none`: no gitleaks anywhere.
- `vulnerabilities.sbom` is `none`: no SBOM step in `release.yml`.
- `delivery.release_tool` is `manual`: `release.yml` is dispatch only and takes its versions from the `package.json` files.
- `delivery.registry` and `deployment.manifests` are `none`: there is no Dockerfile or manifests directory at the root.

## Proposed order

1. Group 1, in number order: ADR-0004, 0007, 0014, 0016, 0023.
2. Group 2, in number order: ADR-0002, 0003, 0005, 0006, 0008, 0009, 0010, 0011, 0012, 0013, 0015, 0017, 0018, 0019, 0020, 0021, 0022, 0024, 0025, 0026.

Number order already puts ADR-0011 before 0018, 0019 and 0022, ADR-0012 before 0021, and ADR-0017 before 0022. Note that ADR-0026 `own` would force ADR-0022 to `peer`, so you may want to decide those two together.

Do you agree with this order, or do you want another? I have no question tool in this session, so please answer in your reply. Once you agree, I'll start with ADR-0004 and propose its ruling before writing anything.
