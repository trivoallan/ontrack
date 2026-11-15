=================== googleapis__release-please ADR-0002
Checking the language of docs, code comments and any localization tooling.

I couldn't run `npx ontrack review trivoallan/ADR-0002-localization` (the permission was denied), so this review is based on the ADR file and the repository itself.

## What the repository does today

The repository is English everywhere. It has no rule about language and no localization tooling.

- **Docs:** `README.md`, `CONTRIBUTING.md` and every file in `docs/` (such as `design.md` and `cli.md`) are in English.
- **Commits:** all 1,435 commit messages are English Conventional Commits, for example `fix(commit): handle nested and unclosed parentheses in commit body (#2936)`. Searching for common French words found none.
- **Code and comments:** `src/` has English names and English comments. Searching for accented letters (é, è, à, ç, ù) found none.
- **Localization tooling:** `src/` has no i18n, l10n, gettext or Intl usage.
- **What's missing:** nothing states a language rule (no CONTRIBUTING rule, no lint, no CI check). The practice is consistent, but nobody has written it down.

What the repository does matches the recommendation exactly: one language, English, with no overrides. The recommendation has no conditions to check.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | Docs, 1,435 commits, code names and comments are all English |
| `localization.language.documentation` | *(empty, so it follows `default`)* | `README.md`, `CONTRIBUTING.md` and `docs/*.md` are English |
| `localization.language.commits` | *(empty)* | `git log` subjects are all English |
| `localization.language.code` | *(empty)* | `src/` names are English |
| `localization.language.comments` | *(empty)* | `src/` comments are English, with no accented letters |

**Departures from the recommendation:** none. The Decision section will say in one line that the recommendation is adopted as is.

**Other edits to the file:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]` (taken from your git user name, without the email)
- Rewritten Consequences lists. The current ones are about French speakers, which doesn't fit this English-speaking, Google-maintained project.
- The "How to rule" block deleted.

I'll then run `npx ontrack apply` to update AGENTS.md.

**Do you agree with this ruling?** You can also change the authors list or any trait value before I write anything.
=================== googleapis__release-please ADR-0004
I've finished collecting evidence for ADR-0004 (Languages). Below is the ruling I'm proposing. I haven't written anything yet.

Note: AGENTS.md says to run `npx ontrack review trivoallan/ADR-0004-languages` first, but that command needed approval and didn't run. So I reviewed by hand, following the steps in the ADR file itself.

## What the repository does today

- **The code is TypeScript.** All 151 files under `src/` and every test under `test/` are `.ts`, and `typings/` holds `.d.ts` files. Of the tracked files, the only non-TypeScript code is `owlbot.py` (a Google repo-sync script), the `.kokoro/*.sh` and `.kokoro/test.bat` CI scripts, three `.hbs` templates, and test fixtures in other languages (`.py`, `.go`, `.java`, `.php`, `.rb`). Those fixtures are data that release-please parses, not code written in those languages.
- **The tooling is built around TypeScript:**
  - `tsconfig.json` extends `gts/tsconfig-google.json` and covers `src/`, `test/` and `typings/`.
  - In `package.json`: `"compile": "tsc -p ."`, `"lint": "gts check"`, tests run with `c8 mocha` on the compiled `build/test`, `typescript` is a dependency, and `engines.node` is `>=22.0.0`.
  - CI (`.github/workflows/ci.yaml`) runs only Node 22 jobs: `npm test`, `npm run lint`, and an installation test.
- **The language isn't written down anywhere.** Nothing in the repository states a main language. An agent can only work it out from the file extensions, which is the gap this ADR closes.

## Checking the ADR's condition

The ADR says to pick TypeScript when the code runs in a browser or shares code between browser and server, and Python otherwise. release-please is a Node CLI and library (`"bin": "./build/src/bin/release-please.js"`) and doesn't run in a browser. Read literally, the condition points to Python. But the ADR also says "Neither is better in the abstract", and both recommended languages are acceptable. Here the whole codebase and toolchain are already TypeScript, and the package is published on npm and used by `release-please-action` (the `build-action` CI job installs it). Switching to Python would mean rewriting the project, so TypeScript is the right answer.

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name`: `TypeScript`.** Evidence: `src/**/*.ts`, `tsconfig.json`, `package.json` (`tsc`, `gts`, `typescript`), and the Node-only CI jobs in `ci.yaml`.
- **One departure from the recommendation:** the ADR's rule of thumb (Python for code that never runs in a browser) doesn't fit this repo. The reason I'd write into the ADR: "release-please is a Node CLI/library published on npm and consumed by release-please-action; its entire codebase and toolchain (tsc, gts, mocha/c8) are TypeScript, so TypeScript is the main language despite not running in a browser."
- **Secondary languages, not declared (as the ADR's Neutral note allows):** shell and batch CI scripts in `.kokoro/`, `owlbot.py`, and the multi-language test fixtures.
- **Consequences:** I'd rewrite the Positive, Negative and Neutral lists for this repository, and fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`.

