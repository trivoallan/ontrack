## Context

Two commands already print a prompt that ends with a new file in
`docs/adr/local/`:

- `review <accepted ADR>` supersedes an ADR (`supersedeSteps` in `src/review.ts`);
- `suggest` audits the repository once, at adoption, for the decisions it
  never recorded, and records those the user agrees to (`src/suggest.ts`,
  from #243).

Both number the new file with the same sentence, `NUMBERING` in
`src/review.ts`. The agent counts after the highest number ever used in
`docs/adr/local/`, deleted files included, and after the own ADRs still in
`docs/adr/`. `local/ADR-0029` records the principle behind them. A command
that hands judgement to an agent prints a prompt: fixed text, plus the facts
ontrack alone holds cheaply (the ADRs, their statuses and titles, what the
tracks would import). It never reads the repository's code, configuration,
history or forge on the agent's behalf.

A decision the user states after adoption has no prompt. The agent writes it
from the repository's rules on recording decisions, which cover the format
and say nothing of traits or a check. This repository shows the result: the
own ADRs written outside a prompt carry neither, and one `supersedes:` entry
resolved to nothing until #240.

The routing sentence of the instructions block (`REVIEW_HINT` in
`src/instructions.ts`) is what sends an agent to ontrack. It covers "review,
rule on or supersede" only.

## Goals / Non-Goals

**Goals:**

- One prompt that takes an agent from the decision a user states to an ADR in `docs/adr/local/`, with traits and a check when it has values to follow, written only once the user agrees.
- The same words as `suggest` and `review` wherever the three prompts say the same thing.
- An agent asked to record a decision finds the command from `AGENTS.md`.

**Non-Goals:**

- Finding decisions not written down: `suggest` does it.
- Computing the file number in ontrack.
- Writing any file: `decide` prints, the agent writes.

## Decisions

### A command of its own, beside `suggest` and `review`

`review [adr]` takes an ADR that exists, and its exit code `0` means that
nothing is left to rule. `suggest` takes nothing and looks for up to five
candidates in the whole repository. `decide` starts from one decision the
user already holds. It has no ADR to name, and nothing to search for.

Alternatives considered:

- `review --new` would give `review` a mode that changes what it reads and what `kind: none` means. `suggest` rejected `review --audit` for the same reason.
- `suggest` with an argument would run the audit's search when the user already knows the answer, and would cap a one-decision request at "five candidates, the weightiest first".

### The name `decide`

`local/ADR-0027` fixes the vocabulary: an ADR a repository writes for
itself is a **decision**. The verb says what the user does, as `review` and
`apply` do.

Alternatives considered: `record` (it says nothing about who decides, and
`suggest` already "records" what it finds); `propose` (it already names a
workflow, `local/ADR-0004`); `new` (it says nothing about what is new).

### The agent counts the number, with the shared sentence

`local/ADR-0029` keeps the repository's history out of ontrack. A number is
never reused (`engineering/ADR-0001`, `local/ADR-0025`), and `local/ADR-0028`
was deleted in #236. A correct number therefore needs the git history,
which the agent reads. The prompt holds `NUMBERING`, as `suggest` and the
supersession prompt do. The three prompts number a new ADR in the same
words, and a change to the rule changes all three.

Alternative considered: compute the number in ontrack from the files and
`git log --diff-filter=D`. It would be exact on a full clone. It would also
need a new ADR refining `local/ADR-0029`, and would give `decide` a source
of truth the two other prompts do not share. Rejected.

### Same lists and shared steps as `suggest`

The prompt lists the ADRs held and the ADRs to import, from
`suggestInputs`, with the text `formatSuggest` uses. The agent needs them for
the same reason: to send a decision an ADR already covers to `review`
instead of writing it twice. The two steps that read the rules and write
the ADR are the same as `suggest`'s steps 1 and 7, and their text is held
once. Specific to `decide`:

- the decision comes from the user's request, and the agent asks when it is unclear;
- a decision an `accepted` ADR covers goes to `review <ref>` to be superseded, where `suggest` just drops the candidate;
- one decision, so there is no merging and no cap.

The tracking-items text of `review` is not in the prompt, as it is not in
`suggest`'s. A decision the repository does not follow yet is the user's
next change, which the user is already asking for.

### Exit code `2`, always

The prompt always has something to follow, as `suggest`'s does, and
`suggest` exits with `2` for that reason. The two commands that print a
prompt without an ADR argument then behave alike. A CI job has no reason to
run either.

### No argument

The agent holds the user's request. A title argument would put user text
inside the fixed text and would not spare the agent the question. Under
yargs' strict mode an argument is refused with `E001`, with no code to
write.

### The routing sentence names both commands

`REVIEW_HINT` becomes two sentences on one line: the one it holds now, then
`When asked to record a new decision, run `npx ontrack decide` and follow its output.`
One line keeps the block's layout. `suggest` is not named: it runs once, at
adoption, on the user's initiative.

## Risks / Trade-offs

- [Every repository's instructions block changes on upgrade] → `plan` reports it `out of date` and `apply` rewrites it, as for any change of the block; the release notes say so.
- [The agent miscounts the number, or cannot read the history] → The same risk as `suggest` and `review`, and `NUMBERING` names the deleted files. `plan` reports a `supersedes:` entry that resolves to nothing (#241), not a reused number.
- [The prompt text drifts from `suggest`'s] → The shared steps and lists are one constant each, and a test compares the lists of both prompts.

## Migration Plan

None beyond the block: `apply` rewrites `AGENTS.md` on the first run after the upgrade. Rollback is a downgrade; the block is rewritten again.

## Open Questions

- None that revisits an ADR in force.
