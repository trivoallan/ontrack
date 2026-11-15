=================== fastify__fastify ADR-0002
Here is my proposed ruling for **ADR-0002 Localization**. I haven't written anything yet. I also tried to run `npx ontrack review trivoallan/ADR-0002-localization`, as AGENTS.md asks, but the command needs your approval, so it hasn't run. I based the ruling on the ADR's own "How to rule" steps and the repository evidence below.

### What the repository does today
Fastify uses English for everything, and nothing in the repository states that as a rule:
- **Commits:** 4,928 commits in the history. None of the last 300 subjects contains a non-ASCII character, and they're written in English Conventional Commits style (e.g. `fix(route): apply prefixTrailingSlash…`).
- **Documentation:** all of `docs/Guides` and `docs/Reference` is in English (`Getting-Started.md`, `Migration-Guide-V5.md`, …). There are no translated copies. `docs/Guides/Style-Guide.md` doesn't mention which language to write in.
- **Code and comments:** the only accented characters outside `docs/adr` are people's names (`README.md:301`, `package.json:130`, `SPONSORS.md:28`) and one test value (`test/router-compile.test.js:32`, `'café'`).
- **i18n mentions:** they're about features for Fastify's users (ajv-i18n in `docs/Reference/Validation-and-Serialization.md`, ecosystem plugins). They aren't about the language the repository itself is written in.

### Compared with the recommendation
The ADR recommends `default: english` with no overrides, which matches what the repository already does. There are no differences and no conditions to check. Rejecting the ADR isn't justified: an agent writing here still needs the language answer.

### Proposed ruling
- **status:** `accepted`
- `localization.language.default`: `english`. Evidence: commit history, `docs/`, and code symbols and comments are all in English.
- `documentation`: left empty (same as default). Evidence: all of `docs/` is in English.
- `commits`: left empty (same as default). Evidence: none of the last 300 commit subjects contains a non-ASCII character.
- `code`: left empty (same as default). Evidence: the only non-ASCII text in code is the `'café'` test value.
- `comments`: left empty (same as default). Evidence: same check as `code`.
- **Departures from the recommendation:** none. The ADR will say in one line that the recommendation is adopted as is.

If you agree, I'll do the following:
1. Fill the traits and set `status: accepted`.
2. Set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`.
3. Rewrite the Consequences section. The current Negative items about French-speaking maintainers don't apply to Fastify, so I'd replace them with what this ruling actually costs.
4. Delete the "How to rule" block.
5. Run `npx ontrack apply`, which also needs your approval.

The post-ruling step of listing rulings the repository doesn't follow yet will wait until every ADR is ruled. Right now ADR-0002 through ADR-0026 are still proposed, and no `tracking` trait is decided, so nothing would go to a tracker yet.

**Do you agree with this ruling (`accepted`, `default: english`, no overrides), or do you want to change anything?**
=================== fastify__fastify ADR-0004
Checking what the contributor docs say about the implementation language, then I'll write up the proposal.

I couldn't run `npx ontrack review trivoallan/ADR-0004-languages`, which AGENTS.md says to use, because it needs your approval. I read the ADR itself and used the steps it gives for ruling. If you approve the command, I'll check its output against this proposal.

## What the repository does today

- **All runtime code is plain JavaScript.** `package.json` has `"main": "fastify.js"` and `"type": "commonjs"`. All 31 files in `lib/` are `.js`, as are `build/*.js`, `scripts/*.js`, `examples/*.js` and `test/**/*.test.js`.
- **Nothing is compiled.** Node runs `fastify.js` directly. No tsconfig compiles the sources: the only one is `test/types/tsconfig.json`. A search for `checkJs`, `allowJs` and `// @ts-check` finds nothing.
- **TypeScript is only a typing layer for users.** It consists of:
  - hand-written declaration files: `fastify.d.ts` (`"types"` in `package.json`) and `types/*.d.ts`
  - type tests in `test/types/*.tst.ts`, run by `test:types` (`tstyche`)
  - the CI workflow `.github/workflows/missing_types.yml`
  - `README.md:244`, which links to the TypeScript reference docs
