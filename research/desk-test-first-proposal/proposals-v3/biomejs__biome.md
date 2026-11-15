=================== biomejs__biome ADR-0002
Now gather evidence on the repository's languages.

I read the ADR in full and checked the repository's commits, docs, code and comments. Everything is in English, but no file in the repository says it must be.

**What the repository does today**
- **Commits:** all 11,762 commit subjects in `git log` are English conventional commits (for example `fix(parse/js): don't panic on import phase modifier…`). None contains a French accented character. `CONTRIBUTING.md:388` requires the conventional-commit format but does not name a language.
- **Documentation:** `README.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `CHANGELOG.md`, the crate READMEs and `.agents/skills/` are all in English. There are no translated copies such as `README.fr.md`.
- **Code and comments:** the Rust symbols and `//` / `///` comments under `crates/` are English. The only accented characters outside tests are spec references (`§6.2`), the word "façade" (`crates/biome_graphql_semantic/src/semantic_model/model.rs:64`) and a Unicode test string (`crates/biome_unicode_table/src/lib.rs:90`).
- **What's missing:** no file or CI check states a language rule. English is a habit, not a written rule. The user-facing website docs live in a separate repository I can't see from here, so they are not part of this evidence.

**Comparison with the recommendation:** the ADR recommends `default: english` with no overrides, which matches what the repository does. There are no differences, and the ADR's recommendation has no conditions to check.

**Proposed ruling**

Status: `accepted`

- `localization.language.default: english (observed)`: commit history, root and crate docs, Rust symbols and comments are all English.
- `localization.language.documentation: (empty, takes default) (observed)`: all docs in the repository are English.
- `localization.language.commits: (empty, takes default) (observed)`: no non-English commit subjects in 11,762.
- `localization.language.code: (empty, takes default) (observed)`: symbols under `crates/` are English.
- `localization.language.comments: (empty, takes default) (observed)`: comments under `crates/` are English.

**Departures from the recommendation:** none. In place of the instructions block, the ADR would get one line saying the recommendation is adopted as is.

To fill in `date:` and `authors:`, I'd use today's date, 2026-11-15, and `authors: [Tristan Rivoallan]` from the git user, unless you name other people.

Do you agree with this ruling, and with those `date` and `authors` values? I won't edit the ADR or run `npx ontrack apply` until you confirm.
=================== biomejs__biome ADR-0004
Here is my proposed ruling for ADR-0004 (Languages). I haven't changed anything yet.

**What the repository does today**
- **Rust is the main language.** `Cargo.toml:1-4` defines a Cargo workspace with 106 crates under `crates/*` plus `xtask/*`. `rust-toolchain.toml` pins `channel = "1.100.0"` and the `wasm32-unknown-unknown` target.
- **Most of the code is Rust:** 5168 `.rs` files, against 116 `.ts`/`.tsx`/`.js` files (both counts leave out tests and specs). The JS/TS files are thin wrappers and helpers: `packages/@biomejs/runtime`, `js-api`, `backend-jsonrpc`, `packages/prettier-compare`, `packages/tailwindcss-config-analyzer`, benchmark fixtures and `scripts/version-check.ts`.
- **The project chose Rust on purpose.** The commit that added `Cargo.toml` is `f162690c10` (2021-09-17), "Begin migration to Rust codebase".
- **Rust is the reference tooling.** `CONTRIBUTING.md:100` says building needs a stable Rust toolchain, and `.github/workflows/pull_request.yml` and `publish-crates.yml` are among the workflows. The Node workflows (`pull_request_js.yml`, `pull_request_node.yml`) only cover the npm packages.
- **It ships native binaries.** npm distributes one binary per platform (`packages/@biomejs/cli-darwin-arm64`, `cli-linux-x64-musl`, `cli-win32-x64`, …) and the WASM builds (`wasm-web`, `wasm-nodejs`, `wasm-bundler`).

**How it compares with the recommendation**
The ADR recommends Python or TypeScript. Biome is written in Rust, so that is the one difference. The ADR allows another language if the reason is written down. The two conditions about browser vs. server only decide between Python and TypeScript, so they don't apply here. `rejected` doesn't fit either, because Biome is not a documentation, configuration or infrastructure repository.

