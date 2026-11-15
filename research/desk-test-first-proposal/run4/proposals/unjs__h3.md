# unjs__h3

## ADR-0002

Now gather evidence on the repository's language use.

ADR-0002 asks one question: which language this repository writes in. It recommends English everywhere (`default: english`, no overrides), and h3 already does exactly that.

**What the repository does today**
- **Documentation:** `README.md`, `MIGRATION.md`, `CHANGELOG.md`, `AGENTS.md` and the docs site under `docs/` (guide, utils, examples, migration, blog) are all in English. `docs/.config/docs.yaml` sets no locale and has no i18n setup.
- **Commits:** I searched all 1,651 commit subjects and bodies for common French words (`le|la|les|des|une|pour|avec|correction|ajout`) and found none. Commits follow English conventional-commit style, e.g. `fix(static): join indexNames on a single /…`.
- **Code and comments:** Symbols are English (`defineHandler`, `toResponse`, `kNotFound`…). Every non-ASCII match in `src/` was a `§` spec reference in an English comment, e.g. `src/utils/json-rpc.ts:357`.
- **Tooling:** `typos.toml` configures the `typos` spell checker, which uses an English dictionary. It is not wired into `package.json` or CI, so nothing checks the language.
- **Absence:** No file in the repository states a language rule. The choice is applied in practice, never written down.

**Comparing with the recommendation:** there are no differences. The ADR's recommendation has no "if this repository…" conditions to check.

## Proposed ruling for ADR-0002

**Status:** `accepted`

| Trait | Value | Today | Evidence |
|---|---|---|---|
| `localization.language.default` | `english` | observed | All docs, every commit, all symbols and comments are in English |
| `localization.language.documentation` | *(empty: same as default)* | observed | `README.md`, `docs/**` |
| `localization.language.commits` | *(empty: same as default)* | observed | None of the 1,651 commits matched French words |
| `localization.language.code` | *(empty: same as default)* | observed | `src/**` symbols |
| `localization.language.comments` | *(empty: same as default)* | observed | `src/**` comments, e.g. `src/utils/json-rpc.ts` |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is.

**If you agree, I'll do this, in this ADR only:**
1. Fill the traits as above.
2. Set `status: accepted` and `date: 2026-11-15`. For `authors:` I'll put `Tristan Rivoallan` unless you name someone else.
3. Rewrite the Consequences lists for an English-only open-source project.
4. Replace the "How to rule" block with one line saying the recommendation is adopted as is.
5. Run `npx ontrack apply` to update AGENTS.md.

**Rulings the repository does not follow yet:** none. All five keys are already observed, so there is nothing to propose as a tracking item. No `tracking` trait is decided either (ADR-0014 is still `proposed`), so I would create no tracker items anyway.

Do you agree with this ruling, and should `authors:` be `Tristan Rivoallan`?

## ADR-0004

Now gathering evidence on the languages actually in the repo.

## Proposed ruling: [trivoallan/ADR-0004] Languages

**What the repository does today.** It is written in TypeScript and nothing else:
- **Source code.** All 90 tracked files under `src/` are `.ts`. There are 181 `.ts` files across the whole repo.
- **Other files.** There are 24 `.mjs` files: `examples/*.mjs` (20), `playground/server.mjs`, `bin/h3.mjs` and `vitest.config.mjs`. There are no `.py`, `.go` or `.rs` files.
- **Tooling.** `package.json` depends on `typescript` and has `"typecheck": "tsc --noEmit"`. `tsconfig.json` sets `"strict": true`, and AGENTS.md also lists `isolatedDeclarations` and `erasableSyntaxOnly`.
- **CI.** `.github/workflows/ci.yml:23` runs `pnpm typecheck` on every run.

**The condition in the ADR.** The ADR says to choose TypeScript "when the repository runs in a browser or shares code between browser and server". The repository meets that condition:
- `package.json:24` maps `"browser"` to `./dist/_entries/service-worker.mjs`.
- `src/_entries/` holds `generic.ts` and `service-worker.ts` (for browsers and web workers) next to `node.ts`, `bun.ts`, `deno.ts` and `cloudflare.ts`.
- `tsconfig.json:23` targets `["ESNext", "WebWorker", "DOM", "DOM.Iterable"]`.

So one codebase serves both the browser and the server.

**Proposed ruling**
- **Status:** `accepted`
- **`languages.main.name`:** `TypeScript`, **observed**. All of `src/` is `.ts`, `tsc --noEmit` runs in CI, and the browser condition above is met.

