=================== biomejs__biome ADR-0002
I found nothing in the repository that argues against the recommendation, so I propose accepting it as written.

**Proposed status:** `accepted`

**Traits:**
- `localization.language.default: english`. Commit subjects are in English (`git log`, e.g. `ee7e535d75 fix(parse/js): don't panic on import phase modifier without a call`). The contributor and agent docs are in English (`CONTRIBUTING.md`, `AGENTS.md`), and so are the Rust code and comments under `crates/`.
- `documentation`, `commits`, `code`, `comments`: left empty, so they all use `default`. Nothing in the repository writes any of them in another language.

**Departures from the recommendation:** none. One thing to note: `packages/@biomejs/biome/` has README translations into 11 languages (`README.fr.md`, `README.ja.md`, `README.zh-CN.md` and others), listed at `README.md:33`. They are copies of the English README, so English stays the language the docs are written in. This doesn't call for a `documentation` override, and only `french` and `english` are allowed values anyway.

**Other fields:** `date: 2026-11-15` and `authors: [Tristan Rivoallan]`, taken from the git user. I'll also rewrite the Consequences section for an English-only, international project and remove the "How to rule" block, leaving one line saying the recommendation was adopted as is.

Do you agree with this ruling, including the authors value? I won't write anything until you confirm.
=================== biomejs__biome ADR-0004
The recommendation (Python or TypeScript) does not fit this repository. I propose a departure: `Rust`.

**Evidence**
- `Cargo.toml:1-4` defines a Rust workspace with `crates/*` (106 crates) and `xtask/*`. `rust-toolchain.toml` pins `channel = "1.100.0"`, with `targets = ["wasm32-unknown-unknown"]`.
- The repository tracks 5,456 `.rs` files, from `git ls-files -- '*.rs'`.
- It tracks 2,324 `.ts`/`.tsx` files, but 2,236 of them are under `crates/`, and those are mostly parser, formatter and linter fixtures. Only about 50 are real TypeScript code: the npm wrappers in `packages/@biomejs` (`js-api`, `backend-jsonrpc`, the per-platform `cli-*` packages), `packages/prettier-compare`, `packages/tailwindcss-config-analyzer`, and a few files in `scripts/`. These are secondary and don't change the answer.
- There are no `.py` files.
- `AGENTS.md` describes Rust conventions only ("Rust Style", "Cargo Dependencies", Rustdoc, `just f`/`just l`).

**Proposed ruling**
- Status: `accepted`
- `languages.main.name`: `Rust`. Evidence: `Cargo.toml`, `rust-toolchain.toml`, and the 5,456 `.rs` files.
- Departure from the recommendation: Python and TypeScript don't give Biome what it needs. Biome is a single native binary per platform, shipped through the `@biomejs/cli-*` packages, and it also compiles to WebAssembly (`wasm32-unknown-unknown`, published as `@biomejs/wasm-*`). It needs that for a fast parser, formatter and linter with no runtime dependency. Its whole analyzer, parser and formatter codebase is already written in Rust. TypeScript stays a secondary language for the npm distribution and JS API packages.
- `date`: 2026-11-15
- `authors`: [Tristan Rivoallan]. Please correct this if other people took part in the decision.

Do you agree with this ruling? If you do, I'll write it into the ADR and run `npx ontrack apply`.
=================== biomejs__biome ADR-0006
## Proposed ruling for ADR-0006 (Commits)

**Status: `accepted`**

This question applies to Biome. The repository has many areas, and `CONTRIBUTING.md:386-414` already requires Conventional Commits.

**Checking the recommendation's condition.** The ADR recommends `commitlint` only "if this repository generates its versions from commit messages". Biome doesn't. Its versions come from changesets: `.changeset/config.json` sets up `@changesets/changelog-github` with a fixed package group, and `CONTRIBUTING.md` has a "Create a changeset" section. So the condition fails, and the ADR itself says `none` is then just as good an answer.

**Traits:**

