# googleapis__release-please

## ADR-0002

Now gathering evidence on the repository's current languages.

I reviewed ADR-0002 (Localization). The recommendation already matches what the repository does, so I'm proposing to accept it as written.

## What the repository does today

Everything is in English, though nothing in the repository writes that down as a rule:

- **Documentation:** `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`, the 7 pages under `docs/` and the `.github/` templates are all in English.
- **Commits:** all 1,435 commit subjects are English. 1,427 of them use Conventional Commits types (`feat`, `fix`, `build`, …). Searching the commit bodies for accented characters finds only Renovate's "⚠️" warnings, no French.
- **Code:** the symbols are English, for example `Manifest`, `ReleaserConfig` and `packageNameFromPackage` in `src/index.ts` and `src/plugins/workspace.ts`.
- **Comments:** I found 2,547 `//` comments in `src/**/*.ts` and none with common French words (le, les, des, est, pour, avec, une). They include Google's Apache-2.0 English license header.
- **What's missing:** no configuration, CI check or contributor guide states a language rule. The only i18n-looking match is a `localeCompare` call in `src/plugins/workspace.ts:436`, which sorts strings and has nothing to do with this question.

## Comparison with the recommendation

The recommendation is `default: english` with no overrides, and that matches the repository on all four media. **There are no differences.** The recommendation has no "if this repository…" conditions to check, and there's no reason to rule `rejected`: the repository has code, comments, commits and documentation, so the question applies.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | all docs, 1,435 commits, symbols and 2,547 comments are in English |
| `localization.language.documentation` | *(empty, so `english`)* | observed | `README.md`, `docs/*.md`, `.github/` templates |
| `localization.language.commits` | *(empty, so `english`)* | observed | `git log`: 1,427 of 1,435 subjects use Conventional Commits types, no French |
| `localization.language.code` | *(empty, so `english`)* | observed | `src/**/*.ts` symbols |
| `localization.language.comments` | *(empty, so `english`)* | observed | 0 French matches in 2,547 comments |

**Departures from the recommendation:** none. In the ADR, I would replace the "How to rule" block with one line saying the recommendation is adopted as is, since it describes what the repository already does.

**Before I write:** you'd need to tell me the `authors:` value, the names of the people deciding, without email addresses. `date:` would be 2026-11-15. I would also rewrite the Consequences lists to fit this repository. For example, the "French-speaking maintainer" cost doesn't apply to a project maintained in English.

Do you agree to rule ADR-0002 `accepted` with `default: english` and no overrides? Who should be listed as authors? I haven't written anything yet.

## ADR-0004

Splitting into simple calls.

I'm proposing **`accepted`** for ADR-0004 (Languages), with **`languages.main.name: TypeScript`**. The ADR's own tie-break would point to Python here; I depart from it because the whole codebase is already TypeScript.

### What the repository does today

- **Source code:** all 151 code files under `src/` are `.ts`. There is no `.js`, `.py`, `.go` or `.java` file in `src/`.
- **Compiler:** `tsconfig.json` extends `gts/tsconfig-google.json`. It compiles `src/**/*.ts`, `test/**/*.ts`, `system-test/*.ts` and `typings/**/*.d.ts` into `build/`.
- **Tooling:** `package.json` builds with `tsc -p .` (`compile`) and lints with `gts check` (`lint`). Tests run with mocha and c8 over the compiled `build/test`. `typescript` is a runtime dependency, and Node must be `>=22.0.0`.
- **CI:** `.github/workflows/ci.yaml` installs Node and runs `npm ci`, `npm test`, `npm run lint` and `npm run docs`. Nothing in CI uses another language.
- **Python:**
  - Almost every `.py` file is a test fixture for release-please's Python release strategy, such as `test/fixtures/strategies/python/setup.py` and `test/updaters/fixtures/version.py`. It is data, not code.
  - The other one is `owlbot.py`, a configuration script for Google's OwlBot repository tooling. It counts as secondary tooling, which the ADR says does not change the answer.
- **Declared language:** nothing in the repository names a main language today. The trait is empty, so the ruling only writes down what the code already does.

### Compared with the recommendation

- **Value:** `TypeScript` is one of the two recommended values. No justification for another language is needed.
- **Condition:** the ADR says to choose TypeScript "when the repository runs in a browser or shares code between browser and server", and Python otherwise. release-please is a Node CLI and library: `bin: ./build/src/bin/release-please.js`, `main: ./build/src/index.js`. It does not run in a browser. `"dom"` in the `tsconfig` `lib` setting only adds type definitions; nothing in the code targets a browser. Taken literally, the rule would point to **Python**.
- **Departure:** I keep TypeScript anyway:
  - The whole codebase, build, lint (`gts`), tests and CI are TypeScript.
  - It is published to npm and runs on Node, which is how release-please's GitHub Action uses it.
  - Rewriting it in Python would bring no benefit.
