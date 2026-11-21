# conventional-changelog__commitlint

## ADR-0002

Now the repository evidence.

I've read the ADR and looked at what the repository does today. My proposal is to accept it with the recommendation as written: `default: english` and no overrides. The repository already works in English everywhere, so the ruling would make no difference to how it works.

### What the repository does today
- **Documentation**: the `docs/` site, `README.md` and `.github/CONTRIBUTING.md` are all in English. `docs/.vitepress/config.ts` sets no locales or `lang`, so the site has one language. There is no translated documentation.
- **Commits**: 3,614 commit subjects, all Conventional Commits in English. A search for French words found two hits, and both are the English word "correction" ("docs: English syntax correction (#3380)", "fix: correction to need help link (#540)").
- **Code and comments**: outside `docs/adr/`, changelogs and the lockfile, accented letters appear only as test data. That's `@commitlint/ensure/src/to-case.test.ts:52-53,87-89` ("über", "naïve-bayes") and `@commitlint/rules/src/scope-delimiter-style.test.ts:10` ("café"), which test Unicode handling. They aren't names or comments in another language.
- **What's missing**: no file says English is required. `CONTRIBUTING.md` and `AGENTS.md` never mention a language. The practice is consistent, but nothing writes it down.

### Comparison with the recommendation
The recommendation is `default: english` with no overrides, which is exactly what the repository does. There are no differences and no conditions in the recommendation to check. Rejecting it isn't justified: the repository has documentation, commits, code and comments, so the question applies.

### Proposed ruling: `accepted`
| Trait key | Value | Mark | Evidence |
|---|---|---|---|
| `localization.language.default` | `english` | observed | English docs with no extra locales in `docs/.vitepress/config.ts`; all 3,614 commits in English; English names and comments throughout `@commitlint/*` |
| `localization.language.documentation` | *(empty, same as default)* | observed | `docs/`, `README.md` and `CONTRIBUTING.md` are English |
| `localization.language.commits` | *(empty, same as default)* | observed | `git log`: all subjects are English Conventional Commits |
| `localization.language.code` | *(empty, same as default)* | observed | English symbols across `@commitlint/*/src` |
| `localization.language.comments` | *(empty, same as default)* | observed | English comments; the only accented letters are Unicode test data |

