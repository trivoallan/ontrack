### cheeriojs__cheerio.json cost=1.91 turns=50 subtype=success writes=[]
I'll start with the project rule: run the ontrack review command, then survey the ADRs and the repository.
---
The `ontrack review` command needs approval I don't have, so I'll read the ADRs directly.
---
Now the repository itself: manifest, CI, tooling and history.
---
Still surveying: the `gh` calls need approval, so GitHub-side settings (rulesets, merge options, issues) stay unknown. I'm finishing two quick checks before presenting the grouping.
---
I've read all 25 `proposed` ADRs and surveyed the repository without writing anything. Two notes first:
- I couldn't run `npx -p @trivoallan/ontrack ontrack review` (AGENTS.md asks for it) because it needs approval in this session, so I worked from the ADR files directly.
- I couldn't run `gh api` either. Every value that lives in GitHub's settings (rulesets, merge options, repository visibility, Dependabot alerts, release notes) is marked unknown below.

## Group 1: values this repository already shows

For each citation, **value** means it shows the value itself and **next to** means it only sits beside it.

| ADR | Proposed value | Citation |
|---|---|---|
| **0002 Localization** | `default: english`, no overrides | The repository is written in English everywhere: `Readme.md`, `CONTRIBUTING.md`, the identifiers and comments in `src/**/*.ts`, and commit subjects in `git log`. **value** |
| **0004 Languages** | `TypeScript` | `tsconfig.json`, `src/*.ts`, `"typescript"` in `package.json` devDependencies, and `"lint:ts": "tsc --noEmit"`. **value** |
| **0010 Architecture documentation** | `document: none`, `model: none`, `diagrams: none` | There is no `docs/architecture/`, and a grep for mermaid, plantuml and `.c4` finds nothing outside the ADR itself. **value**, but it's an absence. `THREAT_MODEL.md` describes trust boundaries, not the architecture: **next to**. |
| **0013 Frontend** | `astro` | `website/package.json` has `"astro": "^7.4.12"` (with React islands through `@astrojs/react`). **value**. Whether a docs site counts as a "user interface" is your call; the alternative is `rejected` (a library). |
| **0014 Work tracking** | `github-issues`, `cheeriojs/cheerio` | `package.json` `bugs.url` is `https://github.com/cheeriojs/cheerio/issues`, `CONTRIBUTING.md` says "File an issue on GitHub", and `.github/issue_template.md` exists. **value**. `git remote -v` gives `cheeriojs/cheerio`: **value** |
| **0016 Changes** | `framework: none`, `schema: none` | There is no `openspec/` directory. **value** (an absence) |
| **0018 Dependencies** | `updater: dependabot`, `automerge: minor` | `.github/dependabot.yml`: **value**. `dependabot-automerge.yml` merges `semver-minor` and `semver-patch`: **value**. ⚠ The ADR's fixed rules forbid what that workflow does: it runs on `pull_request_target`, doesn't exclude `github-actions`, and needs `forge.gate: blocking`, which is unknown. |
| **0023 License** | `MIT` | `package.json` `"license": "MIT"` and `LICENSE` ("MIT License"). **value** |
| **0025 Tools** | `none` | There's no `mise.toml`, `aqua.yaml` or install script. zizmor runs only through its action in CI. **value** (an absence). Whether `none` stays valid depends on how 0011 and 0015 are ruled. |

## Group 2: one or more values held elsewhere, inferred, or unknown

