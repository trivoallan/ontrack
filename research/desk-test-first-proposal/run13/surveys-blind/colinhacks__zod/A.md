I'll start the survey by reading every ADR in the list and looking at the repository.
---
I'm doing the survey: I've listed the trait keys for all 24 ADRs. Next I'm reading the frontmatter and recommendation blocks that are still unclear, then checking the repository for evidence.
---
Now the repository evidence.
---
I'm still surveying: workflows, release and commit history are checked. Next are CONTRIBUTING, SECURITY and the coverage config.
---
I'm finishing the survey checks: coverage settings, architecture-document files, and the allowed values for ADR-0010.
---
Nothing is written yet. This is the survey of the 25 `proposed` ADRs. Counts come from commands I ran. Everything else is a file or configuration I read.

## First group: 6 ADRs
Every value has a citation that `shows the value`.

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 | `languages.main.name` | TypeScript | `shows the value`: `git ls-files :/ \| grep -cE '\.(ts\|tsx\|mts\|cts)$'` gives 516. The same command for `.js/.mjs/.cjs` gives 9, and for `.py` it gives 0. |
| 0007 | `tests.coverage_target` | none | `shows the value`: the Grep for `coverage\|thresholds` over vitest configs, every `package.json`, `.github/` and `.husky/` found only a prompt bullet, `claude-code-review.yml:48`. No threshold exists anywhere. |
| 0013 | `frontend.framework` | next | `shows the value`: `packages/docs/package.json` has `"next": "15.5.25"`. |
| 0014 | `tracking.tool` | github-issues | `shows the value`: root `package.json` has `bugs.url: https://github.com/colinhacks/zod/issues`. |
| 0014 | `tracking.project` | colinhacks/zod | `shows the value`: the same `bugs.url`, and `repository.url` in the same file. |
| 0016 | `changes.framework` | none | `shows the value`: there is no `openspec/` directory. A Glob for `openspec/*` returned nothing. |
| 0023 | `license.spdx` | MIT | `shows the value`: `"license": "MIT"` at `packages/zod/package.json:5` and `packages/mini/package.json:5`, and `LICENSE` opens with "MIT License". |

Two caveats:
- **ADR-0016 `changes.schema`:** the ADR only uses it with `openspec`. With `none` it has nothing to show, and I read it that way.
- **ADR-0013:** the framework shown is the documentation site's. The repository has no other frontend.

## Second group: 19 ADRs
One row per value I could not show. The values I could show are left out.

