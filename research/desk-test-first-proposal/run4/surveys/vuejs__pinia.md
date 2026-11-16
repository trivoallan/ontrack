### vuejs__pinia.json cost=1.88 turns=52 subtype=success writes=[]
The `ontrack review` command needs approval, so for now I'll go ahead and read the ADRs directly.
---
Now the repository itself.
---
Quick update: I've finished reading all 25 ADRs and surveying the repo (workflows, hooks, release script, docs site, history). I haven't written anything. Here's the survey.

# Survey of the 25 proposed ADRs

First, a note: `AGENTS.md` asks me to run `npx -p @trivoallan/ontrack ontrack review`, but that command needs your approval. I'll ask again when we reach the first ruling.

What this repository is: `vuejs/pinia`, a TypeScript library published to npm as three packages (`pinia`, `@pinia/testing`, `@pinia/nuxt`). It's hosted on GitHub. The default branch is `v4`. The docs site is VitePress and deploys to Netlify. One maintainer makes most commits (170 since 2025), and outside contributors send pull requests.

## Group 1: the repository already answers these (12)

| ADR | What the repository shows |
| --- | --- |
| 0002 Localization | English everywhere: code, comments, commits, docs. `packages/docs/zh/` is a translation, not the default. |
| 0004 Languages | TypeScript (`tsconfig.json`, `packages/pinia/src/*.ts`). |
| 0006 Commits | A local `commit-msg` hook (`scripts/verifyCommit.mjs` through `simple-git-hooks`). Scopes in use include `nuxt`, `types`, `hmr`, `devtools`, `testing`, `ssr`, `store` and `zh`. The hook also allows types outside the eleven (`dx`, `workflow`, `types`, `wip`, `release`). |
| 0009 Branching | Squash merges: 162 of the last 500 subjects end in `(#NNN)`, and there has been one merge commit since 2024. Remote branches use the `feat/`, `fix/`, `docs/` and `test/` prefixes. |
| 0010 Architecture documentation | There's no architecture document or model anywhere, so the answer is `none`. |
| 0012 Delivery | npm package, published on tag (`release.yml`). Versions are made by hand with `scripts/release.ts` and `conventional-changelog`. Release notes come from `changelogithub`. There's no image and no manifests. |
| 0013 Frontend | A library with no user interface. The playgrounds are private dev packages, so I'd propose `rejected`. |
| 0014 Work tracking | GitHub Issues in `vuejs/pinia` (issue templates, `#NNN` references). |
| 0018 Dependencies | Renovate (`renovate.json` extends `github>posva/renovate-config`). Its automerge setting lives in that external preset. |
| 0021 Build provenance | npm trusted publishing with `id-token: write` in `release.yml`, which is level 2 in practice. |
| 0023 License | MIT (`LICENSE`, and `"license": "MIT"` in `packages/pinia/package.json`). The root `package.json` declares no licence. |
| 0026 Agent identity | Agents work under the maintainer's identity. Nothing sets up a separate one. |

## Group 2: these need a discussion (13)

| ADR | Why it needs a discussion |
| --- | --- |
| 0003 Architecture | It's a library, not a service. The options are `monolithic` or `rejected`, rather than the recommended `hexagonal`. |
| 0005 Validation | No runtime validation library is used. Whether a store library has a data boundary at all is open. |
| 0007 Tests | Coverage runs (vitest v8 plus Codecov) but has no threshold. Only a 2% drop tolerance is set, in `codecov.yml`. |
| 0008 Documentation | The tool is VitePress, which isn't in the ADR's allowed values. The site deploys from Netlify, not `deploy-pages`. Root `packages/docs/`, audience public. |
| 0011 Forge and CI | GitHub and CI exist. Whether the ruleset blocks merges can't be seen from here. There's no workflow audit, and actions in `ci.yml` aren't pinned by SHA. |
| 0015 Secrets | No local secrets are handled (`.env` is gitignored) and there's no guard. |
| 0016 Changes | No change framework is used. |
| 0017 Agent tooling | No `.claude/` or `opencode.json`. `AGENTS.md` itself is untracked. |
| 0019 Vulnerabilities | No scanner and no SBOM. |
| 0020 Adding a dependency | pnpm `allowBuilds` already exists in `pnpm-workspace.yaml`. There's no cooldown and no approver rule. |
| 0022 Review and merge | A maintainer plus outside contributors. `maintainer` or `peer` is a real choice. |
| 0024 Code scanning | No CodeQL. |
| 0025 Tools | Depends on what 0011 and 0015 name. Nothing is set up today. |

## Proposed order

I'd take Group 1 first, in ADR number order (0002, 0004, 0006, 0009, 0010, 0012, 0013, 0014, 0018, 0021, 0023, 0026), then Group 2 in number order (0003, 0005, 0007, 0008, 0011, 0015, 0016, 0017, 0019, 0020, 0022, 0024, 0025).

One dependency to keep in mind: 0009's check exempts bot branches only once 0018 and 0012 are ruled. In my order, both are still open when we reach 0009, so we may want to rule them first.

Do you agree with this order, or would you like a different one? You can also tell me to skip any ADR, or rule only some of them. None of them has to be ruled now.
