=================== unjs__h3 ADR-0002
Now the evidence on what languages the repository uses.

I propose accepting ADR-0002 as written: everything in this repository is in English, so the ruling only records what already happens. I've written nothing yet.

## What the repository does today

There's no localization policy written down anywhere: no i18n or locale config, no CI check, and no rule in `AGENTS.md`. In practice, everything is in English:

- **Documentation:** `README.md`, `MIGRATION.md`, `CHANGELOG.md` and the docs site (`docs/1.guide`, `docs/2.utils`, `docs/4.examples`, `docs/5.migration`, `docs/99.blog`) are all in English. Every accented character outside `docs/adr/` is a Unicode path example such as `/café/**` → `/caf%C3%A9`, inside English text (for example `docs/1.guide/2.rules.md`).
- **Commits:** none of the 1,651 commit subjects (`git log --format=%s`) contains a French accented character. They are English Conventional Commits, such as `fix(static): join \`indexNames\` on a single \`/\` …`.
- **Code (names of functions, classes, variables):** English throughout `src/`, for example `defineHandler`, `toResponse` and `kNotFound`.
- **Comments:** English. The only accented characters in `src/` are the same `café` examples, in `src/utils/internal/path.ts:182` and `src/rules/internal/key.ts:81`.
- **Spell checker:** `typos.toml` configures crate-ci/typos, an English spell checker. Neither `package.json` nor `.github/workflows/*` references it, so nothing runs it.

**Compared with the recommendation:** it recommends `default: english` with no overrides, which matches the repository exactly. There are no differences, and the recommendation has no conditions to check.

## Proposed ruling

**Status:** `accepted`

- `localization.language.default: english (observed)`: docs, commit history, names in code and comments are all in English, as above.
- `localization.language.documentation: (empty, takes default) (observed)`: README, MIGRATION, CHANGELOG and `docs/**` are in English.
- `localization.language.commits: (empty, takes default) (observed)`: none of the 1,651 commit subjects contains a French accented character.
- `localization.language.code: (empty, takes default) (observed)`: names in `src/` are English.
- `localization.language.comments: (empty, takes default) (observed)`: comments in `src/` are English.

**Departures from the recommendation:** none. In place of the ADR's how-to-rule block I'd write one line saying it is adopted as is.

**Still needed from you:** the `authors:` value (who decides; no email addresses). `date:` will be 2026-11-15.

Do you agree with accepting this ruling, and who should be listed under `authors:`? Once you confirm, I'll:
1. fill the traits, status, date and authors;
2. rewrite the Consequences for an English-only repository;
3. remove the how-to-rule block;
4. run `npx ontrack apply`.

After that I'll list any rulings the repository doesn't follow yet. For this one I expect none.
=================== unjs__h3 ADR-0004
Here's what I found for **[trivoallan/ADR-0004] Languages**. The repository already answers this question in practice, so I propose ruling `accepted` with TypeScript.

**What the repository does today**
- **Source code:** all of `src/` is TypeScript (181 `.ts` files tracked, and nothing else under `src/`). The type rules are strict: `tsconfig.json` turns on `strict`, `isolatedDeclarations` and `erasableSyntaxOnly`, and covers `src` and `test`. `package.json` depends on `typescript ^7.0.2`.
- **CI:** `.github/workflows/ci.yml:22-25` runs `pnpm lint`, `pnpm typecheck` (`tsc --noEmit`), `pnpm build` and `vitest --coverage`. All of these are TypeScript tools.
- **Other languages:** the only other code is plain JavaScript in `.mjs` files: `examples/*.mjs`, `bin/h3.mjs`, `playground/server.mjs` and `vitest.config.mjs`. These are examples, a CLI shim and config, not where library code is written. The ADR's Context section says languages like this don't change the answer.
- **The ADR's condition:** it recommends TypeScript "when the repository runs in a browser or shares code between browser and server". That holds here. `tsconfig.json` lib includes `DOM` and `WebWorker`, and AGENTS.md lists browser, Service Worker and Cloudflare Workers among the platform entries (`src/_entries/generic.ts`, `service-worker.ts`).

