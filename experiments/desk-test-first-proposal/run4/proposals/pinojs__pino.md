# pinojs__pino

## ADR-0002

Running `ontrack review` needs approval I don't have, so I'll go by the ADR's own instructions and gather evidence directly.

Here's my proposed ruling on **ADR-0002 Localization** (`docs/adr/trivoallan/ADR-0002-localization.md`). I've written nothing yet.

**What the repository does today.** Everything is already in English, though nothing writes that down as a rule:
- **Documentation:** `README.md`, `CONTRIBUTING.md`, `SECURITY.md` and all 15 pages in `docs/` are in English. A search for French accented characters outside `docs/adr/` found 0 matches.
- **Commits:** all 2,017 commits have English subjects. The 5 that contain non-ASCII characters are English with typographic marks (`→`, `…`), for example "fix typo "compatability" → "compatibility"".
- **Code and comments:** `pino.js`, `lib/` and `test/` use English names and English comments.
- **Localization tooling:** none. There is no i18n library, locale file or translations folder. That's expected for a logging library: pino's output is structured JSON for machines, not text shown to users. This ADR is about which language the repository is written in, not about translating a product, so it still applies.
- **Enforcement:** none. No CI step or lint rule checks language.

**Proposed ruling: `accepted`**

| Trait | Value | Marked | Evidence |
| --- | --- | --- | --- |
| `localization.language.default` | `english` | observed | docs, commits, symbols and comments are all English (above) |
| `localization.language.documentation` | *(empty, so it takes the default)* | observed | `README.md` and `docs/*.md` are English |
| `localization.language.commits` | *(empty)* | observed | 2,017 commits, all English |
| `localization.language.code` | *(empty)* | observed | `pino.js`, `lib/`, `pino.d.ts` |
| `localization.language.comments` | *(empty)* | observed | English comments throughout `lib/` and `test/` |

**Differences from the recommendation:** none. The repository already matches it, and the ADR has no conditional recommendations to check.