Do you agree with this ruling, including the author name? Once you confirm, I'll update the ADR and run `npx ontrack apply`. I'll skip the step that lists rulings the repository doesn't follow yet and creates tracking items. That step only applies once every ADR is ruled, and 24 are still proposed, `tracking` among them.
=================== googleapis__release-please ADR-0006
Now the history: which scopes are actually used, and how often.

I couldn't run `npx ontrack review trivoallan/ADR-0006-commits` because it needs your approval. So I did this review by hand, following what the ADR file itself says about how to rule.

## What the repository does today

**Are versions generated from commit messages?** Yes, so the condition attached to the `commitlint` recommendation holds:
- `release-please-config.json` sets the release type to `node`, and `.release-please-manifest.json` is at `17.11.2`.
- `.github/release-please.yml` turns on the release-please bot for `main` and `12.x`.
- `CHANGELOG.md` is generated from commit messages, and the history has many `chore(main): release …` PRs.
- This repository *is* release-please: an off-format message here produces a wrong version.

**Is the format enforced?** Not by anything in the repository:
- No `commitlint`, `husky` or `commit-msg` hook anywhere (grep found nothing outside `node_modules`).
- `.github/workflows/ci.yaml` runs only tests, lint, docs and a build. None of them checks commit messages.
- `.github/sync-repo-settings.yaml` requires the checks `cla/google`, `docs`, `lint`, `test (18)` and `windows`. None of them lints commits.
- The only rule is in prose: `CONTRIBUTING.md:37` asks you to "title your pull request following Conventional Commits".
- Rebase merging is allowed as well as squash, so individual commit messages can land on `main` as they are.

