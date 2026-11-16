I'll start by reading every ADR in the list and looking at the repository.
---
Reading the ADRs so far (0002–0012) to survey them. I still have 0013–0026 to read, then I'll check the repository's files and history.
---
Now the repository evidence.
---
The shell was left in the ADR folder. I'll rerun these from the repository root.
---
I read all 25 ADRs and checked the repository. I wrote nothing. No question tool is available in this session, so the question at the end is plain text.

I took the evidence from `package.json`, `pnpm-workspace.yaml`, `.github/workflows/`, `tsconfig.json`, `LICENSE`, `docs/`, and `git ls-files`, `git grep` and `git log`. Each count names its command.

## Group 1: every value shows (8 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0007 Tests | `tests.coverage_target` | `100` | `package.json` `c8: { "check-coverage": true, "lines": 100 }` and `test:coverage` = `c8 pnpm unit`. **shows the value** |
| 0010 Architecture documentation | `architecture.document` | `elsewhere` (`docs/architecture.md`) | `git ls-files docs/architecture.md` lists it, and no `docs/architecture/arc42/` exists. **shows the value** |
| 0010 | `architecture.model` | `none` | `git ls-files` has no `.c4` or `.likec4` file. **shows the value** |
| 0010 | `architecture.diagrams` | `none` | `grep -rliE 'mermaid\|plantuml'` over `docs` and `README.md` finds only the untracked ADR itself. `git ls-files` lists 0 png, svg or jpg files. **shows the value** |
| 0013 Frontend | `frontend.framework` | none, which makes the ADR `rejected` | `package.json` dependencies are `nanoid`, `picocolors` and `source-map-js`, with no UI framework in `devDependencies`. **shows the value** |
| 0014 Work tracking | `tracking.tool` | `github-issues` | `package.json` `bugs.url` is `https://github.com/postcss/postcss/issues`. **shows the value** |
| 0014 | `tracking.project` | `postcss/postcss` | `package.json` `"repository": "postcss/postcss"`. **shows the value** |
| 0016 Changes | `changes.framework` | `none` | `git ls-files \| grep -ciE 'openspec\|mise\.\|aqua'` returns 0, and `package.json` has no openspec dependency. **shows the value** |
| 0016 | `changes.schema` | `none` | Same as the row above. **shows the value** |
| 0018 Dependencies | `dependencies.updater` | `none` | `grep -rniE 'renovate\|dependabot\|automerge'` over `package.json`, `pnpm-workspace.yaml` and `.github` returns nothing, and there is no `.github/dependabot.yml`. **shows the value** |
| 0018 | `dependencies.automerge` | `none` | Same command, and no workflow uses `dependabot/fetch-metadata`. **shows the value** |
| 0023 License | `license.spdx` | `MIT` | `package.json` `"license": "MIT"`, and `LICENSE` opens with "The MIT License (MIT)". **shows the value** |
| 0025 Tools | `tools.manager` | `none` | There is no `mise.toml` or `aqua.yaml` (`git ls-files` count 0), no tool-install script, and the workflows install no binary. **shows the value** |

## Group 2: at least one value not shown (17 ADRs)

