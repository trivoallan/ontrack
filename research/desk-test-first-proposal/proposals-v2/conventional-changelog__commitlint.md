=================== conventional-changelog__commitlint ADR-0002
Now evidence from the repository.

I propose `accepted` for [ADR-0002 Localization](docs/adr/trivoallan/ADR-0002-localization.md), with `default: english` and no overrides. That matches the recommendation exactly.

**What the repository does today.** It has never set a language rule anywhere: there's no localization config, no i18n or locale files, nothing in `.github/CONTRIBUTING.md`, and no `lang` or `locales` in `docs/.vitepress/config.ts`. In practice, though, everything is in English:
- **Documentation:** the docs site under `docs/` and each package's `readme.md` are in English, with no translations.
- **Commits:** I checked all 3,614 commit subjects. They are Conventional Commits in English. The only lines outside that format are release tags (`v21.2.4`…). The one hit on French words was `docs: English syntax correction (#3380)`, which is English.
- **Code and comments:** names, comments and messages are in English, e.g. `` `⚠ ${type} may not be empty.` `` in `@commitlint/prompt/src/library/get-prompt.ts:84`. The only non-ASCII characters are status symbols (`⚠ ✖ ⧗`) and test data such as `über` and `naïve-bayes` in `@commitlint/ensure/src/to-case.test.ts`, not another language.

**Compared with the recommendation:** there are no differences. The recommendation has no conditions to check.

**Proposed ruling**
- **Status:** `accepted`
- **`localization.language.default`:** `english`. Docs, all commit history, code and comments are already English.
- **`documentation`, `commits`, `code`, `comments`:** left empty, so they take the default. All four media are already English, so there is no reason to override any of them.
- **Departures from the recommendation:** none. In place of the "how to rule" block I'll write one line saying the recommendation is adopted as is, and rewrite the Consequences to fit this repository: an English open-source project with an international audience. The "French-speaking maintainer" negatives don't apply here.
- **`date` / `authors`:** `2026-11-15` and `[Tristan Rivoallan]`, unless you want other names.

Once you agree, I'll edit only this ADR and then run `npx ontrack apply` to update AGENTS.md. Do you agree with this ruling, and should I list you as the author?
=================== conventional-changelog__commitlint ADR-0004
I've finished looking at what the repository does. One more quick check of the history, then I'll give you the proposed ruling.

I propose ruling **[trivoallan/ADR-0004] Languages** `accepted` with `languages.main.name: TypeScript`.