**Proposed ruling**
- Status: `accepted`
- `languages.main.name: TypeScript (observed): 181 .ts files make up all of src/ and test/; strict tsconfig.json; tsc --noEmit and vitest run in ci.yml; the code runs in browsers and workers.`
- Departures from the recommendation: **none**. TypeScript is one of the two recommended languages, and the repository meets its browser condition.

If you agree, I'll fill in the trait, set `status: accepted`, the date (2026-11-15) and authors, rewrite the Consequences lists, and replace the "how to rule" block with one line saying the recommendation was adopted as is. Then I'll run `npx ontrack apply`.

**Rulings this repository doesn't follow yet:** none. TypeScript is already the main language and its tooling is set up. That means there are no tracking items to propose. AGENTS.md also has no decided `tracking` trait (ADR-0014 is still proposed), so I wouldn't create anything in a tracker anyway.

Do you agree with ruling ADR-0004 `accepted` with `languages.main.name: TypeScript`? If so, what name should go in `authors:`? I'd suggest "Tristan Rivoallan" from the git config.
=================== unjs__h3 ADR-0006
Now the repository's evidence: release process, commit tooling, history scopes.

Versions are generated from commit messages (`changelogen --release`, `changelogen --bump` in publish.yml). Now the scope vocabulary in history.

I've read ADR-0006 and checked what the repository does today on commits. Here is my proposed ruling. I've written nothing yet.

## What the repository does today

- **Versions come from commit messages.** `package.json` has `"release": "... changelogen --release ..."`. `.github/workflows/publish.yml` runs `pnpm changelogen --bump -r 2.0.0 --canary nightly` on every green push to `main`. `CHANGELOG.md` is generated by changelogen and sorts entries by type and scope (e.g. `**rules:** Let HTTPError.headers…`). This is the condition the ADR puts on recommending commitlint, and it holds.
- **Nothing enforces the format.** No commitlint, husky, simple-git-hooks or lefthook config and no hook directory. `ci.yml` runs lint, typecheck, build and tests, with no commit-message job. Review is the only check today.
- **The format is mostly followed, but not always.** In the last 1,500 subjects:
  - 44 are off-format. Most use `types(…)`, which is not one of the eleven governance types. Others have no type at all (`sync jsdocs`, `shorten comments`) or a typo (`ix(examples)`).
  - 830 have no scope.
- **Scopes have drifted, as the ADR's Context predicts.**
  - The same area appears as `static`, `serveStatic` and `serve-static`, and as both `sse` and `event-stream`.
  - Function names are used as scopes: `readRawBody`, `setCookie`, `createError`, `writeEarlyHints`, `getRequestURL`, …
  - Some scopes come from tools and must stay allowed: `chore(release)` from changelogen (118) and `chore(deps)` from Renovate (159).

## Proposed ruling

**status: accepted**

- `commits.tool: commitlint (absent)`: changelogen sets versions from messages (`package.json` `release` script, `publish.yml` nightly bump), and nothing in `.github/workflows/` checks messages today.
- `commits.scopes: [app, event, handler, middleware, response, error, adapters, types, request, body, cookie, session, auth, cors, proxy, ws, json-rpc, event-stream, static, cache, route, base, validate, rules, tracing, cli, deps, release] (observed)`: one scope per module under `src/` and `src/utils/`, plus `rules` and `tracing` (separate entries) and `cli` (`bin/`). `deps` and `release` are there because Renovate and changelogen write those commits. Every word on the list is already used in history. The list only drops the duplicates and the function-name scopes.

## Departures from the recommendation