Only the values I could not show have a row.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 Localization | `localization.language.default` (the four overrides are empty) | A choice people make | README, CHANGELOG and identifiers are in English, but no file says so. `docs/README-cn.md` is a Chinese translation of the README. **next to it** |
| 0003 Architecture | `architecture.pattern` | A choice people make | `docs/architecture.md` describes a parse, process, stringify pipeline and names no pattern. **next to it** |
| 0004 Languages | `languages.main.name` | A choice people make | `git ls-files` lists 28 `lib/*.js` and 22 `lib/*.d.ts`. `typescript` is a devDependency and `tsconfig.json` has `noEmit`. This looks like JavaScript with hand-written types. **next to it** |
| 0005 Validation | `validation.boundary` | A choice people make | `lib/tokenize.js` and `lib/parser.js` are a hand-written parser, and no validation library is in `dependencies`. **next to it** (`data_files: none` is shown: `git ls-files` has no schema file) |
| 0006 Commits | `commits.scopes` | A choice people make | Of 186 non-merge commits since 2026-01-01, 11 have a Conventional Commits type and 1 has a scope (`git log --since=2026-01-01 --no-merges`). **next to it** (`commits.tool: none` is shown: `git grep` finds no commitlint, and `simple-git-hooks` only has `pre-commit`) |
| 0008 Documentation | `docs.audience` | A choice people make | The repository is public (`origin` is `https://github.com/postcss/postcss.git`). **next to it** |
| 0008 | `docs.tool`, `docs.root`, `docs.channels` (shown as `none`, `docs/` and absent, with one caveat) | Caveat: an `origin/gh-pages` branch exists | No site config and no `actions/deploy-pages` appear in the repository. I can't see what `gh-pages` publishes. **next to it** |
| 0009 Branching | `branching.model` | GitHub settings, plus a choice | Since 2026-01-01 there are 2 merge commits among 188 commits, and 51 of 186 non-merge subjects end in `(#N)`. **next to it** |
| 0009 | `branching.merge` | GitHub repository settings | Same history. **next to it** |
| 0009 | `branching.prefixes` | A choice people make | The remote branches are `feature/esm-plugins`, `gh-pages`, `ose` and `v7`, none with a commit-type prefix. **next to it** |
| 0011 Forge and CI | `forge.gate` | A GitHub ruleset, outside the repository | `test.yml` runs on `pull_request` and on push to `main`. Whether it is required is not in a file. **next to it** (`forge.audit: none` is shown: `git grep` for zizmor returns 0) |
| 0012 Delivery | `delivery.release_tool` | A choice people make | The last 300 commits hold 43 hand-made `Release X.Y.Z version` commits, and `test/version.js` runs as a pre-commit hook. There is no release-tool config. **next to it** |
| 0012 | `delivery.release_notes` | A choice people make | `release.yml` copies `CHANGELOG.md` into the release. Whether someone also writes highlights is invisible. **next to it** (the other keys are shown: `target: package` and `environments` as a tag trigger from `release.yml`, and `registry` and `manifests` as `none`) |
| 0015 Secrets | `secrets.storage` | The maintainer's workstation | The workflows only use `secrets.GITHUB_TOKEN`, and no `.env` or `.envrc` is tracked. **next to it** (`secrets.guard: none` is shown: no gitleaks reference or hook) |
| 0017 Agent tooling | `agent.hosts` | A choice people make | `git ls-files` has no `.claude/` or `opencode.json`, and that does not show which agents contributors use. **next to it** |
| 0019 Vulnerabilities | `vulnerabilities.scanner` | GitHub settings (Dependabot alerts) | There is no scan workflow (`git grep` for grype, trivy and similar returns 0). **next to it** (`sbom: none` and `fail_on: none` are shown: no SBOM step in `release.yml`, no scan job) |
| 0020 Adding a dependency | `admission.approver` | A choice people make | No citation. (`install_scripts: ignored` is shown: `pnpm-workspace.yaml` has `allowBuilds`, with `esbuild: false`, `simple-git-hooks: true` and `unrs-resolver: false`.) |
| 0021 Build provenance | `supply_chain.build_level` | The npm registry (attestations on the published package) | `release.yml` has `id-token: write` and `npm stage publish`. There is no `attest-build-provenance` or `--provenance` (`git grep` returns 0). **next to it** |
| 0022 Review and merge | `review.by` | A GitHub ruleset on `main`, outside the repository | There is no CODEOWNERS, and 212 of the last 300 commits are by one author (`git log --pretty=%an -300`). **next to it** |
| 0022 | `review.approvals` | The same GitHub ruleset | Same as the row above. **next to it** |
| 0024 Code scanning | `code_scanning.tool` | GitHub settings (default setup leaves no file) | `git grep -i codeql` returns 0. **next to it** |
| 0024 | `code_scanning.fail_on` | A GitHub ruleset ("Require code scanning results") | No citation in the repository. |
| 0026 Agent identity | `agent.identity` | GitHub credentials on the maintainer's machine | 17 of the last 300 commit bodies carry `Co-Authored-By`, and a trailer is not an identity. **next to it** |

## Proposed order

Group 1 first, in ADR order: **0007, 0010, 0013, 0014, 0016, 0018, 0023, 0025**.

Then group 2, in ADR order: **0002, 0003, 0004, 0005, 0006, 0008, 0009, 0011, 0012, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026**.

Two things to know before you answer:
- ADR-0009 and ADR-0022 expect ADR-0012 and ADR-0018 to be ruled with or before them, because the branch check passes bot branches only then. In this order, 0018 comes first and 0012 comes before 0009's neighbours in group 2, but 0009 itself comes before 0012. You may want to move 0012 ahead of 0009.
- ADR-0017 is also read by 0022's check, so ruling 0017 before 0022, as proposed, works.

Do you agree to this order, or do you want another one?
