I'll start with the survey and write nothing. First I'll read the ADRs and check the repository.
---
I'm reading each ADR in full, starting with ADR-0003, before I check the repository against them.
---
I've read all 25 ADRs. Next I'm gathering evidence from the repository: `package.json`, the workflows, hooks, and file listings.
---
The shell is in `docs/adr/trivoallan`, so I'll run these from the repository root.
---
Three scripts matched my tool-manager search. I suspect the match is "promise" containing "mise", so I'll recheck with word boundaries.
---
I read all 25 ADRs and checked the repository. Nothing has been written. These ADRs are proposed, not decided, and AGENTS.md still carries only ADR-0001 as decided.

I ran these commands:
- `git ls-files '*.js' | wc -l` → 776
- `git ls-files '*.ts' | wc -l` → 6
- `git ls-files src/lib | wc -l` → 109
- `git rev-list --count HEAD` → 4132
- `git log -n 300 --format=%s | grep -cE '\(#[0-9]+\)$'` → 136
- `git log -n 300 --format=%s | grep -cE '^\[[a-z]+\]'` → 156
- `git log -n 300 --format=%s | grep -cE '^[a-z]+\([^)]+\)'` → 1
- `git log -n 300 --format=%B | grep -ci 'co-authored-by'` → 3

## Group 1: every value shown by this repository (6 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 Languages | `languages.main.name` | JavaScript | `shows the value`: `git ls-files '*.js' \| wc -l` gives 776. `*.ts` gives 6 (the handwritten `.d.ts` files and typing tests). A combined count of `.py`, `.go` and `.rs` files gives 0. |
| 0013 Frontend | `frontend.framework` | none, which means ruling `rejected` | `shows the value`: a combined count of `.astro`, `.vue`, `.svelte`, `.tsx`, `.jsx` and `.html` files gives 0. `package.json` lists no UI framework. |
| 0014 Work tracking | `tracking.tool` | github-issues | `shows the value`: `package.json` has `"bugs": "https://github.com/moment/moment/issues"`. |
| 0014 Work tracking | `tracking.project` | moment/moment | `shows the value`: `package.json` has `"repository": "github:moment/moment"`. |
| 0016 Changes | `changes.framework` | none | `shows the value`: there is no `openspec/` directory, and `git grep -i openspec` finds nothing. |
| 0016 Changes | `changes.schema` | none | `shows the value`: same evidence. |
| 0023 License | `license.spdx` | MIT | `shows the value`: `package.json` has `"license": "MIT"`. `composer.json` and `bower.json` say the same, and the root `LICENSE` holds the MIT text. |
| 0025 Tools | `tools.manager` | none | `shows the value`: `git ls-files 'aqua*' 'mise*' '.tool-versions'` gives 0. No script installs tools. A word-boundary search for aqua, mise, asdf and brew in scripts, workflows, hooks and docs finds nothing. |

