### mochajs__mocha.json cost=2.74 turns=65 subtype=success writes=[]
I'll start the survey: read every proposed ADR and the repository's relevant files, writing nothing.
---
Surveying the ADRs; my shell filtering was blocked, so I'm reading the files directly.
---
Still surveying: 15 of 25 ADRs read, now reading 0017–0026.
---
ADRs read. Now the repository itself.
---
Almost done surveying — checking the last repo facts (license, remote, hooks, absent tooling).
---
The survey is done; I haven't written anything. I sorted the 25 ADRs by whether the repository already answers every value they ask for.

## Group 1: the repository already answers these (11)

| ADR | Value the repository shows | Where it shows |
|---|---|---|
| **0002 Localization** | `default: english`, no overrides | `README.md`, `.github/CONTRIBUTING.md`, `MAINTAINERS.md` and every page under `docs/src/content/docs/` are in English; `git log` subjects are English; identifiers in `lib/` (`runner.js`, `suite.js`…) are English |
| **0004 Languages** | `main.name: JavaScript` | `git ls-files`: 471 `.js/.cjs/.mjs` files against 12 `.ts` files (type declarations, checked by `npm run tsc`); `package.json` has `"type": "module"` and `eslint` |
| **0007 Tests** | `coverage_target: none` (coverage is measured but no threshold is enforced) | `.nycrc` has no `check-coverage`; `scripts/` contains no threshold; `mocha.yml` `coverage` job only merges and reports |
| **0010 Architecture docs** | `document: none`, `model: none`, `diagrams: none` | `docs/architecture/` does not exist; no `.c4` file and no `mermaid` block anywhere in the repository |
| **0014 Work tracking** | `tool: github-issues`, `project: mochajs/mocha` | `package.json` `bugs.url`; `.github/ISSUE_TEMPLATE/*`; `CONTRIBUTING.md` ("discussed in the issue tracker first") |
| **0016 Changes** | `framework: none`, `schema: none` | no `openspec/` directory; intent lives in the issue and the PR (`CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`) |
| **0021 Build provenance** | `build_level: 2` | `.github/workflows/release-please.yml:72` runs `npm publish --provenance` on `ubuntu-latest` with `id-token: write` |
| **0023 License** | `spdx: MIT` | `package.json:25` `"license": "MIT"`; root `LICENSE` ("The MIT License", OpenJS Foundation) |
| **0025 Tools** | `manager: none` | no `mise.toml`, `aqua.yaml` or install script; no accepted ADR names such a tool yet |
| **0026 Agent identity** | → `rejected` | `MAINTAINERS.md` describes a team of several maintainers, and the ADR says multi-maintainer repositories are out of its scope |
| *(0012 is in group 2, see below)* | | |

## Group 2: at least one value isn't answered in the repository (14)

| ADR | The value I can't cite, and where it lives |
|---|---|
| **0003 Architecture** | `pattern`: I'd have to infer it from how `lib/` is laid out (runner, reporters, interfaces); nothing states it |
| **0005 Validation** | `boundary`: config and CLI parsing look hand-written (`lib/cli/parse-args.js`, `run-option-metadata.cjs`), but that's my reading of the code. `data_files`: no `$schema` anywhere, so it's undecided |
| **0006 Commits** | `scopes`: only the history shows them (bots use `deps` and `main`, people use none). `tool` is `none` (no commitlint and no hook, although `CONTRIBUTING.md` mentions a pre-commit hook that doesn't exist) |
| **0008 Documentation** | `channels`: which branch Netlify deploys is set in Netlify's settings, not in the repository (`netlify.toml` doesn't name one). Tool, root and audience are observed: `starlight`, `docs/src/content/docs/`, `public` |
| **0009 Branching** | `prefixes`: no convention exists (`copilot/`, `renovate/`, `boneskull/issue/…`), and contributor branches live in forks. `merge: squash` is observed (`MAINTAINERS.md` § Merging PRs) |
| **0011 Forge and CI** | `gate`: whether checks are required is a GitHub ruleset setting, outside the repository. `audit` is `none` (no zizmor) |
| **0012 Delivery** | `release_notes`: the GitHub release bodies live on GitHub. The approval gate on the `npm` environment is a GitHub environment setting (documented in `MAINTAINERS.md`). The rest is observed: `package`, `release-please`, registry `none`, manifests `none` |
| **0013 Frontend** | Whether the browser HTML reporter (`lib/browser/`, `mocha.css`) counts as a user interface is a judgment call; there's no framework in `package.json` |
| **0015 Secrets** | `storage`: inferred only (`.gitignore` lists `.env` and `.envrc`, and the build needs no local secret). `guard` is `none` |
| **0017 Agent tooling** | `hosts`: which agents contributors use isn't recorded in the repository. `AGENTS.md` and `.github/copilot-instructions.md` exist, and there are Copilot *cloud* agent commits, but the ADR's `copilot` value doesn't cover that agent. There's no `.claude/` |
| **0018 Dependencies** | `updater`: the repository runs both Renovate (`renovate.json`, npm, 7-day age, patches off) and Dependabot (`.github/dependabot.yml`, actions only), but the key takes one value. The Renovate app install is on GitHub |
| **0019 Vulnerabilities** | `scanner`: Renovate vulnerability PRs depend on GitHub's alert settings, which are outside the repository. There's no SBOM and no scanner in the repository |
| **0020 Adding dependencies** | `approver`: nothing says who admits a new package. `install_scripts` is ignored in CI (`npm ci --ignore-scripts`) but scripts run locally (`npm install`) |
| **0022 Review and merge** | `approvals`: the required-approvals count is a GitHub ruleset setting. `MAINTAINERS.md` says not to wait on a requested review |
| **0024 Code scanning** | `tool`: there's no CodeQL workflow. Default setup, if it's on, is a GitHub setting I can't see |

## Proposed order

1. **Group 1, in number order:** 0002, 0004, 0007, 0010, 0014, 0016, 0021, 0023, 0025, 0026.
2. **Group 2, in number order:** 0003, 0005, 0006, 0008, 0009, 0011, 0012, 0013, 0015, 0017, 0018, 0019, 0020, 0022, 0024.

**One adjustment to consider:** move 0012 and 0018 before 0009. ADR-0009's check only accepts the bot branch names (`release-please--`, `renovate/`, `dependabot/`) once those two are ruled.

Do you agree with this order, with or without that adjustment, or would you like a different one? I don't have a question tool in this session, so please just reply here.
