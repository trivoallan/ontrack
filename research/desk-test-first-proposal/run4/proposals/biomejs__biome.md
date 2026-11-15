# biomejs__biome

## ADR-0002

Gathering evidence on the repository's current languages.

## What the repository does today on localization

Nothing in the repository states a language rule. CONTRIBUTING.md, AGENTS.md and `.agents/skills/` never say which language to write in. Even so, everything is written in English:

- **Commits:** the last 1000 subjects are English conventional commits (`git log --format=%s -n 1000`). Only one contains a non-ASCII character, an ellipsis in `ci: disallow pr titles to end with …` (#12153). About 161 distinct authors in the last 2000 commits, so the readership is international.
- **Code and comments:** the Rust symbols and comments under `crates/` are English, and the skills that govern them are written in English (`.agents/skills/doc-comments/SKILL.md`).
- **Documentation:** `README.md`, `CONTRIBUTING.md`, `GOVERNANCE.md` and `CHANGELOG.md` are English.
- **The one exception:** the package README is also available in 11 other languages, in `packages/@biomejs/biome/README.{hi,es,fr,zh-TW,zh-CN,ja,pl,pt-BR,kr,ru,uk}.md`. `README.md:33` links to them and marks English as the main version. These are translations of an English source, not documentation written first in another language. The trait's allowed values (`french`, `english`) can't express them anyway.

## Compared with the recommendation

The ADR recommends `default: english` with no overrides. The repository already matches that, so there are no departures. The recommendation has no conditional ("if this repository…") to check.

## Proposed ruling

**Status:** `accepted`

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `default` | `english` | observed | commit history, `crates/`, CONTRIBUTING.md, AGENTS.md |
| `documentation` | empty (takes `default`) | observed | primary docs are English; the README translations come from the English source |
| `commits` | empty (takes `default`) | observed | 1000 English commit subjects |
| `code` | empty (takes `default`) | observed | English Rust symbols |
| `comments` | empty (takes `default`) | observed | English comments; doc-comments skill |

**Departures from the recommendation:** none. The ADR will say it adopts the recommendation as is. It will also add one neutral consequence: the README translations stay as copies of the English source, and the ruling does not cover them.

## Rulings the repository does not follow yet

None from this ADR, because every value is observed, so there is nothing to track. AGENTS.md has no decided `tracking` trait (ADR-0014 is still undecided), so no tracker items would be created in any case.

## To fill in the ADR

- **`date:`** 2026-11-15.
- **`authors:`** I'd put `[Tristan Rivoallan]`, from the git user. Tell me if other people took part in the decision.

Do you agree with this ruling? Once you confirm, I'll write it into ADR-0002 and run `npx ontrack apply` to update AGENTS.md.

## ADR-0004

Now the repository evidence.

## Proposed ruling for ADR-0004 (Languages)

**What the repository does today:** Biome's main language is Rust.

- `rust-toolchain.toml:5` pins `channel = "1.100.0"` and targets `wasm32-unknown-unknown`.
- `Cargo.toml:3` sets up the workspace with `members = ["crates/*", "xtask/..."]` and `edition = "2024"`. There are 106 crates under `crates/`.
- The repo tracks 5,456 `.rs` files, and 5,357 of them are under `crates/`.
- It tracks 2,324 `.ts`/`.tsx` files, but only 95 of those sit outside `tests/` and `specs/` folders. The rest are test fixtures for the parsers, formatters and linters.
- The TypeScript that does ship lives in `packages/@biomejs/*`: `js-api`, `backend-jsonrpc`, `wasm-*`, and npm wrappers that hand off to the per-platform `cli-*` binaries.
- There are no `.py` files.
- `CONTRIBUTING.md:100` says "Building this project requires a `stable` Rust toolchain". AGENTS.md's style and dependency rules are all written for Rust.
- In CI, most workflows run Cargo. `pull_request_js.yml` and `pull_request_node.yml` cover the secondary TypeScript packages.

**Recommendation vs. the repository:** the ADR recommends `Python` or `TypeScript`, and Biome uses neither as its main language. That is the one difference. The ADR applies here (this is a code repository), so `rejected` is not on the table.

**Proposed ruling**
- Status: `accepted`
- `languages.main.name: Rust` (observed). Evidence: `rust-toolchain.toml`, the `Cargo.toml` workspace, the 5,357 `.rs` files in `crates/`, and `CONTRIBUTING.md:100`.

**Departure, with the justification the ADR asks for:** I'd use Rust instead of Python or TypeScript for three reasons:
- Biome ships one static native binary per platform (the `packages/@biomejs/cli-*` packages).
- The same code compiles to WebAssembly (`wasm32-unknown-unknown`; `wasm-web`, `wasm-nodejs` and `wasm-bundler`).
- It is a parser, formatter and linter that has to be fast. The two recommended languages give none of these.

TypeScript stays as a secondary language for the npm packages and the JS API, which the ADR allows.

**What I'd write once you agree:**
- Frontmatter: `name: Rust`, `status: accepted`, `date: 2026-11-15`, and `authors`. I'd put `[Tristan Rivoallan]` unless you tell me otherwise.
- The Consequences section, rewritten for this ruling.
- The how-to-rule block replaced with the justification above.
- Then I'd run `npx ontrack apply`.

**Rulings this repository doesn't follow yet:** none. `languages.main.name: Rust` already matches the codebase, so there's nothing to track. Work tracking (ADR-0014) isn't decided yet either, so I'd create no tracker items in any case.

Do you agree with ruling `accepted`, `languages.main.name: Rust`, with `authors: [Tristan Rivoallan]`?

## ADR-0006

Now the repository's current state on commits.

Tallying the scopes in the commit history; the inline script needed approval, so I'm switching to a script file.

I have the evidence I need. This is the proposed ruling; nothing has been written yet.

## Proposed ruling: `[trivoallan/ADR-0006]` Commits, status `accepted`

### How the repository handles commits today
- **Format:** `CONTRIBUTING.md:386-412` asks for Conventional Commits. `CONTRIBUTING.md:418` says the PR title becomes the squashed commit message.
- **Enforcement:** CI checks PR titles with `amannn/action-semantic-pull-request` (`.github/workflows/pull_request_title_lint.yaml`). It sets `requireScope: false` and only blocks `release` and uppercase scopes. There is no commitlint, husky, lefthook or commit-msg hook anywhere in the repository (grep outside `node_modules`/`crates` only finds the ADRs).
- **Versioning:** versions come from changesets, not from commit messages. See `.changeset/config.json` and the `package.json` script `"version": "changeset version && ..."`.
- **Scopes in practice:** 364 of the last 400 subjects (since 2026-10-21) have a scope, and none breaks the format. There is no closed list, though. The last 2000 commits use more than 200 different top-level scopes, with synonyms side by side: `format`/`fmt`/`formatter`/`css_formatter`, `parse`/`parser`/`css_parser`/`markdown_parser`, `analyze`/`analyzer`, `inference`/`type_inference`/`type-inference`/`types`, `md`/`markdown`. Many scopes are rule names (`useSortedClasses`, `noShadow`). Recent commits are settling on `area/language` scopes such as `format/html`, `parse/js` and `lint/css`.

### Condition check
`commits.tool: commitlint` is recommended only **if this repository generates its versions from commit messages**. It doesn't: changesets set the versions (files above). The recommendation therefore doesn't apply.

### Traits
| Key | Proposed value | Observed or absent | Evidence |
|---|---|---|---|
| `commits.tool` | `none` | observed | No commitlint and no hook today. The CI check on PR titles already keeps the format, because squash merges make the title the commit message. |
| `commits.scopes` | `[lint, analyze, format, parse, inference, cli, lsp, core, service, configuration, migrate, plugins, resolver, module_graph, rowan, codegen, xtask, deps, skills]` | absent | No list exists. These are the most-used scopes in the history, with synonyms merged. Rule-name scopes go under `lint`, and each language parser or formatter goes under `parse` or `format`. Recent `area/language` scopes (`format/html`) stay valid because only the first word is drawn from the list. |

### Departures from the recommendation
1. **`tool: none` instead of `commitlint`.** Versions come from changesets, so a commit message cannot produce a wrong version. The PR-title lint in CI does the job a tool would do. With `none`, `ontrack check` has nothing to run.
2. **`scopes`:** governance doesn't recommend a list. The one above is built from the history, to stop the synonyms from spreading.

### Already a mismatch with governance's fixed part, whatever you rule
The PR-title lint and `CONTRIBUTING.md:391-403` allow a `release` type, which is not one of the eleven, and they leave out `style`. This goes into the list of rulings the repository doesn't follow yet, at the end of the review.

Do you agree with this ruling? You can also:
- shorten or rename the scope list, or choose `[]`;
- choose `tool: commitlint` or `hook` anyway;
- give the `authors:` names to record, which I need either way. `date:` will be 2026-11-15.

## ADR-0009

Now the repository's current practice: CONTRIBUTING branching section, history, branch names.

Still reviewing ADR-0009. I've gathered the evidence and am checking one last thing: whether any CI runs `ontrack check`.

The ruling I propose for `docs/adr/trivoallan/ADR-0009-branching.md` is below. Nothing has been written yet.

## What the repository does today

- **Model.** Pull request workflows run on PRs into `main` and `next` (`.github/workflows/pull_request.yml:6-8`). Fixes, nursery rules and features users don't see target `main`. Promoted rules and features users see target the long-lived `next` branch (`CONTRIBUTING.md:422-426`). At each minor or major release, `next` is merged into `main` (`CONTRIBUTING.md:526`). There are no `develop`, `release` or `hotfix` branches, and nothing in history shows direct pushes.
- **Merge.** The PR title becomes "the default commit message on the squashed commit after merging" (`CONTRIBUTING.md:418`). Since 2026-05-15, `main` has 1534 first-parent commits; only 2 are merge commits (`git rev-list --count --first-parent [--merges] --since=2026-05-15 main`). Both are `Merge pull request … from biomejs/next` (f0f82425cd, dd0a7475cd), which follows `CONTRIBUTING.md:526`: "Using merge commit is recommended here". The merge message is linted as a Conventional Commit (`.github/workflows/pull_request_title_lint.yaml`), which is what squash relies on.
- **Prefixes.** Nothing documents a branch-naming convention: not `CONTRIBUTING.md`, not `AGENTS.md`, not `.agents/skills/`. No CI checks branch names, and `ontrack` appears nowhere under `.github/`. I counted the remote branches by hand from `git branch -a`, so the figures are approximate:
  - About 104 use a personal handle as prefix (`dyc3/` about 80, `conaclos/` 9, `dbezrukov/` 9, `db/` 6).
  - About 97 use a commit type: `feat/` 52, `fix/` 22, `refactor/` 8, `chore/` 6, `ci/` 5, `perf/` 2, `docs/` 2.
  - The rest belong to bots (`renovate/`, `changeset-release/main`, `coderabbitai/`, `copilot/`, `codex/`, `graphite-base/`, `codspeed/`, `depot/`), have no slash, or use prefixes outside the eleven types (`bench/`, `bug/`, `feature/`).
  - Most outside contributions come from forks, so their branch names can't be seen here.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | **observed**: one branch, one PR, one squash per change (`CONTRIBUTING.md:418-426`) |
| `branching.merge` | `squash` | **observed**: 1532 of 1534 first-parent commits on `main` since 2026-05-15 are squashes (`CONTRIBUTING.md:418`) |
| `branching.prefixes` | `[feat, fix, docs, refactor, perf, chore, ci]` | **absent**: no convention exists; this keeps the commit types already used on branches |

## Departures from the recommendation

1. **The model has a long-lived `next` branch.** Breaking or user-visible minor work goes to `next`, which is released into `main`. None of the three allowed values describes this. `github-flow` is the closest: short branches, PRs, and `main` stays shippable. Gitflow's `develop`/`release`/`hotfix` set doesn't exist here.
2. **`next` is merged into `main` with a merge commit, not a squash.** This keeps the history of `next` (`CONTRIBUTING.md:526`).
3. **The prefix list is longer than `[feat, fix, docs]`.** `refactor`, `perf`, `chore` and `ci` are already used on branches and in PR titles. All seven come from the eleven types.

## Effects you should know about before agreeing

- **Personal-handle branches would fail.** Once accepted, the `check:` would fail on `dyc3/…`, `conaclos/…` and similar names, which make up about 40% of today's upstream branches. That is a real change for maintainers.
- **Bot and release branches would also fail.** The check exempts only `release-please--`, `releaser-pleaser--`, `dependabot/` and `renovate/`, and only if ADR-0012 and ADR-0018 are ruled. These would fail:
  - this repo's Changesets release branch `changeset-release/main`, which opens the `ci: release` PR;
  - `next` itself, when it is the head branch of the release PR into `main`;
  - `coderabbitai/`, `copilot/`, `codex/` and `graphite-base/`.
- **The check doesn't run yet.** No CI job runs it, so none of these failures would block a PR until one is added.

The `tracking` trait (ADR-0014) is not decided, so there is no tracker to file follow-ups in. Once this is ruled, I'll give the rulings the repository doesn't follow yet as a list in my reply and create nothing.

**Do you agree with this ruling?** You can accept it as is, or change it: for example, keep the recommended `[feat, fix, docs]`, add `test`/`build`/`revert`, or rule `rejected`. If you agree, please give me the name(s) to put in `authors:`.

## ADR-0011

Still gathering evidence; checking CONTRIBUTING for required-check language, then I'll present the ruling.

## Proposed ruling: `trivoallan/ADR-0011` Forge and continuous integration

**What the repository does today**
- The forge is GitHub. `git remote -v` points to `https://github.com/biomejs/biome.git`, and there are 25 workflows in `.github/workflows/`. The ADR's only reason to reject (a forge other than GitHub) does not apply.
- PR CI exists. `.github/workflows/pull_request.yml:3-8` runs on `pull_request` (main, next) and on `merge_group`. A `merge_group` trigger only fires when GitHub's merge queue is on, and the merge queue only works when the branch's ruleset requires status checks. That strongly suggests red CI blocks merges. I could not read the ruleset itself: the `gh api repos/biomejs/biome/rules/branches/main` call was not approved.
- zizmor already runs on every PR and on pushes to main (`.github/workflows/actions_linter.yml`). It uses `zizmorcore/zizmor-action@cc914d7…` pinned by SHA, `checkout` with `persist-credentials: false`, and permissions at job level only.
- Every `uses:` in the workflows is pinned to a 40-character SHA. A grep for anything not pinned found nothing.
- Two workflows use `pull_request_target`: `labels.yml:6` and `pull_request_title_lint.yaml:4`. Neither checks out the PR's code. There are no inline `# zizmor: ignore[...]` comments anywhere.

**Traits**

| Key | Value | Mark | Evidence |
| --- | --- | --- | --- |
| `forge.gate` | `blocking` | observed (inferred) | the `merge_group` trigger in `pull_request.yml:4` needs required checks; the ruleset itself was not read |
| `forge.audit` | `zizmor` | observed | `actions_linter.yml:12-30` runs zizmor-action on `pull_request` and on `push` to main |

**Status:** `accepted`

**Departures from the recommendation:** none. Both values match what the ADR recommends, so the reason section would say it was adopted as is.

**Gaps that would be listed after ruling, not departures:**
- The current zizmor job has `min-severity: high` and `min-confidence: high`, which hides lower findings. The ADR's check runs `zizmor --offline --no-config` and fails on any finding without an inline ignore.
- The two `pull_request_target` workflows have no inline ignore. They would likely be flagged as `dangerous-triggers`. I couldn't confirm this: zizmor is not installed here, or at least the check for it was not approved.

`authors:` would be "Tristan Rivoallan" (the git user) and `date:` would be 2026-11-15, unless you name other deciders.

No question tool is available here, so please answer directly:

1. Do you agree to rule ADR-0011 `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`?
2. Should `authors:` be `[Tristan Rivoallan]`, or someone else?
3. Optional: can you approve the read-only `gh api repos/biomejs/biome/rules/branches/main` call? It would check that the required-checks ruleset exists, so `forge.gate` can be marked observed directly rather than inferred from the merge queue.

I won't write anything until you answer.

## ADR-0023

Ruling inferred from the repository; nothing written yet.

**What the repository does today**
- `Cargo.toml:12`: `license = "MIT OR Apache-2.0"`
- `package.json:15` (root manifest): `"license": "MIT OR Apache-2.0"`. `packages/@biomejs/biome/package.json:14` says the same.
- Licence files at the root: `LICENSE-MIT` and `LICENSE-APACHE`, both tracked, both with the full text. The copyright line in `LICENSE-MIT` is "Biome Developers and Contributors" (Rome Tools, Inc. for 2020–2023). There is no `pyproject.toml`.
- `README.md:91` says "MIT licensed … or Apache 2.0 licensed".
- History: `1c26f3f81b chore: add Apache 2.0 license to npm packages (#745)`, `56bccc842e chore: tidy-up licenses (#3438)`. The dual licence was chosen on purpose.

**How it differs from the recommendation**
1. **Value:** the recommendation is `MIT`. The repository uses `MIT OR Apache-2.0`, the usual dual licence in the Rust ecosystem, which gives users the Apache patent grant as an option. Both the ADR's text ("Apache-2.0 when an explicit patent grant matters") and its Alternatives section allow for this.
2. **File name:** governance fixes the licence file name as `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`. The repository uses `LICENSE-MIT` and `LICENSE-APACHE`. The check would fail as things stand: `node_modules/trivoallan/dist/ontrack-engineering-check.js:822` lists only those four names, and the error is raised at line 874.

**Proposed ruling**
- `status: accepted`
- `license.spdx: MIT OR Apache-2.0` (observed). Evidence: `package.json:15`, `Cargo.toml:12`, `LICENSE-MIT`, `LICENSE-APACHE`.
- `date: 2026-11-15`, `authors: [Tristan Rivoallan]`
- Departures written into the ADR:
  - The dual licence instead of MIT. Biome has shipped under it since #745, and it is the Rust ecosystem convention.
  - The `LICENSE-MIT`/`LICENSE-APACHE` file pair instead of a single `LICENSE`. One file cannot hold both texts in the usual dual-licence layout.

I'm not proposing `rejected`, because the question clearly applies here.

**Open point:** you can either keep the two files and accept that `ontrack check` fails on ADR-0023 until governance accepts `LICENSE-*`, or add a root `LICENSE` that points to both files. If you choose the second, the ruling stays the same, and it becomes a follow-up item.

**Do you agree with this ruling (accepted, `MIT OR Apache-2.0`)?** Tell me if you'd prefer different authors, or `MIT` alone.

**Rulings the repository does not follow yet** (once this is accepted)
- `[trivoallan/ADR-0023] license.spdx: no root LICENSE, LICENSE.md, LICENSE.txt or COPYING file; the check fails on LICENSE-MIT/LICENSE-APACHE`. It serves ADR-0023 (License).

The `tracking` trait is undecided (ADR-0014 is listed under "Not yet decided" in AGENTS.md), so I'm only giving this list here and creating nothing in a tracker. I couldn't check for duplicates.

## ADR-0025

I've read ADR-0025 in full and checked how this repository installs tools that aren't declared in its package manifests. Here is the proposed ruling. Nothing has been written yet.

## What the repository does today

**No accepted ADR names a tool yet.** Only ADR-0001 is accepted: line 5 of every other ADR in `docs/adr/trivoallan/` says `status: proposed`. The `status: accepted` lines that grep finds further down those files are the filled-in examples inside each file. So ADR-0011 (`forge.audit`, recommended `zizmor`), ADR-0015 (`secrets.guard`, recommended `gitleaks`) and ADR-0019 don't name any tool yet.

**The repository does use tools that aren't in its manifests, but nothing pins them in one place:**
- **No tool manager:** there is no `mise.toml`, `aqua.yaml` or `.tool-versions`, and no commit in the history adds one.
- **`justfile:13-23` (`install-tools`):** runs `cargo install cargo-binstall` with no version, then `cargo binstall cargo-insta@1.48.0 wasm-opt cargo-deny` and `wasm-bindgen-cli --version 0.2.117`. Some tools have a version, some have none, and none has a checksum.
- **`just` itself:** installed in three different ways.
  - In CI, `extractions/setup-just@53165ef…` is pinned by hash but gets no `just` version (for example `.github/workflows/beta.yml:175`).
  - The devcontainer uses `"version": "latest"`.
  - `CONTRIBUTING.md:120-126` says `cargo install just` or "an OS package manager".
- **`cargo-deny`:** installed with `taiki-e/install-action@f7e5d7c…` and `tool: cargo-deny`, with no version (`pull_request.yml:106`, `main.yml:106`).
- **`wasm-pack`:** installed with `curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh`, with no pin (`release_js_api.yml:63`, `release_cli.yml:210`).
- **`zizmor`:** only runs through `zizmorcore/zizmor-action@cc914d7…` (`actions_linter.yml:26`). No local binary is set up.
- **No hooks:** there is no `.husky`, lefthook or pre-commit config, so no local hook installs anything.
- **Updates:** Renovate runs from `.github/renovate.json5`. Its only custom regex manager covers `rust-toolchain.toml`, and nothing updates the pins of these tools.

## The ADR's condition

"`none` is an answer only when no accepted ADR names such a tool." That condition holds today, because no ADR except ADR-0001 is accepted (see above).

## Proposed ruling

- **Status:** `accepted`
- **`tools.manager: none`** (observed). No accepted ADR names a tool, and the repository has no single place that pins such tools. It handles each tool where it runs, as described above.

**Differences from the recommendation:**
- **The value:** the recommendation is `script` for one tool, or `mise`/`aqua` for several. `none` is the answer the ADR itself allows when there are zero tools.
- **Rule 4 (what keeps the pins current):** with no pinned tools, there is nothing to update. The ADR would say so.
- **What this means later:** with `none`, this ADR's check fails as soon as an accepted ADR names a tool. So accepting ADR-0015 with `gitleaks`, or ADR-0011 with `zizmor`, would mean superseding this ruling. In that case `mise` would fit: there would be at least two tools, Renovate already runs here, and its `mise` manager also updates `mise.lock`.

**Alternative:** rule `mise` now (absent). This would mean adding `mise.toml` and `mise.lock`, pinning mise's own install, and having hooks, CI and sessions call it. It would cover none of today's tools until an ADR names them.

## Not proposed: `rejected`

The question does apply here. The repository uses such tools, and two proposed ADRs would name one.

Do you agree to rule `tools.manager: none`, or would you rather rule `mise` (or something else)? Once you agree, I'll fill in the ADR and run `npx ontrack apply`, then move on to the list of rulings the repository doesn't follow yet.