**Departures from the recommendation:** none. The ADR will say in one line that it adopts the recommendation as is. The `.mjs` examples, playground, CLI shim and vitest config are secondary JavaScript files, and the ADR says secondary files don't change the answer.

**What I'll write once you agree:**
- **Frontmatter:** `status: accepted`, `date: 2026-11-15` and `authors: [Tristan Rivoallan]` (no email).
- **Body:** delete the "How to rule" block, add the one-line note that the recommendation is adopted as is, and rewrite the Consequences lists for this ruling.
- **AGENTS.md:** run `npx ontrack apply` to update it.

No other ADR will be edited.

**Do you agree with this ruling: `accepted` with `languages.main.name: TypeScript`?** You can also change the value or the authors list.

## ADR-0006

Evidence is gathered; here is the proposed ruling.

## ADR-0006 Commits: what the repository does today

**Commit format.** Conventional Commits is the habit, but nothing enforces it.
- Of the last 1000 subjects (since 2023-09-26), 39 do not match the eleven types. 21 of those use `types(...)`, which changelogen accepts but governance does not. A few others are free text (`lint`, `sync docs`, `shorten comments`, a typo `ix(examples)`).
- There is no commitlint, husky, simple-git-hooks or lefthook config, and `.git/hooks` holds only samples.
- No CI job checks messages (`.github/workflows/ci.yml`, `autofix.yml`, `publish.yml`).

**Scopes.** They are used often, but nobody keeps a list.
- 622 of the 1000 subjects have no scope. The rest are written freely, often as function names: `serveStatic`, `serve-static` and `static` all mean the same area, and `sse` and `event-stream` do too. Other examples are `setCookie`, `readBody` and `resolveDotSegments`.
- The steady words are `response`, `rules`, `session`, `static`, `request`, `proxy`, `event`, `cookie`, `cors`, `middleware`, `handler` and `cli`.
- Bots also write scopes: `chore(deps)` (renovate) and `chore(release)` (changelogen).

**The condition for the recommendation: are versions generated from commit messages?** Yes.
- `package.json` has `"release": "... changelogen --release ..."`. changelogen picks the semver bump from the commit types (`feat` → minor, `fix` → patch, `!` → major) and writes `CHANGELOG.md`, which it groups by type and scope (for example `**rules:** ...` under v2.0.8).
- `publish.yml` runs `pnpm changelogen --bump -r 2.0.0 --canary nightly`. The nightly base version is pinned there, but the changelog still comes from the messages.

So the premise holds and the recommendation applies.

## Proposed ruling: `accepted`

| Key | Value | Marked | Evidence |
|---|---|---|---|
| `commits.tool` | `commitlint` | **absent** | changelogen derives versions and the changelog from commit messages. No commitlint is installed (`node_modules/@commitlint` is missing) and no CI job checks messages. |
| `commits.scopes` | `[h3, event, handler, middleware, adapters, response, request, body, cookie, session, auth, cors, cache, proxy, static, event-stream, ws, json-rpc, route, rules, tracing, types, cli, examples, docs, deps, release]` | **absent** as a closed list | Scopes are used today but nobody keeps a list. Each word is a module or area of `src/` (`src/utils/*.ts`, `src/rules/`, `src/_entries` → `adapters`, `bin` → `cli`) or a scope a bot writes (`deps`, `release`). Synonyms and function names collapse into these: `serveStatic` → `static`, `sse` → `event-stream`, `setCookie` → `cookie`. |

**Departures from the recommendation:** none on `tool`. The ADR gives no default for `scopes`, so the list above is my proposal.

**Things you should know before deciding:**
- After acceptance, commitlint will refuse the `types:` type that this repo has used 21 times. Type-only changes would have to go under `fix`, `refactor` or `chore` (scope `types`). That limit comes from governance, not from this ruling.
- If the CI checkout has no `origin/HEAD`, the `check:` line will need `--from origin/main` appended.

I have no question tool, so I'll ask here. **Do you agree with this ruling?** You can answer:
1. **Yes, as proposed**: `accepted`, `tool: commitlint`, and the scope list above. Please give me the names to put in `authors:`.
2. **Yes, with a different scope list**: give me the words to add or remove, or `[]` for no scopes.
3. **Different tool**: `hook` or `none`.
4. **Stop here**: I write nothing.

I won't write anything until you answer.

