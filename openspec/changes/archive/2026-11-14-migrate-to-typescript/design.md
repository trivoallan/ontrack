# Design

## Context

See proposal.md for motivation. What constrains the approach:

- ontrack is installed from git (`npm i -D ontrack@git+https://…`), as
  sources, with `files: [bin/, src/]` and no build step.
- Node runs `.ts` natively by type stripping, without a flag from 22.18
  ([Running TypeScript Natively](https://nodejs.org/learn/typescript/run-natively)).
  The maintainer has decided to drop every Node version that cannot:
  `engines.node` becomes `>=22.18`. Development stays on Node 24 (`.nvmrc`).
- That decision does not reach the installed package: "Node.js refuses to
  handle TypeScript files inside folders under a node_modules path"
  ([API, Type stripping in dependencies](https://nodejs.org/api/typescript.html#type-stripping-in-dependencies)),
  at every version. ontrack is always run from `node_modules/ontrack`, so
  what it ships must be JavaScript.
- `npm test` uses Node's built-in runner with 95 % coverage thresholds
  (ADR-0007), which need Node 22.8+. The current `node-20` CI job cannot
  enforce them and runs `node --test` for behaviour only.
- Runtime dependencies are deliberately few (`yargs`).

## Goals / Non-Goals

**Goals:**
- TypeScript sources, strict, as the only hand-written code.
- In this repository, no compile step between editing and running: the CLI
  and the tests run from sources on every supported Node version.
- Installing from git keeps working with one command.

**Non-Goals:**
- Any behaviour change, refactoring or new validation (zod is its own
  change, `validate-boundaries-with-zod`).
- Publishing type declarations: ontrack is a CLI, not a library.
- A linter or formatter.

## Decisions

**`engines.node: >=22.18`.** It is the first version that runs `.ts` with no
flag. Node 20 reached end of life in April 2026, so the floor removed was
already unsupported upstream. This is a breaking change for a consumer
still on Node 20 or on Node 22 before 22.18; the commit is typed `feat!` so
that the version reflects it once releases exist.

**Sources are written so that Node runs them unmodified.** `tsconfig.json`
sets `erasableSyntaxOnly` (no enums, namespaces or parameter properties),
`verbatimModuleSyntax`, `module: nodenext`, and
`rewriteRelativeImportExtensions`, so imports are written `./plan.ts`. In
the repository, `node bin/ontrack.ts` is the CLI and `node --test` runs
`test/**/*.test.ts` directly, with the coverage thresholds. Type stripping
replaces annotations with whitespace, so line coverage maps to the sources.
Alternative: `tsx` or `ts-node`, a dev dependency doing what Node already
does.

**The package ships compiled JavaScript, built by npm's `prepare` script.**
`tsc` compiles `bin/` and `src/` to `dist/`; `bin` becomes
`dist/bin/ontrack.js` and `files` becomes `dist/`. npm runs `prepare` when
it installs a git dependency, after installing that package's dev
dependencies, then packs the result: the consumer gets `dist/` without it
ever being committed. Alternatives considered:
- *Ship `.ts` with no build at all*: what dropping old Node versions would
  ideally buy, but Node does not strip types under `node_modules` (see
  Context). It becomes possible only if ontrack stops being installed as a
  dependency.
- *Commit `dist/`*: two copies of every change in each diff, and a CI check
  needed to prove they match.
- *Keep `.mjs` with JSDoc types checked by `tsc --checkJs`*: typed, but the
  repository would still be written in JavaScript, which is not what
  ADR-0004 rules.
- *Attach a built tarball to each GitHub release and install that*: changes
  the install command ADR-0012 documents, and depends on releases existing.

**`tsc` alone, no bundler.** The code is ten modules with one dependency;
`tsc` type-checks and emits in one pass.

**Tests are not compiled.** With every supported Node able to run `.ts`,
there is no runtime left that needs compiled tests. `tsconfig.json`
type-checks `bin/`, `src/` and `test/` (`tsc --noEmit`); a
`tsconfig.build.json` extending it emits `bin/` and `src/` only. The
existing test that spawns the CLI keeps spawning the source entry point.

**One smoke test covers the compiled package.** Since the tests exercise
sources and consumers run `dist/`, CI runs `node dist/bin/ontrack.js
--help` after the build, and the tasks include one install from git. That
is the whole check of the emitted code: `tsc` output of erasable-only syntax
is the source minus its types.

**`package.json` is imported, not read from disk.** `cli.ts` read its version
through a path relative to itself, which the compiled `dist/src/cli.js` no
longer reaches. It now imports `../package.json` as a JSON module
(`resolveJsonModule`), which Node runs natively and `tsc` copies to
`dist/package.json`: the tarball holds that one extra file. Alternative:
`module.findPackageJSON`, still marked as in active development.

**`@types/yargs` is a dev dependency.** yargs 18 ships no declarations for
Node. The options a command's builder declares and the arguments its handler
receives are linked only by yargs at run time: `cli.ts` casts once, where it
calls the handler, and nowhere else.

**Strict mode from the first commit, no `any` escape hatches added to make
it pass.** The existing JSDoc types (`discoverSources`, `compareRevision`)
become real signatures. Where the compiler finds a genuine hole, the fix
stays within the current behaviour; anything that would change behaviour is
reported, not slipped in.

**One pull request, renames first.** Files are moved with `git mv` in a first
commit so that history follows, then annotated. With squash merges the
split only helps review, which is its purpose.

**CI.** The `test` job (Node 24) gains `npm run build` (the `build` stage
ADR-0011 expects) and the smoke test. The `node-20` job becomes `node-22`,
pinned to `22.18`, and runs `npm test` like the main job: the lowest
supported version now enforces coverage too, and the "behaviour only"
exception disappears.

## Risks / Trade-offs

- [A consumer on Node < 22.18 breaks on update] → `engines` makes npm warn
  at install; the README states the floor; earlier commits and tags stay
  installable.
- [Consumers' installs get slower: npm installs ontrack's dev dependencies,
  including the `trivoallan` git dependency, to run `prepare`] → measured in
  the tasks; if it is unacceptable, the fallback is the release-tarball
  alternative once releases exist.
- [What is tested (sources) is not what is shipped (`dist/`)] → smoke test
  in CI and one real install from git; the emit is type removal only.
- [Coverage on type-stripped sources reports differently from today] →
  thresholds are checked before and after; a drop is investigated, not
  absorbed by lowering 95 %.
- [The CI job is renamed while the ruleset may require `node-20`] → the
  ruleset is updated in the same change; a required check that no longer
  reports would block every pull request.
- [The pending changes that touch `src/` (zod, JSON Schema) conflict with a
  mass rename, and some of their tasks name Node 20.19] → land this change
  first, or rebase them onto it and read "Node 20.19" there as "the lowest
  supported Node".

## Migration Plan

1. Land the change on `main` as a `feat!` commit. Consumers pinned to an
   earlier commit or tag are unaffected.
2. A consumer on Node 22.18 or later picks up the built package
   transparently; one on an older Node upgrades Node first.
3. Rollback: revert the squash commit and restore the ruleset's required
   check. No data or file format is involved.