**Departures from the recommendation:** none. Following the ADR's own "How to rule" steps, I would also:
- set `date: 2026-11-15`;
- set `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists. The current ones are about a French-speaking team, which doesn't fit this repository.
- replace the instruction block with one line saying the recommendation is adopted as is.

Do you agree with this ruling? Two things to confirm:
- Is `Tristan Rivoallan` (your git user name) the right entry for `authors:`?
- Once I've written it, I'll run `npx ontrack apply` to update AGENTS.md. Is that OK?

Nothing has been written yet.

## ADR-0004

Now the repository evidence.

## ADR-0004 (Languages): proposed ruling

**What the repository does today.** TypeScript is the main language, and has been since 2019:

- **Packages:** there are 213 tracked `.ts` files and 171 `.js/.mjs/.cjs` files. Every core package (`cli`, `core`, `lint`, `load`, `parse`, `rules`, `types`, …) has a `tsconfig.json`, 24 packages in all plus the root `tsconfig.json` and `tsconfig.shared.json`. The shared config was added in `c9ef5e2c` (2019-07-09, "centralize typescript and jest setups").
- **Build:** `package.json` runs `"build": "tsc -b"`, with `typescript ^7.0.0` in devDependencies.
- **CI:** `.github/workflows/CI.yml:57` and `:149` run `pnpm build`, so CI compiles the TypeScript.
- **JavaScript:** almost all of it is test fixtures (`*/fixtures/**/commitlint.config.js`), `@alias/*` shims, small config packages (`config-angular`, `config-lerna-scopes`, `config-nx-scopes`, …), CLI entry points (`cli.js`, `index.cjs`) and two scripts in `@packages/utils`. The ADR's Neutral section says secondary languages like these don't change the answer.

**Comparison with the recommendation.** The value I propose, `TypeScript`, is on the ADR's recommended list, so it needs no justification. One condition doesn't match, though. The ADR says "TypeScript when the repository runs in a browser or shares code between browser and server; Python for scripts… and services that do neither". commitlint runs on Node only (`engines.node >=22.12.0`), and no package declares a `browser` field (I searched every `@commitlint/*/package.json`). Read literally, that rule points to Python. Python doesn't fit here because of the case the ADR allows itself: "an ecosystem the repository depends on". commitlint ships as npm packages and loads user configs written in JS/TS (`commitlint.config.js`). It's also a seven-year-old TypeScript codebase.

**Proposed ruling**

- **Status:** `accepted`
- **`languages.main.name`:** `TypeScript`. **Observed**: 24 package `tsconfig.json` files, `tsc -b` in `package.json`, and `pnpm build` in `CI.yml`.
- **Departure:** the browser/server condition isn't met. TypeScript is kept because the repository is a Node tool published to npm and reads JS/TS configs (the ecosystem case the ADR names). I'd write that reason into the ADR.
- **`rejected`:** not proposed. The repository clearly has a main language.

When we write it, I would also fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences lists, and delete the "How to rule" block, as the ADR asks.

**Not followed yet.** None for this ruling: the repository already writes its code in TypeScript. I didn't check a tracker: AGENTS.md lists Work tracking (ADR-0014) under "Not yet decided", so there is no `tracking` trait and I would create no tracking items.

I haven't written anything yet. Do you agree with this ruling: `accepted`, `TypeScript`, with the departure recorded? If you agree, I'll update the ADR and run `npx ontrack apply`. Otherwise, tell me what to change.

## ADR-0006

I'm reading the contributor guide's commit and release sections. The scope check is answered from source: the CLI isn't built here, so I won't run it.

## ADR-0006 (Commits): proposed ruling

### What the repository does today

- **Format is enforced.** The root `package.json` has `"commitlint": { "extends": ["@commitlint/config-conventional", "@commitlint/config-workspace-scopes"] }`.
  - CI runs it: `.github/workflows/commitlint.yml` lints every commit in a pull request (`--from base.sha --to head.sha`) and the last commit on each push to `master`.
  - Locally, the `.husky/commit-msg` hook runs `cli.js --edit $1`.
- **Versions come from commit messages.** This settles the condition attached to the recommended tool.
  - `package.json`: `"publish": "npm whoami && lerna publish --conventional-commits"`.
  - `.github/CONTRIBUTING.md:185` uses the same flag for `next` releases.
  - `lerna.json` sets a fixed `version: 21.2.4`.
- **Scopes are not enforced, though the config looks like it enforces them.**
  - `config-workspace-scopes` reads `package.json#workspaces`, and that field is `null` here: pnpm declares its workspaces in `pnpm-workspace.yaml`.
  - So `getPackages` returns `[]`. With an empty list, `scope-enum` passes any scope (`@commitlint/rules/src/scope-enum.ts:14`: `if (!scope || !scopes.length) return [true, ""]`).
  - I found this by reading the code. I couldn't run the CLI because it isn't built here (no `@commitlint/cli/lib`).
- **History mostly follows package names anyway.** In the last 2000 subjects, the common scopes are `load` (19), `rules` (14), `cli` (10), `cz-commitlint`, `config-nx-scopes`, `types`, `lint` and so on.
  - The scopes have drifted in the way the ADR describes: `deps` (32), `container` (5), `README.md`, `readme`, `GitHubCI`, `.husky`, `@commitlint/load` next to `load`, and `api/lint`.
  - 131 of the 2000 subjects don't match the Conventional Commits pattern at all.
  - Renovate commits currently use `chore:` with no scope.

### Proposed ruling: `accepted`

| Trait | Value | Today | Evidence |
| --- | --- | --- | --- |
| `commits.tool` | `commitlint` | **observed** | `commitlint.yml` runs on pull requests and pushes to master; the husky `commit-msg` hook runs it too |
| `commits.scopes` | the 30 directory names under `@commitlint/` (list below) | **absent** | History mostly uses these names, but nothing enforces them: the scope list resolves to `[]` |

