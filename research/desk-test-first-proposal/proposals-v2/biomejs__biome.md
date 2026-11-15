=================== biomejs__biome ADR-0002
Now the repository's actual practice on language.

I propose accepting the ADR as recommended: English for everything, with no overrides. Biome already works entirely in English, though no file states that as a rule.

**What the repository does today**
- **Commits:** I checked the last 2000 commit subjects (`git log --format=%s -n 2000`). All are English conventional commits, such as `fix(parse/js): don't panic on import phase modifier without a call (#13180)`. A search for common French words found 0 hits. The CI job `.github/workflows/pull_request_title_lint.yaml` checks the conventional format of PR titles, not their language.
- **Documentation:** `README.md`, `CONTRIBUTING.md`, `GOVERNANCE.md`, `CHANGELOG.md`, the `.agents/skills/*` files and the rustdoc are all in English. There are 11 translated copies of the npm README (`packages/@biomejs/biome/README.{es,fr,hi,ja,kr,pl,pt-BR,ru,uk,zh-CN,zh-TW}.md`). `README.md:33` links to them, with English as the main version. They are translations of the English text, not a second language for writing documentation.
- **Code and comments:** the symbols, comments and diagnostics are in English. I found no French comments in the sampled `crates/**/*.rs`.
- **What's missing:** the repository has no i18n or locale tooling, no `.po`, `.ftl` or `.xliff` files, and no written rule on which language to use. `AGENTS.md` and `CONTRIBUTING.md` never mention one.

**Comparison with the recommendation:** the recommendation is `default: english` with no overrides, and it applies with no conditions. The repository matches it in every medium, so I see no differences.

**Proposed ruling: `accepted`**

| Trait key | Value | Evidence |
| --- | --- | --- |
| `localization.language.default` | `english` | commit history, `README.md`, `CONTRIBUTING.md`, rustdoc and comments |
| `documentation` | empty (takes `default`) | the English README is the main version and the other 11 are translations of it |
| `commits` | empty | 2000 of 2000 recent subjects are in English |
| `code` | empty | Rust symbols are in English |
| `comments` | empty | `//` and `///` comments are in English |

**Departures from the recommendation:** none. In place of the "How to rule" block, I would write one line saying the recommendation is adopted as is. I would also note that the translated READMEs are copies of the English text, not a departure.

**What I would write once you agree:**
- `date:` set to `2026-11-15`.
- `authors:` set to `[Tristan Rivoallan]`, taken from your git user name. Correct this if other people made the decision.
- The Consequences lists rewritten for this repository.
- Then I run `npx ontrack apply` to update `AGENTS.md`.

Do you agree with this ruling, or do you want to change anything first, such as the authors or an override?
=================== biomejs__biome ADR-0004
Now the repository evidence.

ADR-0004 (Languages) is still `proposed`. I recommend accepting it with **Rust** as the main language. That departs from the ADR's recommendation of Python or TypeScript.

## What the repository does today

- **Rust is the core.** `Cargo.toml:1-4` declares a Cargo workspace with `crates/*` and `xtask/*` as members. `crates/` holds 106 crates, and `git ls-files '*.rs'` counts 5456 Rust files.
- **The Rust version is pinned.** `rust-toolchain.toml` pins `channel = "1.100.0"` and adds the `wasm32-unknown-unknown` target.
- **The contributing guide assumes Rust.** `CONTRIBUTING.md:100` says "Building this project requires a `stable` Rust toolchain". `CONTRIBUTING.md:310` says `just f` formats Rust and TOML. `AGENTS.md` already has "Rust Style" and "Cargo Dependencies" sections, and `clippy.toml` and `rustfmt.toml` are at the root.
- **TypeScript and JavaScript are secondary.** `packages/` holds 48 tracked `.ts` files and 3 `.js` files. They are the npm distribution (per-platform `cli-*` packages, `js-api`, `backend-jsonrpc`, `wasm-*`) plus a few helper packages. Their CI runs separately (`pull_request_js.yml`, `pull_request_node.yml`).
- No file names a main language. The repository makes it obvious, but never writes it down.