**How closely does the history follow the format?** 990 of the last 1,000 non-merge subjects match. The 10 that don't:
- 7 start with `deps:`, which is not one of the eleven types (for example #2734 and #2625).
- 3 are git's default `Revert "…"` messages.

**Scopes in use today.** There is no list, and the drift the ADR warns about is visible:
- The same strategy goes by three names: `java-yoshi`, `yoshi-java-monorepo` and `java-yoshi-mono-repo`.
- `cargo-workspace` also appears as `cargo-workspaces`, and `node` also as `nodejs`.
- Some scopes are file names: `changelog.json`, `dependency-manifest.ts`, `src/updaters`.
- One uses a type as a scope: `fix(refactor)`.

The scopes that recur match real areas of the code: the strategies in `src/strategies/*.ts`, the plugins in `src/plugins/*.ts`, a few core modules, and the bot scopes `deps`, `deps-dev` and `main`. The `main` scope comes from release-please's own release PRs, so it has to stay allowed.

## Proposed ruling: `accepted`

**`commits.tool: commitlint`.** The condition holds: versions are generated from commit messages (`release-please-config.json`, `.github/release-please.yml`). Enforcement today is prose only, and rebase merges let unchecked messages land on `main`.

**`commits.scopes`** — one word per area, each taken from a file name in `src/` or from current history:
- **Strategies** (`src/strategies/`): `bazel`, `dart`, `dotnet-yoshi`, `elixir`, `expo`, `go`, `go-librarian`, `go-yoshi`, `helm`, `java`, `java-yoshi`, `java-yoshi-mono-repo`, `krm-blueprint`, `maven`, `node`, `node-librarian`, `ocaml`, `php`, `php-librarian`, `php-yoshi`, `python`, `python-librarian`, `r`, `ruby`, `ruby-librarian`, `ruby-yoshi`, `rust`, `sfdx`, `simple`, `terraform-module`.
- **Plugins** (`src/plugins/`): `cargo-workspace`, `group-priority`, `linked-versions`, `maven-workspace`, `merge`, `node-workspace`, `sentence-case`, `workspace`.
- **Core modules, each used several times in history:** `cli`, `manifest`, `github`, `github-release`, `changelog`, `commits`, `updaters`.
- **Bots and housekeeping:** `deps`, `deps-dev` (Renovate and Dependabot), `main` (release-please's release PRs), `docs`.

**Departures from the recommendation:** none.
- The tool is the recommended `commitlint`, and its condition is met.
- The ADR has no recommended value for scopes, so the list is not a departure.

**Where the repository differs from this ruling today:**
1. `commitlint` is not installed: there is no `@commitlint/cli` or `@commitlint/config-conventional`, and no config file.
2. No CI job lints commits or PR titles, and no such check is required on `main`.
3. Because nothing has enforced scopes, the history contains scopes outside this list. New commits would have to use the canonical names, for example `java-yoshi-mono-repo` and never `yoshi-java-monorepo`.
4. The `deps:` type used in the past would now be refused.
5. Before relying on the commit check in CI, confirm that the checkout has an `origin/HEAD`. If it doesn't, the `check:` line needs `--from origin/main` added.

Do you agree with this ruling? You could also:
- trim the scope list, for example by dropping the rarely used `-librarian` strategies or using one coarse `strategies` scope;
- choose `hook` or `none` instead of `commitlint`.

If you agree, please also confirm `authors:` (I'd put `Tristan Rivoallan`) and the date `2026-11-15`. I'll write nothing until you answer.
=================== googleapis__release-please ADR-0009
Running these one at a time.

The ADR ships the recommendation `github-flow` / `squash` / `[feat, fix, docs]`. The repository already works this way in practice, so I propose accepting it as is. I couldn't run `npx ontrack review` because it needed approval, so everything below comes from the ADR file and the repository itself.

## What the repository does today

**Model.** It already follows GitHub flow.
- `.github/sync-repo-settings.yaml:4-14` protects `main`: it needs 1 approving review, code-owner review, strict status checks and 5 named checks to pass.
- `.github/workflows/ci.yaml:1-6` runs on `pull_request`, on `merge_group` (a merge queue, added in #2375) and on pushes to `main`.
- All of the last 300 commits on `main` end in `(#NNNN)`. Each one is a pull request; I found no direct pushes.
- **Difference:** there is also a long-lived maintenance branch, `12.x`. It has its own protection rule (`sync-repo-settings.yaml:16-28`) and its own release-please setup (`.github/release-please.yml:3-6`). It is an old-major support branch, not gitflow's `develop`/`release`, so it doesn't change the model. It is still the one part of the repository that github-flow doesn't describe.

**Merge.** It already squashes.
- `git rev-list --count --merges main` returns `1`. That single merge commit is from 2019 (`bc87aa3`, synthtool), so every change since has landed as one commit.
- `sync-repo-settings.yaml:1-3` sets `squashMergeAllowed: true` and `mergeCommitAllowed: false`.
- **Difference:** it also sets `rebaseMergeAllowed: true`, so the forge still accepts a merge method the ruling would not allow. The ADR doesn't check this setting, so it would be follow-up work rather than a reason to change the ruling.

**Prefixes.** No convention is written down anywhere: there is no CONTRIBUTING rule, no hook and no check. The remote branches show the recommended form is already the most common one:
- Matching the form: `feat/ignore-submodules-422`, `feat/php-librarian`, `feat/php-librarian-scoped-commits`, `fix/java-yoshi-version-java-updates`.
- Not matching it:
  - `fix-empty`, `test-java-rc` and `testing-rp-hacks` use a dash instead of a slash.
  - `parthea-patch-1` and `sofisl-patch-1` were made by GitHub's web editor.
  - Six `owl-bot-update-lock-*` branches are stale; OwlBot was removed in #2897.
- `docs:` commits are frequent in the history (about 25 of the last 300), which supports keeping `docs` in the list.

## The conditional part of the ADR

The ADR says bot branches pass the check only if ADR-0012 (release tool) and ADR-0018 (dependency updater) are ruled. Both are still under "Not yet decided" in `AGENTS.md`. This repository has both kinds of bot branch:
- release-please opens `release-please--branches--main--components--release-please`.
- Renovate is configured in `renovate.json`, and Dependabot pull requests show up in the history (`build(deps): bump …`).

**Until those two ADRs are ruled, these bots' pull requests would fail the ADR-0009 check.** Ruling ADR-0012 and ADR-0018 should come next.

## Proposed ruling

**Status: `accepted`**, adopting the recommendation as is.

| Trait | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | Every commit on `main` is a pull request; `main` is protected with required review and CI; a merge queue runs on `merge_group` |
| `branching.merge` | `squash` | Only 1 merge commit on `main`, from 2019; `mergeCommitAllowed: false` |
| `branching.prefixes` | `[feat, fix, docs]` | The existing `feat/` and `fix/` branches; `docs:` is a frequent commit type |

**Departures from the recommendation:** none. In the ADR, I would add one line noting that the `12.x` maintenance branch exists alongside github-flow.

**Metadata:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]`. I'd also rewrite the Consequences section for this repository, for example noting that rebase merge is still allowed on the forge, and remove the "How to rule" block.

Do you agree with this ruling? Or do you want a change, such as adding `chore` or `test` to the prefixes, or choosing `rebase`, which the forge also allows? I won't write anything until you confirm.
=================== googleapis__release-please ADR-0011
Checking live branch rules on GitHub and workflow history.

I'm proposing **accepted** with both of the ADR's recommended values. I found nothing that departs from the recommendation, but there are three gaps the ruling will expose. I haven't written anything yet.

## What the repository does today

- **Forge: GitHub.** The remote is `https://github.com/googleapis/release-please.git`, so `rejected` doesn't apply. Its only use is a forge other than GitHub.
- **Pipeline:** one workflow, `.github/workflows/ci.yaml`. It runs on push to `main`, on `pull_request` and on `merge_group` (a merge queue). Its jobs are `test`, `installation-test`, `windows`, `lint`, `docs` and `build-action`.
- **Required checks:** `.github/sync-repo-settings.yaml:4-15` protects `main` and requires `cla/google`, `docs`, `lint`, `test (18)` and `windows`. It also requires one approving review and code-owner review, with strict status checks.
  - These are classic branch-protection rules applied by Google's settings bot, not a ruleset in the repository.
  - `isAdminEnforced: false`, so admins can bypass them.
- **Workflow hygiene:**
  - Every action is pinned by SHA with its tag in a comment, GitHub's own `actions/*` included.
  - Every checkout has `persist-credentials: false`.
  - Permissions are `contents: read` for the whole workflow.
  - There is no `pull_request_target`, no `${{ }}` inside `run:`, and no secrets or `environment:` anywhere.
  - So rules 1, 2, 4 and 5 hold trivially: there is no deploy job and no secret.
- **History:** commit `9c29179` ("ci: zizmor fix for workflow file", #2829, 2026-06-26) pinned the actions by SHA and added `persist-credentials: false`. Someone ran zizmor and fixed what it found.
- **No audit:**
  - No workflow runs zizmor or actionlint, and there's no `zizmor.yml` (a search for `zizmor|actionlint` outside `docs/adr/` finds nothing).
  - zizmor isn't on `PATH` here, so I couldn't run the offline check. Reading the workflow by hand, I don't expect any findings.
  - `npx ontrack review` and `gh api …/rules/branches/main` both needed approval, so I didn't run them. That means I haven't confirmed the live protection on GitHub.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `sync-repo-settings.yaml` requires `docs`, `lint`, `test (…)` and `windows` on `main`, with strict checks and a merge queue (`merge_group` in `ci.yaml:6`). The repository already means a red pipeline to block the merge. |
| `forge.audit` | `zizmor` | Commit `9c29179` already fixed the workflow to zizmor's findings, and the workflow already meets zizmor's default policy. Only the CI job is missing. |

**Departures from the recommendation:** none. In place of the instructions block, the ADR would get one line saying it adopts the recommendation as is.

**Gaps the ruling will expose** (these become tracking items later, not departures):
1. **`forge.gate`:** the required context `test (18)` is stale. Since commit `285b023` moved the matrix to `node: [22]`, the job reports as `test (22)`. Either GitHub waits on a check that never runs, or `test (22)` isn't required. Also, `installation-test` and `build-action` aren't required at all.
2. **`forge.audit`:** no job runs `zizmorcore/zizmor-action` on pull requests.
3. **`forge.gate`:** the gate is classic branch protection with `isAdminEnforced: false`, not a ruleset. The ADR's check can't verify either.

To write this, I also need `authors:`, the names of whoever is deciding. `date:` would be 2026-11-15.

**Do you agree to rule ADR-0011 `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`? And what names should go in `authors:`?** Tell me if you want a different value for either key.
=================== googleapis__release-please ADR-0023
**ADR-0023 (License): what the repository does today**

- **Licence file:** `LICENSE` is at the root and holds the full Apache License 2.0 text. It has been there since the first commit (`c6dc492 feat: initial commit of library`).
- **Root manifest:** `package.json:30` declares `"license": "Apache-2.0"`. There is no `pyproject.toml`, so that is the only root manifest.
- **Copyright holder:** the source headers name Google LLC (`src/index.ts:1`: `// Copyright 2021 Google LLC`), and `origin` is `github.com/googleapis/release-please`. `LICENSE` has only Apache's template line (`Copyright [yyyy] [name of copyright owner]`) in its appendix, which is the normal form of that file.
- **Docs:** README.md:268–272 has a "License" section that links to `LICENSE`. CONTRIBUTING.md requires a Google CLA from contributors.

**Compared with the recommendation:**

1. **The value differs.** The ADR recommends `MIT` and names `Apache-2.0` as the choice "when an explicit patent grant matters." The repository has been under `Apache-2.0` from the start, and its owner (Google, which uses Apache-2.0 plus a CLA) relies on that patent grant. Moving to MIT would mean relicensing code with many outside contributors. That is not a governance call to make here.
2. **The three fixed rules are already met:** the manifest declares the SPDX value, a full-text `LICENSE` is at the root, and the copyright holder is the owning organisation (Google LLC, as the file headers say).

There is no case for `rejected`: the repository is public and published to npm, so the question applies.

**Proposed ruling**

- **status:** `accepted`
- **`license.spdx`:** `Apache-2.0`. Evidence: `package.json:30` and the root `LICENSE` text.
- **Departure from the recommendation:** `Apache-2.0` instead of `MIT`. The project has been under Apache-2.0 since its first commit, the copyright holder (Google LLC) and its CLA depend on the patent grant, and relicensing is not this ADR's decision.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, from git `user.name`. Tell me if it should be someone else.

The `ontrack check` for this ADR would pass today, because the manifest matches the value and `LICENSE` is present.

Do you agree with this ruling? Once you confirm, I'll update `docs/adr/trivoallan/ADR-0023-license.md` (traits, status, date, authors, the reason for the departure, rewritten Consequences, and the "How to rule" block removed) and then run `npx ontrack apply`. Until then I'm not writing anything.
=================== googleapis__release-please ADR-0025
Still collecting evidence: checking which ADRs are already ruled and whether any script installs a binary outside npm.

I read ADR-0025 in full. `npx ontrack review` was blocked pending your approval, so I worked from the ADR's own "How to rule" section.

## What the repository does today

**Nothing in the repo installs or pins a binary from outside npm.**
- **No tool manager or script:** there is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions` or install script.
- **No hooks:** `.git/hooks` holds only `*.sample` files, and there is no `.husky` or `.pre-commit-config.yaml`.
- **GitHub CI** (`.github/workflows/ci.yaml`) only uses actions pinned by SHA, plus `npm ci`, `npm test`, `npm run lint` (gts) and `npm run docs`. It installs no binary. Actions are covered by ADR-0011, not this ADR.
- **Kokoro** (`.kokoro/*.sh`): `gcloud` and `docker` come with the host image, unpinned. `npx check-node-version@3.3.0` and an unpinned `npx @google-cloud/cloud-rad` are npm packages fetched outside the lockfile. That falls under ADR-0020, not this ADR, and no ADR names `gcloud` or `docker`.
- **Updates:** `renovate.json` uses `config:best-practices`. It has no `mise` manager and no regex manager for binaries.

**Is the condition for `none` met?** The ADR allows `none` "only when no accepted ADR names such a tool". Of the 26 ADRs, only ADR-0001 is `accepted`; every other one is still `proposed`. The tools this ADR worries about are still only recommendations:
- `secrets.guard: gitleaks` in `ADR-0015-secrets.md:83`
- `forge.audit: zizmor` in `ADR-0011-forge-and-ci.md:69`

So the condition is met.

## Proposed ruling

- **Status:** `accepted`, not `rejected`. The question does apply: the moment ADR-0015 or ADR-0011 is accepted with a tool, this key matters.
- **`tools.manager: none`.** No accepted ADR names a tool outside the package manager today (all except ADR-0001 are `proposed`), and the repo has no hook, script or manager installing one.
- **Departure from the recommendation:** the ADR recommends `script` for one tool and `mise` or `aqua` for several. That only applies once some tool is named, and none is. I'd write this in the ADR, and say the ruling must be revisited (superseded with `script` or `mise`) when an ADR naming `gitleaks`, `zizmor` or a local scanner is accepted. The check for this ADR fails under `none` once a tool is listed, so a stale ruling won't go unnoticed.
- **Rule 4 (what keeps the pins current):** nothing yet, because there are no pins. Whoever accepts a tool-naming ADR picks the updater when they revise this ruling. Dependabot cannot do it; Renovate, already configured here, can.
- **`authors:`** your name as the decider. **`date:`** 2026-11-15.

**The alternative** is `script` now, assuming ADR-0015 will be accepted with `gitleaks`. I don't recommend it: it rules on how the repo might look after other ADRs pass, not how it looks today.

## Afterwards

No `tracking` trait is decided (ADR-0014 is still proposed), so there is no tracker to file items in. After ruling, I'll list the rulings the repo doesn't follow yet in my reply and create nothing. With `none`, I expect that list to be empty for this ADR.

**Do you agree with `accepted` / `tools.manager: none`, or would you prefer `script` (or `mise`)?** Once you agree, I'll edit only `ADR-0025-tools.md` and run `npx ontrack apply`.
