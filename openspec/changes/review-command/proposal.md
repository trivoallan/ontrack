# Proposal

## Why

A source ships its ADRs `proposed`, and they stay that way until someone
rules. This repository holds 14 `proposed` ADRs out of 15, eleven of which
arrived in one import. `ontrack instructions` lists them under "Not yet
decided", but nothing starts the ruling: the user has to open each file and
brief a coding agent by hand, each time in different words.

The expected outcome of a ruling is that the repository aligns with the
source's recommendation. What is left to do per ADR is small and needs the
repository in hand: check that the recommendation's conditions hold here, and
fill the trait keys the source cannot recommend, such as `commits.scopes`. A
coding agent does this well when the protocol is the same every time and it
stops for the user's agreement before writing.

## What Changes

- New command `ontrack review [adr]`. It prints to standard output a prompt
  that asks a coding agent to review **one** `proposed` ADR, for example
  `claude "$(npx ontrack review)"`.
- Without an argument, the ADR is the first pending one in reference order.
  With an argument, it is the ADR named: by its reference
  (`trivoallan/ADR-0006-commits`), its file name without `.md`, or its `adr:`
  identifier.
- The prompt names the ADR's file and title and fixes the protocol: touch
  this ADR only; start from the recommendation and look for evidence against
  it; check conditional recommendations with evidence; propose values for the
  keys left to the repository; propose `rejected` only on evidence; present
  the ruling and **write nothing before the user agrees**; then fill the
  traits, set the status, record the reason for any departure from the
  recommendation, and run `ontrack apply`.
- Exit codes follow the shared contract: `2` when a prompt is printed (a
  ruling is pending), `0` when no ADR is `proposed`, `1` on error (the named
  ADR is unknown, ambiguous, or not `proposed`).
- `review` writes no file and makes no network call. It reads `docs/adr/`
  only, the same ADRs as `instructions`.
- `ontrack --help` lists `review`. The README documents the prompt contract
  first.

Out of scope: ontrack gathering evidence itself, an order of decision between
ADRs, reviewing several ADRs in one prompt, and re-reviewing an `accepted`
ADR whose source revision moved.

## Capabilities

### New Capabilities
- `review`: which ADR `ontrack review` selects, the prompt it prints, and its
  exit codes.

### Modified Capabilities
- `cli`: the "Command help" requirement lists `review` next to `plan` and
  `instructions`.

## Impact

- New `src/review.mjs` and `src/commands/review.mjs`. `src/cli.mjs` registers
  the command. `src/instructions.mjs` exports its ADR reader, which also
  returns each ADR's path relative to the project root.
- `README.md`: `npx ontrack review` under Usage, and a new section for the
  prompt contract.
- New `test/review.test.mjs`; `test/cli.test.mjs` checks the help text.
- No new dependency.
