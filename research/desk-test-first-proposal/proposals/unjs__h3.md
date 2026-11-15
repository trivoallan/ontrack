=================== unjs__h3 ADR-0002
I checked the repository against the recommendation, which is one default language, `english`, with no overrides. Nothing here argues against it, and the recommendation isn't conditional.

- **Commits:** the last 20 commit subjects are all English Conventional Commits, for example `fix(static): join indexNames on a single / …` and `chore(release): v2.0.8`.
- **Documentation:** `docs/` (`1.guide`, `2.utils`, `4.examples`, `5.migration`, `99.blog`) and `AGENTS.md` are written in English.
- **Code and comments:** `src/` uses English names (`defineHandler`, `toResponse`, `kNotFound`) and English comments.

## Proposed ruling: `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | Commits, docs, `AGENTS.md` and `src/` are all in English |
| `localization.language.documentation` | *(empty: takes default)* | `docs/` is English |
| `localization.language.commits` | *(empty: takes default)* | `git log` subjects are English |
| `localization.language.code` | *(empty: takes default)* | `src/` names are English |
| `localization.language.comments` | *(empty: takes default)* | `src/` comments are English |

**Departures from the recommendation:** none. The ADR would say in one line that the recommendation was adopted as is.

**Also to fill in when ruling:** `date: 2026-11-15`, the authors (I'd propose `Tristan Rivoallan`, from the git user), and Consequences rewritten for this verdict. The French-speaking-maintainer drawback doesn't apply to an English-language project like h3.

Do you agree with this ruling (`accepted`, `default: english`, no overrides, author `Tristan Rivoallan`)? Or would you like to change any value or the author list? I won't write anything until you confirm.
=================== unjs__h3 ADR-0004
The recommendation holds for this repository, and I found nothing suggesting it doesn't apply.

**Proposed ruling for [trivoallan/ADR-0004] Languages: `accepted`**

- **`languages.main.name`: `TypeScript`**
  - All 181 source files under `src/` and `test/` are `.ts`. `tsconfig.json` sets strict mode with `isolatedDeclarations`.
  - The ADR says to pick TypeScript when a repository runs in a browser. Its own condition is met here: `src/_entries/generic.ts` targets web workers and browsers, and `src/_entries/service-worker.ts` targets service workers. `package.json` exports both as `h3/generic` and `h3/service-worker`.
  - The other 24 files are JavaScript (`.mjs`): `examples/`, `bin/h3.mjs`, `playground/server.mjs` and `vitest.config.mjs`. They are secondary files, and the ADR says those don't change the answer.

**Departures from the recommendation:** none. In place of the "How to rule" block I'd write one line saying the recommendation is adopted as is.

**Other fields:** `date: 2026-11-15`. For `authors:` I'd put `[Tristan Rivoallan]`, the git user, unless you tell me others took part.

Do you agree with this ruling? Once you confirm, I'll update the ADR, rewrite its Consequences section and run `npx ontrack apply`. Other ADRs are still `proposed`, so the list of rulings the repository doesn't follow yet comes after all of them are ruled.
=================== unjs__h3 ADR-0006
I don't have a question tool here, so I'm asking directly. Do you agree with this ruling?

- **accepted**, with `tool: commitlint` and the 29 scopes above.
- Should I add or drop any scopes? For example, `validate` as its own scope, `sse` instead of `event-stream`, or the small utility modules (`timing`, `fingerprint`, `sanitize`, `path`) that I left out.
- Should I add `--from origin/main` to the `check:` line now?
- What name should go in `authors:`?

I'll write nothing until you confirm.
=================== unjs__h3 ADR-0009
## Proposed ruling for ADR-0009 (Branching)

**Status: `accepted`**

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended, with one caveat below) | `ci.yml` runs on `pull_request: { branches: [main] }` and also publishes a `pkg-pr-new` preview for each PR. There are no `develop`, `release` or `hotfix` branches. Nothing in `src/` or the config uses feature flags, so `trunk-based` as the ADR defines it doesn't fit. |
| `branching.merge` | `squash` (as recommended) | `main` has a linear history. PR commits on `main` look like GitHub squashes, with one Conventional Commits subject ending in `(#NNNN)` (e.g. `2f29b87 … (#1585)`). `git log --merges` finds only one merge commit, the old `459093d Merge pull request #1156`. |
| `branching.prefixes` | `[feat, fix, docs, chore, build]` (this departs from the recommendation) | The remote branches with a prefix use these five: `feat/*` (17 branches, e.g. `feat/defineRoute`), `fix/*` (5), `chore/bench`, `chore/playground`, `docs/agents-pr-philosophy`, `build/compact`. All five are among the eleven commit types. |

