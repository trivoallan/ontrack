### handlebars-lang__handlebars.js.json cost=1.96 turns=59 subtype=success writes=[]
I'll start by running the review command the project rules point to, and listing the ADRs.
---
The `ontrack review` command needs approval I don't have, so I'll read the ADRs directly.
---
Now the repository itself: files, configuration, CI and history.
---
Survey done; I read all 25 ADRs and went through the repository without writing anything. Here are the two groups and the order I propose.

One note first: `npx -p @trivoallan/ontrack ontrack review`, the command AGENTS.md points to, was blocked because it needs approval. I'm working directly from the ADR files.

## Group 1: the repository already answers these

Every citation below shows the value itself.

| ADR | Value | Citation |
| --- | --- | --- |
| **0002 Localization** | `default: english`, no overrides | `README.md`, `CONTRIBUTING.md`, `git log` subjects and the identifiers and comments in `lib/**/*.js` are all in English |
| **0004 Languages** | `main.name: JavaScript` | all 28 source files under `lib/` are `.js` and there is no `.ts`; `package.json:30-31` has `"type": "module"`, `"main": "lib/index.js"`. This is not one of the two recommended languages, so the ruling has to say why |
| **0007 Tests** | `coverage_target: 99` | `vitest.config.js:75` `lines: 99`. One catch: the coverage run (`package.json:61`) also includes the `tasks` and `rspack` projects, so it is not strictly unit-only |
| **0013 Frontend** | `rejected` | `package.json:75-80` lists no UI framework, and the package is a templating library (`main`, `exports`, `bin`) |
| **0014 Work tracking** | `github-issues`, `handlebars-lang/handlebars.js` | `CONTRIBUTING.md:50-51` points to the GitHub issue tracker; `git remote -v` shows the same repository |
| **0016 Changes** | `framework: none`, `schema: none` | there is no `openspec/` directory (`ls -la`); `.github/PULL_REQUEST_TEMPLATE.md` puts intent in the pull request |
| **0018 Dependencies** | `updater: dependabot`, `automerge: none` | `.github/dependabot.yml` exists; neither `ci.yml` nor `release.yml` uses `dependabot/fetch-metadata`. Side note: `open-pull-requests-limit: 0`, and there is no `github-actions` ecosystem and no cooldown |
| **0021 Build provenance** | `build_level: 0` | `CONTRIBUTING.md:100-106` publishes with `pnpm publish` from a workstation; no workflow has `--provenance` or `attest` (grep) |
| **0023 License** | `spdx: MIT` | `package.json:12` `"license": "MIT"`, and `LICENSE` |

## Group 2: at least one value is held elsewhere, inferred, or unknown

| ADR | Shown by the repository (value itself) | Missing value: where it lives |
| --- | --- | --- |
| **0003 Architecture** | none | `pattern` is written nowhere. The `lib/handlebars/{compiler,helpers}` layout only sits next to it (it suggests `monolithic`) |
| **0005 Validation** | `data_files: json-schema` (`$schema` in `.oxfmtrc.json:2` and `.oxlintrc.json:2`) | `boundary`: hand-written checks in `lib/` and `yargs` for the CLI (`package.json:79`) sit next to it. No mechanism is named |
| **0006 Commits** | `tool: none`: husky runs only `lint-staged` on pre-commit (`package.json:110-114`). The premise is settled: versions are set by hand (`package.json:3`) | `scopes`: history only. `git log` mixes free-form subjects with an occasional `feat:` or `chore(...)` |
| **0008 Documentation** | `root: docs/` (`compiler-api.md`, `decorators-api.md`); no site generator here | The user docs site lives in `handlebars-lang/docs` (`CONTRIBUTING.md:17,116-122`), outside this repository. `audience: public` is only inferred from the public remote |
| **0009 Branching** | `master` plus a `4.x` backport branch (`CONTRIBUTING.md:19-22`) | `merge`: no merge commits since 2022 and `(#NNNN)` subjects, which is history only; the setting is on GitHub. `prefixes`: remote branches mix `chore/pnpm`, `fix-1838` and `cleanup-tests`, with no rule |
| **0010 Architecture documentation** | no `docs/architecture/` | I don't know whether an architecture document is kept elsewhere |
| **0011 Forge and CI** | `audit: none`: no zizmor or actionlint in `ci.yml`. Actions are pinned by tag (`@v6`), not by SHA | `gate`: the ruleset is on GitHub. Unknown |
| **0012 Delivery** | `target: package`, `release_tool: manual` (`CONTRIBUTING.md:100-106`); `registry: none`; `manifests: none`; S3 publishing on push to `master` and on tags (`release.yml:3-9`) | `environments`: the npm, RubyGems and bower publishes are done by people. `release_notes`: `release-notes.md` stops at v4.7.7 (2021), and what GitHub releases contain lives on GitHub |
| **0015 Secrets** | `guard: none` (husky pre-commit is `lint-staged` only) | `storage`: where maintainers keep their npm and S3 credentials locally is on their machines. Unknown |
| **0017 Agent tooling** | no `.claude/settings.json`, no `opencode.json` | Which agent hosts contributors use is known only to them. Unknown |
| **0019 Vulnerabilities** | `sbom: none` (nothing in `release.yml`) | `scanner` and `fail_on`: whether Dependabot alerts are on is a GitHub setting. Unknown |
| **0020 Adding dependencies** | `install_scripts: ignored` (`pnpm-workspace.yaml` has `allowBuilds: husky: true`) | `approver`: the maintainers' practice, written nowhere |
| **0022 Review and merge** | none | `by` and `approvals`: the ruleset is on GitHub. Unknown. `git shortlog` shows 7 authors since 2025, which only sits next to the value |
| **0024 Code scanning** | no CodeQL workflow | Whether CodeQL default setup is on is a GitHub setting. Unknown |
| **0025 Tools** | no mise, aqua or install script | The right value depends on how 0011 (`audit`) and 0015 (`guard`) are ruled |
| **0026 Agent identity** | none | How agents authenticate is set on GitHub and on people's machines. Unknown. The ADR targets one-person repositories, and the author count only sits next to that question |

One thing to know before ruling 0014: `origin` is the upstream `handlebars-lang/handlebars.js`. At the end of the review, any tracking issues would be created in that public repository, and only with your explicit agreement.

## Proposed order

Group 1 in number order (0002, 0004, 0007, 0013, 0014, 0016, 0018, 0021, 0023), then group 2 in number order (0003, 0005, 0006, 0008, 0009, 0010, 0011, 0012, 0015, 0017, 0019, 0020, 0022, 0024, 0025, 0026).

**Do you agree with this order, or would you like a different one?** None of these has to be ruled now: you can skip any of them or stop whenever you want.