- **Rejected:** not justified. This is a code repository with a clear main language.

### Proposed ruling

| Field | Value |
| --- | --- |
| status | `accepted` |
| `languages.main.name` | `TypeScript`. **observed**: 151 `.ts` files in `src/`, `tsconfig.json`, `tsc` and `gts` in `package.json`, Node-only CI |
| date | 2026-11-15 |
| authors | `[Tristan Rivoallan]` (from git config; please confirm) |

If you agree, I'll edit the ADR:
- fill the trait, status, date and authors;
- replace the "How to rule" block with the reason for the departure;
- rewrite the Consequences lists;
- run `npx ontrack apply`.

After that I'll check whether the repository follows the ruling. It already does, so I expect no tracking items. No `tracking` trait is decided in AGENTS.md either, so I would create nothing in a tracker.

**Do you agree with this ruling (TypeScript, accepted, authored by Tristan Rivoallan)?**

## ADR-0006

Running `npx ontrack review` was not approved, so I'll work from the ADR text directly. Now the repository evidence.

I've finished going through the evidence. `npx ontrack review` needed approval and wasn't run, so I followed the ADR's own instructions.

## What the repository does today

**Versions come from commit messages, so the recommendation's condition holds:**
- `.github/release-please.yml` turns on the Release Please GitHub App with `manifest: true`.
- `release-please-config.json` sets `"release-type": "node"`, and `.release-please-manifest.json` holds `"." : "17.11.2"`.
- The history has dozens of `chore(main): release …` commits. The repository releases itself with release-please, from Conventional Commits.

**Format: followed in practice, never enforced.**
- 990 of the last 1000 commit subjects match the eleven types.
- `CONTRIBUTING.md:37` only asks contributors to "Title your pull request following Conventional Commits".
- Nothing enforces it:
  - No `commitlint` dependency or config, and no husky or other hook.
  - `.github/workflows/ci.yaml` runs test, lint, docs and build jobs, but nothing that checks commit messages.
  - The required status checks in `.github/sync-repo-settings.yaml` are `cla/google, docs, lint, test (18), windows`, with no commit-message check.
  - A Google org-level PR-title bot may exist, but nothing in the repository shows one.
- Squash and rebase merges are both allowed. With rebase merges, every individual commit reaches `main`, not just the PR title.

**Scopes: used heavily, never written down, and people make them up as they go.**
- Scopes in use: strategy names (`python`, `go-yoshi`, `php-yoshi`, `rust`…), plugin names (`node-workspace`, `cargo-workspace`…), `cli`, `manifest`, `github`, `changelog`, `deps`/`deps-dev` (from Renovate or Dependabot) and `main` (release PRs).
- The ADR's warning about made-up scopes is already happening here:
  - The same strategy appears as `java-yoshi-mono-repo`, `yoshi-java-monorepo` and `java-monorepo`.
  - `node` and `nodejs` are both used, and so are `docs`, `doc` and `readme`.
  - Some scopes are file names: `dependency-manifest.ts`, `changelog.json`, `src/updaters`.
  - Some are actually types: `fix(refactor)`, `fix(revert)`.

## Proposed ruling: `accepted`

| Key | Value | Marked | Evidence |
|---|---|---|---|
| `commits.tool` | `commitlint` | **absent** | The condition is met (release-please manifest config above). Nothing checks messages today. |
| `commits.scopes` | `[bazel, dart, dotnet-yoshi, elixir, expo, go, go-librarian, go-yoshi, helm, java, java-yoshi, java-yoshi-mono-repo, krm-blueprint, maven, node, node-librarian, ocaml, php, php-librarian, php-yoshi, python, python-librarian, r, ruby, ruby-librarian, ruby-yoshi, rust, sfdx, simple, terraform-module, cargo-workspace, group-priority, linked-versions, maven-workspace, merge, node-workspace, sentence-case, cli, manifest, github, changelog, updaters, versioning, deps, deps-dev, main]` | **observed** in practice, **absent** as a closed list | Each strategy and plugin scope is named after its file in `src/strategies/` and `src/plugins/`. That is the pattern most scoped commits already follow. `deps`, `deps-dev` and `main` come from the bots and from release-please's own release PRs, and would fail if left out. |