## Compared with the recommendation

The ADR recommends `Python` or `TypeScript`. The repository is Rust, so that is the one difference. The ADR allows another language if the reason is written down (lines 55-58). Here the reason is that Biome is a native parser, formatter and linter. It has to ship as one static binary per platform (`packages/@biomejs/cli-*`) and also build to WebAssembly (`wasm-*`, `rust-toolchain.toml` targets). It also depends on the Rust crate ecosystem it publishes to (`publish-crates.yml`).

The ADR's recommendation has no conditional clause to check. Its "browser or server" rule for choosing between the two recommended languages doesn't apply, because neither of them is the language here.

`rejected` does not fit: the ADR reserves it for repositories with no main language (line 154), and this one clearly has one.

## Proposed ruling

- **status:** `accepted`
- **`languages.main.name`:** `Rust`. Evidence: `Cargo.toml` workspace, 5456 `.rs` files, `rust-toolchain.toml`, `CONTRIBUTING.md:100`.
- **Departure:** Rust instead of Python or TypeScript. Reason: Biome ships as one static native binary per platform plus WebAssembly builds, and it depends on and publishes to the Rust crate ecosystem. TypeScript stays a secondary language, limited to the npm packages.
- **date:** `2026-11-15`
- **authors:** `[Tristan Rivoallan]`, taken from git config.
- **Consequences:** I'll rewrite them for this ruling. The main change is that ADR-0005 (`zod`/`pydantic`) and ADR-0007 coverage recommendations no longer apply directly to the main language.

Do you agree with this ruling, or do you want to change the value, the authors or the reason? I haven't written anything yet. Once you agree, I'll edit the ADR as its five steps describe and run `npx ontrack apply`.
=================== biomejs__biome ADR-0006
Now the repository's current state: versioning mechanism, commit tooling, and scope usage.

Still gathering evidence: the history uses a lot of drifting scopes, so I'm checking how the repository defines its own areas before proposing a list.

I have the evidence. Here is the proposed ruling for ADR-0006. I haven't written anything yet.

## What the repository does today

- **How versions are set:** Changesets, not commit messages.
  - `.changeset/config.json` configures it.
  - `.github/workflows/release.yml:65` runs `changesets/action`.
  - The project instructions in `AGENTS.md` require a changeset for user-facing changes.
  - So the condition behind recommending `commitlint` ("if this repository generates its versions from commit messages") is **false**.
- **How commit messages are enforced:**
  - Nothing checks individual commits. There is no commitlint config, no `@commitlint/*` in `node_modules`, and no husky or lefthook.
  - The repository does lint **PR titles** in CI: `.github/workflows/pull_request_title_lint.yaml` uses `amannn/action-semantic-pull-request`. Since PRs are squash-merged, the title becomes the commit on `main` (`CONTRIBUTING.md:418`).
- **Scopes:** optional (`requireScope: false`) and never limited to a list. The only rule bans `release` and uppercase.
  - The last 2000 commits use **281 distinct scopes**, with the same drift the ADR describes. Markdown alone appears as `md/fmt`, `fmt/md`, `format/md` and `markdown_formatter`; type inference as `inference`, `type_inference`, `type-inference` and `types`.
  - The most used scopes are `lint` (327), `deps` (175), and then composite forms like `lint/js`, `format/html` and `parse/css`.
  - `.github/labeler.yml` defines its own set of areas: `A-Cli`, `A-Core`, `A-Linter`, `A-Parser`, `A-Formatter`, `A-LSP`, `A-Resolver`, `A-Type-Inference`, and others.

## Differences from what governance fixes (not up for ruling, recorded only)

