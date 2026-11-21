I'll start with the survey: reading every ADR and checking the repository.
---
I'm surveying the ADRs and have read 0002–0014. Next I'll read 0015–0026, then check the repo for evidence.
---
Now the repository evidence.
---
The shell is in the ADR folder. I'll rerun with the repo root path.
---
I've finished the survey and I'm loading the question tool so I can ask you about the order.
---
## Survey (nothing written)

I read all 25 ADRs. For evidence I looked at the repo's files, `.github/`, `package.json`, and `git log`. I did not run `gh api` against GitHub, so forge settings (rulesets, repo visibility, Dependabot alerts, Vercel) are unread and listed as such.

### Group 1: every value `shows the value` (7 ADRs)

| ADR | Key | Value | Citation |
| --- | --- | --- | --- |
| 0004 Languages | `languages.main.name` | TypeScript | `shows the value`: `AGENTS.md:13` says "`src/` (written in TypeScript)". `git ls-files src` lists 385 tracked files; `tsconfig.json` is present. |
| 0007 Tests | `tests.coverage_target` | `none` | `shows the value`: `grep -n "c8\|coverage\|nyc" package.json` returns nothing, and `.github/workflows/tests.yml` runs no coverage step. |
| 0014 Work tracking | `tracking.tool` | `github-issues` | `shows the value`: `package.json` `bugs.url` is `https://github.com/markedjs/marked/issues`. |
| 0014 | `tracking.project` | `markedjs/marked` | `shows the value`: `package.json` `repository.url` is `git+https://github.com/markedjs/marked.git`. |
| 0016 Changes | `changes.framework` | `none` | `shows the value`: `git ls-files \| grep -ci openspec` returns 0, and the root has no `openspec/`. |
| 0016 | `changes.schema` | `none` | `shows the value`: same as above, with no schema or config file. |
| 0018 Dependencies | `dependencies.updater` | `dependabot` | `shows the value`: `.github/dependabot.yml` has the `npm` and `github-actions` ecosystems. |
| 0018 | `dependencies.automerge` | `none` | `shows the value`: no workflow uses `dependabot/fetch-metadata`. `tests.yml` is the only workflow. |
| 0023 License | `license.spdx` | `MIT` | `shows the value`: `package.json` has `"license": "MIT"`, and the root `LICENSE` holds the MIT text. |
| 0025 Tools | `tools.manager` | `none` | `shows the value`: no `mise.toml`, `aqua.yaml` or install script. No accepted ADR names an outside tool yet. |

### Group 2: at least one value not shown (18 ADRs)

I give one row per value I could not show. Values I could show are left out.