**If you agree, I'll edit only this file:**
- fill `traits:`
- set `status: accepted`
- set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`
- rewrite the Consequences lists for pino, an English-language open-source project with no French-speaking-team tradeoff
- delete the "How to rule" block and put in its place one line saying the recommendation is adopted as is
- run `npx -p @trivoallan/ontrack ontrack apply`

I couldn't run `npx -p @trivoallan/ontrack ontrack review …`, which `AGENTS.md` asks for, because the command needed approval. If you approve it, I'll run it and check its output against this proposal.

**Rulings the repository doesn't follow yet:** none. Every value above is already what the repository does, so I have no tracking items to propose. No `tracking` trait is decided either (ADR-0014 is still open), so I wouldn't create anything in a tracker anyway.

Do you agree to rule ADR-0002 `accepted` with `default: english` and no overrides?

## ADR-0004

I'm proposing a ruling for ADR-0004. Nothing is written yet, and I need your agreement first. I couldn't run `ontrack review`: the command needed approval and wasn't run. So the evidence below comes from reading the repository directly.

## What the repository does today

- **All runtime code is plain JavaScript (CommonJS).** `package.json` sets `"type": "commonjs"` and `"main": "pino.js"`. Everything in `lib/` is `.js`, as are `bin.js`, `browser.js`, `file.js`, the benchmarks and the examples. Nothing is compiled: `tsconfig.json` has `"noEmit": true`.
- **TypeScript is there only for the type declarations.** There is one hand-written `pino.d.ts`, checked by `test-types` (`tsc && tstyche && ts-node test/types/pino.ts && attw --pack .`) under `test/types/*.tst.ts`. A few test fixtures in `test/fixtures/ts/*.ts` are transpiled, and their only job is to check that TS transports work.
- **The package runs in the browser too.** `"browser": "./browser.js"` and the airtap `browser-test` script show that, and `browser.js` ships as is, without a build.
- **Tests are JavaScript**: `test/**/*.test.js`, run by borp, with linting by eslint/neostandard. CI runs `npm run test-ci` on Node 20 to 26.
- **History**: commits mentioning TypeScript are about the types, a TS version bump or docs on native type stripping. None of them moves the source to TypeScript.

The repository has no declaration of a main language. The answer is clear from the code, though: it's JavaScript.

## Proposed ruling

**Status: `accepted`**

| Trait | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `languages.main.name` | `JavaScript` | **observed** | Every runtime and test file is `.js` with `"type": "commonjs"`; TypeScript is limited to `pino.d.ts` and the type tests. |

**Departure from the recommendation:** the ADR recommends TypeScript for code that runs in browsers, and Python otherwise. Pino runs in both Node and the browser, so the recommendation would be TypeScript. I'm proposing JavaScript instead, with this justification for the ADR:

- Pino is a performance-critical library that ships its source to npm and to browsers exactly as written, with no build step. Moving to TypeScript would add one, and would change the CommonJS code every downstream user loads.
- TypeScript users are already served by the hand-written `pino.d.ts`, which `tsc`, `tstyche` and `attw` check in CI.
- The ecosystem it belongs to (Fastify, pino transports, `thread-stream`, `sonic-boom`) is written in JavaScript the same way.

TypeScript stays a secondary language here, used only for the type declarations and their tests.

I'm not proposing `rejected`: this is a code repository, so the question applies.

To write this up, I also need two things. Should `authors:` be `[Tristan Rivoallan]`? And is the date `2026-11-15`?

**Do you agree with `accepted`, `languages.main.name: JavaScript` and the justification above?** Once you confirm, I'll update the ADR, run `ontrack apply` and then check which rulings the repository doesn't follow yet.

## ADR-0006

I'm gathering commit-history evidence. Next, the scope tally without sed.

Here's the proposed ruling for **trivoallan/ADR-0006 (Commits)**.

The AGENTS.md rule says to run `npx -p @trivoallan/ontrack ontrack review`, but the command needed an approval it didn't get, so I did the review by hand from the ADR and the repository.

## What the repository does today

- **Format:** it is mostly followed, but nothing enforces it. 374 of 2,017 commits use the Conventional Commits format, and 118 of the 172 made since 2025-01-01. Recent subjects include non-format ones such as `Bumped vX`, `fixup`, `maybe fix ci`, `types` and `doc`.
- **Enforcement:** there is none. No commitlint, husky or lint-staged in `package.json`, and no commit-message check in `.github/workflows/`.
- **Versioning is manual.** `.github/workflows/publish-release.yml` runs on `workflow_dispatch` with a required `version` input. `inc-version.sh` takes `major`, `minor` or `patch` as an argument. Release notes come from `@matteo.collina/release-notes`, and no version is worked out from commit messages.
- **Scopes:** they are used often, but nobody controls them. Across the full history: `deps-dev` 72, `deps` 56, `types` 7 (plus one `type`), `api`/`API` 4, `ecosystem` 3, `browser` 3, `transport` 2, `transport-stream` 1, `multistream` 2, `redaction` 2, `mixin` 2, `license` 2, `dependabot` 2. There is also a long tail of one-off scopes such as `logfn`, `log`, `caller`, `proto`, `#1485` and `docs/transports`. The `type`/`types` and `api`/`API` pairs are the drift the ADR describes.

## Proposed ruling: `accepted`

| Key | Value | Observed or absent | Evidence |
| --- | --- | --- | --- |
| `commits.tool` | `none` | **observed** | No commit-message tooling anywhere in the repo, and versions are set by hand (`publish-release.yml` takes a `version` input) |
| `commits.scopes` | `[deps, deps-dev, types, browser, transport, multistream, redaction, serializers]` | **observed** for using these words, **absent** for a closed list | Every word appears in the history as a scope. `serializers` is used only once, but it is a top-level area (`lib/` and `pino-std-serializers`). No list exists today. |

## Differences from the recommendation

