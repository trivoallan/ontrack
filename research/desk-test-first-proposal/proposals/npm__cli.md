=================== npm__cli ADR-0002
I couldn't run `npx ontrack review trivoallan/ADR-0002-localization`, which AGENTS.md asks for, because it needs your approval. So I reviewed the ADR by hand, following its own "How to rule" steps.

**Recommendation:** use English everywhere, with no overrides. I found nothing in this repository that argues against it:
- **Commits:** the last 30 commit subjects are all in English and follow the Conventional Commits format (`fix(arborist): …`, `deps: …`, `chore: …`).
- **Documentation:** the docs under `docs/lib/content` contain no French accented characters. `README.md` and `CONTRIBUTING` are in English.
- **Code and comments:** this is npm's own CLI. Its symbols and comments are in English, and anyone in the world may read it.

## Proposed ruling

- **status:** `accepted`
- `localization.language.default`: `english`, based on the commit history, the docs and the codebase above
- `documentation`, `commits`, `code`, `comments`: left empty, so each one uses `default`, with nothing pointing to another language
- **Departures from the recommendation:** none

If you agree, I'll do the following, all in this one file:
1. Fill the traits.
2. Set the status, `date: 2026-11-15` and `authors: [Tristan Rivoallan]`.
3. Rewrite the Consequences section for this repository. One example: the current "French-speaking maintainer" point doesn't fit an English-language project.
4. Replace the "How to rule" block with one line saying the recommendation is adopted as is.
5. Run `npx ontrack apply`.

**Do you agree with this ruling, or do you want to change something, such as the authors list?**

Once you rule, I'll also check whether the repository already follows it. Since the commits, docs and code are all in English, I expect no gaps. No `tracking` trait is decided yet, so I'd list any gaps here rather than create tracker items.
=================== npm__cli ADR-0004
I've gathered the evidence, and here is the proposed ruling. One note first: I couldn't run `npx ontrack review trivoallan/ADR-0004-languages` because it needs your approval. So this review follows the ADR's own "How to rule" steps.

## Proposed ruling: ADR-0004 Languages

**Status:** `accepted`, departing from the recommendation.

**Trait:**
- `languages.main.name`: **`JavaScript`**
  - Evidence: 1,642 tracked `.js`/`.cjs`/`.mjs` files.
  - There's no `tsconfig*.json` anywhere in the repo.
  - The only tracked TypeScript files are 4 `.d.cts`/`.d.mts` files, all vendored under `node_modules/tinyglobby`.
  - The 58 Python files are all vendored under `node_modules/node-gyp/gyp`.
  - `package.json` declares `"main": "./index.js"` and `engines.node` `^22.22.2 || ^24.15.0 || >=26.0.0`, and runs its tests with `tap` on plain JS.

**Departure from the recommendation:** the ADR recommends Python or TypeScript; this ruling picks JavaScript. Reasons, to be written into the ADR:
- **Ecosystem the repository depends on:** this is the npm CLI. It ships inside every Node.js distribution and runs directly on Node with no build step.
- **No build step:** moving to TypeScript would add a compile and publish step to a tool that Node bundles as-is. It would also mean rewriting about 1,600 existing source files.
- **Python doesn't fit:** a Node package manager can't be written in Python.

**Consequences:** I would rewrite them for this verdict:
- **Positive:** agents keep writing CommonJS JavaScript to match the existing code.
- **Negative:** there's no static typing, and the `zod` recommendation in ADR-0005 applies only loosely.
- **Neutral:** the vendored TypeScript declarations and the Python inside `node-gyp` don't change the answer.

`date:` would be 2026-11-15. For `authors:`, I'd use `[Tristan Rivoallan]` unless you tell me otherwise.

---

**Do you agree with this ruling (`accepted`, `languages.main.name: JavaScript`)?** If you'd rather use a different value, such as `TypeScript` as a goal, or different authors, tell me. I won't write anything until you confirm.

After I apply it, I still need approval to run `npx ontrack apply`. The follow-up list of rulings the repo doesn't follow yet waits until every ADR is ruled. 25 are still undecided, including `tracking`.
=================== npm__cli ADR-0006
I don't have a question tool here, so please answer in a reply:

1. **Status:** accept as `accepted` with `tool: commitlint`?
2. **Scopes:** (a) the 18-word list above, (b) that list plus every npm command name, or (c) a list of your own?
3. **Authors:** which names should go in `authors:`? The date will be 2026-11-15.

I won't write anything until you agree.
=================== npm__cli ADR-0009
I found nothing here that argues against the recommendation, so I suggest accepting it. The one change I'd make is adding `chore` to the branch prefixes.