**What the repository does today**
- **Source code:** every package under `@commitlint/*/src/` is `.ts`, about 198 files of code and tests. There is no other language's source in the packages.
- **Compiler:** `tsconfig.json` and `tsconfig.shared.json` build the code with `strict: true` and `NodeNext` modules. The root `package.json` has `"build": "tsc -b"` and `"typescript": "^7.0.0"`.
- **CI:** `.github/workflows/CI.yml` and `commitlint.yml` run `pnpm build`, which is `tsc -b`, on a Node matrix.
- **History:** the project keeps TypeScript current (#4722 to v6, #4886 to v7). Recent fixes also target TypeScript-specific behaviour, such as #5052 and #4914 on loading TypeScript config files.
- **JavaScript files:** about 28 `.js`/`.cjs` files sit outside `src/`. They are thin `cli.js` and `index.cjs` entry points, the `config-*` presets, and the `@packages/utils` check scripts. They are secondary and don't change the answer, as the ADR's Neutral consequence says.

**Compared with the recommendation**
- **Value:** TypeScript is one of the two recommended languages, so the value itself departs from nothing.
- **Tie-break:** the ADR suggests TypeScript when code runs in a browser or is shared between browser and server, and Python for scripts and services that do neither. commitlint does neither: it is a Node.js CLI and library. Read literally, that rule would point to Python. I'd still choose TypeScript, for two reasons:
  - The product is a set of npm packages. Users write their `commitlint.config.{js,ts}` files and plugins as JS/TS modules that Node loads in the same process. That is the "ecosystem the repository depends on" the ADR allows for.
  - The whole codebase, toolchain and CI are already TypeScript. Switching would mean rewriting the project.
- **Conditions:** the only conditional in the ADR is that tie-break. It is settled by the absence of any browser target: `lib: ["es2022"]` and `types: ["node"]` in `tsconfig.shared.json`. The VitePress docs site is documentation, not shared product code.
- **Rejection:** I see no case for `rejected`. This is a code repository with a clear main language.

**What I'd write once you agree**
- **Frontmatter:** `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, and `traits.languages.main.name: TypeScript`.
- **How-to-rule block:** replaced by the reason above for not following the browser/server tie-break.
- **Consequences:** rewritten for this verdict.
- **AGENTS.md:** updated by running `npx ontrack apply`.

Do you agree with this ruling, or would you change the value or the reason? I won't write anything until you confirm.

For the follow-up step: other ADRs are still `proposed`, and no `tracking` trait is decided yet, so I can't list a tracker's items or create any yet. Whatever this ruling leaves unfollowed will go in my reply as a list.
=================== conventional-changelog__commitlint ADR-0006
Now the repository's current state.

I'm done reading; here is the proposed ruling.

## What the repository does today

- **Versions come from commit messages.** `package.json` has `"publish": "npm whoami && lerna publish --conventional-commits"`, and `lerna.json` holds one shared version (`21.2.4`). That is the condition the recommendation depends on, so `commitlint` applies.
- **commitlint already runs in two places.** In CI, `.github/workflows/commitlint.yml` checks every PR's commits (`--from base.sha --to head.sha`) and the last commit on each push to `master`. Locally, `.husky/commit-msg` runs it on every commit. The config is the `commitlint` key in `package.json`, which extends `@commitlint/config-conventional` and `@commitlint/config-workspace-scopes`.
- **Scopes are meant to be package names, but nothing enforces them.** `config-workspace-scopes` reads the `workspaces` field of `package.json` (`@commitlint/config-workspace-scopes/index.js:22-26`). That field doesn't exist here, because pnpm lists its packages in `pnpm-workspace.yaml`. So the scope list comes back empty, and an empty `scope-enum` lets any scope through (`@commitlint/rules/src/scope-enum.ts:14`).
- **History shows scopes drifting** across the last 2000 commits. Most use package scopes (`load` 12, `rules` 14, `cli` 9, `cz-commitlint` 7…). Some don't: `fix(@commitlint/load)`, `fix(utils)`, `fix(docs)`, `feat(container)` (3), and the older `build(deps)` (25) and `chore(deps)` (7). Renovate now sets `semanticCommitScope: null`, and AGENTS.md says dependency updates are plain `chore`.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `commitlint` | It matches the recommendation and its condition holds (`lerna publish --conventional-commits`). It already runs in CI (`commitlint.yml`) and as a husky hook. |
| `commits.scopes` | The workspace package names without the npm scope prefix, plus `container` (full list below) | The package names are what the `config-workspace-scopes` config was set up to allow, and history uses them. `container` covers `Dockerfile.ci` and `container-build.yml` and appears in 3 commits. |

The scope list:

`cli, config-angular, config-angular-type-enum, config-conventional, config-lerna-scopes, config-nx-scopes, config-patternplate, config-pnpm-scopes, config-rush-scopes, config-validator, config-workspace-scopes, core, cz-commitlint, ensure, execute-rule, format, is-ignored, lint, load, message, parse, prompt, prompt-cli, read, resolve-extends, rules, to-lines, top-level, travis-cli, types, test, utils, vitest-environment-commitlint, commitlint, commitlint-config-angular, commitlint-config-lerna-scopes, commitlint-config-nx-scopes, commitlint-config-patternplate, container`

I left some scopes out on purpose:
- **`deps`:** Renovate commits without a scope, and AGENTS.md makes dependency updates `chore`.
- **`docs`:** it is already a type.
- **`@commitlint/load`:** a misspelling of `load`.

**Departures from the recommendation:** none for `tool`. The ADR gives no recommendation for `scopes`, so the reason in the ADR will point to the repository's own `config-workspace-scopes` setup.

**Gaps between this ruling and the repository**, for the tracking step once every ADR is ruled:
- Scopes aren't enforced. The likely fix is to swap to `@commitlint/config-pnpm-scopes` or list the scopes explicitly.
- `@commitlint/cli` isn't a root dev dependency, and the ontrack check requires it to be one.
- The ontrack check compares against `origin/HEAD`. If CI has no `origin/HEAD`, the `check:` line may need `--from origin/master`.

I can't do the tracking-item step yet: the other 24 ADRs are still `proposed`, and no `tracking` trait is decided.

**Do you agree?** You can accept as proposed, or change it: drop the `@alias/*` and `@packages/*` names (`test`, `utils`, `vitest-environment-commitlint`, `commitlint`, `commitlint-config-*`), add `deps`, or switch the tool to `hook`. Once you agree, I'll write the ADR with `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite its Consequences, and run `npx ontrack apply`. Until then, nothing is written.
=================== conventional-changelog__commitlint ADR-0009
Still gathering evidence: checking which master commits landed without a pull request.

I'm proposing **`accepted`** for ADR-0009 (Branching). I've written nothing yet; this needs your go-ahead.

### What the repository does today

- **Where work happens:** the default branch is `master` (`origin/HEAD -> origin/master`). Changes come in as one short branch per change, then a pull request through GitHub's merge queue. `CI.yml` runs on `merge_group` and skips `gh-readonly-queue/**`. `.github/CONTRIBUTING.md:32` asks contributors to rebase onto master before opening a PR.
- **How branches are merged:** they are squashed. AGENTS.md says "The merge queue squashes". Every one of the last 40 commits on master ends in `(#NNNN)`, and the first-parent history of master has only three merge commits ever, all from the early years.
- **Direct pushes to master:** there are some. In the past year, 25 commits on master have no PR number. They are all by one maintainer: 19 version-bump commits (`v20.2.0` … `v21.2.4`) and 6 small `chore:`/`docs:` commits. Nothing in the repository blocks direct pushes, which the ADR already says is a forge setting.
- **How branches are named:** always `prefix/kebab-description`, with no written rule anywhere. The prefixes in use (by date of last commit):
  - in the past year: `chore/`, `ci/`, `docs/`, `feat/`, `fix/` and `test/`;
  - only on stale branches: `refactor/` (2019 and 2023);
  - from bots: `renovate/` and `copilot/`.
  - Other names: `release-v18` (2024) and the maintenance lines `8.x`–`15.x`, untouched since 2020–2021.
- **Things that don't exist:** there is no gitflow (no `develop` or `hotfix` branches), no feature flags, and no release-please or Dependabot config.

### Proposed ruling

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | One PR per change through the merge queue (`CI.yml:7-16`, PR numbers on every non-release commit). The old `N.x` branches are frozen, not a gitflow `release`/`develop` cycle. |
| `branching.merge` | `squash` | AGENTS.md: "The merge queue squashes, so the pull request title becomes the commit on master". The history matches. |
| `branching.prefixes` | `[feat, fix, perf, refactor, docs, test, ci, build, chore]` | These are exactly the commit types AGENTS.md defines for this repository. They cover every human prefix seen on remote branches. |

### Departures from the recommendation

1. **The prefix list is wider than `[feat, fix, docs]`.** The recommended list would fail the branch check on active branches such as `ci/stock-ubuntu-job-timeout` (2026-11-10), `test/numeric-reference-fixture` and the `chore/*` branches. The wider list still uses only names from the eleven commit types (no `style`, no `revert`), and it lets a branch name match the commit type that AGENTS.md asks to "settle before the first commit".

That is the only departure. `model` and `merge` match the recommendation.

### Things to know before you decide

- **Bot branches may fail the check.** It exempts `renovate/` only once ADR-0018 is ruled with Renovate. `copilot/` is never exempt, so a Copilot-opened branch would fail it.
- **Release commits go straight to master.** github-flow still describes the repository, but those pushes are an exception the ADR doesn't cover. The `ci/release-pr-workflow` branch suggests a move to release PRs is under way, which ADR-0012 (Delivery) would settle.
- **Squashing undoes the two-commit TDD history.** `CONTRIBUTING.md:33` asks for a failing-test commit, then the implementation. Squashing merges the two, so they only survive in the closed pull request.

**Do you agree with this ruling?** You can say "agree" to apply it as proposed, change the prefix list (for example, keep only the six prefixes used recently, or the recommended `[feat, fix, docs]`), or choose another value for `model` or `merge`. Also tell me the name to put under `authors:`. If you agree, I'll fill the `traits:` keys, set `status: accepted` and `date: 2026-11-15`, rewrite the Consequences, replace the how-to-rule block with the reason for the prefix list, and run `npx ontrack apply`.
=================== conventional-changelog__commitlint ADR-0011
I couldn't read the live ruleset, so the gate value rests on repository evidence. Here is the proposed ruling. Nothing has been written yet.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/conventional-changelog/commitlint`). There are 5 workflows in `.github/workflows/`, so `rejected` (another forge) and `none` (no pipeline) don't apply.
- **Gate:** I couldn't read the ruleset because the `gh api …/rules/branches/master` call wasn't approved. The repository still shows that checks block merges:
  - `CI.yml:13-16` listens to `merge_group`, with the comment *"Runs the required checks on the exact merge result the merge queue is about to land on master"*.
  - `CI.yml:5-8` leaves out `gh-readonly-queue/**`.
  - AGENTS.md says *"The merge queue squashes"*.
  - The only job built to report without blocking is `audit.yml`, which runs on a schedule with `continue-on-error: true` and is labelled *"no PRs are gated by this run"*. So the project already tells blocking checks apart from reporting ones.
- **Workflow audit:** nothing reads the workflows. No zizmor, actionlint or CodeQL `actions` run anywhere in the repo (`git grep` finds nothing), and there's no `zizmor.yml`. actionlint is installed on this machine, but nothing in the repository uses it. Renovate (`package.json` `renovate`, `config:recommended`) keeps the action versions current, but that isn't an audit.

## Where the workflows break the five rules today

Accepting the ADR doesn't change any of these. They'll show up as follow-up items, not as departures:

- **Rule 3 (pin by SHA):**
  - Only the `docker/*` actions in `container-build.yml` are pinned.
  - `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5` and `actions/deploy-pages@v5` all use movable tags, in every workflow.
  - The `ubuntu:26.04` container image (`CI.yml`) and `runs-on: ubuntu-latest` aren't pinned by digest.
- **Rule 1 (deploy only from the default branch):**
  - `container-build.yml` runs with `push: true` on `pull_request` (paths `Dockerfile.ci`) and on tags. A branch pull request inside the same repo would push an image.
  - In `docs-deploy.yml`, the `deploy` job's `if:` only checks the repository, not the branch. `workflow_dispatch` can deploy from any branch unless the `docs` environment is protected, and that's a GitHub setting I can't see.
- **What zizmor would likely flag (my estimate; zizmor isn't installed, so I didn't run it):**
  - `unpinned-uses` on the tags above.
  - `artipacked`: no checkout sets `persist-credentials: false`.
  - `excessive-permissions`: `CI.yml` and `container-build.yml` have no `permissions:` block.
  - Possibly `template-injection` on `${{ github.event.pull_request.*.sha }}` in `commitlint.yml`'s `run:`.
- **Rules 2, 4 and 5 look fine:**
  - The Docker Hub credentials are repository secrets.
  - Nothing echoes a secret.
  - There's no `pull_request_target`, and pull requests from forks get no secrets (CI skips them on `pull_request` and runs on push in the fork instead).

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | The merge queue and its "required checks" (`CI.yml:13-16`, AGENTS.md). Matches the recommendation. You'll need to confirm the master ruleset really requires the CI checks, since I couldn't read it. |
| `forge.audit` | `zizmor` | Nothing reads the workflows today, and rule 1 and rule 3 are both broken. Matches the recommendation. |

- **Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.
- **Frontmatter:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]`. I'll also rewrite the Consequences to say, for example, that the movable tags have to be pinned before `ontrack check` passes.
- **No `forge.review` key** exists, so revision 4 has nothing to clean up.

I don't have a question tool in this session, so I'm asking here:

1. **Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`?** Once you say yes, I'll edit only `ADR-0011` and run `npx ontrack apply`.
2. **Should I check the gate against the live master ruleset first?** That means approving the read-only `gh api repos/conventional-changelog/commitlint/rules/branches/master` call.
=================== conventional-changelog__commitlint ADR-0023
I'm checking whether the ontrack checker is installed and how it matches licence file names.

I've finished reviewing ADR-0023 (License). My proposal is `accepted` with `license.spdx: MIT`, which is the ADR's own recommendation and what the repository already uses.

## What the repository does today

- **Root licence file:** `license.md` holds the full MIT text, with the line "Copyright (c) 2016 - present Mario Nebl". It has been there since `83314bb7` (2016-02-14) and was last changed in `2961c538` (2018) to "extend copyright notice to present".
- **Root manifest:** `package.json:18` has `"license": "MIT"`. It also has `"private": true` (line 4), and `author` is Mario Nebl.
- **Packages:** all 38 workspace `package.json` files under `@alias/`, `@commitlint/` and `@packages/` declare `"license": "MIT"`. Most also have their own `license.md`. Three don't: `@commitlint/config-validator`, `@commitlint/types` and `@packages/test-environment`.
- **No Python:** there is no `pyproject.toml`.
- **No checker:** the `check:` command (`ontrack-engineering-check`) isn't installed. `package.json` lists `@trivoallan/ontrack-engineering@0.6.0` as a dependency, but that change isn't committed and `node_modules/trivoallan` doesn't exist. So I couldn't run the check; everything above comes from reading the files.

## Compared with the recommendation

| Point | ADR | Repository | Difference |
|---|---|---|---|
| `license.spdx` | `MIT` | `MIT` everywhere | None |
| 1. The root manifest declares the licence | `"license"` in `package.json` | `"license": "MIT"` | None |
| 2. A licence file sits at the root | `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING` | `license.md`, all lowercase | Case only. It's fine on macOS, but a case-sensitive check on Linux CI may not find it. |
| 3. Copyright holder | The organisation that owns the repo (`conventional-changelog`), or else the ADR's `authors:` | Mario Nebl, the original author | The holder differs |

I don't recommend changing the copyright holder. Rule 3 is about who to name when the file is written, and this file was written in 2016. Copyright belongs to whoever wrote the code, and an agent can't reassign it by editing a line. I'd record this departure in the ADR rather than touch `license.md`.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`:** `MIT`. Evidence: `license.md`, `package.json:18`, and all 38 workspace manifests.
- **Departures from the recommendation:**
  1. **Copyright holder stays Mario Nebl.** The 2016 notice predates this ADR, and the copyright isn't the org's to claim.
  2. **The root file stays `license.md` (lowercase).** Each package's `license.md` copies the same name, and renaming them all would be churn for no legal gain. If the check turns out to be case-sensitive, this becomes an item to rename the root file to `LICENSE.md`.
- **Not in the ADR's scope:** the three packages without their own `license.md`. The check doesn't read subfolders, and npm ships the root licence for them anyway.
- **date:** 2026-11-15
- **authors:** `[Tristan Rivoallan]`, if you're the one ruling.
- **Consequences:** I'll rewrite them for MIT as already in place.

Do you agree with this ruling? Please also confirm or correct `authors:` and tell me whether to keep `license.md` or rename it to `LICENSE.md`. I'll write nothing until you answer.

After that, the follow-up list will come once every ADR is ruled. `tracking` isn't decided yet (ADR-0014 is still proposed), so for now that list would only be given in my reply and nothing would be created in a tracker.
=================== conventional-changelog__commitlint ADR-0025
Still gathering evidence: next I'm checking how the contributor guide uses mise and which tools the related ADRs would name.

# ADR-0025 (Tools outside the package manager): proposed ruling

I recommend accepting it with `tools.manager: mise`. The repository already uses mise for contributors and Renovate for updates. Today, though, no accepted ADR names a tool yet, so whether mise is the right answer depends on how ADR-0015 and ADR-0011 are ruled.

## What the repository does today

- **No accepted ADR names a tool outside the package manager yet.** Only ADR-0001 is `accepted`; ADR-0015 (secrets) and ADR-0011 (forge and CI) are still `proposed`. If they are accepted as recommended, they would name two tools: `gitleaks` for ADR-0015 and `zizmor` for ADR-0011.
- **Nothing installs such a tool now.** No hook, workflow or script installs gitleaks, zizmor or actionlint, and none falls back to `brew install`:
  - The Husky hooks (`.husky/commit-msg`, `.husky/pre-commit`) only call `node` and `pnpm`.
  - Every workflow in `.github/workflows/` uses `pnpm/action-setup` and `actions/setup-node`.
  - `scripts/` only holds `check-no-focused-tests.js`.
- **mise is already set up, but only on workstations.**
  - `.mise.toml` exists with `node = "22"` and `pnpm = "12"`. Both are floating majors with no checksum.
  - There is no `mise.lock` and no `lockfile = true`.
  - `.github/CONTRIBUTING.md:85,150,177` tells contributors to run `mise install` for development and for publishing releases.
  - The file has been kept up to date in its history (commits a9e03d8e and 43639e8d).
- **CI does not use mise.** There is no `jdx/mise-action`, no `MISE_VERSION`, and no setup for agent sessions.
- **Renovate keeps dependencies current, not Dependabot.** There is a `renovate` block in `package.json` with `extends: ["config:recommended"]`, and there is no `.github/dependabot.yml`. Renovate's `mise` manager is turned on by default under `config:recommended`.
- **Pins by checksum that already exist are out of scope.** `Dockerfile.ci` checks pnpm against the sha512 in `packageManager`, but that is the package manager and the runtime, which ADR-0004 covers.

## The condition in the recommendation

The recommendation depends on how many tools there are: `script` for one, `mise` or `aqua` for several, and `none` only when no accepted ADR names a tool.

- **Today:** zero tools are named, so `none` would be a valid answer right now.
- **If ADR-0015 and ADR-0011 are accepted as recommended:** there would be two tools (gitleaks and zizmor), which points to `mise` or `aqua`.

## Proposed ruling

- **status:** `accepted`. The question applies here: the repository has hooks, CI and a workstation setup, and two pending ADRs would each name a tool. Nothing supports `rejected`.
- **`tools.manager: mise`**
  - Evidence: `.mise.toml` exists, `CONTRIBUTING.md` already asks for `mise install`, and Renovate (in `package.json`) is the updater, which has a `mise` manager that also updates `mise.lock`.
  - Choosing `aqua` or `script` would add a second mechanism next to the one contributors already use.
- **date / authors:** `2026-11-15` / `[Tristan Rivoallan]`, taken from the git user.
- **Who keeps the pins current (rule 4):** Renovate's `mise` manager, which already runs through `config:recommended`. It changes `mise.toml` and `mise.lock` in the same pull request, so a checksum moves with its version. A person reviews the `mise.lock` diff as they would a lockfile's.

**The one departure from the recommendation:** today no accepted ADR names a tool, so the recommendation literally points to `none`. I'd rule `mise` because:
- mise is already the documented setup for workstations;
- `none` would have to be ruled again as soon as ADR-0015 or ADR-0011 names gitleaks or zizmor.

If you would rather rule only on what is accepted today, the alternative is `none`, to be ruled again once those ADRs are accepted.

**Gaps the repository will have under this ruling.** These are for the tracking step at the end, not departures:
- no `mise.lock` and no `lockfile = true`;
- CI does not install through mise, and mise's own version is not pinned;
- no hook or agent-session setup calls mise.

**Do you agree with `accepted` and `tools.manager: mise`?** Or would you prefer `none` for now, or `script` or `aqua`? I won't write anything until you decide.
