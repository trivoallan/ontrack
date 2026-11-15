=================== eslint__eslint ADR-0002
Here's my proposed ruling for ADR-0002 (Localization). I found nothing in the repository that argues against the recommendation.

**Status:** `accepted`, with the recommendation unchanged.

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | The only docs site config is `docs/src/_data/sites/en.yml` (`locale: en-US`). Recent commit subjects are English Conventional Commits (`fix: …`, `docs: …`), as `AGENTS.md` requires. Code and comments across `lib/` are in English. |
| `documentation` | empty (follows `default`) | The Japanese, French and Chinese sites listed in `docs/src/_data/languages.json` are hosted elsewhere (ja/fr/cn.eslint.org). This repository only holds the English source. |
| `commits` | empty (follows `default`) | Commit subjects are English, and the PR title becomes the changelog entry. |
| `code` | empty (follows `default`) | Identifiers are English everywhere. |
| `comments` | empty (follows `default`) | JSDoc and `@fileoverview` headers are English. |

**Departures from the recommendation:** none. The ADR's "why" section would become one line saying the recommendation was adopted as is.

When we write it, I'd also fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences lists, delete the how-to-rule block, and run `npx ontrack apply`. One correction to the Consequences: the current "Negative" points are about a French-speaking team. Those don't fit an English-language project with outside translation sites.

Do you agree with this ruling, and should I record it with you as the author? I won't write anything until you confirm.
=================== eslint__eslint ADR-0004
I'm proposing a ruling for ADR-0004 (Languages) and need your approval before I change anything.

## Proposed ruling: `accepted`, with `languages.main.name: JavaScript`

The ADR recommends Python or TypeScript, and this repository is neither. It is written in plain JavaScript:

- **Module format:** `package.json:6` sets `"type": "commonjs"`, and AGENTS.md says "CommonJS".
- **Source files:** `lib/` holds 389 `.js` files. Its only TypeScript files are the 5 hand-written type declaration files in `lib/types/`. `package.json:11-30` points `types` at those files.
- **TypeScript's role:** it is a dev dependency (`package.json:219`). It is only used by `npm run test:types`, which runs `tsc` against `tests/lib/types` to check the published types. No source code is written in it.

**Trait value**

- `languages.main.name: JavaScript`. Evidence: the points above.

**Departure from the recommendation, and why** (this text goes into the ADR in place of the "How to rule" block)

> We depart from the recommendation (`Python` or `TypeScript`) and keep JavaScript. ESLint is a JavaScript linter written in CommonJS JavaScript: 389 source files in `lib/`, published to npm as plain `.js`, with no build step. Public types are hand-written `.d.ts` files in `lib/types/`, checked by `npm run test:types`. Moving to TypeScript would mean rewriting the whole codebase and adding a compile step to a package that a large plugin ecosystem relies on. The two recommended languages offer nothing that would justify that. New code is written in JavaScript. Type declarations stay in `lib/types/*.d.ts`.

`rejected` doesn't fit, because the repository clearly has one main language. If you agree, I'll also set the Consequences to say:

- **Positive:** agents write CommonJS JavaScript, matching existing code.
- **Negative:** the `zod`/`pydantic` recommendations in ADR-0005 and ADR-0007 don't apply directly, and types have to be kept up to date by hand in `.d.ts` files.
- **Neutral:** TypeScript stays in the repo for type-declaration tests only.

**Do you agree?** Please answer with:

1. **Yes, accept as proposed.** I'll also need the name(s) to put in `authors:`. The date will be 2026-11-15.
2. **Accept with a different value or wording.** Tell me what to change.
3. **No.** Tell me what to do instead.

I'll edit the ADR and run `npx ontrack apply` only after you answer. The list of rulings the repo doesn't follow yet, and any tracker items, come later, once every ADR is ruled; 25 are still proposed.
=================== eslint__eslint ADR-0006
No question tool is available here, so I'll ask directly:

**Which ruling should I write into `ADR-0006`?**
1. **`accepted` with `scopes: []` and `tool: commitlint`.** This follows the recommendation.
2. **`accepted` with `scopes: []` and `tool: none`.** This departs from the recommendation; I'd record the outside PR-title check as the reason.
3. **Something else.**