- **`commits.tool: none`**
  - Versions come from changesets, not commit messages (`.changeset/config.json`).
  - The format is already enforced in CI another way. `.github/workflows/pull_request_title_lint.yaml` runs `amannn/action-semantic-pull-request` on PR titles, and the PR title becomes the commit message when the PR is squash-merged (`CONTRIBUTING.md:418`). All of the last 300 commits on `main` match the format (`git log -300 | grep -vcE '<conventional regex>'` returned 0).
  - Adding `commitlint` would check the same thing twice.
- **`commits.scopes: [lint, format, parse, analyze, deps, cli, lsp, plugins, grit, types, rowan, service, core, codegen, migrate, xtask]`**
  - There is no closed list today. The PR-title lint only blocks the scope `release` and uppercase scopes (`requireScope: false`).
  - The history shows exactly the drift the ADR warns about. In the last 1500 commits, the same areas appear under several spellings:
    - `lint`, `linter`, `analyzer`, `analyze`, `js_analyze`
    - `format/js` and `formatter`
    - `css_formatter`, `css_parser`, `parse/css`
    - `md`, `markdown`, `md/parse`, `markdown_parser`
    - `inference`, `type_inference`, `types`
  - Rule names are also used as scopes (`useSortedClasses`, `noUnusedVariables`).
  - The proposed list keeps the area words that recur most in those 1500 commits (`lint` 302, `deps` 113, `cli` 33, `codegen` 20, `core` 15, `rowan` 14, `migrate` 14, `analyze` 14, `grit` 13, `xtask` 11, `lsp` 11, and so on). It folds each set of synonyms into one word and drops rule names.

**Departures from the recommendation:** none. `none` is the answer the ADR gives when its condition fails. Biome's actual enforcement (the PR-title lint) gets written into the ADR in place of the "How to rule" block.

**Two decisions for you:**

1. **The slash sub-scopes.** Recent commits often name the language after a slash (`lint/js`, `format/html`, `parse/css`). The ADR only allows a list of words. My proposal keeps the first part (`lint`, `format`, `parse`) and lets the language go in the subject line. You could instead list each language combination separately (`lint/js`, `lint/css`, …), which makes a much longer list.
2. **`scopes: []` instead.** That would match the ADR's warning that "a list invented on adoption ages worse than no list". It costs the ability to filter history by area.

**Not a trait, but needs your call later:** the ADR's fixed eleven types include `style` and leave out `release`. Biome's PR-title lint does the opposite: it allows `release`, has no `style`, and the release PR is titled `ci: release` (`.github/workflows/release.yml:69`). That will show up as a ruling this repository doesn't follow once every ADR is ruled.

Do you agree with `accepted`, `tool: none`, and the scope list above? Or do you want sub-scopes, `[]`, or a different list? Please also give the name for `authors:`. I'll write nothing until you confirm.
=================== biomejs__biome ADR-0009
I've read the ADR and checked the repository's history and branches. Here is the ruling I propose.

**Status:** `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | CONTRIBUTING.md:422-426: every change gets its own branch and pull request, aimed at `main`. The release checklist says to merge the long-lived `next` branch into `main` (CONTRIBUTING.md:526). All the merge commits in history come from these `next`/`main` syncs (`Merge pull request #11046 from biomejs/next`, `chore/merge-main-into-next`). There are no `develop`, `release/*` or `hotfix/*` branches, so it is not `gitflow`. |
| `branching.merge` | `squash` | CONTRIBUTING.md:418: the PR title "will be used as the default commit message on the squashed commit after merging". Recent `main` commits are each a single `type(scope): … (#PR)`. |
| `branching.prefixes` | `[feat, fix, chore, refactor, perf, ci, docs, test]` | These are the commit types actually used since 2026-01-01 (`git log --no-merges`): fix 880, feat 826, chore 456, refactor 117, perf 109, ci 88, docs 57, test 40. `feat/`, `fix/`, `chore/`, `refactor/`, `perf/`, `ci/` and `docs/` already appear as branch prefixes on `origin`. |

**Departures from the recommendation:**
- **`prefixes`:** I widened the list from `[feat, fix, docs]` to the eight types this repository uses for real work. With only three, most of its PRs (chore, refactor, perf, ci, test) would need a branch name that hides what they carry. `revert`, `style` and `build` are left out because they are rare or unused (4, 0 and 0 commits).
- **`model`:** it stays `github-flow`, but the reason should mention the long-lived `next` branch. In Biome, a branch targets `main` or `next` depending on the semver impact of its change. That is still one branch, one PR and one review per change, not gitflow.

