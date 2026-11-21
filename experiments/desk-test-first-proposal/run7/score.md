# Run 7 group-1 scoring

| repo | ADR | keys | all visible | unseen key(s) and where they live | agent said unseen | citation for every value | agent's evidence true | note |
|---|---|---|---|---|---|---|---|---|
| node-glob | 0002 | localization.language.{default, documentation, commits, code, comments} | yes | - | - | yes | yes | default english: README.md, AGENTS.md, src/*.ts, changelog.md. Overrides left empty (= default). |
| node-glob | 0004 | languages.main.name | yes | - | - | yes | yes | tsconfig.json, src/*.ts, tshy in package.json |
| node-glob | 0007 | tests.coverage_target | yes | - | - | yes | yes | AGENTS.md:68 "100% test coverage"; ci.yml unix step "complete coverage" without --allow-incomplete-coverage (tap default 100) |
| node-glob | 0010 | architecture.{document, model, diagrams} | yes | - | - | yes | yes | docs/ holds only adr/; no .c4; no mermaid block in tracked .md |
| node-glob | 0013 | frontend.framework (rejected) | yes | - | - | yes | yes | library: package.json exports, no UI deps |
| node-glob | 0014 | tracking.{tool, project} | yes | - | - | yes | yes | AGENTS.md:115-119 (GitHub issue tracker, `fix: #1234`); `git remote -v` github.com/isaacs/node-glob |
| node-glob | 0016 | changes.{framework, schema} | yes | - | - | yes | yes | no openspec/ |
| node-glob | 0018 | dependencies.{updater, automerge} | yes | - | - | yes | yes | no dependabot.yml, renovate.json or renovate key; no dependabot/renovate authors in git log |
| node-glob | 0020 | admission.{approver, install_scripts} | yes | - | - | yes | yes | approver: AGENTS.md:127 (tracked in HEAD). install_scripts: package.json `allowScripts` (HEAD:106), release.yml:43 `npm ci --ignore-scripts`. Caveat: ci.yml:53 runs plain `npm install` on Node 22/24/26; whether that npm honours `allowScripts` is not shown, so `ignored` may not hold in CI |
| node-glob | 0023 | license.spdx | yes | - | - | yes | yes | package.json BlueOak-1.0.0; LICENSE.md (Blue Oak 1.0.0 for the project outside src/ packages) |
| node-glob | 0024 | code_scanning.{tool, fail_on} | yes | - | - | yes (fail_on follows from tool none) | yes | workflows: ci, release, typedoc; no codeql/semgrep. Default setup is excluded by the ADR itself |
| node-glob | 0025 | tools.manager | yes | - | - | yes | yes | no mise.toml/.mise.toml/aqua.yaml |
| jquery | 0002 | localization.language.{default, ...} | yes | - | - | yes | yes | README, CONTRIBUTING, src comments, commit subjects English |
| jquery | 0004 | languages.main.name | yes | - | - | yes | yes | src/*.js, no tsconfig, package.json:6 "type": "module" |
| jquery | 0006 | commits.{scopes, tool} | yes | - | - | yes | yes | scopes: closed list `commitplease.components` package.json:150-174; tool: .husky/commit-msg runs `npx commitplease`. Agent flagged the non-Conventional format |
| jquery | 0007 | tests.coverage_target | yes | - | - | yes | yes | no coverage tool in package.json or workflows |
| jquery | 0010 | architecture.{document, model, diagrams} | yes | - | - | yes | yes | no docs/architecture, .c4 or mermaid outside the ADRs; CONTRIBUTING.md:196-200 |
| jquery | 0012 | delivery.{target, environments, release_tool, release_notes, registry}, deployment.manifests | no | release_notes: the release text and the per-release blog post live on GitHub / blog.jquery.com | no | yes | no (release_notes) | `changelog` means "the generated changelog alone, nothing done at release", but the clone shows a blog post is required for each release: .release-it.cjs:3-7 throws without BLOG_URL, build/release/dist.js:18-19 requires a blog.jquery.com URL, changelog.js:235 inserts it. Other cited facts true: post-release.sh:52-57 manual `npm publish`, .release-it.cjs:22-24, filestash.yml:3-6 push to main, package.json:62. Also unmentioned: filestash.yml uses `environment: filestash` (protection rules are forge-held); release also pushes to the dist repo and CDN (release:dist, release:cdn) |
| jquery | 0013 | frontend.framework (rejected) | yes | - | - | yes | yes | package.json:4 "JavaScript library for DOM operations" |
| jquery | 0014 | tracking.{tool, project} | yes | - | - | yes | yes | package.json bugs.url; CONTRIBUTING.md:63; .github/ISSUE_TEMPLATE.md |
| jquery | 0016 | changes.{framework, schema} | yes | - | - | yes | yes | no openspec/; PULL_REQUEST_TEMPLATE.md |
| jquery | 0018 | dependencies.{updater, automerge} | yes | - | - | yes | yes | .github/dependabot.yml (actions monthly, npm version updates limited to 0); no fetch-metadata |
| jquery | 0021 | supply_chain.build_level | yes | - | - | yes | yes | no workflow publishes; post-release.sh:54-57 `npm publish` without --provenance |
| jquery | 0023 | license.spdx | yes | - | - | yes | yes | package.json:105 MIT; LICENSE.txt |
| jquery | 0025 | tools.manager | yes | - | - | yes | yes | no mise/aqua/.tool-versions |
| mocha | 0002 | localization.language.{default, ...} | yes | - | - | yes | yes | README, CONTRIBUTING, docs pages, git log subjects, lib/ identifiers |
| mocha | 0004 | languages.main.name | yes | - | - | yes | yes | `git ls-files`: 471 js/cjs/mjs vs 12 .ts (verified) |
| mocha | 0007 | tests.coverage_target | yes | - | - | yes | yes | .nycrc has no check-coverage; scripts/merge-coverage.js exits only on missing reports, no threshold |
| mocha | 0010 | architecture.{document, model, diagrams} | yes | - | - | yes | yes | no docs/architecture, 0 tracked .c4, no mermaid block |
| mocha | 0014 | tracking.{tool, project} | yes | - | - | yes | yes | package.json:30-32 bugs.url; .github/ISSUE_TEMPLATE/* |
| mocha | 0016 | changes.{framework, schema} | yes | - | - | yes | yes | no openspec/ |
| mocha | 0021 | supply_chain.build_level | yes | - | - | yes | yes | release-please.yml:16 id-token: write (workflow level, inherited by npm_publish), :38 ubuntu-latest, :72 `npm publish --provenance` |
| mocha | 0023 | license.spdx | yes | - | - | yes | yes | package.json:25 MIT; LICENSE "The MIT License" |
| mocha | 0025 | tools.manager | yes | - | - | yes | yes | no mise/aqua |
| mocha | 0026 | agent.identity (rejected) | yes | - | - | yes | yes | Rejection rests on MAINTAINERS.md (several maintainers) and the ADR's "Not concerned: repositories with several maintainers". The identity value itself is not asked once rejected. Survey header says "Group 1 (11)" but the table lists 10 |
| dotenv | 0002 | localization.language.{default, ...} | yes | - | - | yes | yes | README, lib/*.js, cli.js; commit 75f8c64 "remove spanish readme" (verified) |
| dotenv | 0003 | architecture.pattern | yes | - | - | yes | yes | Borderline: `monolithic` is a reading of the layout (lib/main.js 409 lines + 3 helpers, verified), backed by the ADR's own "under ~500 lines, or not a service" criterion. No file states it |
| dotenv | 0004 | languages.main.name | yes | - | - | yes | yes | lib/*.js, cli.js CommonJS; .d.ts only for types |
| dotenv | 0007 | tests.coverage_target | yes | - | - | yes | yes | package.json scripts.test `tap ... --disable-coverage` |
| dotenv | 0008 | docs.{tool, root, audience, channels} | yes | - | - | no (channels: "left out", no value and no citation) | yes | tool none and root ./ visible (README only, docs/ holds adr/). audience public: package.json `files` ships README.md to npm, no "private" (accepted as visible; repo visibility itself is a forge setting). No site exists, so channels has nothing to answer, but the agent gave no value or reason |
| dotenv | 0010 | architecture.{document, model, diagrams} | yes | - | - | yes | yes | no docs/architecture, no .c4 |
| dotenv | 0013 | frontend.framework (rejected) | yes | - | - | yes | yes | library + CLI (package.json bin) |
| dotenv | 0016 | changes.{framework, schema} | yes | - | - | yes | yes | no openspec/ |
| dotenv | 0021 | supply_chain.build_level | yes | - | - | yes | yes | only ci.yml (tests), no publish workflow; prepublishOnly `npm pack --dry-run` |
| dotenv | 0023 | license.spdx | yes | - | - | yes | yes | package.json BSD-2-Clause; LICENSE BSD 2-clause text |
| dotenv | 0024 | code_scanning.{tool, fail_on} | yes | - | - | yes | yes | .github/workflows holds only ci.yml |
| dotenv | 0025 | tools.manager | yes | - | - | yes | yes | no tool outside npm |
| yargs | 0002 | localization.language.{default, ...} | yes | - | - | yes | yes | README, docs/*.md, lib/*.ts, git log subjects |
| yargs | 0004 | languages.main.name | yes | - | - | yes | yes | lib/*.ts, tsconfig.json include, typescript devDependency |
| yargs | 0007 | tests.coverage_target | yes | - | - | yes | yes | .nycrc "lines": 100; ci.yaml:63-72 coverage job runs `npm run coverage` = `c8 report --check-coverage` |
| yargs | 0010 | architecture.{document, model, diagrams} | yes | - | - | yes | yes | no docs/architecture, .c4 or diagrams |
| yargs | 0013 | frontend.framework (rejected) | yes | - | - | yes | yes | CLI parser library; browser.mjs is a build |
| yargs | 0014 | tracking.{tool, project} | yes | - | - | yes | yes | contributing.md:5 "## Issues"; `git remote -v` github.com/yargs/yargs |
| yargs | 0016 | changes.{framework, schema} | yes | - | - | yes | yes | no openspec/ |
| yargs | 0017 | agent.hosts | no | hosts: which agent hosts contributors use is a fact about people no file records; AI_POLICY.md says "AI assistance is ok", so agents are used | no | yes | yes | Cited facts true: no .claude/settings.json, opencode.json or .opencode/; AI_POLICY.md restricts agent PRs; no agent trailers in git log. `[]` ("declares no tooling") matches the absent files, but the key asks which hosts contributors work with |
| yargs | 0018 | dependencies.{updater, automerge} | no | automerge: held by the external Renovate preset `config:base` (renovate.json `extends`) and by any org-level config of the Renovate app on GitHub | no | yes | yes | updater renovate visible (renovate.json; renovate/* remote branches, renovate[bot] commits). renovate.json itself has no automerge key |
| yargs | 0021 | supply_chain.build_level | yes | - | - | yes | yes | release-please.yml:13 id-token: write, :15 ubuntu-latest, :32 `npm stage publish --provenance` |
| yargs | 0023 | license.spdx | yes | - | - | yes | yes | package.json:100 MIT; LICENSE |
| yargs | 0025 | tools.manager | yes | - | - | yes | yes | no gitleaks/zizmor/grype/mise/aqua files |

## Raw counts

| repo | group-1 rows | failing rows | failing, agent left unstated | missing a citation | evidence false | group-2 rows | group-2 rows naming an unseen value and where it lives (or unknown) |
|---|---|---|---|---|---|---|---|
| isaacs__node-glob | 12 | 0 | 0 | 0 | 0 | 13 | 13 |
| jquery__jquery | 13 | 1 | 1 | 0 | 1 | 12 | 12 |
| mochajs__mocha | 10 | 0 | 0 | 0 | 0 | 15 | 15 |
| motdotla__dotenv | 12 | 0 | 0 | 1 | 0 | 13 | 13 |
| yargs__yargs | 12 | 2 | 2 | 0 | 0 | 13 | 13 |
| **total** | **59** | **3** | **3** | **1** | **1** | **66** | **66** |

Failing rows: jquery 0012 (release_notes), yargs 0017 (hosts), yargs 0018 (automerge).

Group-2 caveat: a few rows give a judgement or policy instead of a location (mocha 0013 "judgment call", dotenv 0005 "your decision", dotenv 0020 "policy choice", jquery 0020 "team practice, not written anywhere"). They are counted because each names the key and says no file holds it.
