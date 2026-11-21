=================== fastify__fastify ADR-0002
I've read the ADR and checked the repository's language. Here is the ruling I propose. I haven't written anything yet.

One thing first: AGENTS.md says to run `npx ontrack review trivoallan/ADR-0002-localization` for a review, but that command was blocked for lack of approval. I worked from the ADR's own instructions instead. If you approve the command, I'll run it and compare its output with this ruling.

## Proposed ruling: `trivoallan/ADR-0002` Localization → **accepted**

I found nothing suggesting English doesn't fit here. Everything in the repository is in English, and Fastify is a public project with contributors from many countries. The recommendation isn't conditional, so there was no condition to check.

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | Every page in `docs/Guides/` and `docs/Reference/` is in English, as are all of the last 30 commits. A search for accented characters in `lib/` and `docs/Reference/` found only `§` in RFC citations (e.g. `lib/validation.js:57`) and `⚠` symbols, no French. |
| `localization.language.documentation` | *(empty, uses default)* | The docs are in English. |
| `localization.language.commits` | *(empty, uses default)* | The commits are English Conventional Commits, e.g. `fix(route): apply prefixTrailingSlash…`. |
| `localization.language.code` | *(empty, uses default)* | Names in `lib/*.js` and `fastify.js` are in English. |
| `localization.language.comments` | *(empty, uses default)* | Comments are in English, e.g. `lib/content-type.js:168`. |

**Departures from the recommendation:** none. In place of the "how to rule" block, the ADR will get one line saying it adopts the recommendation as is.

**On agreement I will:**
- fill `default: english`;
- set `status: accepted`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists for this repository. The current Negative points are about a French-speaking team, which doesn't apply here.
- delete the "how to rule" block;
- run `npx ontrack apply`.

**Do you agree with this ruling, or do you want any key changed?**

Other ADRs are still `proposed`, so I'll list the rulings the repository doesn't follow yet once they're all ruled. No `tracking` trait is decided yet (ADR-0014 is still open), so for now that list would only go in my reply.
=================== fastify__fastify ADR-0004
I couldn't run `npx ontrack review trivoallan/ADR-0004-languages`, which AGENTS.md asks for, because it needs your approval. So this proposal comes from the ADR file and the repository alone.

## Proposed ruling: ADR-0004 Languages

**Status:** `accepted`, but with a different language from the one the ADR recommends.

**Trait:**
- `languages.main.name`: **`JavaScript`**
  - **Evidence:**
    - `package.json:5-6` has `"main": "fastify.js"` and `"type": "commonjs"`.
    - git tracks 264 `.js` files and 33 `.ts` files. 16 of the `.ts` files are type declarations (`.d.ts`), and nearly all the rest are type tests under `test/types/`, plus `examples/typescript-server.ts`.
    - Everything under `lib/` and `build/` is plain `.js`.
    - Unit tests (`borp`), lint (`eslint`/`neostandard`) and coverage (`c8`) all run on JavaScript. TypeScript is only checked by `test:types` (`tstyche`).

**Departure from the recommendation.** The ADR recommends Python or TypeScript.
- **Why not Python:** nothing in the repository is written in it.
- **Why not TypeScript:** Fastify is a Node.js framework that runs as plain CommonJS JavaScript with no compile step. Its TypeScript support is a set of hand-written declaration files (`fastify.d.ts`, `types/*.d.ts`) that are checked by `tstyche`.
- **What would go wrong with TypeScript:** an agent would start writing new runtime code in `.ts`, and that code wouldn't fit the source layout, the build or the published package.
- **What the recommended languages don't give here:** the ADR asks for this to be written down. The answer is the Node.js ecosystem the package targets, plus running without a build step.
- **What the ADR will say:** TypeScript stays a secondary language, used only for the public type declarations and their tests. It is not the main language.

**Frontmatter I would also fill:**
- `date:` would be `2026-11-15`.
- `authors:` would be `[Tristan Rivoallan]`, taken from your git user name.