- **`commits.tool`: none.** I adopt `commitlint` as recommended.
- **`commits.scopes`: the ADR recommends no value.** The list follows one rule an agent can apply: the scope is the module's file name. That is why it picks `static` over `serveStatic` and `event-stream` over `sse`, even though `sse` was used a little more often recently.
- **Not a ruling, but you should know:** the maintainers' `types(handler): …` habit becomes a refusal under commitlint's conventional rules. Those changes would be written `fix(types): …` or `refactor(handler): …` instead.

## What I need from you

1. Do you agree to **accepted, `tool: commitlint`** and the scope list above? Tell me if you want to add or remove scopes, for example `sse` instead of `event-stream`, or adding `examples`, `node` or `docs`.
2. Which **name(s) go in `authors:`**? I'd use "Tristan Rivoallan" unless you tell me otherwise. `date:` would be 2026-11-15.

Once you agree, I'll edit only ADR-0006 and run `npx ontrack apply`. Then I'll list the rulings the repository doesn't follow yet. commitlint isn't installed and no CI job runs it, so that list will include `[trivoallan/ADR-0006] commits.tool`. AGENTS.md decides no `tracking` trait, so I'll give that list in my reply and create nothing in a tracker.
=================== unjs__h3 ADR-0009
Now the repository's evidence: history, branches, CI, contributing docs.

Here's what I found on branching in this repository, followed by the ruling I propose.

## What the repository does today

**Merge style.** Of the last 300 commits on `main`, 130 end in a pull request number `(#NNNN)`, and none of those are merge commits. The whole repository history has 3 merge commits, and the newest is `459093d` ("Merge pull request #1156 from h3js/fix-pr"). So pull requests get squashed, and that's been the practice for a long time.

**Model.** Contributors work in pull requests: `ci.yml` runs on `pull_request: { branches: [main] }`, and there are 31 branches on the remote. But maintainers also push straight to `main`. About 150 of the last 300 commits have no pull request number and aren't release commits, for example `48d650b fix(rules): …`, `7150b0e fix(cli): …` and `1a1f488 chore: update srvx`. Release commits (`chore(release): v2.0.x`) and `autofix-ci[bot]` commits also land on `main` directly, and `ci.yml` and `autofix.yml` run on `push: { branches: [main] }`. Nothing in the repository documents a branching model: there's no CONTRIBUTING file and no branching section in AGENTS.md.

**Branch names.** Of the remote branches, 25 use `prefix/name`: `feat` 17, `fix` 4, `chore` 2, `build` 1, `docs` 1. Eight don't fit the form, either because they have no prefix or because the prefix isn't a commit type: `docs-examples`, `feat-defineWebSocketRoute`, `fix-pr`, `fix-spread-options`, `merge-headers`, `h3-v2`, `v1`, `pr-1368/chunked-cookie-handling`. A few also use camelCase rather than kebab-case (`feat/defineRoute`, `feat/getPayload`-style names), which the ADR's check would reject.

**Bots.** `renovate.json` is present, so Renovate opens `renovate/…` branches. The check only lets those through once ADR-0018 is ruled, and ADR-0018 is still `proposed`.

**What I couldn't see.** Branch protection and which merge buttons are enabled are GitHub settings (Settings → General → Pull Requests, and Settings → Branches/Rulesets for `h3js/h3`). They aren't in the repository.

## Proposed ruling

**Status: `accepted`**

- `branching.model: github-flow (observed)`: pull requests that run CI against `main` are the main contribution path. **But** maintainers and bots push to `main` directly (about 150 of the last 300 commits), which pure github-flow doesn't allow.
- `branching.merge: squash (observed)`: 130 of the last 300 commits carry `(#N)` and none of them are merge commits; there are only 3 merge commits in the whole history. Whether the other merge buttons are turned off in GitHub, I can't see.
- `branching.prefixes: [feat, fix, docs, chore, build] (observed)`: these five are the prefixes actually used on the 25 conforming remote branches. The other 8 branches don't fit the form.

**Differences from the recommendation**