**Departures from the recommendation**

- **`prefixes` adds `chore` and `build`.** The maintainers already use both as branch prefixes (`chore/bench`, `chore/playground`, `build/compact`), and `chore`/`build` commits are frequent on `main` (dependency bumps, releases, the build change in `b48b480`). If the list stays at `[feat, fix, docs]`, the check would fail branches the project already names this way.

**Caveats (no departure proposed, but you should decide)**

1. **Direct pushes to `main` are common.** In the last year, 259 of 437 first-parent commits on `main` have no `(#N)`: every `chore(release): v2.0.x`, the dependency updates, and some `fix:` commits (e.g. `3a7ed0e`, `48d650b`). So maintainers work partly trunk-style, and outside contributors use PRs. I still propose `github-flow`. The check doesn't enforce the model, and the value tells an agent the right thing: open a branch and a PR, and never push to `main`. If you'd rather write down what maintainers actually do, `trunk-based` is the other option, but the repo has no feature flags.
2. **The repo has a long-lived `v1` maintenance branch.** `renovate.json` lists `"baseBranches": ["main", "v1"]`. The check passes on a branch called `v1` only if `v1` is the default branch, and it isn't. Work committed straight onto `v1` would fail. Work on `v1` through `fix/...` branches would pass.
3. **Bot branches.** Renovate opens `renovate/...` branches. ADR-0018 (dependencies) isn't ruled yet, so per this ADR those PRs will fail the check until ADR-0018 is ruled with `renovate`. The same goes for ADR-0012 if a release bot is adopted. Releases are pushed directly today, so that one doesn't apply yet.