The proposed scopes are `cli, config-angular, config-angular-type-enum, config-conventional, config-lerna-scopes, config-nx-scopes, config-patternplate, config-pnpm-scopes, config-rush-scopes, config-validator, config-workspace-scopes, core, cz-commitlint, ensure, execute-rule, format, is-ignored, lint, load, message, parse, prompt, prompt-cli, read, resolve-extends, rules, to-lines, top-level, travis-cli, types`. These are the published packages, which is what the existing `config-workspace-scopes` setting is meant to produce.

### Differences from the recommendation

- **`commits.tool`:** none. The condition holds, so `commitlint` is the recommended value.
- **`commits.scopes`:** the ADR recommends no value, so this list is a proposal rather than a departure.
- **Left out of the list on purpose:**
  - The `@alias/*` and `@packages/*` packages. They are rarely given as scopes, and `test` would clash with the `test` type.
  - The old `deps` and `container` scopes. Renovate no longer uses `deps`. `container` (`Dockerfile.ci`, `container-build.yml`) could be added if you want to filter on it.

### Notes for later
- The `ontrack check` for this ADR needs `@commitlint/cli` and `@commitlint/config-conventional` as dev dependencies.
  - The root has `config-conventional` (`workspace:^`) but not `@commitlint/cli`.
  - The check also compares against `origin/HEAD`. I couldn't confirm that exists in CI, because the git command needed approval.
  - Both would go in the follow-up list.

I don't have a question tool, so I'm asking here. **Do you agree with this ruling?** Reply with one of:

1. **Agree as proposed:** `accepted`, `tool: commitlint`, the 30 `@commitlint/*` scopes.
2. **Agree, but change the scope list:** for example add `container` or `deps`, or include the `@alias` and `@packages` names.
3. **Something else:** a different tool, `scopes: []`, or `rejected`.

For the ADR's `authors:` field, I'd put "Tristan Rivoallan" unless you name other people. I won't write anything until you reply.

## ADR-0009

Now the repository's current practice: contributing guide, workflows, branch names, merge history.

I'm comparing the repo's branch and merge practice with the ADR. Next I'll check whether the ADR's check tool is installed.

## ADR-0009 (Branching): my proposed ruling

### What the repository does today

- **How work reaches `master`:** almost entirely through one pull request per change. Of the last 300 commits on `master`, all but five end in `(#NNNN)`, which is the mark of a squashed pull request. The five that don't are lerna release commits (`v21.2.4`, `v21.2.3` and so on). The maintainer creates those with `pnpm run publish` and pushes them straight to `master`, as `.github/CONTRIBUTING.md` ("Publishing a release") describes.
- **Merge queue:** `.github/workflows/CI.yml` listens for `merge_group` and skips `gh-readonly-queue/**`. AGENTS.md says "The merge queue squashes, so the pull request title becomes the commit on master."
- **Merge commits:** there are only three in the whole history (`Merge pull request #15`, `#31` and `Merge branch 'release/7.6'`), and all three are very old.
- **Long-lived branches:** `origin/8.x`, `9.x`, `10.x`, `11.x`, `12.x`, `15.x` and `release-v18` are old maintenance lines. CONTRIBUTING mentions publishing from a `release-vXX` branch with a dist-tag. That is an occasional exception, not a gitflow `develop` branch.
- **Branch names in use** (from the remote branches; I couldn't list pull request head branches with `gh` because that call wasn't approved):
  - `chore/` ×10, `ci/` ×3, `docs/` ×3, `fix/` ×2, `refactor/` ×2, `test/` ×2, `feat/` ×1
  - `renovate/` ×6, from the Renovate bot
  - `copilot/` ×1, `release-v18`, and the `N.x` branches
- **Written rules:** nothing documents a branch naming rule, and nothing in CI checks branch names.

### Proposed ruling: `accepted`