1. **`prefixes` adds `chore` and `build`.** Both appear in branch names here (`chore/bench`, `chore/playground`, `build/compact`), both are among ADR-0006's eleven types, and `chore` is the second most common commit type (101 of the last 300). Leaving them out would make branches that already exist fail the check.
2. **Direct pushes to `main` (this needs your decision).** `github-flow` with no exception would make maintainers stop pushing to `main`, and that isn't how the repository works today. One option is to write an explicit exception in the ADR for maintainer pushes and release/autofix commits. The other is to keep the model strict and accept that current practice doesn't follow it.

Two more things to know before deciding:

- The check on branch names will fail on Renovate branches until ADR-0018 is ruled.
- The check is also strict about kebab-case, so camelCase names like `feat/defineRoute` would fail.

I don't have a question tool here, so please answer in your reply:

1. **Do you agree with the ruling** (`accepted`, `github-flow`, `squash`, `[feat, fix, docs, chore, build]`), or would you change any value?
2. **Direct pushes to `main`:** should the ADR write an exception for maintainer, release and autofix commits, or keep strict github-flow?
3. **Authors:** what name or names should go in `authors:`? The date will be 2026-11-15.
4. **Merge settings:** can you confirm that only "squash" merging is enabled in the GitHub settings for `h3js/h3`? I can't see them from the repository.

I won't write anything until you answer.
=================== unjs__h3 ADR-0011
I've read ADR-0011 and compared it with what h3 does today. Below is the ruling I propose. One value depends on a GitHub setting I couldn't read, so I need your answer on that before writing anything.

## What the repository does today

- **The repository is on GitHub.** `origin` is `https://github.com/unjs/h3.git`, and the workflows live in `.github/workflows/` (`ci.yml`, `autofix.yml`, `publish.yml`). There is no other CI (no `.gitlab-ci.yml`, `.circleci`, `.forgejo` or `.gitea`). So the question applies here and `rejected` isn't justified.
- **There is a pipeline.** `ci.yml` runs on pushes and pull requests to `main`: `pnpm lint`, `pnpm typecheck`, `pnpm build`, then `pnpm vitest --coverage`, uploaded to Codecov.
- **Whether a red pipeline blocks a merge isn't visible from here.** That depends on a ruleset or branch protection on `main`, which lives on GitHub. My read-only call (`gh api repos/h3js/h3/rules/branches/main`) needed your approval, so I couldn't see it.
- **Nothing audits the workflows.** zizmor isn't installed, and no job, script, config or commit mentions it. `package.json` has no workflow lint step. actionlint is installed on this machine but isn't wired into the repo.
- **The workflows were already hardened** in commit `ae12401` ("ci: harden workflows (#1529)"):
  - Every action is pinned by commit SHA with the tag in a comment, including `actions/*` (rule 3 is met).
  - Permissions are `{}` at workflow level and granted per job.
  - Checkouts in `ci.yml` and `publish.yml` use `persist-credentials: false`.
  - No workflow uses `pull_request_target`, and pull requests from forks get no secrets (rule 5 is met).
  - Publishing only runs from `main`: it is triggered by `workflow_run` on `main`, and its `if:` checks the source repository, the branch and the commit (rule 1 is met in substance).

## Differences from the recommendation

1. **No zizmor job** runs on pull requests, so the `audit` stage and the three zizmor rules are all missing.
2. **zizmor would very likely report findings today**, so turning it on means fixing them or adding inline ignores:
   - `autofix.yml` checks out without `persist-credentials: false`, which zizmor reports as `artipacked`. autofix-ci may need those credentials, in which case the finding would get an inline ignore with that reason.
   - `publish.yml` is triggered by `workflow_run`, which zizmor reports under `dangerous-triggers`. The `if:` guards look sound, so this would most likely be an inline ignore with a reason.