| ADR | Key | Where it lives | Citation |
| --- | --- | --- | --- |
| 0002 | `language.default` | a choice people make | `next to it`: README, docs and `git log` subjects are in English. |
| 0002 | `documentation`, `commits`, `code`, `comments` (4 overrides) | a choice people make | `next to it`: English everywhere. An empty override means "same as default", which no file states. |
| 0003 | `architecture.pattern` | a choice people make | `next to it`: `AGENTS.md` §1 describes a Lexer → Parser → Renderer pipeline, which is not one of the listed patterns. |
| 0005 | `validation.boundary` | a choice people make | `next to it`: no `zod` or `pydantic` in `package.json`. Zero runtime dependencies is a stated priority in `AGENTS.md`. |
| 0005 | `validation.data_files` | a choice people make | `next to it`: no schema tooling in `package.json`. |
| 0006 | `commits.scopes` | a choice people make | `next to it`: scopes in the last 300 commits are `deps-dev` ×87, `release` ×27, `deps` ×9, `cli` ×7, `types`, `rules`, `test`, and others. 117 have no scope. |
| 0008 | `docs.tool` | the repo, but not an allowed value | `next to it`: `docs/build.js` is a custom generator (`build:docs`). The allowed values are starlight, docusaurus, mkdocs or none. |
| 0008 | `docs.root` | the repo | `next to it`: `docs/` holds the pages, and `docs/adr/` exists. |
| 0008 | `docs.audience` | a forge setting (repo visibility) | `next to it`: the origin is `github.com/markedjs/marked`. |
| 0008 | `docs.channels` | the hosting (Vercel) | `next to it`: `vercel.json` exists, and no workflow uses `actions/deploy-pages`. |
| 0009 | `branching.model` | a choice people make | `next to it`: `docs/CONTRIBUTING.md` says fork, branch from `master`, open a PR. |
| 0009 | `branching.prefixes` | a choice people make | `next to it`: history shows types, not branch names. Only one remote branch exists besides `master` (`dependabot/…`). |
| 0010 | `architecture.document` | a choice people make | `next to it`: no `docs/architecture/`; the closest thing is `AGENTS.md` §1. |
| 0010 | `architecture.diagrams` | a choice people make | `next to it`: one page under `docs/` mentions mermaid. |
| 0011 | `forge.gate` | a forge setting (ruleset) | `next to it`: `tests.yml` has 3 jobs, with `Release` needing the other two. Whether they are required checks is unread. |
| 0012 | `delivery.target` | the repo | `next to it`: `.releaserc.json` uses `@semantic-release/npm`, and `package.json` has `publishConfig`. |
| 0012 | `delivery.environments` | the repo | `next to it`: the `Release` job runs on push to `master`. |
| 0012 | `delivery.release_notes` | a choice people make | `next to it`: `CHANGELOG.md` is one line pointing to GitHub releases, and `release-notes-generator` is in `.releaserc.json`. |
| 0012 | `delivery.registry` | npm (outside the repo) | `next to it`: no `Dockerfile`; `package.json` has `publishConfig`. |
| 0012 | `deployment.manifests` | a choice people make | `next to it`: no manifests directory. |
| 0013 | `frontend.framework` | a choice people make | `next to it`: `docs/demo` is plain JS, and `package.json` has no UI framework. |
| 0015 | `secrets.storage` | maintainers' machines | `next to it`: no `.env` or `.envrc` in the repo. CI only uses `secrets.GITHUB_TOKEN`. |
| 0017 | `agent.hosts` | a choice people make | `next to it`: `AGENTS.md` exists, and there is no `.claude/`, `opencode.json` or `.github/copilot/`. |
| 0019 | `vulnerabilities.scanner` | a forge setting (Dependabot alerts) | `next to it`: no scan workflow. Whether alerts are on is unread. |
| 0020 | `admission.approver` | a choice people make | `next to it`: none; the repo has no rule. |
| 0020 | `admission.install_scripts` | a choice people make | `next to it`: no `.npmrc`; CI runs `npm ci --allow-remote=all`. |
| 0021 | `supply_chain.build_level` | the npm registry | `next to it`: `package.json` `publishConfig.provenance: true`, and `id-token: write` on the `Release` job. |
| 0022 | `review.by` | a forge setting (ruleset) | `next to it`: `CONTRIBUTING.md` says the submitter and the reviewer "will not be the same person". |
| 0022 | `review.approvals` | a forge setting (ruleset) | unknown: not read. |
| 0024 | `code_scanning.tool` | a forge setting (CodeQL default setup would leave no file) | `next to it`: no CodeQL or Semgrep workflow. |
| 0024 | `code_scanning.fail_on` | a forge setting (ruleset) | unknown: not read. |
| 0026 | `agent.identity` | maintainers' machines and GitHub | `next to it`: past commits carry the maintainers' own names. |

### Proposed order

Group 1 first, because you can check these against what you know: 0004, 0007, 0014, 0016, 0018, 0023, 0025. Then group 2 by number, so the settings ADRs (0011, 0022, 0024) come after you have had a chance to look at GitHub: 0002, 0003, 0005, 0006, 0008, 0009, 0010, 0011, 0012, 0013, 0015, 0017, 0019, 0020, 0021, 0022, 0024, 0026.

I have no question tool in this session, so please answer in plain text. Do you agree to this order, or do you want another? You can also skip any ADR or stop the review whenever you like. Nothing is edited until you agree to a ruling.
