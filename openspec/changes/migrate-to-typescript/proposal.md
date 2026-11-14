# Proposal

## Why

ADR-0004 rules `languages.main.name: TypeScript`, but `src/`, `bin/` and
`test/` are plain JavaScript (`.mjs`). Until the code matches, an agent told
to write TypeScript finds a JavaScript repository, and ADR-0005's choice of
`zod` (types derived from schemas) has no types to derive into.
Source: trivoallan/ontrack#30.

## What Changes

- Every `.mjs` file under `src/`, `bin/` and `test/` becomes a `.ts` file,
  type-checked in strict mode.
- **BREAKING**: Node versions that cannot run TypeScript natively are no
  longer supported. `engines.node` goes from `>=20.19` to `>=22.18`.
- In this repository, nothing is compiled to work: the CLI and the tests run
  from the `.ts` sources on every supported Node version.
- The installed package still ships JavaScript, because Node refuses to run
  TypeScript from `node_modules`. A build step compiles `bin/` and `src/` to
  `dist/` in npm's `prepare` script, so installing from git keeps working
  with no committed output.
- CI type-checks and builds; the lowest-version job moves from Node 20.19 to
  Node 22.18 and runs the same source tests as the main job.
- No behaviour changes: commands, output, exit codes and error messages stay
  as specified.

## Capabilities

### New Capabilities
<!-- none: behaviour is unchanged, `skip_specs: true` -->

### Modified Capabilities
<!-- none -->

## Impact

- All files of `src/`, `bin/`, `test/` (about 2,600 lines) are renamed and
  annotated.
- `package.json`: `engines`, `bin`, `files`, `scripts` (`build`, `prepare`,
  `test`), dev dependencies `typescript` and `@types/node`. New
  `tsconfig.json`; `dist/` added to `.gitignore`.
- `.github/workflows/test.yml`: a build step; the `node-20` job becomes
  `node-22`. If the ruleset on `main` requires `node-20` by then
  (`require-node-20-check`), the required check is swapped for `node-22`.
- Consumers on Node older than 22.18 must upgrade Node or stay on an earlier
  commit or tag. Installing ontrack from git now installs its dev
  dependencies and compiles it once, which makes that install slower.
- `README.md`: supported Node version and development section.