## Group 2: at least one value not shown (19 ADRs)

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 Localization | `language.default` | A convention among contributors | `next to it`: README, CONTRIBUTING and RELEASING are in English. |
| 0002 | `documentation`, `commits`, `code`, `comments` | Contributor convention (empty means same as default) | `next to it`: commit subjects are English. I did not sample symbols or comments. |
| 0003 Architecture | `architecture.pattern` | A design choice; no file states it | `next to it`: 109 files under `src/lib`, built into one bundle, with no I/O layer. |
| 0005 Validation | `validation.boundary` | A design choice | `next to it`: `package.json` has no `dependencies` key, so no validation library. Parsing is handwritten in `src/lib/create/*`. |
| 0006 Commits | `commits.scopes` | A choice people make | `next to it`: history uses `[bugfix]`-style tags (156 of the last 300 subjects) and only 1 subject has a scope. |
| 0007 Tests | `tests.coverage_target` | Coveralls settings, outside the repository | `next to it`: `test:coverage` runs `nyc` with no `--check-coverage`, and `coverage.yml` reports to Coveralls. |
| 0008 Documentation | `docs.root` | A choice | `next to it`: `docs/` holds only `adr/`. The user documentation is on momentjs.com, a separate repository (named in `ISSUE_TEMPLATE/config.yml`). |
| 0008 | `docs.audience` | Repository visibility, on GitHub | `next to it`: the package is published publicly on npm (`files`, `homepage`). |
| 0009 Branching | `branching.model` | Contributor practice and forge settings | `next to it`: the default branch is `develop`, and `release.yml` pushes `master` at each release. |
| 0009 | `branching.merge` | A GitHub repository setting | `next to it`: 136 of the last 300 subjects end in `(#N)`, which looks like squash merges. There are also 1014 merge commits in 4132. |
| 0009 | `branching.prefixes` | A choice people make | `next to it`: remote branches are `mjp/fix-…`, `maggie/parserrework` and `luizcorreia-hotfix/…`, so no `feat/fix/docs` convention. |
| 0010 Architecture documentation | `architecture.document` | A choice between `none` and `elsewhere` | `next to it`: `docs/architecture/` is absent, so not arc42. CONTRIBUTING has a "Code Organization" section, and `THREAT_MODEL.md` exists. |
| 0011 Forge and CI | `forge.gate` | A GitHub ruleset | `next to it`: `pull-request.yml` has an aggregate "All passed" job, and RELEASING.md mentions a "protected source branch". |
| 0012 Delivery | `delivery.release_notes` | GitHub Releases page | `next to it`: CHANGELOG.md exists, and RELEASING.md describes no release text. |
| 0015 Secrets | `secrets.storage` | Contributors' machines | `next to it`: `.gitignore` lists `.sauce-labs.creds` and `.coveralls.yml`. |
| 0017 Agent tooling | `agent.hosts` | Which agents contributors use | `next to it`: AGENTS.md and `.agents/skills/locale-review` exist. There is no `.claude/settings.json` or `opencode.json`, but an absence doesn't count for this key. |
| 0018 Dependencies | `dependencies.updater` | A GitHub App or setting | `next to it`: no `dependabot.yml` or `renovate.json`, and no bot commit authors in history. |
| 0018 | `dependencies.automerge` | The updater's configuration | `next to it`: no workflow uses `fetch-metadata`. |
| 0019 Vulnerabilities | `vulnerabilities.scanner` | GitHub Dependabot or code-security settings | `next to it`: no scanner workflow. `fossa.yml` scans licenses, not vulnerabilities. |
| 0019 | `vulnerabilities.fail_on` | GitHub ruleset | `next to it`: depends on the scanner. |
| 0020 Adding a dependency | `admission.approver` | A choice people make | None in the repository. |
| 0020 | `admission.install_scripts` | The package manager's defaults | `next to it`: `packageManager` is `pnpm@11.22.0`, and there is no `pnpm-workspace.yaml` or `.npmrc`. |
| 0021 Build provenance | `supply_chain.build_level` | The npm registry | `next to it`: `release.yml` runs `pnpm publish --provenance` with `id-token: write`. |
| 0022 Review and merge | `review.by` | A GitHub ruleset | `next to it`: CODEOWNERS is `* @moment/collaborators`. |
| 0022 | `review.approvals` | The same ruleset | `next to it`: same. |
| 0024 Code scanning | `code_scanning.tool` | GitHub default setup, which leaves no file | `next to it`: no CodeQL workflow. |
| 0024 | `code_scanning.fail_on` | GitHub ruleset | `next to it`: depends on the tool. |
| 0026 Agent identity | `agent.identity` | The maintainer's machine and GitHub account | `next to it`: 3 `Co-Authored-By` trailers in the last 300 commits, and no agent account in history. |

The other values in these ADRs are shown by the repository, so they have no row:
- 0005 `data_files: none`
- 0006 `tool: none`
- 0008 `tool: none` (so `channels` is absent)
- 0010 `model: none`, `diagrams: none`
- 0011 `audit: none`
- 0012 `target: package`, `environments`, `release_tool: manual`, `registry: none`, `manifests: none`
- 0015 `guard: none`
- 0019 `sbom: none`

## Order

I propose the six group 1 ADRs first, in number order (0004, 0013, 0014, 0016, 0023, 0025). The 19 group 2 ADRs follow in number order. Do you agree, or do you want another order? I have no question tool in this session, so please reply in text. You can also skip any ADR, or stop at any point.