**Body changes:**
- I would rewrite the Consequences lists for a JavaScript ruling.
- I would delete the "How to rule" block and put the justification above in its place.

Do you agree with ruling `accepted` with `languages.main.name: JavaScript`? Tell me if you'd like a different value or other authors. I won't write anything, including running `npx ontrack apply`, until you confirm.
=================== fastify__fastify ADR-0006
## Proposed ruling for ADR-0006 (Commits): **accepted**, with one departure

I couldn't run `npx ontrack review` because the command needed approval. This proposal comes from reading the ADR and the repository directly.

**The condition behind the recommendation is not met.** The ADR recommends `commitlint` only "if this repository generates its versions from commit messages". Fastify doesn't:
- `CONTRIBUTING.md:58-61` says releases are "the prerogative of the lead maintainers. Do not bump version numbers in pull requests."
- Versions are bumped by hand, in commits like `8c0f6991 6.0.0-alpha.6` and `bd25219b Bumpedv v6.0.0-alpha.5` (`git log -- package.json`).
- There's no release-please, semantic-release, changesets, commitlint or husky anywhere in the repo (grep).

**Proposed trait values:**
- **`commits.tool: none`**. This departs from the recommendation, for the reason above. The repo already has a check in its place: `.github/workflows/pull-request-title.yml` checks each PR title against a Conventional Commits pattern in CI. PRs are squash-merged, so the title becomes the commit message (e.g. `(#7195)` in the log). It isn't commitlint, so `none` is the accurate value.
- **`commits.scopes: [types, validation, route, reply, request, server, ecosystem]`**. These are the areas that recur in the 669 commits since 2025-01-01:
  - `types` appears 25 times across fix, feat, refactor, test and style, and matches `types/`.
  - `docs(ecosystem)` appears 20 times.
  - `validation` appears 8 times.
  - `route`, `reply`, `request` and `server` match `lib/*.js` and `docs/Reference/*.md`.
  - Scopes used only once or twice (`ts`, `lib/pluginutils`, `ci(ci)`, `reference/plugins`) are left out on purpose.
  - About 80% of commits use no scope at all, so `[]` is also a reasonable answer if you'd rather not maintain a list.

