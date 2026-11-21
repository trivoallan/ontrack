I'll start with the survey and write nothing. First I'll read the ADRs and look at the repository.
---
Still in the survey, and nothing is written yet. I've read ADR-0002 to ADR-0017 and I'm now reading ADR-0018 to ADR-0026.
---
Now the repository evidence.
---
Still surveying, nothing written. I'm checking merge style, the `package.json` diff, the docs layout and the main language.
---
The survey is below. I haven't edited any file.

The question tool wasn't available this session, so I'm asking you in plain text at the end.

Counts come from these commands:
- `git log -500 --format=%s | grep …`
- `git rev-list --merges --count HEAD~500..HEAD`
- A `Grep` for `automerge|auto-merge|fetch-metadata|gh pr merge|mergify|zizmor|actionlint|gitleaks|grype|trivy|codeql|semgrep|commitlint|release-please|provenance|attest|syft|sbom` over `.github/`, `package.json`, `Makefile`, `.eslintrc.json`, `.babelrc`, `karma.conf.js` and `support/`. It found 0 matches.

## Group 1: the repository already answers (5 ADRs)

| ADR | Key | Value | Citation |
| --- | --- | --- | --- |
| ADR-0014 | `tracking.tool` | `github-issues` | `package.json:12-13` has `"bugs": {"url": "https://github.com/caolan/async/issues"}`. `shows the value` |
| ADR-0014 | `tracking.project` | `caolan/async` | The same `bugs.url`, plus `repository.url` `https://github.com/caolan/async.git`. `shows the value` |
| ADR-0016 | `changes.framework` | `none` | A `Glob` for `openspec/**` found no file, so no change framework is configured. `shows the value` |
| ADR-0016 | `changes.schema` | `none` | Same `Glob`, and `none` goes with `framework: none`. `shows the value` |
| ADR-0018 | `dependencies.updater` | `dependabot` | `.github/dependabot.yml` has the `npm` and `github-actions` ecosystems. `shows the value` |
| ADR-0018 | `dependencies.automerge` | `none` | The 0-match `Grep` above. The only workflow is `.github/workflows/ci.yml`, and it has no merge step. `shows the value` |
| ADR-0023 | `license.spdx` | `MIT` | `package.json:70` has `"license": "MIT"`, and `LICENSE` is committed at the root. `shows the value` |
| ADR-0025 | `tools.manager` | `none` | A `Glob` for `mise.toml`, `aqua.yaml` and `.tool-versions` found nothing. `support/` holds build and jsdoc scripts and `xyz.sh` (a release script), but no tool installer. `shows the value` |

## Group 2: needs a discussion (20 ADRs)

I give one row per value I could not show. A key I could show has no row: `forge.audit` is `none` because of the 0-match `Grep`. For ADR-0012, `delivery.registry` and `deployment.manifests` are `none` because there is no Dockerfile and no deploy job.

