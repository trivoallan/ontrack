# eslint__eslint

## ADR-0002

The repository already uses English everywhere, so I suggest accepting the recommendation unchanged.

**What the repository does today**
- **Documentation:** the docs site exists only in English. `docs/src/_data/config.json:2` sets `"lang": "en"`, and the only site config is `docs/src/_data/sites/en.yml`, which sets `locale: en-US`. There are no translated sites or translation setup. `README.md`, `CONTRIBUTING.md`, `SUPPORT.md` and `CHANGELOG.md` are in English.
- **Commits:** all of the last 2000 commit subjects are in English Conventional Commits. A search for French words found two commits, and both were false matches ("defaultOptions", "schema correction"). CI checks PR titles because they become the changelog.
- **Code and comments:** symbols and JSDoc in `lib/` are in English. `docs/src/contribute/package-json-conventions.md:14` requires npm script names to be "a full English word".
- **Nothing written down:** no file says which language to use. The rule exists only in practice.

**Comparison with the recommendation:** they match exactly (`default: english`, no overrides). There are no differences and no conditions to check.

**Proposed ruling: `accepted`**

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | `docs/src/_data/config.json` `lang: en`, `sites/en.yml` `locale: en-US`, 2000 commits in English, English code and comments in `lib/` |
| `localization.language.documentation` | *(empty, so English)* | observed | English is the docs site's only language |
| `localization.language.commits` | *(empty, so English)* | observed | Conventional Commits in English throughout the history |
| `localization.language.code` | *(empty, so English)* | observed | English symbols, and `package-json-conventions.md:14` requires English words |
| `localization.language.comments` | *(empty, so English)* | observed | English comments and JSDoc in `lib/` and `tests/` |

**Departures from the recommendation:** none. In the ADR I would write one line saying it is adopted as is, matching what the project already does.

**Rulings the repository does not follow yet:** none. Every value is already observed, so there is nothing to track. No `tracking` trait is decided either (ADR-0014 is still proposed), so I would not create any tracker items in any case.

If you agree, I'll apply the ruling: fill `default: english`, set `status: accepted`, set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences section, and delete the how-to-rule block. Then I'll run `npx ontrack apply`. Do you agree, or do you want to change something, such as the authors list?

## ADR-0004

Now the repository's evidence.

I've read the ADR and the repository's code. My proposed ruling: **`accepted`, with `languages.main.name: JavaScript`**. JavaScript isn't one of the two languages the ADR recommends, so the ruling needs a written reason.

## What the repository does today

- **Nearly all the code is JavaScript.** Git tracks 1,483 `.js` files, 390 of them in `lib/` and `bin/`. It tracks only 21 `.ts` files, and every one is a type declaration (`.d.ts`): 5 in `lib/types/`, 5 under `packages/*/types/`, and the rest are type tests under `tests/`. No TypeScript source is built into the shipped code.
- **The package says so too.** `package.json:6` sets `"type": "commonjs"`, `package.json:10` sets `"main": "./lib/api.js"`, and `package.json:242` requires Node `^20.19.0 || ^22.13.0 || >=24`. AGENTS.md's Conventions section says the same.
- **TypeScript is used only to check the published type declarations.** `tsconfig.types.json` sets `allowJs: false` and `checkJs: false` and includes only the `types` folders. `npm run test:types` runs `tsc` on those declarations. The JavaScript source is never type-checked.
- **The code also runs in a browser.** `npm run test:browser` runs Cypress against a webpack bundle of `Linter`.
- **History:** I found no commit that moves the source to TypeScript. The commits that mention "TypeScript" are about rules that handle TypeScript syntax.

## Compared with the recommendation

