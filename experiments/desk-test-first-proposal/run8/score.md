# Run 8 scoring: group 1

| repo | ADR | keys | all visible | unseen key(s) and where they live | agent said unseen | citation for every value | labelled | mislabel | agent's evidence true | note |
|---|---|---|---|---|---|---|---|---|---|---|
| cheerio | 0002 | localization.language.{default,documentation,commits,code,comments} | yes (Readme.md, CONTRIBUTING.md, src/**/*.ts, `git log`) | - | n/a | yes | yes ("value") | no | yes | |
| cheerio | 0004 | languages.main.name | yes (tsconfig.json, src/*.ts, package.json `lint:ts`) | - | n/a | yes | yes | no | yes | |
| cheerio | 0010 | architecture.{document,model,diagrams} | yes (absence: no docs/architecture/, grep mermaid/plantuml empty outside ADRs) | - | n/a | yes | yes (value, absence; THREAT_MODEL.md as "next to") | no | yes | |
| cheerio | 0013 | frontend.framework | yes (website/package.json `"astro": "^7.4.12"`) | - | n/a | yes | yes | no | yes | agent flags that a docs site may not count as a UI |
| cheerio | 0014 | tracking.{tool,project} | yes (package.json:16-17 bugs.url, .github/issue_template.md, `git remote -v`) | - | n/a | yes | yes | no | yes | |
| cheerio | 0016 | changes.{framework,schema} | yes (absence of openspec/) | - | n/a | yes | yes | no | yes | |
| cheerio | 0018 | dependencies.{updater,automerge} | yes (.github/dependabot.yml; dependabot-automerge.yml merges semver-minor and semver-patch) | - | n/a | yes | yes | no | yes | agent notes the workflow conflicts with the ADR's fixed rules |
| cheerio | 0023 | license.spdx | yes (package.json:24, LICENSE:1) | - | n/a | yes | yes | no | yes | |
| cheerio | 0025 | tools.manager | yes (absence of mise.toml, aqua.yaml, .tool-versions; zizmor via action in zizmor.yml) | - | n/a | yes | yes | no | yes | |
| handlebars.js | 0002 | localization.language.* | yes (README.md, CONTRIBUTING.md, lib/**/*.js, `git log`) | - | n/a | yes | yes (blanket: "Every citation below shows the value itself") | no | yes | |
| handlebars.js | 0004 | languages.main.name | yes (28 .js and 0 .ts in lib/; package.json:30-31) | - | n/a | yes | yes (blanket) | no | yes | |
| handlebars.js | 0007 | tests.coverage_target | yes (vitest.config.js:75 `lines: 99`) | - | n/a | yes | yes (blanket) | no | yes | other thresholds differ (branches 98, functions 100) |
| handlebars.js | 0013 | frontend.framework | yes (package.json dependencies: no UI framework) | - | n/a | yes | yes (blanket) | no | yes | |
| handlebars.js | 0014 | tracking.{tool,project} | yes (CONTRIBUTING.md:50-51, `git remote -v`) | - | n/a | yes | yes (blanket) | no | yes | |
| handlebars.js | 0016 | changes.{framework,schema} | yes (absence of openspec/) | - | n/a | yes | yes (blanket) | no | yes | |
| handlebars.js | 0018 | dependencies.{updater,automerge} | yes (.github/dependabot.yml; no fetch-metadata in .github/) | - | n/a | yes | yes (blanket) | no | yes | |
| handlebars.js | 0021 | supply_chain.build_level | **no** | build_level: release happens on a maintainer workstation (`pnpm publish`) and any provenance sits on the npm registry, both outside the clone | no | yes | yes (blanket) | **yes**: CONTRIBUTING.md:100-106 describes the manual release, which sits next to the build level | yes (CONTRIBUTING.md shows `pnpm publish`; no `provenance`/`attest` in .github/) | a document in the clone describes the release steps |
| handlebars.js | 0023 | license.spdx | yes (package.json:12, LICENSE) | - | n/a | yes | yes (blanket) | no | yes | |
| node-fetch | 0002 | localization.language.* | yes (README.md, docs/, src/*.js, `git log`) | - | n/a | yes | yes (blanket: "Every citation here shows the value itself") | no | yes | |
| node-fetch | 0004 | languages.main.name | yes (package.json:5 main, :7 type; src/ all .js) | - | n/a | yes | yes (blanket) | no | yes (line ref `package.json:3,7` is off: main is line 5) | |
| node-fetch | 0007 | tests.coverage_target | yes (docs/ERROR-HANDLING.md:37 "we maintain 100% coverage") | - | n/a | yes | yes (blanket) | no | yes | only a prose statement; no threshold configured (package.json:18 only reports to coveralls); agent says so |
| node-fetch | 0013 | frontend.framework | yes (package.json:4 description, :8-11 files) | - | n/a | yes | yes (blanket) | no | yes | |
| node-fetch | 0014 | tracking.{tool,project} | yes (package.json:38-40 bugs.url, :22-25 repository, .github/ISSUE_TEMPLATE/, CONTRIBUTING.md:27) | - | n/a | yes | yes (blanket) | no | yes (line refs off by 1-2) | |
| node-fetch | 0023 | license.spdx | yes (package.json:37, LICENSE.md:1) | - | n/a | yes | yes (blanket) | no | yes | |
| socket.io | 0002 | localization.language.* | yes (README.md, CONTRIBUTING.md, packages/*/README.md, `git log`, lib/**/*.ts) | - | n/a | yes | yes ("Itself", per row) | no | yes | |
| socket.io | 0004 | languages.main.name | yes (CONTRIBUTING.md:99 "TypeScript as the development language", tsconfig.json per package) | - | n/a | yes | yes | no | yes | |
| socket.io | 0013 | frontend.framework | yes (no UI framework in packages/*/package.json) | - | n/a | yes | yes | no | yes | examples/ UIs are demos, agent says so |
| socket.io | 0014 | tracking.{tool,project} | yes (CONTRIBUTING.md:24, packages/socket.io/package.json:43-44, `git remote -v`) | - | n/a | yes | yes | no | yes | |
| socket.io | 0016 | changes.{framework,schema} | yes (absence of openspec/; .github/PULL_REQUEST_TEMPLATE.md) | - | n/a | yes | yes | no | yes | |
| socket.io | 0023 | license.spdx | yes (LICENSE:1, 12 of 12 packages/*/package.json) | - | n/a | yes | yes | no | yes | root package.json has no license field; agent says so |
| winston | 0002 | localization.language.* | yes (README.md, docs/*.md, `git log`, lib/winston/logger.js) | - | n/a | yes | yes ("direct") | no | yes | |
| winston | 0004 | languages.main.name | yes (package.json:60 main; lib/ is .js plus 2 .d.ts) | - | n/a | yes | yes | no | yes | |
| winston | 0007 | tests.coverage_target | yes (jest.config.js:20 `lines: 72.48`; test/jest.config.unit.js:12 collectCoverage) | - | n/a | yes | yes | no | yes | |
| winston | 0013 | frontend.framework | yes (package.json:3, lib/) | - | n/a | yes | yes | no | yes | |
| winston | 0014 | tracking.{tool,project} | yes (.github/ISSUE_TEMPLATE/{bug_report,feature_request}.yml, `git remote -v`) | - | n/a | yes | yes | no | yes | |
| winston | 0016 | changes.{framework,schema} | yes (absence of openspec/) | - | n/a | yes | yes | no | yes | |
| winston | 0018 | dependencies.{updater,automerge} | yes (.github/dependabot.yml; ci.yml only workflow, no fetch-metadata) | - | n/a | yes | yes | no | yes | |
| winston | 0021 | supply_chain.build_level | **no** | build_level: release happens on a maintainer's command line (`npm publish` with 2FA) and any provenance sits on the npm registry, both outside the clone | no | yes | yes ("direct") | **yes**: publishing.md:14 describes the manual release, which sits next to the build level | yes (publishing.md:14 `npm publish`; no publish/attest workflow; package.json:71 prepublishOnly) | a document in the clone describes the release steps |
| winston | 0023 | license.spdx | yes (package.json:76, LICENSE) | - | n/a | yes | yes | no | yes | |
| winston | 0025 | tools.manager | yes (absence of mise.toml, aqua.yaml, install script) | - | n/a | yes | yes | no | yes | |

## Raw counts

| repo | group-1 rows | failing rows | failing, agent left unstated | missing citation | missing label | mislabels | evidence false | group-2 rows | group-2 rows naming an unseen value |
|---|---|---|---|---|---|---|---|---|---|
| cheerio | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 16 | 15 |
| handlebars.js | 9 | 1 | 1 | 0 | 0 | 1 | 0 | 16 | 15 |
| node-fetch | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 19 | 12 |
| socket.io | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 19 | 15 |
| winston | 10 | 1 | 1 | 0 | 0 | 1 | 0 | 15 | 13 |
| **total** | **40** | **2** | **2** | **0** | **0** | **2** | **0** | **85** | **70** |

Group-2 rows not counted as naming an unseen value: cheerio 0008; handlebars.js 0025; node-fetch 0005, 0010, 0015, 0016, 0018, 0021, 0025; socket.io 0005, 0010, 0021, 0025; winston 0010, 0012. These are rows that rest on an absence, defer to another ADR, or call the choice a judgement, without naming a held-elsewhere or unknown value.