**Proposed ruling**

Status: `accepted`

- `languages.main.name: Rust (observed)`: the Cargo workspace (`Cargo.toml:1-4`), the pinned toolchain (`rust-toolchain.toml`), 5168 `.rs` files against 116 JS/TS files, `CONTRIBUTING.md:100`, and the migration commit `f162690c10`.

**Departure from the recommendation, with its reason (this goes in the ADR)**
- **Rust instead of Python or TypeScript.** Biome is a parser, formatter and linter for web languages, and it has to ship as:
  - one native static binary per platform, distributed through the `@biomejs/cli-*` npm packages, with no runtime to install;
  - a `wasm32-unknown-unknown` build for the browser and Node (`@biomejs/wasm-*`).

  Its speed advantage over JavaScript-based tools depends on native code. Neither Python nor TypeScript gives a single static binary or competitive WASM output, and the project moved from TypeScript to Rust in 2021 for these reasons. TypeScript stays as a secondary language for the npm packages and scripts, which doesn't change the answer.

**Also needed before I write the file**
- For `date:` I'll use `2026-11-15` unless you say otherwise.
- For `authors:` I need the names of the people who decided. Is it just "Tristan Rivoallan"?

Do you agree with this ruling (accepted, `languages.main.name: Rust`) and with the reason above? Once you confirm, I'll fill in the ADR and its Consequences, and run `npx ontrack apply`. After that I'll list any parts of the ruling the repository doesn't follow yet and check for a `tracking` trait.
=================== biomejs__biome ADR-0006
Checking which scope convention recent commits converge on.

I couldn't run `npx ontrack review` because the approval was declined, so I followed the ADR's own ruling steps (lines 77-92) and your instructions.

## What the repository does today

- **Format**: `CONTRIBUTING.md:386-414` adopts Conventional Commits and lists 11 types. They are not governance's 11: the repo adds `release` and has no `style`. Pull request titles are checked in CI by `amannn/action-semantic-pull-request` (`.github/workflows/pull_request_title_lint.yaml`). That check uses the same type list, makes scopes optional (`requireScope: false`), and blocks only the `release` scope and uppercase scopes. `CONTRIBUTING.md:418` says the PR title becomes the squash commit message.
- **Tool**: there's no commitlint, no `@commitlint/*` dev dependency, and no local hook. I searched `.github`, `package.json`, `justfile` and looked for lefthook or husky; the only matches were the PR-title workflow and `release.yml`. Nothing checks the individual commits.
- **Versions**: versions come from changesets, not from commit messages (`CONTRIBUTING.md:430`, `.changeset/config.json`). The condition behind the commitlint recommendation is therefore **false**.
- **Scopes**: no list exists anywhere. Over the last year (2,914 commits), scopes have drifted in exactly the way the ADR describes:
  - Markdown parser: `markdown_parser` (43), `markdown-parser` (19), `md/parse` (6)
  - Formatting: `format/html` (34), `fmt/md` (7), `md/fmt` (11), `css_formatter` (63)
  - Linting and analysis: `lint` (377), `linter` (44), `analyzer` (17), `analyze` (16), `js_analyze` (27), `biome_js_analyze` (14)
  - Single rule names: `useSortedClasses` (18), `organizeImports` (13)
- **Recent trend**: the last 300 commits mostly use `<area>` or `<area>/<language>`, for example `lint`, `lint/css`, `format/html`, `parse/js`, `deps`.

## Proposed ruling

**Status: `accepted`**. It isn't `rejected` because the repo is clearly multi-area and already uses scopes heavily.

- `commits.tool: none (observed)`: there's no commitlint or hook. Versions come from changesets (`CONTRIBUTING.md:430`), so the premise for commitlint fails. PR titles stay checked in CI by action-semantic-pull-request (`pull_request_title_lint.yaml`).
- `commits.scopes: [lint, format, parse, analyze, cli, lsp, core, deps, inference, migrate, codegen, plugins, grit, service, rowan, xtask] (absent)`: no list exists today. These words are the most frequent areas in `git log`, with the drifting synonyms merged into one word each.

## Departures from the recommendation