Also, who should I list as `authors:`, and should `date:` be 2026-11-15? I'll write nothing until you answer.
=================== eslint__eslint ADR-0009
## Proposed ruling: ADR-0009 Branching. Status `accepted`

I found nothing in the repository showing the question doesn't apply. The recommended model and merge strategy match how eslint already works. The only change I'd make is to widen the prefix list.

**Traits**

- **`branching.model: github-flow`**: changes reach `main` through one pull request per change. CI runs on pull requests to `main` (`.github/workflows/ci.yml:4-6`). The contributor guide says to use a separate branch for each issue (`docs/src/contribute/pull-requests.md:50`). The last 20 first-parent commits on `main` are all `(#NNNNN)` PR commits, apart from the release commits (`10.15.0`, `Build: changelog update`). The old `v8.x`/`v9.x` maintenance branches exist, but there is no `develop` or `release/*` branch, so this isn't gitflow.
- **`branching.merge: squash`**: `docs/src/contribute/pull-requests.md:153` says "When a pull request is merged, its commits will be squashed into one single commit." The history on `main` matches that.
- **`branching.prefixes: [feat, fix, docs, chore, ci, test, refactor, perf]`**: these are the commit types `main` actually uses. Counted over the last 500 first-parent commits: chore 122, docs 111, fix 86, test 47, feat 42, ci 40, refactor 7, perf 3. Existing remote branches already use `feat/` (11), `fix/` (6), `chore/` (3), `docs/` (2), `ci/` and `perf/` (1 each).

**Departure from the recommendation**

- **Prefixes widened from `[feat, fix, docs]`**: `chore` is this repository's most common commit type (122 of the last 500), and `ci`, `test`, `refactor` and `perf` are used regularly. With only three prefixes, most of the changes eslint ships would have no branch name that fits. All eight values come from the eleven allowed commit types, so nothing new is invented.

