I'll start with the survey and write nothing. First I'll read the ADRs and look at the repository.
---
The first command was rejected, so I'll read the ADRs with plain commands.
---
I've read all 25 ADRs. Next I'll gather evidence from the repository (CI, config, history) for the survey.
---
The shell was left in the ADR directory, so relative paths missed. I'll use the repo root explicitly.
---
Next, a few targeted checks to settle the remaining values.
---
I've surveyed all 25 ADRs and written nothing. Six have every value shown in this repository. The other 19 each have at least one value I can't show from the repository alone.

## Group 1: every value shown (6 ADRs)

| ADR | Key | Value | Citation |
| --- | --- | --- | --- |
| 0004 Languages | `languages.main.name` | JavaScript | `shows the value`: `git ls-files ':(top)*.js' \| wc -l` gives 476 files, against 163 for `*.ts`. The `.ts` files are `index.d.ts`, `types/` and `test-d/`. `package.json` has `"type": "module"`. |
| 0010 Architecture documentation | `architecture.document` | none | `shows the value`: `git ls-files ':(top)docs/architecture' \| wc -l` gives 0, so there is no `docs/architecture/`. |
| 0010 | `architecture.model` | none | `shows the value`: `git ls-files ':(top)*.c4' ':(top)*.likec4' \| wc -l` gives 0. |
| 0010 | `architecture.diagrams` | none | `shows the value`: a Grep for `mermaid\|plantuml` in tracked `*.md` finds hits only in ADR-0008 and ADR-0010 (the ADR text itself), none in `docs/*.md` or `readme.md`. |
| 0013 Frontend | `frontend.framework` | none (would rule `rejected`: a library with no UI) | `shows the value`: `git ls-files` for `*.html *.css *.tsx *.jsx *.vue *.svelte *.astro` gives 0, and `package.json` lists no UI framework. |
| 0016 Changes | `changes.framework` | none | `shows the value`: there is no `openspec/` directory and no `openspec` dependency in `package.json`. |
| 0016 | `changes.schema` | none | `shows the value`: same absence, since `none` goes with `framework: none`. |
| 0023 License | `license.spdx` | MIT | `shows the value`: `"license": "MIT"` in `package.json`, and a `license` file at the root with the MIT text. |
| 0025 Tools | `tools.manager` | none | `shows the value`: there is no `mise.toml`, `aqua.yaml` or install script. `.github/workflows/main.yml` installs nothing outside npm and pinned-by-tag actions. |

## Group 2: at least one value not shown (19 ADRs)

Only the values I couldn't show are listed.

