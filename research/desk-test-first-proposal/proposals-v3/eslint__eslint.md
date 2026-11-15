=================== eslint__eslint ADR-0002
Now gathering evidence on the repository's language use.

I recommend accepting the ADR with its recommendation unchanged: `default: english` and no overrides. Everything this repository writes is in English today, so nothing changes.

## What the repository does today

Nothing in the repository writes the language down. No file, config or CI check states it, except one line in `docs/src/contribute/package-json-conventions.md:14`, which says npm script names should use "a full English word". In practice everything is in English:

- **Documentation:** the site under `docs/src/` is English, and `docs/src/_data/sites/en.yml` is the only site config in the repository. `docs/src/_data/languages.json` lists translated sites (`ja`, `fr`, `cn`) at separate domains such as `ja.eslint.org`. Those translations are maintained outside this repository, so they don't count against an English default here.
- **Commits:** I checked the last 2000 commit subjects for French, and they are all English Conventional Commits (for example `ci: bump …`, `fix: update dependency …`). The single hit was a false positive.
- **Code and comments:** the names and comments in `lib/` are English, and so are the error texts in `messages/*.js`.

**Compared with the recommendation:** no differences. The recommended value is what the repository already does. Nothing in it is conditional, and nothing points to `rejected`, because the repository clearly has documentation, commits, code and comments, so the question applies.

## Proposed ruling

**Status:** `accepted`

- `localization.language.default: english (observed)`: English docs (`docs/src/`, `sites/en.yml`), English commit history, English names and comments in `lib/`.
- `localization.language.documentation:` left empty, so it follows `default`.
- `localization.language.commits:` left empty, so it follows `default`.
- `localization.language.code:` left empty, so it follows `default`.
- `localization.language.comments:` left empty, so it follows `default`.

**Departures from the recommendation:** none. The ADR would say it adopts the recommendation as is.

## Before I write anything

The ADR needs `date:` and `authors:`. I'd use `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, the name from your git config, without the email.

If you agree, I will fill the frontmatter and set the status. I will rewrite the Consequences lists for this repository: a French-speaking maintainer isn't relevant to ESLint, and the cost becomes that translations live outside this repository. I will replace the "How to rule" block with a line saying the recommendation is adopted as is, then run `npx ontrack apply`.

**Do you agree with this ruling, and with that date and author?**

After the ruling, nothing will need tracking, because the repository already writes everything in English. No `tracking` trait is decided either (ADR-0014 is still proposed), so I won't create any tracker items in any case.
=================== eslint__eslint ADR-0004
Checking how `tsconfig.base.json` is used, then I'll propose the ruling.

I'm proposing **`accepted`** with **JavaScript** as the main language. ESLint is written in JavaScript today, which is neither of the two languages the ADR recommends (Python or TypeScript).

**What the repository does today**
- **Source code:** 413 tracked `.js` files across `lib/`, `bin/`, `conf/`, `tools/` and `packages/js/src`. There are no `.ts`, `.py`, `.go` or `.rs` source files outside test fixtures.
- **`package.json`:** `"type": "commonjs"`, `"main": "./lib/api.js"`, Node `^20.19.0 || ^22.13.0 || >=24`. There is no build or compile step, so the `.js` files in `lib/` are what gets published.
- **Where TypeScript appears:** only around the published type definitions.
  - Hand-written `.d.ts` files in `lib/types/` and `packages/*/types/`.
  - Type tests in `tests/lib/types/types.test.mts`, run by `npm run test:types` and in `.github/workflows/ci.yml:132` (`npx tsc -p tests/lib/types/tsconfig.json`).
  - `tsconfig.base.json` turns on `allowJs`/`checkJs`, but the configs that extend it turn both off. So the JavaScript source is not type-checked by `tsc`.
- **`AGENTS.md`** already says "CommonJS (`"type": "commonjs"`)", and its rule and test conventions are all written for JavaScript.

**Proposed ruling**

Status: `accepted`

- `languages.main.name: JavaScript (observed)`: 413 `.js` source files, `"type": "commonjs"`, `main: ./lib/api.js`, no build step. TypeScript is only used for `.d.ts` files and type tests.

**Departures from the recommendation**
- **JavaScript instead of Python or TypeScript.** The ADR allows another language when the reason is "an ecosystem the repository depends on":
  - ESLint is the JavaScript linter. Its plugin and rule API (`{ meta, create }`, `RuleTester`) is what the JS ecosystem writes against.
  - It publishes its source as-is, with no compile step.
  - Its TypeScript users are already served by hand-maintained `.d.ts` files, which are tested on TypeScript 5.3, 5.x and 7.x.
  - Moving to TypeScript would mean rewriting more than 400 files and adding a build step, which the ruling doesn't need to do. Python doesn't fit at all.
