## Context

`ontrack review` prints a prompt and writes nothing. Its handler (`src/commands/review.ts`) selects, without an argument, the `proposed` ADRs under `docs/adr/`, or else the ruled ADRs `plan` reports as `revised`. It already reads the plan for the second case, through `revisedAdrs` in `src/review.ts`, and treats tracks that cannot be read as "no revised ADR".

An ADR `plan` reports as `new` exists only in its track, under `node_modules`. `review` does not look at it. A person imports it with `ontrack apply`, which then prints on standard error the next step: `claude "$(npx ontrack review)"`, or, as a prompt, ``Run `npx ontrack review` and follow its output.``

Every prompt `review` prints ends by telling the agent to run `npx ontrack apply`, so the agent already runs the one command that writes.

The frontmatter and title of every ADR under `docs/adr/` were read. By title, none rules on the commands of the CLI. Those that constrain this change: `trivoallan/ADR-0007-tests` (95 % coverage), `trivoallan/ADR-0008-documentation` (the documentation is public and lives in `docs/`), `trivoallan/ADR-0016-changes` (this change goes through OpenSpec).

## Goals / Non-Goals

**Goals:**

- A person runs the same two commands, `plan` then `review`, whether the track added a question or revised one.
- `apply` stays the only command that writes, and stays usable alone, without an agent, in CI.
- The prompts for `proposed`, revised and `accepted` ADRs keep their text, so that no existing contract test changes.

**Non-Goals:**

- Merging `apply` and `review` into one command.
- Handling a named ADR that is not imported: `ontrack review SDR-0015` on a new ADR still fails as an unknown ADR. Importing one ADR alone is not something `apply` does.
- Reacting to the other categories of `plan` (`removed`, `check`, `undetermined`, `unreadable`) or to a pending migration. `apply` already handles those it can, and the agent runs it.
- Changing the tutorial: it keeps `apply` as its own step, because the first `AGENTS.md` written without an agent is what it demonstrates.

## Decisions

### An import prompt of two steps, not a longer sequence prompt

When at least one ADR is new, `review` prints a short prompt: run `npx ontrack apply`, then run `npx ontrack review` and follow what it prints. The second run finds the imported ADRs as `proposed` and prints the existing sequence prompt.

*Why not list the new ADRs in the sequence prompt, with an import step before the first:* the sequence prompt names each ADR by the path of its copy. A new ADR has no copy yet, and `apply` can also move existing copies when it migrates a flat layout, so paths printed before `apply` runs can be wrong after it. Running `review` again after `apply` prints paths that exist.

*Why this is acceptable for an agent:* following the output of `npx ontrack review` is what `apply` already suggests on standard error, as its "as a prompt" form. The import prompt uses the same indirection, once.

### The import prompt comes before everything else

Without an argument, the order is: new ADRs, then `proposed` ones, then revised ones. One new ADR is enough to print the import prompt, even when other ADRs are `proposed`.

*Why not rule the `proposed` ADRs first:* the sequence prompt would then be printed twice in one session, once before the import and once after, and the agent would run `apply` at the end of each ruling with new ADRs arriving in the middle of the sequence. Importing first gives one list, in reference order.

### New ADRs are read from the plan, like revised ones

A function next to `revisedAdrs` returns the ADRs whose category is `new`, with the namespace and file name `plan` gives, sorted by reference. It catches the same failure: tracks that cannot be read yield no new ADR, and `plan` remains the command that says why. The handler builds the plan once and passes it to both functions.

The path listed for a new ADR is `docs/adr/<namespace>/<file name>`: where `apply` writes it.

### The message for "nothing to review" is unchanged

`no ADR is proposed or revised, nothing to review` stays true when no ADR is new either. Changing it would break scripts that match it, for no information gained.

## Risks / Trade-offs

- [`review` exits with `2` where it exited with `0`, when the only pending work is an import] → `plan` already exits with `2` for the same repository, and the documentation states the change. It is listed in the proposal.
- [An agent treats the output of the second `review` as data and does not follow it] → the import prompt says explicitly to follow the prompt printed. `apply` gives the same instruction today.
- [`apply` fails, on conflicting traits for instance] → the import prompt tells the agent to stop and report the error.
- [A person who wants to rule the `proposed` ADRs without importing the new ones] → they name the ADR: `ontrack review <adr>` ignores new ADRs.
- [The scenario "No ADR directory" exits with `0`] → it still does when no track is installed. With a track installed and no `docs/adr/`, every ADR is new and the import prompt is printed, which is the first run of a repository.

## Migration Plan

No data to migrate. The change ships in a minor release. The commands reference changes in the same pull request as the code, since the prompt is a contract.

## Open Questions

None. No in-force ADR needs to be revisited.