| ADR | Key | Where the value lives | Citation |
|---|---|---|---|
| 0002 | `localization.language.default`, `.documentation`, `.commits`, `.code`, `.comments` | A convention. No file states it. | `next to it`: the last 200 commit subjects (`git log -200 --format=%s`) are English. `packages/docs/content/*.mdx` and `CLAUDE.md` are English. |
| 0003 | `architecture.pattern` | A choice | `next to it`: `workspaces: ["packages/*"]` in `package.json`, and the core/classic/mini layering that `CLAUDE.md` describes. |
| 0005 | `validation.boundary` | A choice. This repository is zod itself. | `next to it`: `"zod": "workspace:*"` in the root `devDependencies`. |
| 0006 | `commits.scopes` | History | `next to it`: scopes in the last 200 subjects, such as `v4`, `v3`, `locales`, `lang`, `types`, `compile`, `mini`, `ecosystem`, `deps`. I did not count them. |
| 0008 | `docs.audience` | A choice | `next to it`: the public site content in `packages/docs/content/`. |
| 0008 | `docs.channels` | Hosting and release setup outside this repository | `next to it`: `packages/docs/next.config.mjs` and `content/v4/versioning.mdx`. |
| 0009 | `branching.model` | Forge settings and habit | `next to it`: `test.yml` runs on pull requests to `main` and `v4`, and on pushes to `main`. |
| 0009 | `branching.merge` | A GitHub repository setting | `next to it`: subjects end in `(#NNNN)` in `git log -200`. |
| 0009 | `branching.prefixes` | A habit. No file states it. | none |
| 0010 | `architecture.document` | `none` or `elsewhere`, a choice | `next to it`: there is no `docs/architecture/arc42/`. Design notes sit in `wiki/*.md` and `rfcs/index.md`. |
| 0011 | `forge.gate` | A ruleset on the forge | `next to it`: `test.yml` runs on `pull_request`. |
| 0011 | `forge.audit` | Unknown | `next to it`: a `# zizmor: ignore[adhoc-packages]` comment at `release.yml:115`. No workflow or hook runs zizmor. |
| 0012 | `delivery.target`, `.environments`, `.release_tool`, `.release_notes`, `.registry`, `deployment.manifests` | Choices. The repository ships npm packages, not a container. | `next to it`: `release.yml` is dispatch-only, stages to npm with `--provenance` and then publishes to JSR. Its jobs use the `npm` and `release-approval` environments. Release notes come in as `-f notes=`. |
| 0015 | `secrets.storage` | Each developer's workstation | `next to it`: `CONTRIBUTING.md` asks for a `GITHUB_TOKEN` environment variable for the docs build. |
| 0015 | `secrets.guard` | Possibly a local hook outside this repository | `next to it`: `.husky/pre-commit` has no secret scan, and there is no gitleaks config. |
| 0017 | `agent.hosts` | A choice people make | `next to it`: `.claude/skills`, `.codex/skills`, `.cursorrules`, `.mcp.json`, `claude.yml`, `pullfrog.yml`. |
| 0018 | `dependencies.updater`, `.automerge` | An app and forge settings | `next to it`: no `dependabot.yml` or `renovate.json`. The commit `chore(deps): bump next … (#6153)`. |
| 0019 | `vulnerabilities.scanner` | Possibly GitHub alerts, which leave no file | `next to it`: no scanner workflow. |
| 0019 | `vulnerabilities.fail_on` | A ruleset on the forge | none |
| 0020 | `admission.approver` | A choice people make | none |
| 0021 | `supply_chain.build_level` | The registry holds the real level | `next to it`: `--provenance` at `release.yml:143` and `:149`, and `id-token: write`. |
| 0022 | `review.by`, `review.approvals` | A ruleset on the forge | `next to it`: no `CODEOWNERS`. `claude-code-review.yml` reviews pull requests. |
| 0024 | `code_scanning.tool` | GitHub default setup leaves no file | `next to it`: no CodeQL workflow among the 8 workflows. |
| 0024 | `code_scanning.fail_on` | A ruleset on the forge | none |
| 0025 | `tools.manager` | A choice, and it depends on what ADR-0011 and ADR-0015 end up naming | `next to it`: no `mise.toml`, `aqua.yaml` or `.tool-versions`. `CONTRIBUTING.md` installs Nub with a commit-pinned `install.sh`. |
| 0026 | `agent.identity` | Account and app settings on GitHub | `next to it`: `claude.yml` and `pullfrog.yml` run as agents. |

Some values in these ADRs were shown, so they have no row above:
- **ADR-0006:** `commits.tool` is `none`. There is no `commit-msg` hook in `.husky/` and no commitlint config.
- **ADR-0008:** `docs.tool` is `fumadocs` and `docs.root` is `packages/docs/`.
- **ADR-0010:** `architecture.model` and `architecture.diagrams` are `none`. There are no `.c4`, `.likec4` or `.mmd` files, and no mermaid or plantuml blocks in any `.md` or `.mdx`.
- **ADR-0019:** `vulnerabilities.sbom` is `none`. No workflow mentions an SBOM.

## Proposed order
The six first-group ADRs in numeric order (0004, 0007, 0013, 0014, 0016, 0023), then the 19 others in numeric order (0002, 0003, 0005, 0006, 0008 … 0026). I have no question tool in this session, so I'm asking in plain text. Do you agree to this order, or do you want another? I'll start the reviews once you answer.
