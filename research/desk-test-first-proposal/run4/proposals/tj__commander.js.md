# tj__commander.js

## ADR-0002

I couldn't run `ontrack review` (approval required), so I'll follow the ADR's own instructions and gather evidence directly.

## Proposed ruling: ADR-0002 Localization

I couldn't run `ontrack review` because it needs your approval, so I followed the ruling steps written in the ADR.

**What the repository does today:** everything is in English.
- **Documentation:** `Readme.md`, `CONTRIBUTING.md`, `SECURITY.md`, `AI_POLICY.md` and the pages in `docs/*.md` are all in English. There are also Chinese translations (`Readme_zh-CN.md` and three pages under `docs/zh-CN/`), linked from `Readme.md:10` ("Read this in other languages: English | 简体中文"). These are translations of the English pages, not the main docs.
- **Commits:** all 1,566 commit subjects are in English. Only 3 contain non-ASCII characters, and those are an emoji or a symbol inside English text (e.g. `docs: ✏️ update chinese readme`).
- **Code:** functions, classes and variables are named in English (`class Argument`, `argParser`, `choices`, …).
- **Comments:** the JSDoc and inline comments are in English (e.g. `lib/command.js:16`, `:93`).
- No French text appears anywhere outside `docs/adr/`. A search for French accented characters found nothing.

**Proposed ruling: `accepted`**

| Trait key | Value | Marking | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | all docs, commits, symbols and comments above |
| `localization.language.documentation` | *(empty, so English)* | observed | the main docs are English; zh-CN pages are translations |
| `localization.language.commits` | *(empty, so English)* | observed | 1,566 English commit subjects |
| `localization.language.code` | *(empty, so English)* | observed | `lib/*.js` |
| `localization.language.comments` | *(empty, so English)* | observed | `lib/command.js` |

**Departures from the recommendation:** none. I'd add one line saying it is adopted as is. I'd also note that the Chinese translations are extra copies of English pages that this decision keeps. They aren't a different language for documentation, and Chinese isn't one of the values this trait allows.

**When writing it:** I'd set `date: 2026-11-15` and `authors: [Tristan Rivoallan]` (the name from your git user), rewrite the Consequences section for a project that is already English-only and has no French-speaking readers to accommodate, remove the "How to rule" block, and then run `npx -p @trivoallan/ontrack ontrack apply`. That command will need your approval.

**Rulings this repository doesn't follow yet:** once this one is accepted, none. Every value above is already what the repository does. Work tracking (ADR-0014) isn't decided, so there's no tracker to check for duplicates and I wouldn't create any items.

Do you agree with this ruling (`accepted`, `default: english`, no overrides, authored by Tristan Rivoallan)? Or would you like to change something, such as the authors? I'll write nothing until you confirm.

## ADR-0004

I'm collecting evidence on which language the repository uses. Next I'll check CONTRIBUTING and the git history for any move to TypeScript.

I propose ruling **accepted** with the value `JavaScript`. That departs from the recommendation, which allows only `Python` or `TypeScript`.

