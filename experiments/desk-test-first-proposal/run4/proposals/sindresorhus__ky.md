# sindresorhus__ky

## ADR-0002

Now the evidence: what languages the repo actually uses in docs, commits, code and comments.

I read the ADR in full and checked how the repository handles language today. I'm proposing to accept the ADR with English everywhere, exactly as it recommends.

## What the repository does today

The repository has no written rule about language anywhere: no localization setting, no i18n or locale files, and no lint or commit-message check for it. In practice, everything is written in English:
- **Documentation:** `readme.md` is in English.
- **Commits:** I searched all 592 commit subjects for common French words and found none. Recent examples: "Let a `beforeRetry` hook change per-attempt options", "Fix CI".
- **Code and comments:** the names in `source/` are English, and searching `source/` for French words in comments found none.
- **`AGENTS.md`:** its conventions are written in English.

The recommendation has no conditional ("if this repository…") to check, and the question does apply here, so there is no case for `rejected`.

## Proposed ruling: ADR-0002 Localization, `accepted`

| Trait key | Value | Status | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | readme, all 592 commit subjects, `source/` names and comments, `AGENTS.md` |
| `localization.language.documentation` | *(empty, so English)* | observed | `readme.md` is in English |
| `localization.language.commits` | *(empty, so English)* | observed | `git log` shows English only |
| `localization.language.code` | *(empty, so English)* | observed | `source/` names are English |
| `localization.language.comments` | *(empty, so English)* | observed | no French found in `source/` |

**Differences from the recommendation:** none. In place of the "how to rule" block, the ADR will get one line saying the recommendation is adopted as is, because it matches what the repository already does.

**Rulings this repository does not follow yet:** none. Every value above is already observed, so there is nothing to track. No `tracking` trait is decided in `AGENTS.md` yet, so in any case I would only list items here and create none.

## To write the ADR