- **TypeScript stays secondary**, limited to the `.d.ts` files and type tests. The ADR's Neutral consequence says secondary languages don't change the answer.

Nothing here is held outside the repository, so there is nothing I couldn't see. If you agree, I'll write it into the ADR:
- fill the trait, status, date, and authors (`Tristan Rivoallan`);
- rewrite the Consequences section;
- replace the "how to rule" block with this justification;
- run `npx ontrack apply` to update `AGENTS.md`.

Do you agree with this ruling, or do you want a different value?
=================== eslint__eslint ADR-0006
Now the repository's current practice.

I've finished reading the repository. Here is my proposed ruling for ADR-0006. I haven't written anything yet.

## What the repository does today

- **The commit format is Conventional Commits with no scopes.** `docs/src/contribute/pull-requests.md:61` says "we don't support the optional scope in messages". It lists 11 tags: `fix`, `feat`, `fix!`, `feat!`, `docs`, `chore`, `build`, `refactor`, `test`, `ci`, `perf`. AGENTS.md says the same ("without scopes").
- **History follows that rule.** Of the last 2,000 commits, 0 use a scope and 1,819 have the form `type:`. Most of the rest are release commits like `10.15.0` and `Build: changelog update for 10.15.0`, which `eslint-release` writes itself.
- **Versions come from commit messages.** `package.json:189` depends on `eslint-release ^3.3.0`, and `Makefile.js:373` calls `ReleaseOps.generateRelease()`. That tool picks the version bump from the commit tags and builds `CHANGELOG.md` from the commit summaries. v10.15.0 is an example: it contains `feat:` commits and went up a minor version. So the condition in the ADR ("if this repository generates its versions from commit messages") is **true**.
- **Nothing in the repository checks commit messages.**
  - No `commitlint` in `package.json` (`grep commitlint` finds nothing).
  - No `commit-msg` hook. `gitHooks` (yorkie) only runs `pre-commit: lint-staged`.
  - None of the 10 workflows in `.github/workflows/` checks commit messages or PR titles.
- **The checking happens outside the repository.** `pull-requests.md:71` says the PR title "will be checked when the pull request is submitted". Line 153 says PRs are squash-merged and the PR title becomes the commit summary. Line 180 says later commits on a PR branch "do not need to be in any specific format". The PR-title check is done by something configured outside this repository, probably ESLint's GitHub bot or app, and I can't see how it is set up.

## Differences from the recommendation

1. **The tool.** The ADR recommends `commitlint` when its condition is true, and here it is. But the check that `ontrack` would run lints every commit between `origin/HEAD` and `HEAD`. That goes against ESLint's own rule that branch commits are free-form, so the check would reject ordinary contributor PRs. ESLint checks the PR title instead, because that is the only message that ends up on `main`.
2. **The list of types (not up for ruling, but a mismatch).** Governance requires 11 types including `style` and `revert`. ESLint doesn't list either of those and handles breaking changes with `fix!`/`feat!`. ESLint's types are therefore a subset of governance's, which is allowed but leaves two types unused.

## Proposed ruling

**status: `accepted`**

- `commits.scopes: [] (observed)`: the docs forbid scopes (`pull-requests.md:61`, AGENTS.md), and 0 of the last 2,000 commits use one.
- `commits.tool: none (observed)`: the repository has no commitlint, no commit-msg hook and no CI job that checks messages. Something outside the repository checks PR titles, and squash-merge makes the title the commit on `main`.

**Departure:** `commits.tool` is `none`, not `commitlint`. Running commitlint on branch commits contradicts the documented free-form branch policy (`pull-requests.md:180`). The PR-title check done outside the repository is what guards the version calculation.

**The alternative** is `commits.tool: commitlint (absent)`. That would mean adding `@commitlint/cli` and `@commitlint/config-conventional`, and either linting PR titles in CI or changing the `check:` line to compare only the squash commit. It also makes the docs at line 180 wrong.

## Before I write anything

1. **Do you agree with `accepted`, `scopes: []` and `tool: none`, or do you want `tool: commitlint`?**
2. **What should go in `authors:`?** I'd use "Tristan Rivoallan" from git config unless you tell me otherwise. `date:` would be 2026-11-15.
3. **Can you confirm the PR-title check?** It lives outside the repository (probably the GitHub bot's configuration in another repo or the org's GitHub settings), so I can only cite the docs as evidence that it exists. If you can confirm it, I'll name it in the ADR.
=================== eslint__eslint ADR-0009
Now the repository evidence.

