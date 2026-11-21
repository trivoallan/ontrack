### pugjs__pug.json cost=1.82 turns=43 subtype=success writes=[]
I'll start with the project rule: run the ontrack review command, then survey the ADRs.
---
Reading the ADRs while that awaits approval.
---
I've read all 25 ADRs; now gathering the repository's evidence (manifests, CI, history) for the survey.
---
Survey done. Here it is. I've written nothing yet.

## Group 1: the repository already answers these (8 ADRs)

| ADR | Key | Value | Citation (shows the value) |
|---|---|---|---|
| ADR-0004 | `languages.main.name` | `JavaScript` | `README.md`: "implemented with JavaScript for Node.js and browsers"; 20 of the 21 source entry files under `packages/` are `.js`, and only `pug-error/src/index.ts` is TypeScript |
| ADR-0010 | `architecture.document` | `none` | Absence: no architecture document. A grep for "architecture" in `*.md` finds only the ADRs and AGENTS.md |
| ADR-0010 | `architecture.model` | `none` | Absence: no `.c4` or `.likec4` file |
| ADR-0010 | `architecture.diagrams` | `none` | Absence: no Mermaid or PlantUML block in any Markdown file |
| ADR-0013 | *(rejected)* | no frontend | `README.md`: "Pug is a high-performance template engine". No package.json names a UI framework, so all 12 packages are libraries |
| ADR-0014 | `tracking.tool` | `github-issues` | `README.md`: "open an issue" links to `github.com/pugjs/pug/issues/new`; also `.github/ISSUE_TEMPLATE.md` |
| ADR-0014 | `tracking.project` | `pugjs/pug` | Same link; `git remote -v` gives `github.com/pugjs/pug` |
| ADR-0016 | `changes.framework` | `none` | Absence: no `openspec/` directory |
| ADR-0016 | `changes.schema` | `none` | Same |
| ADR-0023 | `license.spdx` | `MIT` | `package.json`: `"license": "MIT"`. The root has no `LICENSE` file, but each package has one |
| ADR-0024 | `code_scanning.tool` | `none` | Absence: no workflow uses `codeql-action` or uploads SARIF |
| ADR-0024 | `code_scanning.fail_on` | `none` | Same: with no scanner, nothing blocks |
| ADR-0025 | `tools.manager` | `none` | Absence: no `mise.toml`, `aqua.yaml` or pinned install script, and no accepted ADR names a tool outside npm |

## Group 2: these need a discussion (17 ADRs)

| ADR | Value I could not show | Where it lives | Citations I have |
|---|---|---|---|
| ADR-0002 Localization | `default` (the commit language) | History only (a choice people make) | README and code are in English (shows the value for docs and code); commits are in English (`git log`, history only) |
| ADR-0003 Architecture | `pattern` | A choice people make | `packages/` holds a compiler pipeline (lexer → parser → linker → code-gen). This is next to it: none of the allowed values fits a library well |
| ADR-0005 Validation | `boundary`, `data_files` | A choice people make | Options are checked by hand (`pug/lib/index.js:420`, commit `94d731f6` "doctype option was not validated"). This is next to it |
| ADR-0006 Commits | `scopes` | History only | Last 200 subjects use types without scopes (next to it). `tool: none`: no commitlint or hook (shows the value) |
| ADR-0007 Tests | `coverage_target` | Coveralls settings, or a choice people make | `jest --coverage` and `coveralls` scripts with no `coverageThreshold`. This is next to it |
| ADR-0008 Documentation | `tool`, `root`, `audience`, `channels` | The user docs live at pugjs.org, in another repository | README: "Full documentation is at pugjs.org". This is next to it |
| ADR-0009 Branching | `model`, `merge`, `prefixes` | Forge settings and a choice people make | Subjects end in `(#NNNN)` with no merge commits in recent history, so squash looks likely (history only) |
| ADR-0011 Forge & CI | `forge.gate` | GitHub ruleset | `test.yml` runs on PRs (next to it). `audit: none`: no zizmor or actionlint workflow (shows the value) |
| ADR-0012 Delivery | `release_notes`, the environments' triggers | rollingversions.com, where change logs are written per PR and publishing is approved | `rollingversions.yml`: canary on push, publish on `rollingversions_publish_approved`; registry is npmjs. `target: package` and `release_tool: rollingversions` show the value |
| ADR-0015 Secrets | `storage` | Contributors' machines (unknown) | Workflows use only `GITHUB_TOKEN`. `guard: none`: no gitleaks hook (shows the value) |
| ADR-0017 Agent tooling | `agent.hosts` | A choice people make (which agents contributors use) | No `.claude/` or `opencode.json`. This does not show the value |
| ADR-0018 Dependencies | `updater` | Forge setting (Dependabot security updates) | No `dependabot.yml`, but history has `dependabot[bot]` "Bump stringstream" (#3156). This is next to it |
| ADR-0019 Vulnerabilities | `scanner`, `fail_on` | Forge setting (Dependabot alerts); Tidelift | No scan in workflows; `SECURITY.md` points to Tidelift. `sbom: none` shows the value |
| ADR-0020 Adding deps | `approver` | A choice people make | `install_scripts: allowed`: Yarn classic, with no `.npmrc` or `.yarnrc` disabling scripts (shows the value) |
| ADR-0021 Build provenance | `build_level` | The npm registry | Workflow-level `id-token: write` and `npx rollingversions publish`. This is next to it |
| ADR-0022 Review & merge | `by`, `approvals` | GitHub ruleset and the maintainer team | `package.json` of `pug` lists 8 maintainers. This is next to it |
| ADR-0026 Agent identity | `identity` | A choice people make | None |
---
**Proposed order:** group 1 first (ADR-0004, 0010, 0013, 0014, 0016, 0023, 0024, 0025). Then group 2 in numeric order (0002, 0003, 0005, 0006, 0007, 0008, 0009, 0011, 0012, 0015, 0017, 0018, 0019, 0020, 0021, 0022, 0026).

A few things to know before you answer:
- The `ontrack review` command that AGENTS.md asks for needs your approval. I'll run it once you allow it.
- I have no question tool in this session, so I'm asking here.

**Do you agree to this order, or would you like a different one?** Once you answer, I'll present the first ruling (ADR-0004) and wait for your decision.
