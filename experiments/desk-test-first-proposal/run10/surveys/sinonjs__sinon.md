### sinonjs__sinon.json cost=2.01 turns=40 subtype=success writes=[]
I'm reading all 25 proposed ADRs and the repo's config to build the survey; nothing written yet.
---
Still reading: ADRs 22–26 left, then the repo's config and CI.
---
Now the repository itself.
---
Survey done. I've written nothing yet. Two things to know first:
- `npx -p @trivoallan/ontrack ontrack review` (the AGENTS.md rule) needed an approval it didn't get, so I worked from the ADR files.
- `gh release list` and `npm view sinon dist` also needed approval and didn't run. Anything held on GitHub or npm is marked as living there.

## Group 1: this repository already answers (7 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| ADR-0004 | `languages.main.name` | JavaScript | `git ls-files src test \| sed 's/.*\.//' \| sort \| uniq -c` → 77 `.js`, 11 `.mjs`, 4 `.cjs`, 0 `.ts` (shows the value) |
| ADR-0007 | `tests.coverage_target` | 97 | `package.json` → `nyc`: `"check-coverage": true`, `"lines": 97` (shows the value) |
| ADR-0010 | `architecture.document` | none | no `docs/architecture/` or architecture file in `git ls-files` (shows the value) |
| ADR-0010 | `architecture.model` | none | no `.c4` / `.likec4` file in `git ls-files` (shows the value) |
| ADR-0010 | `architecture.diagrams` | none | a search for `mermaid` outside the ADRs finds nothing (shows the value) |
| ADR-0014 | `tracking.tool` | github-issues | `package.json` → `"bugs": {"url": "https://github.com/sinonjs/sinon/issues"}` (shows the value) |
| ADR-0014 | `tracking.project` | sinonjs/sinon | same entry (shows the value) |
| ADR-0016 | `changes.framework` | none | no `openspec/` in `git ls-files` (shows the value) |
| ADR-0016 | `changes.schema` | none | same absence (shows the value) |
| ADR-0018 | `dependencies.updater` | dependabot | `.github/dependabot.yml` (shows the value) |
| ADR-0018 | `dependencies.automerge` | none | no workflow uses `dependabot/fetch-metadata` (shows the value) |
| ADR-0023 | `license.spdx` | BSD-3-Clause | `package.json` → `"license": "BSD-3-Clause"`; `LICENSE` reads "(The BSD License)" (shows the value) |

## Group 2: needs a discussion (18 ADRs)

Only the values I couldn't show are listed.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| ADR-0002 | `localization.language.commits` | a choice people make | `git log -300`: all subjects are in English (next to it) |
| ADR-0003 | `architecture.pattern` | a choice people make | one library package, `src/sinon/*.js` (next to it) |
| ADR-0005 | `validation.boundary` | a choice people make | hand-written argument checks such as `src/sinon/throw-on-falsy-object.js`, no validation library in `package.json` (next to it) |
| ADR-0006 | `commits.scopes` | a choice people make | `git log -300 \| grep -oE '^[a-z]+\(…\)'` → `build(deps-dev)` 12, `build(deps)` 10, `docs` and others once or twice; 91 of 300 subjects are Conventional Commits (next to it) |
| ADR-0008 | `docs.audience` | a choice people make | `"homepage": "https://sinonjs.org/"`; `docs.yml` deploys to Pages (next to it). Also: `docs.tool` shows as **vitepress** (`docs/package.json`), which is not one of the ADR's allowed values |
| ADR-0009 | `branching.model` | a choice people make | PR numbers `(#NNNN)` on most subjects (next to it) |
| ADR-0009 | `branching.merge` | forge setting | `(#NNNN)` subjects with no merge commits suggest squash (next to it) |
| ADR-0009 | `branching.prefixes` | unknown | no branch naming rule anywhere |
| ADR-0011 | `forge.gate` | forge setting (ruleset) | `main.yml` runs on every PR (next to it) |
| ADR-0012 | `delivery.release_notes` | forge (GitHub releases) | `scripts/version.sh` generates `CHANGES.md` with `changes --commits` (next to it) |
| ADR-0013 | `frontend.framework` | a choice people make | root `package.json` has no UI framework, but `docs/package.json` has `vue` for the docs site (next to it) |
| ADR-0015 | `secrets.storage` | a choice people make | `scripts/test-cloud.sh` reads `SAUCE_*` from the environment (next to it) |
| ADR-0017 | `agent.hosts` | a choice people make | `.gitignore` ignores `.claude/`, `AGENTS.md`, `CLAUDE.md`, `.amp/portals/*`; `.agents/setup` is an Amp "Orb" setup script (next to it) |
| ADR-0019 | `vulnerabilities.scanner` | forge setting (Dependabot alerts) | no scanning workflow; manual `npm audit` commits in history (next to it) |
| ADR-0019 | `vulnerabilities.fail_on` | follows `scanner` | same |
| ADR-0020 | `admission.approver` | a choice people make | none |
| ADR-0020 | `admission.install_scripts` | unknown (depends on the npm major version) | `.npmrc` has no `ignore-scripts`; `package.json` has no `allowScripts` (next to it) |
| ADR-0021 | `supply_chain.build_level` | the registry (npm attestations) | `scripts/postversion.sh` runs `npm publish` from a workstation, with no `--provenance` (next to it) |
| ADR-0022 | `review.by` | forge setting (ruleset) | merged PRs from several authors (next to it) |
| ADR-0022 | `review.approvals` | forge setting (ruleset) | none |
| ADR-0024 | `code_scanning.fail_on` | forge setting (ruleset) | `codeql.yml` exists, but the threshold isn't in it (next to it) |
| ADR-0025 | `tools.manager` | a choice people make | `.tool-versions` (asdf, `nodejs 26` only); CONTRIBUTING recommends asdf (next to it) |
| ADR-0026 | `agent.identity` | a choice people make | none |

## Proposed order

1. **Group 1, in number order:** 0004, 0007, 0010, 0014, 0016, 0018, 0023. You can check each against what you know.
2. **Group 2, in number order:** 0002, 0003, 0005, 0006, 0008, 0009, 0011, 0012, 0013, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0025, 0026.

None of them has to be ruled now. The repository works with all of them open.

**Do you agree with this order, or would you like a different one?** I don't have a question tool in this session, so just reply here. Once you agree, I'll start with ADR-0004 and stop for your agreement before writing anything.
