### expressjs__morgan.json cost=1.76 turns=43 subtype=success writes=[]
I'll start by following the project rule: run `ontrack review` and look at the repository.
---
The `ontrack review` command needs approval I don't have, so I'll read the ADRs directly.
---
Now the repository itself: CI, Dependabot, history, docs.
---
Let me confirm the absences I'm going to cite.
---
I've read all 25 ADRs and gone through the repository: `package.json`, `index.js`, `README.md`, `HISTORY.md`, `LICENSE`, the four workflows, `.github/dependabot.yml`, the git log and tags. I also checked that the tooling files I cite as absent really are absent. Nothing is written yet.

`npx -p @trivoallan/ontrack ontrack review` needed approval I don't have in this session, so this survey follows the ADRs' own text.

## Group 1: the repository already answers these (7 ADRs)

| ADR | Key | Value | Citation (`shows the value`) |
| --- | --- | --- | --- |
| ADR-0002 | `localization.language.default` | `english` | `README.md` prose, plus the names and comments in `index.js`, are all in English. The four optional overrides stay empty. |
| ADR-0004 | `languages.main.name` | `JavaScript` | `index.js` is CommonJS JavaScript (`'use strict'`, `require`), and `.eslintrc.yml` sets `extends: standard`. JavaScript is not one of the two recommended languages, so the ADR asks for a reason. |
| ADR-0013 | `frontend.framework` | none: rule `rejected` | `package.json` says "HTTP request logger middleware" and `"files": ["LICENSE", "README.md", "index.js"]`. There is no UI code. |
| ADR-0016 | `changes.framework` | `none` | There is no `openspec/` directory. |
| ADR-0016 | `changes.schema` | `none` | It follows from `framework: none`. There is no `openspec/config.yaml`. |
| ADR-0018 | `dependencies.updater` | `dependabot` | `.github/dependabot.yml` exists, and the git log shows `dependabot[bot]` PRs such as #381 to #384. |
| ADR-0018 | `dependencies.automerge` | `none` | No workflow uses `dependabot/fetch-metadata` or `gh pr merge`. Dependabot cannot merge without one. |
| ADR-0023 | `license.spdx` | `MIT` | `package.json` has `"license": "MIT"`, and `LICENSE` holds "The MIT License". |
| ADR-0025 | `tools.manager` | `none` | There is no `mise.toml`, `aqua.yaml` or install script, and no accepted ADR names a tool yet. This answer only lasts while ADR-0011 and ADR-0015 don't name zizmor or gitleaks. |

## Group 2: these need a discussion (18 ADRs)

| ADR | Value I could not show | Where it lives | Citation I have (label) |
| --- | --- | --- | --- |
| ADR-0003 | `architecture.pattern` | A choice people make (probably `monolithic`, or `rejected` for a library) | `index.js` is a single module of about 600 lines (`next to it`) |
| ADR-0005 | `validation.boundary`, `validation.data_files` | A choice people make (by hand / `none` today) | `index.js:441` has `throw new TypeError('argument format must be a string')`, along with other `typeof` checks; `process.env.NO_COLOR` is read at `index.js:50` (`next to it`) |
| ADR-0006 | `commits.scopes` | Drawn from history alone | The git log shows `build(deps)`, `chore(ci)` and many commits with no scope (`next to it`). `commits.tool: none` is shown: no commitlint config, hook or dependency |
| ADR-0007 | `tests.coverage_target` | Possibly the Coveralls settings, otherwise a choice | `nyc` with no `check-coverage`, and Coveralls in `ci.yml` (`next to it`) |
| ADR-0008 | `docs.audience` and `docs.tool` / `docs.root` | Repository visibility (a forge setting), and possibly a site outside the repo (expressjs.com) | No site generator, and the docs are in `README.md` (`next to it`) |
| ADR-0009 | `branching.model`, `branching.merge`, `branching.prefixes` | Forge settings (merge methods, rulesets), and prefixes are a choice | Squash-style `(#NNN)` titles and one "Merge commit from fork" in the log (`next to it`) |
| ADR-0010 | `architecture.document` | Possibly elsewhere, otherwise a choice | No `docs/architecture/` and no `.c4` files (`next to it`) |
| ADR-0011 | `forge.gate` | A GitHub ruleset (forge setting) | `ci.yml` comment: "22+ are required checks" (`next to it`). `forge.audit: none` is shown: no zizmor or actionlint workflow |
| ADR-0012 | `delivery.release_notes`, and the trigger in `delivery.environments` | GitHub release text on the forge; `npm stage publish` promotion on npmjs | `npm-publish.yml` runs on `release: created` and calls `npm stage publish` (`shows` `target: package`); `HISTORY.md` is a hand-written changelog; version-bump commits are made by hand (`next to it` for `release_tool: manual`) |
| ADR-0014 | `tracking.tool` | Forge setting (whether issues are enabled) | `package.json` has `"repository": "expressjs/morgan"` (`shows` the project) |
| ADR-0015 | `secrets.storage` | A choice people make (likely `none`) | No secret is read by the code, and CI uses only `GITHUB_TOKEN` (`next to it`). `guard: none` is shown: no committed hook or gitleaks config |
| ADR-0017 | `agent.hosts` | A choice people make (what contributors use) | `AGENTS.md` exists and is untracked; there are no agent settings files (`next to it`) |
| ADR-0019 | `vulnerabilities.scanner`, `fail_on` | Dependabot alerts are a forge setting | No Grype/Trivy job (`next to it`). `sbom: none` is shown: `npm-publish.yml` has no SBOM step |
| ADR-0020 | `admission.approver`, `admission.install_scripts` | A choice people make | No `.npmrc`; `package-lock.json` is in `.gitignore` (`next to it`) |
| ADR-0021 | `supply_chain.build_level` | The npm registry (attestations) | `npm-publish.yml` has `id-token: write` and `npm stage publish` (trusted publishing) (`next to it`) |
| ADR-0022 | `review.by`, `review.approvals` | A GitHub ruleset (forge setting) | Several maintainers merge PRs (Ulises Gascón, Jon Church…) (`next to it`) |
| ADR-0024 | `code_scanning.fail_on` | A GitHub ruleset (forge setting) | `codeql.yml` uses `github/codeql-action/analyze` (`shows` `tool: codeql`) |
| ADR-0026 | `agent.identity` | A choice people make, plus GitHub accounts | none |

## Proposed order

I'd take Group 1 first, in file order: 0002, 0004, 0013, 0016, 0018, 0023, 0025. Then Group 2 in file order: 0003, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0014, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

One thing to weigh: ruling ADR-0025 `none` stops working if ADR-0011 or ADR-0015 later names zizmor or gitleaks. You may prefer to move 0025 to the end.

**Do you agree with this order, or would you like another?** You can also skip any ADR, or stop at any point.