The ADR recommends Python or TypeScript, and TypeScript when the code runs in a browser or shares code between browser and server. That condition holds here, because `Linter` is bundled for the browser, so by the ADR's own guidance the answer would be TypeScript. The repository uses JavaScript instead. That is the only difference.

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name: JavaScript`**, **observed**. Evidence: the file counts above, `"type": "commonjs"`, and `main: ./lib/api.js`. TypeScript appears only as hand-written `.d.ts` files.
- **The reason for departing from the recommendation**, to be written in the ADR:
    - About 1,480 JavaScript files are already written, with their tests, docs and tooling (`Makefile.js`, RuleTester, the coverage gates).
    - Moving to TypeScript would mean rewriting the whole project. It would also add a build step to a package that today ships its source as-is to Node and to the browser bundle.
    - The published API gets types through the hand-written `lib/types/*.d.ts`, which `tsc` checks in `npm run test:types`. So keeping JavaScript doesn't lose the typing benefit that motivates the recommendation.
- **What else changes in the ADR:** `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, the Consequences lists rewritten for this verdict, and the "How to rule" block deleted.

Do you agree with this ruling, or would you like a different value or wording? I'll write nothing until you confirm. Once you do, I'll update the ADR, run `npx ontrack apply`, and then list the rulings the repository doesn't follow yet. I expect this one to need no tracking item, because the repository already follows it.

## ADR-0006

Still gathering facts: release tooling found (eslint-release); next I confirm it derives versions from commit messages and check history for scopes.

## Proposed ruling for ADR-0006 (Commits)

My proposal is to accept the ADR. The repository already uses no scopes, so `commits.scopes: []`. For `commits.tool` I propose `commitlint`, which the repository does not run today. Nothing has been written yet.

### What the repository does today

- **Format: Conventional Commits, without scopes.** `docs/src/contribute/pull-requests.md:61` says the project follows Conventional Commits and adds "(Note: we don't support the optional scope in messages.)" AGENTS.md says the same ("Conventional Commits without scopes").
- **History matches.** Of the last 1000 subjects on `main`, 910 have the `type:` form. None has a `type(scope):` form. The other 90 are release commits (`10.15.0`, `Build: changelog update for 10.15.0`). Counts by type: docs 230, chore 228, fix 177, feat 114, test 68, ci 58, refactor 28, perf 5, build 2.
- **Squash merge.** Only the PR title reaches `main` (`pull-requests.md:153`). Commits after the first one on a branch "do not need to be in any specific format" (`pull-requests.md:180`).
- **Nothing in the repository enforces the format.** Line 71 of the guide says PR titles are checked when a pull request is submitted. No file in `.github/workflows/` does that check, so it runs outside this repository. There is no commitlint or `commit-msg` hook. The only git hook is `pre-commit: lint-staged` (`package.json:96-97`), and it formats files; it doesn't check messages.

### The condition in the recommendation: does this repository generate its versions from commit messages?

**Yes.** `Makefile.js:373` calls `ReleaseOps.generateRelease(...)` from `eslint-release` (`package.json:189`). That tool reads the commit types to choose the next version, and `pull-requests.md:154` says PR titles "are used to create a changelog for each release." I couldn't read the `eslint-release` source because `node_modules` isn't installed. The history is consistent with it: `10.15.0` is a minor release that follows `feat:` commits. So the condition holds and the `commitlint` recommendation applies.

### Proposed traits

| Key | Value | Status | Evidence |
| --- | --- | --- | --- |
| `commits.scopes` | `[]` | **observed** | Scopes are forbidden in `pull-requests.md:61`, and 0 scoped subjects appear in the last 1000 |
| `commits.tool` | `commitlint` | **absent** | Versions come from commit messages (`Makefile.js:373`), and nothing in this repository checks the format today |

### Differences from the recommendation

1. **Scopes:** the ADR gives no default, and `[]` is a valid answer. No difference.
2. **Tool:** none. I follow the recommendation. There are two things to weigh before agreeing:
   - **The check would cover more than the project's convention.** With `commitlint`, the ADR's check lints every commit between `origin/HEAD` and `HEAD`. ESLint only requires the PR title to follow the format, and intermediate branch commits may be free-form (`pull-requests.md:180`). Unless the check only ever runs on squashed commits, it would reject commits the contribution guide allows.
   - **The other option is `none`.** Its reason would be: the format is already enforced on PR titles, outside this repository, and after a squash merge the title is the only message that reaches `main`. Choosing it would be a departure from the recommendation, and I would write that reason in the ADR.
3. **Types (not open to a ruling, but different):** governance sets eleven types. ESLint's guide lists nine: `style` and `revert` are missing, and 0 of the last 1000 commits use either. They could still be used without breaking anything, but the guide doesn't mention them.

**Do you agree with this ruling: accepted, `scopes: []`, `tool: commitlint`? Or would you choose `tool: none`, with the reason above? Please also tell me which names go in `authors:`.** I'll write nothing until you answer.

## ADR-0009

Still gathering evidence: checking maintenance branches and whether anything lands on `main` outside pull requests.

I'm proposing **`accepted`** for [ADR-0009](docs/adr/trivoallan/ADR-0009-branching.md). The repository already follows `github-flow` with squash merges. Branch prefixes are the one place where today's practice differs from the recommendation.

## What the repository does today

- **Model.** All work goes through pull requests to `main`. Every CI workflow runs on `pull_request: branches: [main]` / `push: branches: [main]` (`.github/workflows/ci.yml:3-6`, and the same in `types-integration.yml`, `codeql-analysis.yml`, `ecosystem-tests.yml` and `docs-ci.yml`). Older major versions have long-lived maintenance branches: `v9.x`, whose last commit was on 2026-10-30, `v9.x-dev`, `v8.x`, and `1.x` through `5.x`. Docs use `latest` and `next`. There is no `develop`, `release/*` or `hotfix/*`, so this is not gitflow.
- **Direct pushes to `main`.** 115 of the 626 commits since 2025-11-15 have no `(#NNN)` suffix. Every one of them comes from automation: version bumps (`10.15.0`), `Build: changelog update for …`, and `docs: Update README`. People don't push to `main` directly.
- **Merge.** There are 0 merge commits since 2020, out of 3,827 commits. The last merge commits date from 2016. `docs/src/contribute/pull-requests.md:153` and `:178` say outright that "its commits will be squashed into one single commit" whose first line is the PR title.
- **Branch names.** There is no convention. `pull-requests.md:42-46` tells contributors to use `git checkout -b issue1234`. Of the 129 remote branches, 100 have no prefix (`issue18385`, `fix-docs-20509`, `multithreading` and so on). The rest use `feat/` (11), `fix/` (6), `copilot/` (6), `ts/` (3), `chore/` (3), `docs/` (2), `renovate/` (2), `perf/` (1) and `ci/` (1). Nothing checks branch names.

## Proposed ruling

| Key | Value | | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | observed | One PR per change to `main`, as in the CI triggers and `pull-requests.md:50`. Maintenance branches for older majors (`v9.x`, `v9.x-dev`) sit alongside. |
| `branching.merge` | `squash` | observed | 0 merge commits since 2020; `pull-requests.md:153` |
| `branching.prefixes` | `[feat, fix, docs, chore, build, refactor, test, ci, perf]` | absent | The documented convention is `issue1234`; only about 23% of branches use a prefix. |

## Departures from the recommendation

1. **`prefixes` lists 9 types instead of `[feat, fix, docs]`.** These are exactly the 9 commit types this repository allows (AGENTS.md, "Conventions"), so no 12th prefix is invented. Branches already use `chore/`, `perf/` and `ci/`, and `chore:` is one of the most common commit types here. A list of three would leave that work with no valid name.
2. **Maintenance branches.** `github-flow` describes how work reaches `main`. The long-lived `vN.x` / `vN.x-dev` branches for older majors stay as they are. I'll write that down in the ADR so no agent mistakes them for gitflow.

## Points to weigh before you agree

- **The check would fail external contributors.** On a pull request, the check reads `GITHUB_HEAD_REF`, which is the contributor's own fork branch. ESLint takes most of its contributions from forks, and the documented `issue1234` would fail the check. Ruling `accepted` also means rewriting `pull-requests.md:42-46`, and expecting some failed checks from contributors who don't read it.
- **The check would also fail some bot branches.** `copilot/*` branches are named by the Copilot agent and are exempt from nothing. `renovate/*` and `dependabot/*` are exempt only once ADR-0018 is ruled, and both `.github/renovate.json5` and `.github/dependabot.yml` exist today.
- **Alternative.** If you'd rather not enforce prefixes against fork contributors, I could keep `accepted` but restrict the check to branches in the main repository. That would mean an additional departure written into the ADR.

Do you agree with this ruling as written: `accepted`, with `github-flow`, `squash`, the 9 prefixes and the two departures above? Or would you change the prefixes, or reject the question? I'll write nothing until you answer.

## ADR-0011

I've finished reading the repository. Here is my proposed ruling for ADR-0011. I haven't written anything yet.

## What the repository does today

- **Forge:** GitHub (`origin` is `github.com/eslint/eslint`), with 10 workflows in `.github/workflows/`. So `rejected` doesn't apply, and neither does `none`.
- **Gate:** `ci.yml` runs on `push` and `pull_request` to `main` (lint, test, types, browser). The maintainer docs say "never merge a pull request with failing tests" (`docs/src/maintain/review-pull-requests.md:94`). I couldn't check whether a ruleset actually makes these checks required: the `gh api repos/eslint/eslint/rules/branches/main` call was not approved. Even if it had run, the ADR's check can't verify that either.
- **Audit:** `ci.yml:24-27` runs **actionlint** v1.7.10 (installed with `go install`) in the `verify_files` job. Nothing runs zizmor: no workflow, no config, no script.
- **The five fixed rules, compared with the workflows** (they apply whatever the ruling):
  - **Rule 3 (pin by SHA) is mostly not followed.** Every `actions/*` action uses a movable tag (`actions/checkout@v7`, `setup-node@v7`, `github-script@v9`, …). So do `github/codeql-action/*@v4.39.3`, and the reusable workflows `eslint/workflows/...@main` (`ci.yml:151`, `stale.yml:13`). Only the third-party actions are SHA-pinned: pnpm, restackio, peter-evans, Ilshidur.
  - **Rule 5:** `pr-labeler.yml` uses `pull_request_target`. It doesn't check out the fork's head and its permissions are job-scoped, so this is probably safe, but zizmor flags `dangerous-triggers` and it would need an inline ignore with a reason.
  - **Rules 1 and 2:** no `environment:` and no deploy jobs, so there is nothing to bind.

## Proposed ruling: `accepted`

| Key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **observed** (stated intent; ruleset unverified) | `ci.yml` runs on PRs to `main`; `review-pull-requests.md:94` forbids merging on red |
| `forge.audit` | `zizmor` | **absent** | no zizmor anywhere; only actionlint in `ci.yml:26-27` |

**Departures from the recommendation:** none. Both values match it. Keeping actionlint alongside zizmor is consistent with the ADR ("still worth running"), so it isn't a departure.

**What `zizmor` would cost here:** about 40 `uses:` lines to pin by SHA, an inline ignore on `pr-labeler.yml`, and a decision about `eslint/workflows@main`.

## Rulings not yet followed (for after the review)

AGENTS.md has no decided `tracking` trait (ADR-0014 is still "Not yet decided"). So I'll list these in my reply and create no tracker items:

- `[trivoallan/ADR-0011] forge.audit`: add a zizmor job on PRs via SHA-pinned `zizmorcore/zizmor-action`, and pin every action by SHA.
- `[trivoallan/ADR-0011] forge.gate`: confirm or create a ruleset on `main` that requires the CI checks. I couldn't verify it.

Before I write anything to `docs/adr/trivoallan/ADR-0011-forge-and-ci.md`:

1. Do you agree with `accepted`, `gate: blocking` and `audit: zizmor`, or would you prefer something else, such as `audit: actionlint`, which would record what the repo does today?
2. Which names should I put in `authors:`?
3. Is `date: 2026-11-15` right?

Once you confirm, I'll fill in the frontmatter, rewrite the Consequences section, replace the "how to rule" block, and run `npx ontrack apply`.

## ADR-0023

I'm proposing **`accepted`** with **`license.spdx: MIT`**, which is what the ADR recommends. ESLint already uses MIT throughout, so the ruling changes nothing in the repository.

## What the repository does today

- **Licence file:** `LICENSE` at the root holds the full MIT text. The copyright line reads "Copyright OpenJS Foundation and other contributors, <www.openjsf.org>". It was last changed in 81f03b6ad ("Docs: Update license copyright (#14877)").
- **Root manifest:** `package.json:240` declares `"license": "MIT"`. There is no `pyproject.toml`, so the ADR's condition for that file doesn't apply.
- **Other manifests:** `packages/js/package.json:32`, `packages/eslint-config-eslint/package.json:90` and `docs/package.json:8` all declare `MIT`, and both packages ship their own `LICENSE`. The check doesn't read these, but they agree with the root.
- **Copyright holder:** the OpenJS Foundation, which owns the project (the remote is `github.com/eslint/eslint`). That matches the ADR's rule that the holder is "the organisation that owns the repository". The ruling leaves the copyright line as it is.

The ADR's three fixed points (root manifest declares the value, root licence file is committed, the owning organisation is the holder) all hold today.

## Proposed ruling

- **Status:** `accepted`
- **`license.spdx`:** `MIT`, **observed**. Evidence: the root `LICENSE` text and `package.json:240`.

**Departures from the recommendation:** none.

**What to fill in:**
- **`date:`** 2026-11-15.
- **`authors:`** I'd suggest `[Tristan Rivoallan]`, your git user name, unless other people decided this too.

**Do you agree with this ruling?** And should `authors:` be `[Tristan Rivoallan]`? I'll write nothing until you confirm. Once you do, I'll edit only this ADR and run `npx ontrack apply`. After that I'll list the rulings the repository doesn't follow yet. I expect none from this ADR, since the check should already pass.

## ADR-0025

Still gathering evidence: checking actionlint history and whether related ADRs are decided.

I've gone through the ADR and the repository, and I'm proposing a ruling. Nothing has been written yet.

## What the repository does today

- **No tool manager.** There is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml`, `aqua-checksums.json` or `.devcontainer`, and no script that installs a binary.
- **One tool outside the package manager: actionlint, on the CI runner only.** `.github/workflows/ci.yml:17-27` installs Go with `setup-go`, `go-version: "stable"`, then runs `go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.10`.
  - The version is pinned.
  - The checksum is checked by Go's checksum database at download time, but no checksum is written in the repository.
  - The Go toolchain that builds it isn't pinned (`"stable"`).
- **actionlint runs nowhere else.** No hook, npm script or `Makefile.js` target calls it. The only hook is yorkie running lint-staged (`package.json:96-121`), so workstations and agent sessions never run it.
- **The repository already tried a manager and dropped it.** It used Trunk until commit `dbb4c9582` ("chore: remove trunk", #20478, 2026-03-19). That commit replaced Trunk with the inline `go install`.
- **Nothing moves the pin automatically.** Dependabot covers only `github-actions` (`.github/dependabot.yml`). Renovate (`.github/renovate.json5`) extends a remote base config that I couldn't read here. Nothing local sets up a regex manager for the `@v1.7.10` string, so in practice a person moves it.
- **Side note: one unpinned tool fetched outside the manifest.** lint-staged runs `npx -y svgo` (`package.json:120`). It comes from npm, so it belongs to ADR-0020 rather than this ADR.

**The condition for `none`:** the ADR allows `none` "only when no accepted ADR names such a tool". ADR-0011, ADR-0015 and ADR-0019 are all `status: proposed` on line 5 of each file, so no accepted ADR names a tool today. That makes `none` an allowed answer right now.

## Differences from the recommendation

The recommendation is `script` for one tool and `mise` or `aqua` for several. The repository has one tool, and against the four fixed rules it falls short like this:

1. **One place holds version and checksum:** no. The version sits inline in the workflow, and no checksum is committed.
2. **The same place serves the workstation, the runner and agent sessions:** no. Only the runner gets actionlint.
3. **The manager is installed pinned:** doesn't apply, since there's no manager. The Go toolchain behind `go install` isn't pinned, though.
4. **What keeps pins current is written down:** no.

## Proposed ruling

**Status:** `accepted`

| Trait | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `script` | **absent** | There is one tool today (actionlint, `ci.yml:26`). Nothing in the repository holds its version and checksum together, and it reaches only the runner. |

**No departures from the recommendation.** One tool calls for `script`, and that is what I'm proposing.

**Rule 4, what I'd write in the ADR:** a person moves each pin (version plus a checksum per platform) in the same pull request. I'd also say that Renovate's regex manager could propose the version but doesn't update the checksum.

**Why not `none`:** it's allowed today, but it stops being allowed as soon as ADR-0015 or ADR-0011 is accepted with a tool. It would also leave actionlint pinned only inside the workflow.

**Why not `mise`/`aqua`:** with one tool, a manager is one more binary to pin. Removing Trunk also suggests the project doesn't want a manager. If ADR-0015 and ADR-0011 later bring in gitleaks and zizmor, there would be three tools, and the ADR's own recommendation would then point to `mise`. In that case it would be worth revisiting this ruling.

**Should I record this ruling (`accepted`, `tools.manager: script`)?** You can also tell me to rule `none` or `mise` instead, or to change anything above. Once you agree, I'll fill in the frontmatter, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences section, replace the how-to-rule block with the rule 4 text, and run `npx ontrack apply`.