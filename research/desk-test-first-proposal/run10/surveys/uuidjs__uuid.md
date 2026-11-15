### uuidjs__uuid.json cost=1.11 turns=35 subtype=success writes=[]
Still reading the ADRs (6 of 25 done) before surveying the repository; no files written.
---
Now the repository itself.
---
Survey is nearly complete; checking the CLI entry point and README tooling, then I'll present the grouping.
---
I read all 25 proposed ADRs and checked the repository's files, CI and git history. I have written nothing yet. Two commands were refused for lack of approval, so I worked without them: `npx -p @trivoallan/ontrack ontrack review`, which AGENTS.md says to run, and `gh api repos/uuidjs/uuid`, so I couldn't read any GitHub setting.

## Group 1: the repository already answers these (7 ADRs)

| ADR | Key | Value | Citation |
|---|---|---|---|
| ADR-0004 Languages | `languages.main.name` | `TypeScript` | every file in `src/` is `.ts`, and `tsconfig.json` and `scripts/build.sh` run `tsc`: **shows the value** |
| ADR-0007 Tests | `tests.coverage_target` | `none` | searching for "coverage" outside `docs/adr/`, `CHANGELOG.md` and the lockfile finds nothing: no threshold or coverage tool exists, and the absence is the value: **shows the value** |
| ADR-0013 Frontend | *(rejected: no user interface)* `frontend.framework` | no framework | `package.json` has no UI framework in its dependencies and ships only `dist`/`dist-node`. This is a library plus a CLI (`src/uuid-bin.ts`): **shows the value** |
| ADR-0014 Work tracking | `tracking.tool` | `github-issues` | `.github/ISSUE_TEMPLATE/bug_report.yml` and `.github/workflows/stale-issues.yml`: **shows the value** |
| ADR-0014 Work tracking | `tracking.project` | `uuidjs/uuid` | `package.json` has `"repository.url": "https://github.com/uuidjs/uuid.git"`: **shows the value** |
| ADR-0016 Changes | `changes.framework` | `none` | there is no `openspec/` directory, and the absence is the value: **shows the value** |
| ADR-0016 Changes | `changes.schema` | `none` | follows from `changes.framework: none`, same absence: **shows the value** |
| ADR-0023 License | `license.spdx` | `MIT` | `package.json` has `"license": "MIT"`, and so does `LICENSE.md`: **shows the value** |
| ADR-0025 Tools | `tools.manager` | `none` | the CI workflows install only Node and npm packages, and there is no `mise.toml`, `aqua.yaml` or `.tool-versions`: **shows the value** |

## Group 2: these need a discussion (18 ADRs)

This table lists only the values I could not show. Values I could show for these ADRs are left out.

| ADR | Key | Where the value lives | Citation, with its label |
|---|---|---|---|
| ADR-0002 | `localization.language.default` | a choice people make | README, code and commits are in English: **next to it** |
| ADR-0003 | `architecture.pattern` | a choice people make | `src/` has 1,333 lines (from `wc -l src/*.ts`) and holds a library with one module per function. The ADR suggests `monolithic` or `rejected` for a non-service: **next to it** |
| ADR-0005 | `validation.boundary` | a choice people make | inputs are checked by hand: `src/validate.ts` uses a regex and `src/uuid-bin.ts` uses `assert.ok` on CLI arguments: **next to it** |
| ADR-0005 | `validation.data_files` | a choice people make | only `biome.jsonc` carries a `$schema`: **next to it** |
| ADR-0006 | `commits.scopes` | a choice people make | scopes in the last 300 subjects (`git log --format=%s -300`, then a grep): `main`, `release`, `v1`, `v7`, `v35`, `ci`, `deps`, `docs`, `husky`, `nodejs`. Drawn from history: **next to it** |
| ADR-0006 | `commits.tool` | a choice people make: `hook` today, the ADR recommends CI | `lefthook.yml` runs commitlint as a `commit-msg` hook, and `ci.yml` has no commitlint job. The repository versions from commits (`release-please.yml`), which is the ADR's condition for `commitlint`: **next to it** for the CI-vs-hook choice |
| ADR-0008 | `docs.root` | a choice people make | the only documentation is `README.md`, generated from `README_js.md` at the repository root: **next to it** |
| ADR-0008 | `docs.audience` | a choice people make | public GitHub repository, published to npm: **next to it** |
| ADR-0009 | `branching.model`, `branching.merge` | forge setting (allowed merge methods) | none of the 86 commits since the last merge commit is a merge (`git log --oneline 964be22..HEAD \| wc -l`), and subjects carry `(#NNN)`, which points to squash: **next to it** |
| ADR-0009 | `branching.prefixes` | a choice people make | remote branches don't use type prefixes (`git branch -a`): **next to it** |
| ADR-0010 | `architecture.document`, `architecture.model`, `architecture.diagrams` | a choice people make, and it could live elsewhere | no `docs/architecture/`, and searching for "mermaid"/"plantuml" finds nothing: **next to it** |
| ADR-0011 | `forge.gate` | forge setting (rulesets) | `ci.yml` runs lint and test, but whether they are required checks is set on GitHub: none |
| ADR-0012 | `delivery.environments` | a choice people make | `release-please.yml` publishes to npm when a release is created on `main` or `*.x`: **next to it** |
| ADR-0012 | `delivery.release_notes` | forge (GitHub releases text) | `CHANGELOG.md` is generated by release-please: **next to it** |
| ADR-0015 | `secrets.storage` | a choice people make (each contributor's machine) | the only secrets are CI secrets for BrowserStack, bundlewatch and npm in the workflows: **next to it** |
| ADR-0017 | `agent.hosts` | a choice people make | no agent settings files exist, and two commits are by "Copilot" (`git log --format=%an -100`): **next to it** |
| ADR-0018 | `dependencies.updater`, `dependencies.automerge` | forge setting (Dependabot security updates or an org-level app) | no `dependabot.yml` or `renovate.json`, and dependencies are updated by hand ("chore: update deps (#975)"): **next to it** |
| ADR-0019 | `vulnerabilities.scanner`, `vulnerabilities.fail_on` | forge setting (Dependabot alerts) | no workflow runs a scanner: **next to it**, because GitHub's own alerts could be on |
| ADR-0020 | `admission.approver` | a choice people make | none |
| ADR-0021 | `supply_chain.build_level` | registry (npm provenance attestations) | `release-please.yml` runs `npm publish --provenance` on a GitHub-hosted runner, which points to level 2: **next to it** |
| ADR-0022 | `review.by`, `review.approvals` | forge setting (rulesets) | none |
| ADR-0024 | `code_scanning.tool`, `code_scanning.fail_on` | forge setting (CodeQL default setup) | no CodeQL or Semgrep workflow: **next to it** |
| ADR-0026 | `agent.identity` | a choice people make | none |

**Proposed order:** the 7 from Group 1 first (ADR-0004, 0007, 0013, 0014, 0016, 0023, 0025), then the other 18 in number order (ADR-0002, 0003, 0005, 0006, 0008–0012, 0015, 0017–0022, 0024, 0026).

Do you agree with this order, or would you like a different one?