3. **Rule 1 asks that a deploy job use a protected environment.** The `publish` job uses none: it publishes to npm through OIDC, guarded only by its `if:`. This is either a departure to write down, or a change to make (add a protected `npm` environment).
4. **`publish.yml` checks `github.repository == 'h3js/h3'` but `origin` points to `unjs/h3`.** This is probably a repository rename on GitHub, not a bug. I'm noting it because it decides whether publishing runs at all.

## Proposed ruling

**Status: `accepted`**

- `forge.gate: blocking (?)`: `ci.yml` runs on every pull request to `main`, but whether its check is required is a GitHub setting I couldn't read. **I need you to tell me** whether a ruleset or branch protection on `main` requires the `ci / tests` check.
  - If it does, I'll mark this `blocking (observed)`.
  - If it doesn't, the choice is between `blocking (absent)`, which means someone has to add that ruleset, and `informative (observed)`.
- `forge.audit: zizmor (absent)`: nothing reads the workflows today, and ruling `zizmor` would add a job that does. It fits well here: the workflows already follow most of what zizmor checks, so the remaining findings are probably limited to the two above.

The departures I'd write into the ADR are the publish job without a protected environment (rule 1), unless you'd rather add one, and the gate value if it turns out to be `informative`.

**Before I write anything, please tell me:**
1. Does a GitHub ruleset or branch protection on `main` require the CI check? (Or approve the `gh api repos/h3js/h3/rules/branches/main` call so I can read it.)
2. Do you agree with `forge.audit: zizmor`?
3. Should the missing protected environment on `publish` be written down as a departure, or left as something to fix?
=================== unjs__h3 ADR-0023
I'm proposing **`accepted`** with `license.spdx: MIT`. That is the ADR's recommendation, and the repository already does it. I've changed nothing yet.

## What the repository does today

- **Licence file:** `LICENSE` at the root holds the full MIT text. It came in with the initial commit (`cbc8909`, 2020-11-17) and was last touched in `a138101` (2022-11-15).
- **Manifest:** `package.json:6` has `"license": "MIT"`. There is no `pyproject.toml`.
- **README:** `README.md:34-36` has `<!-- automd:contributors license=MIT author="pi0" -->` and the line "Published under the MIT license".
- **Subfolder manifests:** `playground/`, `docs/` and `examples/package.json` are all `"private": true` and declare no licence. The check doesn't read subfolders, so this doesn't matter.
- **CI:** nothing checks that the manifest and the licence file agree. That is what the ADR's `check:` line would add.

## Conditions in the recommendation

- **`UNLICENSED` for a private repository:** doesn't apply. The root `package.json` has no `"private"` field, the package `h3` is published, and `origin` is the public `github.com/unjs/h3`.
- **`Apache-2.0` when a patent grant matters:** I don't see any sign of it. h3 is a minimal HTTP framework built on web standards, with no patent-heavy area. I can't rule out a patent concern you know about and I can't see.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: MIT (observed): package.json:6 "license": "MIT"; LICENSE at the root holds the full MIT text since cbc8909`

**Departures from the recommendation:** none on the key. The value is MIT, as recommended.

**One difference from a rule the ADR fixes whatever you decide:** fixed rule 3 says the copyright holder is the organisation that owns the repository, or else the people in `authors:`. `LICENSE` instead says `Copyright (c) Pooya Parsa <pooya@pi0.io>`, which is one person. The repository belongs to an organisation: `package.json` says `h3js/h3` and the remote is `unjs/h3`. It complies only if Pooya Parsa is among the `authors:` of this ruling. Otherwise it's a ruling the repository doesn't follow yet, and I'd list it at the end.

## What I need from you

1. **Do you agree** to `accepted` with `license.spdx: MIT`?
2. **`authors:`** — who is deciding? Names only, no email addresses. If the list includes Pooya Parsa, the current copyright line complies. If not, do you want the holder changed to the organisation, and should I record it as not yet followed?