Once the review ends, this is the list of rulings the repository does not follow yet. They only apply if you accept. No `tracking` trait is decided (Work tracking, ADR-0014, is still proposed), so I'll create nothing and only list them:
- `[trivoallan/ADR-0006] commits.tool: install @commitlint/cli and @commitlint/config-conventional and add a commitlint CI job` (serves ADR-0006 Commits)
- `[trivoallan/ADR-0006] commits.scopes: configure the closed scope list in commitlint and stop using the off-list scopes and the `types` type` (serves ADR-0006 Commits)

## ADR-0009

Now the repository's actual practice.

I've finished checking the repo against ADR-0009 (Branching). Here's the ruling I propose.

## What the repository does today

- **Default branch:** `main` (`origin/HEAD -> origin/main`). `ci.yml` runs on pushes to `main` and on pull requests that target `main`. `renovate.json` also targets a maintained `v1` branch (`"baseBranches": ["main", "v1"]`).
- **How work reaches `main`:** of the last 200 commits on `main` (2026-07-17 to 2026-11-10), 73 came from pull requests. The other 127 were pushed straight to `main` by maintainers. Those include every `chore(release): v2.0.x` commit, which the `release` script pushes itself (`changelogen --release && … && git push --follow-tags`, `package.json:52`). Nothing written in the repo blocks or discourages direct pushes. No CONTRIBUTING.md or PR template sets a rule, and I couldn't read the forge's branch-protection settings because the `gh api` call wasn't approved.
- **Merge method:** there are only 3 merge commits in the whole history, and only one of them is recent (`459093d`, 2025-07-13). PR commits land as one commit titled `type(scope): subject (#N)`, which is GitHub's squash format. So in practice the repo squashes.
- **Branch names:** these remote branches follow `prefix/kebab`: `feat/` ×16, `fix/` ×4, `chore/` ×2, `docs/` ×1, `build/` ×1. These don't: `docs-examples`, `feat-defineWebSocketRoute`, `fix-pr`, `fix-spread-options`, `merge-headers`, `h3-v2`, `pr-1368/chunked-cookie-handling`, and `v1`.
- **Commit types on `main` (last 500 commits):** chore 177, fix 154, feat 39, docs 33, refactor 29, build 17, test 15, perf 8, ci 4. There are also some that aren't among the ADR's eleven types: `types` 14, plus a few strays such as `sync` and `lint`.

## Proposed ruling: `accepted`

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | **absent** (only partly done) | Outside contributions come through short branches and PRs. But 127 of the last 200 commits were pushed straight to `main`, and the release script does this by design. |
| `branching.merge` | `squash` | **observed** | The `(#N)` single-commit pattern on `main`, and only 1 merge commit since 2020. |
| `branching.prefixes` | `[feat, fix, docs, chore, build]` | **observed** | These are the five prefixes the existing `prefix/` branches use: `chore/bench`, `chore/playground`, `build/compact`, plus `feat/`, `fix/` and `docs/`. All five are among the eleven commit types. |

## Where this departs from the recommendation

1. **`prefixes` adds `chore` and `build`** to `[feat, fix, docs]`. Maintainers already name branches with them, and `chore` is the most common commit type here. Leaving them out would make work that is normal today fail the check.
2. **`model: github-flow` doesn't describe today's practice.** Direct pushes to `main` are common. I'd keep `github-flow` anyway, because no feature flags are in use, which `trunk-based` requires. That means the ruling changes how maintainers work. The one exception the ADR would need to write down is the release commit, which the release script pushes to `main`. If you'd rather record what actually happens, the alternative is `trunk-based`, but that's not a good fit without flags.

## Notes for the check
- `v1` is a long-lived maintenance branch, not the default branch. The branch-name check would fail on it, so it would need an `--branch` exemption or a note in the ADR.
- Renovate opens `renovate/…` branches. The check only skips them once ADR-0018 (Dependencies) names Renovate, and ADR-0018 is still `proposed`. Until it's ruled, Renovate's PRs would fail this check.

I don't have a question tool, so I'm asking here. Do you agree with this ruling?

- **a)** Accept it as proposed: `github-flow`, `squash`, `[feat, fix, docs, chore, build]`.
- **b)** Change it. For example, use the recommended `[feat, fix, docs]`, rule `trunk-based`, or add a written exception for release commits and `v1`.
- **c)** Stop here.

I won't write anything until you answer. After the ruling is written, I'll list the rulings the repo doesn't follow yet. No `tracking` trait is decided (ADR-0014 is still `proposed`), so I'll give that list in my reply and won't create tracker items.

