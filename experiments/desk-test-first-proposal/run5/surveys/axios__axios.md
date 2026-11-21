### axios__axios.json cost=2.27 turns=56 subtype=success writes=[]
I'll start with the project's review command, as AGENTS.md requires, then survey the ADRs.
---
The `ontrack review` command needs approval I don't have, so I'll follow the procedure in your message and read the files directly.
---
Still surveying: 21 of 26 ADRs read. I'll read the last five, then check the repository's config, CI and history.
---
Now the repository itself.
---
Almost done surveying: checking PR history on GitHub (branch names, merge method) and how the docs site is deployed.
---
No GitHub access, so I'll work from local evidence only.
---
I've read all 26 ADRs and checked the repository. Nothing has been written yet.

The `ontrack review` command and the GitHub CLI both need approval I don't have here. So this survey uses only local evidence: files, workflows and git history. Anything that lives in GitHub settings (rulesets, code scanning default setup, the docs deploy) is unverified.

## Group 1: the repository already answers these

| ADR | What the repository does today | Likely ruling |
|---|---|---|
| 0002 Localization | Code, comments, commits and the main docs are in English. `docs/es`, `docs/fr` and `docs/zh` are translations. | `default: english` |
| 0004 Languages | ESM JavaScript (`"type": "module"`), with hand-written `index.d.ts` / `index.d.cts` declarations. | `JavaScript`, which is not one of the recommended languages and needs a justification |
| 0006 Commits | Conventional Commits, enforced by commitlint in `.husky/commit-msg` but not in CI. Versions are chosen by hand in `release-branch.yml`, so the premise for commitlint-in-CI is false. | `tool: hook`; the scope list needs a short discussion |
| 0011 Forge and CI | GitHub. `zizmor.yml` runs zizmor on every PR, and actions are pinned by SHA. THREATMODEL mentions branch protection on `v1.x`. | `gate: blocking`, `audit: zizmor` |
| 0012 Delivery | npm package. `publish.yml` publishes on `v1.*.*` tags. Version bumps are dispatched by hand; the changelog is written by hand. No image, no manifests. | `package`, `manual`, `registry: none`, `manifests: none` |
| 0013 Frontend | Library with no UI. | `rejected` |
| 0014 Work tracking | GitHub issues (`package.json` `bugs.url`). | `github-issues`, `axios/axios` |
| 0016 Changes | No framework. Intent is recorded in PR descriptions and `PRE_RELEASE_CHANGELOG.md`. | `none` / `none` |
| 0018 Dependencies | `.github/dependabot.yml` with a 7-day cooldown and majors ignored. No automerge workflow. | `dependabot`, `automerge: none` |
| 0020 Adding a dependency | AGENTS.md: no new runtime dependencies without discussion. `.npmrc` sets `ignore-scripts=true`. | `person`, `ignored`; the ADR advises against `ignore-scripts=true`, so this is a departure to explain |
| 0021 Build provenance | `npm stage publish --provenance` over OIDC. | `2` |
| 0023 License | MIT in both `LICENSE` and `package.json`. | `MIT` |

## Group 2: these need a discussion

| ADR | Why it needs a discussion |
|---|---|
| 0003 Architecture | `lib/core` has no I/O and `lib/adapters` holds the I/O, chosen by capability. That looks like `hexagonal`, but `layered` can also be argued. |
| 0005 Validation | Config is validated by axios's own `validator.assertOptions`. `zod` would break the "tiny dependency surface" rule. |
| 0007 Tests | No coverage tool is configured, so the choice is `none` or adopting a target. |
| 0008 Documentation | The site uses VitePress (`docs/package.json`), which is not in the allowed values (`starlight`, `docusaurus`, `mkdocs`, `none`). No deploy workflow is committed. |
| 0009 Branching | PRs are squash-merged. There are several release lines (`v0.x`, `v1.x`, `v2.x`), and the workflow opens `release-v1x/...` branches that the check would reject. |
| 0010 Architecture documentation | There's no arc42. Architecture is described in AGENTS.md and THREATMODEL.md, so `elsewhere` or `none`. |
| 0015 Secrets | No local secrets (publishing uses OIDC), `.env` is gitignored, and there's no gitleaks. |
| 0017 Agent tooling | AGENTS.md and `.github/copilot-instructions.md` exist, but there's no `.claude/settings.json`. |
| 0019 Vulnerabilities | `dependency-review-action` runs in CI. It defaults to failing on any severity. There's no SBOM. |
| 0022 Review and merge | CODEOWNERS names a single maintainer, but outside contributors' PRs can be approved by another account. |
| 0024 Code scanning | No CodeQL workflow is committed. Default setup can't be seen from here. |
| 0025 Tools | Depends on 0011 (zizmor) and 0015. Nothing pins zizmor locally. |
| 0026 Agent identity | Depends on 0022. |

This checkout is upstream axios, and CODEOWNERS names `@jasonsaayman`. Unless you tell me otherwise, I'll put the git user (Tristan Rivoallan) in `authors:`.

**Proposed order:** Group 1 in the order shown (0002, 0004, 0006, 0011, 0012, 0013, 0014, 0016, 0018, 0020, 0021, 0023), then Group 2 (0003, 0005, 0007, 0008, 0009, 0010, 0015, 0017, 0019, 0022, 0024, 0025, 0026).

Do you agree to this order, or would you like a different one? I don't have a question tool in this session, so please reply in text.