I checked one more thing in the background: `"license": "MIT"` has been in `package.json` since the initial commit (`cbc8909`, 2020-11-17), the same commit that added `LICENSE`. That only strengthens the `observed` mark, so the proposed ruling stays the same:

- **Status:** `accepted`
- `license.spdx: MIT (observed): package.json:6 "license": "MIT", there since cbc8909 (2020-11-17); LICENSE at the root holds the full MIT text`
- **Departures from the recommendation:** none.

I've written nothing yet. I still need your two answers:

1. **Do you agree** to `accepted` with `license.spdx: MIT`?
2. **`authors:`** — who is deciding? Names only, no email addresses. The `LICENSE` copyright line names one person, Pooya Parsa. The ADR wants it to name the organisation that owns the repository (`h3js/h3` in `package.json`, `unjs/h3` as the remote), unless that person is among the deciders.
=================== unjs__h3 ADR-0025
I've read the ADR and CI. Now I'm checking whether any binary outside pnpm is used today (typos, gitleaks, and similar).

I've finished the evidence review for **[trivoallan/ADR-0025] Tools outside the package manager**. Nothing is written yet.

## What the repository does today

- **No tool outside pnpm is installed anywhere.** There is no `mise.toml`, `aqua.yaml`, `.tool-versions`, install script or git hook. Nothing in the repo or CI runs gitleaks, zizmor, grype, actionlint or `brew install`.
- **CI only installs things this ADR leaves out.** The three workflows use `unjs/setup-jup`, pinned by SHA, for the Node runtime and pnpm. `publish.yml:38` runs `npm i -g npm@11.19.1`. Every other tool (oxlint, oxfmt, obuild, changelogen, pkg-pr-new) is a devDependency in `package.json`.
- **`typos.toml` is the one loose binary.** It configures crate-ci/typos, but no script or workflow runs it. It's for a contributor's own install, and no ADR names it.
- **Renovate is set up, Dependabot is not.** `renovate.json` extends `github>unjs/renovate-config` and there is no `.github/dependabot.yml`. That matters for rule 4: Renovate has a `mise` manager that also updates `mise.lock`.
- **No accepted ADR names a tool yet.** Only ADR-0001 is `accepted`. The ADRs that would name tools are all still `proposed`:
  - ADR-0015 recommends `secrets.guard: gitleaks`.
  - ADR-0011 recommends `forge.audit: zizmor`.
  - ADR-0019 recommends `vulnerabilities.scanner: grype`, plus syft for a CycloneDX SBOM.

## Checking the condition

The recommendation depends on how many tools accepted ADRs name: `script` for one, `mise` or `aqua` for several, `none` only when there are none.

- **Today:** none, so `none` is a valid answer right now.
- **If ADR-0011, 0015 and 0019 are accepted as recommended:** three or four tools (gitleaks, zizmor, grype, syft), so `mise` or `aqua`.

Between those two, `mise` fits better here. Renovate is already installed, and its `mise` manager moves `mise.lock` checksums in the same PR, which rule 4 asks for. aqua's Renovate preset isn't documented to do that.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: mise (absent)`: no tool manager or pin file exists today; several tools would follow if ADR-0011, 0015 and 0019 are accepted as recommended. Renovate (`renovate.json`) can move `mise.toml` and `mise.lock` together, which covers rule 4.

**Departures from the recommendation:** none, as long as those three ADRs are accepted with tools. If they are not, the departure flips: the value should be `none`, with the reason "no accepted ADR names a tool".

**What I could not see:** the `unjs/renovate-config` preset lives outside this repository, so I can't tell whether it turns off Renovate's `mise` manager. Also, if Renovate is self-hosted rather than the hosted app, updating `mise.lock` must be allowed as an unsafe execution.

Do you agree with `accepted` and `tools.manager: mise`? Or do you want `none` for now, because ADR-0011, 0015 and 0019 aren't ruled yet? Two smaller questions:
1. Does the unjs Renovate preset leave the `mise` manager on?
2. Which names should go under `authors:`?
