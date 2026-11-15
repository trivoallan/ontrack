=================== unjs__h3 ADR-0002
Now the evidence from the repository.

## Proposed ruling: ADR-0002 Localization

**What the repository does today.** It has never written down a language policy. No file in the repo names one: nothing in `README.md` or `AGENTS.md`, no `CONTRIBUTING.md`, and no i18n or locale setup. The only matches for "i18n/locale/translat" are inside the ADRs. In practice, though, everything is in English:

- **Documentation:** all of `docs/1.guide`, `2.utils`, `4.examples`, `5.migration`, `99.blog`, plus `README.md`, `MIGRATION.md` and `CHANGELOG.md`. There are no translated copies (no `*.fr.md` or similar).
- **Commits:** 1,651 commits, almost all in English conventional-commit form. The rest are short English messages such as `lint`, `fmt` and `sync docs`.
- **Code and comments:** names and comments in `src/` and `test/` are English. The only non-ASCII characters in `src/` are `§` and `→` in English comments (`src/utils/json-rpc.ts:357`).
- **Tooling:** `typos.toml` configures the English spell checker crate-ci/typos. CI doesn't run it: `.github/workflows/ci.yml:22` only runs `pnpm lint`, which is oxlint and oxfmt.

**Compared with the recommendation.** The ADR recommends `default: english` with no overrides, and that is exactly what the repo already does. I found no differences. The recommendation has no conditions to check.

**Proposed ruling**

- **Status:** `accepted`
- `localization.language.default`: **`english`**. Evidence: all docs, 1,651 commits, symbols and comments are English, and `typos.toml` sets up an English spell checker.
- `documentation`: empty (same as default). The docs are English only.
- `commits`: empty (same as default). The history is English.
- `code`: empty (same as default). The symbols in `src/` and `test/` are English.
- `comments`: empty (same as default). The comments in `src/` are English.
- **Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.
- **To fill in:** `date: 2026-11-15`, and `authors: [Tristan Rivoallan]` (your git user name; tell me if others took part in the decision).

When you agree, I'll do all five steps in one change. I'll fill the frontmatter, set the status, rewrite the Consequences lists for an English-only open-source project, replace the how-to-rule block with a line saying the recommendation is adopted as is, and run `npx ontrack apply`.

I'll leave the list of rulings the repo doesn't follow yet until every ADR is ruled. This one should add nothing to it, since the repo already matches.

**Do you agree with this ruling, and with the date and authors?**
=================== unjs__h3 ADR-0004
I've looked at the repository and have a ruling ready for you to approve. I haven't written anything yet.

## What the repository does today

- **Source:** 181 tracked `.ts` files. Every file under `src/` is `.ts`, and so is the test suite.
- **TypeScript setup:** `tsconfig.json` turns on `strict`, `isolatedDeclarations`, `verbatimModuleSyntax` and `erasableSyntaxOnly`, and covers `src` and `test`. `package.json` depends on `typescript` ^7.0.2.
- **Agent instructions:** AGENTS.md already says "Strict TypeScript", ".ts extensions in all import paths" and "ESM only".
- **Other languages:** 24 `.mjs` files: `bin/h3.mjs`, `examples/*.mjs`, `playground/server.mjs` and `vitest.config.mjs`. These are entry points and examples, not library code. The ADR says other languages like this don't change the answer.
- **Python, Go, Rust:** none in the repository.
- **Browser condition:** the ADR says to choose TypeScript when code runs in a browser or is shared between browser and server. This repository meets that condition. AGENTS.md lists "Service Workers, browsers" among the runtimes, `src/_entries/generic.ts` is the browser and Web Worker entry, and `tsconfig.json` includes the `DOM` and `WebWorker` libs.
- **Validation library:** `zod` ^4.6.7 is already a dev dependency, which fits the TypeScript path the ADR relies on for ADR-0005.

## Proposed ruling