**Points to weigh before agreeing (they don't change the values)**

- **The check will reject the branch names eslint's own guide recommends.** The guide suggests `issue1234` (`pull-requests.md:45`), and many remote branches use that style (`issue19118`, `issue18385`, …). On a pull request, the check reads the fork's branch name from `GITHUB_HEAD_REF`, so pull requests from outside contributors would fail unless the guide is also changed.
- **Some bot branches will fail the check until other ADRs are ruled.** `update-ecosystem-plugins-<timestamp>` (`ecosystem-updates.yml:29`) and the `copilot/` branches (6 on the remote) don't match any prefix, and neither ADR-0012 nor ADR-0018 names them. ADR-0012 and ADR-0018 are still `proposed`, so for now `renovate/` and `dependabot/` branches fail the check too.

The tracking-item step doesn't apply yet: every other ADR is still `proposed`, and no `tracking` trait has been decided.

**Do you agree with this ruling?** If you don't, tell me which values to change, for example keeping `[feat, fix, docs]` as recommended. Once you agree, I'll fill in the traits, set the status, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, rewrite the Consequences section, replace the how-to-rule block with the reason for the change, and run `npx ontrack apply`.
=================== eslint__eslint ADR-0011
I've read the ADR and checked the workflows. Here is the ruling I propose.

## Proposed ruling: ADR-0011 Forge and continuous integration → `accepted`

The recommendation applies here as written. I found nothing that argues against it. The forge is GitHub: `origin` is `github.com/eslint/eslint` and there are 10 workflows in `.github/workflows/`. So `rejected` doesn't apply.

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `docs/src/maintain/review-pull-requests.md:94` says "never merge a pull request with failing tests". `ci.yml` runs on `pull_request` to `main` (`ci.yml:5`). I couldn't confirm that a ruleset requires these checks: the `gh api repos/eslint/eslint/rules/branches/main` call needed your approval and didn't run. |
| `forge.audit` | `zizmor` | Today only actionlint reads the workflows (`ci.yml:26-27`), and the ADR says that isn't enough. Some workflow choices are exactly what zizmor flags: most actions use movable tags (`actions/checkout@v7`, `github/codeql-action/*@v4.39.3`, `eslint/workflows/...@main`), and `pr-labeler.yml:2` uses `pull_request_target`. |

**Departures from the recommendation:** none.

**What follows if you accept:**
- `ontrack check` will fail on `forge.audit` until the workflows are fixed. All actions need SHA pins, and `pull_request_target` needs either a fix or an inline ignore with its reason. The labeler is safe as it stands: it checks out nothing and runs no code from the PR.
- A zizmor job needs adding to CI.
- `forge.gate: blocking` only takes effect through a GitHub ruleset, and nothing in this repo can verify one exists.

I'll list the rulings the repo doesn't follow yet once every ADR is ruled. For now, `tracking` (ADR-0014) is still undecided.

Do you agree with `accepted`, `forge.gate: blocking` and `forge.audit: zizmor`? I'd also need the author name(s) for `authors:`. Is "Tristan Rivoallan" right?
=================== eslint__eslint ADR-0023
I'm proposing **`accepted`** for [trivoallan/ADR-0023] License, with `license.spdx` set to `MIT`. That is the ADR's recommendation, and nothing in the repository argues against it.

**Evidence**
- `LICENSE` at the root holds the MIT text, with the copyright line "Copyright OpenJS Foundation and other contributors, <www.openjsf.org>".
- The root manifest declares the same licence: `package.json:240` has `"license": "MIT"`.
- The other manifests in subfolders agree: `packages/js/package.json:32`, `packages/eslint-config-eslint/package.json:90` and `docs/package.json:8` all say MIT. The check doesn't look at these, but none of them contradicts the ruling.
- The ADR also requires that the copyright holder be the organisation that owns the repository. The OpenJS Foundation line meets that, so nothing needs changing.

**Departures from the recommendation:** none. The ADR will say in one line that it adopts the recommendation as is.

**What I'd write once you agree**
- `traits.license.spdx: MIT`
- `status: accepted`
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, taken from the git user name. Tell me if other people took part in the decision.
- Consequences rewritten for MIT on ESLint.
- The "How to rule" block deleted.
- Then I'd run `npx ontrack apply` to update AGENTS.md.

I can't check yet which rulings the repository doesn't follow, because most of the other ADRs, including ADR-0014 (Work tracking), are still `proposed`. That list comes once every ADR is ruled.

**Do you agree with this ruling (`accepted`, `license.spdx: MIT`), and should the authors be `[Tristan Rivoallan]`?** I won't write anything until you answer.
=================== eslint__eslint ADR-0025
## Proposed ruling for [trivoallan/ADR-0025] Tools outside the package manager

**Status:** `accepted`

| Key | Proposed value | Evidence |
| --- | --- | --- |
| `tools.manager` | `script` | The repo uses one tool outside npm: actionlint, installed in CI with `go install github.com/rhysd/actionlint/cmd/actionlint@v1.7.10` (`.github/workflows/ci.yml:26`). There is no `mise.toml`, `.tool-versions`, `aqua.yaml` or other tool manager, and no hook or script that installs actionlint on a workstation. For one tool, the ADR recommends `script`. |

**Departures from the recommendation:** none. Three things to weigh before you agree:

1. **Is `none` allowed right now?** Yes. The ADR says `none` is valid only when no accepted ADR names such a tool, and that's true today. Only ADR-0001 is accepted (every other ADR still has `status: proposed` on line 5). I'm still proposing `script` because actionlint really is in use, and today it only runs on the runner. That's the gap the ADR was written to close. With `none`, this ruling would break as soon as ADR-0011 or ADR-0015 is accepted.
2. **The count may rise soon.** ADR-0011 recommends `forge.audit: zizmor` (`ADR-0011-forge-and-ci.md:69`) and ADR-0015 recommends `secrets.guard: gitleaks` (`ADR-0015-secrets.md:83`). If both are accepted as recommended, the repo will have three tools. The ADR then recommends `mise`, so this ruling would have to be superseded. If you plan to accept those two, ruling `mise` now saves that step.
3. **Rule 4, who moves the pins.** With `script`, this would be a person, since Dependabot doesn't cover these tools. The version and the checksum must move in the same pull request. Following the rules also means the CI step must call the script, not carry its own `@v1.7.10`.

Do you agree with `tools.manager: script`, or would you rather rule `none` or `mise`? Please also give the name(s) for `authors:`. I'll write nothing until you answer.

The tracking-item step comes after every ADR is ruled. It will need a decided `tracking` trait, and ADR-0014 is still `proposed`, so for now I'd give that list here in the reply and create no items.
