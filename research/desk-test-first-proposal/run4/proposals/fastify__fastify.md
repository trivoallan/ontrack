# fastify__fastify

## ADR-0002

I couldn't run `npx ontrack review`, which AGENTS.md says to use for ADR reviews, because the command needed your approval. So I ruled from the ADR's own "How to rule" steps and from what the repository contains.

## What the repository does today

There's no written rule about language anywhere: not in `CONTRIBUTING.md`, `docs/Guides/Style-Guide.md`, `docs/Guides/Contributing.md` or `README.md`. In practice, everything is in English.

- **Documentation:** `docs/Guides`, `docs/Reference` and `README.md` are all in English. There are no translated copies of the docs, no `locale*` or `i18n` folders and no `.po` files.
- **Commits:** all of the last 2,000 commit messages are English Conventional Commits, such as `fix(route): …` and `docs: …`. A search for French words found one commit, `Typo correction from extendible to extensible (#4745)`, and that is English too.
- **Code and comments:** searching `lib/`, `fastify.js`, `types/` and `docs` for common French words found nothing. Names and comments are English throughout.

## Comparison with the recommendation

The ADR recommends `default: english` with no overrides, and that matches what the repository already does. Nothing in the ADR is conditional, so there were no conditions to check.

## Proposed ruling

**Status:** `accepted`

| Trait key | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | Docs, commits, code and comments are all in English, per the checks above |
| `localization.language.documentation` | *(empty, so English)* | observed | `docs/**/*.md` and `README.md` are in English |
| `localization.language.commits` | *(empty, so English)* | observed | All of the last 2,000 commit messages are in English |
| `localization.language.code` | *(empty, so English)* | observed | No French names found in `lib/`, `types/` or `fastify.js` |
| `localization.language.comments` | *(empty, so English)* | observed | No French comments found |

**Departures from the recommendation:** none. `rejected` doesn't apply, because the repository has documentation, commits and code that each need a language.

