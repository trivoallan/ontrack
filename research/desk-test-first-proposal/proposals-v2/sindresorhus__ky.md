=================== sindresorhus__ky ADR-0002
I reviewed `docs/adr/trivoallan/ADR-0002-localization.md` and propose `accepted`, keeping the recommendation (English everywhere) with no overrides. I've written nothing yet. `npx ontrack review` needed your approval and didn't run, so this review follows the ADR's own five ruling steps.

## What the repository does today

Everything in the repository is in English. There is no written rule saying so, and no tooling checks it.

- **Documentation:** `readme.md` and `.github/security.md` are in English. The existing convention in `AGENTS.md` is also in English.
- **Commits:** all 592 commit messages are in English, for example "Let a `beforeRetry` hook change per-attempt options". Searching them for common French words found none.
- **Code and comments:** names and comments under `source/`, `test/` and `test-d/` are in English. Every accented character I found is in Unicode test data (`'café 日本語 🌍'` in `test/http-response-bodies.ts:6`, `'é日本語🌍'` in `test/request-body-serialization.ts:32`), not French text.
- **Nothing written down:** there is no i18n setup, no translation files and no language rule in `AGENTS.md`, `.editorconfig` or the xo config.
- **Audience:** the package is published to npm as `ky`, by Sindre Sorhus (per `package.json`), for anyone who uses it. That matches the reason the ADR gives for its recommendation.

The recommendation has no conditional clauses, so there was no condition to check.

## Proposed ruling

