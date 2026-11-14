# Tasks

## 1. Contract first

- [x] 1.1 Update the README output contract: add the `unreadable` category, the count order (revised, new, removed, undetermined, unreadable, unchanged), the 12-character category column, the generic migration format with one `move` line per file, the `no ontrack source found` case, and exit `2` on any category but `unchanged`; check that every example in `specs/plan/spec.md` matches the README word for word

## 2. Planning

- [x] 2.1 Write `buildPlan(root)` in `src/plan.mjs`: discover sources, list `*.md` files directly in each ADR directory, pick the local copy (namespaced, then flat), classify with `compareRevision`, list `removed` files, collect flat-layout files; throw with the source name and path when an ADR directory cannot be read; check it with the "Source ADRs and their local copy", "Classification" and "Flat-layout migration" scenarios in `test/plan.test.mjs`
- [x] 2.2 Write `formatPlan(plan)` producing the contract output; check it with the "Output format" scenarios, comparing with the README examples

## 3. Command

- [x] 3.1 Replace the stub in `src/commands/plan.mjs`: call `buildPlan(io.cwd())`, print `formatPlan`, return `2` or `0` per the "Exit code" requirement; make `bin/ontrack.mjs` keep passing `process`; check it with the "Exit code" scenarios through `main`
- [x] 3.2 Replace the stub test in `test/cli.test.mjs` with the "Exit codes shared by subcommands" scenarios (pending changes → `2`, no `package.json` → `1`); check that `npm test` passes
- [x] 3.3 Add the read-only integration test: snapshot every file's path and bytes under a fixture project, run `plan` through `bin/ontrack.mjs` in a subprocess with that project as working directory, and check the snapshot is identical and the exit code is `2`

## 4. Verification

- [x] 4.1 Run `npm test` on Node 24 and check that it passes with coverage at or above 95% on lines, branches and functions
- [x] 4.2 Run `openspec validate plan-command --strict` and check that it passes
