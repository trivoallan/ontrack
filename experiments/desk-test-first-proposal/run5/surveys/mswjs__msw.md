### mswjs__msw.json cost=1.80 turns=49 subtype=success writes=[]
I'll start by running the review command the project rules point to, and survey the ADRs and the repository.
---
The `ontrack review` command needs approval that wasn't granted, so I'll do the survey by reading the ADR files directly.
---
Now the repository itself: manifest, CI, release and contribution setup.
---
I couldn't run `npx -p @trivoallan/ontrack ontrack review`, which AGENTS.md says to run first, because the command needed approval that wasn't given. So I surveyed by reading all 25 ADRs and the repository's files, CI and git history. Nothing has been written. I have no question tool in this session, so I'm asking in plain text.

## Survey

The repository is `mswjs/msw`, a TypeScript library published to npm. It runs on GitHub Actions (7 workflows, all actions pinned by SHA). `@ossjs/release` publishes it daily with npm provenance. History is squash-merged Conventional Commits, and `commitlint` runs as a local `commit-msg` hook.

### Group 1: the repository already answers these (9)

| ADR | What the repository already does |
|---|---|
| 0002 Localization | Code, comments, docs and commits are all in English |
| 0004 Languages | TypeScript (`src/**/*.ts`, `tsdown`, `typescript` dev dependency) |
| 0006 Commits | `commitlint` with `config-conventional` as a `simple-git-hooks` hook. Scopes are used freely (`ws`, `sse`, `graphql`, `HttpResponse`…). One point to settle: hook or CI, and whether scopes are a closed list |
| 0009 Branching | Pull requests with squash merges (`… (#2838)`, no merge commits). Branches are named `feat/`, `fix/`, `chore/` |
| 0012 Delivery | npm package, released daily by `@ossjs/release` (`release.yml`, `release.config.json`). No image, no manifests |
| 0013 Frontend | A library with no user interface, so likely `rejected` |
| 0014 Work tracking | GitHub Issues on `mswjs/msw` (`.github/ISSUE_TEMPLATE/`, `#NNNN` references) |
| 0021 Build provenance | `NPM_CONFIG_PROVENANCE=true`, `id-token: write`, publishes from `ubuntu-latest`, so SLSA level 2 |
| 0023 License | `"license": "MIT"` in `package.json` and an MIT `LICENSE.md` |

### Group 2: these need a discussion (16)

| ADR | Why |
|---|---|
| 0003 Architecture | A library, not a service. The hexagonal recommendation's premise doesn't hold, so the value needs choosing |
| 0005 Validation | No `zod`. The boundaries are CLI args (yargs) and worker messages, and none uses a schema |
| 0007 Tests | Vitest and Playwright exist, but no coverage threshold is set |
| 0008 Documentation | The user docs live at mswjs.io, outside this repo. Here there's only the README and `decisions/` |
| 0010 Architecture docs | No arc42 and no model. `decisions/` holds informal notes |
| 0011 Forge and CI | GitHub is confirmed. Whether red blocks a merge is a ruleset I can't see from here. No workflow audit tool (zizmor) |
| 0015 Secrets | `.env` is gitignored. No gitleaks |
| 0016 Changes | No OpenSpec. Intent is recorded in pull requests |
| 0017 Agent tooling | No `.claude/` and no `opencode.json` |
| 0018 Dependencies | No Dependabot or Renovate config |
| 0019 Vulnerabilities | No scanner and no SBOM |
| 0020 Adding a dependency | pnpm `allowBuilds` already gates install scripts. There's a `minimumReleaseAgeExclude` but no explicit `minimumReleaseAge` value |
| 0022 Review and merge | One main maintainer (109 of ~120 commits in the last year) with outside contributors |
| 0024 Code scanning | No CodeQL or Semgrep |
| 0025 Tools | No tools installed outside pnpm. The answer depends on 0011 and 0015 |
| 0026 Agent identity | No agent identity is set up |

### Proposed order

Group 1 in list order: 0002, 0004, 0006, 0009, 0012, 0013, 0014, 0021, 0023.

Then Group 2 in list order: 0003, 0005, 0007, 0008, 0010, 0011, 0015, 0016, 0017, 0018, 0019, 0020, 0022, 0024, 0025, 0026. This keeps the ADRs that others depend on first: 0011 before 0018, 0019 and 0024; 0017 before 0022; 0015 and 0011 before 0025.

None of these has to be ruled now: the repository works with them open, and `ontrack check` only runs decided ADRs.

**Do you agree with this order, or would you like a different one?** Once you confirm, I'll start with ADR-0002 (Localization).