**Also written into the ADR:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]` (please confirm the name or add others), the Consequences lists rewritten for this ruling, and the "how to rule" block replaced by the reasons above.

Do you agree with this ruling? You can accept it as is, keep the recommended prefixes `[feat, fix, docs]`, switch the model to `trunk-based`, or change the authors. I won't write anything until you answer.
=================== unjs__h3 ADR-0011
Nothing in this repository argues against the recommendation, so I propose accepting it unchanged.

**Proposed ruling for ADR-0011: `accepted`**

| Trait | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | The repository is on GitHub (`origin` is `github.com/unjs/h3`). `.github/workflows/ci.yml` runs `pnpm lint`, `typecheck`, `build` and `vitest --coverage` on every pull request to `main`. `publish.yml` only publishes after `ci` succeeds on `main`, so the project already treats a red `ci` as something that stops work. |
| `forge.audit` | `zizmor` | The three workflows are already written as zizmor expects. Every action is pinned by SHA with its tag in a comment, `actions/*` included. Permissions are set to `{}` for the whole workflow and to `contents: read` per job. Checkouts use `persist-credentials: false`. In `publish.yml`, the `workflow_run` values go through `env:` and are not expanded into `run:`. zizmor would enforce rules the authors already follow, though nothing runs it yet: it is not installed, and there is no `zizmor.yml` and no mise config. |

**Departures from the recommendation:** none.

Two things I couldn't confirm:
- **Whether `main` actually requires the check.** I tried to read the branch rules with `gh api repos/unjs/h3/rules/branches/main`, but that call was denied. `blocking` is a statement of intent until a GitHub ruleset makes `ci / tests` a required check.
- **Which repository name is current.** `publish.yml` checks for `github.repository == 'h3js/h3'`, but the git remote still points to `unjs/h3`. The repository has probably moved to `h3js/h3`, and any ruleset lookup should use that name.

If you agree, I'll fill the traits, set `status: accepted`, the date (2026-11-15) and the authors, rewrite the Consequences section and remove the "how to rule" block. Then I'll run `npx ontrack apply`.

**Do you accept this ruling (`forge.gate: blocking`, `forge.audit: zizmor`), or do you want a different value for either key? And what name should go in `authors:`?**
=================== unjs__h3 ADR-0023
I found nothing in this repository that argues against the recommendation, which is MIT. h3 is already published under MIT.

## Proposed ruling for `[trivoallan/ADR-0023]` License

**Status:** `accepted`

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `license.spdx` | `MIT` | `package.json:6` says `"license": "MIT"`, and the root `LICENSE` file contains the full MIT text |

**Departures from the recommendation:** none. In place of the guidance block I would write one line saying the recommendation is adopted as is.

**The ADR's three fixed requirements are already met:**
1. **The manifest declares the licence:** `package.json` says `MIT`. There is no `pyproject.toml`, so that is the only manifest.
2. **A licence file is at the root:** `LICENSE` is there.
3. **Copyright line:** the existing `LICENSE` names Pooya Parsa. I would leave it alone.

**Frontmatter I would fill in:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from your git user. Tell me if other people took part in this decision.

Do you agree with this ruling? Once you say yes, I'll update the ADR (traits, status, date, authors, the Consequences lists, and remove the guidance block) and run `npx ontrack apply`.
=================== unjs__h3 ADR-0025
I've read ADR-0025 and checked the repository. Here is the ruling I propose. Nothing has been written yet.

## Proposed ruling: ADR-0025, Tools outside the package manager

**Status:** `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `tools.manager` | `mise` | The ADR's recommendation depends on how many tools need pinning: `script` for one, `mise`/`aqua` for several. This review pass would name three. ADR-0015 recommends `secrets.guard: gitleaks` (`ADR-0015-secrets.md:83`), ADR-0011 recommends `forge.audit: zizmor` (`ADR-0011-forge-and-ci.md:69`), and ADR-0019 recommends `vulnerabilities.scanner: grype` (`ADR-0019-vulnerabilities.md:101`) for local runs. Since there are several, the recommendation is `mise`. I chose `mise` over `aqua` because the repo already uses Renovate (`renovate.json`, which extends `github>unjs/renovate-config`). Renovate's `mise` manager updates `mise.toml` and `mise.lock` in the same PR. That covers rule 4 (the checksum moves with the version), which `aqua` doesn't. |

**What keeps the pins current (rule 4, to write in the ADR):** Renovate, which is already set up here. Its `mise` manager updates `mise.toml` and `mise.lock` together in one pull request. The mise version, and the `jdx/mise-action` hash if that action is used, move through Renovate too.

**Departures from the recommendation:** none. I found nothing in the repository that rules out the recommendation. Two points to be aware of:

- **The condition isn't settled yet.** Every ADR except ADR-0001 is still `proposed` (from a grep of `^status:` in `docs/adr/`). So right now no accepted ADR names a tool, and `none` would technically be allowed. I'm proposing `mise` because ADR-0011, ADR-0015 and ADR-0019 are being ruled in this same pass, and their recommendations name tools. If you rule them `none` or `github`, or the count drops to one, this should be `none` or `script` instead.
- **Nothing exists to replace or migrate.** No repo-level tool installer is set up: there's no `mise.toml`, `.tool-versions`, `aqua.yaml`, hooks directory or `scripts/` folder. The workflows only use pinned actions (`unjs/setup-jup`, `codecov-action` with `version: v11.3.1`). Those fall under ADR-0011 rule 3 and ADR-0004, not this ADR.

**Consequences I'd write:**
- **Positive:** gitleaks, zizmor and grype each have one version and checksum in `mise.lock`. The same file serves the pre-commit hook, the CI job and an agent session. The existing Renovate setup keeps the pins current.
- **Negative:** mise is one more binary to pin and trust. Tools must come from a backend that gives checksums (aqua or GitHub releases), not the asdf backend. A new platform needs its own lock entries.
- **Neutral:** `ontrack-engineering-check ADR-0025` will check gitleaks and zizmor through `mise which`. Review still has to cover grype.

I'd fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, unless other people took part in the decision.

**Do you agree with `tools.manager: mise` and `accepted`?** Or would you rather wait and rule this after ADR-0011, ADR-0015 and ADR-0019 are settled? Once you confirm, I'll update the ADR and run `npx ontrack apply`.