1. **`commits.tool: none` instead of `commitlint`**: the recommendation only applies when versions are generated from commit messages, and here they come from changesets.
2. **The existing CI check is not covered by any allowed value.** The PR-title lint is not commitlint, and the ADR offers no value for it, so `none` is the closest honest answer. I'd note this in the ADR as what currently enforces the format.
3. **Types are outside this ruling, but they differ from governance**: the repo allows `release` and does not allow `style`. This is a divergence from the governance format, recorded here rather than ruled.

## Questions before I write anything

1. **Scope shape.** Should the list allow only single words (above), which would turn existing `lint/js` and `format/html` titles into `lint` and `format`? Or should it list the compound `<area>/<language>` forms the recent history uses? A third option is `[]` (no scopes), which would refuse 377+ uses of `lint`. I recommend single words.
2. **The scope list itself.** Do you want to add or remove any words, for example language words like `css`, `html`, `markdown`?
3. **Tool.** Do you agree with `none`, or do you want commitlint added anyway, which would mean a new dev dependency and a CI job?
4. **Authors.** What names go in `authors:` (no email addresses)? I'll use `2026-11-15` for `date:`.
=================== biomejs__biome ADR-0009
Now the repository's current practice.

Gathering is done; now I'm tallying the prefixes on the remote branches before I draft the ruling.

# ADR-0009 (Branching): proposed ruling

## What the repository does today

**Model.** Work happens on a short branch with one pull request per change, merged into `main`. There is also a long-lived `next` branch. Features that affect end users and rule promotions target `next` (`CONTRIBUTING.md:422-426`), and `next` is merged into `main` at each minor or major release (`CONTRIBUTING.md:524-526`). There are no `develop`, `release/*` or `hotfix/*` branches. CI runs pull-request checks against both branches (`.github/workflows/pull_request.yml:3-8`, which also has a `merge_group` trigger, so a merge queue is in use). Releases come from pushes to `main` (`release.yml:3-6`).

