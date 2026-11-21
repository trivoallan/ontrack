=================== sindresorhus__ky ADR-0002
Nothing here argues against the recommendation. The code, comments, readme and all 592 commit messages are in English. The only non-ASCII characters my search found are `©` in the license banner (`source/index.ts:1`) and `§` in an RFC citation (`source/utils/body.ts:207`), not French text.

I couldn't run `npx ontrack review trivoallan/ADR-0002-localization`, which AGENTS.md says to use for ADR reviews, because the command needs your approval. This proposal comes from the ADR's own ruling steps, so approve that command if you want its output checked as well.

## Proposed ruling: ADR-0002 Localization

**Status:** `accepted`

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | `readme.md`, the `source/` and `test/` files, and `git log` (592 commits, e.g. "Let a `beforeRetry` hook change per-attempt options") are all in English. The `package.json` description is English too. |
| `documentation` | empty (takes `default`) | `readme.md` is in English. |
| `commits` | empty (takes `default`) | All 592 commit subjects are in English. |
| `code` | empty (takes `default`) | Names are in English, e.g. `source/core`, `source/errors`, `beforeRetry`, `onDownloadProgress`. |
| `comments` | empty (takes `default`) | Comments are in English, e.g. `source/utils/body.ts:207`. |

**Departures from the recommendation:** none. Following the ADR's step 5, its body will get one line saying the recommendation was adopted as is.