The ADR needs `date:` (I'll use 2026-11-15) and `authors:` filled in. I'll use "Tristan Rivoallan" (from git config, no email) unless you name other people.

If you agree, I'll set the status to `accepted`, fill `default: english`, rewrite the Consequences lists for this repository, replace the "how to rule" block with the "adopted as is" line, and run `npx ontrack apply` to update `AGENTS.md`.

**Do you agree with this ruling, and is "Tristan Rivoallan" right for `authors:`?**

## ADR-0004

I read the ADR in full. Your AGENTS.md says to run `npx ontrack review trivoallan/ADR-0004-languages` first, but that command needed approval and wasn't run. I worked from the ADR's own "How to rule" steps and the repository instead. Approve the command if you want me to check its output too.

## What the repository does today

- **Source is TypeScript only.** 98 of the 110 tracked files are `.ts`, covering all of `source/` and `test/`. There are no `.js`, `.py` or other source files.
- **The tooling is TypeScript's.**
  - `tsconfig.json` extends `@sindresorhus/tsconfig` with `exactOptionalPropertyTypes`.
  - The build is `tsc --project tsconfig.dist.json`, and the test script runs `tsc --project tsconfig.test.json`.
  - Tests use `ava` with `tsx/esm`, and linting uses `xo` with `@typescript-eslint` rules (all in `package.json`).
- **It runs in browsers and on the server.** It's a Fetch-API HTTP client: `"engines": {"node": ">=22"}`, the `browser` keyword, and Playwright browser tests run in CI (commit `d93adf8`).
- **No main language is written down anywhere.** The `languages.main.name` key is empty and AGENTS.md lists Languages as "Not yet decided".

## How it compares with the recommendation

The ADR recommends `Python` or `TypeScript`, and says to choose TypeScript "when the repository runs in a browser or shares code between browser and server". That condition holds: ky's one codebase is shipped to both browsers and Node (`package.json` keywords and engines, Playwright tests in `.github/workflows/main.yml`). The recommendation therefore comes down to TypeScript, which is what the repository already uses. **There is nothing different.**

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name`: `TypeScript`** (observed). Evidence: every source and test file is `.ts`, and `tsc`, `xo`, `ava` and `tsx` are the reference tooling.
- **Departures from the recommendation:** none. The ADR gets one line saying it adopts the recommendation as is.
- **Other edits, following the ADR's own steps:**
  - Fill in `date: 2026-11-15` and `authors:`. I'd put "Tristan Rivoallan" (your git user name) unless you name someone else.
  - Rewrite the Consequences lists for this verdict.
  - Delete the "How to rule" block.
  - Run `npx ontrack apply`.

`rejected` doesn't apply, because this is a code repository with one clear main language.

**Do you agree with this ruling, and should the author be "Tristan Rivoallan"?** I won't write anything until you confirm.

## Rulings not followed yet

If you accept, the repository already follows `[trivoallan/ADR-0004] languages.main.name = TypeScript`, so no tracking item is needed. Separately, there is no decided `tracking` trait (Work tracking, ADR-0014, is still "Not yet decided" in AGENTS.md). That means I have no tracker to list or create items in, and duplicates were not checked.

## ADR-0006

Evidence gathered; here is the proposed ruling.

## What the repository does today

- **Commit format:** it does not use Conventional Commits. 0 of 592 commit subjects in `git log` match `type(scope): …`. Subjects are plain imperative sentences ("Let a `beforeRetry` hook change per-attempt options", "Fix CI", "Refactor"), and release commits are bare versions ("2.2.0", "2.1.0").
- **Scopes:** none have ever been used. ky is one npm package. `source/core`, `source/errors`, `source/types` and `source/utils` are internal modules of that one library, and none of them is released or filtered on separately.
- **Versioning:** set by hand. `package.json` has `"release": "np"`, and `np` asks a person for the version bump. Nothing reads commit messages to compute a version. There is no semantic-release, release-please or changesets.
- **Enforcement:** there is none. No commitlint config, no `@commitlint/*` in `node_modules`, no `.husky` or lefthook, no active git hooks. `.github/workflows/main.yml` only runs tests, lint, build and type checks.

**Checking the recommendation's condition.** commitlint is recommended "if this repository generates its versions from commit messages". It doesn't: versions come from `np`, by hand. So the condition fails and the ADR says `none` is just as good an answer.

## Proposed ruling: `accepted`

| Trait | Value | Observed or absent | Evidence |
|---|---|---|---|
| `commits.scopes` | `[]` | observed | Single-package library, and no scope appears anywhere in the 592-commit history |
| `commits.tool` | `none` | observed | No commitlint, hook or CI job. Versions are set by hand with `np` |

**Departures from the recommendation:**
- **`commits.tool: none` instead of `commitlint`.** The recommendation only holds if versions come from commit messages. Here they come from `np`, so a badly formatted message can't produce a wrong version. Review keeps the convention.
- **`commits.scopes`:** the ADR recommends no value here, so this isn't a departure. `[]` is the ADR's own answer for a single-area repository.

**Why `accepted` and not `rejected`:** the question does apply, because people and agents write commits here. `[]` and `none` spell that out as explicit keys: "no scope, nothing enforces it". `rejected` would remove the block and leave the agent nothing to read. If you prefer `rejected`, it means the same thing in practice.

**Something to know before you agree:** the Conventional Commits format comes from governance and isn't part of this ruling. It still breaks with every commit in this history. Once this is ruled, new commits follow `fix: …` / `feat: …`, while the 592 existing ones stay plain sentences.

## Rulings the repository does not follow yet

If you accept this ruling, there are none: both values describe what the repository already does. The only gap is the commit format above, which governance requires and has no trait key, so there is no tracking item to propose. No `tracking` trait is decided either (ADR-0014 is still `proposed`), so I would create nothing in a tracker anyway.

**Do you agree with this ruling (`accepted`, `scopes: []`, `tool: none`)?** Or would you rather have `rejected`, or a different value? I'll also need the name or names to put under `authors:`. I'll write nothing to the ADR until you answer.

## ADR-0009

I've gathered the evidence and am now writing up the proposed ruling. Nothing has been written yet.

## Proposed ruling: ADR-0009 Branching (`trivoallan/ADR-0009`)

**What the repository does today**
- **No merge commits at all.** `git rev-list --min-parents=2 --count HEAD` returns `0` across 592 commits.
- **Pull requests are squash-merged.** 256 of 592 subjects end in `(#N)`, for example `e68ea7a … (#883)`, and none reads "Merge pull request".
- **The maintainer mostly pushes straight to `main`.** In 2026, 34 of 167 commits came through a PR and 133 were pushed directly. The last 90 commits since #883 (2026-09-06) are all direct pushes, including the `2.2.0` release commit made by `np`.
- **There are no feature flags.** Direct pushes are finished work, not unfinished work hidden behind a flag, so this is not trunk-based in the ADR's sense.
- **Branch names follow no pattern.** The only remote branch besides `main` is `origin/fix-methods`, which uses a hyphen where the ADR expects a slash. The repo has no CONTRIBUTING file, no PR template and no CODEOWNERS.
- **Nothing checks branch names.** `.github/workflows/main.yml` runs tests on push and pull_request and nothing else.

**The condition on bots (rule ADR-0012 and ADR-0018 first, or bots' PRs fail).** It doesn't apply here. `.github/` holds only `funding.yml`, `security.md` and `workflows/`, so there is no dependabot or renovate. The release tool is `np` (`package.json:27`), which publishes from `main` and opens no branches.

**Proposed status: `accepted`**

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | **absent** (partly observed) | Outside contributions follow it: 256 squashed PRs. Most maintainer work skips it: 133 of 167 commits in 2026 went straight to `main`. This ruling would require a branch and a PR for every change. |
| `branching.merge` | `squash` | **observed** | 0 merge commits, and every PR lands as one `(#N)` commit. |
| `branching.prefixes` | `[feat, fix, docs]` | **absent** | The only branch seen, `fix-methods`, has no `prefix/` form. Nothing enforces names. |

**Departures from the recommendation:** none. All three values are the recommended ones.

**Points for you to weigh:**
1. **`model`:** if you want the ruling to describe what the maintainer actually does, the honest alternative is to accept that direct pushes to `main` are allowed. None of the allowed values fits that exactly. `trunk-based` assumes feature flags, which don't exist here. I'd keep `github-flow`, so that agents and contributors always open a branch and a PR.
2. **`merge: squash`:** the ADR says the squash message must carry a Conventional Commits type. This repo's messages don't use one (for example "Refactor" and "Fix CI"), and ADR-0006 (Commits) is still proposed. That conflict will be settled there, not here.
3. **`prefixes`:** the history has many refactoring and test-only commits. You could add `refactor` and `test`, which are both among the eleven types, and I'd record that as a departure.

When this ends, I'll list the rulings the repo doesn't follow yet. Because AGENTS.md has no decided `tracking` trait, I'll give that list in my reply and create no tracker items.

**Do you agree with this ruling (accepted; github-flow / squash / [feat, fix, docs])?** Or do you want to change a value, such as adding `refactor` and `test` to the prefixes? I'll write nothing until you answer.

## ADR-0011

Status: I've read the ADR and the workflow. I couldn't query GitHub's rulesets (the call needs your approval), and zizmor isn't installed here. Here is the proposed ruling.

# Proposed ruling: ADR-0011 Forge and continuous integration

## What the repository does today

- **Forge:** GitHub. `origin` is `https://github.com/sindresorhus/ky.git`, and the pipeline uses GitHub Actions. That means `rejected` does not apply, because the ADR allows it only for a forge other than GitHub.
- **Pipeline:** there is one workflow, `.github/workflows/main.yml` ("CI"). It runs on `push` and `pull_request` with two jobs:
  - `test` runs `npx ava` on a matrix of Node `latest`, 24 and 22.
  - `browser` runs `npm test -- test/browser.ts`, which covers xo lint, build, type checks and browser tests.
  - GitHub Actions has been used since `e220607 Move to GitHub Actions`. The latest change was `d93adf8`.
- **Is the pipeline required to merge?** I don't know. That depends on a ruleset or branch protection on GitHub, and nothing in the repository says. I didn't run `gh api repos/sindresorhus/ky/rulesets` because it was refused without your approval.
- **Workflow audit:** nothing reads the workflows. There is no zizmor job, no `zizmor.yml`, and zizmor is not installed locally. `actionlint` is in `~/.local/bin`, but nothing wires it in.
- **Against the five fixed rules and the zizmor rules:**
  - **Rule 3 (pin by SHA) is not followed.** `actions/checkout@v6` and `actions/setup-node@v6` are movable tags (lines 17–18 and 28–29).
  - zizmor would most likely also report:
    - `artipacked`, because `checkout` keeps its credentials (no `persist-credentials: false`).
    - Possibly `excessive-permissions`, because there is no `permissions:` block.
  - These findings are my prediction; I haven't run zizmor.
  - Rules 1, 2, 4 and 5 hold, because there is nothing for them to apply to: no deploy jobs, no `environment:`, no secrets and no `pull_request_target`.
- **Jobs against the stage table:** `lint`, `test` and `build` all exist, inside `npm test` from `package.json` scripts. `audit` is missing. `release` runs locally through `np` and not in CI, which is ADR-0012's question.

## Proposed ruling: `accepted`

| Key | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **observed for the pipeline, unverified for the ruleset** | `main.yml` runs on every push and PR. Whether merging on red is blocked is a GitHub setting I couldn't read. |
| `forge.audit` | `zizmor` | **absent** | No audit job or tool today. The ruling would add a zizmor job and pin every action by SHA. |

**Departures from the recommendation:** none. Both values are the ones the ADR recommends, so the ADR would say it adopts them as is.

If ky's upstream practice is that a red CI only informs the maintainer, `informative` would be the honest value for `forge.gate`. Running the rulesets query would settle it.

## Before I write anything

1. Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`? Or would you prefer `informative`, or `forge.audit: none`?
2. What names should go in `authors:`?
3. Do you want me to run `gh api repos/sindresorhus/ky/rulesets` to check the gate first?

Once you agree, I'll edit only this ADR and then run `npx ontrack apply`.

## Rulings this repository would not follow yet

These apply if the ruling is accepted as proposed:

- `[trivoallan/ADR-0011] forge.audit`: add a zizmor job (via `zizmorcore/zizmor-action` pinned by SHA) that runs on pull requests.
- `[trivoallan/ADR-0011] forge.audit`: pin `actions/checkout` and `actions/setup-node` by SHA, and fix any other zizmor findings, such as `artipacked`.
- `[trivoallan/ADR-0011] forge.gate`: confirm or create a ruleset that makes the CI checks required on `main`.

AGENTS.md has no decided `tracking` trait, because ADR-0014 is still undecided. So I'll create no tracker items and only give this list.

## ADR-0023

I'm checking whether the ontrack check accepts a lowercase `license` file name, which is what this repo uses.

I'm proposing **`accepted`, `license.spdx: MIT`**. This repository already does what the recommendation asks, except for one detail: the case of the licence file's name.

**What the repository does today**
- `package.json:5` has `"license": "MIT"`. This line is unchanged in the uncommitted diff.
- There is no `pyproject.toml`, so `package.json` is the only root manifest.
- A file named `license` (lowercase) is tracked at the root (`git ls-files`). It holds the full MIT text, with the line `Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)`.
- That file has been there since the first commit (`441fb42 Init`, last touched in `588f453 Meta tweaks`), so the licence has never changed.
- The copyright holder is Sindre Sorhus, who owns the repository (`"repository": "sindresorhus/ky"`). That fits fixed point 3.
- `readme.md` doesn't mention the licence. Nothing in the ADR asks it to.

**Proposed ruling**
- `status: accepted`
- `license.spdx: MIT`, **observed**: it's in `package.json:5` and in the `license` file, and both have been there since the first commit.

**Differences from the recommendation**
1. **Value:** none. MIT is both the recommendation and what the repository already uses.
2. **Licence file name:** fixed point 2 lists `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`. This repository uses lowercase `license`, which is Sindre Sorhus's usual convention, and GitHub and npm both recognise it. I couldn't tell whether the check matches names case-sensitively. If it does, the check will fail on Linux CI even though macOS seems to accept the name. You can either:
   - (a) keep `license` and record it in the ADR as a deliberate departure, or
   - (b) rename it to `LICENSE`.
3. **The check can't run yet:** the `check:` line calls `npx --no-install ontrack-engineering-check`, but that package isn't in `node_modules` (only `ontrack` is). I'll list this as a ruling the repository doesn't follow yet.

**Writing the ADR** (once you agree): I'll set `date: 2026-11-15`, fill `authors:` with your name, rewrite the Consequences lists, and replace the "how to rule" block with one line saying the recommendation is adopted as is, plus the file-name note if you choose (a).

Do you agree with `accepted`, `license.spdx: MIT` (observed)? And for the file name: (a) keep `license` and note it, or (b) rename it to `LICENSE`? Who should be listed in `authors:`? I'll write nothing until you answer.

## ADR-0025

Here's what I found and the ruling I'd propose for ADR-0025. I haven't written anything yet.

## What the repository does today

- **There are no tools installed outside npm.** No `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml` or `aqua-checksums.json` exists, and there is no install script (no tracked `*.sh` file). `git log` shows none of them ever existed.
- **CI uses only npm.** `.github/workflows/main.yml` runs `actions/checkout`, `actions/setup-node`, `npm install`, `npx ava` and `npx playwright install --with-deps`. Playwright is a devDependency, so its browsers come through the package manager, which this ADR doesn't cover.
- **There are no hooks or agent setup.** `.git/hooks` holds only the sample files, and there is no husky, devcontainer or `.claude` setup.
- **No accepted ADR names such a tool.** Only ADR-0001 is `accepted`. ADR-0015 (`secrets.guard`, which recommends `gitleaks`) and ADR-0011 (`forge.audit`, which recommends `zizmor`) are both still `proposed`. Neither tool is set up here today.

## Compared with the recommendation

The recommendation depends on how many tools there are: `script` for one tool, `mise` or `aqua` for several. Both cases assume at least one tool, and this repository has none. The ADR covers that case itself: "`none` is an answer only when no accepted ADR names such a tool." That condition holds, because ADR-0011 and ADR-0015 are still `proposed`.

## Proposed ruling

- **Status:** `accepted`. The question applies to this repository and its answer is "no tools", so I'm not proposing `rejected`.
- **`tools.manager: none`** (observed). No manager, script or pinned binary exists, and no accepted ADR names a tool.
- **Departure from the recommendation:** `none` instead of `script`. Pinning a tool nothing asks for would add a file to maintain for no use. This ruling has to be revisited, and probably superseded with `script` if one tool comes in (for example `gitleaks`), as soon as ADR-0015 or ADR-0011 is accepted with a tool. The check fails under `none` once a tool is listed.
- **Rule 4 (who keeps the pins current):** nobody, because there are no pins. I'll say so in the ADR.

**The other option:** if you already expect to accept ADR-0015 with `gitleaks`, ruling `script` now would get ahead of it. That would describe a script the repository doesn't have yet, so it would become an item to track.

**Do you agree with `accepted` / `tools.manager: none`?** If you want `script` (or `mise`) instead, tell me. I also need the name or names to put in `authors:`.