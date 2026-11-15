=================== sindresorhus__ky ADR-0002
I read the ADR in full and checked how the repository handles language today.

**What the repository does today**
- **Documentation:** `readme.md` is in English (about 1,940 lines). It has one Japanese phrase, quoted as the origin of the name "KY" (`readme.md:1939`). `.github/security.md` and the ADR files are in English too.
- **Commits:** I checked all 592 commits (`git log --format=%s`) and found no French words. The recent ones read like "Let a `beforeRetry` hook change per-attempt options" and "Reject a nullish hook list instead of treating it as absent".
- **Code names:** functions, constants and types are English, for example `getRetryTimingHeader`, `supportsRequestStreams` and `requestMethods` in `source/core/`.
- **Comments:** English, for example `source/utils/body.ts:207` and `source/types/retry.ts:107`. The only non-ASCII text in `source/` is `©` and `§`. The `café 日本語 🌍` strings in `test/` are test data for character encoding, not comments.
- **What's absent:** nothing sets or checks a language. No locale or i18n setup in `.editorconfig` or CI, and no commit-message linter. The repository doesn't need one for this decision; English is simply what everyone writes.

**Compared with the recommendation:** it recommends one language for everything, `default: english`, with no overrides. The repository already does exactly that, so there are no differences. The recommendation has no "if this repository…" conditions to check, and nothing suggests the question doesn't apply here, so `rejected` doesn't fit.

## Proposed ruling

**Status:** `accepted`

- `localization.language.default: english (observed)`: the readme, all 592 commit messages, every exported name and every source comment are in English.
- `localization.language.documentation: (empty, uses default) (observed)`: `readme.md` and `.github/*.md` are in English.
- `localization.language.commits: (empty, uses default) (observed)`: `git log` shows only English messages.
- `localization.language.code: (empty, uses default) (observed)`: names like `getRetryTimingHeader` and `supportsAbortController`.
- `localization.language.comments: (empty, uses default) (observed)`: `source/utils/body.ts:207`, `source/types/ResponsePromise.ts:23`.

**Departures from the recommendation:** none. The ADR will say in one line that the recommendation is adopted as is.

**Filling it in:** `date: 2026-11-15`. For `authors:` the git user is "Tristan Rivoallan", but the field is for whoever decides, so I need you to confirm the name. I'll also rewrite the Consequences: the current Negative points about French-speaking maintainers barely apply to an English-only project. And I'll delete the "How to rule" block.

Do you agree with this ruling, and what name should go in `authors:`? I'll write nothing until you confirm.
=================== sindresorhus__ky ADR-0004
The repository already answers this question: it is written in TypeScript, and that is the language the ADR recommends.

**What the repository does today**
- **Source:** all library code is TypeScript (`source/index.ts`, `source/core`, `errors`, `types`, `utils`). No `.js`, `.py`, `.go`, `.rs` or `.sh` files exist under `source/`, `test/` or `test-d/`.
- **Tooling:** builds with `tsc --project tsconfig.dist.json`, type-checks with `tsconfig.test.json`, lints with `xo`, and runs tests with `ava` on `.ts` files through `tsx` (all in `package.json`). `tsconfig.json` builds on `@sindresorhus/tsconfig` and turns on `exactOptionalPropertyTypes`.
- **CI:** `.github/workflows/main.yml` runs the tests on Node 22, 24 and latest, then runs `npm test -- test/browser.ts` with Playwright browsers.
- **History:** TypeScript since commit `2d8d68a` (2021-04-28, "Move to TypeScript (#330)").

**The ADR's condition:** it says to pick TypeScript when the code runs in a browser or shares code between browser and server. Both are true here. `test/browser.ts` runs in Playwright browsers in CI, the package keywords include `browser`, and `engines.node >=22` covers the server side.

## Proposed ruling

**Status:** `accepted`

- `languages.main.name: TypeScript (observed)`: every file under `source/` is `.ts`, the build uses `tsc`, and it has been TypeScript since `2d8d68a` (2021).

**Departures from the recommendation:** none. The ADR would note that the recommendation is adopted as is, and the Consequences lists would be rewritten for this repository.

## Before I write anything

