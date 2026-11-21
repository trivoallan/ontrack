=================== conventional-changelog__commitlint ADR-0002
**ADR-0002 (Localization): my proposed ruling**

I found nothing in the repository that argues against the recommendation. Everything here is in English and contributors come from many countries.

**Status:** `accepted`

**Traits:**
- `localization.language.default: english`. All docs in `docs/` (guides, concepts, reference, api, support) are in English. I searched every Markdown file outside `docs/adr/` for common French words and found none. The last 300 commit subjects are English Conventional Commits, apart from release tags such as `v21.2.4`. The authors are spread internationally: `renovate[bot]`, escapedcat, Chinmay Jha, Dylan Pulver, yash and others.
- `documentation`, `commits`, `code`, `comments`: left empty, so they use `default`. Nothing in the repository uses a different language for any of them.

**Departures from the recommendation:** none. In the ADR, I'll replace the "How to rule" block with one line saying the recommendation is adopted as is.

**One question before I write anything:**

Do you agree to rule ADR-0002 `accepted` with `default: english` and no overrides? If so, what should go in `authors:`? I'd suggest "Tristan Rivoallan", from git config. `date:` would be 2026-11-15.

Once you agree, I'll do these things in this one file: fill the traits, set the status, date and authors, rewrite the Consequences for this repository and remove the instruction block. Then I'll run `npx ontrack apply`. I won't touch any other ADR.

I'm leaving the tracker step for later. Most other ADRs are still undecided, including ADR-0014, the one that sets the `tracking` trait, so there's no tracker to check yet.
=================== conventional-changelog__commitlint ADR-0004
I've checked the repository and have a proposed ruling for ADR-0004 (Languages). The recommendation applies here as written, with no departures.

**Proposed ruling: `accepted`**

| Trait key | Proposed value | Evidence |
| --- | --- | --- |
| `languages.main.name` | `TypeScript` | 213 tracked `.ts` files, 204 of them under package `src/` folders (for example `@commitlint/core/src/core.ts`). The shared strict compiler config is in `tsconfig.shared.json` and `vitest.config.ts` is TypeScript. There are no Python, Go or Rust files. |

**Checks against the recommendation:**
- **TypeScript or Python?** The ADR says to pick TypeScript when code runs in a browser or is shared between browser and server. Neither holds here: commitlint is a Node CLI and library (`"types": ["node"]` in `tsconfig.shared.json`). Strictly, the ADR's tie-break leans Python. But the repository is already written in TypeScript, so TypeScript is the only answer that matches the code, and it is one of the two recommended languages.
- **The JavaScript files** (171) don't change the answer. Most of them are test fixtures, mainly sample `commitlint.config.js` and `.commitlintrc.js` files under `@commitlint/load/fixtures` and `@commitlint/read`, plus a few small scripts. The ADR says secondary languages don't change the main one.
- **No evidence against the recommendation**, so there's nothing to reject.

The project instructions say to run `npx ontrack review trivoallan/ADR-0004` for ADR reviews. That command was blocked waiting for permission, so its output isn't part of this proposal. If you approve it, I'll run it before writing anything.