- **The tooling is JavaScript tooling.** It's `eslint` with `neostandard`, `borp` and `c8` for tests and coverage, and `ajv` for validation. Neither `zod` nor `pydantic` is used.
- **Nothing records a language policy.** No contributor doc says which language to write in, and the `traits:` key is empty.

## Comparison with the recommendation

The ADR recommends `Python` or `TypeScript`:
- **TypeScript doesn't fit.** The ADR's condition for it is a repository that "runs in a browser or shares code between browser and server". Fastify is a Node.js server framework (`package.json` describes it as "Fast and low overhead web framework, for Node.js"), so the condition isn't met. Also, no TypeScript source exists, so `TypeScript` would send an agent to write `.ts` in `lib/`, which is wrong.
- **Python doesn't fit either.** There is no Python in the repository.
- **The real answer is a language outside the list.** The ADR allows that if this file says why.

## Proposed ruling

**Status:** `accepted` (not `rejected`: this is a code repository with a clear main language).

| Trait key | Value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `JavaScript` | `package.json` `main: fastify.js` and `type: commonjs`, everything in `lib/` is `.js`, and no tsconfig compiles the sources |

**The departure and its reason, to be written into the ADR:**
- **Why JavaScript:** this is an established, published npm library written in CommonJS JavaScript. Node runs it with no build step, and its users depend on that.
- **How TypeScript users are served:** through hand-maintained declarations (`fastify.d.ts`, `types/*.d.ts`). `tstyche` and the `missing_types.yml` workflow check them, so new public API also needs matching `.d.ts` changes and `.tst.ts` tests.
- **Why not convert:** rewriting the codebase in TypeScript would give no benefit that justifies changing the build and how the package is published.

**Other fields:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, taken from your git user name. Correct it if others decided.
- The Positive, Negative and Neutral lists under Consequences get rewritten for this ruling.
- The "How to rule" block gets replaced by the reason above.

Do you agree with ruling `accepted` and `languages.main.name: JavaScript`, and with the authors as listed? I won't write anything until you confirm. Once you do, I'll edit only this ADR and run `npx ontrack apply`, which will also need your approval.

The list of rulings the repository doesn't follow yet comes once every ADR is ruled, and many are still `proposed`. Also, no `tracking` trait is decided in AGENTS.md, so at that point I would give that list here and create nothing.
=================== fastify__fastify ADR-0006
Still collecting evidence on how the repository handles commit scopes and releases; one more check, then the proposal.

I couldn't run `npx ontrack review` because it needs your approval, so I did this review by hand from the ADR and the repository.

## What the repository does today

**Who sets the version:** people do, not commit messages.
- `CONTRIBUTING.md:58-61`: "Declaring formal releases remains the prerogative of the lead maintainers. Do not bump version numbers in pull requests."
- There are hand-made bump commits such as `Bumped v6.0.0-alpha.5`, and tags like `v6.0.0-alpha.6` and `v5.12.8` are cut by hand.
- Nothing generates releases: there's no semantic-release, release-please or changesets. The only release tool mentioned is `releasify`, suggested for plugin changelogs.

**What enforces the format:** a CI check on pull request titles, not on commits.
- `.github/workflows/pull-request-title.yml` runs `fastify/action-pr-title` with the regex `^(\[Backport N.x\]\s)?(build|chore|ci|docs|feat|types|fix|perf|refactor|style|test)(\(…\))?!?:\s`.
- This works because pull requests are squash-merged: 906 of the last 1,000 commit subjects end in `(#N)`, so the title becomes the commit message.
- There's no commitlint and no hook (no husky or lefthook).