1. Do you agree with this ruling (`accepted`, `languages.main.name: TypeScript`)?
2. Who goes under `authors:`? I'd suggest `[Tristan Rivoallan]`, the git user. The date would be 2026-11-15.

Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0004-languages.md` and then run `npx ontrack apply` to update AGENTS.md.
=================== sindresorhus__ky ADR-0006
I've read the ADR and the repository. Here is what I found and the ruling I propose.

**What the repository does today**
- **How versions are set:** by hand. In `package.json`, `"release": "np"` runs an interactive tool where you pick the version. Release commits are just the version number (`2.2.0`, `2.1.0`, …) with matching tags (`v2.2.0`). Nothing reads commit messages to set a version: there's no semantic-release, changesets or `.releaserc`.
- **Message format:** none of the 592 commits follows Conventional Commits. Messages are plain sentences such as `Let a \`beforeRetry\` hook change per-attempt options` or `Fix CI`.
- **Scopes:** no commit has ever used one. It's a single npm package. `source/` has `core/`, `errors/`, `types/` and `utils/`, but nothing in the history filters by those areas.
- **Enforcement:** none. There's no commitlint dependency or config, no husky, and `.git/hooks` only has the default `.sample` files. `.github/workflows/main.yml` runs tests, lint and build, and doesn't check commit messages.

**Is the premise met?** The recommendation of `commitlint` only holds "if this repository generates its versions from commit messages". This one doesn't, as shown by the `np` script and the hand-set version commits. So the recommendation doesn't apply, and the ADR says `none` is just as good an answer.

**Proposed ruling**

Status: `accepted`. I'm not proposing `rejected`: commits are made here, so the question applies, and `[]` and `none` are explicit answers. Leaving the keys out would let an agent invent scopes.

- `commits.scopes: [] (observed)`: none of the 592 commits uses a scope, and it's a single package.
- `commits.tool: none (observed)`: there's no commitlint, hook or CI step today, and versions are set by hand with `np`, so the premise for `commitlint` fails.

**Departures from the recommendation**
- **`commits.tool: none` instead of `commitlint`:** the recommendation depends on versions being generated from commit messages, and here they're set by hand. Review keeps the convention.
- **`commits.scopes: []`:** the ADR recommends no scope list, so this isn't a departure. It records that the package is a single area with no scope history.

**Something you should know**
Governance requires the Conventional Commits format whatever you rule here, but this repository has never used it. I'll list that as a ruling the repository doesn't follow yet when I give the follow-up list.

**What I need from you**
1. Do you agree with `accepted`, `scopes: []` and `tool: none`, or do you want changes?
2. For `authors:`, should I write `[Tristan Rivoallan]` (your git user name), or someone else?

I'll write nothing until you confirm. I'll then set `date: 2026-11-15`, rewrite the Consequences, replace the how-to-rule block with the reasons above, and run `npx ontrack apply`.
=================== sindresorhus__ky ADR-0009
Still gathering evidence: the history has no merge commits. Next I'm checking for squash-merge markers and direct pushes.

I couldn't run `npx ontrack review` because the permission was declined, so I worked from the ADR's own instructions and from git.

## What the repository does today

- **Default branch is `main`** (`origin/HEAD -> origin/main`). There is no long-lived `develop`, `release/*` or `hotfix/*` branch, so this is not gitflow.
- **Most work is pushed straight to `main`.** Since 2026-01-01 roughly 140 commits on `main` were committed by "Sindre Sorhus" with no PR number, including every commit from 2.1.0 to 2.2.0 except #883. About 30 came through pull requests. The maintainer works trunk-based, and outside contributors use pull requests.
- **There are no feature flags.** Instead, releases are cut on purpose with `np` (`package.json` → `"release": "np"`), from the version commits `2.1.0` and `2.2.0`.
- **Every pull request is squashed.** `git log --merges` returns nothing across the whole history. Each PR lands as one commit ending in `(#N)`, committed by "GitHub" (for example `e68ea7a … (#883)`).
- **Branch names don't follow a prefix convention.** Squashing erases PR branch names from history. The only branch left to look at is `origin/fix-methods` (dated 2025-12-22), which uses a hyphen and not the `prefix/kebab-case` form. Nothing checks branch names: there's no hook, and CI (`.github/workflows/main.yml`) runs on every push and PR without a name check.
- **Commit messages are plain sentences** ("Fix …", "Add …"), not Conventional Commits. This matters for the ADR's note about squash messages, but that question belongs to ADR-0006.
- **The ADR's bot-branch condition doesn't apply.** There's no Dependabot, Renovate or release-please config (`.github/` only has `funding.yml`, `security.md` and `workflows/main.yml`), so no bot opens branches that the check would have to let through.
- **I couldn't see the forge settings.** Branch protection on `main` and which merge buttons are enabled live in GitHub's repository settings, outside the repo. The history shows squash-only, but I can't confirm the other merge methods are switched off.

## Proposed ruling

**status: accepted**