1. **`commits.tool: none` instead of `commitlint`.** The ADR recommends commitlint only "if this repository generates its versions from commit messages". That isn't true here: `publish-release.yml` takes the version as a manual `workflow_dispatch` input. With the premise gone, the ADR itself says `none` is just as good an answer.
2. **`commits.scopes`** has no recommended value, so this list is the repository's own answer. I kept only the areas that recur and that people would want to filter on, and dropped the one-offs:
   - `type` merges into `types`.
   - `api`, `ecosystem` and `readme` are left out because the `docs` type already covers them.
   - `#1485`-style issue numbers are not areas.
   - `license` and `dependabot` are left out because they are rare chores.

Note that ADR-0014 (Work tracking) isn't decided, so there's no tracker. Once this ruling is written I'll give any follow-up items in my reply and create nothing.

**Do you agree with this ruling?** You could also change the scope list (for example, use `[]` or add `docs`-related scopes) or choose `commitlint` anyway. If you agree, tell me which names go in `authors:`; I'll use the date 2026-11-15.

## ADR-0009

Running the history measurements one at a time.

Here is my proposed ruling for **trivoallan/ADR-0009 (Branching)**. I haven't written anything yet.

The project rules in AGENTS.md say to run `npx -p @trivoallan/ontrack ontrack review` first. That command is waiting for your approval and has not run, so this proposal comes only from reading the ADR and the repository. If you approve it, I'll check its output against this proposal before writing.

## What the repository does today

- **How changes reach `main`:** nearly every commit on `main` comes from a pull request, with `(#NNNN)` at the end of its subject. Since 2025-01-01 only one merge commit reached `main`: `49a4807 Merge branch 'main' of github.com:pinojs/pino`, a local sync, not a PR. Maintainers also push straight to `main`: the release commits `Bumped vX.Y.Z`, plus `automate releases`, `fixup`, `Add claude files to .gitignore` and `chore: update gitignore for ai assistant files`.
- **Contribution rules:** `CONTRIBUTING.md:15-18` says ongoing work goes on non-`main` branches, non-trivial changes go through a PR, there are no force pushes on `main`, and feature PRs must target `main`, though "PRs to fix bugs in LTS releases are also allowed". The `.github/workflows/target-main.yml` workflow comments on any PR that doesn't target `main`.
- **Long-lived branches:** there is no `develop` or `release/*` branch. There are maintenance branches (`origin/v8.x`, `origin/v9.x`, older `v2.x.x` to `v6.x`), CI runs on pushes to `v*` (`ci.yml:5-7`), and there is an `origin/next` branch.
- **Branch names:** there is no convention. Recent names include `feat/log-event-to-object`, `fix/bigint-config`, `fix/bundler-overrides-prototype-pollution`, `hardening/publish-release-version` (`hardening` is not one of the commit types), `jsumners-patch-1`, `fix-sinon-child-logger-wrapping`, `issue-642` and `next`. Most contributors open PRs from forks, so their branch names never show up in this repository.
- **Branch checks:** nothing in CI checks branch names (no `ontrack` and no `GITHUB_HEAD_REF` in `.github/workflows`).
- **Commit types in squashed subjects:** `feat`, `fix`, `docs`, `chore`, `test`, `ci`, `perf` and `build` (the last one from Dependabot). Some subjects have no type, for example `Add bindings method to browser logger (#2504)` and `Delete .github/dependabot.yml (#2517)`.

## Proposed ruling: `accepted`

| Key | Value | Observed or absent | Evidence |
|---|---|---|---|
| `branching.model` | `github-flow` | observed | PR per change into `main`, `CONTRIBUTING.md:16-18`, `target-main.yml` |
| `branching.merge` | `squash` | observed | One commit per PR with a `(#NNNN)` suffix; no PR merge commits since 2025 |
| `branching.prefixes` | `[feat, fix, docs, chore, test, ci, perf]` | absent | Branch names are mixed (`fix-ci`, `issue-642`, `hardening/…`, `jsumners-patch-1`) |

## Departures from the recommendation

1. **`branching.prefixes` adds `chore`, `test`, `ci` and `perf`** to the recommended `[feat, fix, docs]`. These types already appear on their own PRs here: `chore` in 0185bd6 and 3f86de9, `test` in 18d0e35 and c4d39d4, `ci` in 2ffe576 and b557f72, `perf` in 14d6da5. All four are among the eleven allowed commit types. I left `build` out because almost all of it comes from Dependabot, whose branches are named by the tool and skipped by the check.

