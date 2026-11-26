Issue served: trivoallan/ontrack#244

## Why

A repository that adopts ontrack already holds decisions it never wrote
down. They show in its code, its configuration, its history and its
reviews. Neither `review` nor the `spec-driven-with-adr` schema finds
them. `review` rules only the conventions a track ships. The schema records
a decision only when a change makes it. These decisions stay out of
AGENTS.md, so a coding agent can break them.

## What Changes

- A new command, `ontrack suggest`, prints the prompt a coding agent
  follows to audit the repository once, when it adopts ontrack:
  - The agent reads the repository for decisions it holds but has not
    written down. It looks first at review comments a maintainer repeats,
    then at reversals in the git history, then at rules written by hand in
    AGENTS.md or CLAUDE.md that no ADR backs, and last at configuration
    and dependencies.
  - It keeps a candidate only when a credible alternative exists, one that
    an agent or a newcomer could take instead.
  - It proposes at most five candidates, each with its evidence: a file and
    line, a commit, or a review comment.
  - It drops a candidate that an ADR of the repository already covers. When
    the covering ADR is still `proposed`, it points to `npx ontrack review`.
  - It writes nothing before the user agrees. For each candidate the user
    accepts, it writes an `accepted` ADR in `docs/adr/local/`, with traits so
    that it reaches AGENTS.md and a check when one can verify it, numbered and
    formatted as the supersession prompt of `review` does. Then it runs
    `npx ontrack apply`.
- The prompt lists the ADRs the repository holds and the ADRs its tracks
  would import, so the agent knows what is already covered.
- The numbering sentence, shared by `suggest` and the supersession prompt of `review`, counts the numbers of deleted ADRs, which the git history shows.
- `suggest --json` prints a `suggest` document that holds the prompt, like
  the other commands.
- `suggest` is read-only and offline. It exits with `2` because it always
  prints a prompt to follow.

Not in this change:

- A guard on each diff or pull request. The `spec-driven-with-adr` schema
  already records a decision at the moment a change makes it.
- Reading the repository in ontrack itself. The agent reads it; ontrack
  prints fixed text, paths and titles, as `review` does.
- A command to write a single ADR the user already has in mind (`decide`).
- Proposing a local ADR upstream, to a track.

## Capabilities

### New Capabilities

- `suggest`: the `ontrack suggest` command and the audit prompt it prints.

### Modified Capabilities

- `json-output`: adds the `suggest` document and its published schema.
- `review`: the supersession prompt numbers a new ADR after the highest number ever used in `docs/adr/local/`, deleted files included, so that a number is never reused. The sentence is shared with `suggest`.

## Impact

- `src/suggest.ts` (the prompt) and `src/commands/suggest.ts` (the
  command), registered with the other commands.
- `src/documents.ts`, `schema/suggest.schema.json`: the `suggest` document.
- `docs/commands.md`: the contract, written first. `README.md`: the usage
  line.
- `test/suggest.test.ts`.