**Departures from the recommendation:**
- **`commits.tool`:** none. It is the recommended value, and its condition is met.
- **`commits.scopes`:** the ADR recommends no list here. The 46 scopes come from the repository's own layout and existing habits. They are many because users filter changes by language or strategy.

**What it takes to follow this ruling (not done yet):**
- Add `@commitlint/cli` and `@commitlint/config-conventional` as dev dependencies, plus a commitlint config with `scope-enum` set to the list above.
- Add a CI job. `actions/checkout` fetches only one commit by default, so the job needs `fetch-depth: 0`, and the ADR's `check:` line needs `--from origin/main`.

Do you agree with this ruling? Please answer three things:

1. **Scopes:** take the 46-scope list as proposed, use a shorter list (`strategies, plugins, cli, manifest, github, changelog, deps, deps-dev, main`), or use `[]` for no scopes?
2. **Tool:** `commitlint` as recommended, or `hook` or `none`?
3. **`authors:`:** is "Tristan Rivoallan" right? `date:` would be 2026-11-15.

Until you answer, I won't change any file. Once you agree, I'll fill in the ADR, run `npx ontrack apply`, and then list the rulings the repository doesn't follow yet. No `tracking` trait is decided yet, so that list will be in my reply and nothing will be created in a tracker.

## ADR-0009

Now the repository's actual practice: history, branches, CI, docs.

I'm checking one last thing — who writes this repo's `chore` and `build` commits — to decide whether the branch prefixes should go beyond the three recommended.

I've reviewed ADR-0009 (Branching) against the repository. Below is the ruling I propose. I haven't written anything yet.

## What the repository does today

- **How work reaches `main`: GitHub flow.** Every change arrives through a pull request on its own branch:
  - `.github/sync-repo-settings.yaml` protects `main`. It requires 1 approving review, a code-owner review, an up-to-date branch, and the checks `cla/google`, `docs`, `lint`, `test (18)` and `windows`.
  - `.github/workflows/ci.yaml` runs on `push` to `main`, on `pull_request` and on `merge_group`, so a merge queue is in use.
  - In the last 500 commits on `main`, all but 2 end with `(#N)`, the number of the pull request they came from. The 2 exceptions are direct pushes from 2022: `a001f0b` and `c95a20f`.
  - There is no `develop` or `release/*` branch. The one long-lived branch besides `main` is `12.x`, which keeps an old major version patched. It has its own protection rule and its own entry in `.github/release-please.yml`. That is a maintenance branch, not gitflow.
- **How a branch is merged: one commit per pull request.** In 1,433 commits on `main` there is a single merge commit, `bc87aa3` from 2019. The forge settings in `sync-repo-settings.yaml` are `squashMergeAllowed: true`, `rebaseMergeAllowed: true` and `mergeCommitAllowed: false`.
- **How branches are named: no convention.** Nothing in the repository names, documents or checks branches. `CONTRIBUTING.md:33` tells contributors to work from a fork. The branches currently on `origin` follow no single pattern:

  | Pattern | Branches |
  | --- | --- |
  | Commit-type prefix | `feat/ignore-submodules-422`, `feat/php-librarian`, `fix/java-yoshi-version-java-updates` |
  | No prefix | `fix-empty`, `test-java-rc`, `testing-rp-hacks` |
  | GitHub web editor | `parthea-patch-1`, `sofisl-patch-1` |
  | Bots | `owl-bot-update-lock-*` (6 branches), `release-please--branches--main--components--release-please`; Renovate (`renovate.json`) uses `renovate/` by default |

  I couldn't list the branch names of past merged pull requests: the `gh pr list` call was declined. So this sample covers only the branches still on `origin`.

## Proposed ruling: `accepted`

| Key | Value | Today | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | **observed** | Branch protection and required review on `main`, a pull request number on nearly every commit, CI runs on pull requests and the merge queue |
| `branching.merge` | `squash` | **observed** | One merge commit in 1,433, and merge commits are disabled in the forge settings |
| `branching.prefixes` | `[feat, fix, docs]` | **absent** | Only 3 of the 19 non-default branches use a prefix. These three types also cover most human commits: in the last 500, `fix` has 132 and `feat` 88, against `docs` 35, human `chore` 15 and human `build` 11 |

**Departures from the recommendation:** none, so the ADR would say "Adopted as recommended."

## What accepting it would mean

