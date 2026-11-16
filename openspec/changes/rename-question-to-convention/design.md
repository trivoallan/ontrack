## Context

The archived change `rename-source-to-track` renamed one term across the
code, the documentation and the specs, and recorded it in
`local/ADR-0022`. That ADR also said: "A question stays a question, a
ruling a ruling." This change revisits that sentence.

Where the words live today:

- "question": about 180 times over 14 pages of `docs/`, 19 times in
  `src/review.ts` (the prompts and their comments), in 4 specs, in the
  title of `local/ADR-0022`, and in every imported ADR.
- "rules block" and "Project rules (ontrack)": `src/instructions.ts` writes
  the heading, `src/agents.ts` and `src/commands/apply.ts` print the lines,
  `agents-file`, `plan`, `apply` and `instructions` specify them.
- "verdict": comments and descriptions in `src/`, the specs `plan`, `apply`
  and `adr-revision`, six times in the documentation.
- The text of the prompts is a contract: `docs/commands.md` holds it, and
  `test/review.test.ts` compares it, word for word, with what the code
  prints.

ADRs in force that bear on this: engineering/ADR-0001 (a ruled ADR is not
edited; a change of decision is a new ADR that supersedes),
engineering/ADR-0002 (English), engineering/ADR-0008 (the pages),
engineering/ADR-0010 (arc42 and its glossary), local/ADR-0022 (the track).

## Goals / Non-Goals

**Goals:**

- One word per level, the same in the documentation, the output and the
  specs.
- A reader keeps the word they arrived with.
- No command prints a word the documentation no longer uses.

**Non-Goals:**

- Rename a command, a file format key or a category of `plan`.
- Edit an imported ADR or a ruled one.
- Release the ontrack-engineering track.
- Keep the old words working: no alias, no second heading recognised.

## Decisions

**"Convention" for what a track publishes.** The statuses of the file are
`proposed`, `accepted` and `rejected`: a convention is proposed, accepted
or rejected, a question is not. It is also the word of the home page.
Alternatives: keep "question", which carries in one word that the
repository decides, and costs a second metaphor; "proposal", exact for the
status and already taken by OpenSpec in this repository; "recommendation",
which names one part of the ADR, not the whole.

**The idea of a question stays in one section.** What "question" said in a
word, that nothing is imposed, is now said in a sentence, in "Proposed, not
imposed" of `how-it-works`, and by the status `proposed` itself. Elsewhere
the word is used only in its everyday sense.

**"Ruling" alone for the repository's side.** "Answer" belonged to
"question". "Verdict" was a declared synonym. Where "verdict" meant only
the value of `status:` (the column of `plan --all`, `adr-revision`), the
text says "status", which is what the file says.

**"Instructions" for what agents read.** "Rule on a convention" next to
"the rules agents read" puts a verb and a noun of the same spelling side by
side. The command that prints the block is already `ontrack instructions`.
The heading becomes `## Project instructions (ontrack)`. Alternative: keep
"rules" and change the verb; rejected, "rule" and "ruling" are in every
prompt and "arbitrate" or "decide" say less.

**No migration for the block.** The block is found by its markers, not by
its heading. An existing block differs from the new text by one line, so
`plan` reports it `out of date` and `apply` rewrites it: the mechanism that
already exists.

**"Decision" for a repository's own ADR.** An ADR of `docs/adr/local/` is
asked by no one. Calling only the imported ones conventions makes "ADR"
the file, "convention" what a track puts in it, "decision" what a
repository puts in its own.

**The pages are renamed, with redirects.** `revise-a-question` and
`ontrack-engineering/questions` carry the word in their URL. They follow
the term, as `find-a-source` did, and the old URLs redirect.

**A new ADR supersedes local/ADR-0022.** ADR-0022 holds two decisions: the
package is a track, and no other term changes. The second no longer holds.
A superseded ADR is superseded whole, so ADR-0027 restates the first.

**The everyday senses stay.** "A question tool such as `AskUserQuestion`",
the FAQ, "Conventional Commits", "the repository's rules on recording
decisions" and a forge ruleset are not the terms. The FAQ heading changes
only because "Questions" alone, on a page that used the word as a term,
was ambiguous; it becomes "Common questions".

## Risks / Trade-offs

- [What set ontrack apart was said in one word] → One section says it, the
  home page says "proposed, not imposed", and the status says it in every
  file. Read the home page's first screen again once it is rewritten: if
  it no longer says that the repository decides, the sentence is wrong.
- ["Convention" is also an everyday word] → It is a term only for what a
  track ships; "your engineering conventions" on the home page is the same
  thing before it is written down, which is the point.
- [The imported ADRs keep "A question governance asks your repository"] →
  Named in the proposal; the catalogue pages show the track's own text
  until its next release.
- [A replacement by pattern changes an everyday "question" or "rules"] →
  Each file is read after it is changed; the list of senses that stay is
  in the proposal.
- [The prompts change, so an agent mid-review sees two vocabularies] → A
  review is one session; nothing is stored between sessions.
- [`plan` exits `2` in every repository after the upgrade] → Once, until
  `apply` runs; the release notes say so.

## Migration Plan

1. Code and tests, then `docs/commands.md`, which the tests read.
2. The specs in place, then the other pages.
3. `ontrack apply` here, which rewrites the block of `AGENTS.md`.
4. A repository that upgrades runs `ontrack apply` once.

Rollback is a revert: nothing a repository holds changes but one line.

## Open Questions

- The prompts say "the repository's rules on recording decisions" and "as
  the repository's rules spell out". This is the everyday sense, kept
  here. Should the prompts say "instructions" there too, since those rules
  reach the agent through the block?
- None on the track: its change of the same name rewords its ADRs
  without moving a revision.
