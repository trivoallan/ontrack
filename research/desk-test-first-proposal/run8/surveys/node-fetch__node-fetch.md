### node-fetch__node-fetch.json cost=1.84 turns=40 subtype=success writes=[]
I'll start the survey by reading the ADRs and the repository's layout.
---
There are about 6,800 lines of ADRs. I'll read them in batches.
---
I'm partway through the survey: 20 of 25 ADRs read. Next I'll read the last five, then the repository's CI, config and history.
---
Now the repository itself.
---
AGENTS.md says to run `ontrack review` for an ADR review, so I'll check what it outputs, along with a few remaining config files.
---
I couldn't run `ontrack review`: the command needs your approval. I'll continue from the files themselves. One last look at the docs and README:
---
The survey is done. I read all 25 ADRs and the repository's files, CI, config and git history, and wrote nothing.

**Two things to know first:**
- **I couldn't run `ontrack review`.** AGENTS.md asks for it on any ADR review, but the command needs your approval. If you approve it, I'll follow its output for each ADR.
- **This checkout is upstream `node-fetch/node-fetch`.** Its remote is `https://github.com/node-fetch/node-fetch.git`, and CONTRIBUTING.md has a "Maintainers only" section naming other maintainers. Several rulings (review, merge gate, agent identity, the tracker you'd file items in) depend on whether you maintain that repository or a fork. That fact isn't in the repository, so I'll ask when it matters.

## Group 1: the repository already answers these

Every citation here shows the value itself.

| ADR | Proposed value | Citation |
|---|---|---|
| **0002 Localization** | `default: english`, no overrides | README.md, docs/*.md, the identifiers and comments in src/*.js, and `git log` subjects (e.g. `fix: Remove the default connection close header. (#1736)`) are all written in English. |
| **0004 Languages** | `main.name: JavaScript` | `package.json:3,7`: `"main": "./src/index.js"`, `"type": "module"`. Every file in `src/` is `.js`. TypeScript only appears in `@types/index.d.ts`, which is hand-written typings. *This departs from the recommendation, so the ADR needs a written reason.* |
| **0007 Tests** | `coverage_target: 100` | `docs/ERROR-HANDLING.md:37`: "Because we maintain 100% coverage". The value is stated, but no threshold is configured: `package.json:18` only reports to coveralls, and CI doesn't run coverage. |
| **0013 Frontend** | `rejected` (no user interface) | `package.json:4`: "A light-weight module that brings Fetch API to node.js". `package.json:8-11` publishes only `src` and `@types/index.d.ts`. |
| **0014 Work tracking** | `tool: github-issues`, `project: node-fetch/node-fetch` | `package.json:39-41` (`bugs.url` …/node-fetch/issues), `package.json:24-27` (repository URL), `.github/ISSUE_TEMPLATE/`, and `CONTRIBUTING.md:27` ("open an issue first"). |
| **0023 License** | `spdx: MIT` | `package.json:37` (`"license": "MIT"`) and the MIT text in `LICENSE.md:1`. |

## Group 2: at least one value is held elsewhere, inferred, or seen only in history

| ADR | The value I can't cite directly, and where it lives |
|---|---|
| **0003 Architecture** | `pattern`: written nowhere. I would only be inferring it from the shape of `src/`, a nearby signal. |
| **0005 Validation** | `boundary`: src/request.js and src/headers.js validate input by hand, which shows the value itself. `data_files`: inferred only from the absence of any data file the program reads. |
| **0006 Commits** | `scopes`: not held anywhere. Only history shows them (`Headers`, `Redirect`, `Body`, `readme`, `release`). `tool`: `.github/semantic.yml` configures a PR-title check that runs as a GitHub App. The App is enabled on GitHub, and it is none of the allowed values (`commitlint`/`hook`/`none`). |
| **0008 Documentation** | `tool: none` is inferred from the absence of any site config. `root`: user docs sit at README.md and in `docs/`, a nearby signal. `audience`: repository visibility lives on GitHub. |
| **0009 Branching** | `merge`: `CONTRIBUTING.md:50` says "Squash & merge", which is the value, but the allowed merge methods are a GitHub setting and `next`→`main` uses a merge commit (`:64`). `model`: CONTRIBUTING describes PRs plus long-lived `beta`/`next`/`N.x` branches, a nearby signal. `prefixes`: not held anywhere; remote branch names don't follow a pattern (`ci/npm-provenance`, `fetch-builtin-note`). |
| **0010 Architecture docs** | All three values (`none`) are inferred from absence: there is no `docs/architecture/`, no `.c4` file and no Mermaid. |
| **0011 Forge and CI** | `gate`: lives in GitHub rulesets. `audit`: inferred from absence (no zizmor). |
| **0012 Delivery** | `target: package` and `release_tool: semantic-release` are direct (`.github/workflows/release.yml:20-23`, `NPM_TOKEN`). `release_notes: changelog` is direct (`CONTRIBUTING.md:47-48`). `environments`: the triggers are direct (`release.yml:3-9`: pushes to main/next/beta/*.x, so **merge**, not tag), but the environment's name is up to you. `registry` and `manifests`: inferred from absence. |
| **0015 Secrets** | `storage` and `guard`: inferred from absence (no `.env`, `.envrc` or gitleaks). |
| **0016 Changes** | `framework: none` is inferred from absence. The PR template's "Purpose/Changes" section is a nearby signal. |
| **0017 Agent tooling** | `hosts`: held by the contributors, outside the repository. There is no `.claude/` and no `opencode.json`. |
| **0018 Dependencies** | `updater: dependabot` is direct (`.github/dependabot.yml`). `automerge`: inferred from absence (no `fetch-metadata` workflow). |
| **0019 Vulnerabilities** | All three values are inferred from absence. Any Dependabot alerts are a GitHub setting. |
| **0020 Adding a dependency** | `approver`: not held anywhere. `install_scripts`: inferred (`.npmrc` doesn't block scripts, and the npm version isn't pinned). Also `.npmrc:1` sets `package-lock=false` and the lockfile is gitignored, which conflicts with fixed rule 5. |
| **0021 Build provenance** | `build_level`: inferred as `0` because `release.yml` has no `--provenance` and no `id-token`. History has an `origin/ci/npm-provenance` branch. |
| **0022 Review and merge** | `by` and `approvals`: held in GitHub rulesets and by the maintainer team. |
| **0024 Code scanning** | Inferred from absence. Default setup, if enabled, is a GitHub setting. |
| **0025 Tools** | Depends on how you rule 0011 and 0015. Today it is inferred from absence. |
| **0026 Agent identity** | Held on GitHub and on your machine. The ADR is written for single-maintainer repositories, and CONTRIBUTING.md suggests several maintainers. |

## Proposed order

1. **Group 1:** 0002, 0004, 0007, 0013, 0014, 0023.
2. **Group 2**, ordered by dependency rather than by number: 0003, 0005, 0006, 0008, 0010, **0011** (gate, needed by 0018/0019/0024), **0012** (0009 asks for it to be ruled first), **0018** (before 0009, same reason), 0009, 0015, 0016, **0017**, **0026** (`own` forces 0022's answer), 0022, 0019, 0020, 0021, 0024, **0025** (last, since it reads 0011 and 0015).

Do you agree to this order, or would you rather use plain numeric order or another one? Also, do you maintain `node-fetch/node-fetch`, or is this a fork or test checkout?