| ADR | Key | Where the value lives | Citation |
| --- | --- | --- | --- |
| 0002 Localization | `default`, `documentation`, `commits`, `code`, `comments` (5 rows) | A convention people follow | `next to it`: `docs/*.md`, `lib/` identifiers and `git log` subjects (918 commits) are in English. |
| 0003 Architecture | `architecture.pattern` | The maintainers' judgement | `next to it`: one package with 110 files under `lib/` in feature folders (`arguments`, `io`, `ipc`, `methods`…) and no layering rule. |
| 0005 Validation | `validation.boundary` | The maintainers' judgement | `next to it`: `package.json` lists no `zod` or `pydantic`, and checks are hand-written (for example `lib/ipc/validation.js`). `data_files` is shown as none: 0 tracked `*schema*` files. |
| 0006 Commits | `commits.scopes` | A convention people follow | `next to it`: `git log` finds 0 of 918 subjects matching the Conventional Commits format. |
| 0006 | `commits.tool` | A clone-local hook, which is untracked | `next to it`: no commitlint dependency, config or workflow in the repository. |
| 0007 Tests | `tests.coverage_target` | Codecov's project settings, which can hold a target | `next to it`: the `c8` block in `package.json` has no `check-coverage` or `lines` key, and `.github/codecov.yml` holds only `notify.after_n_builds: 6`. |
| 0008 Documentation | `docs.audience` | A choice people make | `next to it`: the remote is `github.com/sindresorhus/execa`, but visibility is a forge setting. `tool: none` and `root: docs/` (22 `.md` files) are shown. |
| 0009 Branching | `branching.model` | GitHub settings and practice | `next to it`: only `main` exists, and `git log --merges` finds 2 merge commits in 918. |
| 0009 | `branching.merge` | GitHub merge-method setting | `next to it`: the same 2 merge commits, with the rest linear. |
| 0009 | `branching.prefixes` | A convention people follow | `next to it`: no branch names are kept in the repository. |
| 0011 Forge and CI | `forge.gate` | A GitHub ruleset | `next to it`: `main.yml` runs on `push` and `pull_request`. `forge.audit` is shown as none: no workflow runs zizmor or actionlint. |
| 0012 Delivery | `delivery.target` | The registry the maintainers publish to | `next to it`: `package.json` has `files` and `exports` and no `private`. |
| 0012 | `delivery.environments` | The maintainers' practice | `next to it`: `main.yml` has no publish or deploy job, and 70 `v*` tags exist. |
| 0012 | `delivery.release_tool` | The maintainers' practice | `next to it`: there is no release-please config or workflow, and commits like `10.2.1` bump the version by hand. |
| 0012 | `delivery.release_notes` | GitHub releases page | `next to it`: nothing in the repository. |
| 0012 | `delivery.registry` | npm registry | `next to it`: `package.json` has no `publishConfig`. `deployment.manifests` is shown as none: no manifest files. |
| 0014 Work tracking | `tracking.tool` | GitHub repository settings | `next to it`: `"repository": "sindresorhus/execa"` in `package.json`, and "Merge pull request #3" in history. `tracking.project` is shown by that same field. |
| 0015 Secrets | `secrets.storage` | The maintainer's workstation | `next to it`: `.gitignore` has no `.env` entry. |
| 0015 | `secrets.guard` | A clone-local hook, or GitHub push protection | `next to it`: no gitleaks config or workflow in the repository. |
| 0017 Agent tooling | `agent.hosts` | Which agents contributors use | `next to it`: there is no `.claude/`, `opencode.json` or `marketplace/`. |
| 0018 Dependencies | `dependencies.updater` | A GitHub app or setting, which can exist without a file | `next to it`: no `.github/dependabot.yml` or `renovate.json`, and 0 bot-authored commits (`git log --format=%an%ae \| grep -ciE 'dependabot\|renovate\|bot'`). |
| 0018 | `dependencies.automerge` | The same app or setting | `next to it`: the same absences. |
| 0019 Vulnerabilities | `vulnerabilities.sbom` | GitHub release assets | `next to it`: `main.yml` has no SBOM step. |
| 0019 | `vulnerabilities.scanner` | GitHub security settings (Dependabot alerts) | `next to it`: `main.yml` has no scan step and there is no `.grype.yaml`. |
| 0019 | `vulnerabilities.fail_on` | A GitHub ruleset | `next to it`: nothing in the repository. |
| 0020 Adding a dependency | `admission.approver` | A choice people make | `next to it`: nothing in the repository. |
| 0020 | `admission.install_scripts` | The npm version contributors run | `next to it`: `.npmrc` holds only `package-lock=false`, with no `ignore-scripts` and no `allowScripts` in `package.json`. |
| 0021 Build provenance | `supply_chain.build_level` | The npm registry | `next to it`: `main.yml` has no publish, `--provenance` or attest step. |
| 0022 Review and merge | `review.by` | A GitHub ruleset | `next to it`: no `.claude/settings.json` deny entries, and 2 merge commits in 918. |
| 0022 | `review.approvals` | A GitHub ruleset | `next to it`: the same. |
| 0024 Code scanning | `code_scanning.tool` | GitHub's default setup, which leaves no file | `next to it`: no CodeQL workflow. |
| 0024 | `code_scanning.fail_on` | A GitHub ruleset | `next to it`: nothing in the repository. |
| 0026 Agent identity | `agent.identity` | The maintainer's machine and GitHub accounts | `next to it`: the authors are people (ehmicky 594, Sindre Sorhus 223…), and 28 commits carry `Co-authored-by` trailers naming people. |

Things I noticed that will matter when ruling:
- The `license` file is lowercase, but ADR-0023's check looks for `LICENSE`, `LICENSE.md`, `LICENSE.txt` or `COPYING`.
- `.npmrc` sets `package-lock=false`, which departs from ADR-0020's rule that the lockfile is committed.
- `package.json` has an uncommitted change: it was reindented, and the ontrack dev dependency was added.

## Proposed order

1. Group 1, in numeric order: **0004, 0010, 0013, 0016, 0023, 0025**.
2. Group 2, in numeric order: **0002, 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0014, 0015, 0017, 0018, 0019, 0020, 0021, 0022, 0024, 0026**.

Do you agree with this order, or would you like another? I have no question tool in this session, so please reply in text. If you agree, I'll start with ADR-0004.
