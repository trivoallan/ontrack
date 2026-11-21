### immerjs__immer.json cost=1.87 turns=39 subtype=success writes=[]
I'll start with the command the project rules name for ADR reviews.
---
I can't run `ontrack review` without approval, so I'll survey the ADRs by reading them directly.
---
About 6,800 lines of ADRs. I'll read them in batches, along with the repo's config.
---
Still surveying: I've read 18 of the 25 ADRs. Seven left to read, then I'll check the repo's CI and config.
---
Now the repo's own evidence: CI, release config, docs site, and history.
---
Nearly done with the survey: checking the docs site config, remotes and branches, then I'll present the two groups.
---
I've read all 25 ADRs along with the repo's workflows, `package.json`, docs site config, tracker templates and the last 300 commits. I couldn't run `ontrack review`, because it needs your approval, so this survey comes from reading the files directly. I've written nothing yet.

**One thing to look at before the review:** `.coveralls.yml` has a Coveralls `repo_token` committed in plain text. ADR-0015 says a leaked secret should be revoked at the provider, not removed from git history. That applies whatever you rule.

## Group 1: the repository already answers these (14)

Every value below is in a file of this repository.

| ADR | What the files say |
| --- | --- |
| 0002 Localization | Everything is in English (`defaultLocale: "en"`, code, commits). `zh-CN` is only a translation of the docs. |
| 0003 Architecture | A TypeScript library split into `src/core` and `src/plugins`, not a service. Likely `monolithic`. |
| 0004 Languages | `TypeScript` (`tsconfig.json`, `src/*.ts`) |
| 0005 Validation | A library: it reads no config, request or file. Likely `rejected` or `boundary: none`. |
| 0008 Documentation | `docusaurus` under `website/docs/`, public, deployed on every push to `main` (`docs-public.yml`) |
| 0010 Architecture documentation | Nothing exists, so `none` for all three keys |
| 0012 Delivery | npm `package`, published by `semantic-release` on every push to `main` (`release.yml`) |
| 0013 Frontend | No user interface (the website belongs to ADR-0008), so `rejected` |
| 0014 Work tracking | `github-issues` and `immerjs/immer` (`.github/ISSUE_TEMPLATE/`, the `bugs` field in `package.json`) |
| 0015 Secrets | No guard (husky only runs `pretty-quick`), `.env` is gitignored, and a token is committed (see above) |
| 0016 Changes | No OpenSpec, so `none` |
| 0017 Agent tooling | No `.claude/` and no `opencode.json`, so `[]` |
| 0020 Adding a dependency | Yarn 1 with no `ignore-scripts`, so `allowed`. Nothing says who approves a new dependency. |
| 0023 License | `MIT` (`LICENSE`, `package.json`) |
| 0025 Tools | No tool is installed outside the package manager |

## Group 2: these need a discussion (10)

| ADR | Value held outside the repo, or readable only from history |
| --- | --- |
| 0006 Commits | `commits.scopes` can only come from past commits (`deps`, `deps-dev`, `zh-CN`, `utils`, `test`…) |
| 0007 Tests | A coverage threshold, if there is one, would be in the Coveralls project settings. Vitest sets none. |
| 0009 Branching | The merge method is a GitHub repository setting. Branch prefixes (`fix/`, `feature/`, `bugfix/`) come only from history. |
| 0011 Forge and CI | Whether a red pipeline blocks the merge depends on a GitHub ruleset or branch protection |
| 0018 Dependencies | Dependabot opens PRs but there is no `dependabot.yml`, so it is switched on in the GitHub settings |
| 0019 Vulnerabilities | Dependabot alerts are a GitHub setting, and no scanner runs in CI |
| 0021 Build provenance | npm trusted publishing (`id-token: write`, "migrate release flow to OIDC") is configured on npmjs.com |
| 0022 Review and merge | The GitHub ruleset, and the fact that the repo has several maintainers (Weststrate, Erikson) |
| 0024 Code scanning | CodeQL default setup, if it is on, is a GitHub setting |
| 0026 Agent identity | Agent credentials sit outside the repo, and the ADR targets repos kept by one person, which this one isn't |

**Proposed order:** group 1 in the order above (0002 → 0025), then group 2 (0006 → 0026). It keeps the numerical order within each group.

Do you agree with this order, or would you like another? Once you confirm, I'll start with ADR-0002 Localization.