Once you agree, I'll do all of this in a single edit of this one ADR file:
- Set `languages.main.name: TypeScript` and `status: accepted`.
- Set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`.
- Rewrite the Consequences lists for this decision.
- Replace the how-to-rule block with one line saying the recommendation is adopted as is.
- Run `npx ontrack apply` to update AGENTS.md.

The tracking items you described come only after every ADR is ruled. Most are still `proposed`, and the `tracking` trait isn't decided yet, so I won't create any.

**Do you agree with ruling `accepted` with `languages.main.name: TypeScript`?** And may I run `npx ontrack review` first?
=================== conventional-changelog__commitlint ADR-0006
I'm proposing **`accepted`** for ADR-0006 (Commits). I've written nothing yet; the ruling waits for your agreement.

**Does the recommendation apply here?** Yes. Versions here come from commit messages: the `publish` script at `package.json:43` runs `lerna publish --conventional-commits`. So commitlint, the tool the ADR recommends, fits, and this repository already runs it in CI.

**Proposed ruling**

- `status: accepted`
- `commits.tool: commitlint`
  - It runs in CI: `.github/workflows/commitlint.yml` checks the commits of every pull request and every push to master.
  - It also runs locally: `.husky/commit-msg` calls `@commitlint/cli --edit`.
  - Its configuration is the `commitlint` key in `package.json`, which extends `@commitlint/config-conventional` and `@commitlint/config-workspace-scopes`.
- `commits.scopes`: one scope per workspace package, with the `@commitlint/` prefix dropped, plus `container`:
  `[cli, config-angular, config-angular-type-enum, config-conventional, config-lerna-scopes, config-nx-scopes, config-patternplate, config-pnpm-scopes, config-rush-scopes, config-validator, config-workspace-scopes, core, cz-commitlint, ensure, execute-rule, format, is-ignored, lint, load, message, parse, prompt, prompt-cli, read, resolve-extends, rules, to-lines, top-level, travis-cli, types, commitlint, commitlint-config-angular, commitlint-config-lerna-scopes, commitlint-config-nx-scopes, commitlint-config-patternplate, test, utils, vitest-environment-commitlint, container]`
  - **Packages:** the list follows the workspace globs in `pnpm-workspace.yaml` (`@commitlint/*`, `@alias/*`, `@packages/*`). That is the same rule `@commitlint/config-workspace-scopes` applies. `.github/CONTRIBUTING.md:66` asks for `$type($scope): $message`.
  - **History:** the scopes in the last 300 commits are almost all package names (`load` 6, `rules` 5, `lint` 5, …).
  - **`container`:** I added it because it covers `Dockerfile.ci` and `container-build.yml` and is still in use: `fix(container): …` on 2026-08-03. It is the one scope here that is not a package.
  - **Left out:** `deps` was last used in May 2025 by the old dependabot commits. Renovate now writes `chore: update …` without a scope. `issue-template`, `docs` and `ci` each appear only once.
  - **Why not `[]`:** with `[]`, the ontrack check would refuse every scope, and nearly all scoped commits here use one.

**Departures from the recommendation**

- **Tool:** none; the ADR recommends `commitlint` and I'm keeping it.
- **Scopes:** the ADR recommends no scopes, so the list above is the repository's own choice, with its reasons.

Separately, this probably needs fixing later. `config-workspace-scopes` reads the `workspaces` key of `package.json`, and the root `package.json` has none (pnpm keeps the list in `pnpm-workspace.yaml`). So the scope rule gets an empty list, and an empty list lets any scope through. I didn't run commitlint to confirm it, because running it needed your approval. I'll come back to this when I list the rulings the repository does not follow yet.

Do you agree with this ruling? You can also change something: drop `container`, add `deps`, or another change.
=================== conventional-changelog__commitlint ADR-0009
Here is my proposed ruling for ADR-0009 (Branching). Nothing is written yet.

**Status: `accepted`**

The repository already works this way. I found nothing showing that the recommended model or merge method doesn't apply here, but I'm proposing a longer prefix list than the recommended one.

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` (as recommended) | `CI.yml:16` runs on `merge_group` and pull requests. There is no `develop` branch among the 40 remote branches. Changes arrive as short `type/…` branches, each with its own PR. |
| `branching.merge` | `squash` (as recommended) | AGENTS.md says "The merge queue squashes, so the pull request title becomes the commit on master." 197 of the last 200 commits end in `(#NNNN)`, and there are no merge commits in the last 500. |
| `branching.prefixes` | `[feat, fix, perf, refactor, docs, test, ci, build, chore]` (departs from `[feat, fix, docs]`) | The current remote branches already use `chore/` (9), `ci/` (3), `docs/` (3), `refactor/` (2), `test/` (2), `feat/` and `fix/`. AGENTS.md "Commit type" lists exactly these nine types for this repo. All nine are among the ADR's eleven allowed types. |

**Departure from the recommendation:**
- **Prefixes:** `[feat, fix, docs]` would make existing practice fail the branch check. `chore/` is the most common prefix here (dependency work is `chore` by AGENTS.md), and `ci/`, `refactor/` and `test/` are in use too. I'm proposing the nine types AGENTS.md already defines, so the branch prefixes match the commit types this repo uses. `style` and `revert` are left out because AGENTS.md doesn't list them.

**Things to know before you agree. They don't change the ruling:**
- Branches named by tools fail the check until other ADRs are ruled. `renovate/*` branches pass only once ADR-0018 (Dependencies) names Renovate. The Renovate config isn't in the repo, so it's probably a hosted preset. `copilot/*` branches, such as `origin/copilot/fix-failing-github-actions-job`, aren't covered by any ADR and would fail.
- Old maintenance branches (`8.x`–`15.x`, `release-v18`) and the manual `lerna publish` with a `next` dist-tag are occasional patch-release branches. There is no `develop` branch, so this isn't gitflow.
- I'll fill `authors:` with "Tristan Rivoallan", from git config, unless you name someone else. `date:` will be 2026-11-15.

Do you agree with this ruling (accepted, `github-flow`, `squash`, the nine prefixes)? Or would you rather keep the recommended `[feat, fix, docs]`, or change something else?
=================== conventional-changelog__commitlint ADR-0011
I've read the ADR and the five workflows, and I have a ruling to propose. I haven't written anything yet.

**Is the recommendation wrong for this repository?** No evidence says so. The forge is GitHub (`git remote -v` → `github.com/conventional-changelog/commitlint`), and `.github/workflows/` has five workflows, so neither `rejected` nor `none` fits.

**Proposed ruling: `status: accepted`**, adopting the recommendation as is.

| Key | Value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` | `.github/workflows/CI.yml:12-15` runs on `merge_group` "to run the required checks on the exact merge result the merge queue is about to land on master". `AGENTS.md` also says "The merge queue squashes". So CI checks are already required before a merge. I couldn't read the ruleset itself: the `gh api …/rules/branches/master` call was held for approval, so I didn't run it. |
| `forge.audit` | `zizmor` | Nothing reads the workflows today. No `zizmor` or `actionlint` appears anywhere outside `docs/adr/`. The workflows have the kind of findings zizmor flags: actions pinned by movable tag (`actions/checkout@v7`, `pnpm/action-setup@v6`, …). There's also a template expanded into `run:` (`commitlint.yml`, `${{ github.event.pull_request.base.sha }}`) and no `permissions:` block in `CI.yml` or `container-build.yml`. |

**Departures from the recommendation:** none.

**Some things won't pass once this is accepted.** They'll be tracking items once every ADR is ruled, not reasons to change the ruling:
- `forge.audit: zizmor`: there is no zizmor job. Most actions are pinned by tag; only the `docker/*` actions in `container-build.yml` are pinned by SHA. Running `ontrack check` will fail until that's fixed.
- `audit.yml` runs on `ubuntu-latest`. It's a runner label, not an image, so rule 3 doesn't strictly cover it, but reviewers may want to note it.
- `authors:` will be your name, `date:` 2026-11-15.

Do you agree with this ruling (`accepted`, `forge.gate: blocking`, `forge.audit: zizmor`, no departures)? If you do, I'll fill the traits, status, date and authors. I'll rewrite the Consequences, replace the how-to-rule block with a line saying the recommendation was adopted as is, and run `npx ontrack apply`. If you'd like the ruleset checked first, I can run the `gh api` call once you approve it.
=================== conventional-changelog__commitlint ADR-0023
I don't have a question tool here, so I'm asking you directly:

**Do you agree to rule ADR-0023 `accepted` with `license.spdx: MIT`, and `authors: [Tristan Rivoallan]`?** Tell me if you want a different value or other authors. I won't write anything until you answer.
=================== conventional-changelog__commitlint ADR-0025
Here's my proposed ruling for ADR-0025. I haven't changed anything yet.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `tools.manager` | `mise` | The repo already uses mise. `.mise.toml` pins `node = "22"` and `pnpm = "12"`, and `.github/CONTRIBUTING.md:85`, `:150` and `:177` tell contributors to run `mise install`. Renovate is set up in `package.json` with `config:recommended` and doesn't limit which managers run, so its `mise` manager is on. Commit `43639e8d` (pnpm v12) shows Renovate already moving pins in `.mise.toml`. |

**The ADR's recommendation is conditional.** It says `script` for one tool, and `mise` or `aqua` for several. Counting the tools:
- **Today there are none.** Only ADR-0001 is accepted, so no accepted ADR names a tool yet. That means `none` would also be a valid answer right now (ADR line 68).
- **Once the related ADRs are ruled, there would be two or three.** ADR-0015 recommends `secrets.guard: gitleaks`, ADR-0011 recommends `forge.audit: zizmor`, and ADR-0019 recommends `grype` for scanning locally. More than one tool means the recommendation is mise or aqua. I picked mise because the repo already uses it and Renovate already updates it.

**Departure from the recommendation:** none, as long as those ADRs follow their recommendations. I'm choosing `mise` over `none` because `none` would have to be ruled again as soon as ADR-0015 or ADR-0011 is accepted. I'll write that reason into the ADR.

**What keeps the pins current (rule 4):** Renovate's `mise` manager. It proposes each version bump and updates `mise.lock` in the same pull request.

**Not yet followed** (these go in the tracking list once every ADR is ruled; I won't fix them here):
- There's no `mise.lock`, and `.mise.toml` doesn't set `lockfile = true`. Without these, nothing records a checksum.
- CI doesn't use mise. The workflows install tools with `pnpm/action-setup` and `actions/setup-node`, so mise's own version isn't pinned anywhere (rule 3).
- The tools ADR-0015 and ADR-0011 would name aren't in `.mise.toml`. Your machine has `gitleaks` from Homebrew, which is the setup rule 2 rules out, and `zizmor` isn't installed.

If you agree, I'll do the following in the ADR, in one change:
- set `tools.manager: mise` and `status: accepted`;
- fill `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences lists;
- replace the how-to-rule block with the rule 4 statement and the reason for choosing `mise` over `none`.

Then I'll run `npx ontrack apply`.

**Do you agree with `mise`?** Or would you prefer `none` for now, and rule again once ADR-0015 and ADR-0011 are decided?
