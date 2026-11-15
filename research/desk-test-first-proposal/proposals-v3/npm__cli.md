=================== npm__cli ADR-0002
I couldn't run `npx ontrack review` because the permission was declined, so I did the review by hand. I read the ADR file, the commit history and the code. Here is the proposed ruling.

## What the repository does today

- **Commits:** all 13,543 commit subjects follow English Conventional Commits (`fix(arborist): …`, `deps: …`, `chore: release …`). None of the last 3,000 contains a French accented character.
- **Documentation:** `README.md` and `docs/lib/content/{commands,configuring-npm,using-npm}` are in English. The ADRs under `docs/adr/trivoallan/` are in English too.
- **Code and comments:** `lib/` and `workspaces/*/lib` use English names and English comments. A search for common French words found nothing.
- **What's missing:** nothing in the repository writes down a language rule. No contributor guide, lint setting or CI check says which language to use. English is a strong habit, not a stated rule.
- **CLI messages:** the CLI has no translation system (no gettext or locale catalogues). That is about the product's own messages, which this ADR doesn't cover, so it doesn't affect the ruling.

## Proposed ruling

**Status: `accepted`**

- `localization.language.default: english (observed)`: every commit subject, the README, the docs under `docs/lib/content` and the source under `lib/` are in English.
- `localization.language.documentation: (empty, takes default) (observed)`: the docs are in English.
- `localization.language.commits: (empty, takes default) (observed)`: all 13,543 commit subjects are in English.
- `localization.language.code: (empty, takes default) (observed)`: names in `lib/` and `workspaces/` are English.
- `localization.language.comments: (empty, takes default) (observed)`: comments in `lib/` are English.

**Departures from the recommendation:** none. It's the recommendation as written: one `english` default and no overrides. The ADR will record that in a single line.