- The repository allows a `release` type, which is not one of the eleven (`CONTRIBUTING.md:401`, and in the title lint).
- It does not allow `style`, which is one of the eleven.
- The `!` breaking-change syntax was used in 0 of the last 2000 commits.
- 22 of the last 2000 subjects don't follow the format, for example `[autofix.ci] apply automated fixes` and `update snapsthos`. They come in through merge commits, which skip the title lint.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `commits.tool` | `none` | Versions come from Changesets, so the condition for `commitlint` fails. A PR-title lint in CI already guards the squash commit, and commitlint would wrongly flag the intermediate commits on a branch. |
| `commits.scopes` | `[lint, format, parse, analyze, cli, core, lsp, resolver, inference, deps, codegen, plugins, grit, rowan, xtask]` | These are the areas that recur in the history, spelled the way it most often spells them. They line up with `labeler.yml` (Linter, Formatter, Parser, Cli, Core, LSP, Resolver, Type-Inference, Tooling). |

**Departures from the recommendation:**
1. **`tool: none` instead of `commitlint`.** The reason is the failed condition above. What stands in for it is `pull_request_title_lint.yaml`.
2. **A scope list where governance gives none.** With 281 scopes in use, this repository is the case the ADR warns about. One spelling per area (`format` rather than `fmt`, `inference` rather than `type_inference`) is the point of the list.

**Open points to decide:**
- **Language qualifiers.** The history often adds a language after a slash (`lint/js`, `format/html`, `parse/css`). The ADR asks for one word per area. I'd suggest listing only the area words and allowing the `/<language>` suffix as a qualifier. That needs one sentence of explanation in the ADR, since `tool: none` means no tool enforces it.
- **The title lint.** `tool: none` writes down the current state but doesn't connect the scope list to the PR-title lint. Adding the list to `pull_request_title_lint.yaml` would come later, as a tracking item, not in this ADR.