**Status:** `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | readme, all 592 commits, all names and comments are English |
| `localization.language.documentation` | *(empty, so English)* | readme and `.github/*.md` are English |
| `localization.language.commits` | *(empty, so English)* | `git log`: 592 English subjects, none in French |
| `localization.language.code` | *(empty, so English)* | names in `source/**` are English |
| `localization.language.comments` | *(empty, so English)* | comments in `source/**` are English; accents appear only in test data |

**Departures from the recommendation:** none. In the ADR, I'd replace the "How to rule" block with one line saying the recommendation is adopted as is, because it matches existing practice.

## Before I write it

1. **`authors:`** The ADR wants the names of the people who decided, without email addresses. Should I put `Tristan Rivoallan` (your git user name), or someone else?
2. **`date:`** I'd use `2026-11-15`.
3. **`npx ontrack apply`** needs your approval to run once the ADR is written.

Do you agree with `accepted`, default `english` and no overrides? If so, I'll fill the traits, status, date and authors, rewrite the Consequences for this repository, then run `npx ontrack apply`.

I won't build the list of rulings the repository doesn't follow yet. That list waits until every ADR is ruled, and 24 others are still `proposed`. There's also no decided `tracking` trait yet, because ADR-0014 is still open.
=================== sindresorhus__ky ADR-0004
I've read the ADR in full. This is my proposed ruling for **ADR-0004 Languages**. Nothing is written yet.

## What the repository does today

- **All the code is TypeScript.** `git ls-files` lists 98 `.ts` files: everything under `source/`, `test/` and `test-d/`. There are no `.js`, `.py`, `.go` or shell files. Apart from those, it's only JSON, Markdown, YAML for CI, and media.
- **TypeScript is the reference tooling.**
  - `typescript ^5.9.3` builds the package (`tsc --project tsconfig.dist.json`).
  - `tsconfig.json` extends `@sindresorhus/tsconfig` with `exactOptionalPropertyTypes`.
  - Tests run with `ava` through `tsx/esm`, and type tests in `test-d/` are checked with `tsconfig.test.json`.
  - `xo` lints with `@typescript-eslint` rules.
  - `.github/workflows/main.yml` runs all of this.
- **History:** commit `2d8d68a` (2021-04-28) is titled "Move to TypeScript (#330)". The code has been TypeScript ever since.
- **Nothing in the repository states the main language** for an agent. AGENTS.md lists it under "Not yet decided".

## The ADR's condition

The ADR says to pick TypeScript "when the repository runs in a browser or shares code between browser and server". This repository meets it:
- CI runs Playwright browser tests (`npm test -- test/browser.ts` in the `browser` job).
- It also runs Node tests on Node 22, 24 and latest.
- `package.json` lists `browser` among its keywords, and the library is built on the Fetch API, which both runtimes provide.

## Proposed ruling

- **Status:** `accepted`
- **`languages.main.name`:** `TypeScript`. Evidence: the 98 `.ts` files, `tsc` and `tsx` in `package.json`, and the 2021 migration in `2d8d68a`.
- **`date`:** `2026-11-15`
- **`authors`:** I need you to give me the name or names (no email addresses).
- **Departures from the recommendation:** none. The ADR recommends TypeScript or Python and leans to TypeScript for browser code. TypeScript fits that, so the ADR will just say the recommendation is adopted as is.
- **Consequences:** I'll rewrite them for this repository. The Positive list will say an agent writes new code in TypeScript and ADR-0005/0007 apply directly. The Negative list will say there's no real cost, since this records what already exists. The Neutral list will say the CI YAML and JSON configuration aren't declared.

When you agree, I'll fill in the frontmatter, set the status, replace the "How to rule" block with that line and the new Consequences, and run `npx ontrack apply`. I'll leave the list of rulings the repository doesn't follow yet for when every ADR is ruled. 25 are still proposed.

Separately: the uncommitted change to `package.json` re-indents the whole file from tabs to two spaces, as well as adding the `trivoallan` dependency. That isn't part of this ADR, but it may not be what you want.

**Do you agree with `accepted` / `TypeScript`, and which names should go in `authors:`?**
=================== sindresorhus__ky ADR-0006
Now the repository evidence.

I've read the Commits ADR (ADR-0006) and checked it against the repository. My proposed ruling is below. Nothing has been written yet.

## What the repository does today

- **How versions are set:** by hand. `package.json` has `"release": "np"`. `np` asks for the version bump interactively, then makes a commit whose message is just the version (`3541888 2.2.0`) and a tag (`v2.2.0`, `v2.1.0`, …). Nothing reads commit messages to work out a version or a changelog: there's no semantic-release, changesets or release-please.
- **Commit format:** not followed at all. **0 of 592** commit subjects match `type(scope)?:`. Messages are plain sentences ("Let a `beforeRetry` hook change per-attempt options", "Fix CI", "Refactor"), and none has ever used a scope.
- **Enforcement:** none. There's no commitlint config or `@commitlint/*` package, no `.husky/`, and no active hooks in `.git/hooks`. `.github/workflows/main.yml` runs only the tests and xo, with no commit-message check.
- **Areas:** it's one npm package (`ky`). `source/` has `core/`, `errors/`, `types/` and `utils/`, but these are internal layers of one small library, not separately released parts. The history has never been filtered by area.

## Comparison with the recommendation

- **`commits.tool`:** the ADR recommends `commitlint`, but only "if this repository generates its versions from commit messages". That condition is **false**: versions are set by hand through `np` (the `release` script in `package.json`, and the commit `3541888 2.2.0`). The ADR says that in this case "`none` is just as good an answer", so I propose **`none`**, which departs from the recommendation.
- **`commits.scopes`:** the ADR recommends nothing here, so there is no departure. For a single-area repository it calls `[]` a full answer.
- **`rejected`:** doesn't fit, because the question does apply. Choosing `[]` and `none` is a full answer and still lets the ADR record those values.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.scopes` | `[]` | It's one package. `source/{core,errors,types,utils}` are internal layers. No scope has been used in 592 commits, and nothing generates release notes by area. |
| `commits.tool` | `none` | Versions are set by hand through `np` (`"release": "np"`, commit `3541888 2.2.0`), so a malformed message can't produce a wrong version. There's no commitlint or hook today. |

**Departure from the recommendation:** `commits.tool: none` instead of `commitlint`. The recommendation rests on versions being generated from commit messages, and here they aren't, so review is enough to keep the convention.

**Something you should know before agreeing:** the format itself isn't up for ruling, and governance requires Conventional Commits. None of the 592 existing commits follow it, so accepting this ADR binds future commits to a convention the history has never used. With `none`, nothing enforces it except review. I'll list this as a ruling the repository doesn't follow yet.

When I write it, I'll fill in `date:` with today's date, 2026-11-15. Whose names should go in `authors:`?

**Do you agree with this ruling (`accepted`, `scopes: []`, `tool: none`)?** You can also change a value, for example to `tool: commitlint` if you want CI to enforce the format anyway.
=================== sindresorhus__ky ADR-0009
Still gathering evidence: the history has no merge commits and many `(#NNN)` subjects, which points to squash merging. Next I'm checking the PR branch names and the forge's merge settings.

I'll skip the forge lookup and rely on local history.

I'm proposing a ruling for ADR-0009 (Branching) and need your decision before I write anything. One part of it, the branching model, goes against what the repository does today.

## What the repository does today

- **Branches:** the default branch is `main` (`origin/HEAD -> origin/main`). The only other branch on the remote is `origin/fix-methods`. It joins words with a hyphen and has no `prefix/` part, so the ADR's check would reject that name. No branch naming rule is written down anywhere.
- **How changes reach `main`:** `git log --merges` finds 0 merge commits in 592 commits. Two patterns show up:
  - **Pull requests:** 201 commits have "GitHub" as committer and a subject ending in `(#NNN)`, for example `e68ea7a Preserve caller stack for schema validation errors (#883)`. That is what squash merging in GitHub's web interface produces.
  - **Direct pushes:** 377 commits were committed locally by the maintainer and pushed straight to `main`. That includes the last 10 commits and every release commit (`2.2.0`, made with `np` through `"release": "np"`). Since 2025-06-01, 74 of 229 commits came through a pull request; the rest were direct pushes.
- **CI:** `.github/workflows/main.yml` runs on `push` and `pull_request` alike. It has no rules about branches.
- **Commit messages:** no subject uses a Conventional Commits type (`feat:`, `fix:` and so on). ADR-0006 (commits) is still `proposed`.
- **Bots:** there is no Dependabot, Renovate or release-please configuration. ADR-0012 (delivery) and ADR-0018 (dependencies) are both `proposed`, so no bot branches need an exemption yet.
- **Forge settings:** I couldn't read them, because the `gh api` call needed approval and I didn't retry it. Whether squash merging is the only option allowed is inferred from the history, not confirmed.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | Matches the 201 pull-request commits. **Departs from current practice:** most commits are pushed straight to `main`. |
| `branching.merge` | `squash` | 0 merge commits; every pull request landed as one commit ending in `(#N)`. |
| `branching.prefixes` | `[feat, fix, docs]` | No naming convention exists. The one remote branch, `fix-methods`, is a `fix`; change history is mostly fixes, docs and features. |

**Departures from the recommendation:** none. All three values are the ADR's own.

**Differences between the ruling and the repository, written into the ADR as follow-ups:**
1. **Direct pushes:** the maintainer pushes to `main`, and releases are committed there through `np`. With `github-flow`, regular work goes through a pull request. Release commits would need an exception, or a later ADR-0012 ruling.
2. **Branch names:** the hyphenated style (`fix-methods`) doesn't fit `prefix/kebab-case`.
3. **Squash message:** `squash` assumes the merge message carries a Conventional Commits type. This repository doesn't use them, and ADR-0006 is undecided.

**Alternative:** if you'd rather record the direct-push habit, `trunk-based` matches today's history better. The cost is that agents would also be allowed to push to `main`, and the ADR says `trunk-based` usually relies on feature flags, which ky doesn't use.

**Do you agree to `accepted` with `github-flow` / `squash` / `[feat, fix, docs]`?** If not, should the model be `trunk-based`, or should the prefixes change? Please also tell me which name(s) to put under `authors:`. Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0009-branching.md`, dated 2026-11-15, and run `npx ontrack apply`.
=================== sindresorhus__ky ADR-0011
Now the ontrack review command (required by project rules), and checking whether the ruleset/gate can be seen from GitHub and whether zizmor is around.

I wasn't able to run `npx ontrack review trivoallan/ADR-0011-forge-and-ci`, which AGENTS.md says to run for an ADR review: the command needed approval and didn't get it. So this review follows the ADR's own "How to rule" section. I couldn't query GitHub for branch rulesets either (`gh api` also needed approval).

## What the repository does today

- **Forge: GitHub.** The remote is `github.com/sindresorhus/ky`. The repo has `.github/workflows/main.yml`, `.github/funding.yml`, and `.github/security.md`, which points to GitHub security advisories. So `rejected` doesn't apply: the ADR keeps that for a forge other than GitHub.
- **Pipeline: one workflow, `main.yml`.** It runs `on: [push, pull_request]` with two jobs:
  - `test` runs ava on Node latest, 24 and 22.
  - `browser` runs `npm test`, which covers xo lint, build, `tsc` and the browser tests.
  - Lint, test and build therefore exist, from `package.json` `scripts.test` and `scripts.build`. There are no scan, audit, image, release or deploy stages (`release` is `np`, run by hand).
- **What a red pipeline blocks:** nothing, as far as the repository shows.
  - `git log --merges` is empty. The history is linear, with all of the last 50 commits by one maintainer, pushed straight to `main`.
  - Red CI reaches `main` and gets fixed afterwards: `d93adf8` "Run the browser tests and static checks once in CI" at 03:52, then `d9ddb03` "Fix CI" at 04:26, which changes 4 test files. The same happened earlier in `634cb2b` and `1136e0d`.
  - The actual ruleset is a GitHub setting, and I couldn't check it.
- **Audit: nothing reads the workflows.** There's no zizmor, actionlint, `zizmor.yml`, Dependabot or Renovate config.
- **The five rules today:**
  - Rules 1, 2, 4 and 5 hold: there are no secrets, no deploy job and no `pull_request_target`.
  - Rule 3 is broken: `actions/checkout@v6` and `actions/setup-node@v6` are pinned by movable tags.
  - zizmor would also flag `artipacked` (checkout keeps its credentials) and probably `excessive-permissions` (there's no `permissions:` block).

## Proposed ruling: `accepted`

| Key | Proposed | Recommended | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | **`informative`** | `blocking` | Linear history of direct pushes to `main`, and "Fix CI" commits that land after a red build (`d93adf8` → `d9ddb03`). A red pipeline reports and the maintainer fixes it; it prevents nothing today. |
| `forge.audit` | `zizmor` | `zizmor` | Nothing reads the workflows today. The one workflow already breaks rule 3, which is exactly what zizmor catches. AGENTS.md now invites agents to write workflows, so "a person writes and reads every one" no longer holds. |

**Departures from the recommendation:**

- **`forge.gate: informative` instead of `blocking`.** The maintainer commits directly to `main` and fixes red builds after the fact. Requiring checks through a ruleset would block that workflow, or would need a bypass that makes `blocking` untrue. If you mean to add a ruleset that requires the `CI` checks on `main`, rule `blocking` instead. The value then states intent, and setting up the ruleset becomes a follow-up item.

**What follows if you accept** (nothing has been written yet):

- `forge.audit: zizmor` isn't set up anywhere yet. `main.yml` would fail the check until the actions are pinned by SHA, the checkout sets `persist-credentials: false`, and permissions are narrowed. Those become follow-up items once every ADR is ruled.
- I'll set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences lists, and replace the "How to rule" block with the reason for the departure. Then I'll run `npx ontrack apply`, which will need your approval.

I don't have a question tool here, so I'm asking directly: do you agree with **`accepted`, `forge.gate: informative`, `forge.audit: zizmor`**? Or would you rather rule `forge.gate: blocking` and commit to adding a ruleset?
=================== sindresorhus__ky ADR-0023
I've read the ADR and checked the repo's licence file, `package.json` and the checker that ADR-0023 runs. (`npx ontrack review` needed approval, so I read the ADR directly; it has its own instructions for ruling.)

## What the repository does today

- **`package.json:5`** has `"license": "MIT"`. This line predates ontrack: the only uncommitted changes to `package.json` are a reindent and the added `trivoallan` devDependency.
- **`license`** (lowercase) at the root, tracked since commit `441fb42 Init`, holds the full MIT text with `Copyright (c) Sindre Sorhus …`. The repository is `sindresorhus/ky`, so the copyright holder already matches what the ADR requires.
- **There is no `pyproject.toml`**, so `package.json` is the only root manifest.
- **ky is a published npm package**: it has `files` and `"release": "np"`, and it is not `private`. So `UNLICENSED` doesn't fit, and `rejected` has no grounds.

## Compared with the recommendation

- **Value:** the recommendation is `MIT` and the repository already uses MIT. No difference.
- **Manifest declares it:** yes, it matches.
- **Copyright holder is the owner:** yes, it matches.
- **Licence file at the root:** this is the one difference. The ADR names `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`, and this repository uses a lowercase `license`. The checker compares names exactly against the files git tracks (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822` and `:870`). So once this ADR is accepted, `ontrack check` will fail with "no tracked LICENSE, LICENSE.md, LICENSE.txt or COPYING at the root", even though the macOS filesystem ignores case. This doesn't change the ruling. It is a gap to list once every ADR is ruled: either rename the file to `LICENSE` (Sindre's repos use lowercase on purpose, so this goes against upstream style) or ask for the checker to accept the lowercase name.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `MIT`.** Evidence: `package.json:5` and the MIT text in `license`.
- **Departures from the recommendation:** none. The Decision section will say in one line that the recommendation is adopted as is, because it matches what ky has shipped since its first commit.
- **`date`:** 2026-11-15
- **`authors`:** I need a name from you. I'd suggest `[Tristan Rivoallan]`, the git user, unless the people who decide should be someone else.
- **Consequences:** I'll rewrite them for ky. MIT is already what ky's users rely on. The one cost is the lowercase `license` name, which fails the check.

Do you agree with this ruling, and whose name goes in `authors:`? I'll write nothing until you confirm. Then I'll edit the ADR and run `npx ontrack apply`.
=================== sindresorhus__ky ADR-0025
I'm checking the hooks and which tools the related ADRs name, then I'll propose a ruling.

I'm stopping here for your decision. Nothing has been written. The `npx ontrack review` command that AGENTS.md asks for was blocked at the approval prompt, so this review follows the ADR's own instructions instead.

## What the repository does today

- **No tools from outside npm.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions` or install script anywhere in the repo.
- **CI uses actions and npm only.** `.github/workflows/main.yml` runs `actions/checkout@v6` and `actions/setup-node@v6`, then `npm install`, `npx ava` and `npx playwright install --with-deps`. Playwright comes from `devDependencies`, so this ADR doesn't cover it. Nothing in CI uses `brew`, `curl | sh` or an outside binary.
- **No hooks.** `.git/hooks` holds only the sample files, and `core.hooksPath` is not set.
- **Nothing keeps versions current.** There is no `dependabot.yml` or Renovate config; `.github/` holds only `funding.yml`, `security.md` and `workflows/`.
- **No ADR is accepted yet.** All 26 are `proposed`, including the three that name such tools:
  - ADR-0015 recommends `secrets.guard: gitleaks`.
  - ADR-0011 recommends `forge.audit: zizmor`.
  - ADR-0019 recommends `vulnerabilities.scanner: grype`, which counts here when it runs locally.

Today the repo matches `none`: no accepted ADR names a tool, and there's nothing to pin.

## The condition in the recommendation

The ADR recommends `script` for one tool and `mise` or `aqua` for several. The number of tools depends on how ADR-0015, ADR-0011 and ADR-0019 are ruled, not on anything in the repo today. If they're accepted as recommended, this repo needs gitleaks, zizmor and possibly grype: two or three tools, so the recommendation becomes `mise` or `aqua`.

## Proposed ruling

**Status: `accepted`**

| Key | Value | Evidence |
| --- | --- | --- |
| `tools.manager` | `mise` | ADR-0015 and ADR-0011 recommend gitleaks and zizmor, which makes several tools. CI already runs on macOS, so one `mise.lock` covers the runner and a workstation. This ADR's check only verifies pins under `mise`. |

- **Pins (rule 4):** a maintainer runs `mise up --bump`, which moves `mise.toml` and `mise.lock` in the same pull request. The repo has no Dependabot or Renovate today, and Dependabot doesn't support mise.
- **Date and authors:** `2026-11-15`, `[Tristan Rivoallan]` (from the git user).
- **Departures from the recommendation:** none. Choosing `mise` over `aqua` is allowed by the recommendation; I picked it because mise checks the lockfile at install time (`--locked`) and turns checksum verification on by default, unlike aqua.

**The alternative.** If you plan to rule `secrets.guard` and `forge.audit` as `none`, or to run zizmor only through an action, then this ADR should be `none` or `script`. The same applies if you'd rather rule this ADR after those two. Rejecting it doesn't fit: the question does apply here once a guard is chosen.

Do you agree with **`accepted`, `tools.manager: mise`, pins moved by a maintainer with `mise up --bump`**? You can also choose `script` or `none`, a different `authors`, or Renovate instead of a person to keep pins current. Once you agree, I'll edit only this ADR, write the rule 4 text, and run `npx ontrack apply`.
