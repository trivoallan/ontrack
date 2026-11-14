# Tasks

## 1. Package and entry point

- [x] 1.1 Create `package.json` (`name: ontrack`, `type: module`, `bin: { "ontrack": "bin/ontrack.mjs" }`, `engines.node >= 24`, script `test: node --test --experimental-test-coverage --test-coverage-lines=95 --test-coverage-branches=95 --test-coverage-functions=95 --test-coverage-exclude='test/**'`, dependency `yargs ^18`) and a `.nvmrc` set to `24`; check that `npm install` installs only yargs
- [x] 1.2 Write `src/cli.mjs`, exporting `main(argv, { stdout, stderr }) → code`, with yargs in `.exitProcess(false)`: `.command()` for each module in `src/commands/`, `-h` and `-v` aliases, help and code `0` with no argument, `.strict()` and `.fail()` for an unknown command (message pointing to `ontrack --help`, code `1`); then `bin/ontrack.mjs` (shebang, calls `main` and sets `process.exitCode`); check by hand that `node bin/ontrack.mjs --help` lists `plan`
- [x] 1.3 Add `src/commands/plan.mjs`, a yargs command module whose `handler` writes "`plan` is not available yet" to standard error and returns `1`; check that `node bin/ontrack.mjs plan` exits with code 1

## 2. Tests

- [x] 2.1 Write `test/cli.test.mjs`, calling `main` in-process with captured streams and covering every scenario in `specs/cli/spec.md` (explicit help, `-h`, no argument, `--version`, `-v`, typo, `plan` not available yet); check that `npm test` passes
- [x] 2.2 Add `test/bin.test.mjs`, a single test that runs `bin/ontrack.mjs` in a subprocess and checks the real exit code for `--help` (0) and an unknown command (1); check that `npm test` passes
- [x] 2.3 Check that coverage reaches at least 95% in lines, branches and functions on `src/` and `bin/`: `npm test` must pass with the threshold, and fail when a 2.1 test is removed

## 3. Output contract

- [x] 3.1 Complete the README with installation (`npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git`), usage, and an "`ontrack plan` output contract" section reproducing the format and exit codes 0/2/1 from design.md; check that the README example matches design.md word for word
- [x] 3.2 Check `openspec validate cli-skeleton-and-plan-contract --strict` and link the change in trivoallan/ontrack#1