**Gaps to track once every ADR is ruled** (I'm noting them now, not acting on them):
- The PR-title regex accepts `types`, which isn't one of the 11 governance types (it shows up in history as `types:`).
- The regex also rejects `revert`, which is one of the 11.
- Neither the regex nor anything else enforces the scope list.

Do you agree with **accepted, `tool: none`, `scopes: [types, validation, route, reply, request, server, ecosystem]`**? You can also change the scope list (for example to `[]`) or the tool. I need a name for `authors:` too: should it be "Tristan Rivoallan"? I won't write anything until you confirm.
=================== fastify__fastify ADR-0009
I couldn't run `npx ontrack review` or `gh api` because both need approval you haven't given, so this ruling comes from the ADR file and the git history.

## Proposed ruling for `[trivoallan/ADR-0009]` Branching

**Status: `accepted`**. Nothing in the repo shows the question doesn't apply here.

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | `CONTRIBUTING.md:26` says "Non-main branches ought to be used for ongoing work" and `:32-34` requires approved pull requests with green CI. There are no `develop`, `release/` or `hotfix/` branches, so this isn't gitflow. The maintenance branches `1.x`–`5.x` (`CONTRIBUTING.md:45-56`) are long-term-support lines, not a different model. |
| `branching.merge` | `squash` (as recommended) | Over the last year, 301 of the 346 first-parent commits on `main` are one commit per PR ending in `(#NNNN)`. The rest are release bumps (`Bumped v5.x.y`), `Merge commit from fork` security-advisory merges, a few direct fixes, and one merge of `next` (`1e08dfd9`, the v6 integration branch). |
| `branching.prefixes` | `[feat, fix, docs, refactor, test, ci]` (**departs from the recommendation**) | These are the commit-type prefixes already used on remote branches: `feat/compile-router-default`, `fix/request-signal-post-abort`, `docs/readme-fdawgs`, `refactor/types`, `test/handler-timeout-windows-coverage`, `ci/trusted-publishing`. |

**Departure:**
- **`prefixes`:** I added `refactor`, `test` and `ci` because maintainers already name branches with them. All three are among the eleven commit types, so no new standard is invented. I left out `split/` and `semver-major/`, which are also in use, because they aren't commit types. The ADR says not to invent a twelfth prefix.

**Things to know before you agree** (they don't change the values):
- Once this is accepted, the `check:` will fail on the branch names maintainers often use today, such as `named-hooks`, `automate-releases`, `split/…` and `semver-major/…`. Contributors will have to change how they name branches.
- Dependabot branches (`dependabot/npm_and_yarn/…`) only pass the check once ADR-0018 (Dependencies) is ruled. Ruling ADR-0012 (Delivery) also matters for release-tool branches.
- The `next` merge commit and the security-advisory merges are exceptions to `squash`. Whether to allow them is a forge setting, not something the ADR checks.

When you agree, I'll do the rest in one edit of this file:
- write the three keys, set `status: accepted`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists;
- replace the "How to rule" block with the reason for the `prefixes` departure;
- run `npx ontrack apply`.

**Do you agree with this ruling, or do you want different values?** For example, you could keep the recommended `[feat, fix, docs]`, or add `perf`, `build` and `chore`, which appear as commit types on `main`.

The list of rulings this repository doesn't follow yet waits until every ADR is ruled. 25 are still undecided, including ADR-0014 (Work tracking), so there's no tracker to check yet.
=================== fastify__fastify ADR-0011
**Proposed ruling for ADR-0011 (Forge and continuous integration)**

I looked for evidence against the recommendation and found none. A note first: `npx ontrack review` and the GitHub ruleset lookup (`gh api repos/fastify/fastify/rules/branches/main`) both need your approval and didn't run, so this ruling comes from reading the ADR and the repository directly.

**Status:** `accepted` (not `rejected`). The forge is GitHub: `git remote -v` points to `https://github.com/fastify/fastify.git`, and there are 20 workflows in `.github/workflows/`.

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `ci.yml` runs on `pull_request` and on pushes to `main`, `next` and `*.x`. Its `automerge` job merges Dependabot PRs only after `test-types`, `test-unit` and `package` pass (`ci.yml:226-234`), so the project already treats a red pipeline as a block. I couldn't confirm that a ruleset actually requires these checks. |
| `forge.audit` | `zizmor` | Nothing reads the workflows today: no `zizmor` or `actionlint` anywhere in `.github/`. The workflows already follow the strict pinning zizmor checks for: every `uses:` is pinned to a commit SHA with the tag in a comment, `actions/*` included. Dependabot keeps those pins up to date (`.github/dependabot.yml`). |

**Departures from the recommendation:** none.

**Gaps to track later (not departures):**
- `labeler.yml` and `backport.yml` run on `pull_request_target`. Neither checks out the fork's code, but zizmor will flag the trigger (`dangerous-triggers`). Each will need either an inline ignore with its reason or a change.
- No job runs `zizmorcore/zizmor-action` on pull requests yet.
- Whether a ruleset requires the CI checks on `main` is unverified.

Do you agree with this ruling (`accepted`, `forge.gate: blocking`, `forge.audit: zizmor`)? I'll write nothing until you confirm. When I write it, I'll also need the `authors:` names for the frontmatter, and approval to run `npx ontrack apply`.
=================== fastify__fastify ADR-0023
I couldn't run `npx ontrack review trivoallan/ADR-0023-license`, which AGENTS.md asks for, because the command needs your approval. So this proposal follows the ruling steps written in the ADR itself.

## Proposed ruling: ADR-0023 License

**Status:** `accepted`

**Starting point:** the ADR recommends `MIT`. Nothing in this repository argues against it. The project is already MIT-licensed, so this ruling only records a licence that is already in place.

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `license.spdx` | `MIT` | `package.json:158` has `"license": "MIT"`, and that line is already committed (the only uncommitted change to `package.json` adds the `trivoallan` devDependency). The root `LICENSE` file holds the full MIT text. `README.md:411` says "Licensed under [MIT](./LICENSE)". |

**What the ADR requires either way:**
- **The manifest declares the licence:** `package.json` says `MIT`. There is no `pyproject.toml`.
- **A licence file is at the root:** `LICENSE` is there.
- **The copyright holder is the owning organisation:** `LICENSE:3` names "The Fastify team", which is the organisation that owns the repository.

**Departures from the recommendation:** none. The ADR will say in one line that the recommendation is adopted as is.

**Rulings the repository doesn't follow yet:** none for this ADR. The manifest and the licence file already match `MIT`. No `tracking` trait is decided yet (ADR-0014 is still open), so any tracking items would only be listed in my reply and nothing would be created.

Do you agree to this ruling? If you do, I need two things to fill in the ADR:
1. **`authors:`** – the names of the people deciding (no email addresses). Should I use "Tristan Rivoallan", the git user?
2. **`date:`** – I'll use 2026-11-15 unless you want another date.

I'll write nothing until you confirm. Then I'll update the ADR and run `npx ontrack apply`.
=================== fastify__fastify ADR-0025
I couldn't run `npx ontrack review trivoallan/ADR-0025-tools` because the command needs your approval. So I reviewed the ADR by reading it and checking the repository myself.

## Proposed ruling: ADR-0025, Tools outside the package manager

**Status:** `accepted`

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `tools.manager` | `mise` | The ADR recommends a script for one tool and `mise` or `aqua` for several. This repository would need two: the recommended `secrets.guard: gitleaks` (ADR-0015, line 83) and `forge.audit: zizmor` (ADR-0011, line 69). |

**How I checked the condition:**
- **No accepted ADR names a tool yet.** ADR-0011 and ADR-0015 are both still `proposed` (they're under "Not yet decided" in AGENTS.md). Strictly, `none` would be allowed today. But I'm assuming those two ADRs will be ruled as recommended, which gives two tools. If either is ruled `none`, this should become `script`; if both are, `none`.
- **No other tool sources need folding in.** There's no `mise.toml`, `aqua.yaml`, `.tool-versions` or binary-download script. Nothing in `.github/`, `scripts/` or `.gitpod.yml` installs gitleaks, zizmor or actionlint. The only `curl | bash` is the yarn install in `.github/workflows/package-manager-ci.yml:72`, and package managers are outside this ADR's scope.

**`mise` over `aqua`:** with `mise install --locked`, the install fails on any tool missing from `mise.lock`. With aqua, verification is off by default and a missing checksum is trusted on first download. I believe mise's registry installs gitleaks and zizmor through its aqua or GitHub backends, which record checksums in `mise.lock`. I haven't checked this here. `ontrack check` would show it once the ADR is accepted.

**Rule 4 (what keeps the pins current):** the repository uses Dependabot (`.github/dependabot.yml`) and has no Renovate, and Dependabot doesn't support mise. So a maintainer moves each pin by hand: `mise upgrade` and then `mise lock`, with `mise.toml` and `mise.lock` changed in the same pull request. I'll write this in the ADR.

**Departures from the recommendation:** none. It's the recommended value for several tools.

When I write the ruling, I'll also set `date: 2026-11-15` and rewrite the Consequences lists. I'll delete the "How to rule" block and put the rule 4 text in its place.

**Do you agree with `accepted` and `tools.manager: mise`?** Please also tell me which names go in `authors:`, and whether I should run `npx ontrack apply` afterwards (it also needs your approval). Once you've answered, I'll write the ADR and then do the follow-up list of rulings this repository doesn't follow yet.
