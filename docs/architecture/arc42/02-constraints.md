---
title: Constraints
---

# Constraints

Each constraint is imposed by one file, linked in the last column. The
reasons are in that file and are not repeated here.

## Technical constraints

| Constraint | Consequence for the design | Imposed by |
| --- | --- | --- |
| Node 22.18 or later | Node runs the TypeScript sources as they are, in development and in the tests; CI runs the tests on Node 22.18 as well as on the development version | `engines` in [`package.json`](https://github.com/trivoallan/ontrack/blob/main/package.json), the `node-22` job of [`test.yml`](https://github.com/trivoallan/ontrack/blob/main/.github/workflows/test.yml) |
| TypeScript is the main language | every module under `src/` is a `.ts` file, type-checked with `tsc` | [ADR-0004](../../adr/trivoallan/ADR-0004-languages.md) |
| The installed package is compiled JavaScript | Node does not run TypeScript from `node_modules`, so `npm run build` compiles `bin/` and `src/` to `dist/`, the only directory the package ships | `files`, `bin` and `scripts.prepare` in [`package.json`](https://github.com/trivoallan/ontrack/blob/main/package.json) |
| Delivered as a package installed from git, no registry | npm builds the package when it installs it (`prepare`); there is no published artifact to download | [ADR-0012](../../adr/trivoallan/ADR-0012-delivery.md) |
| One deployable unit | a single package and a single process; modules call each other in memory | [ADR-0003](../../adr/trivoallan/ADR-0003-architecture.md) |
| Input from outside is validated with zod | the shapes of the files ontrack did not write are declared in one module, `src/schemas.ts` | [ADR-0005](../../adr/trivoallan/ADR-0005-validation.md) |

## Organizational constraints

| Constraint | Consequence for the design | Imposed by |
| --- | --- | --- |
| Tests cover 95 % of lines, branches and functions | `npm test` fails below the threshold, so every module is written to be called from a test | [ADR-0007](../../adr/trivoallan/ADR-0007-tests.md), `scripts.test` in [`package.json`](https://github.com/trivoallan/ontrack/blob/main/package.json) |
| Output formats are contracts | a change to what a command prints goes through the README first | the "output contract" sections of the [README](https://github.com/trivoallan/ontrack#readme) |
| Documentation is public and in English | this document names no internal system and no person's contact detail | [ADR-0008](../../adr/trivoallan/ADR-0008-documentation.md), [ADR-0002](../../adr/trivoallan/ADR-0002-localization.md) |
