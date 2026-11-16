# Desk test run 5: group-1 scoring

Rule: every `traits:` key of a group-1 ADR must be visible in the clone (files, config, git history). Ruleset, branch-protection, registry-side or other forge-held values fail even when a document in the clone describes them (noted where that happens). An absent tool counts as visible. For `commits.scopes`, a closed list counts as visible only when a config (commitlint `scope-enum`) writes it; scopes merely used in `git log` do not count as a list.

| repo | ADR | keys | all visible | unseen key(s) and where they live | agent said unseen | agent's evidence true | note |
|---|---|---|---|---|---|---|---|
| axios | 0002 | localization.language.{default,documentation,commits,code,comments} | yes | | n/a | yes | `docs/es`, `docs/fr`, `docs/zh` exist; `git log` in English |
| axios | 0004 | languages.main.name | yes | | n/a | yes | `package.json:7` `"type": "module"`; `index.d.ts`, `index.d.cts` |
| axios | 0006 | commits.scopes, commits.tool | no | `scopes`: no closed list anywhere (`package.json:188-199` commitlint config has no `scope-enum`); only scopes used in history | yes ("the scope list needs a short discussion") | yes | `tool` visible: `.husky/commit-msg` runs commitlint, no commitlint in `.github/workflows/`; `release-branch.yml` is `workflow_dispatch` with a patch/minor/major choice |
| axios | 0011 | forge.gate, forge.audit | no | `gate`: branch protection / required checks on GitHub | partly: general caveat at the top ("Anything that lives in GitHub settings (rulesets...) is unverified"), but the row states `gate: blocking` | yes | `THREATMODEL.md:326,420` documents branch protection on `v1.x` and says zizmor "must remain in the required-checks set"; the setting itself is not in the clone. `audit` visible: `.github/workflows/zizmor.yml`; all `uses:` pinned by SHA |
| axios | 0012 | delivery.{target,environments,release_tool,release_notes,registry}, deployment.manifests | yes | | n/a | yes | `publish.yml` on `v1.*.*` tags; `release-branch.yml` manual bump; hand-written `CHANGELOG.md` with a summary heading each release. Agent gave no value for `release_notes` |
| axios | 0013 | frontend.framework | yes | | n/a | yes | no UI in the clone |
| axios | 0014 | tracking.{tool,project} | yes | | n/a | yes | `package.json:98-100` bugs url |
| axios | 0016 | changes.{framework,schema} | yes | | n/a | yes | no openspec; `PRE_RELEASE_CHANGELOG.md` exists |
| axios | 0018 | dependencies.{updater,automerge} | yes | | n/a | yes (minor: majors ignored only in the root npm entry) | `.github/dependabot.yml` cooldown 7 days; no automerge workflow |
| axios | 0020 | admission.{approver,install_scripts} | yes | | n/a | yes | `AGENTS.md:14` "Do not add new runtime dependencies without discussion"; `.npmrc` `ignore-scripts=true` |
| axios | 0021 | supply_chain.build_level | yes | | n/a | yes | `publish.yml`: `npm stage publish --provenance`, `id-token: write`, `ubuntu-latest` |
| axios | 0023 | license.spdx | yes | | n/a | yes | `LICENSE`, `package.json:97` |
| date-fns | 0002 | localization.language.* | yes | | n/a | yes | |
| date-fns | 0004 | languages.main.name | yes | | n/a | yes | `pkgs/*/src/**/*.ts` |
| date-fns | 0010 | architecture.{document,model,diagrams} | yes | | n/a | yes | `docs/` holds only `adr/`; no arc42/model files |
| date-fns | 0012 | delivery.*, deployment.manifests | yes | | n/a | yes | `pkgs/core/scripts/release/release.sh` tags then `pnpm publish` from workstation; `git log` "Promote to v4.4.0"; `pkgs/{core,tz,utc}/CHANGELOG.md`. Agent gave no explicit `release_notes` value |
| date-fns | 0013 | frontend.framework | yes | | n/a | yes | |
| date-fns | 0014 | tracking.{tool,project} | yes | | n/a | yes | `.github/ISSUE_TEMPLATE/issue-report.md`; `(#4194)` in `git log`; `pkgs/core/package.json:10` |
| date-fns | 0016 | changes.{framework,schema} | yes | | n/a | yes | absence |
| date-fns | 0018 | dependencies.{updater,automerge} | yes | | n/a | yes | no `dependabot.yml`, no renovate config (absence) |
| date-fns | 0019 | vulnerabilities.{sbom,scanner,fail_on} | yes | | n/a | yes | absence; `fail_on` follows from no scanner |
| date-fns | 0021 | supply_chain.build_level | yes | | n/a | yes | `release.sh` publishes from a workstation, no `--provenance` |
| date-fns | 0023 | license.spdx | yes | | n/a | yes | `pkgs/*/package.json`, `pkgs/core/LICENSE.md` |
| date-fns | 0024 | code_scanning.{tool,fail_on} | yes | | n/a | yes | no CodeQL/Semgrep workflow. A default-setup scan could exist on GitHub, but ADR-0024 rule 2 says default setup does not answer the ADR, so `tool: none` follows from the clone; `fail_on` follows from no tool |
| date-fns | 0025 | tools.manager | yes | | n/a | yes | `mise.toml`; `jdx/mise-action@v4` in workflows |
| hono | 0002 | localization.language.* | yes | | n/a | yes | |
| hono | 0004 | languages.main.name | yes | | n/a | yes | `git ls-files`: 399 `.ts`, 32 `.tsx`, 27 `.mts` |
| hono | 0007 | tests.coverage_target | yes | | n/a | yes | `codecov.yml` project target 75%; `ci.yml:35` codecov upload |
| hono | 0010 | architecture.* | yes | | n/a | yes | absence |
| hono | 0012 | delivery.*, deployment.manifests | no | `release_notes`: no changelog in the clone; notes for `hono` live in GitHub Releases | yes ("`release_notes` is the only open point") | yes | `release.yml` on `v*` tags, npm + JSR; `package.json:34` `np --no-publish`. `docs/MAINTAINING.md:45` covers adapter release-note drafts only |
| hono | 0013 | frontend.framework | yes | | n/a | yes | |
| hono | 0014 | tracking.{tool,project} | yes | | n/a | yes | `.github/ISSUE_TEMPLATE/`; `docs/CONTRIBUTING.md:27` |
| hono | 0016 | changes.{framework,schema} | yes | | n/a | yes | absence |
| hono | 0021 | supply_chain.build_level | yes | | n/a | yes | `release.yml`: `npm stage publish --provenance`, `id-token: write`, `ubuntu-latest` |
| hono | 0023 | license.spdx | yes | | n/a | yes | `package.json:660`, `LICENSE` |
| msw | 0002 | localization.language.* | yes | | n/a | yes | |
| msw | 0004 | languages.main.name | yes | | n/a | yes | `tsdown.config.ts`, `package.json:192` |
| msw | 0006 | commits.scopes, commits.tool | no | `scopes`: no closed list (`commitlint.config.js` has no `scope-enum`); only scopes used in history | yes ("whether scopes are a closed list" left to settle) | yes | `tool` visible: `package.json:219-223` simple-git-hooks `commit-msg` runs commitlint |
| msw | 0009 | branching.{model,merge,prefixes} | yes | | n/a | mostly | `git log --merges` = 0 of 1817, `(#NNNN)` subjects; `git branch -a` shows `feat/`, `fix/`, `chore/`, but also `backport/v1`, `453-debugging-request-handler`, `946-unhandled-fail-test`, `more-caching-for-performance` |
| msw | 0012 | delivery.*, deployment.manifests | yes | | n/a | yes | `release.yml` cron daily; `release.config.json`, `package.json:95` `release publish` (@ossjs/release). `CHANGELOG.md` points to GitHub Releases; `release_notes` = the tool's generated notes, inferred from the tool in the clone. Agent gave no `release_notes` value |
| msw | 0013 | frontend.framework | yes | | n/a | yes | |
| msw | 0014 | tracking.{tool,project} | yes | | n/a | yes | `.github/ISSUE_TEMPLATE/` |
| msw | 0021 | supply_chain.build_level | yes | | n/a | yes | `release.config.json` `NPM_CONFIG_PROVENANCE=true`; `release.yml` `id-token: write`, `ubuntu-latest` |
| msw | 0023 | license.spdx | yes | | n/a | yes | `package.json:115`, `LICENSE.md` |
| undici | 0002 | localization.language.* | yes | | n/a | yes | |
| undici | 0004 | languages.main.name | yes | | n/a | yes | `lib/**/*.js`, `index.d.ts`, `types/` |
| undici | 0006 | commits.scopes, commits.tool | no | `scopes`: no closed list anywhere; the agent quotes scopes from `git log` | no (scopes given as observed in history) | yes | `tool: none` visible: no commitlint, `.husky/pre-commit` runs only `npm run lint`; `release-create-pr.yml` is `workflow_dispatch` with a version input |
| undici | 0010 | architecture.* | yes | | n/a | yes | absence |
| undici | 0012 | delivery.*, deployment.manifests | yes | | n/a | yes | `release.yml` on push to `main` touching `package.json`; `release-create-pr.yml` manual; `scripts/release.js` `generateReleaseNotes` |
| undici | 0013 | frontend.framework | yes | | n/a | yes | |
| undici | 0014 | tracking.{tool,project} | yes | | n/a | yes | `package.json:6-8`, `.github/ISSUE_TEMPLATE/` |
| undici | 0016 | changes.{framework,schema} | yes | | n/a | yes | no openspec; `.github/PULL_REQUEST_TEMPLATE.md` |
| undici | 0017 | agent.hosts | yes | | n/a | yes | no `.claude/`, `opencode.json`, copilot config in `git ls-files` |
| undici | 0021 | supply_chain.build_level | no | `build_level`: `release.yml` runs `npm publish --access public` with `id-token: write` but no `--provenance`; whether provenance is produced depends on npm trusted-publisher config on npmjs.com | yes ("level 2 likely, to be confirmed") | yes | |
| undici | 0022 | review.{by,approvals} | no | `approvals`: required-approvals count lives in the GitHub ruleset | no | yes | `by: peer` visible as written policy, `GOVERNANCE.md:37-41`; the same text implies one Collaborator sign-off, but the number the ruleset enforces is not in the clone |
| undici | 0023 | license.spdx | yes | | n/a | yes | `package.json:13`, `LICENSE` |

## Raw counts

Group-1 rows per repository: axios 12, date-fns 13, hono 10, msw 9, undici 12 (total 56).

Failing rows per repository: axios 2, date-fns 0, hono 1, msw 1, undici 3 (total 7).

Of the failing rows, left unstated by the agent: 2 (undici 0006, undici 0022), plus 1 partial (axios 0011: covered only by a general caveat at the top of the survey, not in the row). Counted strictly, without that caveat: 3.

Rows whose evidence was false: 0. One partly overstated (msw 0009 branch prefixes), one minor imprecision (axios 0018 "majors ignored" only in the root npm entry).