**Things to know before you agree:**
- Many existing branches use the maintainer's name as the prefix (`dyc3/…` is about 70 branches; there are also `conaclos/`, `dbezrukov/` and `db/`), or a tool's name (`coderabbitai/`, `copilot/`, `codex/`). Once this is accepted, the `check:` would reject these. To keep them, rule `prefixes` anyway and accept that the repository doesn't follow it yet; it would then appear in the not-followed list.
- The `renovate/` and `changeset-release/main` branches pass only once ADR-0012 and ADR-0018 are ruled. Both are still proposed.

Do you agree with this ruling, or would you like a different `prefixes` list? Also, which names should go in `authors:`? I'll write nothing until you confirm.
=================== biomejs__biome ADR-0011
I've finished checking the evidence for ADR-0011. Here is the ruling I propose. Nothing is written yet.

**Proposed ruling: `accepted`. Both recommended values stand, with no departures.**

The question applies here. `origin` is `https://github.com/biomejs/biome.git` and the CI lives in 25 workflows under `.github/workflows/`, so `rejected` doesn't fit.

| Trait | Value | Evidence |
|---|---|---|
| `forge.gate` | `blocking` | 9 workflows trigger on `merge_group`, including `pull_request.yml:4`, `pull_request_js.yml` and `autofix.yml`. That means GitHub's merge queue is on, and it only merges once the required checks pass. I couldn't read the ruleset itself: you didn't approve the `gh api repos/biomejs/biome/rules/branches/main` call, so the required-check setup is inferred, not confirmed. |
| `forge.audit` | `zizmor` | `.github/workflows/actions_linter.yml` already runs `zizmorcore/zizmor-action@cc914d7…` (v0.6.4), pinned by SHA, on every `pull_request` and on pushes to `main`. |

The ADR also asks for `date: 2026-11-15`, `authors: [Tristan Rivoallan]`, rewritten Consequences, the "How to rule" block deleted, and one line saying the recommendation is adopted as is. There is no `forge.review` key to remove.

Some things the repository doesn't follow yet. These are for the tracking step later, not departures from the ruling:
- **CI filters zizmor's findings.** `actions_linter.yml` passes `min-confidence: high` and `min-severity: high`. The ADR only allows silencing a finding inline on its line, and there are no `# zizmor: ignore[...]` comments anywhere. So `ontrack check`, which runs `zizmor --offline --no-config`, may report findings that CI hides.
- **Two workflows use `pull_request_target`:** `labels.yml:6` and `pull_request_title_lint.yaml:4`. Neither checks out code, so rule 5 doesn't look broken, but zizmor's `dangerous-triggers` audit will flag them unless they get inline ignores.
- **zizmor isn't installed locally** (`which zizmor` returned nothing), so `ontrack check` can't run the audit yet.

Do you agree with `accepted`, `forge.gate: blocking`, `forge.audit: zizmor`? If you want the ruleset confirmed first, approve the `gh api` call and I'll check it before writing.
=================== biomejs__biome ADR-0023
The ADR recommends `MIT`, and the repository already shows that it doesn't apply here. Biome is dual-licensed under `MIT OR Apache-2.0`:

- `Cargo.toml:12`: `license = "MIT OR Apache-2.0"`
- `package.json:15`: `"license": "MIT OR Apache-2.0"` (the uncommitted change to `package.json` only adds a dev dependency, not the licence)
- `packages/@biomejs/biome/package.json:14`: same value. It ships `LICENSE-APACHE`, `LICENSE-MIT` and `ROME-LICENSE-MIT`.
- The root holds `LICENSE-APACHE` and `LICENSE-MIT`. The copyright line in `LICENSE-MIT` reads "Biome Developers and Contributors" and "Rome Tools, Inc.".

No condition needs checking: the ADR's guidance on picking `UNLICENSED` or `Apache-2.0` is advice, not an "if this repository…" condition.

**Proposed ruling**

