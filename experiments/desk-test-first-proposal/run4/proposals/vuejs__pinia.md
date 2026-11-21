# vuejs__pinia

## ADR-0002

I've gathered the evidence. Here is the proposed ruling; I haven't written anything yet.

**Note:** AGENTS.md says to run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0002-localization` first, but that command needed your approval and didn't run. Its output could add to or change what follows.

## What the repository does today

- **Commits:** they are written in English and follow Angular's conventions (`.github/commit-convention.md`). A hook enforces the format (`package.json:66`, `"commit-msg": "node scripts/verifyCommit.mjs"`). Only 2 of 2,320 commit subjects contain non-ASCII characters: one Chinese docs fix (`2ed63e3b docs: 关于pinia中文文档…`) and one emoji.
- **Code and comments:** names and comments in `packages/pinia/src` are in English. The only non-ASCII characters there are emoji (🍍, 🔴) inside English strings and comments, such as `store.ts:262` and `types.ts:85`.
- **Documentation:** English is the source, at the site root (`packages/docs/.vitepress/config/index.ts`: `root: { lang: 'en-US' }`). There is a Chinese translation under `packages/docs/zh/`. It is kept in sync with the English (`translation-status.json` records hash `05ece25e`, and the latest commit is `docs(zh): sync Chinese docs with English`). Spanish, Portuguese, Ukrainian and Russian versions are only external links.
- **No rule is written down:** nothing in the repository states a language policy. The Chinese translation is a reader-facing translation of the English, not a second working language, and the allowed values are only `french` and `english`.

## Proposed ruling: `accepted`

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `default` | `english` | observed | Commits, code, comments and the source docs are all in English (see above) |
| `documentation` | *(empty, so English)* | observed | The English docs are the source; `zh/` is translated from them |
| `commits` | *(empty)* | observed | 2,318 of 2,320 commit subjects are plain ASCII English; the hook enforces the convention |
| `code` | *(empty)* | observed | Names in `packages/*/src` are English |
| `comments` | *(empty)* | observed | Comments are English; only emoji are non-ASCII |

**Departures from the recommendation:** none. I'd add one line saying the Chinese docs are a translation of the English source and are not covered by this rule.

Every key is already observed, so I expect no rulings left for this repository to follow.

**Tracker:** no `tracking` trait is decided yet (ADR-0014 is still proposed), so after the review I'll give any leftover rulings here and create no tracker items.

Do you agree with ruling `accepted` and `default: english`, with no overrides? If yes, which names should go in `authors:`? Once you confirm, I'll fill the frontmatter (date 2026-11-15), rewrite the Consequences section, replace the how-to-rule block and run `ontrack apply`.

## ADR-0004

I've gathered the evidence for ADR-0004 (Languages). Here is the proposed ruling for you to decide on.

**Note:** `AGENTS.md` asks me to run `npx -p @trivoallan/ontrack ontrack review` first, but that command needed your approval and didn't run. This review follows the ADR file itself.

## What the repository does today

The repository has never written down its main language: no ADR, `CONTRIBUTING.md` section or config states it. In practice it is entirely TypeScript:
- **Source:** every source file under `packages/pinia/src`, `packages/testing/src` and `packages/nuxt/src` is `.ts`. The only `.js`/`.mjs` files are a few build and helper scripts: `scripts/verifyCommit.mjs`, `packages/size-check/*`, `packages/docs/run-typedoc.mjs`.
- **Type checking:** the root `tsconfig.json` has `"strict": true` and `"allowJs": false`, and `typescript ~5.9.3` is in `package.json`.
- **CI:** `.github/workflows/ci.yml:31-36` runs `pnpm run test:types` (`tsc --build`), the Nuxt type check, and `test:dts` on the `.test-d.ts` type tests.
- **Secondary languages:** Vue SFCs (`.vue`) in the playgrounds and docs theme, plus shell scripts. The ADR's Neutral section says these don't change the answer.

## The condition in the recommendation

The ADR says to pick TypeScript "when the repository runs in a browser or shares code between browser and server". Both are true here:
- Pinia is a Vue state library that runs in the browser (`packages/playground`, `packages/online-playground`).
- The same code also runs on the server: `packages/pinia/__tests__/ssr.spec.ts`, `packages/nuxt/src/runtime/payload-plugin.ts`, and `lib: ["esnext", "dom"]` in `tsconfig.json`.

So the condition holds, and TypeScript is the right pick.

## Proposed ruling

- **Status:** `accepted`
- **`languages.main.name`:** `TypeScript`, **observed**. The evidence is the `.ts`-only sources, strict `tsconfig.json`, and `tsc` and dts checks in CI listed above.
- **Departures from the recommendation:** none. The Decision section would get one line saying the recommendation is adopted as is.
- **`rejected`:** doesn't apply. This is a code repository with a clear main language.

When I write it, I'd also do the rest of the ADR's ruling steps:
- set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists for this verdict;
- delete the "How to rule" block;
- run `npx -p @trivoallan/ontrack ontrack apply` to update `AGENTS.md`.

**Follow-up items:** the repository already matches this ruling, so nothing would need a tracking item. Also, no `tracking` trait is decided yet (ADR-0014 is still proposed), so I wouldn't create anything in a tracker either way.

**Do you agree with ruling ADR-0004 `accepted` with `languages.main.name: TypeScript`?** I won't write anything until you confirm or tell me what to change. I don't have a question tool in this session, so please reply here.

## ADR-0006

Checked how versions are set: a person picks them in the release prompt, not from commit messages. Now counting which scopes the history actually uses.

I'm proposing **`accepted`**, with `commits.tool: hook` rather than the recommended `commitlint`, because this repository sets its versions by hand. Nothing is written yet; I need your agreement first. I also couldn't run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0006-commits`, which AGENTS.md asks for, because the permission prompt didn't go through. So this review is based on the ADR file and the repository only.

## What the repository does today

- **Versions are chosen by a person.** `scripts/release.ts:286-338` asks the releaser to pick `patch`, `minor`, `major` or `custom` for each package. Commit messages only feed the changelogs: `conventional-changelog` in `release.ts:465-490`, and `changelogithub` in `.github/workflows/release.yml`.
- **The convention is enforced by a local hook.** `package.json` runs `node scripts/verifyCommit.mjs` on `commit-msg` through `simple-git-hooks`, installed by `postinstall`. The convention is written up in `.github/commit-convention.md`.
- **CI does not check commits.** Neither `ci.yml` nor any other workflow looks at commit messages.
- **Scopes are open.** The hook accepts any scope (`(\(.+\))?`), and the convention doc says "the scope could be anything".
- **History over the last two years:** 283 commits, 2 off-format. One is `Update utils.ts to remove…`; the other starts with a space. Both probably came in through the forge, where the local hook doesn't run.
- **Scopes in use over the last two years:** nuxt 10, types 5, devtools 3, hmr 3, zh 3, release 3, testing 2, playground 2, ssr 2, ci 2, and one each for store, warn and madvue. The packages are `pinia`, `nuxt`, `testing`, `docs`, `playground`, `online-playground` and `size-check`.

## Is the recommendation's condition met?

The ADR recommends `commitlint` "if this repository generates its versions from commit messages". It doesn't: `release.ts` asks for the version interactively. So the recommendation falls, and the ADR says `none` or `hook` is just as good an answer.

`rejected` doesn't fit either. This is a repository with several packages whose changelogs are built from commit messages, so a scope vocabulary is useful.

## Proposed ruling

**Status: `accepted`**

| Key | Value | Mark | Evidence |
|---|---|---|---|
| `commits.tool` | `hook` | observed | the `simple-git-hooks` `commit-msg` hook runs `scripts/verifyCommit.mjs` |
| `commits.scopes` | `[nuxt, testing, types, devtools, hmr, ssr, store, playground]` | observed | these are the area scopes used in the history; the list itself is not written anywhere today, and the hook doesn't enforce it |

**Departure from the recommendation:** `hook` instead of `commitlint`. The premise isn't met, because versions are chosen by hand and commit messages only drive the changelogs. The hook is already in place.

**Scopes I left out:**
- `ci`: it repeats the `ci` type.
- `release`: it repeats the type that `release.ts` uses.
- `zh`, `madvue`, `warn`: each is a single translation, page or one-off.

If you want translation commits filterable, I could add a `docs`-area scope or the locale codes.

## Gaps between the repository and governance

Governance fixes these, so they aren't part of the ruling, but they are real differences:
1. **Extra types.** The hook allows `dx`, `workflow`, `types`, `wip` and `release`, which aren't among the eleven. `release.ts:524` itself commits `release: …`, which shows up 16 times in the last two years.
2. **The breaking-change `!` is refused.** The hook regex rejects `feat!:` and `fix(x)!:`.
3. **Stale documentation.** The regex in `.github/commit-convention.md` leaves out `release`, which the hook allows.
4. **Scopes aren't enforced.** The hook doesn't check scopes against a closed list, and nothing checks commits that arrive through the forge.

Do you agree with this ruling: `accepted`, `tool: hook`, and the scope list above? You can also change the scopes or pick `commitlint`. Once you agree, I'll fill the ADR (status, date, authors, Consequences, reason for the departure) and run `ontrack apply`. Then I'll list the rulings the repository doesn't follow yet. The `tracking` trait isn't decided, so that list will go in my reply and I won't create any tracker items.

## ADR-0009

Still collecting evidence: next I'm counting merge commits, PR-merged commits and direct pushes, and listing the branches.

I couldn't run `ontrack review` because the command needs approval, so I used the ADR's own steps. I've written nothing yet.

## What the repository does today

- **Default branch:** `v4` (`origin/HEAD -> origin/v4`). `v1`, `v2` and `v3` stay open as maintenance lines for older versions. CI runs on PRs into `[v3, v4]` (`.github/workflows/ci.yml:9`, `pkg.pr.new.yml:5`). There are no `develop`, `release/*` or `hotfix/*` branches.
- **How work lands:** short branches and PRs. `CONTRIBUTING.md` says "We accept contributions via Pull Requests… One pull request per feature". But the maintainers also push straight to `v4`: only 49 of the 136 commits from the last year have a `(#NNNN)` PR suffix. The other 87 are `chore: up …`, `ci: fix branches`, `docs: fix build`, and the `release:` commits, which `scripts/release.ts:73` makes on `v4` (`EXPECTED_BRANCH = 'v4'`).
- **How PRs merge:** squash. History is linear, with one commit per PR titled `type(scope): subject (#NNNN)`. There are 96 merge commits in total, but they are almost all `Merge pull request #36x from …dependabot…` from 2021. Only one is recent (`01b46b99`, 2026-04-07). I couldn't read the GitHub merge settings (`gh api` needs approval), and nothing in the repository configures them (`.github/settings.yml` only sets labels).
- **Branch names:** the open remote branches are `feat/*` ×4, `fix/*` ×2, `docs/*` ×2, `test/globalhmr`, plus the bot branch `coderabbitai/docstrings/57bec95`. That is already the `prefix/kebab-case` form, using `feat`, `fix`, `docs` and `test`.
- **Bots:** `renovate.json` exists, so `renovate/` branches will appear. The check only exempts them once ADR-0018 is ruled, and ADR-0018 is still `proposed`.

## Proposed ruling: `accepted`

| Key | Value | Observed? | Evidence |
| --- | --- | --- | --- |
| `branching.model` | `github-flow` | observed (partly) | Short branches and PRs into `v4`, per CONTRIBUTING.md; no gitflow branches. The 87 direct pushes in a year are the part not followed (see below). |
| `branching.merge` | `squash` | observed | Linear history, one `… (#NNNN)` commit per PR; one merge commit since 2021. |
| `branching.prefixes` | `[feat, fix, docs, test]` | observed | Remote branches `feat/*`, `fix/*`, `docs/*`, `test/globalhmr`. |

**Departures from the recommendation:**
1. **`prefixes` adds `test`.** The repository already uses `test/globalhmr`, and `test` is one of the eleven commit types, so it isn't a new prefix.
2. **Maintenance branches `v1`–`v3`.** These don't make the model gitflow: they are old version lines, not `develop`/`release`. I'll write that in the ADR so nobody reads them as a different model.
3. **Direct pushes to `v4`** (chores, CI fixes, release commits) go against "one change, one PR". I'd record this as a known gap rather than change the model. The alternative is `trunk-based`, but the repository uses no feature flags, and outside contributions all come through PRs.

Should I write this ruling (status `accepted`, the three values above, today's date, the reasons for these departures) and then run `ontrack apply`? Please tell me the name(s) to put in `authors:`, and whether to keep `test` or drop it to match the recommendation exactly.

## Rulings this repository does not follow yet

No `tracking` trait is decided (ADR-0014 is still `proposed`), so I'll create no tracker items. This is the list:

- `[trivoallan/ADR-0009] branching.model`: maintainers push to `v4` without a PR (87 of 136 commits in the last year). Fixing this means protecting `v4` on the forge or changing how maintainers work.
- `[trivoallan/ADR-0009] branching.merge`: no setting in the repository enforces squash-only, and I couldn't check the GitHub settings. Turn off merge commits and rebase merges for `vuejs/pinia`.
- `[trivoallan/ADR-0009] branching.prefixes`: the `check:` line isn't run in CI. The `coderabbitai/…` branch would fail it, and so would the `renovate/…` branches until ADR-0018 is ruled.

## ADR-0011

I've read the ADR and all four workflows; now checking branch protection on GitHub, zizmor availability and workflow history.

I'm proposing **`accepted`** with both keys at the recommended values. Nothing is written yet; I need your agreement first.

I couldn't run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0011-forge-and-ci` (which AGENTS.md asks for) or `gh api repos/vuejs/pinia/rules/branches/v4`. Both are waiting for your approval. So the evidence below comes from the repository files alone.

## What the repository does today

- **Forge: GitHub.** The remote is `github.com/vuejs/pinia` and there are 4 workflows in `.github/workflows/`. So `rejected` doesn't apply: that's only for a different forge.
- **Pipeline:** `ci.yml` runs on every push and on pull requests to `v3` and `v4`. It does lint, type tests, vitest, build, dts and dist tests, and a size check, all in one `build` job. Its permissions are `contents: read`.
- **Whether a red pipeline blocks a merge: unknown.** Nothing in the repository says. `.github/settings.yml` (Probot settings) only declares labels and no branch protection. The ruleset lives on GitHub and I couldn't read it.
- **Workflow audit: none.** No workflow, script or config mentions zizmor or actionlint. zizmor isn't installed locally (`zizmor not found`). actionlint is installed at `~/.local/bin` but isn't wired into anything.

## Proposed ruling

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | **absent** (not verified) | `ci.yml` already runs the checks on PRs to `v4`. No file shows a required check, and I couldn't read the ruleset. If you know `ci / build` is already required on `v4`, this becomes **observed**. |
| `forge.audit` | `zizmor` | **absent** | There's no audit job or config, and zizmor isn't installed. |

**Departures from the recommendation: none.**

## Where the repository differs from the ADR's fixed rules

These rules apply whatever the ruling:

- **Rule 3 (pin actions by SHA): broken in 3 of 4 workflows.** `ci.yml`, `pkg.pr.new.yml` and `update-sponsors.yml` use tags like `actions/checkout@v6`, `pnpm/action-setup@v4` and `codecov/codecov-action@v5`. Only `release.yml` pins by SHA.
- **Rule 1 (deploy only from the default branch): `release.yml` doesn't follow it.** It publishes to npm on any matching tag push (guarded by `github.repository == 'vuejs/pinia'`). It isn't bound to `v4` and uses no protected environment. Also, `pkg.pr.new.yml` publishes preview packages from every branch push. Whether that counts as a deploy depends on ADR-0012, which isn't ruled yet.
- **What zizmor will likely flag once it runs:**
  - `release.yml:144-145,152`: template expansion of `${{ steps.resolve.outputs.* }}` inside `run:`.
  - `artipacked`: checkouts that keep their credentials. `update-sponsors.yml` needs them because it runs `git push`, so it would need an inline ignore with a reason.
- **Rules 2, 4 and 5 look fine:**
  - npm publishing uses trusted publishing (OIDC) with no token secret.
  - No workflow prints a secret.
  - There's no `pull_request_target`.
- **Jobs from the stage table:**
  - `audit` doesn't exist yet; this ruling would create it.
  - `scan`, `release` and `deploy` depend on ADR-0019 and ADR-0012, which aren't ruled. I'm not deriving anything from them here.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** If you say yes, I'll also need two things. First, the name to put in `authors:`. Second, whether `ci / build` is already a required check on `v4`, so I can mark `forge.gate` observed or absent.

## ADR-0023

I read the ADR in full. AGENTS.md says to run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0023-license` first, but it needs your approval and was not run, so this review relies on the ADR text and the repository alone.

## What the repository does today

| Point | Evidence |
| --- | --- |
| A licence file is at the root | `LICENSE` is committed and starts with "The MIT License (MIT)". It was added in `ef5a732e chore: add license at root for gh`. |
| Copyright holder | The `LICENSE` copyright line reads "Copyright (c) 2019-present Eduardo San Martin Morote". That is a person, not the `vuejs` organisation. |
| Root manifest | `package.json` has `"private": true` and **no `license` field**. |
| Published packages | `packages/pinia`, `packages/nuxt` and `packages/testing` each declare `"license": "MIT"`. The other workspaces are `private`. |
| `pyproject.toml` | There isn't one, so the Python part of the rule doesn't apply. |
| CI and checks | Nothing in the repository checks licence fields. |

No condition in the ADR has to be checked. The licence question applies whatever `delivery.target` says, and these packages are public on npm, so `rejected` does not fit.

## Proposed ruling: `accepted`

- `license.spdx: MIT`: **observed**. The root `LICENSE` holds the MIT text and every published manifest says `MIT`.

**Departures from the recommendation:** none on the key, since MIT is the value the ADR recommends. Two things in the repository still differ from what the ADR fixes:

1. **The root manifest doesn't declare the licence.** The ADR requires it, and its `check:` reads the root `package.json`. Today the check would fail. The fix is to add `"license": "MIT"` to the root `package.json`, which I would only list as a follow-up below, not do now.
2. **The copyright holder is a person, not the organisation.** The ADR expects the organisation that owns the repository, or the ADR's `authors:`. I suggest leaving the existing line alone and writing that reason in the ADR: the copyright belongs to whoever holds it, and the ADR's rule is about writing a new file, not rewriting an existing notice. Changing it is a legal decision for the maintainers, not an agent edit.

## Follow-up: what the repository would not yet match

There's no decided `tracking` trait in AGENTS.md (ADR-0014 is still undecided), so I won't create anything. Here is the list instead:

- `[trivoallan/ADR-0023] license.spdx: declare "license": "MIT" in the root package.json`: this serves ADR-0023 (License).

Once you agree, I'll set `status: accepted`, fill `traits.license.spdx: MIT`, set `date: 2026-11-15`, rewrite the Consequences lists, and replace the how-to-rule block with the reasons above. Then I'll run `npx -p @trivoallan/ontrack ontrack apply`, which also needs your approval.

**Do you agree with this ruling, and which names go in `authors:`?** Also tell me if you want the copyright line handled differently.

## ADR-0025

Now the workflows, scripts and Renovate config, to see whether any binary is installed outside pnpm today.

I've drafted a ruling for ADR-0025 below and changed nothing yet. The ADR says how to rule, so its five steps take precedence over the generic ones. I tried to run `npx -p @trivoallan/ontrack ontrack review trivoallan/ADR-0025-tools` as AGENTS.md asks, but it wasn't approved, so this review relies on the ADR text and my own look at the repository.

## What the repository does today

**No tool is installed outside pnpm, anywhere.**
- **Tool managers:** there is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml` or install script. Git history shows none were ever added.
- **CI:** `.github/workflows/ci.yml` and `release.yml` only use actions and `pnpm install --frozen-lockfile`. No workflow downloads a binary. The only `curl` (`update-sponsors.yml:32`) fetches JSON, not a tool.
- **Hooks:** `simple-git-hooks` runs `pnpm lint-staged`, which is an npm dependency.
- **Scripts:** `scripts/` holds `docs-check.sh` (git and grep only), `release.ts` and `verifyCommit.mjs`. None installs anything.
- **Edge cases:** `pnpx changelogithub` in `release.yml:156` is an unpinned npm fetch, and pnpm itself comes from `packageManager`. Both fall under ADR-0020 and the runtime, which this ADR excludes.
- **Updates:** `renovate.json` extends `github>posva/renovate-config`, so Renovate is already the updater, not Dependabot.

**The condition the ADR sets.** It says "`none` is an answer only when no accepted ADR names such a tool." Only ADR-0001 has `status: accepted`; ADR-0002 to ADR-0026 are all `proposed`. The ADRs that would name tools are still proposed:
- ADR-0015 `secrets.guard` (recommends gitleaks)
- ADR-0011 `forge.audit` (recommends zizmor)
- ADR-0019 `vulnerabilities.scanner` (recommends grype)

So the condition holds, and `none` is a valid answer today.

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager`: `none`** (**observed**). No tool lives outside pnpm or the actions, and no accepted ADR names one, as shown above.

**One departure from the recommendation.** The recommendation is `script` for one tool, or `mise`/`aqua` for several. Both assume at least one tool is named, and none is. Ruling `script` or `mise` would set up a pinning mechanism with nothing to pin.

This ruling enforces its own review. The ADR says the check "with `none`, … fails when a tool is listed". So as soon as ADR-0015 or ADR-0011 is accepted with a tool, `ontrack check` fails until this ADR is superseded with `script` or `mise`.

**What keeps the pins current (rule 4):** nothing, because there are no pins. I'd write that down explicitly. I'd also note that Renovate, already set up here, has a `mise` manager that also updates `mise.lock`. That makes `mise` the natural follow-up if two or three of gitleaks, zizmor and grype get adopted.

**Rest of the file:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`
- the Consequences lists rewritten for `none`
- the "How to rule" block deleted
- the `check:` line kept

The other option is to rule `mise` now, expecting the three tools above. I don't recommend it, because it depends on decisions that haven't been made.

**Do you agree with `accepted` and `tools.manager: none`, with yourself as the author? Or would you rather rule `mise` or `script` now?** Once you answer, I'll edit the ADR and run `npx -p @trivoallan/ontrack ontrack apply`, which will also need your approval.