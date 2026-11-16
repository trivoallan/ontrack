---
title: Cross-cutting Concepts
---

# Cross-cutting Concepts

## Errors and exit codes

Every command returns one of three codes: `0` nothing to do, `2` something
is pending, `1` error. A module reports an error by throwing an `Error`
whose message names what is wrong (a dependency that is not installed, a
field of an `ontrack` key, a file that already exists). Nothing catches it
on the way up except `main`, which prints `ontrack: <message>` on standard
error and returns `1`. A handler returns `0` or `2` and never calls
`process.exit`. Specified in
[cli](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/cli/spec.md).

One step is allowed to fail without failing the command: the instructions block. A
trait conflict or malformed markers skip that step, are reported on a line
of the output, and leave the ADR actions untouched. Specified in
[agents-file](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/agents-file/spec.md).

## Read-only by default, check before write

`plan`, `instructions`, `review` and `check` write no file. `apply` is the
only command that writes, and it separates deciding from doing: all actions
are computed and checked first, then executed. No command opens a network
connection. Specified in
[plan](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/plan/spec.md)
and
[apply](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md).

## Idempotence of `apply`

`apply` acts on the difference `plan` reports, so once that difference is
empty a new run has nothing to do. An ADR the repository already holds is
never overwritten: when its convention moved upstream it is reported as
`revised` and left for a person. Specified in
[apply](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md).

## The managed block of `AGENTS.md`

ontrack owns the lines between `<!-- ontrack:begin -->` and
`<!-- ontrack:end -->` in the root `AGENTS.md`, and nothing outside them.
The block is always regenerated in full from the ADRs under `docs/adr/`,
never edited in place, and the same text is what `ontrack instructions`
prints. Line endings of the surrounding file are kept. Specified in
[agents-file](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/agents-file/spec.md)
and
[instructions](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/instructions/spec.md).

## Files ontrack did not write

ADRs, `package.json` files and `AGENTS.md` are written by other people and
tools. ontrack treats them accordingly:

- JSON it reads is parsed with the zod models of `src/schemas.ts`
  ([ADR-0005](../../adr/engineering/ADR-0005-validation.md)).
- Frontmatter is scanned line by line, and what cannot be read is a
  category (`unreadable`, `undetermined`), not an error. Specified in
  [adr-revision](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/adr-revision/spec.md).
- Trait values are copied verbatim and never interpreted.
- A write changes the lines ontrack owns and no other byte of the file.

## Output as a contract

What each command prints is a format that CI jobs and agents rely on. It is
documented in the [commands reference](../../commands.md)
before it changes, and each module that formats output is a pure function
from data to a string (`formatPlan`, `formatApply`, `formatInstructions`,
`formatChecks`, and the three prompts of `review`), tested on that string.

## Testing

Tests run with Node's own test runner, on the TypeScript sources, with no
build step. Each module has a test file, and `test/helpers/project.ts`
builds a throwaway project on disk for the tests that need one. Commands are
tested through `main` with an `Io` that captures output, so only the test of
the executable starts ontrack as a process. `npm test` fails below
95 % of lines, branches or functions
([ADR-0007](../../adr/engineering/ADR-0007-tests.md)).
