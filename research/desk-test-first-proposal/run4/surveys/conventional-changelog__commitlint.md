### conventional-changelog__commitlint.json cost=1.68 turns=22 subtype=success writes=[]
Let me read all the ADRs.
---
Now the repository evidence.
---
Still surveying the repository before presenting the two groups; a couple more checks.
---
I've finished the survey. I read all 25 ADRs and checked the repository's manifests, workspace config, CI workflows, hooks, docs site, licence, history and branches, and wrote nothing. Here are the two groups.

## Group 1: the repository already answers these (10)

| ADR | What the repository shows | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English | `default: english` |
| 0004 Languages | `tsconfig.json`, TypeScript sources in every package | `TypeScript` |
| 0005 Validation | `@commitlint/config-validator` validates config with `ajv` against `commitlint.schema.json` | `boundary: ajv`, `data_files: json-schema` (differs from the `zod` recommendation) |
| 0006 Commits | `commitlint.yml` runs in CI, plus a husky `commit-msg` hook. Scopes come from `@commitlint/config-workspace-scopes` | `tool: commitlint`. The scopes are the workspace package names |
| 0013 Frontend | A CLI and libraries with no user interface. The VitePress docs site is ADR-0008's question | `rejected` |
| 0014 Work tracking | GitHub issue templates in `.github/ISSUE_TEMPLATE/` | `github-issues`, `conventional-changelog/commitlint` |
| 0018 Dependencies | Renovate config in `package.json` with `minimumReleaseAge: "3 days"`. No automerge is configured | `updater: renovate`, `automerge: none` |
| 0009 Branching | Pull requests go through a merge queue that squashes (`AGENTS.md`, `CI.yml` `merge_group`). Branches use `chore/`, `ci/`, `docs/`, `feat/`, `fix/`, `refactor/` and `test/` | `github-flow`, `squash`, those 7 prefixes |
| 0023 License | `"license": "MIT"` in `package.json`, and `license.md` holds the MIT text | `MIT` |
| 0026 Agent identity | The ADR is written for a single maintainer, but the history shows several maintainers and many contributors | `rejected`, because its "Not concerned" section excludes this case |

I put 0018 before 0009 on purpose. ADR-0009's check exempts `renovate/` branches only once ADR-0018 is ruled.

## Group 2: these need a discussion (15)

| ADR | Why it needs a discussion |
|---|---|
| 0003 Architecture | This is a monorepo of libraries, not a service. The choice is between `monolithic`, another pattern or `rejected` |
| 0007 Tests | `vitest --coverage` runs, but no coverage threshold is set anywhere |
| 0008 Documentation | The site is built with VitePress, which is not one of the allowed values (`starlight`, `docusaurus`, `mkdocs`, `none`). `docs.channels` is also open: the site deploys on push to `master` only |
| 0010 Architecture docs | There is no architecture document |
| 0011 Forge and CI | The merge queue suggests `blocking`, but the ruleset can't be seen from here. No zizmor, and most actions are pinned by tag (`@v7`), not by SHA |
| 0012 Delivery | The repository ships npm packages and a Docker Hub image, but `delivery.target` takes one value. Releases are made by hand with `lerna publish --conventional-commits` |
| 0015 Secrets | No local secret handling and no gitleaks |
| 0016 Changes | No change framework is in use |
| 0017 Agent tooling | There is no `.claude/` directory. `skills/` holds a skill for the product's users, not agent tooling for this repository |
| 0019 Vulnerabilities | `pnpm audit` runs weekly and doesn't block. There is no PR scan and no SBOM |
| 0020 Adding a dependency | `install_scripts: ignored` is already in place (`allowBuilds` all `false`, `strictDepBuilds`). Who approves a new dependency is not written anywhere |
| 0021 Build provenance | Packages are published from a workstation with an OTP, which is level 0. The ADR's rule 3 forbids that |
| 0022 Review and merge | Several maintainers, so probably `peer`, but the approval count has to be checked on GitHub |
| 0024 Code scanning | No CodeQL workflow |
| 0025 Tools | `.mise.toml` pins Node and pnpm. The answer depends on 0011 and 0015 |

Do you agree to this order: Group 1 as listed (0002, 0004, 0005, 0006, 0013, 0014, 0018, 0009, 0023, 0026), then Group 2 in numeric order? Or would you like a different order?