## ADR-0011

Still collecting evidence: checking the workflow-hardening commit and whether GitHub protects `main`.

Here is my proposed ruling on ADR-0011. I haven't written anything yet.

## What the repository does today

- **Forge: GitHub.** `origin` is `https://github.com/unjs/h3.git`, and `publish.yml` checks for `github.repository == 'h3js/h3'`. Three workflows sit in `.github/workflows/`: `ci.yml`, `autofix.yml` and `publish.yml`. This ADR's only use for `rejected` is a forge other than GitHub, so `rejected` doesn't fit.
- **Pipeline:** `ci.yml` runs `pnpm lint`, `pnpm typecheck`, `pnpm build` and `pnpm vitest --coverage` on every pull request to `main` and on every push to `main`. `publish.yml` only publishes after `ci` succeeds on a push to `main` (`workflow_run.conclusion == 'success'`). So a red pipeline already blocks a release, but nothing in the repository makes it block a merge.
- **Ruleset:** I couldn't check it. My `gh api repos/h3js/h3/rules/branches/main` call was not approved, so I don't know whether the `ci / tests` check is required on `main`.
- **Workflow audit: none.** There's no zizmor job, no zizmor config and no inline `# zizmor:` ignore. Neither zizmor nor actionlint appears anywhere outside this ADR, and `zizmor` is not on the `PATH` (actionlint is installed locally at `~/.local/bin`). Commit `ae12401 ci: harden workflows (#1529)` shows careful manual hardening: `permissions: {}` at workflow level, a permission set per job, `persist-credentials: false`, and template values passed through `env:` in `report-skipped`.
- **The five fixed rules today:**
  1. **Rule 1 (deploy from main) is met.** `publish` is bound to `main` through `workflow_run.branches: [main]` and `head_branch == 'main'`. It uses no protected `environment:`; it publishes to npm through OIDC (`id-token: write`).
  2. **Rule 2 (protected secrets) is met.** The only secret is `CODECOV_TOKEN`, a repository secret.
  3. **Rule 3 (immutable pins) is met.** Every `uses:` is pinned by SHA with its tag in a comment.
  4. **Rule 4 (no secret in logs) is met.** No step prints a secret.
  5. **Rule 5 (untrusted contributions) is met.** The workflows use `pull_request`, never `pull_request_target`. `publish.yml` uses `workflow_run`, but it checks `head_repository.full_name == github.repository`.

## Proposed ruling: `accepted`

| Key | Value | Observed / absent | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **pipeline observed, required check unverified** | `ci.yml` runs on every PR and publishing already waits for green `ci`. Whether a ruleset requires the check for merges lives on GitHub, and I couldn't read it. |
| `forge.audit` | `zizmor` | **absent** | No tool reads the workflows today. The ruling would add an `audit` job using `zizmorcore/zizmor-action` pinned by SHA. |

**Departures from the recommendation:** none. Both values are the recommended ones.

**What to expect if accepted:**
- **zizmor will likely have findings on the first run.** I couldn't run it, so these are guesses:
  - `dangerous-triggers` on `publish.yml`'s `workflow_run`. It's mitigated by the repository and branch checks, so it would need an inline ignore with that reason.
  - `artipacked` on `autofix.yml`'s checkout, which doesn't set `persist-credentials: false`.
- **`blocking` only becomes real through a ruleset** on `main` that requires `ci / tests`. Someone with admin rights on `h3js/h3` has to set that.

Do you agree to rule ADR-0011 `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`? If so, what should go in `authors:`? Or would you rather change a value, for example `informative` if the check isn't actually required on `main`?

## ADR-0023

I'm proposing **`accepted`** for ADR-0023 (License), with `license.spdx: MIT`. The repository already does this, and the ruling matches what the ADR recommends.

**What the repository does today**
- **Licence file:** `LICENSE` is committed at the root (`git ls-files LICENSE`) and holds the full MIT text, starting "MIT License".
- **Manifest:** `package.json:6` declares `"license": "MIT"`. There is no `pyproject.toml`, and none of the `package.json` files under `examples/` or `playground/` declares a licence.
- **README:** `README.md:34-36` says "Published under the MIT license", via `automd`.
- **Public repository:** the remote is `github.com/unjs/h3`, so `UNLICENSED` would be wrong here.
- **Conditions in the ADR:** "unless the value is `UNLICENSED`, a licence file is committed": a licence file is required and is there. There is no `pyproject.toml` to check.