**Merge.** `CONTRIBUTING.md:418` says the PR title "will be used as the default commit message on the squashed commit". The history agrees:
- Since 2026-01-01, `main` has 2370 commits and only 6 of them are merges (`git rev-list --first-parent [--merges] --count`).
- Those merges are `next`→`main` (#11046, #9277) and cherry-pick branches.
- All of the last 300 subjects end in `(#N)`.

The exception is written down: `next`→`main` uses a merge commit, not a squash (`CONTRIBUTING.md:526`). PR titles are linted as Conventional Commits (`.github/workflows/pull_request_title_lint.yaml`), which is the message that matters under `squash`.

**Prefixes.** Nothing checks branch names: no workflow reads the head branch name, and only titles are linted. The remote branches mix two conventions:
- **Commit-type prefixes:** `feat` 52, `fix` 22, `refactor` 8, `ci` 6, `chore` 6, `perf` 2, `docs` 2.
- **Maintainer names:** `dyc3` 80, `dbezrukov` 9, `conaclos` 9, `db` 6.
- **Bots:** `renovate/`, `changeset-release/main`, `coderabbitai/`, `copilot/`, `codex/`, `graphite-base/`, and GitHub's `revert-*`.
- **Others:** `bug/`, `feature/`, `bench/`, `tools/`, and some with no prefix at all.

## Proposed ruling

**Status: `accepted`**

- `branching.model: github-flow (observed)`: one branch, one PR, squash into `main`. The `next` branch is a departure, described below.
- `branching.merge: squash (observed)`: `CONTRIBUTING.md:418`, and 6 merges out of 2370 first-parent commits in 2026. The allowed merge methods are a GitHub repository setting I can't see. Please confirm that only squash is enabled, or that merge commits are allowed only for `next`→`main`.
- `branching.prefixes: [feat, fix, docs, refactor, perf, chore, ci, test, build, revert] (absent)`: no branch-name check exists today, and the largest group of branches (about 104) is named after a maintainer, not a type.

## Departures from the recommendation

1. **The `next` branch.** None of the three models fits it exactly. `github-flow` is the closest, and `gitflow` would mean adding `develop`, `release` and `hotfix` branches the project doesn't use. I would add one line to the ADR: "`next` is a long-lived pre-release branch; feature PRs target it per `CONTRIBUTING.md`, and it is merged into `main` with a merge commit at minor or major releases."
2. **Prefixes: ten instead of three.** The PR-title lint already allows these types, and existing branches already use `refactor/`, `perf/`, `chore/` and `ci/`. `style` is left out because the title lint doesn't allow it. The lint also allows a `release` type that isn't among the eleven; that belongs to ADR-0006.
3. **Compliance gap.** Once this is accepted, `ontrack check` would fail on:
   - maintainer-named branches (`dyc3/…` and the others);
   - `changeset-release/main`, because the check only exempts `release-please--` and `releaser-pleaser--`;
   - `coderabbitai/`, `copilot/`, `codex/` and `revert-*`.

   No CI job runs `ontrack check` today, so nothing breaks right away. Adopting the ruling still means maintainers would stop using their personal namespaces. If you'd rather keep them, the alternative is `rejected`, with `CONTRIBUTING.md` and the PR-title lint standing in. I don't recommend it: the question does apply here.

## Your decision

- **A.** Accept as proposed.
- **B.** Accept with different values; tell me which, for example the three recommended prefixes.
- **C.** Reject, with `CONTRIBUTING.md` and the PR-title lint standing in.

Also, which names should go in `authors:`, and can you confirm the merge methods enabled in the GitHub settings? I'll write nothing until you answer.
=================== biomejs__biome ADR-0011
Now the repository's current state.

Next I'm putting together the proposed ruling for ADR-0011. I've read the ADR in full and checked the repository's workflows. I couldn't check the one GitHub setting it depends on.

## What the repository does today

- **Forge:** GitHub (`git remote -v` → `github.com/biomejs/biome`). It has 25 workflows in `.github/workflows/`, so `rejected` and `none` don't apply.
- **Gate:** the intent is written down. `GOVERNANCE.md:231` says "All code must go through Pull Requests (PR) and pass status checks before being merged." No file in the repository can show whether a ruleset actually makes checks required on `main`. My read-only call `gh api repos/biomejs/biome/rules/branches/main` was not approved, so I could not see it.
- **Audit:** zizmor is already running. `.github/workflows/actions_linter.yml`:
  - runs on `pull_request` (all branches) and on `push` to `main`;
  - uses `zizmorcore/zizmor-action@cc914d7f…` (v0.6.4), pinned by SHA;
  - sets `permissions: {}` at workflow level and `persist-credentials: false`;
  - is filtered with `min-confidence: high` and `min-severity: high`.
- **Rule 3 (pinning):** every `uses:` in every workflow is pinned by commit SHA, including the `actions/*` ones. Renovate updates them (`.github/renovate.json5`, commits `chore(deps): update github-actions`).
- **Rule 5:** `labels.yml` and `pull_request_title_lint.yaml` run on `pull_request_target`. Neither one checks out code, so the rule holds in substance. There are no inline `# zizmor: ignore[...]` comments anywhere.
- **Tooling:** zizmor isn't installed locally (`which zizmor` → not found). `actionlint` is in `~/.local/bin`.

## Differences from the recommendation

1. **zizmor rule 2 (silence a finding only inline):** not followed. The `min-severity: high` and `min-confidence: high` filters hide findings in bulk, not one line at a time with a reason. `ontrack check` runs `zizmor --offline --no-config` without those filters, so it will report everything they hide now.
2. **The two `pull_request_target` workflows:** zizmor flags this trigger (`dangerous-triggers`). They need inline ignores with a reason, for example "no checkout of the PR head". Otherwise the check fails.
3. **`forge.gate`:** whether a ruleset makes checks required is a GitHub setting I couldn't see, so I left that value unmarked.

## Proposed ruling

- **status:** `accepted`
- `forge.gate: blocking` (not marked): `GOVERNANCE.md:231` states the intent; whether a ruleset on `main` requires the checks is held on GitHub and I couldn't read it.
- `forge.audit: zizmor (observed)`: `.github/workflows/actions_linter.yml` runs `zizmorcore/zizmor-action`, pinned by SHA, on every pull request.

**Departures from the recommendation:** none in the trait values. The filters and the missing inline ignores are rulings this repository doesn't follow yet, not departures. If you'd rather keep the severity filters as a deliberate choice, that would be a departure, and its reason would go in the ADR.

Two questions before I write anything:

1. **Ruleset:** does a ruleset or branch protection on `biomejs/biome` `main` require the CI checks (and is zizmor among them)? It's under Settings → Rules → Rulesets, or you can approve `gh api repos/biomejs/biome/rules/branches/main`. Should I record `blocking`, or `informative`?
2. **Ruling:** do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`, adopted as recommended? Or should the severity filters be recorded as a departure? Please also tell me which name or names to put in `authors:`.
=================== biomejs__biome ADR-0023
I've read the ADR and checked how the repository is licensed today. My proposed ruling is below, and I'll wait for your answer before writing anything.

## What the repository does today

- **It already declares a licence: `MIT OR Apache-2.0`.**
  - `Cargo.toml:12` has `license = "MIT OR Apache-2.0"`.
  - `package.json:15` has `"license": "MIT OR Apache-2.0"`. Your uncommitted change to that file only adds the `trivoallan` dev dependency; the licence line is unchanged.
  - `packages/@biomejs/biome/package.json:14` declares the same value and ships both licence files.
  - `README.md:91` says "MIT licensed … or Apache 2.0 licensed".
- **The licence texts are committed at the root, but under different names.** They are `LICENSE-MIT`, there since the initial commit `1a81dfc0be`, and `LICENSE-APACHE`, added in `1c26f3f81b` (#745). There is no file named `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`.
- **The copyright holder is "Biome Developers and Contributors"**, from `LICENSE-MIT` line 3. A second line credits Rome Tools, Inc. for 2020–2023.
- There is no `pyproject.toml`, so the ADR's Python condition does not apply.
- **No CI job checks the licence today.**

## How it compares with the recommendation

1. **The value differs.** The ADR recommends `MIT`; the repository uses `MIT OR Apache-2.0`. The ADR says any SPDX expression is a valid answer.
2. **The file names differ.** The ADR asks for one licence file named `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`. The check accepts only those names (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822`, `:870`), so it will fail on this repository. The manifest part of the check would pass.