**Proposed ruling: `accepted`**

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | There is one default branch, `latest`. It is what `origin/HEAD` points to and has no `develop` branch. Work goes in through pull requests on short-lived branches (`fix/9486-git-tag-update`, `feat/ado-oidc`). `.github/workflows/pull-request.yml` lints each PR against `github.base_ref`. |
| `branching.merge` | `squash` | Since 2024-01-01 there are no merge commits among 1,403 commits on `latest`. 501 of them end in `(#NNNN)`, for example `fix(unpublish): … (#10117)`, which is the squash-merge shape. |
| `branching.prefixes` | `[feat, fix, docs, chore]` | The last 300 commits are mostly `fix` (109+7 breaking), `deps` (95), `chore` (44), `feat` (26+6) and `docs` (12). `release-please-config.json` lists the same types as changelog sections. Remote branches already use `fix/` and `feat/`. |

**Departures from the recommendation**
- **`chore` added to the prefixes.** 44 of the last 300 commits are chores (CI, release and tooling work, such as `chore: migrate Cygwin installer`). Without the prefix, those branches would have to be named `fix/` or `feat/`, which would be wrong. `chore` is one of the eleven allowed commit types.
- **`deps` is not a prefix, even though it is the second most common commit type.** It is not one of the eleven types, and the ADR forbids adding a twelfth. Dependency bumps are mostly made by bots on `dependabot/` branches, which the check skips. Hand-made bumps would go on `chore/` branches.

**Notes for you (not departures)**
- **Maintenance branches.** `release/v6` to `release/v11` and the `backport.yml` workflow show that this repo keeps maintenance lines. That is still github-flow on `latest`, with backports cherry-picked onto those lines. It is not gitflow, because there is no `develop` branch and no per-release integration branch.
- **Some branches will fail the name check.** These are the `backport/v11/NNNN` branches the workflow opens, and personal branches like `reggi/…` and `nkolev92/…`. The check skips only `release-please--`, `releaser-pleaser--`, `dependabot/` and `renovate/` branches. This repo uses release-please, so ADR-0012 and ADR-0018 should be ruled alongside this one. The backport branches would still fail unless they are renamed (for example `fix/backport-v11-NNNN`) or the check is kept out of CI for them.

If you agree, I'll fill the traits, set the status to `accepted`, and set `date: 2026-11-15`. I'll also rewrite the Consequences section, replace the "How to rule" block with the reason for the `chore` prefix, and run `npx ontrack apply`.

Do you agree with this ruling? Please also tell me the name(s) to put in `authors:`, for example "Tristan Rivoallan".
=================== npm__cli ADR-0011
I've read ADR-0011 and checked the repository's workflows. I couldn't run `npx ontrack review` or `gh api` for the branch protection because both need your approval, so the ruling below rests on the files in the repo. Here it is for your decision.

## Proposed ruling: `trivoallan/ADR-0011` Forge and continuous integration

**Status: `accepted`.** The ADR allows `rejected` only for a forge other than GitHub. This repository is on GitHub (`git remote -v` → `origin https://github.com/npm/cli.git`), and it has 26 workflows in `.github/workflows/`. So `rejected` doesn't fit, and neither does `forge.gate: none`.

| Trait | Proposed value | Evidence |
| --- | --- | --- |
| `forge.gate` | `blocking` (as recommended) | `ci.yml`, `ci-*.yml`, `audit.yml` and `pull-request.yml` run on pull requests for every workspace. `.github/actions/create-check/` exists to post check results that are meant to gate the merge. I couldn't confirm a ruleset on `latest` because the `gh api repos/npm/cli/branches/latest` call wasn't approved. As the ADR says, the value states the intent and the ruleset makes it real. |
| `forge.audit` | `zizmor` (as recommended) | Nothing reads the workflows today: no zizmor or actionlint anywhere under `.github/`. The workflows are generated by a tool (`# This file is automatically added by @npmcli/template-oss. Do not edit.`), not written and read by a person, so the ADR's condition for `none` doesn't hold. |

**Departures from the recommendation:** none. I found nothing in the repository that rules the recommendation out.

**What you'd be signing up for:**
- **Actions aren't pinned by SHA.** They use tags, for example `ci.yml:41` `uses: actions/checkout@v6`. With `forge.audit: zizmor`, the check will fail on `unpinned-uses` across all 26 workflows until they're pinned.
- **The fix has to go upstream.** The workflows come from `@npmcli/template-oss` and are marked "Do not edit", so pinning and the zizmor job belong in that template, not in hand edits here.

If you'd rather not take on that work yet, `forge.audit: none` is the other option. It would count as a departure, with "the workflows are generated by template-oss" written as its reason.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** If you do, I'll also need:
- the names of the people who decided, for `authors:`;
- whether to use today's date, 2026-11-15.

