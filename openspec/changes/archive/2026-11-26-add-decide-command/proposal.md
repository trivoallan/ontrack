Issue served: trivoallan/ontrack#242

## Why

A repository records its own decisions in `docs/adr/local/`. ontrack gives a
coding agent a prompt to write one when it supersedes an ADR
(`review <accepted ADR>`), or when an audit finds decisions never written
(`suggest`, once, at adoption). A decision taken from then on, the one a
user states ("we use pnpm from now on"), has no prompt, and is written
freehand. In this repository it shows. `local/ADR-0027` wrote `supersedes:`
with a slug, so `ADR-0022` stayed in force unnoticed (fixed in #240). The
`supersedes:` entries use three different forms. Of the own ADRs written
outside a prompt, none carries traits or a check, so none reaches
`AGENTS.md` and no agent follows them. The routing sentence of the
instructions block covers "review, rule on or supersede": an agent asked to
record a decision is sent to no command.

## What Changes

- A new command, `ontrack decide`, prints the prompt a coding agent follows
  to record, with the user, the one decision the user's request states. The
  agent:
  - establishes the decision and the alternative it rules out;
  - sends a decision an ADR already covers to `review`;
  - proposes traits and a check, with evidence from the repository;
  - presents the file it will write, numbered as the other prompts number
    a new ADR, and waits for agreement;
  - writes the ADR in `docs/adr/local/`, then runs `apply`.
- Like `suggest`, the prompt lists the ADRs the repository holds and those
  its tracks would import. It shares `suggest`'s wording where the two say
  the same thing, and exits with `2`.
- `decide --json` prints `{ adrs, new, prompt }`, with its published schema.
- The instructions block in `AGENTS.md` gains a sentence that sends an agent
  asked to record a decision to `npx ontrack decide`. Every repository that
  upgrades sees its block reported `out of date` by `plan` once, and `apply`
  rewrites it.

Not in this change:

- Finding decisions the repository took without writing them: that is `suggest`.
- Computing the file number in ontrack: the agent counts, as for `suggest` and `review` (`local/ADR-0029`).
- Proposing a local decision to a track.

## Capabilities

### New Capabilities

- `decide`: the `ontrack decide` command, its prompt and its exit codes.

### Modified Capabilities

- `instructions`: the first lines of the block name `npx ontrack decide`.
- `json-output`: a `decide` document, and `decide` among the published schemas.
- `cli`: the help lists `decide`.

## Impact

- `src/decide.ts` and `src/commands/decide.ts`: the prompt and the command, registered in `src/cli.ts`.
- `src/suggest.ts` and `src/review.ts`: the text `decide` shares with them (`NUMBERING`, the lists of ADRs, the steps that read the rules and write the ADR) is held once.
- `src/instructions.ts`: the sentence of the block.
- `src/documents.ts`, `schema/decide.schema.json`: the document.
- `docs/commands.md`: the contract of `decide` and the block example, changed first.
- A new how-to guide, `docs/record-a-decision.md`, in the sidebar group `Your repository`: when to use `decide` rather than `suggest` or `review`, how to run it, how to check the result.
- `README.md`, `docs/features.md`, `docs/how-it-works.md`, `docs/tutorial.mdx`, `docs/record-the-decisions-you-never-wrote-down.md`: the usage line, a feature row, the flow, links to the guide, and the quoted block.
- The arc42 pages and the LikeC4 model in `docs/architecture/`, wherever `suggest` is named.
- `AGENTS.md` of this repository, rewritten by `apply`.
