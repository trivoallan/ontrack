=================== fastify__fastify ADR-0002
I read the ADR in full and checked the repository. The recommended `default: english` matches what the repo already does, so I'm proposing to accept it unchanged. One note: `npx ontrack review` asked for approval and didn't run, so this review follows the ADR's own "How to rule" steps. I can run it if you approve the command.

## What the repository does today

- **Documentation:** every page under `docs/Guides/` and `docs/Reference/` is in English. I searched for accented characters, and the only matches were emoji and symbols like `⚠` and `§`. None was French.
- **Commits:** all 4,928 subjects are in English, using Conventional Commits (for example `fix(route): …` and `docs: …`).
- **Code and comments:** names and comments in `lib/` and `fastify.js` are in English (for example `// Header names are case insensitive (RFC 9110 §5.1)…`).
- **No written rule:** nothing in the repo says which language to write in. The practice is consistent, but `AGENTS.md`, `CONTRIBUTING`, the config and CI never state it.
- **`ajv-i18n` is not relevant here:** it is a devDependency mentioned in `docs/Reference/Validation-and-Serialization.md:1073`. It translates validation errors for Fastify's users. It doesn't set the language contributors write in.

The recommendation has no "if this repository…" condition, so there was nothing to check there.

## Proposed ruling

**Status:** `accepted`

- `localization.language.default: english (observed)`: the docs, 4,928 commit subjects, code names and comments are all in English.
- `localization.language.documentation:` empty, so it takes `default`. The docs are in English (observed).
- `localization.language.commits:` empty, so it takes `default`. The commit history is in English (observed).
- `localization.language.code:` empty, so it takes `default`. Names in `lib/` are in English (observed).
- `localization.language.comments:` empty, so it takes `default`. Comments in `lib/` are in English (observed).

**Departures from the recommendation:** none. In the ADR I'd write one line saying it is adopted as is.

**What I can't see:** who decides and on which date. I'd use `date: 2026-11-15` and `authors: [Tristan Rivoallan]` unless you want other names.

**Rulings the repo doesn't follow yet:** none. The repo already writes everything in English, so `[trivoallan/ADR-0002] localization.language.default` needs no tracking item. No `tracking` trait is decided in AGENTS.md either, so I would create nothing in any case.

Do you agree with this ruling, including `date: 2026-11-15` and `authors: [Tristan Rivoallan]`? If you do, I'll fill the `traits:`, set the status, date and authors, and rewrite the Consequences. I'll also replace the "How to rule" block with the adoption line, then run `npx ontrack apply`.
=================== fastify__fastify ADR-0004
I've finished reading the ADR and the repository. Here is the proposed ruling for your decision.

Two things first:
- AGENTS.md says to run `npx ontrack review`, but that command needed your approval and didn't run. I reviewed the ADR by hand by following its own "How to rule" steps. If you approve the command, I'll check its output against this proposal.
- `package.json` has an uncommitted change that adds `trivoallan` (`@trivoallan/ontrack-engineering@0.6.0`) as a devDependency. That's governance tooling, not a language signal, so I left it out of the evidence.

## What the repository does today

The code is plain JavaScript, not TypeScript:
- **Runtime code** is JavaScript in CommonJS modules. In `package.json:5-6`, `"main": "fastify.js"` and `"type": "commonjs"`. Every file in `lib/` is `.js`, and there is no `src/`.
- **No build step.** There is no `tsconfig` at the root, no compile script, and the `.js` files ship as they are.
- **Tests** are JavaScript too (232 `test/**/*.test.js` files, run by `borp` via `npm run unit`). Linting uses ESLint with `neostandard` (`eslint.config.js`).
- **TypeScript is secondary.** It appears only as hand-written type declarations (`fastify.d.ts`, `types/*.d.ts`, published via `"types": "fastify.d.ts"`). These are checked by `tstyche` (`test:types`) and the `missing_types.yml` CI workflow, and `typescript ~6.0.2` is a devDependency.
- **Nothing in the repository names the main language.** The key is empty, which is the gap this ADR fills.

