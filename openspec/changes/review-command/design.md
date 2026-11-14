# Design

## Context

See proposal.md (Why). `src/instructions.mjs` already reads every ADR of the
repository (`adrFiles` then `readAdr`) into `{ ref, ns, id, status, title,
supersedes, traits }`, and `buildInstructions(root)` returns `{ decided,
pending }`, with `pending` sorted by reference. It throws when two decided
ADRs share a trait key. `readAdr` does not return the file's path.

A command is a module with `command`, `describe`, an optional `builder`, and
`handler({ io })`, whose return value is the exit code. A thrown error becomes
code `1` with `ontrack: <message>` on standard error. `yargs` is strict, so a
positional argument must be declared in `command`.

A governance ADR explains itself: a "What is this file?" note, a Decision
section with a table of recommended values and their reasons, and what
`rejected` means for that question.

## Goals / Non-Goals

**Goals:**
- Pure steps (`pendingAdrs(root)`, `selectAdr(root, name)`) and formatters
  (`formatReview(adr)`, `formatSequence(adrs)`), testable without the CLI, the
  way `instructions` is built.
- A prompt short enough to read in the README.

**Non-Goals:**
- ontrack reading the repository for evidence (`package.json`, `git log`). The
  agent has the repository and does it better.
- Parsing the ADR's Decision section, or telling which trait keys carry a
  recommendation.
- An order of decision between ADRs other than reference order, ruling
  several ADRs on one agreement, and re-review after a source revision.
- Launching an agent. ontrack prints text; the user chooses the agent.

## Decisions

**The prompt is fixed text plus paths and titles.**
Everything specific to the question is already in the ADR, which the prompt
tells the agent to read. ontrack adds what no single ADR holds: the protocol.
The agent has to open the file to edit it anyway, so embedding the ADR's body
would only double the prompt.
*Alternative:* embed the ADR's text, which would make the prompt
self-contained for an agent without file access; such an agent could not
rule the ADR either.

**The agent starts from the recommendation and looks for the exception.**
A repository is expected to align with its source. Asking the agent to argue
both sides of every key would turn fourteen ten-second confirmations into
fourteen debates. The prompt asks for evidence *against* the recommendation,
one line when there is none, and for `rejected` only on evidence.

**Writing waits for agreement, in the conversation.**
The prompt puts "stop, write nothing" before every write instruction. The
user validates the argument, not only the diff. The agent asks with a
question tool when it has one: a structured question is a clearer stop than
a sentence at the end of a long answer, and harder to skip in a sequence.
The prompt names `AskUserQuestion` as an example only, since ontrack does
not know which agent reads it. A pull request as the
validation step would assume branching and forge rules that are themselves
among the pending ADRs.

**Without an argument, every pending ADR, in sequence; with one, that ADR
alone.**
One command then drains the whole queue in one session, and the argument
keeps the single-ADR session for a question worth its own conversation. The
sequence prompt lists the ADRs once and gives the seven steps once, "for each
ADR, in turn". Ruling stays one at a time: the agent stops for agreement on
each ADR, writes it, runs `apply`, and only then takes the next, so stopping
midway leaves a consistent repository. Reference order is free,
deterministic, and the order `instructions` already prints; a decision order
between ADRs would need a dependency key no source ships today.
*Alternative considered first:* one ADR per prompt, the next pending one by
default. It needs one command per ADR, fourteen times here.

**The sequence form is used even with one pending ADR.**
The form depends on how the command was called, not on how many ADRs are
left, so the same call always reads the same way.

**The argument matches a reference, a file name or an identifier.**
`ADR-0006` is what a user types. Without a `/`, the name is looked up in
every directory, and two matches are an error that lists both references,
so that the user retypes one of them.

**`review` reads ADRs without the conflict check.**
`src/instructions.mjs` exports `readAdrs(root)`: every readable ADR, each with
a `path` relative to the project root. `buildInstructions` calls it and keeps
its behavior. `review` filters `proposed` itself. A conflict between two
decided ADRs is unrelated to the question under review, and `apply` already
handles it by skipping the `AGENTS.md` step.
*Alternative:* reuse `buildInstructions(root).pending`, which is one line
shorter but fails on that conflict.

**Exit `2` when a prompt is printed, `0` with an empty standard output when
nothing is pending.**
A pending ruling is a pending change, so CI can count on `2`. The "no ADR is
proposed" message goes to standard error, so that `claude "$(npx ontrack
review)"` does not send that sentence to an agent as a prompt.

**The last step of the prompt is `npx ontrack apply`.**
`apply` already rewrites the rules block of `AGENTS.md` from the ADRs. The
ruled ADR moves from "Not yet decided" to its own section without a new
mechanism.

## Risks / Trade-offs

- [The agent writes before the user agrees] → A prompt cannot enforce it. The
  instruction is explicit and placed before the write steps; the user reviews
  the diff before committing.
- [Rubber-stamping: every ADR accepted as recommended, unread] → The prompt
  requires evidence for each condition and each repository-specific key, and
  an agreement per ADR, also in sequence.
- [A long sequence outgrows the agent's context] → Each ADR is written and
  applied before the next starts, so the session can stop anywhere and
  `ontrack review` resumes with what is left.
- [`npx ontrack apply` also imports new ADRs from sources] → It may touch more
  than `AGENTS.md`. It reports what it did, and it is what the user would run
  next anyway.
- [An ADR written by hand, without a Decision section or recommendation] →
  The prompt still applies: there is nothing to start from, so the agent
  proposes from the repository's evidence alone.
- [Paths with a space or a backtick in the file name] → The path is printed
  as is. ADR file names follow `ADR-NNNN-slug.md`.