| ADR | Key | Where the value lives | Citation |
| --- | --- | --- | --- |
| 0002 | `default` | A choice people make | `README.md` and recent commit subjects are in English. `next to it` |
| 0002 | `documentation` | A choice people make | `README.es.md` is a Spanish translation of the README. `next to it` |
| 0002 | `commits`, `code`, `comments` | A choice people make (each inherits `default` if left empty) | Recent commit subjects are in English. `next to it` |
| 0003 | `architecture.pattern` | A choice people make | `lib/` holds flat one-function modules, with no layers (`Makefile` `JS_SRC`). `next to it` |
| 0004 | `languages.main.name` | A choice people make | `package.json` `main: dist/async.js`, `.babelrc`, and the `lib/*.js` sources. No file declares the language. `next to it` |
| 0005 | `validation.boundary` | A choice people make | `package.json` has no validation library. `next to it` |
| 0005 | `validation.data_files` | A choice people make | `package.json` has no JSON-Schema tool. `next to it` |
| 0006 | `commits.scopes` | A choice people make | Of the last 500 subjects, 94 carry a scope: `deps-dev` 68, `deps` 18, `docs` 3. Dependabot writes most of them. `next to it` |
| 0006 | `commits.tool` | A local git hook would live outside tracked files | The 0-match `Grep` for `commitlint`, and no `.husky/`. `next to it` |
| 0007 | `tests.coverage_target` | Possibly Coveralls settings, outside the repository | The `nyc` block in `package.json` has only `exclude`, and `ci.yml` uploads to Coveralls. `next to it` |
| 0008 | `docs.tool` | A choice people make | `docs/` is generated jsdoc HTML (`Makefile` `doc` target, `jsdoc` devDependency). jsdoc is not an allowed value. `next to it` |
| 0008 | `docs.root` | A choice people make | `docs/` holds generated output plus `.nojekyll`. `next to it` |
| 0008 | `docs.audience` | A choice people make | `package.json` `homepage` is `https://caolan.github.io/async/`. `next to it` |
| 0008 | `docs.channels` | The GitHub Pages setting, outside the repository | No workflow deploys Pages. `next to it` |
| 0009 | `branching.model` | GitHub settings, outside the repository | The `(#NNNN)` suffixes on recent subjects. `next to it` |
| 0009 | `branching.merge` | GitHub settings, outside the repository | 61 merge commits in the last 500 commits, 3 in the last 100. `next to it` |
| 0009 | `branching.prefixes` | Branch names, which live on the forge | `ci.yml` only mentions `dependabot/**`. `next to it` |
| 0010 | `architecture.document` | A choice people make (`elsewhere` would be outside the repository) | A `Glob` for `docs/architecture/**` found nothing. `next to it` |
| 0010 | `architecture.model` | A choice people make | A `Glob` for `*.c4` and `*.likec4` found nothing. `next to it` |
| 0010 | `architecture.diagrams` | A choice people make | No architecture section files exist. `next to it` |
| 0011 | `forge.gate` | A GitHub ruleset, outside the repository | `ci.yml` has `lint` and `build` jobs on push and pull request. `next to it` |
| 0012 | `delivery.target` | A choice people make | `Makefile` release targets run `npm publish`. `next to it` |
| 0012 | `delivery.environments` | A choice people make | The same `npm publish`, run from a workstation. `next to it` |
| 0012 | `delivery.release_tool` | A choice people make | `Makefile` `release-*` targets call `support/xyz.sh`. `next to it` |
| 0012 | `delivery.release_notes` | GitHub release text, outside the repository | `CHANGELOG.md`. `next to it` |
| 0013 | `frontend.framework` | The question probably doesn't apply (`rejected`) | `package.json` has no UI framework. `next to it` |
| 0015 | `secrets.storage` | The maintainer's workstation | `.gitignore` has no `.env` entry. `next to it` |
| 0015 | `secrets.guard` | A local hook, outside tracked files | The 0-match `Grep` for `gitleaks`, and no `.husky/`. `next to it` |
| 0017 | `agent.hosts` | A choice people make | No `.claude/` or `opencode.json`, which does not show which agents contributors use. `next to it` |
| 0019 | `vulnerabilities.sbom` | GitHub release assets, outside the repository | The 0-match `Grep` for `sbom` and `syft`. `next to it` |
| 0019 | `vulnerabilities.scanner` | Possibly Dependabot alerts (`github`), a GitHub setting | The 0-match `Grep` for `grype` and `trivy`. `next to it` |
| 0019 | `vulnerabilities.fail_on` | Follows `scanner` | No scan job in `ci.yml`. `next to it` |
| 0020 | `admission.approver` | A choice people make | None. Unknown. |
| 0020 | `admission.install_scripts` | The npm version in use, plus `.npmrc` | No `.npmrc` and no `allowScripts` field. `setup-node` runs Node 18, 20 and 21, so npm 12 is not pinned. `next to it` |
| 0021 | `supply_chain.build_level` | The npm registry, outside the repository | `Makefile` runs `npm publish` with no `--provenance`. `next to it` |
| 0022 | `review.by` | A GitHub ruleset, outside the repository | No `.claude/settings.json` denies. Unknown. |
| 0022 | `review.approvals` | A GitHub ruleset, outside the repository | None. Unknown. |
| 0024 | `code_scanning.tool` | Possibly CodeQL default setup, a GitHub setting no file records | The 0-match `Grep` for `codeql` and `semgrep`. `next to it` |
| 0024 | `code_scanning.fail_on` | A GitHub ruleset, outside the repository | None. Unknown. |
| 0026 | `agent.identity` | GitHub accounts and the maintainer's credentials | None. Unknown. |

## Proposed order

1. **Group 1:** ADR-0014, 0016, 0018, 0023, 0025.
2. **Group 2:** in numeric order, 0002 to 0013, then 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

Some ADRs lean on others:
- ADR-0009's check expects 0012 and 0018 to be ruled with or before it.
- ADR-0022 reads 0017's `agent.hosts`.
- ADR-0026 `own` forces 0022 to `peer`.

Do you agree to this order, or do you want another? Reply "agree" or give the order you want, and I'll start with ADR-0014.
