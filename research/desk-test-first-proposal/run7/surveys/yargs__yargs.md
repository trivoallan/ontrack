### yargs__yargs.json cost=1.60 turns=35 subtype=success writes=[]
I'll start by running the review command that AGENTS.md prescribes, and look at the ADR directory.
---
The `ontrack review` command needs approval I don't have, so I'll survey by reading the ADR files directly.
---
I've read all 25 ADRs. Next I'm surveying the repository itself (files, config, CI, history) before grouping them.
---
I've finished the survey without writing anything. One note first: the `ontrack review` command that AGENTS.md prescribes needs approval I wasn't given, so I worked from the ADR files and the repository directly.

## Group 1: ADRs this repository already answers

| ADR | Value | Evidence |
|---|---|---|
| **0002 Localization** | `default: english`, no overrides | README.md, `docs/*.md`, `lib/*.ts` symbols and comments, and `git log` subjects are all English. (`locales/*.json` holds the product's user-facing translations, not the repo's working language.) |
| **0004 Languages** | `TypeScript` | `lib/*.ts`, `tsconfig.json` (`include: lib/**/*.ts`), `typescript` in devDependencies |
| **0007 Tests** | `coverage_target: 100` | `.nycrc` has `"lines": 100` and excludes `test/**`. `ci.yaml` job `coverage` runs `npm run coverage`, which is `c8 report --check-coverage` |
| **0010 Architecture docs** | `document: none`, `model: none`, `diagrams: none` | `git ls-files` shows no `docs/architecture/`, `.c4` or diagram files |
| **0013 Frontend** | `rejected` (no UI) | `package.json`: a CLI argument-parser library with no UI framework dependency. `browser.mjs` is a browser build of the library, not an interface |
| **0014 Work tracking** | `github-issues`, `yargs/yargs` | `contributing.md` § Issues; `git remote -v` points to `github.com/yargs/yargs` |
| **0016 Changes** | `framework: none`, `schema: none` | no `openspec/` directory; changes are described in PRs (`(#NNNN)` subjects) |
| **0017 Agent tooling** | `hosts: []` | no `.claude/settings.json`, `opencode.json` or `.opencode/`; `AI_POLICY.md` restricts agent PRs |
| **0018 Dependencies** | `updater: renovate`, `automerge: none` | `renovate.json` (`config:base`, no automerge rule); `renovate/*` branches on the remote |
| **0021 Build provenance** | `build_level: 2` | `release-please.yml`: `npm stage publish --provenance` on `ubuntu-latest` with `id-token: write` |
| **0023 License** | `MIT` | `package.json` `"license": "MIT"` and `LICENSE` |
| **0025 Tools** | `none` | no committed tool outside npm (no gitleaks, zizmor, grype, mise or aqua files), and no accepted ADR names one yet |

## Group 2: ADRs with at least one value not shown by this repository

| ADR | Value not shown, and where it lives |
|---|---|
| **0003 Architecture** | `pattern`: nothing documents it. I'd have to infer it from `lib/` (probably `monolithic`) |
| **0005 Validation** | `boundary`: inferred. `lib/validation.ts` is hand-written, and the library *is* the argv boundary. `data_files: none` is observed (`locales/*.json` has no schema) |
| **0006 Commits** | `scopes`: only from history (`deno`, `completion`, `lang`, `deps`, `main`…, used inconsistently). `tool: none` is observed (no commitlint) |
| **0008 Documentation** | `tool`/`channels`: the site lives in another repository, `yargs/yargs.github.io` (`contributing.md`). `audience` is not stated |
| **0009 Branching** | `merge: squash` and `model` only from history and forge settings. `prefixes`: remote branch names are mixed (`fix-1909`, `feat/middlewares`, `update-deps`) |
| **0011 Forge & CI** | `gate`: required checks live in GitHub rulesets, outside the repo. `audit: none` is observed |
| **0012 Delivery** | `release_notes`: GitHub release text lives on GitHub. `docs/release-policy.md` says only majors highlight breaking changes. The rest is observed: `package`, npm on `tag`, `release-please`, registry and manifests `none` |
| **0015 Secrets** | `storage`: on maintainers' machines (a gitignored `.npmrc` hints at one). `guard: none` is observed |
| **0019 Vulnerabilities** | `scanner`: GitHub's Dependabot alerts setting is outside the repo, and I don't know if it's on. `sbom: none` is observed |
| **0020 Adding a dependency** | `approver`: a process, not in the repo. `install_scripts: allowed` is observed (no `allowScripts`, npm < 12 in CI) |
| **0022 Review & merge** | `by`/`approvals`: the GitHub ruleset and maintainer count are outside the repo |
| **0024 Code scanning** | `tool`: CodeQL default setup could be enabled on GitHub, and I don't know. No workflow in the repo |
| **0026 Agent identity** | `identity`: lives on GitHub and maintainers' machines. The ADR also assumes a one-maintainer repository, which I can't confirm |

**Proposed order:** Group 1 in numeric order (0002, 0004, 0007, 0010, 0013, 0014, 0016, 0017, 0018, 0021, 0023, 0025), then Group 2 in numeric order (0003, 0005, 0006, 0008, 0009, 0011, 0012, 0015, 0019, 0020, 0022, 0024, 0026).

Do you agree with this order, or would you like another? I can't open a question dialog in this session, so just reply here.