The other two keys match the recommendation. There are two deviations from github-flow that I'd write down in the ADR without changing the value:
- **LTS branches** (`v8.x`, `v9.x`) receive backport PRs. This is allowed by `CONTRIBUTING.md:18`, and there's no `develop` branch, so it isn't gitflow.
- **Maintainers push directly to `main`** for release bumps. The ADR says branch protection is a forge setting and not enforced here.

## The ADR's own condition (rule ADR-0012 and ADR-0018 with or before this one)

Neither is ruled. AGENTS.md lists both as "Not yet decided", and there are `origin/dependabot/*` branches as recent as 2026-09-01. `.github/dependabot.yml` was deleted on 2026-09-04 (af2fe10), so new Dependabot branches are unlikely. For now nothing in CI runs the check, so no bot PR can fail it yet. It becomes a risk once ADR-0011 wires the check into CI.

## Rulings not followed yet (if you accept)

- `[trivoallan/ADR-0009] branching.prefixes`: branch names are not `<prefix>/<kebab-case>` from the list, and no CI step runs `ontrack-engineering-check ADR-0009`.
- `[trivoallan/ADR-0009] branching.merge`: is squash the only merge method allowed in the GitHub settings? I can't see that from the repository. Some squash subjects also lack a Conventional Commits type.
- `[trivoallan/ADR-0009] branching.model`: release bumps are pushed straight to `main`, and I can't see the branch protection settings from here.

AGENTS.md has no decided `tracking` trait (ADR-0014 is undecided). So I won't create any tracking items, I didn't check for duplicates, and this list stays in my reply.

**Do you agree with this ruling?** You can accept it as is, keep `prefixes: [feat, fix, docs]`, or change something. If you accept, I also need the `authors:` name or names to record. The date will be 2026-11-15.

## ADR-0011

Still collecting evidence: I've read the workflows. Next I'm checking branch protection on GitHub and whether zizmor or actionlint is set up anywhere.

I couldn't run `npx … ontrack review`, which AGENTS.md says to use, or `gh api …/rules/branches/main`: both calls were blocked pending approval. So I worked from the ADR and the repository itself, and nothing is written yet.

## What the repository does today

- **Forge:** GitHub. `git remote -v` points to `github.com/pinojs/pino`, so `rejected` doesn't apply.
- **Pipeline:** there are 5 workflows in `.github/workflows/`. `ci.yml` runs on every pull request and on pushes to `main`/`v*`. It does a dependency review, then `npm run test-ci` (which includes `eslint .`) across 3 operating systems × 5 Node versions, then a smoke test. The other four are `bench.yml`, `publish-release.yml` (manual trigger), `lock-threads.yml` and `target-main.yml` (a `pull_request_target` workflow that only posts a comment).
- **Whether a red pipeline blocks:** I couldn't check, because the ruleset lives on GitHub and the API call was blocked. One sign it does: `ci.yml:79` only auto-merges Dependabot PRs after `test` passes (`needs: test`).
- **Workflow audit:** none. Searching the repo for zizmor or actionlint finds them only in the ADRs, and no job reads the workflows.

## How the workflows compare with the five fixed rules

These rules apply whatever the ruling. The ones broken here are what zizmor would report:

- **Rule 3 (pin actions by SHA): mostly broken.** Only two actions are pinned: `lock-threads.yml:19` and the checkout in `publish-release.yml:24`. All the others use a tag, for example `actions/checkout@v7.0.1`, `setup-node@v7`, `dependency-review-action@v4`, `github-action-merge-dependabot@v3`, `github-script@v9` and `upload-artifact@v4`.
- **Rule 1 (deploy only from the default branch): broken.** `publish-release.yml` can be started on any branch, and its job has no `if:` on the branch. It pushes to `github.ref` and publishes to npm. It does use `environment: main`, and whether that environment is protected is a GitHub setting I couldn't check.
- **Template injection:** `publish-release.yml:33,38,39` puts `${{ inputs.version }}` and `${{ github.ref }}` straight into `run:` commands.
- **Credentials kept after checkout:** the checkout in `publish-release.yml:24` doesn't set `persist-credentials: false`.
- **Rule 5 (no secrets for forks, no proposed code run with repo rights): met.** `target-main.yml` uses `pull_request_target` but never checks out the fork's code. zizmor will still flag the trigger, so it would need an inline ignore with its reason.
- **Rules 2 and 4 (secrets protected, never logged): no violation seen.** The only secret is `GITHUB_TOKEN`, and npm publishes through OIDC (`id-token: write`).
- **A separate bug:** `target-main.yml:12` writes `"main"` in double quotes. GitHub expressions only accept single quotes, so that workflow most likely fails.

## Proposed ruling: `accepted`, as recommended

| Key | Value | Today | Evidence |
|---|---|---|---|
| `forge.gate` | `blocking` | **observed, but the ruleset is unverified** | `ci.yml` runs on every pull request and auto-merge waits for `test`. The ruleset couldn't be read. |
| `forge.audit` | `zizmor` | **absent** | No workflow, config or script runs zizmor or any other audit. |

There are no departures from the recommendation. `none` doesn't fit because the repository has a real pipeline. `informative` doesn't either, because nothing suggests the checks are only advisory.

What ruling `zizmor` costs: the check (`zizmor --offline --no-config`) will fail until the problems above are fixed or ignored inline with a reason. That means at least the SHA pins, the template injection and the checkout credentials in `publish-release.yml`, and an ignore for `target-main.yml`.

For `authors:` I'd write `Tristan Rivoallan`, the git user, and for `date:` 2026-11-15.

## Follow-up items, if accepted

AGENTS.md has no decided `tracking` trait (ADR-0014 is still undecided), so these are listed here and nothing will be created in a tracker:

- `[trivoallan/ADR-0011] forge.audit: add a zizmor job (zizmorcore/zizmor-action pinned by SHA) on pull requests` (serves ADR-0011)
- `[trivoallan/ADR-0011] forge.audit: pin every action by SHA and fix the template-injection and checkout-credential findings in publish-release.yml` (serves ADR-0011)
- `[trivoallan/ADR-0011] forge.gate: confirm or create a ruleset requiring the CI checks on main` (serves ADR-0011; this one can't be checked from the repository)

Do you agree to rule ADR-0011 `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`? If you'd rather verify the ruleset first, approve the `gh api repos/pinojs/pino/rules/branches/main` call and I'll check it before writing.

## ADR-0023

Here's my proposed ruling for ADR-0023 (License). I haven't written anything yet.

The project rules say to run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0023-license` first. That command needed approval and didn't run, so this review rests on the ADR file and the repository itself.

## What the repository does today

- **Licence file:** a `LICENSE` file is committed at the root. It contains the full MIT text, headed "The MIT License (MIT)". Its history includes `40cc80c chore: update license (#2375)`.
- **Manifest:** `package.json:54` has `"license": "MIT"`. The uncommitted change to `package.json` only adds a devDependency and doesn't touch this field.
- **No other manifest:** there is no `pyproject.toml`, so `package.json` is the only root manifest the check looks at.
- **CI:** no workflow in `.github/workflows/` checks the licence. Once the ADR is accepted, the ADR's `check:` line will do that.
- **Publishing:** the repository is public (`github.com/pinojs/pino`) and has a `publish-release.yml` workflow. That means `UNLICENSED` would be wrong here, and the question clearly applies, so `rejected` isn't justified.

## Proposed ruling

**Status: `accepted`**

| Trait | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `license.spdx` | `MIT` | observed | `LICENSE` holds the full MIT text; `package.json:54` has `"license": "MIT"` |

This is the ADR's recommendation unchanged. I'll write the one line the ADR asks for when it is adopted as is.

## Rules the ADR fixes, and how the repository compares

1. **Manifest declares the value:** it already does, in `package.json`.
2. **Licence file at the root:** it already does, as `LICENSE`.
3. **Copyright holder:** this one doesn't match. The rule says the copyright line should name the organisation that owns the repository (here `pinojs`), or else the people in `authors:`. The current line reads "Matteo Collina, David Mark Clements and the Pino contributors…".
   - I recommend leaving it as it is. It's a long-standing line naming people who really hold copyright, and changing a copyright holder is a legal decision, not a tidy-up. The check doesn't read the file's text, so it will pass either way.
   - Instead, I'd add a sentence to the ADR recording this as a deliberate exception.

## Two things I need from you

1. **Do you agree** with `accepted`, `license.spdx: MIT`, and the copyright line kept as an exception that the ADR records?
2. **What goes in `authors:`?** It needs the names of the people deciding, without email addresses. Shall I put "Tristan Rivoallan"? The `date:` would be 2026-11-15.

Once you agree, I'll fill in the frontmatter, rewrite the Consequences section, replace the "How to rule" block with the reasons, and run `npx -p @trivoallan/ontrack ontrack apply`. I'll then go through the follow-up list of rulings the repository doesn't follow yet. AGENTS.md has no decided `tracking` trait, so I'll give that list in my reply and create no tracker items.

## ADR-0025

I'm checking which ADRs are already ruled, since `none` is only allowed when no accepted ADR names a tool.

I couldn't run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0025-tools`, which AGENTS.md asks for, because the command wasn't approved. This review relies on the ADR's own instructions and on what I read in the repository.

## Proposed ruling: ADR-0025 (Tools outside the package manager)

**Status:** `accepted`

| Trait | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `tools.manager` | `none` | **observed** | Nothing in the repository installs a binary outside npm. See below. |

**What the repository does today**
- **No tool manager:** there is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml` or `aqua-checksums.json`, and no install script. The only shell script is `inc-version.sh`, which is for releases.
- **CI uses only npm and actions:** the five files in `.github/workflows/` contain only `uses:` actions and `npm i`, `npm run …`, `npm publish` and `npm install npm -g`. Nothing is fetched with `curl` or `wget`, and nothing names `gitleaks`, `zizmor`, `actionlint` or a scanner binary.
- **No hooks:** `.git/hooks` holds only the `*.sample` files. There is no `.husky`, no `.pre-commit-config.yaml` and no `.devcontainer`, so no workstation or agent-session setup exists.
- **History:** no commit mentions gitleaks, zizmor, actionlint or mise. ("mise" only appears inside "promise".)
- **No tool named by an accepted ADR:** ADR-0001 is the only accepted ADR in `docs/adr/trivoallan/`. ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`), the two ADRs whose tools this ADR's check lists, are both `proposed`.

**Checking the condition.** The ADR says: "`none` is an answer only when no accepted ADR names such a tool." No accepted ADR names one, so `none` is allowed here.

**How this departs from the recommendation**
1. **`none` instead of `script`, `mise` or `aqua`.** The recommendation table covers the case where one or more tools are named. Here, zero are named and the repository installs none, so there is nothing to pin. Ruling `script` or a manager would set up something with nothing to manage.
2. **Rule 4 (what keeps the pins current).** There are no pins. I'd write in the ADR that nothing moves any, and that the ruling must be revisited as soon as an accepted ADR names a tool.

**Watch out for this.** ADR-0015 recommends `gitleaks` and ADR-0011 recommends `zizmor`. If both are accepted as recommended, the repository will have two tools. This ADR's check then fails under `none`, and the recommendation becomes `mise` or `aqua`. If you plan to accept those two as recommended, you could rule `mise` now instead (status `absent`: you would add `mise.toml` and `mise.lock` with `lockfile = true`, and install mise pinned by `MISE_VERSION`). Otherwise, `none` describes the repository honestly and gets re-ruled when those ADRs are accepted.

---

**Do you agree with `accepted`, `tools.manager: none`?** Or would you prefer `mise`, `aqua` or `script`, ruled ahead of ADR-0011 and ADR-0015? For `authors:`, which name should I write: "Tristan Rivoallan", from git config? I'll write nothing until you confirm.