The project rules say to run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0004-languages` first, but that command was not approved here. So this review rests only on reading the ADR and the repository.

## What the repository does today

- **The code is plain JavaScript.** `index.js` and `lib/*.js` (`argument`, `command`, `error`, `help`, `option`, `suggestSimilar`) add up to 4,218 lines. Git tracks 168 `.js`, `.cjs` or `.mjs` files.
- **TypeScript only covers the public types.** There are three `.ts` files: `typings/index.d.ts` (1,116 hand-written lines), `typings/index.test-d.ts` (type tests for `tsd`) and one test fixture, `tests/fixtures-extensions/pm-try-ts.ts`.
- **There is no build step.** `package.json` publishes the source as it is: `"main": "./index.js"`, `"files": ["index.js", "lib/*.js", "typings/index.d.ts", …]`, and `"type": "module"`. The code has been ES modules only since commit `f4bd470` ("Switching to esm-only", #2464).
- **TypeScript is used to check the JavaScript, not to write it.** `tsconfig.json` sets `allowJs`, `checkJs` and `noEmit`. Its comment says it "picks up some problems in the JSDoc in the JavaScript files". `tsconfig.js.json` checks the JS with relaxed strictness, and `tsconfig.ts.json` checks the typings with full strictness. The scripts wire this up: `check:type:js` runs `tsc -p tsconfig.js.json`, and `check:type:ts` runs `tsd && tsc -p tsconfig.ts.json`.
- **CI runs the same checks.** `.github/workflows/tests.yml` runs `npm test` and `npm run check` on Node 22.x, 24.x and 26.x.
- **CONTRIBUTING.md** names "TypeScript typings" and "JSDoc documentation in code" as separate things a change may need to update. The implementation is JavaScript, documented with JSDoc.
- **No main language is written down** anywhere today: not in the ADR, AGENTS.md, README or CONTRIBUTING.

## Compared with the recommendation

The recommendation is `Python` or `TypeScript`, and `TypeScript` for code that runs in a browser or is shared with one. That condition does not hold: this is a Node-only CLI library (`"engines": {"node": ">=22.12.0"}`, `"types": ["node"]`).

The single difference is that the main language is **JavaScript**. The ADR allows another language if the reason is written down. The reason here is that what TypeScript would give is already in place without changing the code language:
- the code is type-checked (`tsc --checkJs` over JSDoc);
- consumers get published types (`typings/index.d.ts`, tested with `tsd`).

Switching to TypeScript would add a compile step to a package that ships its source as is. It would also rewrite all of `lib/` in a widely used library with zero production dependencies.

`rejected` does not fit: the repository does have a main language.

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name`: `JavaScript`** (observed). Evidence: `lib/*.js` and `index.js` are the implementation, with no build step. TypeScript is limited to `typings/`.
- **Departure from the recommendation:** JavaScript instead of Python or TypeScript, for the reason above. I would write that reason in the ADR.
- **Other fields:**
  - `date:` would be 2026-11-15.
  - `authors:` would be your name, Tristan Rivoallan.
  - The Consequences lists would be rewritten for this ruling: an agent writes new code as ESM JavaScript with JSDoc, and updates `typings/index.d.ts` alongside it.
  - The "How to rule" block would be deleted, as the ADR asks.

Do you agree with this ruling, or would you rather rule `TypeScript`, treating the typings and `tsc` as the reference tooling? I'll write nothing until you answer.

**Next step:** once this is ruled, I'll list the rulings the repository does not follow yet. No `tracking` trait is decided (ADR-0014 is still `proposed`), so that list will be in my reply and no items will be created. With `JavaScript`, the repository already matches the ruling, so I expect the list to be empty.

## ADR-0006

Evidence is gathered: commit history, CI, and release process. One quick look at the release policy, then the proposal.

I'm proposing **`accepted`** for ADR-0006 (Commits), with no scopes and no enforcing tool. The decision is yours. I haven't written anything yet.

I couldn't run `npx -p @trivoallan/ontrack ontrack review`, which AGENTS.md asks for, because it needs your approval. This review follows the ADR's own instructions instead.

## What the repository does today

- **Commit format:** almost none of the history uses Conventional Commits. Only 39 of 1,566 subjects do (`git log`). Most read like "Fix compare links in CHANGELOG (#2678)", "Bump eslint from …" (Dependabot), or a bare version number like "15.1.0". Each subject carries a PR number, so the PR title effectively becomes the commit message.
- **Scopes:** scopes are rare and inconsistent. Only 7 commits use one: `typings` (3), `ts`, `examples`, `option` and `README` (1 each). `ts` and `typings` name the same area.
- **Enforcement:** there is none. There is no commitlint config, no `.husky/`, no `@commitlint/*` in `package.json`, and no release tooling such as semantic-release or changesets. CI (`.github/workflows/tests.yml`) runs only `npm ci`, `npm test` and `npm run check`, which cover types, lint and formatting.
- **Versioning:** maintainers set versions by hand.
  - `CHANGELOG.md` is written by hand in Keep a Changelog format and lists PR numbers.
  - `CONTRIBUTING.md:30` says "Don't update the CHANGELOG or command version number. That gets done by maintainers when preparing the release."
  - The history has hand-made bumps such as "15.1.0" and "Bump minor version for next release… (#2677)".

## Checking the ADR's condition

The ADR recommends commitlint only "if this repository generates its versions from commit messages." It doesn't: the hand-written changelog, the `CONTRIBUTING.md` line and the hand-made bump commits show it. The ADR says that in this case "`none` is just as good an answer."

## Proposed ruling

**Status: `accepted`**

| Key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `commits.tool` | `none` | observed | Nothing enforces commit messages today, and versions and the changelog are set by hand, so a wrong message can't produce a wrong version. |
| `commits.scopes` | `[]` | observed | 7 of 1,566 commits use a scope, inconsistently. The changelog is grouped by hand by PR, not filtered by scope. The ADR warns that "a list invented on adoption ages worse than no list." |

**Departures from the recommendation:**
- **`commits.tool`: `none` instead of `commitlint`.** The recommendation assumes versions come from commit messages. Here maintainers set versions and write the changelog by hand.
- **`commits.scopes`:** the ADR recommends no value here, so `[]` isn't a departure.

**Why `accepted` rather than `rejected`:** the question does apply here, since agents and contributors write commits. Ruling `[]` tells an agent plainly to write `fix:` without a scope. A `rejected` ruling would leave that unsaid.

**Gaps to keep in mind:**
- The history doesn't follow Conventional Commits today, even though governance requires the format whatever you rule here. With `tool: none`, only review keeps the format going forward.
- Commits arrive as squashed PRs, so the PR title is what has to follow the format. That belongs to ADR-0009 (branching), which isn't decided yet.

If you'd rather keep scopes, a list matching the code's areas would be `[lib, typings, examples, docs, tests]`. That would be marked `absent`, because the history barely uses them.

**Do you agree with `accepted`, `tool: none` and `scopes: []`, or would you change something (scopes, `hook`, `commitlint`)?** I also need the names to put under `authors:`, for example "Tristan Rivoallan", without email addresses. Once you confirm, I'll update the ADR file, set `date: 2026-11-15`, and run `ontrack apply`.

## ADR-0009

The `ontrack review` command needs approval that wasn't given, so I'll continue from the ADR text and the repository itself.

A `develop` branch shows up here, so I'm checking how it relates to `master`.

`master` holds releases, `develop` is one PR ahead of it, and PRs are squash-merged into `develop`. Next I'm checking which branch names contributors actually use.

## ADR-0009 Branching: proposed ruling

I couldn't run `npx -p @trivoallan/ontrack ontrack review` (AGENTS.md asks for it) because the command needs your approval. `gh` also needs approval, so I couldn't see the branch names of past PRs on GitHub. Everything below comes from the ADR text and the local clone.

### What the repository does today

- **Branches:** `develop` is the working branch: PRs land there, and it is currently one commit ahead of `master` (`fa5e81c Update dependencies (#2682)`). `master` only moves forward at releases (`a5a7dc0 15.1.0`). There are long-lived `release/13.x` to `release/16.x` branches, and `develop` gets merged into them (`Merge branch 'develop' into release/14.x`, `Merge from develop into release/15.x`). There are no `hotfix/*` branches.
- **Documented rule:** `CONTRIBUTING.md:23` and `.github/PULL_REQUEST_TEMPLATE.md:5` both say "Please submit pull requests against the develop branch."
- **Tooling follows the same rule:** `.github/dependabot.yml:4,13` sets `target-branch: "develop"`, and `codeql-analysis.yml:5,8` runs on `[ master, develop ]`.
- **How PRs merge:** each change is one single-parent commit whose subject ends in `(#NNNN)`, for example `Deprecate combineFlagAndOptionalValue (#2660)`. Since 2022, only 3 commits are "Merge pull request" commits, and all three are maintainer merges between long-lived branches (`release/12.x`, `release/9.x`). Every contributor change is squashed.
- **Branch names:** there is no convention. History shows `feature/…`, `fix/…`, `hotfix/…`, `patch-1` (GitHub's web-editor default) and free-form names like `repeated-options`. Nothing in the repo or CI checks branch names.
- **Product:** a library that third parties install by version, with several major versions maintained at once.

### Proposed ruling: `status: accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `gitflow` — **observed** | `develop` is where work lands and `release/N.x` branches hold majors (`CONTRIBUTING.md:23`, `dependabot.yml`, `git branch -a`) |
| `branching.merge` | `squash` — **observed** | single-parent `… (#NNNN)` commits on `develop` and `master` |
| `branching.prefixes` | `[feat, fix, docs]` — **absent** | no naming convention exists today |

### Departures from the recommendation

1. **`branching.model`: `gitflow` instead of `github-flow`.** This repo already works this way and documents it. It is also the case the ADR itself describes for gitflow: "software shipped as versions installed by third parties". Ruling `github-flow` would mean changing the maintainers' documented process and Dependabot's target branch.
2. **No other departures.** `squash` is what the repo already does. For prefixes I kept the recommended list. One alternative is to add `chore`, because maintainers often open "Update dependencies" and "Update codeql-action" PRs by hand.

### Caveats on `prefixes`

- **The ADR's check would fail on two kinds of branch today:**
  - `develop` and `release/N.x`: they aren't `<prefix>/<kebab>`, and the check only skips the default branch (`master`).
  - Dependabot's branches: they are only exempt once ADR-0018 is ruled.
- **Most contributor PRs come from forks** with names like `patch-1`, so in practice the rule mostly binds maintainers and agents.

### Rulings not yet followed (assuming this ruling)

- `[trivoallan/ADR-0009] branching.prefixes`: no branch-naming convention is documented or enforced, and the `ontrack check` for ADR-0009 isn't wired into CI.
- `branching.model` and `branching.merge` already match the repo, so nothing is needed for them.

No `tracking` trait is decided (ADR-0014 is still proposed), so I wouldn't create any tracker item. This entry is the list.

### Your call

Do you agree with this ruling: `accepted`, `model: gitflow`, `merge: squash`, `prefixes: [feat, fix, docs]`? You can also say yes but add `chore`, or ask for other changes. I'll write nothing until you answer. If you agree, also tell me the name to put in `authors:`. Once the file is written I'll run `npx -p @trivoallan/ontrack ontrack apply`, which needs your approval.

## ADR-0011

I've read the ADR and both workflows. I'm running actionlint locally next. The GitHub ruleset query needs your approval, so I'll mark that part as unverified.

# ADR-0011 review: Forge and continuous integration (proposed ruling)

I recommend accepting the ADR's recommendation unchanged. The repository already has a pipeline that runs on every pull request. What it doesn't have is anything that checks the workflow files for unsafe patterns.

## What the repository does today

- **Forge:** GitHub. The remote is `https://github.com/tj/commander.js.git`, and the workflows live in `.github/workflows/`. So `rejected` doesn't apply.
- **Pipeline:** `.github/workflows/tests.yml` runs on `push`, `pull_request` and `workflow_dispatch`. It runs `npm ci`, `npm test` and `npm run check` on Node 22, 24 and 26, on Ubuntu, Windows and macOS. `.github/workflows/codeql-analysis.yml` runs CodeQL for `javascript` on master and develop, on pull requests and on a weekly schedule.
- **Action pins:** every action is pinned by commit SHA with the tag in a comment, for example `actions/checkout@3d3c42e… # v7.0.1`. Dependabot proposes updates for the `github-actions` ecosystem weekly (`.github/dependabot.yml`).
- **Permissions and triggers:**
  - `tests.yml` grants only `contents: read`, at workflow level.
  - CodeQL grants its permissions per job: `security-events: write` plus read.
  - No workflow uses `pull_request_target`.
  - `${{ }}` is never expanded inside a `run:` step.
  - No workflow uses an `environment:` or secrets, and none deploys.
- **Workflow audit:** nothing reads the workflows.
  - No zizmor job, no `zizmor.yml`, and `zizmor` is not on the PATH.
  - actionlint is installed locally, but no file or job uses it.
  - CodeQL scans only `javascript`, not `actions`.
- **Ruleset:** I couldn't check whether a ruleset makes the checks required on `master`, because the `gh api …/rulesets` call needs your approval.

## Proposed ruling: `status: accepted`

| Key | Value | Observed or absent | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **observed** for the pipeline; the ruleset is **unverified** | `tests.yml` runs on every `pull_request`. A required-check ruleset on `master` could not be confirmed. |
| `forge.audit` | `zizmor` | **absent** | There is no zizmor job and zizmor is not installed. |

**Departures from the recommendation:** none.

## What `zizmor` would likely flag on day one

All 3 `actions/checkout` steps lack `persist-credentials: false`, which zizmor reports as `artipacked`. That is my prediction; I couldn't run zizmor here. Apart from that, the workflows already meet rules 3 and 5.

## Before I write anything

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** If so, tell me which name to put in `authors:`.

I'll then:
1. Fill the traits, status, `date: 2026-11-15` and `authors:`.
2. Rewrite the Consequences.
3. Replace the "How to rule" block with "Adopted as recommended."
4. Run `npx -p @trivoallan/ontrack ontrack apply`. That command, and the earlier `ontrack review`, need your approval.

## Rulings this repository would not follow yet (if accepted)

- `[trivoallan/ADR-0011] forge.audit: add a zizmor job on pull requests and set persist-credentials: false on checkouts`
- `[trivoallan/ADR-0011] forge.gate: confirm or create a ruleset requiring the build checks on master`

No `tracking` trait is decided yet (ADR-0014 is still proposed), so I won't create these items in a tracker. That also means I didn't check for duplicates.

## ADR-0023

My proposed ruling for ADR-0023 (License) is to accept MIT, which the repository already uses. I've written nothing yet. I also couldn't run `npx -p @trivoallan/ontrack ontrack review` because it needs your approval, so this review works from the ADR file and the repository alone.

**What the repository does today**
- **Licence file:** `LICENSE` is committed at the root. It holds the full MIT text (22 lines) with the line `Copyright (c) 2011 TJ Holowaychuk`. It dates from commit `ef0a54f`, "move license info to LICENSE".
- **Manifest:** `package.json:16` declares `"license": "MIT"`. That field was added in 2014 (`2463925`, "Add license field to package.json").
- **Other manifests:** there is no `pyproject.toml`, and `package.json` is the only manifest in git. Every manifest the check reads already declares MIT.

**Compared with the ADR**
- **Recommended value:** MIT, which matches.
- **Root manifest declares the value:** `package.json` does.
- **Licence file at the root with the full text:** `LICENSE` is there.
- **Copyright holder:** the ADR says it should be the owner of the repository, which is `tj`. The copyright line names TJ Holowaychuk, which is consistent.

There are no differences and no conditions to check. The ADR mentions `UNLICENSED` only for private repositories, and this one is a public npm package. There is no evidence for `rejected`.

**Proposed ruling**
- `status: accepted`
- `license.spdx: MIT`: **observed** (`package.json:16` and the root `LICENSE`).
- **Departures from the recommendation:** none. In place of the "How to rule" block, I'd write one line saying the recommendation is adopted as is, and that it confirms the MIT licence the project has had since 2011.

**To fill in when ruling**
- `date:` would be 2026-11-15.
- `authors:` needs the names of the people deciding. Should I use "Tristan Rivoallan"?
- I'd rewrite the Consequences section to match: the licence is unchanged, so nothing new costs anything.

**Rulings this repository doesn't follow yet:** none for ADR-0023, since the code already matches `license.spdx: MIT`. No `tracking` trait is decided in AGENTS.md, so there's no tracker to check for duplicates and I'll create nothing.

Do you agree with ruling ADR-0023 `accepted` with `license.spdx: MIT`, and with "Tristan Rivoallan" as author? Once you say yes, I'll edit the ADR and run `npx -p @trivoallan/ontrack ontrack apply`.

## ADR-0025

Checking which ADRs are already accepted, since that decides whether `none` is a valid answer.

The ADR is read in full. I couldn't run `npx -p @trivoallan/ontrack ontrack review`, which AGENTS.md asks for, because the command needed approval that wasn't given. So I worked from the ADR file itself, which overrides this prompt anyway.

## What the repository does today

- **No tool is installed outside npm.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions`, install script, Brewfile, devcontainer, git hook setup (husky, lefthook or pre-commit) or `*.sh` file in `git ls-files`. Git history has never had any of these.
- **CI only uses pinned actions and npm.** `.github/workflows/tests.yml` runs `actions/checkout` and `actions/setup-node`, both pinned by SHA, then `npm ci`, `npm test` and `npm run check`. `codeql-analysis.yml` runs CodeQL through `github/codeql-action`, also pinned by SHA. The ADR doesn't cover actions. Every linter, formatter and type-checker (`eslint`, `prettier`, `tsc`, `tsd`) is a devDependency in `package.json`, which the ADR doesn't cover either.
- **Updates:** `.github/dependabot.yml` covers `npm` and `github-actions`. There are no other pins to move.

## The ADR's condition

The ADR says: "`none` is an answer only when no accepted ADR names such a tool."

**That condition holds.** Only ADR-0001 has `status: accepted` in its frontmatter (`ADR-0001-record-architecture-decisions.md:5`). ADR-0011, ADR-0015 and ADR-0019 are still `proposed`, as are the other ADRs that could name `gitleaks` or `zizmor`. So `secrets.guard` and `forge.audit` name nothing yet.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `none` | **observed** | No binary is used outside npm and pinned actions, and no accepted ADR names one (see above) |

**Departure from the recommendation:**
- **The ADR recommends** `script` for one tool, or `mise` or `aqua` for several.
- **I propose** `none`, because there are zero such tools.
- **Why:** pinning something that doesn't exist would be an empty script or an unneeded manager. The ADR allows `none` in exactly this case.
- **What keeps pins current (rule 4):** there are no pins; Dependabot keeps npm and actions current.

**Not `rejected`:** the question does apply to this repository; it just has no tools in scope right now.

**This ruling has a shelf life.** Once ADR-0015 is accepted with a guard such as `gitleaks`, or ADR-0011 with an `audit` tool such as `zizmor`, this ADR's check fails under `none`. It then has to be superseded with `script`, or with `mise`/`aqua` if both arrive. I'd add that warning in the ADR. The alternative is to rule `script` now, ahead of those ADRs, but that would describe the repository as other proposed ADRs would make it, not as it is.

**On writing the ADR:** I would fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`. I would also rewrite the Consequences section and replace the "How to rule" block with the departure reason and the rule 4 statement. Then I'd run `npx -p @trivoallan/ontrack ontrack apply`.

**Agree with `accepted` / `tools.manager: none`?** Or would you rather rule `script` now, or change something else? I'll write nothing until you answer.