| Key | Value | Observed or absent | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | observed | One squashed pull request per change on `master`; merge queue in `CI.yml` |
| `branching.merge` | `squash` | observed | AGENTS.md "merge queue squashes"; no merge commit in recent history |
| `branching.prefixes` | `[feat, fix, perf, refactor, docs, test, ci, build, chore]` | 7 of the 9 observed; `perf` and `build` absent as branch prefixes | Remote branches listed above; the list is the commit types AGENTS.md already defines |

### Where this departs from the recommendation

1. **The prefixes go beyond `[feat, fix, docs]`.** `chore/` is the most common branch prefix here, and AGENTS.md classes dependency updates as `chore`. `ci/`, `refactor/` and `test/` are in regular use too. With only three prefixes, the check would fail on most branches maintainers open. I used the nine types AGENTS.md already lists, so a branch prefix always matches the commit type settled before the first commit. `style` and `revert` are left out because AGENTS.md doesn't list them.
2. **Release commits break github-flow.** The lerna `vX.Y.Z` commit is pushed straight to `master`. The ADR can say that release mechanics belong to ADR-0012 (Delivery) and are a known exception until that ADR is ruled.

**Caveat:** ADR-0012 and ADR-0018 (Dependencies) are still `proposed`. Until they are ruled, the check will not exempt `renovate/` branches, so Renovate pull requests would fail it if it ran in CI. Today it doesn't run there, so nothing breaks yet.

### Rulings this repository would not follow yet

The work-tracking ADR (ADR-0014) hasn't been ruled, so there is no tracker to file items in. Here is the list instead; I'll create nothing:

- `[trivoallan/ADR-0009] branching.prefixes`: the `copilot/…` and `release-v18` branch names don't match `<prefix>/<kebab-case>`, and `renovate/…` only passes once ADR-0018 rules Renovate. No CI job runs `ontrack check` on branch names.
- `[trivoallan/ADR-0009] branching.model`: release commits are pushed straight to `master` rather than going through a pull request.

Do you agree with this ruling? Or would you change something, such as keeping the recommended `[feat, fix, docs]`? I'll write nothing until you answer. Once you agree, I'll need the name to put in `authors:`.

## ADR-0011

Still reviewing ADR-0011. I've read all five workflows. I can't query GitHub rulesets without your approval, so I'm working from the files.

# Proposed ruling for ADR-0011 (Forge and continuous integration)

**Status: `accepted`.** The forge is GitHub: the remote is `github.com/conventional-changelog/commitlint` and there are 5 workflows in `.github/workflows/`. So `rejected`, which this ADR reserves for other forges, doesn't apply.

| Key | Proposed | Marked | Evidence |
|---|---|---|---|
| `forge.gate` | `blocking` | **observed** | `CI.yml:13-16` listens to `merge_group` and calls itself "the required checks" that run before code lands on master. Commit `c907b507` added that merge-queue support, and `AGENTS.md` says the merge queue squashes. A merge queue only waits on checks that a ruleset requires. I couldn't read the ruleset itself: the `gh api …/rules/branches/master` call needs your approval, and the ADR's check doesn't read it either. |
| `forge.audit` | `zizmor` | **absent** | Nothing reads the workflows today. No file outside `docs/adr/` mentions zizmor, there's no actionlint, and `.mise.toml` lists only node and pnpm. `audit.yml` is a weekly `pnpm audit` of dependencies, not of workflows. |

**Departures from the recommendation: none.** Both values match it.

## What the repository does today on this question