The ADR has no other conditional recommendation to settle.

## Proposed ruling

**Status: `accepted`**

- `license.spdx: MIT OR Apache-2.0 (observed): Cargo.toml:12, package.json:15, packages/@biomejs/biome/package.json:14, LICENSE-MIT, LICENSE-APACHE`

**Departures from the recommendation:**

- **`MIT OR Apache-2.0` instead of `MIT`.** This has been the published licence since #745, and existing users rely on the Apache-2.0 patent grant. Changing it would not affect versions already released.
- **The licence texts stay in `LICENSE-MIT` and `LICENSE-APACHE`.** A dual licence needs both full texts, and the published npm package lists those two names in its `files`. The ruling doesn't rename them, so the check will fail until a file it accepts exists, for example a short `LICENSE` that points to both texts. I'd list that as a ruling the repository doesn't follow yet.

## Needed from you

1. Do you agree with `accepted` and `license.spdx: MIT OR Apache-2.0`, or would you rule otherwise?
2. What should go in `authors:`, the names of the people deciding? I'll set `date:` to 2026-11-15.
=================== biomejs__biome ADR-0025
Still reading tooling evidence; next I check the hooks and what ADR-0015/ADR-0011 recommend.

I have the evidence I need. Here is the proposed ruling for `docs/adr/trivoallan/ADR-0025-tools.md`. I haven't changed anything yet.

## What the repository does today

**No tool manager or pinning script.** There is no `mise.toml`, `mise.lock`, `.tool-versions`, `aqua.yaml` or `aqua-checksums.json`, and no script that pins a binary by checksum. Checked with `ls` at the repository root.

**No git hooks.** `.git/hooks` holds only the sample files, and `package.json` has no husky, lefthook or `prepare` entry.

**Each tool is installed the way the place it runs suggests**, which is the situation this ADR describes:

| Place | How it installs | Version pinned? | Checksum? |
| --- | --- | --- | --- |
| Workstation | `justfile:12-17` `install-tools`: `cargo install cargo-binstall`, then `cargo binstall cargo-insta@1.48.0 wasm-opt cargo-deny` and `wasm-bindgen-cli --version 0.2.117` | Only cargo-insta and wasm-bindgen-cli | No |
| Workstation | `CONTRIBUTING.md:123`: `cargo install just` | No | No |
| Runner | `moonrepo/setup-rust` `bins:`, for example `pull_request_node.yml:40` (`wasm-bindgen-cli@0.2.117, wasm-opt`), `pull_request.yml:129` (`cargo-nextest`), `benchmark.yml:283` (`cargo-codspeed`) | Only wasm-bindgen-cli | No |
| Runner | `taiki-e/install-action` with `tool: cargo-deny` (`main.yml:106`, `pull_request.yml:106`, and others) | The action is pinned by SHA, the tool is not | No |
| Runner | `curl https://rustwasm.github.io/wasm-pack/installer/init.sh \| sh` (`release_cli.yml:210`, `release_js_api.yml:63`) | No | No |
| Runner | `cargo install wasm-tools` (`beta_js_api.yml:52`) | No | No |
| Dev container | `.devcontainer/devcontainer.json`: `just` feature `"version": "latest"` | No | No |

**zizmor** runs only in CI, through `zizmorcore/zizmor-action@cc914d7…` (`actions_linter.yml:26`). That is an action, which ADR-0011 rule 3 covers, not this ADR. There is no local zizmor. **gitleaks** is not used anywhere.

**The updater is Renovate, not Dependabot.** `.github/renovate.json5` exists and `.github/dependabot.yml` does not. Renovate already uses a regex custom manager for `rust-toolchain.toml`. `wasm-bindgen-cli` is in `ignoreDeps` and is updated by hand (`renovate.json5:57-62`).

## The condition: "`none` is an answer only when no accepted ADR names such a tool"

- **Today:** `grep '^status:'` shows only ADR-0001 as `accepted`. ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`) are still `proposed`. So right now no accepted ADR names a tool, and `none` is technically allowed.
- **If ADR-0015 and ADR-0011 are accepted as recommended:** they name `gitleaks` (`ADR-0015:83`) and `zizmor` (`ADR-0011:69`). That is two tools, so the recommendation becomes `mise` or `aqua`.
- **Without those ADRs:** the repository already handles about eight such binaries in three different ways, so "several" applies either way.

## Proposed ruling

**Status: `accepted`**

- `tools.manager: mise (absent)`: nothing is pinned with a checksum today, and the repository has several tools. Renovate is already the updater (`.github/renovate.json5`), and its `mise` manager also updates `mise.lock`, which covers rule 4 without adding a second bot. aqua's Renovate preset is not documented to update `aqua-checksums.json`.

**Departures from the recommendation:** none. The recommendation for several tools is "`mise` or `aqua`", and this picks mise for the reason above.

**Rule 4, who moves the pins:** Renovate's `mise` manager, which updates `mise.toml` and `mise.lock` in the same pull request.

**Two limits that apply here:**
- `mise.lock` only records a checksum where the backend provides one. Tools pulled in through the `cargo:` backend may end up with a version but no checksum, which rule 1 refuses. Those tools would need a backend that publishes checksums, such as the aqua registry or GitHub releases.
- This ruling requires pinning only the tools an accepted ADR names. Moving the `justfile` and workflow cargo tools into mise is optional.

## I need three things from you

1. **Do you agree with `accepted`, `tools.manager: mise`?** The other options are `aqua`, `script` (only sensible if you plan to pin a single tool), or `none` (only valid while ADR-0011 and ADR-0015 stay unaccepted or rule `none`).
2. **Is Renovate the hosted Mend app or self-hosted?** The configuration lives outside the repository. If it is self-hosted, updating `mise.lock` must be allowed as an unsafe execution, and I'll write that into rule 4.
3. **Authors:** should I write `authors: [Tristan Rivoallan]` (from the git user) with `date: 2026-11-15`?

Once you agree, I'll edit only this ADR: fill the trait, status, date and authors, rewrite Consequences, replace the "How to rule" block with the rule 4 text, then run `npx ontrack apply`. After that I'll list the rulings the repository doesn't follow yet. No `tracking` trait is decided in `AGENTS.md`, so I'll give that list in my reply and create no tracker items.