- `branching.model: trunk-based (observed)`: about 80% of this year's commits on `main` were pushed directly by the maintainer, and PRs are only how outside contributors get in. There are no flags; releases are cut with `np` instead.
- `branching.merge: squash (observed)`: there are no merge commits in the whole history, and every PR is one GitHub-committed `(#N)` commit.
- `branching.prefixes: [feat, fix, docs] (absent)`: no naming convention exists, the one visible branch `fix-methods` doesn't match, and nothing enforces names. The ruling would add the `prefix/kebab-case` form.

**Departures from the recommendation**

- `branching.model`: I'm proposing `trunk-based` instead of `github-flow` because that's how this single-maintainer library actually works. `github-flow` would turn about 80% of today's commits into pull requests the maintainer has never needed. Choosing it would mean marking `github-flow` as *absent*, and the forge would then need protection on `main`.
- None for `merge` or `prefixes`.

The other option is to adopt the recommendation as is (`github-flow`, absent). That would tell agents never to push to `main`, which is a stricter rule than the maintainer follows.

Do you agree with this ruling, or do you want `github-flow` (or any other change)? Also, who should go in `authors:`? I'll use **Tristan Rivoallan** unless you say otherwise. Once you agree, I'll fill the frontmatter, set `date: 2026-11-15`, rewrite the Consequences section, replace the instruction block with the reason for the departure, and run `npx ontrack apply`. I won't write anything before then.
=================== sindresorhus__ky ADR-0011
I've read the ADR and the repository. The `npx ontrack review` and `gh api` calls were not approved, so I'm working from the ADR text and local files only.

## What the repository does today

- **Forge: GitHub.** The remote is `github.com/sindresorhus/ky` and there is one workflow, `.github/workflows/main.yml`. So `rejected` doesn't apply.
- **Pipeline:** the `CI` workflow runs on every `push` and `pull_request`. It has two jobs:
  - `test`: a Node matrix (latest, 24, 22) running `npx ava`.
  - `browser`: runs `npm test`, which is `xo && build && tsc && ava` from `package.json:25`.
- **Required checks: I couldn't see them.** Whether a red CI blocks a merge depends on a ruleset or branch protection on GitHub. I asked to read `repos/sindresorhus/ky/rulesets` and `branches/main/protection`, but those calls weren't approved.
- **Workflow audit: none.** There's no zizmor job in CI, `zizmor` isn't on the PATH, and there's no `zizmor.yml`. actionlint is installed on this machine (`~/.local/bin/actionlint`) but isn't wired into the repository.

## How it compares with the ADR's rules

| Rule | Today |
| --- | --- |
| 1. Deploy only from the default branch | No deploy job, so nothing to check |
| 2. Deploy secrets are protected | No secrets used |
| 3. Pin actions by SHA | **Broken:** `actions/checkout@v6` and `actions/setup-node@v6` are movable tags (lines 17, 18, 28, 29) |
| 4. No secret written to a log | Holds |
| 5. No secrets for untrusted contributions | Holds: no `pull_request_target`, no secrets |
| zizmor rule 1 (a zizmor job on every pull request) | Missing |
| zizmor rule 3 (every action pinned by hash) | Broken, same as rule 3 |

Two more things zizmor would likely flag:
- **`artipacked`:** neither checkout sets `persist-credentials: false`.
- **No `permissions:` block,** so the jobs get the default token permissions.

**Stage table:** the `lint`, `test` and `build` stages exist, all folded into `npm test`. That's acceptable, since the workflow runs the command `package.json` defines. The `audit` stage would be new once `forge.audit: zizmor` is ruled.

## Proposed ruling

**Status: `accepted`**

- `forge.gate: blocking (?)`: CI runs on every pull request, but whether it's a required check is a GitHub setting I couldn't read. **Please tell me:** does a ruleset or branch protection on `main` require the `CI` checks? If yes, it's `observed`. If no, it's `absent`, and you'd add the ruleset. Choose `informative` if you'd rather keep it advisory.
- `forge.audit: zizmor (absent)`: nothing reads the workflows today, and the workflows already break rule 3.