**Status:** `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `TypeScript` | 181 `.ts` files and all of `src/` and `test/`; strict `tsconfig.json`; the browser and Web Worker entry meets the ADR's TypeScript condition |

**Departures from the recommendation:** none. The Decision section will be replaced by one line saying the recommendation is adopted as is.

**Other fields:**
- `date:` would be `2026-11-15`.
- `authors:` would be `[Tristan Rivoallan]`, taken from the git user. Tell me if someone else decided.
- The Consequences lists would be rewritten for this verdict.

**Not followed yet:** nothing. The code is already TypeScript, so I don't see a tracking item to propose for `[trivoallan/ADR-0004] languages.main.name`. The full list of rulings the repository doesn't follow, checked against the tracker, waits until every ADR is ruled. ADR-0014 (`tracking`) hasn't been decided yet.

Do you agree with this ruling, including the date and authors? Once you say yes, I'll update the ADR and run `npx ontrack apply`.
=================== unjs__h3 ADR-0006
Now the repository's current state: release tooling, commit hooks, CI, and history.

Let me use the Grep tool on the saved subjects instead.

I've read the ADR and looked at the repository. Here's my proposed ruling. I haven't written anything yet.

## What the repository does today

**There is no tool enforcing the commit format.** There's no commitlint config or dependency, no husky, simple-git-hooks or lefthook, and no CI step that checks commit messages. `.github/workflows/ci.yml` only runs lint, typecheck, build and tests. The only thing keeping the convention is review, and `autofix.yml` commits as `chore: apply automated updates`.

**Versions and the changelog are generated from commit messages.** So the ADR's condition for `commitlint` holds:
- `package.json` defines `"release": "pnpm build && pnpm test && changelogen --release && pnpm publish …"`. When no `-r` is given, `changelogen --release` works out the semver bump from the commit types and writes `CHANGELOG.md`.
- The history shows this script is in use, with commits like `f0e1780 chore(release): v2.0.8` and `9d70cf3 chore(release): v2.0.7`.
- `.github/workflows/publish.yml` runs `changelogen --bump -r 2.0.0 --canary nightly`. Here the base version is pinned by hand, so for nightlies the messages only feed the changelog.

**Most of the history already follows Conventional Commits.** In the last 600 commits:
- 257 have a scope and 336 have none.
- 30 don't match the eleven governed types. About 20 of those use a `types:` / `types(handler):` type, which changelogen accepts but governance and `config-conventional` don't. The rest are things like `lint`, `fmt`, `sync docs`, a typo `ix(examples)` and one `refactor!(…)` with the `!` in the wrong place.

**Scopes are invented on the fly, which is the problem the ADR describes.** The same area shows up under several names:
- `sse`, `event-stream` and `EventStream`
- `static`, `serve-static` and `serveStatic`
- `rules` and `route-rules`
- `auth` and `basic-auth`

Some scopes are function names, such as `fromNodeHandler`, `defineValidatedHandler`, `handleCacheHeaders` and `resolveDotSegments`.

## Proposed ruling: `accepted`

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `commits.tool` | `commitlint` | Releases are generated from commit types by `changelogen --release` (`package.json` `release` script), so the ADR's condition is met. Nothing enforces the format today, and 30 of the last 600 subjects would have produced wrong or missing changelog entries. |
| `commits.scopes` | `[adapters, auth, base, body, cache, cli, cookie, core, cors, error, event, examples, handler, json-rpc, middleware, proxy, query, request, response, route, rules, session, sse, static, tracing, validate, ws, deps, release]` | One scope per module under `src/`, `src/utils/` and `src/rules/` that the history actually uses. Synonyms are merged into one name (`event-stream` → `sse`, `serve-static` → `static`, `route-rules` → `rules`, `basic-auth` → `auth`), and function names map to their module. `core` covers `src/h3.ts` (it was used as `refactor(core)`, and `mount`/`h3` fold into it). `cli` is `bin/`, `examples` is `examples/`. `release` must be in the list because changelogen writes `chore(release): vX` itself. `deps` must be in the list because Renovate (`renovate.json` → `unjs/renovate-config`) writes `chore(deps)`. |

**Departures from the recommendation:** none. `commitlint` is the recommended value, and the ADR gives no recommendation for scopes. The ADR text would say it adopts the recommendation as is.

**What changes for current practice:**
- The `types` type (about 3% of commits) would be refused. Type-only changes would have to use `fix` or `refactor`.
- Today's long-tail scopes (`mime`, `fingerprint`, `timing`, function names) would be refused until they're mapped to the list or the list is extended.

**Caveats I'll list as follow-ups once the ruling is in:**
- PRs are squash-merged (subjects end in `(#NNNN)`), so the message that lands on `main` is the PR title. The ADR's check runs commitlint on `origin/HEAD..HEAD`, which covers branch commits, not that title.
- CI does a shallow checkout. The check would need `fetch-depth: 0` and probably `--from origin/main`.

To rule, I'd fill in the two keys, set `status: accepted` and `date: 2026-11-15`, and rewrite Consequences. I'd also replace the "How to rule" block with one line saying the recommendation is adopted as is, then run `npx ontrack apply`.

**Do you agree with this ruling?** You can change the scope list or the tool (for example, `none`), and I need the names to put under `authors:`.
=================== unjs__h3 ADR-0009
ADR-0009 (Branching) has no answer in the repository yet. Nothing in it says how a branch is named or how a pull request is merged: there's no CONTRIBUTING file, and no branch rule in AGENTS.md, CI or config. The git history and the GitHub workflows do show what people actually do.

## What the repository does today

| Question | Evidence | What it shows |
|---|---|---|
| How work reaches `main` | `git log --since=2026-01-01`: 170 commits end in `(#NNNN)` (merged pull requests) and 251 don't (pushed straight to `main`). The direct pushes include every `chore(release): v2.0.x`, made by the `release` script (`changelogen --release … && git push --follow-tags`, `package.json:52`), plus some `fix`/`chore` commits. CI runs on pull requests to `main` and on pushes to `main` (`ci.yml`). `CODEOWNERS` has one owner, `@pi0` | Two paths. Outside contributions go through a pull request and review (github-flow). The maintainer often pushes straight to `main`, which is trunk-style |
| Merge strategy | 1,651 commits with only 3 merge commits (the latest is #1156 in 2025-07). Pull-request commits are single commits titled `type(scope): … (#NNNN)` | Squash merge |
| Branch names | Prefixed remote branches: `feat/` (17), `fix/` (4), `chore/` (2), `build/` (1), `docs/` (1). Unprefixed ones: `feat-defineWebSocketRoute`, `fix-pr`, `fix-spread-options`, `docs-examples`, `merge-headers`, `h3-v2`, `pr-1368/…`, and the `v1` maintenance branch | Mostly `prefix/kebab-case`, with a fair number of exceptions |
| Long-lived branches | `v1`, plus `renovate.json` with `baseBranches: ["main", "v1"]` | One maintenance line. It's not gitflow: there's no `develop` or `release/*` |
| Bots | Renovate (`renovate/…` branches). Releases run locally with changelogen, so no release branch exists. autofix.ci commits onto existing pull-request branches | ADR-0018, which would exempt `renovate/` branches, is still `proposed` |

## The condition in the ADR

The `check:` line says to rule ADR-0012 (delivery) and ADR-0018 (dependency updates) with or before this one. Both are still `status: proposed` (`grep status: docs/adr/trivoallan/*.md`). Until ADR-0018 names Renovate, the check would fail Renovate's `renovate/…` branches. ADR-0012 doesn't cause a problem: changelogen opens no branch.

## Proposed ruling: `accepted`

- **`branching.model: github-flow`** (as recommended). Every outside contribution follows it: the `(#NNNN)` squash commits, `CODEOWNERS`, and CI and autofix running on pull requests. Departure in practice: about 60% of 2026 commits went straight to `main`. I'd record that as a gap to close rather than rule `trunk-based`. Trunk-based would need feature flags, and the repository has none for unfinished work.
- **`branching.merge: squash`** (as recommended). History is linear and each pull request becomes one commit carrying its PR number.
- **`branching.prefixes: [feat, fix, docs, chore, build]`**. This departs from the recommended `[feat, fix, docs]`. `chore/` and `build/` are already used (`origin/chore/bench`, `origin/chore/playground`, `origin/build/compact`), and `chore` is the most common commit type here (692 commits). Both come from the eleven allowed types.

Every difference from the recommendation:
1. The prefixes add `chore` and `build`. The reason is in the last bullet above.
2. Direct pushes to `main` (releases and maintainer commits) don't follow github-flow. That's a gap to track, not a departure written into the ADR.
3. Unprefixed branches already exist (`feat-defineWebSocketRoute`, `fix-pr`, `h3-v2`, `pr-1368/…`). The check would flag them if a pull request were opened from them again.
4. The `v1` maintenance branch fits none of the prefixes. It's a base branch, not a work branch, but the check would flag it if it ran there.
5. ADR-0018 is still unruled, so Renovate pull requests would fail the check until it is.

When it's written, `date:` would be 2026-11-15. For `authors:`, I'd use the git user, Tristan Rivoallan, unless you tell me otherwise.

**Do you agree with this ruling?** In particular:
- (a) Should the prefixes be `[feat, fix, docs, chore, build]`? Other options are the recommended three, or adding `refactor` and `perf` (110 and 22 commits).
- (b) Is `github-flow` right, or would you rather rule `trunk-based` to match how the maintainer works?

I'll write nothing until you confirm.
=================== unjs__h3 ADR-0011
I'm reading the workflow-hardening commit, then checking whether `main` has branch rules on GitHub.

I recommend accepting ADR-0011 as written: `forge.gate: blocking` and `forge.audit: zizmor`. I haven't written anything yet, and I need your agreement before I do.

## What the repository does today

- **Forge:** GitHub. The remote is `github.com/unjs/h3`, and `publish.yml` checks `github.repository == 'h3js/h3'`, so the repository has been renamed. Nothing points to another forge, so `rejected` doesn't apply.
- **Pipeline:** there are three workflows in `.github/workflows/`:
  - `ci.yml` runs on pushes and pull requests to `main`. Its `tests` job runs `pnpm lint`, `typecheck`, `build` and `vitest --coverage`, then uploads coverage to Codecov. Its `publish-pkg-pr-new` job runs on pull requests only.
  - `autofix.yml` runs `pnpm fmt` with `autofix-ci/action`.
  - `publish.yml` publishes a nightly to npm only after `ci` succeeds on a push to `main` from this same repository, at the tip of `main`.
- **The five fixed rules:**
  - **Pinning:** every `uses:` is pinned by SHA with the tag in a comment, `actions/*` included.
  - **Permissions:** every workflow sets `permissions: {}` and each job opts in to what it needs.
  - **Untrusted code:** there is no `pull_request_target`.
  - **Secrets:** `CODECOV_TOKEN` is the only secret, and nothing prints it.
  - **Deploy:** publishing is bound to `main` through `workflow_run` with `branches: [main]` and an `if:`.
  - This follows from commit `ae12401` ("ci: harden workflows").
- **Workflow audit:** none. No job runs zizmor, it isn't installed locally (`zizmor not found`), and there is no `zizmor.yml`. `actionlint` is in `~/.local/bin`, but no CI job or script uses it.
- **Required checks:** unknown. My `gh api …/rules/branches/main` call needed approval and wasn't run, so I couldn't see whether a ruleset makes `ci` required on `main`.

## Proposed ruling: `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `ci.yml` runs on every pull request to `main`, and `publish.yml` publishes nothing unless `ci` succeeds. The repository already treats red as a stop for releases, and `blocking` extends that to merges. |
| `forge.audit` | `zizmor` | The workflows already follow most of what zizmor audits (SHA pins, `permissions: {}`, `persist-credentials: false`). With zizmor in place, they stay that way without anyone checking by hand. |

## Differences from the recommendation

There are no departures in the values; I'm proposing exactly what the ADR recommends. The repository doesn't yet do all of it:

1. **No zizmor job.** The ADR's audit rule 1 requires zizmor on every pull request through a SHA-pinned `zizmorcore/zizmor-action`.
2. **zizmor isn't installed locally,** so the `check:` command can't run its `forge.audit` part yet.
3. **One likely zizmor finding:** the checkout in `autofix.yml` doesn't set `persist-credentials: false`, which zizmor's `artipacked` audit flags. The fix is either that setting or an inline `# zizmor: ignore[artipacked]` with its reason.
4. **The ruleset isn't verified.** `blocking` only becomes real once a GitHub ruleset requires the `ci` checks on `main`, and I couldn't read the rules.
5. **Deploy rule 1, smaller gap:** the publish job uses no GitHub `environment:`, so there is no environment protection. The `workflow_run` branch filter, the `if:` and npm trusted publishing (OIDC) stand in for it. I'd note this in the ADR rather than call it a departure.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** Or would you rather have `informative`, or `forge.audit: none`? Once you agree, I'll:
- fill the traits and set the status, date and authors (Tristan Rivoallan);
- rewrite the Consequences and delete the "how to rule" block;
- run `npx ontrack apply`.

If you approve the `gh api repos/h3js/h3/rules/branches/main` call, I can also check whether a ruleset already makes `ci` required on `main`.
=================== unjs__h3 ADR-0023
I've read ADR-0023 in full. This repository already has a licence and states it the same way everywhere, so this ADR only records what is already true.

## What the repository does today

| Point | Evidence |
| --- | --- |
| A licence file is committed at the root | `LICENSE` is tracked (`git ls-files`). It holds the full MIT text. It was added in `cbc8909` (2020-11-17, initial commit) and last touched in `a138101` (2022-11-15) |
| The root manifest declares the licence | `package.json:6` has `"license": "MIT"`, both in the working tree and at `HEAD` |
| There is no `pyproject.toml` | `git ls-files pyproject.toml` returns nothing, so there is no second root manifest to align |
| The subfolder manifests are private | `docs/`, `examples/` and `playground/package.json` have `"private": true` and no licence. The check doesn't read subfolders anyway |
| The package is published publicly | The package is `h3` v2.0.8 (`package.json`) and the repository is public, so `UNLICENSED` doesn't fit |

**Compared with the recommendation:**
- **Licence (`license.spdx`):** the repository uses `MIT`, which is what the ADR recommends. No difference.
- **Manifest declares the value:** already done.
- **Licence file at the root:** already done.
- **Copyright holder:** this is the one difference. `LICENSE` says `Copyright (c) Pooya Parsa <pooya@pi0.io>`, a person. The ADR asks for the organisation that owns the repository (`h3js` according to `package.json` `repository`; the remote is `unjs/h3`), or else the people in `authors:`. I propose leaving the line as it is. It has been in place since 2020, it covers every version already released, and only the copyright holder can legally change it. The ADR's own check doesn't read the file's text, so this passes the check. I would write the reason for keeping it into the ADR.

**Conditional recommendation:** "Apache-2.0 when an explicit patent grant matters." Nothing in the repository suggests patents are a concern: it's an HTTP framework with no patent notices and no `NOTICE` file. MIT stands.

**Why not `rejected`:** the question applies here, because this is a public, published package.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`:** `MIT`, from `package.json:6` and the root `LICENSE`
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]` (the git user), unless you want someone else named
- **Departure from the recommendation:** one, the copyright holder. `LICENSE` keeps "Pooya Parsa", the original author, instead of the organisation, for the reasons above.

Do you agree with this ruling, including the authors name and keeping the existing copyright line? I won't write anything until you say yes.
=================== unjs__h3 ADR-0025
I've finished collecting evidence and am writing up the proposed ruling.

# Proposed ruling for ADR-0025 (Tools outside the package manager)

## What the repository does today

- **No tool manager, and no tool outside the package manager is set up.** There is no `mise.toml`, `.tool-versions`, `aqua.yaml` or install script. `bin/h3.mjs` is the package's own command-line tool.
- **No git hooks.** `package.json` has no `simple-git-hooks`, `husky` or `lint-staged`, and there is no `.husky/` folder, so nothing on a workstation tells anyone to `brew install` a tool.
- **CI installs nothing on its own.** All three workflows use `unjs/setup-jup@85aa1e9…`, which sets up Node and pnpm from `devEngines` (`package.json:117-127`). All other tools come from the lockfile through `pnpm`. The codecov CLI (`version: v11.3.1`, `ci.yml`) arrives inside a hash-pinned action, which ADR-0011 rule 3 covers, not this ADR. `npm i -g npm@11.19.1` in `publish.yml` installs the package manager itself.
- **One config file for a tool nothing runs:** `typos.toml` (crate-ci/typos). No workflow, script or hook calls it, so no version is written down anywhere.
- **Updates come from Renovate**, not Dependabot (`renovate.json`, extending `unjs/renovate-config`). That matters for rule 4, because Renovate has a `mise` manager.
- **Accepted ADRs:** only ADR-0001 (checked with `grep -m1 '^status:'` across `docs/adr/trivoallan/`). ADR-0015 (`secrets.guard`, recommended `gitleaks`) and ADR-0011 (`forge.audit`, recommended `zizmor`) are both still `proposed`.

## The ADR's condition

The ADR says "`none` is an answer only when no accepted ADR names such a tool." That condition holds today: no accepted ADR names a tool, and the repository uses none. The recommendation ("`script` with one tool; `mise` or `aqua` with several") counts tools, and here the count is zero.

## Proposed ruling

- **Status:** `accepted`. The question does apply to this repository, so `rejected` would be wrong.
- **`tools.manager: none`.** Evidence: no accepted ADR names a tool outside the package manager (only ADR-0001 is accepted), and the repository installs none (no manager files, no install script, no hooks; CI uses only setup-jup and pnpm).
- **Rule 4 (who keeps the pins current):** there are no pins. Renovate (`renovate.json`) is written down as the updater to use if that changes.
- **Departure from the recommendation:** the recommendation only covers one tool or several. With zero tools, `none` is the value the ADR itself allows. The reason goes in the ADR.

**What this costs later:** if ADR-0015 or ADR-0011 is then accepted with `gitleaks` or `zizmor`, `ontrack check` fails on `none`, and this ADR has to be superseded. If you expect to accept both with their recommended tools, the alternative is `mise` now. That would make two tools, and Renovate's `mise` manager already moves the `mise.lock` checksums. I'm not proposing it as the default, because this ruling should describe the repository as it is. Also, `typos.toml` points at a tool nothing installs or runs. That's outside this ADR until an accepted ADR names typos.

**Do you agree to `accepted` with `tools.manager: none`, or would you rather rule `mise` now?** I'll also need the name to put in `authors:`, `Tristan Rivoallan` unless you say otherwise. I won't write anything until you answer.
