I'll start with the survey and write nothing. First I'm reading all 25 ADRs and the repository's main configuration files.
---
I've read ADRs 2 to 9 so far. I'm reading ADRs 10 to 26 next, then I'll check the repository's files and history for each trait.
---
I've read all 25 ADRs. Now I'm gathering repository evidence for each trait.
---
Avoiding `cd` and using relative paths from the current directory instead.
---
I'm now checking the last few facts: whether updater or scanner configs exist, whether anything in the repo mentions tool managers or scanners, and what the git hooks do.
---
I've read all 25 ADRs and checked the repository. I wrote nothing.

The commands I ran:
- `git ls-files ../../../src | grep -c '\.js$'` gave 451.
- `git log -n 300 --format=%s | grep -cE '^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^)]*\))?!?: '` gave 7.
- `git log -n 300 --format=%s | grep -c '(#[0-9]*)$'` gave 136.
- `git log -n 1000 --format='%an' | grep -ciE 'dependabot|renovate|\[bot\]'` gave 0.

I also searched `.github/` for zizmor, actionlint, codeql, grype, trivy, gitleaks, semgrep, sbom, attest, fetch-metadata, dependabot, renovate, mise and aqua. Each search found nothing.

## Group 1: every value is shown by this repository (6 ADRs)

ADR-0004, ADR-0014, ADR-0016, ADR-0018, ADR-0023, ADR-0025.

| ADR | Key | Value | Citation |
|---|---|---|---|
| 0004 | `languages.main.name` | JavaScript | `eslint.config.js` lints `src/**/*.js` with `ecmaVersion: 2015`, and `AGENTS.md` says "Source and tests are linted as ES2015" (`shows the value`). `git ls-files ../../../src \| grep -c '\.js$'` gave 451 (`shows the value`). |
| 0014 | `tracking.tool` | github-issues | `package.json` has `"bugs": "https://github.com/moment/moment/issues"`, and `.github/ISSUE_TEMPLATE/bug_report.yml` is an issue form (`shows the value`). |
| 0014 | `tracking.project` | moment/moment | `package.json` has `"repository": "github:moment/moment"` (`shows the value`). |
| 0016 | `changes.framework` | none | No `openspec/` directory, no config, and no `openspec` in `package.json`. `git ls-files \| grep -iE 'openspec'` returned nothing (`shows the value`). |
| 0016 | `changes.schema` | none | It is `none` whenever the framework is `none` (`shows the value`). |
| 0018 | `dependencies.updater` | none | `git ls-files` has no `dependabot.yml` or `renovate*` file, and the bot-author count above is 0 (`shows the value`). |
| 0018 | `dependencies.automerge` | none | No workflow in `.github/` uses `fetch-metadata` or `gh pr merge`, and there is no updater (`shows the value`). |
| 0023 | `license.spdx` | MIT | `package.json` has `"license": "MIT"`, and the root `LICENSE` holds the MIT text (`shows the value`). |
| 0025 | `tools.manager` | none | There is no `mise.toml` or `aqua.yaml`. The 14 files in `scripts/` install no binary, and no workflow mentions mise or aqua (`shows the value`). |

## Group 2: at least one value is held outside the repository or only inferred (19 ADRs)

Only the values I could not show are listed.