I'll then fill the frontmatter, rewrite Consequences, replace the how-to-rule block with a line saying the recommendation is adopted as is, and run `npx ontrack apply`. Nothing is written until you say so.

One more thing: 25 other ADRs are still `proposed`, so the list of rulings the repo doesn't follow yet isn't due. No `tracking` trait is decided either, so I wouldn't create tracker items in any case.
=================== npm__cli ADR-0023
I'm proposing **`accepted`, with `license.spdx: Artistic-2.0`** instead of the recommended `MIT`. The repository already answers this question.

**Evidence against the recommendation:**
- `package.json:264` has `"license": "Artistic-2.0"`.
- The `LICENSE` file is committed at the root. It says "Copyright (c) npm, Inc. and Contributors" and "Licensed on the terms of The Artistic License 2.0", followed by the full text (line 32).
- There is no `pyproject.toml`, so `package.json` is the only root manifest the check reads.

**The ADR's conditions:**
- **The value is declared in the root manifest:** yes, it is `Artistic-2.0`.
- **A licence file is committed at the root:** yes, `git ls-files LICENSE` lists it.
- **The copyright holder is the owning organisation:** it is npm, Inc. and Contributors, as `LICENSE` says. Nothing needs writing.

**Proposed ruling:**
- `status: accepted`
- `license.spdx: Artistic-2.0`, from `package.json:264` and the root `LICENSE`.
- **Departure from the recommendation (`MIT`):** npm has shipped under Artistic-2.0 since long before this ADR. A licence change would only bind new versions, and it would need the agreement of npm, Inc. and the contributors who hold copyright. So the ruling records the licence the project already uses.
- **Something you should know:** the 12 packages under `workspaces/*` say `"license": "ISC"` in their manifests and have their own `LICENSE` files. The ADR's check doesn't read subfolder manifests, so this passes. I'd record it in the ADR as a deliberate exception: each library package keeps its own ISC licence, and `license.spdx` covers the root package.
- `date: 2026-11-15`. For `authors:` I'd use `[Tristan Rivoallan]`, the git user, unless you name other people.

Do you agree with this ruling, including the ISC note and the authors value? Once you confirm, I'll update the ADR and run `npx ontrack apply`.
=================== npm__cli ADR-0025
I couldn't run `npx ontrack review` (approval wasn't given), so I reviewed the ADR by hand against its own instructions.

## Proposed ruling: ADR-0025 (Tools outside the package manager)

**Status:** `accepted`

**Trait**
- `tools.manager: mise`. The recommendation is `script` for one tool and `mise` or `aqua` for several. Two ADRs each name one such tool: ADR-0015 recommends `secrets.guard: gitleaks` and ADR-0011 recommends `forge.audit: zizmor`. That makes two tools, so a manager fits. I chose `mise` over `aqua` because:
  - it can refuse a tool that isn't in its lockfile (`mise install --locked`);
  - it checks checksums by default, while aqua needs `checksum.enabled`;
  - `ontrack check` only checks the pins when the value is `mise`.

**Condition check:** the repository has no `mise.toml`, `.tool-versions`, `aqua.yaml` or install script yet. No workflow installs gitleaks, zizmor or actionlint (checked `.github/workflows/` and `scripts/`). This ruling therefore sets up something new rather than recording a habit the repository already has. One caveat: ADR-0011 and ADR-0015 are still `proposed`. Only ADR-0001 is accepted. If either of them is ruled `none` or names a different tool, the number of tools changes and this answer should be looked at again. With one tool, the ADR recommends `script`.

**Rule 4 (what keeps the pins current):** the repository has no Dependabot or Renovate config. I checked for `.github/dependabot.yml` and `renovate.json*` and found neither. So **a maintainer moves the pins by hand**: they run `mise lock` and commit `mise.toml` and `mise.lock` together in the same PR. If Renovate is adopted later, its `mise` manager can take this over.

**Departures from the recommendation:** none. `mise` is one of the two values the ADR recommends for several tools.

Once you agree, I'll edit only this ADR:
- fill in `tools.manager: mise` and set `status: accepted`;
- set `date: 2026-11-15` and `authors: [Tristan Rivoallan]`;
- rewrite the Consequences;
- replace the "How to rule" block with the rule-4 paragraph;
- run `npx ontrack apply`.

**Do you agree with `tools.manager: mise`?** You could also pick `aqua`, `script`, or wait until ADR-0011 and ADR-0015 are ruled.

Many ADRs are still `proposed`, so I've left the follow-up step for after they're ruled: listing which rulings the repository doesn't follow yet and checking the tracker for items labelled `ontrack`.