**Scopes:** used sometimes, never checked, and inconsistent.
- In the last 1,000 commits (since 2024-01-04), 674 have no scope.
- Scopes that do appear: `ecosystem` 28, `types` 22+6 breaking, `sponsor` 10, `validation` 8, `ci` 6, `typescript` 5, `request` 5, `readme` 5, `security` 4, `reply` 4, `license` 4, `dependabot` 4, `server` 3. After that comes a long tail of one-off scopes.
- The tail has synonyms of exactly the kind the ADR warns about: `types` / `typescript` / `ts` / `test-types`, `route` / `routes` / `reference/routes`, `docs` / `readme` / `reference` / `guides`, `validation` / `lib/validation`.
- `.github/dependabot.yml` uses `include: "scope"`, which gives bot commits scopes like `deps` and `deps-dev`.

## Differences from what governance recommends

1. **`commits.tool`:** governance recommends `commitlint` only if versions come from commit messages. They don't here (see above), so `none` is a valid answer.
2. **The existing CI check disagrees with the fixed type list.** It accepts `types`, which isn't one of the eleven, and rejects `revert`, which is. The type list isn't open to ruling, so this is a gap to fix later, not part of this ruling.
3. **Some commits don't follow the format:** 117 of the last 1,000 subjects, mostly bumps, merges and bot commits, plus old types like `add` and `migrate`.
4. **The CI check ignores scopes,** so any scope list written here is guidance for agents and reviewers only, not enforced.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `none` | Versions are set by hand (`CONTRIBUTING.md:58-61`, hand-made bump commits). The format is still checked in CI by `pull-request-title.yml`, on the squash-merge title. |
| `commits.scopes` | `[types, ecosystem, sponsor, validation, request, reply, route, server, security, deps, deps-dev]` | The most-used scopes in the last 1,000 commits. Synonyms are folded in: `typescript` and `ts` → `types`, `routes` → `route`. Each name matches a `lib/` module (`request.js`, `reply.js`, `route.js`, `server.js`, `validation.js`) or a docs area (Ecosystem, Sponsors). `deps` and `deps-dev` are what Dependabot writes. I left out `ci` and `docs` because they repeat a type. |

**Departures from the recommendation, and the reason I'd write in the ADR:**
- **Tool:** `none` instead of `commitlint`, because versions aren't generated from commit messages. Format enforcement stays with the existing PR-title check in CI.

**A choice for you on scopes:** with no tool checking them, `[]` (no scopes) is also defensible, since two thirds of commits already go without one. I'd keep the list, because the synonyms in the history are exactly the problem a list solves.

Do you agree with this ruling, or do you want changes, such as `[]` for scopes, a different list, or `hook`? Please also give me the name or names to put in `authors:`. I'll write nothing until you confirm.
=================== fastify__fastify ADR-0009
Gathering evidence: history shows squash-merged PRs on `main`, plus long-lived version branches. I'm checking CI's merge settings next.

I've finished the review and am proposing a ruling below. Nothing is written yet. One note first: AGENTS.md says to start with `npx ontrack review trivoallan/ADR-0009-branching`, but that command needed your approval and didn't run, so this review is based on the ADR file and the repository.

## What the repository does today

**Model.** Work happens on short branches, goes through a pull request and lands on `main`.
- `CONTRIBUTING.md:26` says "Non-main branches ought to be used for ongoing work."
- `CONTRIBUTING.md:32-34` asks for two approvals (or one core member) and green CI before merging.
- `CONTRIBUTING.md:24` forbids force-pushing `main`.

There are also long-lived branches, which plain github-flow doesn't have:
- **Version branches** `1.x`…`5.x`. `CONTRIBUTING.md:45-56` says "Every version of Fastify has its own branch", and the LTS policy covers them. `ci.yml:5-8` runs CI on pushes to `main`, `next` and `'*.x'`. Changes reach them through `backport.yml` (tibdex/backport, triggered by a label).
- **A `next` branch** for breaking changes. It was synced with `Merge branch 'main' into next` many times, then merged back into `main` with `1e08dfd9 Merge branch 'next'` before `v6.0.0-alpha.0`.

There is no `develop`, `release/*` or `hotfix/*` branch, so this is not gitflow. It is not trunk-based either: almost every change on `main` comes through a PR.