1. **Fork pull requests will fail the branch-name check.** The check reads `GITHUB_HEAD_REF`, which is also set for pull requests opened from forks. Branches like `*-patch-1` (from GitHub's web editor) would fail it.
2. **OwlBot is not exempted.** Its `owl-bot-update-lock-*` branches would fail the check. Only the release tool (ADR-0012) and the dependency updater (ADR-0018) are let through.
3. **The release-please and Renovate exemptions need two other ADRs.** They only apply once ADR-0012 and ADR-0018 are ruled, and both are still `proposed`.
4. **Rebase merging is still enabled.** The setting `rebaseMergeAllowed: true` would contradict `squash`. Turning it off is a forge setting, so it would become a follow-up item.
5. **`12.x` stays.** A maintenance branch is compatible with `github-flow`, and the check passes on any branch with no prefix list to match, so it isn't affected.

**Decision needed:** should I accept as proposed, with `[feat, fix, docs]`? The alternative is to add `build` and `chore`, which human contributors here use for dependency and tooling work; I'd record that departure and its reason in the ADR. I also need the name or names for `authors:`. When you agree, I'll edit only `docs/adr/trivoallan/ADR-0009-branching.md` and then run `npx ontrack apply`.

## ADR-0011

Checking a few more facts: the repo's required-check settings versus the CI job names, and whether zizmor is used anywhere.

I've read the ADR and checked the repository. I couldn't run `npx ontrack review`, `gh api` or `zizmor` because each needed an approval I don't have. So the ruling below comes from the files and git history, and nothing in it was checked against the live GitHub settings.

## What the repository does today

- **The forge is GitHub.** The remote is `github.com/googleapis/release-please`, and the pipeline is in `.github/workflows/ci.yaml`. So `rejected` does not apply.
- **There is one workflow, `ci`.** It runs on `push` to `main`, on `pull_request` and on `merge_group`. Its jobs are `test (22)`, `installation-test`, `windows`, `lint`, `docs` and `build-action`. Permissions are `contents: read` for the whole workflow, every action is pinned by SHA with the tag in a comment, and every checkout sets `persist-credentials: false`. Nothing uses `pull_request_target`, no secrets are used, and no job deploys.
- **Merges are meant to be blocked on red.** `.github/sync-repo-settings.yaml` protects `main` with `requiresStrictStatusChecks: true` and these required checks: `cla/google`, `docs`, `lint`, `test (18)` and `windows`. The merge queue (`merge_group`, added in #2375) points the same way.
  - **One required check is stale.** The settings require `test (18)`, but since #2812 (Node 22) the job reports as `test (22)`. Either the live ruleset differs from this file, or the file has drifted. I couldn't check which.
- **zizmor has been used by hand, not in CI.** Commit `9c29179` "ci: zizmor fix for workflow file" (#2829, 2026-06-26) pinned the SHAs and added `persist-credentials: false`. No workflow job, config file or script runs zizmor or actionlint today.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` — **observed** | `.github/sync-repo-settings.yaml:4-15` (strict required checks on `main`) and the `merge_group` trigger in `ci.yaml:6` |
| `forge.audit` | `zizmor` — **absent** | Only a manual run so far (`9c29179`). No job runs it, so the ruling adds a `zizmor-action` job pinned by SHA |

**Departures from the recommendation:** none. Both values match it. The ADR line will say "adopted as recommended", plus a note that the required check `test (18)` has to be renamed `test (22)` for the gate to be real.

**Fields I'd fill:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, unless you want other names. I'd also rewrite the Consequences for this repository, for example that a stale required-check name blocks the merge queue, and that the `windows` job adds flakiness exposure. The "How to rule" block gets deleted.

## Rulings the repository won't follow yet

Work tracking (ADR-0014) is not decided in AGENTS.md, so there's no tracker. I'll list these in my reply and create nothing:

- `[trivoallan/ADR-0011] forge.audit: add a zizmor job (zizmorcore/zizmor-action pinned by SHA) on pull requests`. This serves ADR-0011.
- `[trivoallan/ADR-0011] forge.gate: replace the stale required check "test (18)" with "test (22)" in sync-repo-settings.yaml and the live ruleset`. This serves ADR-0011, and the live ruleset is unverified.

Do you agree with this ruling (`accepted`, `forge.gate: blocking`, `forge.audit: zizmor`, authors `Tristan Rivoallan`)? I'll write nothing until you confirm. Once you do, I'll edit only ADR-0011 and run `npx ontrack apply`.

## ADR-0023

I've read the ADR and the repository's licence evidence. Here is the proposed ruling for your decision.

`npx ontrack review trivoallan/ADR-0023-license` needed approval I didn't have, so I followed the ADR's own "How to rule" steps.

## What the repository does today

| Point | Evidence |
| --- | --- |
| Licence file at the root | `LICENSE` holds the full Apache License 2.0 text. It goes back to the first commit (`c6dc492 feat: initial commit of library`) and was regenerated by `d11ce7d chore: generate common files using synthtool`. |
| Manifest declares it | `package.json:30` → `"license": "Apache-2.0"`. There is no `pyproject.toml`. The other `package.json` files are test fixtures under `test/`, which the check doesn't read. |
| Copyright holder | The repo is `googleapis/release-please`. Source files carry `// Copyright 2021 Google LLC` with Apache-2.0 headers (e.g. `src/index.ts:1`). |
| Copyright line in `LICENSE` | **Missing.** Only the unfilled appendix template is there: `Copyright [yyyy] [name of copyright owner]`. |
| `NOTICE` file | None. |
| Published package | Yes: `"name": "release-please"`, and no `"private": true`. |

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `Apache-2.0`** (observed). `package.json:30` and the root `LICENSE` already say this. The check (manifest equals the key, licence file at the root) would pass today.

**Differences from the recommendation:**

1. **`Apache-2.0` instead of `MIT`.** Apache-2.0 has been the licence since the first commit, and every released version was published under it. The copyright holder is Google LLC, so switching to MIT would be a relicensing that needs their consent. It would also only cover new versions. The ADR names Apache-2.0 itself as the choice "when an explicit patent grant matters," which is the case for an organisation like Google.
2. **Fixed point 3 (copyright line in the licence file) is not met.** `LICENSE` has no filled copyright line. The check doesn't look at this, and it isn't a trait, so the ruling doesn't depend on it. I'd list it as a follow-up and leave `LICENSE` unchanged in this ruling.

**Other fields:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]` (from your git user, unless you want other names). I'd rewrite the Consequences for Apache-2.0: patent grant and termination clause; whoever redistributes must keep the licence and any `NOTICE`; longer text. Then I'd delete the "How to rule" block, put the reasons above in its place, and run `npx ontrack apply`.

**Do you agree with ruling `accepted` with `license.spdx: Apache-2.0`, and with `authors: [Tristan Rivoallan]`?** I won't write anything until you confirm or change it.

## ADR-0025

I've read the ADR and checked the repository. Here is the proposed ruling.

I couldn't run `npx ontrack review`, which AGENTS.md asks for, because it needed approval. I worked from the ADR's own "How to rule" steps instead.

## What the repository does today

- **No other ADR has been ruled on.** Every ADR except ADR-0001 is `proposed`, including ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 (`vulnerabilities.scanner`). So no accepted ADR names a tool that sits outside the package manager.
- **Nothing is installed outside npm.** There's no `mise.toml`, `aqua.yaml`, `.tool-versions`, install script, `.husky` or `.pre-commit-config.yaml`, and `.git/hooks` only holds the sample files. `.github/workflows/ci.yaml` only runs `npm ci` and pinned actions (`setup-node`, `linkinator-action`). The `.kokoro` scripts are the old Google CI and don't install any such tool.
- **zizmor has been used, but by hand.** Commit `9c29179` ("ci: zizmor fix for workflow file") fixed findings from zizmor. Nothing in the repository installs or runs it, so someone ran it locally. That's the "each place does it its own way" situation the ADR describes, but it happened once, with no ADR requiring it.
- **The repository uses Renovate, not Dependabot.** `renovate.json` extends `config:best-practices`, so Renovate's `mise` manager would work here with no extra setup. That matters for rule 4 if you choose `mise` later.

## Proposed ruling

**Status: `accepted`**

| Key | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `none` | observed | No accepted ADR names a tool, and no out-of-manifest tool is installed anywhere (file list and `ci.yaml` above) |

**How this departs from the recommendation:** the ADR recommends `script` for one tool and `mise` or `aqua` for several. Neither fits yet because there are no tools. The ADR itself says "`none` is an answer only when no accepted ADR names such a tool", and that's the case here.

**Rule 4 (what keeps pins current):** there are no pins to keep current. If ADR-0011, ADR-0015 or ADR-0019 is later accepted with a named tool, the `check:` fails while this says `none`, and the ADR has to be ruled again.

**Alternative if you plan to accept those three ADRs as recommended:** that brings in three tools (zizmor, gitleaks, grype), which points to `mise` (currently absent). Renovate's `mise` manager is already available through `config:best-practices`, and it updates `mise.lock` along with the versions.

`rejected` doesn't fit, because the question does apply: CI exists and zizmor has been used here.

Do you agree with `tools.manager: none`, or would you rather rule `mise` now? I also need the name(s) to put in `authors:` (the ADR asks for names without email addresses). I'll write nothing until you answer.