Do you agree with `accepted`, `tool: none` and that scope list? Tell me what to change: the list itself, the language suffix, or the tool (for example, `commitlint` if you'd rather check every commit). I also need the name or names for `authors:`.
=================== biomejs__biome ADR-0009
Still gathering evidence: merge history and branch names are done. Now checking the release and updater tooling that affects the branch-name check.

I'm proposing to accept ADR-0009 with all three keys filled from what the repository already does. One problem: the ADR's branch-name check would fail on several branches this repository uses today. Nothing is written yet; I need your agreement first.

## What the repository does today

- **Model.** Each change gets its own branch and a pull request. Bug fixes, non-user-facing features and nursery rules go to `main`. User-facing features and rule promotions go to a long-lived `next` branch (`CONTRIBUTING.md:422-426`). At a minor or major release, `next` is merged into `main` and then recreated (`CONTRIBUTING.md:526`, `:538`). There are no `develop`, `release/*` or `hotfix/*` branches, so this is not gitflow, and nobody pushes straight to `main`, so it is not trunk-based.
- **Merge.** Pull requests are squash-merged and the PR title becomes the commit message (`CONTRIBUTING.md:418`). In the last 2,000 commits on `main` (since 2026-03-12), 1,987 end in `(#N)`. The only merge commits there are `next` going into `main` (for example `f0f82425cd Merge pull request #11046 from biomejs/next`). `CONTRIBUTING.md:526` asks for a merge commit at that step, not a squash.
- **Branch names.** Nothing enforces them: no hook, no CI job, no written rule. Of the 251 branches on `origin`, the commit-type prefixes in use are: `feat` 52, `fix` 22, `refactor` 8, `ci` 6, `chore` 6, `perf` 2, `docs` 2. About 100 branches start with a username instead, such as `dyc3/` (80), `conaclos/`, `dbezrukov/` and `db/`. Others come from tools: `renovate/`, `changeset-release/main`, `coderabbitai/`, `copilot/`, `graphite-base/`.
- **Bots.** Releases use Changesets (`.changeset/config.json`, `changesets/action` in `.github/workflows/release.yml`), whose branch is `changeset-release/main`. Dependency updates use Renovate (`.github/renovate.json5`). ADR-0012 and ADR-0018 are both still `proposed`.

## Proposed ruling: `accepted`

| Key | Value | Evidence |
| --- | --- | --- |
| `branching.model` | `github-flow` | One branch and one PR per change into `main` (`CONTRIBUTING.md:422-426`) |
| `branching.merge` | `squash` | `CONTRIBUTING.md:418`; 1,987 of the last 2,000 commits on `main` end in `(#N)` |
| `branching.prefixes` | `[feat, fix, docs, refactor, perf, ci, chore]` | The commit-type prefixes found on `origin` (counts above), all among the eleven allowed types |

## Departures from the recommendation, with reasons

1. **The `next` branch.** It is outside plain github-flow. It holds changes until a minor or major release, then merges into `main` as a merge commit, not a squash (`CONTRIBUTING.md:424-426`, `:526`). It stays because it is how this repository keeps semver promises.
2. **Four extra prefixes: `refactor`, `perf`, `ci`, `chore`.** All four are in use today and all come from the eleven allowed types.
3. **Branches the check would reject.**
   - **Username branches** (`dyc3/…` and similar, about 40% of branches) fail the `<prefix>/<kebab>` form. Accepting this means contributors stop using them.
   - **`next`** fails the check whenever it is a PR head, which happens at every minor or major release.
   - **`changeset-release/main`** fails because the check only exempts `release-please--` and `releaser-pleaser--`, and Changesets isn't one of them.
   - **`renovate/…`** is exempt only once ADR-0018 is ruled `renovate`.

   Unless ontrack can exempt these branches, the check will fail on them. I'll record this in the ADR's Consequences as a known cost.

Do you agree with this ruling, `accepted` with these three values? Or would you change something, for example dropping `chore`/`ci`, or ruling ADR-0012 and ADR-0018 first?
=================== biomejs__biome ADR-0011
Repository is on GitHub and already runs zizmor in CI. Checking pins, `pull_request_target` uses and gating evidence next.

Ruling for ADR-0011 (Forge and continuous integration): **`accepted`**, with both keys set to the recommended values.

I couldn't run `npx ontrack review` or `gh api repos/biomejs/biome/rulesets` because both need your approval. zizmor isn't installed here either, so the ADR's own check (`zizmor --offline --no-config`) hasn't been run.

**What the repository does today**
- **Forge:** GitHub. The remote is `https://github.com/biomejs/biome.git` and there are 24 workflows in `.github/workflows/`. Since this is GitHub, `rejected` doesn't apply.
- **Gate:** the PR workflows trigger on `merge_group:`. That covers 9 files, starting with `.github/workflows/pull_request.yml:4`. GitHub's merge queue is a ruleset feature that only lets a PR through once the required checks pass, so this points to a blocking gate. I haven't seen the ruleset itself.
- **Audit:** `.github/workflows/actions_linter.yml` runs `zizmorcore/zizmor-action@cc914d7…` (v0.6.4, pinned by SHA) on every pull request and on pushes to `main`. It was added in 3465f9aaab (2026-05-20). There is no `zizmor.yml` and no inline `# zizmor: ignore` anywhere.
- **Rule 3 (pin actions):** all 217 `uses:` across the 24 files are pinned by a 40-character SHA.
- **Rule 5 (`pull_request_target`):** it appears in `pull_request_title_lint.yaml:4` and `labels.yml:6`. Neither workflow checks out the proposed code: they run `action-semantic-pull-request` and `actions/labeler`, with read-only or narrowly scoped permissions.
- **Rule 1 (deploy from the default branch):** the jobs with an `environment:` are `crate-publish` and `npm-publish`, in the release, beta and publish workflows. Whether each one is tied to the default branch still needs a manual check.

**Proposed traits**
- `forge.gate: blocking`. Evidence: the `merge_group:` triggers in 9 PR workflows. Confirming that the ruleset exists needs the `gh api` call above.
- `forge.audit: zizmor`. Evidence: `.github/workflows/actions_linter.yml:25-31`.

**How the repository differs from the recommendation**
1. **Thresholds:** the zizmor job sets `min-confidence: high` and `min-severity: high` (`actions_linter.yml:30-31`). That hides findings outside of inline ignores, which rule 2 for zizmor forbids. The ADR's check will still report everything, because it ignores those settings.
2. **zizmor may not block anything:** `actions_linter.yml` has no `merge_group:` trigger, so it is probably not a required check. As far as I know, the action's default mode uploads SARIF to code scanning rather than failing the job. I haven't verified that against the action's documentation.
3. **No local zizmor:** there is no mise config or other local install, so `ontrack check` would fail to find it. Where it should come from is ADR-0025's question.

None of these is a reason to depart from the recommendation, so the ADR would say "adopted as recommended". The three differences would go on the list of rulings the repository doesn't follow yet.

Do you agree to set `accepted` with `forge.gate: blocking` and `forge.audit: zizmor`? If so, I'll also need the `authors:` names. If you'd rather choose `informative` or another value, say which.
=================== biomejs__biome ADR-0023
This repository already answers the licence question: everything it ships is under `MIT OR Apache-2.0`. I propose recording that as the ruling instead of the ADR's recommended `MIT`.

## What the repository does today

- **Root manifest:** `package.json:15` has `"license": "MIT OR Apache-2.0"`. There is no `pyproject.toml`.
- **Cargo:** `Cargo.toml:12` sets `license = "MIT OR Apache-2.0"`, and all 105 crates inherit it with `license.workspace = true`.
- **npm packages:** all 20 `packages/**/package.json` files declare `MIT OR Apache-2.0`.
- **Licence files:** the root has two, `LICENSE-MIT` and `LICENSE-APACHE`. There is no `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`.
- **README:** `README.md:91` says Biome is MIT or Apache 2.0 licensed.
- **History:** Apache-2.0 was added to the npm packages in `1c26f3f81b` (#745), and the licences were tidied up in `56bccc842e` (#3438).
- **Copyright holder:** `LICENSE-MIT` reads "Biome Developers and Contributors" (2023 onwards) and "Rome Tools, Inc." (2020–2023).

## Proposed ruling

- **status:** `accepted`
- **`license.spdx`:** `MIT OR Apache-2.0`, from `package.json:15`, `Cargo.toml:12`, all 20 npm package manifests and the README.

`rejected` doesn't apply: the repository is public and published to npm and crates.io.

## Departures from the recommendation

1. **The value is `MIT OR Apache-2.0`, not `MIT`.** Biome is already published under this dual licence, which is the usual choice in the Rust ecosystem. Users keep the choice of MIT or Apache-2.0's patent grant. Narrowing it to MIT would change the terms for every future release, and that's for the project to decide, not this ADR.
2. **The licence files don't use the names the ADR requires.** It accepts only `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`, so the ADR's check will fail on `LICENSE-MIT` and `LICENSE-APACHE`. I would record this in the ADR as a known gap and list it later as a ruling the repository doesn't follow yet (`[trivoallan/ADR-0023] license.spdx`). I would not rename files that the README and many crate-level `LICENSE` files rely on.

If you agree, I'll fill the ADR:
- `traits.license.spdx`, the status and the date;
- `authors`, for which I'd use your git name, "Tristan Rivoallan", unless you name others;
- rewritten Consequences, with the reasons above in place of the "How to rule" block.

Then I'll run `npx ontrack apply`. Do you agree, and should `authors` be just you?
=================== biomejs__biome ADR-0025
Only ADR-0001 is accepted; I've checked how the repo installs its tools today. One more check on how Renovate runs, then I'll present the ruling.

I'm proposing `accepted`, `tools.manager: mise`. Nothing is written yet; I need your agreement first.

## What the repository does today

The repo uses several tools that aren't in any lockfile. Each place it runs installs them differently, and nothing records a checksum:

| Tool | Workstation | Runner | Devcontainer |
| --- | --- | --- | --- |
| `just` | `cargo install just` or an OS package manager, no version (`CONTRIBUTING.md:123`) | `extractions/setup-just@<sha>`, no `just-version` (e.g. `pull_request_node.yml:59`) | feature `guiyomh/features/just:0`, `version: latest` |
| `cargo-binstall` | `cargo install cargo-binstall`, no version (`justfile:14`) | not used | not used |
| `cargo-insta`, `wasm-bindgen-cli` | binstall with versions 1.48.0 / 0.2.117, no checksum (`justfile:15-16`) | `cargo install wasm-bindgen-cli --version 0.2.117` (`beta_js_api.yml:49`) | not used |
| `cargo-deny`, `wasm-opt` | binstall with no version (`justfile:15`) | `taiki-e/install-action` with `tool: cargo-deny`, no version (`main.yml:106`) | not used |
| `wasm-tools` | not used | `cargo install wasm-tools`, no version (`beta_js_api.yml:52`) | not used |
| `wasm-pack` | not used | `curl … init.sh \| sh` (`release_cli.yml:210`, `release_js_api.yml:63`) | not used |

Other facts that bear on the ruling:
- **No tool manager:** there is no `mise.toml`, `.tool-versions`, `aqua.yaml`, nix file or install script.
- **Rust:** pinned in `rust-toolchain.toml` (1.100.0). That falls under ADR-0004, not this ADR.
- **Updates:** Renovate runs as the hosted app. Its config is in `.github/renovate.json5`, there is no Renovate workflow, and commits are authored by renovate (e.g. `c554f54b94`). There is no `dependabot.yml`.
- **Hooks:** none in `.git/hooks`, and no husky or lefthook in `package.json`. No gitleaks anywhere.
- **zizmor:** runs only through `zizmorcore/zizmor-action@<sha>` (`actions_linter.yml:26`). Actions are outside this ADR.

## The condition the ADR sets

"`none` is an answer only when no accepted ADR names such a tool." Today only ADR-0001 is accepted (`grep -m1 "^status:"` over `docs/adr/trivoallan/*.md`), so `none` is allowed right now. But ADR-0015 (`secrets.guard`) and ADR-0011 (`forge.audit`) are still pending, and accepting either one names a tool. At that point `none` would fail its own check.

## Proposed ruling

- **status:** `accepted`
- **`tools.manager: mise`:** the repo already has at least eight such tools (the table above). For several tools the ADR recommends `mise` or `aqua`.
  - I prefer mise over aqua because Renovate is the updater here, and Renovate's mise manager also updates `mise.lock`. The aqua preset doesn't update the checksum file.
  - The tools above all have mise backends that aren't asdf (aqua, ubi or github, cargo). That lets `mise.lock` hold checksums. Tools from `cargo:` record a version, not a binary checksum, so the ones that ship release binaries should come from `aqua:`/`github:`.
- **Rule 4 (what keeps the pins current):** the hosted Renovate app, which is already configured, through its `mise` manager. It moves `mise.toml` and `mise.lock` in the same PR.
  - Dependabot isn't used here, so ADR-0018's limitation doesn't come up.
  - The hosted app needs no unsafe-execution allowance; that is only needed on a self-hosted Renovate.
- **Departures from the recommendation:** none.

The alternative is `none`. It is valid only until ADR-0015 or ADR-0011 is accepted, and then this ADR would have to be reopened. I don't recommend it.

Do you agree with `accepted`, `tools.manager: mise`, with Renovate's mise manager as the updater? Tell me which authors to list (names only) or whether to use "Tristan Rivoallan". If you prefer `none` or another value, say so.