When I write it, I'll also:
- set `date: 2026-11-15`
- set `authors:` to `[Tristan Rivoallan]` (your git user name, no email), unless you name others
- rewrite the Consequences lists for this repository (for example, I'll drop the French-maintainer cost, since no French is written here)
- delete the "How to rule" block

Then I'll run `npx ontrack apply`.

**Do you agree with this ruling, and should `authors` be `[Tristan Rivoallan]`?** I won't write anything until you confirm.

Tracking items come only once every ADR is ruled. ADR-0014 (work tracking) is still undecided, so there's no tracker yet.
=================== sindresorhus__ky ADR-0004
The ADR's recommendation applies here, and I found nothing in the repository that argues against it.

**Is the condition met?** The ADR says to pick TypeScript when the code runs in a browser or shares code between browser and server. Ky does:
- `readme.md:17`: "Ky targets modern browsers, Node.js, Bun, and Deno."
- `package.json` has `"browser"` in its keywords and runs browser tests through `playwright` (`test/browser.ts`).

**Is TypeScript the main language?** Yes. The code lives in `source/index.ts`, `source/**`, `test/*.ts` and `test-d/`. It is built with `tsc` (`tsconfig.dist.json`) and tested with `ava` through `tsx/esm`. A search for `.js`, `.mjs`, `.cjs`, `.py`, `.go`, `.rs` and `.sh` files under `source/`, `test/` and `test-d/` found none.

## Proposed ruling: `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `TypeScript` | all code in `source/`, `test/` and `test-d/` is `.ts`; the build uses `typescript` and `tsconfig.*.json`; `readme.md:17` targets browsers and server runtimes |

**Departures from the recommendation:** none. The ADR will say in one line that it adopts the recommendation as is.

**Other fields:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]` (your git user name, without your email)
- I'll rewrite the Consequences section for this ruling and remove the "How to rule" block.

Do you agree with this ruling? Once you confirm, I'll update the ADR and run `npx ontrack apply`. Most ADRs are still unruled, so I'll list the rulings the repository doesn't follow yet only after all of them are ruled.
=================== sindresorhus__ky ADR-0006
I propose ruling ADR-0006 (Commits) `accepted`, with no scopes and no enforcing tool. I haven't written anything yet; that waits for your answer.

**Where the recommendation doesn't apply.** The ADR recommends `commitlint` only if this repository generates its versions from commit messages. It doesn't:
- `package.json` has `"release": "np"`, and `np` asks a person for the version number.
- Releases are separate commits named only by version (`3541888 2.2.0`, `d27ad21 2.1.0`, `0a24c44 2.0.2`, and so on).
- `.github/workflows/main.yml` only runs tests and lint. Nothing builds a version or changelog from commit messages.

So the condition fails, and `none` is the answer the ADR itself allows for that case.

**Proposed ruling**

| Key | Value | Evidence |
| --- | --- | --- |
| status | `accepted` | |
| `commits.scopes` | `[]` | The library is one npm package with one entry point (`source/index.ts`). Its folders (`core`, `errors`, `types`, `utils`) are internal layers, not areas anyone filters history by. None of the 592 commits uses a scope. |
| `commits.tool` | `none` | Versions are set by hand with `np`, so the premise for `commitlint` fails. No commitlint config or `.husky/` exists. |
| `date` / `authors` | `2026-11-15` / `[Tristan Rivoallan]` | Today's date, and the git user. |

**Departures from the recommendation**
- **`commits.tool: none` instead of `commitlint`:** versions are set by hand with `np`, so an off-format message can't produce a wrong version. The ADR says `none` is just as good an answer in that case.
- **`commits.scopes: []`:** the ADR recommends no list, so this isn't a departure. It's one package, and a list invented now would age badly.

**Things to know before you agree**
- **Commit messages will change.** None of the 592 commits follows Conventional Commits; they are plain sentences like "Fix CI" and "Add `maxResponseSize` option". Governance requires the format regardless of this ruling. From now on, commits would be written like `fix: …` and `feat: …`, with nothing enforcing it except review. If that is unacceptable for this repository, the right path is to object to the governance track, not to rule this ADR `rejected`.
- **Why not `rejected`:** the ADR does name "single-area repository with no pipeline" as the typical case for `rejected`. But it also says `[]` and `none` are full answers. Writing them down tells an agent explicitly not to invent scopes. Rejecting would remove the `traits:` block and leave that unsaid.

Do you agree with **accepted, `scopes: []`, `tool: none`**? Or would you rather rule `rejected`, or use a scope list or tool? I had no question tool in this session, so please answer here.

Once you agree, I'll fill the frontmatter, rewrite the Consequences section, replace the "How to rule" block with the reason for each departure, and run `npx ontrack apply`. The list of rulings this repository doesn't follow yet comes only once every ADR is ruled; 24 of them are still `proposed`.
=================== sindresorhus__ky ADR-0009
I've finished reading the ADR and the repository's history. Here is the ruling I propose for **ADR-0009 Branching**. I haven't written anything yet.

## Proposed ruling: `accepted`

| Trait | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | 159 of the last 400 commits end in `(#NNN)`, meaning they arrived as pull requests (for example `Add QUERY method support (#873)`). There are no feature flags, so `trunk-based` doesn't fit. A release is just a version commit on `main` (`3541888 2.2.0`), with no `develop` or `release/*` branches, so `gitflow` doesn't fit either. |
| `branching.merge` | `squash` (as recommended) | `git log --merges` shows **0** merge commits out of 592. Each PR shows up on `main` as one commit with the `(#NNN)` suffix that GitHub's squash merge adds. |
| `branching.prefixes` | `[feat, fix, docs]` (as recommended) | The repository doesn't list any branch prefixes. Its only other remote branch is `origin/fix-methods`, which already starts with `fix`, though with a hyphen instead of a slash. Most commits are fixes and doc changes, which fit the three default prefixes. |

**Departures from the recommendation:** none. I checked for evidence against it and found none that rules it out. Two practices partly diverge, and they belong in the "not yet followed" list rather than the ruling:

- **The maintainer pushes straight to `main`.** Recent commits like `Refactor`, `Fix CI` and `Tweaks` have no PR number. Github-flow sends every change through a pull request.
- **Branch names don't follow `prefix/kebab-case`.** `fix-methods` would fail the `check:`.

**Conditions the ADR raises:**
- **ADR-0012 and ADR-0018 should be ruled with or before this one.** They aren't ruled yet. No release-please, Dependabot or Renovate config exists (I searched for `renovate.json`, `.github/dependabot.yml` and `.release-please*` and found nothing). So no bot branches would fail the check today.
- **The merge message must carry the Conventional Commits type.** That depends on ADR-0006, which also isn't ruled. Current commit messages don't follow Conventional Commits.

**What I'd write once you agree:**
- The three trait values.
- `status: accepted` and `date: 2026-11-15`.
- `authors: [Tristan Rivoallan]`, unless you name other people.
- Rewritten Consequences sections.
- A one-line note that the recommendation was adopted as is, in place of the "how to rule" block.

Then I'd run `npx ontrack apply`.

Do you agree with this ruling, or do you want to change something (for example the model to `trunk-based` to match the direct pushes, or the prefix list)?
=================== sindresorhus__ky ADR-0011
The repository is on GitHub (`origin` → `github.com/sindresorhus/ky`), so `rejected` doesn't apply. It has one pipeline, `.github/workflows/main.yml`, so `none` doesn't apply either. I found nothing in the repository that rules out the recommendation.

## Proposed ruling for ADR-0011, Forge and continuous integration

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `.github/workflows/main.yml` runs on `push` and `pull_request`. Its `test` job (Node latest/24/22) and `browser` job (xo, build, tsc, Playwright tests) are the checks a ruleset on `main` would require. |
| `forge.audit` | `zizmor` | The workflow already breaks rule 3: `actions/checkout@v6` and `actions/setup-node@v6` are movable tags. zizmor would also flag `artipacked`, because the checkouts keep their credentials. Nothing reads the workflows today. |

**Departures from the recommendation:** none. The ADR text will say the recommendation is adopted as is.

**Two things I couldn't confirm:**
- **Whether a ruleset already requires these checks on `main`.** The read-only `gh api repos/sindresorhus/ky/rules/branches/main` call needed approval, so it didn't run. The ADR says this lives on GitHub and isn't checked from the repository anyway. If you approve that call, I'll find out.
- **Whether zizmor is installed.** It isn't on `PATH` (`which zizmor` found nothing), so `ontrack check` will fail on `forge.audit` until it is installed.

When you agree, I'll do the following, all in this one file:
- fill both trait keys
- set `status: accepted` and `date: 2026-11-15`
- set `authors: [Tristan Rivoallan]`, unless you give me other names
- rewrite the Consequences lists
- replace the "How to rule" block with a one-line adoption note
- run `npx ontrack apply`

I'll leave the list of rulings the repository doesn't follow yet until every ADR is ruled. 25 are still undecided, including ADR-0014, which picks the tracker.

Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`, with `authors: [Tristan Rivoallan]`?
=================== sindresorhus__ky ADR-0023
I've read the ADR and checked the repository. Here is the proposed ruling.

## Proposed ruling: `docs/adr/trivoallan/ADR-0023-license.md`

**Status:** `accepted`

**Trait:**
- `license.spdx: MIT`. `package.json:5` already says `"license": "MIT"`, and the tracked root file `license` holds the full MIT text ("MIT License / Copyright (c) Sindre Sorhus…").

**Evidence against the recommendation:** none. The repository already uses MIT, which is the recommended value.

**Departures from the recommendation:** none. The ADR would just say it adopts the recommendation as is.

**Other fields:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, as the person ruling. Tell me if it should list other people.
- I'd rewrite the Consequences lists for MIT on a published npm package.

**One thing to know before you accept:** the licence file is named `license` in lowercase. The ADR's check (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822`, `:870`) only looks for the exact names `LICENSE`, `LICENSE.md`, `LICENSE.txt` and `COPYING` among the tracked files. So once this is `accepted`, `ontrack check` will fail for ADR-0023 even though the licence text is correct. This doesn't change the ruling. It goes on the list of things the repository doesn't follow yet (e.g. `[trivoallan/ADR-0023] license.spdx: rename license to LICENSE`). The fix would be to rename the file with `git mv`.

