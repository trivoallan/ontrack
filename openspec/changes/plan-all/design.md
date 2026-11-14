## Context

`buildPlan` (`src/plan.ts`) classifies each source ADR against the repository's copy, and `formatPlan` prints one line per ADR, skipping the `unchanged` ones. Neither reads `status:`. The only reader of `status:` today is `src/instructions.ts`, which walks `docs/adr/` on its own and strips a trailing comment with a private helper. `apply` reuses `formatPlan` to print what it did.

The request is one person's: see the verdict of every inherited ADR in one screen. A separate `list` command was considered and dropped during discovery.

## Goals / Non-Goals

**Goals:**

- One line per inherited ADR, with its category and its verdict, behind an option.
- Default output and exit code unchanged, so CI jobs and `apply` see nothing.

**Non-Goals:**

- The repository's own ADRs (files directly under `docs/adr/`): `plan` compares against a source, and they have none.
- Showing supersession between ADRs.
- Filters, sorting options, JSON output.

## Decisions

**An option on `plan`, not a new command.** `plan` already computes the category of every ADR and throws the unchanged lines away; the listing is that data, unfolded. A `list` command would repeat the source discovery and add a sixth command for one reader. Alternative considered: `list` with its own format. Rejected: two commands answering overlapping questions.

**The verdict is a fixed column after the category.** `category(12)  verdict(10)  name  title`. The name and title vary in length, so a verdict placed after them would not line up, and a `revised` line already ends with its revision. Ten characters hold `proposed`, `accepted` and `rejected`; a longer value pushes its own line only. Alternative: append the verdict at the end of the line. Rejected: unreadable in a 20-line listing.

**The verdict column exists only with `--all`.** The default output stays byte-identical, which keeps the existing contract and every existing test. Alternative: always show the verdict. Rejected: a format change for every reader to serve one.

**The verdict comes from the repository's copy only; `-` when there is none.** The verdict is the repository's answer. A `new` ADR has no answer yet, and printing the source's `proposed` would present the source's default as a local fact.

**`status:` is read in `src/revision.ts`, through the `adrFrontmatter` model.** That file already owns frontmatter scanning (`readRevision`, `readTitle`, `readCheckLine`), and ADR-0005 puts values read from files ontrack did not write behind a zod model. `readStatus(text)` returns the value or null; `PlannedAdr` gains an optional `status: string | null`, set for every category that has a local copy and left out otherwise, like `from`, `to` and `check`. `instructions.ts` keeps its own reader: unifying the two is a refactoring this change does not need.

**`formatPlan(plan, { all })`.** One formatter, one flag. `apply` calls it without the flag.

## Risks / Trade-offs

- [Two readers of `status:` (`revision.ts`, `instructions.ts`) could drift] → Both strip a trailing comment; the trailing-comment scenario is tested on the new reader with the line the repository really holds.
- [A status longer than ten characters breaks the alignment of its line] → Accepted: the value is shown whole rather than cut.
- [`--all` reads each local copy once more] → The files are already read for the comparison; the status is taken from the same text.