## Compared with the recommendation

The ADR recommends Python or TypeScript, with TypeScript when code runs in a browser or is shared between browser and server. That condition is false here: Fastify is a Node.js server framework, and nothing in `lib/` targets the browser. Python doesn't apply either. The language actually in use, JavaScript, is in neither recommended option.

## Proposed ruling

**Status: `accepted`**

- `languages.main.name: JavaScript (observed)`: `package.json:5-6` (`main: fastify.js`, `type: commonjs`), every file in `lib/` is `.js`, and the 232 test files are `.test.js`.

**One departure: `JavaScript` instead of `Python` or `TypeScript`.** The reason to write in the ADR:
- Fastify is a Node.js library that ships its CommonJS sources as they are, with no compile step.
- Its public types are kept as hand-written `.d.ts` files and checked with `tstyche`, so TypeScript users are covered without converting the runtime code.
- Switching to TypeScript would add a build step and change what gets published, for an ecosystem that already depends on the current form.
- TypeScript stays a secondary language, used only for the type declarations and their tests.

This choice has a knock-on effect: ADR-0005 (validation) and ADR-0007 (tests) recommend tools for Python or TypeScript, so their recommendations will apply only partly.

**Do you agree with `accepted` and `languages.main.name: JavaScript`?** Two other options:
- `TypeScript`, if you want the ruling to steer future code towards TypeScript. That would be `absent` today and would mean converting `lib/`.
- Different names to put in `authors:`.

Once you answer, I'll fill the ADR, delete its "How to rule" block, rewrite its Consequences and run `npx ontrack apply`. Then I'll list the rulings this repository doesn't follow yet. That list will go in my reply rather than a tracker, because AGENTS.md has no decided `tracking` trait (ADR-0014 is still proposed).
=================== fastify__fastify ADR-0006
The `npx ontrack review` command needs approval, so I'll do the review by hand following the ADR and the prompt.

I couldn't run `npx ontrack review` because it needed approval, so I did the review by hand, following the ADR itself and your steps.

## What the repository does today