**Departures from the recommendation:** none proposed, unless you choose `informative` for the gate.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`? And what is the ruleset state on `main`?** I'll write nothing until you answer.

---

### Rulings this repository doesn't follow yet (if accepted as proposed)

- `[trivoallan/ADR-0011] forge.audit`: no zizmor job in CI; the actions aren't pinned by SHA; checkout keeps its credentials; there's no `permissions:` block.
- `[trivoallan/ADR-0011] forge.gate`: a ruleset requiring the CI checks on `main` may be missing (unverified, waiting on your answer).

No `tracking` trait is decided in AGENTS.md (ADR-0014 is still proposed), so this list stays here and nothing will be created in a tracker.
=================== sindresorhus__ky ADR-0023
The licence question is already answered in practice: ky is MIT, both in `package.json` and in a committed licence file. There is one catch. The ADR's check would not find that licence file as it is named today.

## What the repository does today

- **`package.json:5`** has `"license": "MIT"`. That line is in the committed version, not only in your uncommitted changes.
- **The licence file is `license`**, all lowercase and with no extension, and it is tracked (`git ls-files` shows it). It holds the full MIT text with the line "Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)". The file dates back to `441fb42 Init`.
- **The copyright holder matches.** The ADR wants the organisation that owns the repository, and the repository is `sindresorhus/ky`.
- **There is no `pyproject.toml`**, so the Python half of the ADR doesn't apply.
- **Nothing in CI checks the licence** today.

## Comparison with the recommendation

- **Value:** the ADR recommends `MIT`, and that is what the repository uses. No difference.
- **Licence file name:** the ADR requires `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`. The repository has `license`. The check compares names exactly, in capitals (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822` and `:870`), so it would report that no licence file exists. Your Mac's filesystem ignores case, which hides this locally, but git and the check do not.
- **The ADR's conditions:** the only conditional rule ("`UNLICENSED` needs no licence file") doesn't apply, because the value is MIT.

## Proposed ruling

**Status: `accepted`**

- `license.spdx: MIT (observed): package.json:5 declares "MIT"; the tracked root file "license" holds the full MIT text, copyright Sindre Sorhus`

**Departures from the recommendation:** none. The ADR would get the one line "Adopted as recommended."

The file name isn't a departure, since the ADR fixes the name whatever the ruling. It is a place where the repository doesn't follow the ruling yet, so it will be the first item in the follow-up list.

To fill `date:` and `authors:` I'd write `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, using your git user name.

**Do you agree with `accepted`, `license.spdx: MIT`, and those authors?** If you'd rather pick another licence, or name other authors, tell me before I write anything.
=================== sindresorhus__ky ADR-0025
I've read the ADR and looked through the repository. Here is the ruling I propose.

## What the repository does today

- **Nothing is installed outside npm.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions`, install script or `scripts/` directory, and there never has been. A search of the history for those names only hit `ResponsePromise.ts`, which is a false match.
- **There are no hooks.** No `.husky/`, lefthook or pre-commit config, and `.git/hooks` holds only the sample files.
- **CI** (`.github/workflows/main.yml`) uses only `actions/checkout@v6`, `actions/setup-node@v6`, `npm install`, `npx ava` and `npx playwright install --with-deps`. The Node runtime is outside this ADR's scope (ADR-0004). The Playwright browsers are fetched by the `playwright` package from `package.json`, whose version decides theirs, so they don't count as a separate tool either.
- **No accepted ADR names a tool.** ADR-0001 is the only one with `status: accepted`. ADR-0015 (`gitleaks`), ADR-0011 (`zizmor`) and ADR-0019 (`grype`) all recommend tools, but all three are still `proposed`.

## The recommendation's condition

The ADR recommends `script` for one tool and `mise` or `aqua` for several. It also says: "`none` is an answer only when no accepted ADR names such a tool." Today the count is zero, and the frontmatter statuses above confirm that no accepted ADR names a tool. So `none` is a valid answer.

## Proposed ruling

**Status:** `accepted`

- `tools.manager: none (observed)`: nothing outside npm is installed anywhere today (no manager files, no install script, no hooks, nothing in CI), and no accepted ADR names a tool.

**Departure from the recommendation:** the recommendation assumes at least one tool and picks `script` or `mise` by how many there are. With none, there is nothing to pin, and setting up a manager would add a binary that installs nothing. For rule 4 (what keeps the pins current), I'd write: "nothing to keep current; when an accepted ADR names a tool, this ADR is superseded before that tool is added."

**Caveat:** this ruling only lasts until you accept ADR-0015 or ADR-0011 with their recommended tools. Once either is accepted, the ADR's check fails while this says `none`. If you already plan to accept both with `gitleaks` and `zizmor` (two tools, three with `grype`), the alternative is to rule `tools.manager: mise (absent)` now. That means adding `mise.toml` and `mise.lock` with `lockfile = true`, a pinned `jdx/mise-action` in CI, and Renovate for updates, since Dependabot doesn't support mise.

**Should I go with `none`, or switch to `mise`?** I'll write nothing until you choose. Please also tell me the names to put under `authors:`.
