### withastro__starlight.json cost=1.66 turns=39 subtype=success writes=[]
I'll start by running the review command the project rules call for, and looking at the ADR directory.
---
I couldn't run `npx ontrack review` (approval not given), so I'll survey by reading the files directly.
---
Now reading every ADR in the list.
---
Read all 25 ADRs; now collecting repository evidence (CI, release, config, history) for the survey.
---
Still gathering evidence — checking zod usage, git history (merge style, authors), and the GitHub remote.
---
I've read all 25 ADRs and checked this repository's files, CI, release setup and history. I haven't written anything. I couldn't run `npx ontrack review` because the command needed approval that wasn't given, so this survey comes from the files themselves.

## Survey

### Group 1: the repository already answers these (12)

| ADR | What the repository already does |
|---|---|
| 0002 Localization | Code, comments, commits and the root docs are in English. The `docs/astro.config.mjs` locales list English as `root`, with the other languages as translations. |
| 0004 Languages | TypeScript across `packages/*`, with `typescript@^6` and `tsdown`. |
| 0005 Validation | zod, imported from `astro/zod` in 26 files, including `src/schema.ts` and `utils/user-config.ts`. Config files carry a `$schema` (changesets, renovate). |
| 0007 Tests | `packages/starlight/vitest.config.ts` sets `thresholds.lines: 87`. |
| 0008 Documentation | The docs site is built with Starlight (it documents itself), pages live in `docs/src/content/docs/`, the audience is public, and Netlify deploys it. |
| 0010 Architecture docs | There is no arc42 file, no `.c4` model and no architecture document, so the answer is likely `none`. |
| 0012 Delivery | npm packages, released by Changesets in `release.yml` with `changesets/action`. There is no deploy job. |
| 0013 Frontend | `astro`: the product is an Astro integration that ships UI components. |
| 0014 Work tracking | GitHub issues in `withastro/starlight`. |
| 0016 Changes | No OpenSpec. Intent lives in the PR description and in `.changeset/` files. |
| 0018 Dependencies | Renovate (`.github/renovate.json5`) with `minimumReleaseAge: '3 days'` and no automerge. |
| 0023 License | MIT, both in `LICENSE` and in `"license": "MIT"`. |

### Group 2: these need a discussion (13)

| ADR | Why |
|---|---|
| 0003 Architecture | This is a library and plugin monorepo, not a service, so `hexagonal` doesn't fit. Choosing between `monolithic` and `rejected` is a judgement call. |
| 0006 Commits | Versions come from Changesets, not from commit messages, so there's no reason for `commitlint`. Most subjects aren't Conventional Commits (`Fix …`, `Update …`, `i18n(ja): …`), and governance doesn't let you opt out of that format. |
| 0009 Branching | Merges are squashed (276 of the last 300 subjects end in `(#N)`). Branches are named after people (`chris/…`) or `chore/…`, not by type prefix, and contributors open PRs from forks. |
| 0011 Forge and CI | zizmor already runs in `ci.yml` (`zizmor-action`, v1.32.0). `merge_group:` suggests a merge queue with required checks, but GitHub rulesets can't be verified from the repository. |
| 0015 Secrets | No local secret handling and no gitleaks. |
| 0017 Agent tooling | Before ontrack there was no `.claude/` or `opencode.json`, so the current answer is `[]`. |
| 0019 Vulnerabilities | No scanner and no SBOM. |
| 0020 Adding dependencies | Install scripts are already ignored (pnpm `allowBuilds` sets esbuild and sharp to `false`), and `minimumReleaseAge: 4320` is set. Who approves new packages still needs discussing. |
| 0021 Build provenance | `release.yml` has `id-token: write`, and `publishConfig.provenance: true` is set in tailwind and markdoc but not visibly in starlight. That points towards level `2`, but it's partial. |
| 0022 Review and merge | This is a multi-maintainer organisation repository, so `peer` fits. The number of approvals isn't recorded in any file. |
| 0024 Code scanning | No CodeQL or Semgrep. |
| 0025 Tools | zizmor is the only tool outside the package manager, and it only runs through its action. Nothing is pinned for local use. |
| 0026 Agent identity | The ADR is written for one-person repositories and says repositories with several maintainers are out of scope, which points to `rejected`. |

The order would be Group 1 first, in ADR number order (0002, 0004, 0005, 0007, 0008, 0010, 0012, 0013, 0014, 0016, 0018, 0023), then Group 2 in number order (0003, 0006, 0009, 0011, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0025, 0026).

Is that order OK, or would you like a different one? (I don't have a question tool in this session, so just reply here.)
