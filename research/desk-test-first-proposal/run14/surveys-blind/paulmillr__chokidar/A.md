I'll start the survey by reading every ADR and checking the repository.
---
Still on the survey step, and I haven't written anything. I've read ADR-0002 to 0007. Next I'm reading ADR-0008 to 0026, then checking the repository against each trait.
---
All 25 ADRs are read. I'm now collecting evidence from the repository: workflows, config files, history and tags. Nothing has been written yet.
---
I've surveyed all 25 ADRs and written nothing. 8 of them can be answered from what this repository already shows. The other 17 depend on a forge setting, a choice, or something I could only infer.

## Group 1: every value is shown by the repository (8 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 Languages | `languages.main.name` | TypeScript | **shows the value**: `git ls-files '*.ts' \| wc -l` gives 10 TypeScript files, against 3 `.js`/`.mjs` (`example.js`, `benchmark/bench.mjs`, `scripts/test-vms.mjs`). `tsconfig.json` compiles `src`. |
| 0007 Tests | `tests.coverage_target` | none | **shows the value**: `package.json` scripts and `.github/workflows/test-js.yml` run no coverage tool. A search for `coverage`, `c8` and `nyc` across tracked files finds only `/coverage/` in `.gitignore`. |
| 0010 Architecture documentation | `architecture.document` | elsewhere (`docs/architecture.md`) | **shows the value**: a single architecture file exists, and `docs/architecture/arc42/` does not. |
| 0010 | `architecture.model` | none | **shows the value**: `git ls-files` finds no `.c4` or `.likec4` file. |
| 0010 | `architecture.diagrams` | none | **shows the value**: a search for `mermaid` and `plantuml` finds nothing. `docs/architecture.md` has one plain `text` block. |
| 0013 Frontend | `frontend.framework` | none, so `rejected` | **shows the value**: the only runtime dependency in `package.json` is `readdirp`. `git ls-files` lists 0 html, css, tsx, vue, svelte or astro files. |
| 0014 Work tracking | `tracking.tool` | github-issues | **shows the value**: `package.json` has `bugs.url: https://github.com/paulmillr/chokidar/issues`, and `.github/ISSUE_TEMPLATE/bug_report.md` exists. |
| 0014 | `tracking.project` | paulmillr/chokidar | **shows the value**: `package.json` `repository.url`, and `git remote -v`. |
| 0016 Changes | `changes.framework` | none | **shows the value**: there is no `openspec/` directory. |
| 0016 | `changes.schema` | none | **shows the value**: it follows from `framework: none`. |
| 0023 License | `license.spdx` | MIT | **shows the value**: `package.json` has `"license": "MIT"`, and `LICENSE` opens with "The MIT License (MIT)". |
| 0025 Tools | `tools.manager` | none | **shows the value**: there is no `mise.toml`, `aqua.yaml` or tool-install script. `scripts/test-vms.mjs` only drives CI. |

`origin` is `paulmillr/chokidar`, an upstream project. Any tracking item created later would land there, so I'll ask before creating any.

## Group 2: at least one value is held outside the repository or only inferred (17 ADRs)

I give one row per value I could not show. For values I could show, I leave out the row.