**Writing step:** once you agree, I'll edit only `docs/adr/trivoallan/ADR-0002-localization.md`:
- fill in the traits;
- set `status: accepted` and `date: 2026-11-15`;
- set `authors:` to the people who decide (I'd suggest `[Tristan Rivoallan]`);
- rewrite the Consequences lists for this repository;
- replace the "How to rule" block with one line saying the recommendation is adopted as is.

Then I'll run `npx ontrack apply`, which will also need your approval.

Two questions:
1. **Do you agree with `accepted`, `default: english`, no overrides?** Or would you change something, such as the authors?
2. **Tracking follow-up:** once this is ruled, the repository already follows it, so there will be nothing left to track. AGENTS.md has no decided `tracking` trait (ADR-0014 is still proposed), so I wouldn't create any items in any case.

## ADR-0004

The evidence points one way. Here is the proposed ruling for **ADR-0004 Languages**. I have written nothing yet.

I couldn't run `npx ontrack review trivoallan/ADR-0004-languages`, which AGENTS.md asks for, because it needed an approval it didn't get. So I worked from the ADR's own ruling steps (lines 68–83).

## What the repository does today

- **Runtime code is plain JavaScript.** `package.json` sets `"main": "fastify.js"` and `"type": "commonjs"`, and every file under `lib/`, `build/`, `scripts/` and `integration/` is `.js`. There is no compile step: no `tsc` build script and no `tsconfig.json` at the root. The only one is `test/types/tsconfig.json`.
- **TypeScript is only used for the published types.** `fastify.d.ts` and `types/*.d.ts` are written by hand. `test/types/*.tst.ts` checks them with `tstyche` (`"test:types": "tstyche"`). `examples/typescript-server.ts` is the only other `.ts` file.
- **The project says so itself.** `docs/Reference/TypeScript.md:5` reads: "The Fastify framework is written in vanilla JavaScript, and as such type definitions are not as easy to maintain".
- **The JavaScript tooling is the reference.** Linting is `eslint` with `neostandard`, tests are `borp` on `*.test.js`, and CI enforces 100% line coverage on the JS (`coverage:ci-check-coverage`).
- **Nothing declares a main language yet.** That gap is what this ADR fills.

## Proposed ruling: `accepted`

| Trait | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `languages.main.name` | `JavaScript` | **observed** | `package.json` `main`/`type`; all of `lib/*.js`; `docs/Reference/TypeScript.md:5` |

I'm not proposing `rejected`: this is a code repository, so the question applies.

## Departure from the recommendation

The ADR recommends **TypeScript** or **Python**. This ruling picks **JavaScript** instead. The ADR accepts another language as long as the file says why, and the reason I'd write is:

> Fastify ships plain CommonJS JavaScript that runs on Node.js with no build step. The source is also what gets published, and the project relies on that for performance work, debugging and checking that the bundled `lib/config-validator.js` and `lib/error-serializer.js` match what the build scripts generate. TypeScript users are served by hand-maintained `.d.ts` files, checked with `tstyche`. TypeScript stays a secondary language, limited to `types/`, `fastify.d.ts` and `test/types/`. Rewriting the framework in TypeScript would cost a lot and gain little over that setup.

If you agree, I'll make these edits to `docs/adr/trivoallan/ADR-0004-languages.md`:
- set the trait value and change the status to `accepted`
- set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`
- rewrite the Consequences lists
- replace the "How to rule" block with the justification above

Then I'll run `npx ontrack apply`. After that I'll check the tracker step: AGENTS.md doesn't decide a `tracking` trait yet, so any rulings the repository doesn't follow would only be listed in my reply, not filed.

**Do you agree with `accepted` and `languages.main.name: JavaScript`, or would you change the value, the reason or the authors?**

## ADR-0006

Checking the source areas in `lib/` so the proposed scope list matches the code.

I have the evidence I need. One thing to flag first: AGENTS.md says to run `npx ontrack review trivoallan/ADR-0006-commits` and follow its output, but that command was waiting for your approval and didn't run. Everything below comes from the ADR file and the repository.

## What the repository does today

- **No commitlint and no commit hook.** There is no `commitlint.config.*`, `.commitlintrc*` or `.husky/`, and `package.json` has no commitlint, husky, semantic-release, release-please or changesets.
- **Versions are set by hand.** 46 of the last 1000 commits are manual `Bumped vX.Y.Z` commits. `CONTRIBUTING.md:60-61` says "Declaring formal releases remains the prerogative of the lead maintainers. Do not bump version numbers in pull requests." No workflow publishes or tags a release.
- **The format is enforced in CI another way.** `.github/workflows/pull-request-title.yml:17` runs `fastify/action-pr-title` on the PR title. PRs are squash-merged: 906 of the last 1000 subjects end in `(#NNN)`. So the checked PR title becomes the commit subject.
- **Scopes are used but not fixed.** About a quarter of commits carry a scope, chosen freely, and the same area gets several names:
  - `types` / `typescript` / `ts` / `test-types`
  - `route` / `routes` / `reference/routes`
  - `validation` / `lib/validation`
  - a typo, `validate-ecoystem-links`
  
  The most frequent are `ecosystem` (30), `types` (28), `sponsor` (10), `validation` (8) and `request` (5). This is the drift the ADR describes.

## Proposed ruling: `accepted`

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `commits.tool` | `none` | observed | No commitlint and no hook today. The recommendation only applies when versions are generated from commit messages, and here they are bumped by hand (`Bumped v…` commits, `CONTRIBUTING.md:60`). The PR-title workflow already enforces the format at merge. |
| `commits.scopes` | `[route, request, reply, server, hooks, plugins, decorators, validation, content-type, errors, logger, types, ecosystem, deps]` | absent | The words come from scopes already in the history and from the modules in `lib/` (`route.js`, `request.js`, `reply.js`, `hooks.js`, `decorate.js`, `validation.js`, `content-type-parser.js`, `errors.js`, `logger-*.js`). There is no closed list today, so `typescript`, `ts` and `routes` would be dropped in favour of `types` and `route`. |

**Departures from the recommendation:**
- **`commits.tool`:** I propose `none` instead of `commitlint`. The condition behind the recommendation is false: versions are set by hand, so an off-format message can't produce a wrong version. The squash-merge PR-title check already covers what commitlint would catch.
- **`commits.scopes`:** governance gives no recommendation for this key, so there is nothing to depart from.

I'm not proposing `rejected`: the repository has many areas and already uses scopes.

**Other differences from what governance fixes (not trait keys):**
- The PR-title check allows `types`, which isn't one of the eleven types. It's used as a type 10 times.
- The same check doesn't allow `revert`.
- A few older commits use `lint:` and `doc:`.

## Rulings this repository would not follow yet

No `tracking` trait is decided (Work tracking, ADR-0014, is still proposed). So I'm giving the list here and creating nothing.

- `[trivoallan/ADR-0006] commits.scopes`: the PR-title check accepts any scope. A follow-up item would be to restrict the scope group in `.github/workflows/pull-request-title.yml:17` to the list above.
- Not a trait key, but related: that same regex accepts `types` and rejects `revert`, which doesn't match governance's eleven types.

**Do you agree with this ruling (`accepted`, `tool: none`, and the scope list above)?** Tell me if you want to change the scope list or the tool. If you agree, I'll also need the name(s) to put under `authors:`. I'll then write the ADR and run `npx ontrack apply`.

## ADR-0009

Gathering evidence: history shows squash merges of PRs, plus some direct pushes and a long-lived `next` branch. Checking the forge's merge settings now.

# ADR-0009 (Branching): proposed ruling

I couldn't run `npx ontrack review` because it needed approval, so this is based on the ADR text and the repository itself. I couldn't query the forge's merge settings either (`gh api` also needed approval).

## What the repository does today

- **How work reaches `main`:** it already works one branch per change, through a pull request. `CONTRIBUTING.md:26` says "Non-main branches ought to be used for ongoing work". `CONTRIBUTING.md:32-34` requires two approvals (or one from a core member) and green CI before a merge. `ci.yml` runs on every `pull_request`.
- **Exceptions to that flow:**
  - **Maintenance branches** `1.x` to `5.x`, described in `CONTRIBUTING.md:45-56` and `README.md:50`.
  - **A long-lived `next` branch** for major versions. It was merged into `main` on 2026-08-11 (`1e08dfd9 Merge branch 'next'`).
  - **About 44 of the 335 commits on `main` in the last year came without a numbered PR.** Most are release bumps ("Bumped v5.x") and security-advisory merges ("Merge commit from fork"). A few are direct fixes, for example `7e0c8feb` and `5c1f3935`.
- **How branches are merged:** 291 of those 335 commits end in `(#NNNN)`, which is the mark GitHub's squash merge leaves. There are no "Merge pull request" commits. `.github/workflows/pull-request-title.yml` requires a Conventional Commits PR title, and with squash that title becomes the commit message.
- **Branch names:** there is no convention and nothing enforces one. Of the remote branches:
  - 13 use a commit type as prefix (`feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `ci/`).
  - 4 use other prefixes (`split/`, `semver-major/`).
  - About 12 have no prefix (`named-hooks`, `remove_503`, `automate-releases`…).
  - Pull requests from contributors' forks (`patch-1` and similar) never appear in this list.

## Proposed ruling: `accepted`

| Key | Value | Status | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | observed | `CONTRIBUTING.md:26-34`, PR on every change, CI on `pull_request` |
| `branching.merge` | `squash` | observed | 291/335 commits on `main` end in `(#NNNN)`, no PR merge commits, PR title check |
| `branching.prefixes` | `[feat, fix, docs, refactor, test, ci]` | absent | 13 of about 29 remote branches comply, nothing enforces it |

**Departures from the recommendation, and differences to record in the ADR:**

1. **`prefixes` adds `refactor`, `test`, `ci`.** These three are already used for branch names here (`refactor/types`, `test/handler-timeout-windows-coverage`, `ci/trusted-publishing`) and all come from the eleven commit types.
2. **`github-flow` alongside maintenance branches and `next`.** The `N.x` branches and the occasional `next` branch for a major version are kept. They are release lines, not gitflow's `develop`, `release` and `hotfix` branches. Release bumps and security-advisory merges stay with the lead maintainers, as `CONTRIBUTING.md:60` already says.
3. **Things to note, not departures:**
   - The PR title regex allows `types` and leaves out `revert`, which doesn't match ADR-0006's eleven types. That belongs to ADR-0006, not this ADR.
   - `split/` and `semver-major/` are not commit types, so they won't be allowed as prefixes.

**Risk you should weigh before agreeing:** the ADR's check reads `GITHUB_HEAD_REF`. On this project most PRs come from outside contributors' forks, with names like `patch-1`, so an enforced check would fail them. Pushes to `N.x` and `next` don't run the check, because it only reads branch names on pull requests. Dependabot branches are only exempt once ADR-0018 is ruled, and ADR-0012 must be ruled for release-tool branches. Until then, it's safer to run the check only on branches that maintainers push to this repository.

**Do you agree with this ruling?** You can also change it: for example, keep exactly `[feat, fix, docs]`, or rule `rejected` for prefixes and keep the current freedom. If you agree, also tell me the names for `authors:`. I'll write nothing until you answer.

---

## Rulings this repository does not follow yet

No `tracking` trait is decided (ADR-0014 is still open), so I'll create nothing, and I haven't checked the list against any tracker for duplicates. If you accept the ruling above, these would be the tracking items:

- `[trivoallan/ADR-0009] branching.prefixes: rename or close the branches outside [feat, fix, docs, refactor, test, ci] and document the branch name form in CONTRIBUTING.md`
- `[trivoallan/ADR-0009] branching.prefixes: run the ADR-0009 check in CI, only for branches pushed to this repository`
- `[trivoallan/ADR-0009] branching.merge: set the GitHub repository to allow squash merge only` (I couldn't verify the current setting)

## ADR-0011

Still gathering evidence: next I'm checking whether GitHub has branch protection that makes CI required.

I've reviewed ADR-0011 and propose accepting it with the recommended values: `forge.gate: blocking` and `forge.audit: zizmor`. Nothing is written yet; I need your agreement first. AGENTS.md says to run `npx ontrack review` for ADR reviews, but that command needed approval and didn't run, so this review follows the ADR file alone.

## What the repository does today

- **Forge:** GitHub. The remote is `github.com/fastify/fastify`, and there are 20 workflows in `.github/workflows/` (`ci.yml`, `coverage-*.yml`, `integration*.yml`, `md-lint.yml`, and others).
- **Merge gate:** `CONTRIBUTING.md:34` says *"All integrated CI services must be green before a pull request can be merged."* I couldn't confirm a GitHub ruleset enforces this: `gh api repos/fastify/fastify/branches/main` needed approval and didn't run. So the rule is written down, but whether GitHub enforces it is unverified.
- **Pinning (rule 3):** every external `uses:` is pinned by commit SHA with the tag in a comment, GitHub's own `actions/*` included. The three unpinned hits are local reusable workflows (`./.github/workflows/...`), which is fine. History shows this was deliberate: `b01e67d4 ci: pin third-party actions to commit-hash`, then `ada0623d ci: pin actions to commit-hash`.
- **Permissions:** every workflow sets `permissions: contents: read` at the top, and each job widens only what it needs.
- **`pull_request_target` (rule 5):** two workflows use it, `backport.yml` and `labeler.yml`. Neither checks out the fork's code: they run `tibdex/backport` and `actions/labeler` with scoped write rights. That matches rule 5, but zizmor's `dangerous-triggers` audit will flag both.
- **Workflow audit:** none. No workflow runs zizmor or actionlint, there's no `zizmor.yml`, and history has no zizmor commit. zizmor isn't installed locally (`which zizmor` found nothing); actionlint is, at `~/.local/bin/actionlint`.
- **Deploy (rules 1 and 2):** no workflow uses `environment:`. `website.yml` triggers a docs website build elsewhere; nothing here deploys the package.

## Proposed ruling

**Status:** `accepted`. It isn't `rejected`, because the forge is GitHub.

| Key | Value | Today | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **observed** (as written policy) | `CONTRIBUTING.md:34`; GitHub enforcement unverified |
| `forge.audit` | `zizmor` | **absent** | No zizmor job, config or install; the ruling adds a zizmor job on every pull request |

**Departures from the recommendation:** none. The ADR would get its one line saying it adopts the recommendation as is.

**Costs to know about before agreeing:**
- `ontrack check` runs `zizmor --offline --no-config` and will fail on `backport.yml` and `labeler.yml` (the `dangerous-triggers` audit) until each gets an inline ignore with its reason. Other findings may show up too; I haven't run zizmor on these workflows.
- The only way to silence a finding is an inline `# zizmor: ignore[...]` with its reason, and a person approves it.

**Do you agree to accept ADR-0011 with `forge.gate: blocking` and `forge.audit: zizmor`?** You can also change a value; `informative` is the alternative for the gate. Once you agree, I'll:
1. fill in the traits, status, date and authors;
2. rewrite the Consequences section and remove the how-to-rule block;
3. run `npx ontrack apply`.

**For the end of the review:** the `tracking` trait (ADR-0014) isn't decided, so I won't create tracker items. These are the rulings I expect the repository won't follow yet:
- `[trivoallan/ADR-0011] forge.audit: add a zizmor job to CI and annotate the pull_request_target workflows`
- `[trivoallan/ADR-0011] forge.gate: confirm a ruleset requires the CI checks on main`

## ADR-0023

I read the ADR in full. Note: `npx ontrack review trivoallan/ADR-0023-license`, which AGENTS.md says to run, needed your approval and didn't run. So this review follows the ADR's own instructions.

## What the repository does today

- **Licence file:** `LICENSE` at the root holds the full standard MIT text. Its copyright line is `Copyright (c) 2016-present The Fastify team <https://github.com/fastify/fastify#team>`. The copyright line was changed in three commits: `93d51eaa` (removed the date range), `2af83d64` (made the file the standard MIT text) and `5c62eeb2` (standardised the notice).
- **Root manifest:** `package.json:158` has `"license": "MIT"`. There is no `pyproject.toml`, so `package.json` is the only root manifest the check reads.
- **README:** `README.md:409-411` says "Licensed under [MIT](./LICENSE)."
- **Publication:** the package is published as `fastify` and is not marked `private`. So `UNLICENSED` doesn't apply, and the question isn't one to reject.
- **Copyright holder:** the repository is `github.com/fastify/fastify`, owned by the fastify organisation. The copyright line names "The Fastify team", which matches the ADR's third fixed point: the holder is the organisation that owns the repository.
- **Not set up yet:** the ADR's `check:` runs `npx --no-install ontrack-engineering-check`. Its package is only an uncommitted devDependency in `package.json` (`trivoallan: npm:@trivoallan/ontrack-engineering@0.6.0`).

**Compared with the recommendation:** there are no differences. The recommendation is MIT, the manifest says MIT and the root licence file is MIT. The ADR has no conditional recommendation to check. Its Apache-2.0 alternative ("when an explicit patent grant matters") would change a licence this project has used since 2016, and nothing in the repository asks for that.

## Proposed ruling

- **Status:** `accepted`
- **`license.spdx`:** `MIT`, **observed** (`package.json:158`, root `LICENSE`, `README.md:411`)
- **Departures from the recommendation:** none. In place of the "How to rule" block I'll write one line saying the recommendation is adopted as is.
- **Date:** 2026-11-15

Do you agree with this ruling? Also, who should go in `authors:`? I'd put **Tristan Rivoallan** (the git user), without an email address, unless you tell me otherwise. Once you confirm, I'll fill the frontmatter, rewrite the Consequences, delete the "How to rule" block and run `npx ontrack apply`. After that I'll list any rulings the repository doesn't follow yet.

## ADR-0025

Too broad; narrowing to CI, scripts and config.

I read the ADR in full. `npx ontrack review trivoallan/ADR-0025-tools`, which AGENTS.md says to run, was blocked by the permission prompt and did not run. So this review follows the ADR's own instructions.

## What the repository does today

- **No tool manager and no install script.** The repository has no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json` or `.tool-versions`, and no script that downloads a binary and checks it with `sha256sum -c`. The `git ls-files` search for these files found nothing, and nothing in the git history touches them.
- **No commit hooks and no setup for agent sessions.** There is no husky, lefthook or pre-commit config and no devcontainer. `.gitpod.yml` only runs `npm install`. So no workstation path exists where a tool could be installed one way and the runner another.
- **CI gets its tools from the package manager or from pinned actions.** Every `uses:` in `.github/workflows/` is pinned by SHA. lychee and linkinator run as actions, which this ADR leaves to ADR-0011.
- **One binary is fetched outside both.** `.github/workflows/package-manager-ci.yml:72` runs `curl -o- -L https://yarnpkg.com/install.sh | bash`, with no version and no checksum. This is the problem the ADR describes. But yarn is the thing that job tests, and no ADR names it, so rule 1 (which covers "every tool an accepted ADR names") doesn't reach it.
- **No accepted ADR names a tool yet.** ADR-0011 (`forge.audit`, recommends `zizmor`), ADR-0015 (`secrets.guard`, recommends `gitleaks`) and ADR-0019 (scanner, recommends `grype`) are all still `proposed`. AGENTS.md lists them as "Not yet decided".

## The condition in the recommendation

The recommendation is `script` for one tool, `mise` or `aqua` for several, and `none` "only when no accepted ADR names such a tool." Counting only what is accepted today, the repository has **zero** such tools. That meets the ADR's own condition for `none`.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `none` | **observed** | No manager, script or hook exists, and no accepted ADR names a tool outside npm or actions. |

**Departure from the recommendation:** the ADR recommends `script` or `mise`/`aqua`. I propose `none` because the condition for it holds today. This needs revisiting as soon as ADR-0011 or ADR-0015 is accepted with a tool. The ADR's check helps here: with `none`, `ontrack-engineering-check ADR-0025` fails as soon as `secrets.guard` or `forge.audit` names a tool, so it can't be forgotten.

**Keeping pins current (rule 4):** with `none`, there are no pins to keep current. The text will say that.

**Not in scope, but worth a note in the ADR:** the unpinned yarn install in `package-manager-ci.yml:72`.

**Alternative, if you plan to accept ADR-0011 and ADR-0015 with their recommended tools:** rule `tools.manager: mise` (marked absent) now. Two tools, gitleaks and zizmor, fall under "several", and mise is the only manager the check actually verifies. You would then need to add `mise.toml` with `lockfile = true`, `mise.lock`, a pinned `jdx/mise-action`, and Renovate to move the pins.

Do you agree to accept ADR-0025 with `tools.manager: none`, or would you rather rule `mise` now? Please also give the names for `authors:`. I'll write nothing until you answer.