| ADR | Value that's missing, and where it lives | Citations |
|---|---|---|
| **0003 Architecture** | `pattern` isn't stated anywhere. `monolithic` is an inference from the single package and the `src/api/*` modules. | layout: **next to** |
| **0005 Validation** | `boundary`: no schema library, and the options are checked by hand (no zod, ajv or valibot). The value (`none` or a named hand-written mechanism) is unknown. `data_files`: `biome.json` and `website/typedoc.json` carry `$schema`, so `json-schema`. | `$schema`: **value**; boundary: unknown |
| **0006 Commits** | `scopes` come from history only (`attributes`, `traversing`, `website`, `readme`, `sponsors` and so on). For `tool`, there's no commitlint and no commit-msg hook (`.husky/pre-commit` runs lint-staged only), and versions are set by hand (the `1.2.0` commit and tag by Felix), so `none`. | tool: **value** (absence plus tag history); scopes: history only |
| **0007 Tests** | `coverage_target`: `vitest.config.ts` sets no threshold. Coveralls runs with `continue-on-error`, and its settings live on coveralls.io. | **next to** |
| **0008 Documentation** | `tool`: the site is custom Astro (`website/astro.config.mjs`), which is none of `starlight`, `docusaurus`, `mkdocs` or `none`, so a departure is needed. `root: website/src/content/docs/` is **value**. `audience: public`: site `https://cheerio.js.org` is **value**. `channels: [main]`: `site.yml` deploys on push to `main` only, **value**. | |
| **0009 Branching** | `model` and `merge` are GitHub settings (unknown). History suggests squash merges (`(#NNNN)` subjects, no recent merge commits). `prefixes`: branches use `dependabot/`, `copilot/`, `docs/sponsors` and `worktree-…`, with no convention. | history only |
| **0011 Forge and CI** | `gate`: the ruleset is on GitHub (unknown). `audit: zizmor`: `.github/workflows/zizmor.yml`. | audit: **value**; gate: unknown |
| **0012 Delivery** | `target: package` (`package.json` `files`, `exports`, `prepublishOnly`): **value**. `release_tool: manual` (no release workflow, plus the hand-made version commit and tag): absence plus history. `environments` (npm, on `manual` or `tag`): history only. `release_notes` (GitHub releases): unknown. `registry: none` and `manifests: none`: **value** (no Dockerfile, no manifests). | |
| **0015 Secrets** | `guard: none` (no gitleaks): **value**. `storage`: where maintainers keep `CHEERIO_SPONSORS_GITHUB_TOKEN` and `IMGIX_TOKEN` locally is unknown. | |
| **0017 Agent tooling** | `hosts`: there's no `.claude/settings.json` or `opencode.json`. `.gitignore` lists `.claude/worktrees/` and there are `copilot/*` branches, so agents are used but how is inferred. | **next to** |
| **0019 Vulnerabilities** | `sbom: none` (no SBOM step): **value**. `scanner` and `fail_on`: there's no workflow scanner, Dependabot alerts are a GitHub setting (unknown), and Scorecard isn't a vulnerability scanner. | |
| **0020 Adding a dependency** | `approver` is a policy no file records. `install_scripts`: there's no `.npmrc` or `allowScripts`, and the npm version CI uses (Node `lts/*`) decides the default. | unknown or inferred |
| **0021 Build provenance** | `build_level`: no publishing workflow, and publishing from a workstation means `0` is an inference. Provenance on npm is in the registry. | **next to** |
| **0022 Review and merge** | `by` and `approvals`: the ruleset is on GitHub. There are several maintainers (`package.json` `maintainers`, plus external contributors). | unknown |
| **0024 Code scanning** | `tool: codeql` (`codeql.yml`): **value**. `fail_on` would be the ruleset's code-scanning threshold on GitHub: unknown. | |
| **0026 Agent identity** | `identity`: which credentials the agents use lives on GitHub and on the maintainers' machines. The `copilot/*` branches suggest the Copilot agent has its own bot identity. | unknown |

## Proposed order

Group 1 first, then group 2, in ADR number within each group:

**0002, 0004, 0010, 0013, 0014, 0016, 0018, 0023, 0025**, then **0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026**

One consideration: 0018's automerge rule depends on 0011's `forge.gate`, and 0025's `none` depends on 0011 and 0015. You might prefer to rule 0011 and 0015 earlier.

**Do you agree to this order, or would you like another?** You can also tell me to skip specific ADRs or to stop after a given one.