I've read the ADR and checked the repository. Here is what I found and the ruling I'd propose. Nothing is written yet.

## What the repository does today

| Question | Evidence | Today |
|---|---|---|
| **How work reaches `main`** | `docs/src/contribute/pull-requests.md:40-49` says to make one branch per issue in your fork, then open a PR. All CI workflows run on `pull_request` → `main` (`ci.yml:4-6`, `types-integration.yml`, `docs-ci.yml`, `codeql-analysis.yml`, `ecosystem-tests.yml`). Every recent commit ends in `(#NNNNN)`. | github-flow |
| …exceptions | Two kinds of commit land on `main` with no PR. `tools/commit-readme.sh:14-17` (run by `update-readme.yml`) pushes `docs: Update README` straight to `main`. Release commits (`10.15.0`, `Build: changelog update for 10.15.0`) have no PR number either; they come from release tooling that this repository doesn't contain. There are also maintenance branches (`v9.x-dev`, `v8.x`, `latest`, `next`), but no `develop`/`release` cycle, so it isn't gitflow. | bot pushes to `main` |
| **Merge style** | `pull-requests.md:153` and `:178` say PR commits are "squashed into one single commit". In history, `git log --merges` finds the last merge commit on 2016-04-23 (`0c0159ba6`, #5849) and none since. | squash |
| **Branch prefixes** | Nothing enforces a branch-name format: no hook or CI check, and `lint-staged` only regenerates files. The docs recommend `git checkout -b issue1234` (`pull-requests.md:45`), which has no prefix. Of 134 remote branches, 24 use a commit-type prefix (`feat` 11, `fix` 6, `chore` 3, `docs` 2, `perf` 1, `ci` 1). The rest are free-form (`issue18385`, `copilot/…`, `ts/…`, `fix-add-uniqueitems-…`) or bot branches (`renovate/…`, and `update-ecosystem-plugins-<timestamp>` from `ecosystem-updates.yml:29-30`). | none |
| Merge setting and branch protection | These live in GitHub's settings for `eslint/eslint`, which I can't see. The docs and history above are strong indirect evidence for squash. | not visible |

**The ADR's condition:** the check exempts `dependabot/`, `renovate/` and `release-please--` branches only once ADR-0012 and ADR-0018 are ruled, and both are still `proposed` (AGENTS.md, "Not yet decided"). Even after they're ruled, `update-ecosystem-plugins-*` and `copilot/*` branches match no exemption and would fail the check.

## Proposed ruling: `accepted`

- `branching.model: github-flow (observed)`: one branch and one PR per issue (`pull-requests.md:40-49`), and CI is gated on PRs to `main`.
- `branching.merge: squash (observed)`: `pull-requests.md:153,178`, and no merge commit since 2016-04-23.
- `branching.prefixes: [feat, fix, docs, chore, ci, perf, refactor, test, build] (absent)`: there's no prefix convention today and the docs recommend `issue1234`. These nine are the commit types AGENTS.md allows ("Conventions"), and six of them already appear in branch names.

## Departures from the recommendation

1. **The prefix list is longer than `[feat, fix, docs]`.** Many ESLint changes are `chore:` (dependency updates, ecosystem plugins) or `ci:` (action bumps), and some are `perf:`, `refactor:`, `test:` or `build:`. With only three prefixes, about a third of the real PRs would have no correct branch name. All nine come from the eleven commit types, so this adds no new prefix. `style` and `revert` are left out because AGENTS.md doesn't list them.
2. **Bot pushes straight to `main` stay as they are.** The README bot and release commits are automated and make no code change, so I'd note them in the ADR as an accepted exception rather than a reason to rule `trunk-based`.

The ruling also has consequences:
- The check reads `GITHUB_HEAD_REF`, so PRs from fork branches named `issue1234`, as the docs currently advise, would fail once the check runs in CI.
- `pull-requests.md` would need updating.
- `update-ecosystem-plugins-*` and `copilot/*` branches would also fail.

## Questions before I write anything

1. Do you agree with `accepted` and the three values above? Or would you rather keep `[feat, fix, docs]`, or use only the six prefixes already seen (`feat, fix, docs, chore, ci, perf`)?
2. Can you confirm that `eslint/eslint` allows only squash merging in GitHub's settings? I can't see that setting.
3. What `date:` and `authors:` should I write? I'd use `2026-11-15` and `[Tristan Rivoallan]` unless you say otherwise.

Once you agree, I'll edit only `docs/adr/trivoallan/ADR-0009-branching.md` and run `npx ontrack apply`. Then I'll list the rulings the repository doesn't follow yet. No `tracking` trait is decided (ADR-0014 is still proposed), so that list will be in my reply and I won't create any tracker items.
=================== eslint__eslint ADR-0011
I'm drafting the ruling now. I could read every workflow, but GitHub's branch rules for `main` were not available to me (the `gh api` call was declined).

## What the repository does today

- **Forge:** GitHub (`origin` → `github.com/eslint/eslint`). There are 10 workflows in `.github/workflows/`. Because the forge is GitHub, `rejected` does not apply.
- **Gate:** `ci.yml`, `docs-ci.yml`, `types-integration.yml`, `ecosystem-tests.yml` and `codeql-analysis.yml` run on `pull_request` to `main`. Whether a red run blocks a merge depends on a ruleset or branch protection on GitHub. Nothing in the repo says either way, and I couldn't query it.
- **Audit:** nothing like zizmor is set up. There is no `zizmor.yml`, no zizmor job, and zizmor isn't mentioned anywhere outside `docs/adr/`. What does exist is **actionlint**: `ci.yml:26-27` runs `actionlint -color -shellcheck= -pyflakes=` on every PR. The ADR treats that as a linter, not an audit. CodeQL runs only `language: ["javascript"]` (`codeql-analysis.yml:35`), not `actions`.

**Compared with the five fixed rules:**
- **Rule 3 (pin by SHA) is broken in many places.**
  - Every `actions/*` reference uses a tag that can be moved (`actions/checkout@v7`, `setup-node@v7`, `github-script@v9`, `labeler@v7`, …).
  - `github/codeql-action/*@v4.39.3` uses a tag.
  - The reusable workflows `eslint/workflows/...@main` (`ci.yml:151`, `stale.yml:13`) point at a branch.
  - Third-party actions *are* pinned by SHA with the tag in a comment (pnpm, restackio, peter-evans, Ilshidur).
- **Rule 5:** `pr-labeler.yml` uses `pull_request_target`, but it only runs `actions/labeler` and does not check out the PR's code. So it doesn't break the rule, but zizmor will flag it as `dangerous-triggers`.
- **Rule 4:** `rebuild-docs-sites.yml:20` puts `secrets.NETLIFY_DOCS_BUILD_HOOK` straight into a `run:` curl command. GitHub hides the value in logs, so this is something to check in review rather than a confirmed leak.
- **Rules 1 and 2:** there is no `environment:` and no deploy job. Docs rebuild through a Netlify hook on pushes to `main`, and secrets live in repository secrets.

## Proposed ruling

**Status:** `accepted`

- `forge.gate: ? (not marked)`: I can't tell. The PR workflows exist, but whether their checks are *required* is set in the rulesets or branch protection for `eslint/eslint` → `main` on GitHub (Settings → Rules). I recommend `blocking`, but I need you to confirm what is configured, or whether you mean `blocking` as an intent you will make real.
- `forge.audit: zizmor (absent)`: no zizmor anywhere. Today only actionlint (`ci.yml:26`) reads the workflows.

**Departures from the recommendation:** none planned. Once ruled, a few things in the repo won't match yet: there is no zizmor job, many references aren't pinned by SHA (the `actions/*`, the codeql action and the `@main` reusable workflows), and `pr-labeler.yml` still uses `pull_request_target`.

I'll write nothing until you answer.

1. What does GitHub enforce on `main`: are the CI checks required, so the gate is `blocking`, or only reporting, so `informative`?
2. Do you agree with `forge.audit: zizmor`, or do you prefer to keep actionlint only, which would be recorded as a departure with your reason?
3. Which names go in `authors:`?
=================== eslint__eslint ADR-0023
I've reviewed ADR-0023 (License). This repository already has a licence, and it is the one the ADR recommends.

## What the repository does today

- **Root manifest:** `package.json:240` declares `"license": "MIT"`. There is no `pyproject.toml`.
- **Licence file:** `LICENSE` is committed at the root and holds the full MIT text.
- **Copyright holder:** the copyright line in `LICENSE` is "OpenJS Foundation and other contributors", which is the organisation that owns the repository. The last change to that line was commit `81f03b6ad` ("Docs: Update license copyright (#14877)").
- **Published packages:** `packages/js` and `packages/eslint-config-eslint` also declare MIT and each has its own `LICENSE`. The docs workspace (`docs/package.json`) is private but also says MIT. The ADR's check doesn't read these subfolder manifests, but they agree with the root anyway.
- **Out of scope:** `Makefile.js` already checks the licences of dependencies (`npm-license`, `OPEN_SOURCE_LICENSES`). The ADR leaves that question to ADR-0019, so it doesn't affect this ruling.

**Compared with the recommendation:** the ADR recommends `MIT`, and the repository uses MIT. Its three fixed requirements are all met: the root manifest declares the value, a `LICENSE` file is at the root, and the copyright line names the owning organisation. I found no differences. The ADR has no conditional recommendations to check.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: MIT (observed): package.json:240 "license": "MIT"; root LICENSE holds the MIT text, copyright "OpenJS Foundation and other contributors"`

**Departures from the recommendation:** none. In the ADR I'd write one line saying the recommendation is adopted as is, because it matches what the repository already does.

Once you agree, I'll do this in `docs/adr/trivoallan/ADR-0023-license.md` only, then run `npx ontrack apply`:
- set `traits.license.spdx` to `MIT` and `status` to `accepted`;
- set `date` to `2026-11-15`;
- rewrite the Consequences section;
- replace the "How to rule" block with the line saying the recommendation is adopted.

**Two questions before I write anything:**
1. Do you agree to rule `accepted` with `license.spdx: MIT`?
2. Who should be listed in `authors:` as the people who decided? Your name, "Tristan Rivoallan", or someone else? I won't include email addresses.
=================== eslint__eslint ADR-0025
Still gathering evidence: I found one tool CI installs outside npm (actionlint), so now I'm checking the history behind it.

I'm proposing `accepted`, with `tools.manager: script`. The repository installs exactly one tool outside npm today, actionlint, and only on the CI runner. Nothing pins it with a checksum, and no workstation or agent session installs it.

## What the repository does today

- **No tool manager.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions` or devcontainer.
- **One tool outside the package manager.** `.github/workflows/ci.yml:24-27` installs actionlint with `go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.10`. It is pinned by version only. Go checks the download against its public checksum service (sum.golang.org), but no checksum is committed. Go itself is unpinned (`go-version: "stable"`, line 19).
- **It runs on the runner only.** The pre-commit hook (`gitHooks` → `lint-staged` in `package.json:96-99`) never calls actionlint. No agent session setup exists either. So actionlint runs in CI and nowhere else.
- **History.** actionlint was added in `dbb4c9582` (2026-03-19, "chore: remove trunk"), which also removed Trunk, the tool manager the repository used before (`.trunk/trunk.yaml`). Its version has never moved since.
- **What updates the pins.** `.github/dependabot.yml` covers `github-actions` only. `.github/renovate.json5` builds on `github>eslint/workflows//.github/renovate/base.json5`, which is outside this repository. Nothing here bumps the version in the `go install` line.
- **Which ADRs name a tool.** Only ADR-0001 is accepted. ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`) are still `proposed`. So no accepted ADR names a tool yet.

## Compared with the recommendation

- **Condition "`script` with one tool, a manager with several".** There is one tool, actionlint (`ci.yml:26`), so the recommendation is `script`.
- **Condition "`none` only when no accepted ADR names a tool".** This is technically met, since only ADR-0001 is accepted. But the ADR lists "a workflow linter" as a tool it covers, and actionlint is one. The question applies here, so neither `none` nor `rejected` fits.
- **Rule 1 (a version and a checksum in one place):** not met. actionlint has a version but no committed checksum.
- **Rule 2 (the same place for workstation, runner and agent session):** not met. Only the runner installs it, through a line inside the workflow.
- **Rule 3 (the manager installed pinned):** doesn't apply, because `script` needs no manager.
- **Rule 4 (who moves the pins):** nothing is written down, and nothing in the repository moves the actionlint pin.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: script (absent)`: the repository has no pinning script. actionlint is installed inline at `.github/workflows/ci.yml:26` with a version and no committed checksum, and only on the runner.

**Departures from the recommendation:** none.

One thing to keep in mind: if ADR-0015 or ADR-0011 are later accepted with gitleaks or zizmor, there will be two or three tools. The recommendation would then become `mise` or `aqua`, and this ruling would be worth revisiting.

## Before I write anything

1. **Do you agree with `accepted` / `script`?** The other answer I can defend is `none`, since no accepted ADR names a tool yet. But that would leave actionlint as the inconsistent install this ADR was written to end.
2. **Rule 4: who or what moves the actionlint pin and its checksum?** My suggestion is "a maintainer, by hand, in one pull request". The shared Renovate config could instead have a regex manager for this. It lives in `eslint/workflows` (`.github/renovate/base.json5`), which I can't see, so tell me if it does.
3. **`authors:`** Which names should go in? Without email addresses.