Some commits go straight to `main` with no PR:
- release bumps (`Bumped v6.0.0-alpha.5`, `6.0.0-alpha.6`);
- some fixes, including the current HEAD `7e0c8feb`, plus `b7d8fefc`, `a34c3e53` and `6e95cb9f`;
- `Merge commit from fork`, which comes from GitHub's private fixes for security advisories.

**Merge.** It is squash in practice. Of the last 300 first-parent commits on `main`, almost all have a single parent and end in `(#NNNN)`, the PR number GitHub adds when it squashes. The only two-parent commits are the `next` merge and the security-fork merges. Dependabot PRs are merged automatically by `fastify/github-action-merge-dependabot` (`ci.yml:226-242`), with no `merge-method` set.

**Prefixes.** Nothing enforces them, and there's no rule or doc about branch names. Of the 35 remote branches:
- **Prefixed with a commit type:** `fix/` (4), `docs/` (3), `feat/` (2), `refactor/` (2), `test/` (1), `ci/` (1).
- **Other prefixes:** `split/` (3), `semver-major/` (1), plus the bot prefix `dependabot/`.
- **No prefix:** about 10, such as `named-hooks`, `remove_503` and `automate-releases`.

Commit subjects use every governance type except none: `feat`, `fix`, `docs`, `perf`, `test`, `chore`, `ci`, `refactor`, `style`, `build` and `revert` all appear. Some also use `types`, which is not one of the eleven.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | Changes go through a PR to `main` with review and green CI (`CONTRIBUTING.md:26,32-34`). Of the three allowed values, it's the closest to what the repo does. |
| `branching.merge` | `squash` | First-parent history is linear and each commit carries `(#NNNN)`. |
| `branching.prefixes` | `[feat, fix, docs, perf, refactor, test, ci, chore]` | `feat`, `fix`, `docs`, `refactor`, `test` and `ci` are already used as branch prefixes. `perf` and `chore` are among the most common commit types. |

## Where this departs from the recommendation

1. **Prefixes go from `[feat, fix, docs]` to eight.** Contributors already open `refactor/`, `test/` and `ci/` branches, and `perf` and `chore` changes are frequent. All eight come from the eleven commit types. `split/` and `semver-major/` aren't commit types, so they're left out.
2. **The model is github-flow plus long-lived branches.** The `*.x` maintenance branches and the `next` branch for majors stay. The ADR should say these are allowed exceptions, because the LTS policy depends on them.
3. **Some direct pushes to `main` continue.** Lead maintainers push release bumps and private security fixes (`Merge commit from fork`) directly. The ADR should say so instead of implying that every change goes through a PR.

## Consequences to weigh

- **Contributor PRs will fail the branch-name check if it runs in CI.** On a PR, the check reads `GITHUB_HEAD_REF`, which is the contributor's fork branch name, so most outside PRs would fail. I'd suggest running it locally only, or only for branches pushed to this repository, rather than on every PR. Tell me if you'd prefer something else.
- **Version branches like `5.x` and `next` don't match `<prefix>/<kebab>`.** They only matter if someone works on them as a head branch; PRs merging into them are fine.
- **ADR-0012 (releases) and ADR-0018 (dependency updates) aren't ruled yet.** Until they are, `dependabot/` branches have no exemption from the check.

## What I'll write if you agree

