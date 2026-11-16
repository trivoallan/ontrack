Issue served: none

## Why

ontrack describes one cycle with three sets of words. A track ships a
"question" that a repository "answers"; a person "rules" on it, and the
result is a "ruling" or a "verdict"; the file says `proposed`, `accepted`
or `rejected`, and holds a "decision". The seams show: "`rejected` is a
full answer" exists only to join two of the three. A reader arrives with
the word on the home page, "conventions", has to trade it for "question",
and then meets "rule" the verb next to "rules" the noun.

ontrack has one user so far. The words can still change, in the
documentation and in what the commands print, with nothing to migrate.

## What Changes

One word per level:

| Level | Word | Replaces |
| --- | --- | --- |
| What a track publishes | **convention** | question |
| What a repository does with it | **ruling** ("rule on a convention") | answer, verdict |
| An ADR a repository writes for itself, in `docs/adr/local/` | **decision** | (unchanged, and never called a convention) |
| What coding agents read | **instructions** | rules, the rules block |

- "Question" stops being a term. The idea stays in one place: the section
  "Why questions, not rules" of `how-it-works` becomes "Proposed, not
  imposed", and says there, and only there, that a convention is put to
  each repository as a question would be.
- "Answer" goes with it. A repository rules on a convention; what it holds
  is its ruling.
- "Verdict" goes too. Where it meant the repository's decision it becomes
  "ruling"; where it meant the value of `status:`, as in the column
  `plan --all` prints, it becomes "status".
- The traits of a convention are the parameters it leaves to the
  repository.
- **BREAKING** The block `apply` writes in `AGENTS.md` opens with
  `## Project instructions (ontrack)` where it opened with
  `## Project rules (ontrack)`. A repository's block becomes `out of date`
  once, and the next `apply` rewrites it.
- **BREAKING** `plan` and `apply` print `AGENTS.md: instructions block …`
  where they printed `AGENTS.md: rules block …`. A script that matches the
  old text stops matching.
- **BREAKING** The prompts `review` prints say "convention" where they said
  "question", and no longer say "answer".
- **BREAKING** After a `fail` line, `check` prints `adr: <path>` where it
  printed `rule: <path>`. The line holds the path of an ADR, which is also
  the value of `ONTRACK_ADR`.
- The page `revise-a-question` becomes `revise-a-convention`, and
  `ontrack-engineering/questions` becomes `ontrack-engineering/conventions`,
  listed as "Conventions (X.Y.Z)". The old URLs redirect.
- The navigation group "Example: how ontrack answered" becomes "Example:
  how ontrack ruled".
- The home page says what ontrack does without the word "question": its
  description, its section titles, the row of the comparison table that
  reads "carries the decision, not a question", and its FAQ, titled
  "Questions" today, which becomes "Common questions".
- A new ADR, `local/ADR-0027`, records the four words. It supersedes
  `local/ADR-0022`, which named the track and said "a question stays a
  question", and restates that the package is called a track.

Not changed, on purpose:

- "Track", "revision", "trait", "alias", "namespace", "check".
- Nothing a repository holds, except the first line of the block in
  `AGENTS.md`: the `ontrack` key, the frontmatter of an ADR and the layout
  of `docs/adr/` never carried these words.
- The command names: `ontrack instructions` already had the right one.
- The files of `docs/adr/engineering/`: imported copies, which keep the
  wording their track gave them. Each still opens with "A question
  governance asks your repository" until the track is released again.
- The ADRs of `docs/adr/local/` ruled before this change, `CHANGELOG.md`
  and `openspec/changes/archive/`: history.
- These words in their everyday sense: a question asked of the user (the
  "question tool" of the prompts, the FAQ), "Conventional Commits", the
  rules a repository's own ADR prescribes, a ruleset on the forge.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `instructions`: the block opens with `## Project instructions (ontrack)`.
- `agents-file`: the block is the instructions block, and the lines `plan`
  and `apply` print about it say so.
- `apply`: the line it prints when it writes the block; "Verdicts are never
  overwritten" becomes "Rulings are never overwritten".
- `plan`: the block its exit code depends on is named the instructions
  block.
- `review`: the prompts say "convention".
- `check`: the line that names the failing ADR is `adr:`.
- `track-catalogue`: the page and the navigation entry are "Conventions",
  a catalogue page shows the blank convention, and the example group is
  "how ontrack ruled".
- `docs-site`: the two renamed pages redirect.

The other requirements that say "question", "answer" or "verdict" in their
prose (`adr-revision`, the rest of `plan`, `docs-site`) get the new word in
place, with no change of requirement.

## Impact

- **Code**: `src/review.ts` (the prompts), `src/instructions.ts` (the
  heading), `src/agents.ts` and `src/commands/apply.ts` (the printed
  lines), `src/check.ts` (the `adr:` line), `src/commands/plan.ts` and `src/commands/apply.ts` (option
  descriptions), `src/documents.ts` and `src/schemas.ts` (descriptions,
  and the JSON Schema regenerated from them), comments, and their tests.
- **Documentation**: every page of `docs/` except the imported ADRs and
  the ruled local ones; `README.md`; the arc42 pages and the glossary;
  `site/astro.config.mjs` (label, slug, redirects), `site/src/track.mjs`
  and the page that lists the track.
- **This repository**: `AGENTS.md`, rewritten by `apply`.
- **Outside this repository**: the ontrack-engineering track. Its ADRs and
  its README say "question". A change of the same name, proposed in the
  track's repository, follows this one; until then the site shows conventions
  whose own text says "question".