| ADR | Key | Where it lives | Citation |
|---|---|---|---|
| 0002 Localization | `language.default` | a convention | **next to it**: README, CHANGELOG, docs and the sampled commit messages are in English. |
| 0002 | `language.documentation`, `commits`, `code`, `comments` (four rows, all empty) | a convention | **next to it**: the same files and history, with no sign of a second language. |
| 0003 Architecture | `architecture.pattern` | a choice | **next to it**: `docs/architecture.md` describes a one-way module graph (`runtime -> {backend, tree} -> policy -> reconcile -> index`) and a `WatcherContext` port. It never names a pattern. |
| 0005 Validation | `validation.boundary` | a choice | **next to it**: no schema library is in `package.json`. The constructor checks options by hand (CHANGELOG 6.0.0). By-hand checking is the case the ADR calls non-compliant. |
| 0006 Commits | `commits.scopes` | a choice | **next to it**: in the last 300 commits, 84 follow the Conventional Commits format and only 2 carry a scope (`docs(README)`). |
| 0008 Documentation | `docs.root` | a choice | **next to it**: the user documentation is `README.md`. `docs/` holds only the architecture and VM-testing notes. |
| 0008 | `docs.audience` | forge visibility | **next to it**: `git remote -v` is github.com, and the README carries npm download badges. |
| 0009 Branching | `branching.model` | forge settings | **next to it**: remote branches such as `fix-ci` and `v6` suggest short-lived branches. |
| 0009 | `branching.merge` | forge settings | **next to it**: `git log --merges` shows 208 merge commits, so pull requests land as merge commits. |
| 0009 | `branching.prefixes` | a choice | **next to it**: remote branch names (`fix-ci`, `v6-fixes`, `permissions-workflows`) follow no prefix convention. |
| 0011 Forge and CI | `forge.gate` | GitHub ruleset | **next to it**: `test-js.yml` runs on push and pull request. Whether it is a required check lives in GitHub. |
| 0012 Delivery | `delivery.target` | npm registry | **next to it**: `package.json` has `files` and `exports` and no `private`. `release.yml` is named "Publish release". |
| 0012 | `delivery.environments` | GitHub and the registry | **next to it**: `release.yml` triggers on `release: created`, which suggests npm on tag. |
| 0012 | `delivery.release_tool` | a person's habit | **next to it**: `git tag` shows 105 tags, and the history has hand-made "Release 6.0.0." commits. No release-please or releaser-pleaser file exists. The publish step is in the external `paulmillr/jsbt` workflow. |
| 0012 | `delivery.release_notes` | the GitHub release text | **next to it**: `CHANGELOG.md` is hand-written. Whether releases carry highlights is not in the repository. |
| 0015 Secrets | `secrets.storage` | contributors' machines and the external jsbt workflow | **next to it**: no `.env` or `.envrc` is tracked, and the repository's own workflows reference no `secrets.*`. |
| 0017 Agent tooling | `agent.hosts` | which agents contributors use | **next to it**: no `.claude/settings.json` or `opencode.json` exists. That does not show what contributors use. |
| 0018 Dependencies | `dependencies.updater` | a GitHub app or setting | **next to it**: `.github/dependabot.yml` was added in b1352bd (2021-04-28) and deleted in d6622e7 (2024-08-25). The last Dependabot commit is from 2021. Recent bumps such as "chore: bump dev dependencies (#1457)" are by a person. |
| 0018 | `dependencies.automerge` | a GitHub app or setting | **next to it**: there is no `dependabot/fetch-metadata` workflow. |
| 0019 Vulnerabilities | `vulnerabilities.sbom` | the external release workflow | **next to it**: the repository's own workflows build no SBOM. `release.yml` delegates to `paulmillr/jsbt@84f47b7`. |
| 0019 | `vulnerabilities.scanner` | GitHub alerts, if any | **next to it**: no scan workflow exists. GitHub's own alerts leave no file. |
| 0019 | `vulnerabilities.fail_on` | follows `scanner` | **next to it**: no workflow scans. |
| 0020 Adding a dependency | `admission.approver` | a choice | none. Nothing in the repository records who admits a package. |
| 0020 | `admission.install_scripts` | contributors' npm version | **next to it**: there is no `.npmrc` and no `allowScripts` in `package.json`. `engines` is `node >= 22.22`, whose bundled npm runs install scripts. |
| 0021 Build provenance | `supply_chain.build_level` | the npm registry and the jsbt workflow | **next to it**: `release.yml` grants `id-token: write` and pins the jsbt workflow by SHA. Whether it attests is outside this repository. |
| 0022 Review and merge | `review.by` | GitHub ruleset | **next to it**: 208 merge commits, and no deny entries in any agent settings. |
| 0022 | `review.approvals` | GitHub ruleset | none. |
| 0024 Code scanning | `code_scanning.tool` | GitHub default setup, if on | **next to it**: no CodeQL workflow exists. The ADR says default setup leaves no file. |
| 0024 | `code_scanning.fail_on` | GitHub ruleset | **next to it**: no scan workflow exists. |
| 0026 Agent identity | `agent.identity` | GitHub and the maintainer's machine | **next to it**: `git log --format=%an` shows only human authors and Dependabot, with no agent account. |

## Order

I propose going through group 1 first, in number order (0004, 0007, 0010, 0013, 0014, 0016, 0023, 0025), then group 2 in number order. You can check the first group against what you know. I'll stop after each ADR for your agreement, and you can skip any.

Do you agree with this order, or do you want another? I have no question tool in this session, so please answer in plain text. I'll start ADR-0004 once you reply.