| ADR | Key | Where it lives | Citation |
|---|---|---|---|
| 0002 | `localization.language.default` | A choice people make | `CONTRIBUTING.md`, `AGENTS.md` and recent commit subjects are in English, but no file states a rule (`next to it`). |
| 0003 | `architecture.pattern` | A choice people make | `AGENTS.md` says core behaviour is split across `src/lib` and locales sit in `src/locale` (`next to it`). |
| 0005 | `validation.boundary` | A choice people make | `AGENTS.md` says the project has no runtime dependencies, so it uses no validation library (`next to it`). |
| 0006 | `commits.scopes` | A choice people make | Of the last 300 subjects, 7 follow Conventional Commits and none of those 7 was checked for scopes. The rest use tags such as `[bugfix]` and `[locale]` (`next to it`). |
| 0006 | `commits.tool` | Not held outside the repository | Whether `none` stands needs one yes from you. `package.json` has no commitlint, `.githooks/` holds only `pre-commit` and `post-checkout`, and no workflow lints messages. I did not count this as shown, because a forge-side check would leave no file here (`next to it`). |
| 0007 | `tests.coverage_target` | Coveralls settings, outside the repository | `coverage.yml` uploads `lcov.info` to Coveralls and the repository holds no threshold (`next to it`). |
| 0008 | `docs.tool`, `docs.root`, `docs.channels` | The separate `moment/momentjs.com` repository | `.github/ISSUE_TEMPLATE/config.yml` sends website issues to that repository, and `docs/` holds only `adr/` (`next to it`). |
| 0008 | `docs.audience` | A choice people make | The repository is public on GitHub (`next to it`). |
| 0009 | `branching.model` | Forge settings and a choice people make | `origin/HEAD` points to `develop`. `CONTRIBUTING.md` says pull requests go to `develop`, and `master` tracks the last release (`.githooks/pre-commit`, `release.yml`) (`shows the value` for the default branch only, `next to it` for the model). |
| 0009 | `branching.merge` | GitHub repository settings | 136 of the last 300 subjects end in `(#N)`, but the history also holds merge commits (`next to it`). |
| 0009 | `branching.prefixes` | A choice people make | Remote branches such as `mjp/fix-6116-compact-weekday` follow no prefix rule (`next to it`). |
| 0010 | `architecture.document` | A choice people make | `docs/architecture/` does not exist. `THREAT_MODEL.md` and the "Code Organization" section of `CONTRIBUTING.md` might count as `elsewhere` (`next to it`). |
| 0011 | `forge.gate` | A GitHub ruleset | `pull-request.yml` has an aggregate "All passed" job that looks built to be a required check (`next to it`). |
| 0012 | `delivery.release_notes` | GitHub releases page | `CHANGELOG.md` is kept by hand, but any highlights text lives on the forge (`next to it`). |
| 0013 | `frontend.framework` | A choice people make | `package.json` lists no UI framework and ships a library (`next to it`). |
| 0015 | `secrets.storage` | Contributors' machines | `.gitignore` lists `.sauce-labs.creds` and `.coveralls.yml`, which says nothing about where values live (`next to it`). |
| 0015 | `secrets.guard` | Possibly GitHub push protection | No gitleaks hook, workflow or config exists in the repository. Server-side push protection would leave no file (`next to it`). |
| 0017 | `agent.hosts` | Contributors' choice | There is no `.claude/settings.json` or `opencode.json`. `AGENTS.md` and `.agents/skills/` exist (`next to it`). |
| 0019 | `vulnerabilities.scanner` | FOSSA and GitHub settings | `fossa.yml` runs `fossas/fossa-action@v2` with `run-tests: true`, and the policy lives in FOSSA (`next to it`). |
| 0019 | `vulnerabilities.fail_on` | FOSSA policy | Same file (`next to it`). |
| 0020 | `admission.approver` | A choice people make | None. |
| 0020 | `admission.install_scripts` | The package manager's default | `packageManager` is `pnpm@11.22.0` and there is no `allowBuilds`. The default is inferred from the version (`next to it`). |
| 0021 | `supply_chain.build_level` | The npm registry's attestations | `release.yml` runs `pnpm publish --provenance` with `id-token: write`, and `RELEASING.md` says "with provenance". Neither states a level (`next to it`). |
| 0022 | `review.by`, `review.approvals` | A GitHub ruleset | `.github/CODEOWNERS` has `* @moment/collaborators`. No agent settings file exists, so no deny entries are present (`next to it`). |
| 0024 | `code_scanning.tool` | Repository security settings (default setup) | No CodeQL workflow exists, but default setup leaves no file (`next to it`). |
| 0024 | `code_scanning.fail_on` | GitHub ruleset | None. |
| 0026 | `agent.identity` | GitHub accounts and the maintainer's machine | Nothing in the repository records it. |

## Proposed order

1. Group 1, in number order: 0004, 0014, 0016, 0018, 0023, 0025. You can check these against what you know.
2. Group 2, in number order: 0002, 0003, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0013, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

Two points are worth knowing before you agree:
- 0018 comes before 0009, because 0009's check lets the updater's branches through only once 0018 is ruled.
- 0026 comes after 0022, because it depends on it.

Do you agree to this order, or would you rather give another? (I have no question tool here, so please reply in text.)
