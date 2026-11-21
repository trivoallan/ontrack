I'll start with the survey, which writes nothing. First I'm reading all 25 ADRs and checking the repository.
---
Reading the frontmatter traits of all the ADRs to build the survey. The shell is rejecting my loops, so I'm switching to the Read tool.
---
I've read all 25 ADRs. Now I'm gathering repository evidence: workflows, dependency bots, hooks, commit history, license and docs.
---
The shell is still in the ADR folder, so the relative paths failed. I'm rerunning from the repository root.
---
## Survey (nothing written yet)

I read all 25 ADRs and checked the repository's files, configuration, CI and history. The shell commands I ran are named inline wherever I give a count.

## Group 1: every value is shown in this repository (3 ADRs)

| ADR | Key | Value | Citation |
| --- | --- | --- | --- |
| ADR-0014 Work tracking | `tracking.tool` | `github-issues` | shows the value: `package.json` has `"bugs": {"url": "https://github.com/rollup/rollup/issues"}`, and `.github/ISSUE_TEMPLATE/` holds the issue forms |
| ADR-0014 | `tracking.project` | `rollup/rollup` | shows the value: the same `bugs.url` and `"repository"` entries in `package.json` |
| ADR-0016 Changes | `changes.framework` | `none` | shows the value: no `openspec/` directory or openspec dependency (`ls -a` at the root and a grep of `.github`, `scripts`, `package.json` and `.husky` found nothing) |
| ADR-0016 | `changes.schema` | `none` | shows the value: the ADR requires `none` when `framework` is `none` |
| ADR-0023 License | `license.spdx` | `MIT` | shows the value: `package.json` has `"license": "MIT"`, and `LICENSE.md` holds the MIT text |

## Group 2: at least one value is held elsewhere or only inferred (22 ADRs)

Values I could show are left out of the rows. These are `commits.tool`, `forge.audit`, `vulnerabilities.sbom`, `architecture.diagrams`, `architecture.model`, `docs.tool`, `docs.root` and `secrets.guard`, all shown by what the repository contains or lacks. `dependencies.automerge` is also shown, but the `updater` row below keeps ADR-0018 in this group.

| ADR | Key | Where the value lives | Citation |
| --- | --- | --- | --- |
| 0002 Localization | `language.default` | a choice people make | next to it: `git log -n 200 --format=%s` shows English subjects; `AGENTS.md` is in English |
| 0002 | `language.documentation`, `.commits`, `.code`, `.comments` (4 rows) | a choice people make | next to it: same evidence. Nothing states an override |
| 0003 Architecture | `architecture.pattern` | a choice people make | next to it: `ARCHITECTURE.md` describes packages and build, and names no pattern |
| 0004 Languages | `languages.main.name` | a choice: TypeScript or Rust | next to it: `AGENTS.md` says "TypeScript + Rust hybrid"; `src/` is `.ts`, `rust/` holds the crates |
| 0005 Validation | `validation.boundary` | a choice people make | next to it: no zod, pydantic or ajv in `package.json` |
| 0005 | `validation.data_files` | a choice people make | next to it: none seen; unknown |
| 0006 Commits | `commits.scopes` | a choice people make | next to it: `git log -n 200 --format=%s \| grep -cE '^(feat\|fix\|docs\|chore\|…)(\(.+\))?!?:'` gives 51 of 200. Most subjects are plain sentences ending in `(#NNNN)` |
| 0007 Tests | `tests.coverage_target` | a choice people make | next to it: `.nycrc` has no threshold, and `codecov.yml` has no target |
| 0008 Documentation | `docs.audience` | a choice people make | next to it: `homepage` is `https://rollupjs.org/` |
| 0008 | `docs.channels` | Vercel project settings, outside the repository | next to it: `docs/AGENTS.md` says previews build on Vercel |
| 0009 Branching | `branching.model` | a choice people make | next to it: CI runs on `pull_request` and on `push` to `master` |
| 0009 | `branching.merge` | GitHub repository settings | next to it: 153 of the last 200 subjects end in `(#NNNN)`, and `renovate.json` has `automergeStrategy: squash` |
| 0009 | `branching.prefixes` | a choice people make | next to it: remote branches carry no prefix (`git branch -a`) |
| 0010 Architecture docs | `architecture.document` | a choice people make | next to it: `ARCHITECTURE.md` exists at the root and is not arc42 |
| 0011 Forge and CI | `forge.gate` | GitHub ruleset, outside the repository | next to it: CI also runs on `merge_group` |
| 0012 Delivery | `delivery.target` | a choice people make | next to it: the CI `publish` job runs `npm publish` |
| 0012 | `delivery.environments` | a choice people make | next to it: publish runs on tags `v*.*.**` |
| 0012 | `delivery.release_tool` | a choice people make | next to it: `scripts/prepare-release.js`, and version-only commits like `4.68.4` |
| 0012 | `delivery.release_notes` | GitHub releases, outside the repository | next to it: `CHANGELOG.md` |
| 0012 | `delivery.registry` | unknown | none seen. It matters only for `container` |
| 0012 | `deployment.manifests` | a choice people make | next to it: no Dockerfile or manifests seen at the root |
| 0013 Frontend | `frontend.framework` | a choice; the product may have no UI | next to it: `docs/` is VitePress (Vue); `renovate.json` names `react` |
| 0015 Secrets | `secrets.storage` | contributors' machines | next to it: no `.env*` files in the tree |
| 0017 Agent tooling | `agent.hosts` | contributors' choice | next to it: `CLAUDE.md`, `AGENTS.md` and `.agents/skills/` exist; there is no `.claude/` |
| 0018 Dependencies | `dependencies.updater` | a choice: two tools are configured | next to it: `renovate.json` and `.github/dependabot.yml` both exist |
| 0019 Vulnerabilities | `vulnerabilities.scanner` | a choice | next to it: the CI job "Lint and Audit" runs `npm run check-audit`. This is not one of the ADR's named scanners |
| 0019 | `vulnerabilities.fail_on` | a choice; also depends on `forge.gate` | next to it: `audit-resolve.json` records ignore decisions |
| 0020 Adding a dependency | `admission.approver` | a choice people make | next to it: `renovate.json` has `minimumReleaseAge: "3 days"` |
| 0020 | `admission.install_scripts` | a choice people make | next to it: no `.npmrc` |
| 0021 Build provenance | `supply_chain.build_level` | npm registry and trusted-publishing settings | next to it: the `publish` job has `id-token: write # Required for OIDC` |
| 0022 Review and merge | `review.by`, `review.approvals` (2 rows) | GitHub ruleset | none in the repository (`.github/` has no `CODEOWNERS`) |
| 0024 Code scanning | `code_scanning.tool` | GitHub settings, since default setup leaves no file | next to it: no CodeQL or semgrep workflow. This does not show `none` |
| 0024 | `code_scanning.fail_on` | GitHub ruleset | none |
| 0025 Tools | `tools.manager` | a choice people make | next to it: `.tool-versions` holds only `npm 11.15.0`; CI uses `taiki-e/install-action` and `install-apt-packages.sh` |
| 0026 Agent identity | `agent.identity` | the maintainer's GitHub accounts and machine | none |

The ADR order I suggest is the numeric order within each group:
1. **Group 1:** ADR-0014, ADR-0016, ADR-0023.
2. **Group 2:** ADR-0002 to ADR-0013, then ADR-0015, ADR-0017 to ADR-0022, and ADR-0024 to ADR-0026.

Do you agree to that order, or do you want another? Name a different order or ADRs to skip. I won't touch any file until you answer.