- **Frontmatter:** `status: accepted`, `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, and the three traits.
- **ADR body:** the "How to rule" block replaced by the reasons for the three departures, and the Consequences lists rewritten for this ruling.
- **Then:** run `npx ontrack apply` to update AGENTS.md.

The list of rulings the repository doesn't follow yet waits until every ADR is ruled. Also, no `tracking` trait is decided yet (ADR-0014 is still open), so for now that list would only go in my reply and no tracker items would be created.

Do you agree with this ruling, or do you want to change something, such as the prefix list or the author name?
=================== fastify__fastify ADR-0011
Gathering evidence from the workflows (pins, triggers, permissions) before proposing a ruling.

I've reviewed ADR-0011 against the repository and have a proposed ruling for you. Nothing is written yet; I'm waiting for your answer.

AGENTS.md says to run `npx ontrack review`, but the command was declined, so I worked from the ADR file and the repository alone.

## What the repository does today

- **The forge is GitHub.** The `origin` remote is `https://github.com/fastify/fastify.git` and there are 20 workflows in `.github/workflows/`. So `rejected` doesn't apply, and `forge.gate` can't be `none` because a pipeline exists.
- **CI is meant to block merges.** `CONTRIBUTING.md:34` says "All integrated CI services must be green before a pull request can be merged." Line 75 lets bot PRs merge only when CI is green. The Dependabot automerge job in `ci.yml:226-242` only runs after the test jobs pass (`needs: test-types, test-unit, package`).
- **I couldn't check the GitHub ruleset.** The call to `gh api repos/fastify/fastify/rules/branches/main` was declined, so I can't confirm a ruleset requires these checks. The ADR's own check doesn't verify this either.
- **Nothing audits the workflows.** No workflow, config file or script mentions zizmor or actionlint. The only hits are in the ADR files. zizmor isn't installed locally; actionlint is, at `~/.local/bin/actionlint`, but it isn't wired into anything.
- **The workflows already follow the ADR's rules by hand.**
  - Rule 3 (pin actions): every action is pinned by commit SHA with the tag in a comment, `actions/*` included. This dates from commit `ada0623d ci: pin actions to commit-hash (#6853)`.
  - Every `actions/checkout` sets `persist-credentials: false`.
  - Permissions are `contents: read` at workflow level and widened per job.
  - Rule 5 (forks): `pull_request_target` appears in `labeler.yml` and `backport.yml`, but neither checks out the fork's code, and backport only runs on merged PRs.
  - Rule 1 (deploy from main): the one job close to a deploy, `website.yml`, only triggers on pushes to `main` and on releases.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `CONTRIBUTING.md:34` (green CI before merge); automerge gated on tests in `ci.yml:231-234` |
| `forge.audit` | `zizmor` | Nothing reads the workflows today, but they already follow zizmor's policies, so adopting it costs little and stops regressions |

**Departures from the recommendation:** none. This would be adopted as is.

## What I'd note in the ADR

These are implementation gaps, not departures:
- No zizmor job exists yet. That goes on the follow-up list once every ADR is ruled.
- zizmor's `dangerous-triggers` audit will very likely flag `labeler.yml:2` and `backport.yml:3`. Since neither checks out fork code, they'd need inline `# zizmor: ignore[dangerous-triggers]` comments with that reason, approved by a person.
- Because the ruleset couldn't be checked, "blocking" is a statement of intent backed by `CONTRIBUTING.md` until someone confirms the GitHub setting.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** If so, I'll also need the `authors:` name(s) to record; the date would be 2026-11-15. Then I'll update the ADR and run `npx ontrack apply`.
=================== fastify__fastify ADR-0023
I've gathered the evidence and am now presenting the proposed ruling. (Note: `npx ontrack review` needed approval that wasn't granted, so I followed the ADR's own "How to rule" instructions.)

## What the repository does today

- **`package.json:158`** has `"license": "MIT"`. This is the only manifest at the root. There is no `pyproject.toml`, and no other `package.json` outside `node_modules` declares a licence.
- **`LICENSE`** is committed at the root and holds the full MIT text. Its copyright line is `Copyright (c) 2016-present The Fastify team <https://github.com/fastify/fastify#team>`, which names the organisation that owns the repo, as fixed point 3 requires. Its history goes back to 2018 (`575237f0`), and the latest change is `5c62eeb2 chore(license): standardise license notice (#6511)`.
- **`README.md:409-411`**: "Licensed under [MIT](./LICENSE)."
- **CI** (`.github/workflows/ci.yml:37`): `license-check: true`. This checks the licences of dependencies, which the ADR says it does not cover (that belongs to ADR-0019). It neither helps nor conflicts with this ruling.