- **Some jobs are outside the gate on purpose.** `audit.yml` has `continue-on-error: true` and runs only on a schedule. That is a dependency scan (ADR-0019), not part of `forge.gate`.
- **`commitlint.yml` doesn't run in the merge queue.** It has no `merge_group` trigger, so it probably isn't one of the required checks. If it is, the queue would wait for it forever. So the commit-message check reports but doesn't block.
- **The workflows already break rules that apply whatever you rule.** Accepting `zizmor` would turn the first four of these into CI failures:
  - **Rule 3 (pinning):**
    - 9 kinds of action are referenced by a movable tag: `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6`, and the `configure-pages`, `upload-pages-artifact` and `deploy-pages` actions.
    - The container image is `ubuntu:26.04`, a tag rather than a digest.
    - Only the `docker/*` actions in `container-build.yml` are pinned by SHA.
  - **Template injection:** `commitlint.yml:50` puts `${{ github.event.pull_request.base.sha }}` straight into `run:`. It's a SHA, so the risk is low, but zizmor will flag it.
  - **Permissions:** `CI.yml` and `container-build.yml` set no `permissions:` block, so their jobs get the default token rights.
  - **Credentials kept after checkout:** no `actions/checkout` sets `persist-credentials: false`.
  - **Rule 1 (deploy from the default branch only):** `container-build.yml` pushes to Docker Hub with `push: true` on every tag, every night, and on any pull request that touches `Dockerfile.ci`. A pull request from a branch in this repository therefore publishes an image with the Docker Hub secrets. Pull requests from forks get no secrets. The image is not bound to master.
- **Rules 2 and 5 pass.**
  - Secrets live in repository secrets.
  - `docs-deploy.yml` deploys from master only, through the `docs` environment.
  - No workflow uses `pull_request_target`.

## What accepting would write

- In the ADR's frontmatter: `gate: blocking`, `audit: zizmor`, `status: accepted`, `date: 2026-11-15`, and `authors: [Tristan Rivoallan]`.
- The Consequences section rewritten for this repository.
- The "How to rule" block replaced by one line saying the recommendation is adopted as is.
- Then I run `npx ontrack apply` to update `AGENTS.md`.

The gaps above, such as the zizmor job, SHA pins, permissions and the Docker push from branches, would go in the follow-up list rather than into this ADR.

**Do you agree with this ruling?** You can accept it as is, change a value (for example `forge.gate: informative`, or `forge.audit: none`), or approve the `gh api` call first so I can confirm the master ruleset really requires the CI checks.

## ADR-0023

I've read the ADR and the repository's licence files. One last check: who owns the repository, since the ADR says that's who holds the copyright.

# ADR-0023 (License): proposed ruling

**Status: `accepted`, `license.spdx: MIT` (observed).** The repository already uses MIT everywhere. The ruling adopts the recommendation and writes down what the repository already does.

## What the repository does today
- **Licence file:** `license.md` at the root holds the full MIT text: "Copyright (c) 2016 - present Mario Nebl". It was last changed in `2961c538` (2018-09-05). Every published package also ships its own `license.md`.
- **Manifests:** the root `package.json` has `"license": "MIT"` on line 18, though the package is `"private": true`. All 38 workspace manifests under `@commitlint/`, `@alias/` and `@packages/` also say `MIT`. There is no `pyproject.toml`.
- **README.md:184:** "All `commitlint` packages are released under the MIT license."
- **CI:** nothing checks the licence today.