**When writing it, I'll also fill in:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, using your git user name with no email
- the Consequences lists, rewritten for this repository (for example, dropping the "French-speaking maintainer" cost, which doesn't apply here)

I'll also remove the instruction block, as the ADR asks.

## Rulings not followed yet

This ruling matches what the repository already does, so there's nothing to set up for it. No `tracking` trait has been decided (ADR-0014 is still proposed), so I wouldn't create any tracking items. I'd just give the list in my reply, and for this ruling it's empty.

**Do you agree with `accepted`, `default: english`, no overrides?** Once you confirm, I'll write the ADR and then run `npx ontrack apply`, which will also need your permission. I haven't written anything yet.
=================== npm__cli ADR-0004
Still gathering evidence: counting the repository's languages before I propose a value.

I couldn't run `npx ontrack review trivoallan/ADR-0004-languages` because it needs approval I don't have here. So I followed the ruling steps written in the ADR, and the proposal below is built from what I could read in the repository.

## What the repository does today

- **The code is JavaScript running on Node.js.** There are 667 tracked `.js` files outside `node_modules/`, in `lib/`, `bin/`, `workspaces/`, `scripts/` and `docs/lib/`. `package.json` has `"main": "./index.js"`, `bin` points to `bin/npm-cli.js`, and it requires `"node": "^22.22.2 || ^24.15.0 || >=26.0.0"`. There is no `"type": "module"` field, so the files are CommonJS.
- **The tooling is JavaScript tooling.** Tests run with `"test": "tap"`, lint runs with `"lint": "node . run eslint"` (`.eslintrc.js`), and the CI matrix in `.github/workflows/ci.yml` runs Node 22, 24 and 26.
- **There is no TypeScript and no Python of its own.** I found no `tsconfig`/`jsconfig` and no `typescript` dependency, so nothing compiles the code or checks its types. The only `.ts` and `.py` files are vendored inside `node_modules/` (`tinyglobby/*.d.*ts` and node-gyp's `gyp/*.py`), and they are not code this repository writes.
- **Other languages are minor.** There are shell scripts (`scripts/smoke-tests.sh`, `lib/utils/completion.sh`), `.cmd`/`.ps1` shims, and `.hbs` templates. The ADR says secondary languages like these don't change the answer.
- **One file is modified but not committed.** `package.json` has a new devDependency, `"trivoallan": "npm:@trivoallan/ontrack-engineering@0.6.0"`, which is where these ADRs come from. It doesn't affect this question.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. The repository uses **JavaScript**, which is neither. The ADR has no conditional recommendation to check. Its "TypeScript when it runs in a browser…" line only helps choose between the two recommended languages, and this repository is a server-side command-line tool. `rejected` doesn't apply either: this is a code repository, not a documentation or configuration one.

## Proposed ruling

**Status: `accepted`**

- `languages.main.name: JavaScript (observed)`: 667 first-party `.js` files, `package.json` `main`/`bin` point to `.js`, `engines.node`, tests run with `tap` and lint with eslint on `.js`, and there is no tsconfig or TypeScript dependency.

**Departure from the recommendation: JavaScript instead of TypeScript or Python.** The proposed reason, to be written in the ADR:
- npm is the package manager that ships with Node.js, and Node.js includes its source as is. Plain CommonJS runs on every supported Node version with no build step.
- Moving to TypeScript would add a compile step to how npm is built and shipped. Moving to Python is out of the question, because npm is part of the Node.js ecosystem.
- One cost to write down under Negative: what ADR-0005 recommends for validation (`zod`) and ADR-0007 for coverage only partly applies to JavaScript with no type checking.

**Other values for the file:**
- `date: 2026-11-15`
- `authors: [Tristan Rivoallan]`, taken from your git user name

Do you agree with this ruling, including the date and authors? If you do, I'll:
1. Fill in the trait and set the status.
2. Replace the "how to rule" block with the reason above.
3. Rewrite the Consequences section.
4. Run `npx ontrack apply`, which needs your approval.
5. List the rulings this repository doesn't follow yet. No `tracking` trait is decided in AGENTS.md, so I'll give that list in my reply and create nothing in a tracker.
=================== npm__cli ADR-0006
Still gathering evidence: commitlint and release-please are confirmed. I'm now counting which scopes the commit history actually uses.

I have the evidence I need. Here is the proposed ruling. I couldn't run `npx ontrack review trivoallan/ADR-0006-commits`, which AGENTS.md says to use, because it needs your approval. So I followed the ADR file itself, which sets out how to rule.

## What the repository does today

- **Versions come from commit messages.** `release-please-config.json` defines changelog sections by commit type (`feat`, `fix`, `docs`, `deps`, `chore`). It also versions 13 packages: the root plus all 12 `workspaces/*`. `.github/workflows/release.yml:54` runs `template-oss-release-please`. **So the ADR's condition for recommending `commitlint` holds.**
- **commitlint already runs in CI.** `.github/workflows/pull-request.yml:17-52` lints every PR's commits from `origin/<base_ref>`. If they fail, it lints the PR title instead, which means a squash merge carries the type.
  - `.commitlintrc.js` extends `@commitlint/config-conventional`.
  - `@commitlint/cli` and `@commitlint/config-conventional` 20.5.3 are in `package-lock.json`. They come in through `@npmcli/template-oss` 5.1.1; they are not direct devDependencies.
  - `node_modules` isn't installed in this checkout, so the check will only find them after `npm install`.
- **There is no closed scope list.** `.commitlintrc.js` has no `scope-enum`. In the last 1,000 non-merge commits:
  - 826 have no scope and 172 do.
  - The scopes in use are mixed: workspace names (`arborist` appears about 100 times, `config`, `libnpmexec`, `libnpmpublish`, …), command names (`view`, `exec`, `pack`, `publish`, `ls`, …) and doc pages (`package-json`, `npm-install`, …). Some areas get two names, such as `exec` and `libnpmexec`. That is the drift this ADR describes.
- **`origin/HEAD` resolves locally** to `origin/latest`. CI's `actions/checkout` usually doesn't set `origin/HEAD`, so the `check:` line should name the base explicitly.

## Proposed ruling

**Status: `accepted`**

- `commits.tool: commitlint (observed)`: commitlint runs on every PR in `.github/workflows/pull-request.yml:44-52` with `.commitlintrc.js`, and release-please derives versions from the messages.
- `commits.scopes: [arborist, config, libnpmaccess, libnpmdiff, libnpmexec, libnpmfund, libnpmorg, libnpmpack, libnpmpublish, libnpmsearch, libnpmteam, libnpmversion] (absent)`: these are the 12 directories under `workspaces/`, each a separately versioned release-please package. Workspace names are already the most-used scopes in the history, but no closed list is enforced today.

**Departures from the recommendation:**

1. **Scopes.** The ADR recommends no list, so this one is mine, not governance's. The cost: command and doc-page scopes (`fix(view)`, `docs(npm-install)`, about 70 of the last 172 scoped commits) would be refused. Those commits would go unscoped, or you would add the command names to the list. The alternative is `[]`, but that would also refuse `fix(arborist)`, which is the scope used most.
2. **`check:` line.** I'd append `--from origin/latest`, because CI checkouts have no `origin/HEAD`.

**A conflict this ADR can't settle.** Governance fixes the eleven Conventional Commits types, but `.commitlintrc.js:6` allows only five: `feat`, `fix`, `docs`, `chore`, plus the non-standard `deps`. `deps` makes up 379 of the last 1,000 commits and has its own changelog section. That rule also refuses seven of the eleven types: `style`, `refactor`, `perf`, `test`, `build`, `ci` and `revert`. The file is generated by `@npmcli/template-oss` and marked "Do not edit", so changing it means changing template-oss upstream. I'll record this in the ADR as a known departure from governance and list it among the rulings the repository doesn't follow yet.

**Do you agree?** Please choose:
- **(a)** Accept as proposed.
- **(b)** Accept, but use a different scope list: `[]`, or the workspaces plus command names.
- **(c)** Change something else.

Please also give me the name or names for `authors:`. I won't write anything until you answer.
=================== npm__cli ADR-0009
Gathering evidence on this repo's branching (history shows squash-merged PRs; checking contributor conventions next).

I couldn't run `npx ontrack review trivoallan/ADR-0009-branching`, which AGENTS.md asks for, because the command needed approval that wasn't given. So this review follows the ADR's own "How to rule" steps. I have written nothing yet.

## What the repository does today

- **Default branch is `latest`.** `origin/HEAD -> origin/latest`, and CI runs on pushes to `latest` and `release/v*` (`.github/workflows/ci.yml:14-17`).
- **Work goes through pull requests.** `CONTRIBUTING.md:36` says "Open a Pull Request", and CI runs on `pull_request`. There is no `develop` or `hotfix` branch.
- **There are long-lived maintenance branches.** `release/v6` to `release/v11` exist, and `scripts/backport.js:66` opens `backport/<version>/<pr>` branches onto them when a PR has a `backport:` label.
- **No merge commits since 2022.** The last one on `latest` is `1b7d7eff9` (2022-02-17). Since then every commit has a single parent.
- **Two kinds of commit land on `latest`:**
  - Squash merges: committed by "GitHub" and ending in `(#NNNN)`, such as `d5389363f deps: read-cmd-shim@7.0.1 (#10254)`. There are 192 commits committed by GitHub this year.
  - Commits with a person as committer and no PR number, such as runs of `deps: …` and `chore: release …` by Michael Smith (156 this year). These are either rebase-merged multi-commit PRs or direct pushes; I can't tell which from the history.
- **Branch names don't follow a convention.** On the remote I see `feat/` (3), `fix/` (4), `feature/circleci`, names prefixed by user (`reggi/…`, `owlstronaut/…`, `nkolev92/…`, `martinrrm/…`), names with no prefix (`exit-handler-messaging`, `parallelizing-npm-version`), plus tool branches (`backport/…`, `dependabot/…`, `release-please--…`).
- **The forge settings aren't in the repository.** There is no `.github/settings.yml`. Which merge methods are allowed and whether `latest` is protected are GitHub settings I can't read.

## Proposed ruling: `accepted`

- `branching.model: github-flow (observed)`: one branch and PR per change into `latest` (`CONTRIBUTING.md:36`, CI on `pull_request`). The `release/vN` branches only take backports; they are not a gitflow `develop`/`release` cycle.
- `branching.merge`: **I can't settle this one.** The history shows squash for most PRs, plus many commits with a person as committer and no PR number, which fits rebase merging or direct pushes. Which methods GitHub allows is set under Settings → General → Pull Requests. **Which value do you want: `squash`, or `rebase`?**
- `branching.prefixes: [feat, fix, docs, chore] (absent)`: today only about 7 remote branches use a commit-type prefix. `chore` is added because `CONTRIBUTING.md:42-45` lists exactly these four types.

**Departures from the recommendation:**

1. **`prefixes` adds `chore`.** It matches the four PR types `CONTRIBUTING.md` already lists, and `chore` is one of the eleven commit types.
2. **`merge` depends on your answer.** If it's `rebase`, the reason would be that multi-commit dependency PRs are meant to keep one `deps:` commit per package in the history.
3. **Not a departure, but worth writing down:** `release/vN` maintenance branches with automated backports stay alongside github-flow.

**Two risks with the check once accepted:**

- `backport/…` branches made by `scripts/backport.js` aren't exempt under ADR-0012 or ADR-0018, so they would fail `ontrack-engineering-check ADR-0009`.
- `dependabot/…` and `release-please--…` branches would also fail until ADR-0018 and ADR-0012 are ruled.

Before I write anything:

1. **`branching.merge`:** should it be `squash` (the recommendation) or `rebase`? What does the forge allow today?
2. **`branching.prefixes`:** do you agree to `[feat, fix, docs, chore]`, or would you rather keep the recommended `[feat, fix, docs]`?
3. **Model and status:** do you agree to `github-flow` and `accepted`? And which name(s) should go in `authors:`?

Once you agree, I'll fill the ADR, write the reason for each departure, and run `npx ontrack apply`. Then I'll list the rulings this repository doesn't follow yet. No `tracking` trait is decided (ADR-0014 is still open), so that list will go in my reply and I won't create any tracker items.
=================== npm__cli ADR-0011
I couldn't run `npx ontrack review` (approval required), so I'll follow the ADR and the prompt directly.

Still reviewing — checking the publish job, then I'll present the proposed ruling.

I couldn't run `npx ontrack review` or `gh api` because both need your approval, so I worked from the ADR's own instructions and the files in the repository.

## What the repository does today

- **Forge:** GitHub (`origin` is `https://github.com/npm/cli.git`). There are 26 workflows in `.github/workflows/`, so ruling `rejected` doesn't apply.
- **Who writes the workflows:** almost all of them start with `# This file is automatically added by @npmcli/template-oss. Do not edit.` The generator is pinned in `package.json:197` (`@npmcli/template-oss: 5.1.1`), and `postlint: template-oss-check` checks the files against it. So any change to a workflow has to go through template-oss, or it will be overwritten.
- **Stages:** lint, test, licenses, smoke-tests and publish-dryrun run on `pull_request` and on pushes to `latest`/`release/v*` (`ci.yml`). Commitlint runs on PRs (`pull-request.yml`). `npm audit` runs weekly (`audit.yml`). There are also CodeQL and release-please workflows.
- **Nothing audits the workflows.** No workflow runs zizmor or actionlint, and there's no `zizmor.yml`. zizmor isn't installed locally (`which zizmor` finds nothing). actionlint is installed in `~/.local/bin`, but nothing runs it.
- **Rule 3 (pin actions by SHA): broken everywhere.** 0 of 138 external `uses:` are pinned to a SHA. Examples: `actions/checkout@v6`, `LouisBrunner/checks-action@v1.6.0`, `peter-evans/find-comment@v2`, and one `actions/checkout@v3`.
- **Rule 5 (no secrets or write rights for fork code): not broken, but close.** `backport.yml` uses `pull_request_target` with `actions`/`contents`/`pull-requests: write` granted to the whole workflow. It checks out the base branch, not the fork's head, so it doesn't run proposed code. zizmor would still flag it (`dangerous-triggers`, `excessive-permissions`, `artipacked`). It also has `# TODO: Remove before merging — manual trigger for testing` on a `workflow_dispatch` trigger.
- **Permissions:** `release.yml` grants `contents: write` to the whole workflow, and the workflow has several jobs.
- **Rules 1 and 2 (deploys and their secrets):** no workflow uses `environment:` and none runs `npm publish`. Only `GITHUB_TOKEN` is used. Release workflows run only on pushes to `latest`/`release/v*`. Rule 1 holds because there is nothing to deploy.
- **Whether a red pipeline blocks merging:** I can't tell. That's set in the GitHub rulesets or branch protection on `latest`, and I couldn't read them (`gh api repos/npm/cli/rules/branches/latest` needed approval).

## Proposed ruling

**Status:** `accepted`

- `forge.gate: blocking` (not marked): the 26 workflows exist, but whether a check is required on `latest` is a GitHub setting I couldn't see. Please confirm what the ruleset or branch protection does, or approve the `gh api` call above.
- `forge.audit: zizmor` (absent): nothing reads the workflows today, and pinning by SHA is broken in all 138 places.

**Differences from the recommendation:**
- No change to the trait values.
- One rule needs adapting. Because the workflows are generated by `@npmcli/template-oss`, the zizmor job and the SHA pins have to come from that template. Editing the workflows by hand would be undone by `template-oss-apply` and flagged by `template-oss-check`. I'd record this in the ADR.
- One risk to note if you choose `blocking`. `ci.yml` skips PRs that only touch `docs/**` or `workspaces/**` (`paths-ignore`). If a check from `ci.yml` is required, those PRs would wait for it forever. The per-workspace `ci-*.yml` workflows would have to supply the required checks instead.

## Rulings the repository won't follow yet, if accepted as proposed

- `[trivoallan/ADR-0011] forge.audit`: no zizmor job; 138 actions not pinned by SHA; `backport.yml` and `release.yml` grant write permissions to the whole workflow.
- `[trivoallan/ADR-0011] forge.gate`: unknown until the ruleset is confirmed.

AGENTS.md has no decided `tracking` trait, so I won't create any tracker items. I'll just give this list.

**Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`?** And what does the ruleset on `latest` require today? Once you answer, I'll fill in the ADR (traits, status, date, authors, consequences, the template-oss reason) and run `npx ontrack apply`. That command needs your approval too.
=================== npm__cli ADR-0023
My proposed ruling for ADR-0023 (License) is `accepted` with `license.spdx: Artistic-2.0`, not the recommended `MIT`. This repository already has a licence, so the ruling records it rather than choosing a new one.

## What the repository does today

- **Root manifest:** `package.json:264` declares `"license": "Artistic-2.0"`. That is a valid SPDX identifier. There is no `pyproject.toml`.
- **Licence file:** a `LICENSE` file is committed at the root (235 lines). It starts with "The npm application / Copyright (c) npm, Inc. and Contributors / Licensed on the terms of The Artistic License 2.0" and contains the full licence text from line 32.
- **Copyright holder:** "npm, Inc. and Contributors", already written in that file. So the ADR's third fixed point is already met.
- **History:** `LICENSE` goes back to the project's early commits (`8d99e91a6 license`). This is a long-standing choice, not something that drifted in.
- **Workspaces:** all 12 packages under `workspaces/` declare `"license": "ISC"` and each has its own `LICENSE` or `LICENSE.md`. The ADR's check doesn't read manifests in subfolders, so these don't conflict with the ruling.
- **CI:** I didn't confirm whether a CI workflow checks licences. The search was cut off before it reached `.github/workflows`. No licence check is needed to follow this ruling.

## Proposed ruling

**Status:** `accepted`

- `license.spdx: Artistic-2.0 (observed): package.json:264 "license": "Artistic-2.0"; root LICENSE holds the Artistic License 2.0 full text, copyright "npm, Inc. and Contributors"`

**One departure from the recommendation:**

- **`Artistic-2.0` instead of `MIT`.** npm has been distributed under Artistic-2.0 since its early history, and the package is published and installed everywhere under that licence. Moving to MIT would need agreement from every copyright holder, and copies already taken would keep Artistic-2.0 anyway. Like MIT, Artistic-2.0 is permissive enough for closed reuse, and it gives more control over modified versions that are passed off under the original name. The ADR accepts any SPDX expression.

The ADR leaves no other key to the repository. All three fixed points are already met: the manifest declares the value, the root licence file holds the full text, and the copyright line is present.

## What I need from you

1. **Do you agree** with `accepted` and `license.spdx: Artistic-2.0`?
2. **`authors:`**: which names should I put as the people who decided? The ADR asks for names without email addresses. I'll set `date: 2026-11-15`.

I won't write anything until you confirm. Once you do, I'll fill in the frontmatter, replace the "how to rule" block with the reason for the departure, rewrite the Consequences lists, and run `npx ontrack apply`.

On the follow-up list: the repository already follows this ruling, so it adds nothing to the list of rulings not yet followed. AGENTS.md has no decided `tracking` trait (ADR-0014 is still proposed), so I won't create any tracker items.
=================== npm__cli ADR-0025
Still investigating: no tool manager or pinned-tool script exists so far; checking what CI fetches outside npm and which ADRs are decided.

I couldn't run `npx ontrack review trivoallan/ADR-0025-tools`: the command needed approval, which wasn't given. So this proposal follows the ADR's own "How to rule" steps. Nothing has been written yet.

## What the repository does today

- **No tool manager and no pinning script.** There is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml`, `aqua-checksums.json` or `.pre-commit-config.yaml`. Nothing in `scripts/` downloads a binary and checks it with `sha256sum -c`.
- **No hooks and no agent session setup.** There is no `.husky`, `.devcontainer` or `.claude`. No `brew install` appears anywhere in `.github/`, `scripts/`, `package.json` or `CONTRIBUTING.md`.
- **CI uses only what the runner image already has.** That means `jq` (9 uses in workflows), `curl` and `git`. The `curl` calls download npm tarballs and citgm sources, not tools (`.github/workflows/node-integration.yml:425`, `.github/actions/install-latest-npm/action.yml:22`). ADR-0025 leaves runner images to ADR-0011 rule 3.
- **No accepted ADR names such a tool.** ADR-0001 is the only accepted ADR. ADR-0011 (`forge.audit`), ADR-0015 (`secrets.guard`) and ADR-0019 are all still `proposed`.
- **History:** no commit mentions gitleaks, zizmor, actionlint, mise, aqua or asdf. The only hits are words like "promise" that happen to contain "mise".

## Comparing with the recommendation

The ADR recommends `script` for one tool and `mise` or `aqua` for several. It also says: "`none` is an answer only when no accepted ADR names such a tool." That condition holds here, because ADR-0001 is the only accepted ADR. So the recommended values have nothing to pin.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: none (observed)`: the repository has no tool manager, no pinning script and no hooks. CI uses only binaries from the runner image, and no accepted ADR names a tool outside the package manager.

**Departure from the recommendation:**
- **`none` instead of `script`/`mise`/`aqua`.** There is no tool to pin today, and the ADR itself allows `none` in that case. The reason I would write in the ADR: this ruling must be revisited when ADR-0015 or ADR-0011 is accepted with a tool as `secrets.guard` or `forge.audit`. From then on, `ontrack-engineering-check ADR-0025` fails while the value is `none`.
- **Rule 4 (what keeps pins current):** I would write that there are no pins yet, so nothing moves them.

**`authors:`** I'd put `Tristan Rivoallan` (your git user name) unless you name other people.

Do you agree with this ruling (`accepted`, `tools.manager: none`), and with that author? Once you confirm, I'll write it into the ADR and run `npx ontrack apply`. After that I'll list the rulings the repository doesn't follow yet. No `tracking` trait is decided in AGENTS.md, so that list will go in my reply and I'll create no tracker items.
