## Why

The exact format of what each command prints is specified in `README.md`,
because the documentation site did not exist when those contracts were
written. The site now has a commands reference, `docs/commands.md`, which
summarizes each command and sends the reader to GitHub for every exact
format. The reference is split across two places, and a reader of the site
leaves it each time they need a contract.

## What Changes

- The output contracts of `plan`, `apply`, `instructions`, `review` and
  `check` move from `README.md` to `docs/commands.md`, each under its
  command. The summary and the contract of a command become one section.
- The contract of the rules block of `AGENTS.md` moves from `README.md` to
  `docs/file-formats.md`, which already describes that block.
- The tests that compare a command's output with the documented example,
  byte for byte, read the example from the site's pages instead of the
  README. The mechanism is kept as it is.
- The specifications that say an output follows "the contract in the
  README" name the commands reference instead.
- `README.md` shrinks to what a visitor of the repository or of the npm page
  needs first: why, installation, the list of commands, a link to the site,
  and the development section.
- The architecture documentation that names the README as the home of the
  contracts names the commands reference instead.
- No command changes what it prints, reads, writes or returns.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `plan`: the output format requirement names the commands reference, not
  the README, as the contract.
- `instructions`: the output format requirement names the commands
  reference, and its byte-for-byte scenario reads that page's example.
- `review`: the three prompt requirements (review, supersession, revised
  ADRs) name the commands reference.
- `check`: the output format requirement names the commands reference, and
  its byte-for-byte scenario reads that page's example.

## Impact

- `README.md`: the sections from "`ontrack plan` output contract" to "The
  rules block in `AGENTS.md`" leave it, about 350 of its 629 lines. "Example
  source" and "Checking the `ontrack` key in your editor" leave it too: the
  site covers both.
- `docs/commands.md`, `docs/file-formats.md`: they receive the contracts and
  lose their links to the README.
- `test/plan.test.ts`, `test/apply.test.ts`, `test/instructions.test.ts`,
  `test/check.test.ts`, `test/review.test.ts`: the file they read the
  documented examples from.
- `src/plan.ts`, `src/apply.ts`, `src/instructions.ts`, `src/check.ts`,
  `src/review.ts`, `src/commands/apply.ts`: comments that say "see README".
- `docs/architecture/arc42/`: sections 1, 2 and 8, and the glossary, where
  they name the README as the place of the contracts.
- `docs/index.md`: the sentence that sends the reader to the README for the
  command outputs.
- Depends on the pull request that adds `docs/file-formats.md` (#92).
- The published npm package is unaffected: it ships `dist/` and `schema/`,
  and its README is the shorter one.