## How that compares with the recommendation

The recommendation is `MIT`, and nothing in the repository departs from it:
- Fixed point 1 (the manifest declares the value): `package.json` declares `MIT`.
- Fixed point 2 (a licence file at the root): `LICENSE` is there with the full MIT text.
- Fixed point 3 (the organisation is the copyright holder): the Fastify team is named.

The ADR's only conditional is "`Apache-2.0` when an explicit patent grant matters". Nothing in the repository suggests that: it has been under MIT for its whole history. The question clearly applies here, so `rejected` is not on the table.

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`: `MIT`**, from `package.json:158`, `LICENSE` and `README.md:411`.
- **Departures from the recommendation:** none. The ADR will say it is adopted as is.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, the git user. Please correct this if someone else made the decision.

Once all ADRs are ruled, I expect `[trivoallan/ADR-0023] license.spdx` to need no tracking item, because the repository already follows it.

Do you agree with this ruling, including the `authors` value? When you confirm, I'll edit the ADR and run `npx ontrack apply`.
=================== fastify__fastify ADR-0025
I've read the ADR and checked the repository's CI and tooling. Here is the proposed ruling for you to decide on.

AGENTS.md says to run `npx ontrack review trivoallan/ADR-0025-tools` first. That command needed your approval and didn't run, so I followed the ADR's own "How to rule" steps instead.

## What the repository does today

- **No tool manager.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `.tool-versions` or pre-commit config.
- **No install script.** `scripts/`, `build/` and `.github/scripts/` hold only Node build and lint scripts.
- **No git hooks.** There is no `.husky` and no pre-commit config. `.gitpod.yml` runs only `npm install`.
- **CI gets its tools from GitHub Actions, all pinned by commit hash.** Examples are lychee, linkinator and markdownlint, and the pinning dates from commit `ada0623d`. Actions are outside this ADR (it points to ADR-0011 rule 3 for them).
- **One binary is downloaded without a pin.** `.github/workflows/package-manager-ci.yml:72` runs `curl -o- -L https://yarnpkg.com/install.sh | bash`, with no version and no checksum. No ADR names yarn, so the ADR's rules don't cover it. Still, it is exactly the pattern the ADR describes.
- **No accepted ADR names a tool yet.** The ADR's built-in check looks at two settings: `secrets.guard` (ADR-0015) and `forge.audit` (ADR-0011). Both ADRs are still `proposed` and both settings are empty.

## Checking the ADR's condition

The recommendation depends on how many tools accepted ADRs name: `script` for one, `mise` or `aqua` for several. It also says "`none` is an answer only when no accepted ADR names such a tool." Today accepted ADRs name zero tools: only ADR-0001 is accepted (per the `status:` lines under `docs/adr/trivoallan/`). So the condition for `none` is met.

## Proposed ruling

- **Status:** `accepted`, not `rejected`. The question does apply here; there is simply nothing to pin yet.
- **`tools.manager: none`.** No accepted ADR names a tool outside the package manager or Actions, and the repository has no manager or install script.
- **What keeps pins current (rule 4):** nothing yet, because there are no pins. Whoever accepts a ruling that names a tool also rules this ADR again in the same pull request.

**Departures from the recommendation:**
1. **`none` instead of `script`, `mise` or `aqua`.** The recommendation assumes at least one tool. Here there are zero, and the ADR itself allows `none` in that case.
2. **This ruling will need revisiting.** ADR-0015 ships `gitleaks` as its suggested value and ADR-0011 ships `zizmor`. If you accept both, the repository needs two tools and the recommendation becomes `mise`. The check also fails as long as this ADR still says `none`.

The alternative is to rule `mise` now, anticipating gitleaks and zizmor. I'm not recommending it, because it would describe the repository as those proposed ADRs would make it, not as it is.

The unpinned yarn download isn't part of this ruling. It could become a tracking item later.

Do you agree with `accepted` and `tools.manager: none`? Or would you rather rule `mise` now, or something else? I'll write nothing until you confirm.