## Differences from the recommendation
1. **Value:** none. The recommendation is MIT and the repository is MIT.
2. **Licence file name: the check will fail.** The root file is `license.md` in lowercase. The check compares names exactly against `['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'COPYING']`, using the git-tracked file list (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822,870`). Once the ADR is accepted, `ontrack check` will report "no tracked LICENSE…". The fix is to rename the file to `LICENSE.md`. That touches another part of the repository, so I'm listing it as a follow-up item rather than doing it as part of this ruling.
3. **Copyright holder: I propose departing from the ADR here.** The ADR says the holder is the organisation that owns the repository, which is `conventional-changelog` according to `git remote`. The existing notice and the README name Mario Nebl, the original author. Changing a copyright line is a legal matter, and this review can't settle who holds the rights. I propose keeping the existing holder and writing that reason in the ADR.
4. **Not covered by the check:** `@commitlint/config-validator`, `@commitlint/types` and `@packages/test-environment` declare MIT but have no `license.md` of their own. The check doesn't read subfolders, so this is only for information.

## Proposed ruling
| Key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `license.spdx` | `MIT` | observed | `license.md`, `package.json:18`, all 38 workspace manifests, `README.md:184` |

Departure: the copyright holder stays "Mario Nebl" (the existing notice) rather than the owning organisation.

If you agree, I'll fill the trait, set the status to `accepted`, and fill `date: 2026-11-15` and `authors:`. I'll rewrite Consequences, replace the how-to-rule block with the reason for the departure, and run `npx ontrack apply`.

**Do you agree?** Please also tell me:
- what name to put in `authors:` (Tristan Rivoallan?);
- whether you'd rather follow the ADR on the copyright holder instead of keeping Mario Nebl.

## ADR-0025

Checking which ADRs are actually accepted and which tools the proposed ones would name.

I've finished the investigation. Here is my proposed ruling on **ADR-0025 (Tools outside the package manager)**. I haven't written anything yet.

## What the repository does today

- **No tool outside the package manager is installed anywhere.** Everything the hooks and CI run comes from the lockfile: `.husky/commit-msg` runs commitlint from source, `.husky/pre-commit` runs `pnpm lint-staged` and `pnpm build`, and oxlint, oxfmt, lerna, nx and vitepress are all in `devDependencies`. The only script is `scripts/check-no-focused-tests.js`, a Node script. None of the 5 workflows in `.github/workflows/` installs a binary such as gitleaks, zizmor, actionlint or grype. Nothing in git history mentions them either.
- **`.mise.toml` exists, with `node = "22"` and `pnpm = "12"` only.** There is no `mise.lock` and no `lockfile = true`, so it records no checksums, and no workflow uses it (CI uses `pnpm/action-setup` and `actions/setup-node`). Both entries are out of this ADR's scope: node is the language runtime (ADR-0004), and pnpm is the package manager. pnpm is already pinned by sha512 in `package.json` `packageManager`, and `Dockerfile.ci` checks that hash with `sha512sum -c`.
- **Renovate is the updater** (`package.json` → `"renovate"`, `extends: config:recommended`). Its default managers include `mise`, and the history shows it already moving `.mise.toml` (`43639e8d chore: update pnpm to v12 (#4990)`).
- **No accepted ADR names a tool.** Only ADR-0001 has `status: accepted` in its frontmatter. ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 (`vulnerabilities.scanner`) are all still `proposed`.

## Checking the conditions

- **"`script` with one tool; `mise` or `aqua` with several".** This counts the tools that accepted ADRs name, and today that count is zero. So neither branch of the recommendation applies.
- **"`none` is an answer only when no accepted ADR names such a tool".** This holds today, as shown by the frontmatter `status:` lines above.

## Proposed ruling

- **Status:** `accepted`
- `tools.manager: none` (**observed**). No binary outside pnpm is installed by any hook, workflow, Dockerfile or session setup, and no accepted ADR names one.

**Departure from the recommendation:** the recommendation assumes there is at least one tool to pin. There are none here, so `none` is the answer the ADR itself allows for this case.

- Rules 1–3 have nothing to apply to.
- Rule 4 has nothing to keep current. The ruling would say so, and would add that this ADR must be superseded as soon as an accepted ADR names a tool.

**Caveat:** if you accept the ADR-0015, ADR-0011 or ADR-0019 recommendations (gitleaks, zizmor, grype), `none` stops being valid and the check fails. I would then propose `mise` rather than `script`:
- there would be several tools;
- `.mise.toml` is already here;
- Renovate's `mise` manager already updates that file, and it also updates `mise.lock`.

That would need `lockfile = true`, a committed `mise.lock`, and `jdx/mise-action` pinned by hash in CI. You can choose `mise` now instead. It would be **absent**: neither the lockfile nor the CI use exists today.

## After the review

No tracker is set up: ADR-0014 is still `proposed`, so no `tracking` trait is decided. I'll give the list of rulings the repository doesn't follow yet here and create no tracking items. With `none`, that list is empty, because there is no tool to pin. With `mise`, it would hold one item: `[trivoallan/ADR-0025] tools.manager: enable mise lockfile and use mise in CI`.

**Do you agree with `accepted` and `tools.manager: none`, or would you rather rule `mise` now?** When you agree, I'll also fill `date: 2026-11-15` and `authors:`. Should that be `[Tristan Rivoallan]`?