- **Commit format: mostly Conventional Commits, but nothing checks the commits themselves.** 1,223 of the last 1,500 subjects match `type(scope)?!?: `. The rest are maintainer commits like `Bumped v5.11.0`, `Merge commit from fork` and `Merge branch 'main' into next`, plus a few older free-form subjects like `Fix port parsing (#6603)`.
- **One CI check covers PR titles.** `.github/workflows/pull-request-title.yml:17` runs `fastify/action-pr-title` with a regex. Since nearly every subject ends in `(#NNNN)`, PRs look squash-merged with the title as the message (the merge setting itself lives in GitHub and I can't see it). The regex has two issues:
  - It accepts any scope (`(?:\([^\):]*\))?`).
  - Its type list doesn't match governance's eleven: it accepts **`types`**, which isn't one of the eleven and is used in history (`types: restrict route lookup methods (#6963)`), and it rejects **`revert`**.
- **No commitlint and no hook.** There is no `commitlint.config.*`, no `.commitlintrc*` and no `.husky/`. `package.json` has no commitlint or husky dependency, and the old hook was removed in `build(deps-dev): remove @fastify/pre-commit (#6319)`.
- **Versions are set by hand.** `CONTRIBUTING.md:60-61` says "Declaring formal releases remains the prerogative of the lead maintainers. Do not bump version numbers in pull requests." History has manual `Bumped v6.0.0-alpha.N` commits. There is no semantic-release, release-please or changesets, and no release workflow in `.github/workflows/`.
- **Scopes are used but open, and they drift.** About 340 of the 1,500 subjects have a scope. That's exactly the drift the ADR describes:
  - `types` / `ts` / `typescript`
  - `ecosystem` / `Ecosystem`
  - `sponsor` / `sponsors`
  - `reference/hooks`, `lib/validation`, `Routes.md`, `CONTRIBUTING.md`
  - issue numbers like `fix(#5049)`
  - `docs(fix)`
- **Dependabot writes scopes automatically.** `.github/dependabot.yml:5-7,24-26` sets `include: "scope"`, which produces `deps` / `deps-dev`.

## The condition in the recommendation

`commitlint` is recommended only *"if this repository generates its versions from commit messages"*. **It doesn't**: see `CONTRIBUTING.md:60-61` and the `Bumped vX` commits. So that recommendation doesn't apply, and the ADR says `none` is just as good an answer.

## Proposed ruling: `accepted`

- `commits.tool: none (observed)`: no commitlint or hook exists, and versions are bumped by hand. The PR-title regex check stays as it is. It isn't one of the three allowed values, so the ADR would name it as what stands in for a tool.
- `commits.scopes: [route, reply, request, validation, hooks, decorators, content-type-parser, logger, server, plugins, errors, types, ecosystem, reference, guides, security, readme, sponsor, license, deps, deps-dev, dependabot] (absent)`:
  - Today there is no list, only open scopes.
  - These are the most frequent scopes in history, with variants merged: `ts`/`typescript` become `types`, `content-type` becomes `content-type-parser`, `sponsors` becomes `sponsor`, and `reference/*` becomes `reference`.
  - `deps` and `deps-dev` are kept because Dependabot generates them.

**Departures from the recommendation:**
1. **`commits.tool` is `none`, not `commitlint`.** The premise doesn't hold here because maintainers set versions by hand, so a wrongly formatted message can't produce a wrong version. The existing PR-title check already covers the squash-merge message.
2. **`commits.scopes` departs from nothing**, since governance recommends no list. But I'm choosing a closed list over `[]` because this repository has many areas and already uses scopes in about a quarter of its commits.

**Not part of this ruling, but you should know:** the PR-title regex contradicts the eleven types governance fixes, since it allows `types` and blocks `revert`. That's governance's rule, so it can't be ruled away here. I'll list it among the things the repository doesn't follow yet.

---

Do you agree with this ruling? In particular:
1. Is `none` right for `commits.tool`, with the PR-title check described as what stands in for a tool?
2. Is the scope list right? You can add or drop words, or choose `[]`.
3. What should go in `authors:`? The ADR asks for names without email addresses. I'd put `Tristan Rivoallan`, with `date: 2026-11-15`.

I'll write nothing until you confirm.
=================== fastify__fastify ADR-0009
Gathering the last pieces of evidence: the merge strategy visible in history. After that I'll present the ruling.

I'm proposing **`accepted`** for ADR-0009 (Branching), with one departure from the recommendation: a longer list of branch prefixes. I haven't written anything yet.

`npx ontrack review trivoallan/ADR-0009-branching` was blocked by the permission prompt, so this ruling comes from the ADR file itself plus the repository's history, branches, CONTRIBUTING.md and `.github/workflows/`.

## What the repository does today

- **How work reaches `main`:** one pull request per change. Each change becomes one commit on `main`, with its PR number in the title (`… (#7195)`). CONTRIBUTING.md:24-34 asks for work on non-main branches, no force-push on `main`, approval before merging and green CI. `origin/HEAD` points to `main`.
- **Long-lived branches:** there are maintenance branches `1.x`–`5.x` (CONTRIBUTING.md:45-56, README.md:49-50), filled by `tibdex/backport` (`.github/workflows/backport.yml`). There is also a `next` branch for the coming major version, merged once into `main` (`1e08dfd9 Merge branch 'next'`, 2026-08-11). There are no `develop`, `release/*` or `hotfix/*` branches.
- **How changes are merged:** every first-parent commit on `main` since 2026-01 has a single parent, except that one merge of `next`. Even "Merge commit from fork" (the security-advisory merges, e.g. `028b4ef3`) has one parent and GitHub's squash-style body. So the history shows squash merging. I can't see whether GitHub's settings allow only squash: that setting lives in the repository settings, outside the repo.
- **Branch names:** nothing checks them.
  - The remote branches mostly use `feat/`, `fix/`, `docs/`, `refactor/`, `ci/` and `test/`.
  - Some use other prefixes or none: `split/…`, `semver-major/…`, `named-hooks`, `remove_503`, `types-refactoring`.
  - Dependabot opens `dependabot/…` branches.
  - What CI does check is the PR title (`.github/workflows/pull-request-title.yml`), against build|chore|ci|docs|feat|types|fix|perf|refactor|style|test.

## Proposed ruling

**status: accepted**

- `branching.model: github-flow (observed)`: one branch, one PR and one review per change, landing on a `main` that stays shippable (CONTRIBUTING.md:24-34, first-parent history). The `N.x` backport branches and the occasional `next` branch are extras around this model. They are not gitflow, which would need `develop`, `release` and `hotfix` branches.
- `branching.merge: squash (observed)`: since 2026-01, every commit on `main` has a single parent and a `(#NNNN)` PR number, apart from the one `next` merge. I couldn't see whether the forge enforces squash-only; please confirm in GitHub → Settings → General → Pull Requests.
- `branching.prefixes: [feat, fix, docs, refactor, perf, test, ci, chore] (absent)`: today the prefixes are a partial habit and nothing enforces them. Accepting this ruling would make the check enforce them.

## Departures from the recommendation

1. **The prefix list is longer than `[feat, fix, docs]`.**
   - The repository's branches already use `refactor/`, `test/` and `ci/`.
   - `perf:` and `chore:` are among the most common PR types in the history.
   - With only three prefixes, a large share of today's legitimate work would have no valid branch name.
   - All eight come from the eleven allowed commit types. `types`, which the PR-title check accepts, is not one of the eleven, so such work would go under `fix/` or `feat/`.
2. **This is not a departure, but a caveat:** the check reads `GITHUB_HEAD_REF`. On a PR from a fork, that is the contributor's own branch name, and most Fastify PRs come from forks. Running the check in CI would fail contributors whose fork branch doesn't match, so this ruling would bind maintainers' own branches more than contributors'.
3. **Also not a departure, but a dependency:** ADR-0012 (delivery) and ADR-0018 (dependencies) are still proposed. Until ADR-0018 is ruled, the check would fail the existing `dependabot/…` branches.

## After the ruling

The ruling this repository doesn't follow yet:

- `[trivoallan/ADR-0009] branching.prefixes`: branch names aren't checked, and several current branches don't match (`split/…`, `semver-major/…`, `named-hooks`, `remove_503`, `types-refactoring`).

No `tracking` trait is decided (ADR-0014 is still proposed), so I'll create no tracker item and leave this list here.

**Do you agree with this ruling?** In particular:
- Should the prefix list be the eight above, the recommended three, or something else?
- Can you confirm that squash is the only merge method allowed in the GitHub settings?

Once you agree, I'll fill the traits, status, date and authors, rewrite Consequences, replace the how-to-rule block with the reasons above, and run `npx ontrack apply`.
=================== fastify__fastify ADR-0011
I've confirmed the repo is on GitHub and every workflow action is pinned by SHA. Now I'm checking the `pull_request_target` workflows and whether the merge gate (rulesets) is visible from here.

I'm proposing **`accepted`** for ADR-0011, with both keys at the recommended values. One of them I can't confirm from here, so I need your input before writing anything.

**Why it can't be `rejected`:** the repository is on GitHub (`origin` is `https://github.com/fastify/fastify.git`), and it has 20 workflows in `.github/workflows/`.

### What the repository does today
- **Pipeline:** `ci.yml` runs on pushes to `main`, `next` and `*.x`, and on every pull request. Its jobs are quality-check (lint and license check), coverage, unit tests, type tests and a package test. Other workflows cover markdown lint, link checks, integration tests and more.
- **Merge rule in writing:** `CONTRIBUTING.md:34` says "All integrated CI services must be green before a pull request can be merged." Line 75 says the same for bot pull requests. That is the intent behind `blocking`.
- **Branch ruleset:** I couldn't see it. The setting lives on GitHub, and `gh api repos/fastify/fastify/rules/branches/main` needed an approval it didn't get.
- **Rule 3 (pin actions by SHA):** every `uses:` is pinned by SHA with the tag in a comment, GitHub's own `actions/*` included. That came from commits `b01e67d4` and `ada0623d`. Dependabot also updates the `github-actions` ecosystem.
- **Rule 5 (no secrets or write access for fork code):** `backport.yml` and `labeler.yml` use `pull_request_target`, but neither one checks out the fork's code. So the rule is respected. zizmor will still report both under `dangerous-triggers`.
- **Rules 1 and 2 (deploy only from the default branch; secrets in GitHub settings):** `website.yml` uses `secrets.GHA_WEBSITE_FINE_TOKEN` and runs only on pushes to `main` or on a release. It has no `environment:`. Its only step starts a workflow in `fastify/website`, so nothing deploys from a feature branch.
- **Workflow audit:** nothing reads the workflows for security problems. There is no zizmor job and no `zizmor.yml`, zizmor isn't installed on this machine, and actionlint is mentioned nowhere in the repository.

### Proposed ruling
**Status: `accepted`**

- `forge.gate: blocking` (not marked): `CONTRIBUTING.md:34` requires green CI before merging, but whether a ruleset on `main` actually requires the checks is a GitHub setting I couldn't read. **Can you tell me, or approve the `gh api` call?** If no required checks are set, the value is still `blocking`, but marked `absent`.
- `forge.audit: zizmor` (absent): `.github/workflows/` has no zizmor job, and the repository has no zizmor configuration or mention of it.

### Departures from the recommendation
- **None in the values.**
- **Expected cost of the zizmor job:** the two `pull_request_target` workflows will each need an inline `# zizmor: ignore[dangerous-triggers]` with its reason (they don't run fork code). I couldn't run zizmor here to list every finding, so there may be others.

A side note: AGENTS.md says to run `npx ontrack review`, but the call needed an approval it didn't get, so this review was done by hand from the ADR.

**Do you agree with this ruling?** In particular, what is the state of the `main` ruleset, and who should go in `authors:`? I'll write nothing to the ADR until you confirm.
=================== fastify__fastify ADR-0023
I couldn't run `npx ontrack review trivoallan/ADR-0023-license`, which AGENTS.md asks for, because the command wasn't approved. So this proposal follows the ADR's own "How to rule" section. The repository can already show the answer to this question.

## What the repository does today

- **Root manifest:** the committed `package.json:158` (`git show HEAD:package.json`) declares `"license": "MIT"`. Your only uncommitted change to `package.json` adds the `trivoallan` devDependency and doesn't touch the licence. There is no `pyproject.toml`, so `package.json` is the only root manifest.
- **Licence file:** `LICENSE` is committed at the root (`git ls-files LICENSE`). It holds the full 21-line MIT text.
- **Copyright holder:** the file says `Copyright (c) 2016-present The Fastify team <https://github.com/fastify/fastify#team>`. The repository belongs to the `fastify` organisation (`origin https://github.com/fastify/fastify.git`), so the ADR's third requirement (the holder is the organisation that owns the repository) is met.
- **History:** the licence has been kept up deliberately, most recently in `5c62eeb2` (2026-02-28, "chore(license): standardise license notice") and `2af83d64` (2026-01-24, "Fix MIT Licence file to conform to standard").
- **Recommendation:** the ADR recommends `MIT`. The repository has no unmet conditions and does exactly that, so I found **no differences**.
- **Rejecting:** doesn't apply. Fastify is a public npm package that other projects reuse, so the question applies.

## Proposed ruling

**Status: `accepted`**

- `license.spdx: MIT (observed)`: the committed `package.json:158` has `"license": "MIT"`, and the root `LICENSE` holds the full MIT text.

**Departures from the recommendation:** none. In the ADR, I'd replace the "How to rule" block with one line saying the recommendation is adopted as is, because it matches what Fastify has always shipped.

**Ruling-time fields:** I'd set `date: 2026-11-15`. For `authors:` I'd suggest `[Tristan Rivoallan]` (the git user), unless you want other names.

Do you agree with this ruling, and who should be listed in `authors:`? I won't write anything until you confirm.

**Rulings this repository doesn't follow yet:** none for ADR-0023. The manifest field and the licence file both already satisfy the ADR's `check:`. No `tracking` trait is decided in AGENTS.md (ADR-0014 is still undecided), so I won't create any tracker items.
=================== fastify__fastify ADR-0025
Checking the last bits (other ADRs' statuses, history) before proposing the ruling.

I haven't changed anything yet. Here is the ruling I propose for `docs/adr/trivoallan/ADR-0025-tools.md`.

`npx ontrack review trivoallan/ADR-0025-tools` needed your approval and didn't run, so this review follows the ADR's own "How to rule" steps instead.

## What the repository does today

**It installs no tool outside the package manager.**
- There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions`, install script or pre-commit/husky/lefthook hook. The only scripts are Node files in `scripts/`, `.github/scripts/` and `build/`.
- No file outside `docs/adr/` mentions gitleaks, zizmor, actionlint, trufflehog or shellcheck. Git history has no commit about them, or about mise, aqua or asdf. The only hits were "Pro**mise**" commits.
- In `.github/workflows/`, every tool comes from an npm script or from an action pinned by SHA (`setup-node`, `setup-nsolid`).
- `.gitpod.yml` only runs `npm install`.

**No accepted ADR names such a tool.** Only ADR-0001 is `accepted`. ADR-0011 (forge, `forge.audit`), ADR-0015 (secrets, `secrets.guard`) and ADR-0019 (vulnerabilities) are all `proposed`.

**One unpinned install, outside this ADR's scope:** `.github/workflows/package-manager-ci.yml:72` runs `curl -o- -L https://yarnpkg.com/install.sh | bash`. That is the yarn package manager in a test matrix, not a tool an ADR names. It carries no version and no checksum. It matters more for ADR-0011 or ADR-0020.

## The condition

The ADR recommends `script` for one tool and `mise` or `aqua` for several. It also says "`none` is an answer only when no accepted ADR names such a tool." That condition holds today, as shown above.

## Proposed ruling

**Status:** `accepted`

- `tools.manager: none (observed)`: the repository installs no tool outside npm and SHA-pinned actions, and no accepted ADR names one.

**Departure from the recommendation:** the recommendation assumes at least one tool. Here there are none, so `none` is the value the ADR itself allows.

- **Rule 4 (what keeps the pins current):** there are no pins to keep current.
- **When to revisit:** if ADR-0015 or ADR-0011 is later accepted with a `secrets.guard` or `forge.audit` other than `none`, `ontrack check` will fail on this `none`. This ADR must then be superseded with `script` (one tool) or `mise` (several), and that ADR must name who moves each pin.

I'm not proposing `rejected`: the question does apply here, and `none` already answers it.

## Other fields

- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, taken from git config. Tell me if others decided with you.
- I'll rewrite the Consequences lists for `none` and delete the "How to rule" block. Then I'll run `npx ontrack apply`, which also needs your approval.

**Do you agree with `tools.manager: none` and these authors?** Or would you rather rule `script` or `mise` now, ahead of the gitleaks/zizmor rulings?

After you answer, I'll list the rulings the repository doesn't follow yet. No `tracking` trait is decided (ADR-0014 is `proposed`), so I'll give that list in my reply and create no tracker items.