**Proposed ruling**
- `status: accepted`
- `license.spdx: MIT`, **observed** (`LICENSE` and `package.json:6` both say MIT)

**Differences from the recommendation**
- **Licence:** none. MIT is what the ADR recommends.
- **Copyright holder:** the ADR says it should be the organisation that owns the repository, or else the people in `authors:`. The `LICENSE` line reads `Copyright (c) Pooya Parsa <pooya@pi0.io>`, the original author, not the `unjs` organisation. This isn't a trait and the check doesn't look at it. I'd leave the existing line alone, because rewriting an existing copyright notice is a legal choice for the maintainers. I'd add one line in the ADR saying the line is kept as is.
- **Patents:** nothing here points to a patent-sensitive area, so there's no reason to pick `Apache-2.0`.

**When I write the ADR, I'll:**
- set `spdx: MIT`, `status: accepted` and `date: 2026-11-15`;
- fill `authors:` with **Tristan Rivoallan** (the git user), unless you want other names there;
- rewrite the Consequences section;
- replace the how-to-rule block with "Adopted as recommended", plus the note about the copyright line;
- run `npx ontrack apply`.

**Rulings this repository doesn't follow yet:** none. Both points the check covers already pass. I won't propose any tracking items, and no `tracking` trait is decided in AGENTS.md anyway (ADR-0014 is still not decided).

Do you agree with this ruling, including keeping the copyright line and listing you as the author? I'll write nothing until you confirm.

## ADR-0025

I've read the ADR and checked the repository. Here is the proposed ruling; nothing is written yet.

## What the repository does today

- **No tool manager or pin script.** There is no `mise.toml`, `mise.lock`, `aqua.yaml`, `aqua-checksums.json`, `.tool-versions` or install script. `bin/` only holds `h3.mjs`, the package's own CLI.
- **No local hooks.** `.git/hooks` has only the `*.sample` files, and `package.json` has no hook runner.
- **CI uses only pinned actions and the package manager.** `.github/workflows/ci.yml`, `autofix.yml` and `publish.yml` use SHA-pinned actions, `pnpm` scripts, and `npm i -g npm@11.19.1` in `publish.yml`. The ADR leaves actions out (ADR-0011 rule 3), and npm belongs to the runtime and package-manager setup.
- **No accepted ADR names a tool.** Running `grep "^status:"` on `docs/adr/trivoallan/*.md` shows only ADR-0001 as `accepted`. ADR-0015 (secrets guard), ADR-0011 (`forge.audit`) and ADR-0019 (scanner) are all still `proposed`.
- **One loose end:** `typos.toml` configures crate-ci/typos, a binary the package manager doesn't install. But nothing runs it: `git grep` finds no CI step, script or hook that calls it. It was added in `5a4e7f1` (#783), and no ADR names it.
- **Renovate, not Dependabot, updates dependencies.** `renovate.json` extends `github>unjs/renovate-config`.

## Compared with the recommendation

The ADR recommends `script` for one tool and `mise` or `aqua` for several. Both cases assume at least one tool. Here there are **none**, and the ADR allows `none` exactly in that case: "`none` is an answer only when no accepted ADR names such a tool." That condition holds today, as the status list above shows.

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager`: `none`** (observed). No accepted ADR names a tool outside the package manager, and the repository installs none today: there is no manager file, no pin script and no hook.

**Departure from the recommendation:** `none` instead of `script` or `mise`/`aqua`, because the recommended values only apply once a tool is named. The ADR would say this, and also:
- **Rule 4 (what keeps the pins current):** there are no pins yet.
- **When to revisit:** once ADR-0015 or ADR-0011 is accepted with a tool (for example gitleaks or zizmor), this ruling has to be superseded. `ontrack check` will fail with `none` once a tool is listed.
- **`typos.toml`:** typos is configured but never run, and no ADR names it, so it is outside this ruling.

I'm not proposing `rejected`, because the question does apply: this repository will name such tools as soon as its secrets or CI ADRs are ruled.

If you'd rather rule ahead of ADR-0015 and ADR-0011, the choice would be `script` for one expected tool, such as gitleaks, or `mise` for several. That value would then be `absent`.

For `authors:`, I'd put "Tristan Rivoallan", from the git user. The date would be 2026-11-15.

**Do you agree with `accepted`, `tools.manager: none`?** Or would you prefer `script` or `mise` now? Once you confirm, I'll update the ADR and run `npx ontrack apply`.