# Tasks

## 1. Baseline

- [x] 1.1 Record the current state: `npm test` output (test count and the three coverage percentages) and `npm pack --dry-run` file list; keep both in the pull request description as the reference to compare against

## 2. Toolchain

- [x] 2.1 Add dev dependencies `typescript` (5.8 or later), `@types/node` and `@types/yargs`; verify `npx tsc --version` prints the version
- [x] 2.2 Add `tsconfig.json` (`strict`, `noEmit`, `module`/`moduleResolution: nodenext`, `erasableSyntaxOnly`, `verbatimModuleSyntax`, `rewriteRelativeImportExtensions`, including `bin`, `src`, `test`) and `tsconfig.build.json` extending it (`noEmit: false`, `rootDir: .`, `outDir: dist`, including `bin` and `src` only), and add `dist/` to `.gitignore`; verify `git status` ignores a `dist/` directory
- [x] 2.3 In `package.json` set `engines.node` to `>=22.18`, add `"build": "tsc -p tsconfig.build.json"`, `"typecheck": "tsc"` and `"prepare": "npm run build"`, set `bin` to `dist/bin/ontrack.js` and `files` to `["dist/"]`, and point the `test` script at `test/**/*.test.ts`; verify `npm pkg get engines bin files scripts` shows the new values

## 3. Migrate the sources

- [x] 3.1 `git mv` every `.mjs` under `src/`, `bin/` and `test/` to `.ts` in one commit with no content change; verify `git ls-files 'src/**' 'bin/**' 'test/**' | grep -c '\.mjs$'` prints `0`
- [x] 3.2 Rewrite relative import specifiers from `.mjs` to `.ts` everywhere, and keep the shebang of `bin/ontrack.ts`; verify `grep -rn "\.mjs'" src bin test` prints nothing and `node bin/ontrack.ts --help` prints the help
- [x] 3.3 Type the leaf modules `revision`, `sources`, `links` (JSDoc types become signatures and exported types); verify `npm run typecheck` reports no error in these three files
- [x] 3.4 Type `plan`, `instructions`, `agents`, `review`, `apply`; verify `npm run typecheck` reports no error under `src/` outside `cli.ts` and `commands/`
- [x] 3.5 Type `cli` and the four `commands/` modules, and `bin/ontrack.ts`; verify `npm run typecheck` reports no error under `src/` and `bin/`
- [x] 3.6 Type the tests and `test/helpers/project.ts`; verify `npm run typecheck` exits `0` and `grep -rnE ': any\b|as any\b|@ts-(ignore|expect-error)' src bin test` prints nothing

## 4. Verify behaviour is unchanged

- [x] 4.1 Run `npm test` on Node 24; verify the test count equals the baseline of 1.1 less one (the baseline ran `test/helpers/project.mjs` as a test file; the `test/**/*.test.ts` pattern no longer does) and the three coverage thresholds pass at 95 %
- [ ] 4.2 Run `npm test` on Node 22.18; verify the same test count and thresholds pass, with no flag and no warning about type stripping
- [x] 4.3 Run `npm run build`; verify `node dist/bin/ontrack.js plan` in this repository prints the same output as `main`'s `node bin/ontrack.mjs plan`
- [x] 4.4 Verify `npm pack --dry-run` lists only `dist/bin/`, `dist/src/`, `dist/package.json`, `package.json`, `README.md` and `LICENSE`, and no `.ts` or test file

## 5. CI and documentation

- [ ] 5.1 In `.github/workflows/test.yml`, add `npm run typecheck`, `npm run build` and `node dist/bin/ontrack.js --help` to the `test` job, and replace the `node-20` job with `node-22` (`node-version: '22.18'`, `npm ci`, `npm test`), removing the "behaviour only" comment; verify both checks pass on the pull request
- [x] 5.2 Read ruleset `27253716`; if it requires `node-20`, with the maintainer's go-ahead replace that context with `node-22` in the same step as merging; verify `gh api repos/trivoallan/ontrack/rulesets/27253716 --jq '.rules[].parameters.required_status_checks[].context'` lists no `node-20`
- [x] 5.3 Update the README: supported Node version (22.18 or later) near the install command, and the development section (TypeScript sources run directly, `npm run typecheck`, `npm run build`); verify the commands it lists work as written and `grep -n '20\.19' README.md package.json .github/workflows/test.yml` prints nothing

## 6. Install from git

- [ ] 6.1 In a scratch directory on Node 22.18, run `npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git#<pull request branch>` and `npx ontrack --help`; verify the help prints, and record the install duration next to the same install from `main` in the pull request description
- [ ] 6.2 Title the pull request `feat!: …` with a `BREAKING CHANGE` note naming the new Node floor; verify the title passes the commit format of ADR-0006