**Do you agree with this ruling (`accepted`, `license.spdx: MIT`, authors `[Tristan Rivoallan]`)?** I'll write nothing until you confirm or tell me what to change.
=================== sindresorhus__ky ADR-0025
Only ADR-0001 is accepted. The `status: accepted` hits in the other files come from their example frontmatter blocks. I couldn't run `npx ontrack review` because it needs your approval, so I followed the steps written in the ADR.

## Proposed ruling: ADR-0025 (Tools outside the package manager)

**Status:** `accepted`

**Trait**
- `tools.manager: none`
  - **Evidence:** this repository uses no tool outside npm today. No accepted ADR names such a tool, because ADR-0011, ADR-0015 and ADR-0019 are all still `proposed`.
  - The repository has no `mise.toml`, `aqua.yaml`, `.tool-versions`, git hooks or install scripts (checked with `git ls-files`).
  - `.github/workflows/main.yml` only runs `actions/*`, `npm install`, `npx ava` and `npx playwright install`. Those are all npm dependencies or actions, which this ADR doesn't cover.

**Departure from the recommendation**
- The ADR recommends `script` for one tool and `mise`/`aqua` for several. Here there are none, and the ADR says `none` "is an answer only when no accepted ADR names such a tool", which is true right now. I propose `accepted` + `none`, not `rejected`: the question does apply here, the answer is just that there's nothing to install yet.
- **Rule 4 (what keeps the pins current):** there are no pins yet, so nothing needs to move them. I'll write that this ADR must be ruled again, choosing `script` for one tool or `mise` for several, before any ADR naming a tool is accepted. The likely ones are `secrets.guard` in ADR-0015 (for example gitleaks) and `forge.audit` in ADR-0011 (for example zizmor).
- **Risk:** once one of those is accepted with a tool, the check for this ADR will fail with `none`. That's intended, because it forces the ruling to be revisited.

**Alternative:** if you expect to accept ADR-0015 with gitleaks soon, I could rule `script` now (the ADR's recommendation for one tool) so this ADR doesn't need a second ruling.

**Frontmatter I'd write:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]` (taken from your git user name). I'd also rewrite the Consequences section, remove the "How to rule" block, and then run `npx ontrack apply`.

**Follow-up tracking items:** no `tracking` trait is decided yet (ADR-0014 is still proposed). So once every ADR is ruled, I'll list the rulings the repository doesn't follow yet in my reply and won't create anything.

Do you agree with **`accepted`, `tools.manager: none`**, with the authors shown above? Or would you rather go with `script`, or change the authors?