- **Status:** `accepted`
- **`license.spdx`:** `MIT OR Apache-2.0`. This is the licence the root manifests already declare, so the ruling records it rather than changing it.
- **Departure from the recommendation:** `MIT OR Apache-2.0` instead of `MIT`. Biome already ships under this dual licence, and relicensing it to MIT alone would need every contributor's agreement. The Apache-2.0 option also gives users the explicit patent grant.
- **`date:`:** 2026-11-15
- **`authors:`:** you need to confirm who decided. I'd propose `[Tristan Rivoallan]`, the git user.

One mismatch for the follow-up stage: the ADR's check accepts only `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING` at the root (`node_modules/trivoallan/dist/ontrack-engineering-check.js:822`). Biome's `LICENSE-MIT` and `LICENSE-APACHE` match none of those names, so `ontrack check` will fail once this ADR is accepted. I'll list it as an unfollowed ruling, not as a departure. You could also note in the ADR that dual-licence files under those names are intended.

Do you agree with this ruling? Tell me the `authors:` value too, and whether to add the note about the licence file names.
=================== biomejs__biome ADR-0025
**ADR-0025 (Tools outside the package manager): proposed ruling**

The ADR recommends `script` when the repository uses one such tool, and `mise` or `aqua` when it uses several. This repository uses several, so the recommendation is `mise` or `aqua`. I found nothing here that argues against it.

**How many tools (the condition):**
- `justfile:13-23`: the `install-tools` recipe installs `cargo-binstall`, `cargo-insta@1.48.0`, `wasm-opt`, `cargo-deny` and `wasm-bindgen-cli 0.2.117` with `cargo binstall`. Three of them have a version and none has a checksum. `wasm-opt` and `cargo-deny` have no version at all. `CONTRIBUTING.md:131` tells contributors to run this recipe.
- On the runner, `cargo-deny` is installed by `taiki-e/install-action` with no version (`.github/workflows/main.yml:106-108` and 4 other workflows). `just` is installed by `extractions/setup-just` (`beta.yml:175`, `beta_js_api.yml:46`, `module_replacements.yml:57`). `zizmor` runs through `zizmorcore/zizmor-action` (`actions_linter.yml:26`).
- `.devcontainer/devcontainer.json` installs `just` and Rust at `"version": "latest"`.
- So workstations, the runner and the devcontainer each install these tools their own way, which is the situation the ADR describes.
- Tools named in other ADRs: `gitleaks` (ADR-0015), `zizmor` (ADR-0011) and `grype` (ADR-0019) are only recommendations so far. Those ADRs are still `proposed`, and only ADR-0001 is accepted.

**Proposed ruling**
- `status: accepted`
- `tools.manager: mise`. There are at least six tools (`just`, `cargo-binstall`, `cargo-insta`, `wasm-opt`, `cargo-deny`, `wasm-bindgen-cli`), plus `zizmor` and `gitleaks` if ADR-0011 and ADR-0015 are ruled as recommended. I chose mise over aqua because the repository already uses Renovate (`.github/renovate.json5`, `extends: config:best-practices`). Renovate's `mise` manager updates both `mise.toml` and `mise.lock`, while aqua's checksum file would need a step of its own.
- **Rule 4 (who moves the pins):** Renovate's `mise` manager, with the checksum moving in the same PR as the version.
- **Departures from the recommendation:** none. Choosing mise rather than aqua is a choice within the recommendation, and the reason is the Renovate setup above.

**Before you agree, there are two limits when this gets set up:**
- mise's `cargo:` backend records only a version, with no checksum, which rule 1 refuses. Each tool would have to come through a backend that provides a checksum, such as `aqua:` or `github:` release binaries. If that's done, `cargo-binstall` is no longer needed.
- `wasm-bindgen-cli` must match the `wasm-bindgen` version in `Cargo.lock`. Moving its pin to `mise.toml` leaves two places to keep in step.

Do you agree to rule ADR-0025 `accepted` with `tools.manager: mise`? Or would you prefer `aqua`, or a different status? I'll write nothing until you answer.

The list of rulings this repository doesn't follow yet waits until every ADR is ruled. 25 are still `proposed`.
