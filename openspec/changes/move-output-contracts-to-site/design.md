## Context

`README.md` holds, between its "Usage" and "Development" sections, the exact
format of what each command prints: about 350 lines, in six sections. They
were written there because the site did not exist.

Three things rely on that text today:

- **Tests.** `test/plan.test.ts`, `test/apply.test.ts`,
  `test/instructions.test.ts` and `test/check.test.ts` each read `README.md`,
  extract one fenced example with a regular expression, and compare it with
  the command's output, byte for byte. `test/review.test.ts` asserts that the
  README contains each of the five prompts `review` can print, inside a `~~~`
  fence.
- **Specifications.** Six requirements, in the `plan`, `instructions`,
  `review` and `check` specs, say the output follows "the contract in the
  README".
- **Documentation.** `docs/commands.md` summarizes each command and links to
  the README section that holds its format, seven times. arc42 sections 1, 2
  and 8 name the README as the home of the contracts.

The decisions in force that bear on this change: ADR-0008 (the documentation
is a Starlight site rooted at `docs/`, for a public audience), ADR-0010 (the
architecture is documented with arc42), ADR-0016 (changes go through
OpenSpec), ADR-0007 (coverage target of 95). None is revisited.

`docs/file-formats.md` is added by pull request #92 and is on this branch.

## Goals / Non-Goals

**Goals:**

- One place holds each contract, and it is on the site.
- The tests keep checking the documented examples against the real output,
  with no loss of coverage.
- A reader of the site never leaves it to find a format.
- The README stays a good first page for the repository and the npm package.

**Non-Goals:**

- Changing what any command prints, reads, writes or returns.
- Rewording the contracts. They move as they are.
- Generating the reference from the code.
- Moving the "Development" section of the README.

## Decisions

### The contracts go into `docs/commands.md`, under each command

Each command section of `docs/commands.md` keeps its summary and receives
the README section of the same command below it, under a third-level heading
"Output contract" ("Prompt contract" for `review`). The link "Format: …" at
the end of each section goes.

Alternative considered: one page per command. Rejected for now: the page
would reach about 500 lines, which the site's table of contents handles, and
five more pages would scatter the exit codes and the shared rules. `review`
is the one section that may deserve its own page later, at 140 lines of
prompts.

Alternative considered: a separate "Output contracts" page. Rejected: it
would keep the split this change removes, between what a command does and
what it prints.

### Where the summary and the contract give the same example, the contract's stays

`docs/commands.md` shows an illustrative `plan` output today
(`trivoallan: 20 new…`), and the README shows the contract's
(`platform: 2 revised…`), which a test checks. Keeping both would give two
examples of one output, one of them unchecked. The contract's example
replaces the illustrative one wherever both exist.

### The rules block contract goes into `docs/file-formats.md`

That page already has a section on the rules block, which ends with a link
to the README for the detail. The README section merges into it.

### The tests read the site's pages, with the same extraction

Each test changes the file it reads, from `../README.md` to
`../docs/commands.md`, and nothing else: the regular expressions and the
`~~~` inclusion checks stay. This holds only if the fences move unchanged,
so the contracts are moved by cutting and pasting whole sections, fences
included.

Alternative considered: a shared helper that extracts a named example.
Rejected: five call sites of two lines each, and no second use.

### The specifications name the page by its path

The six requirements say "the commands reference, `docs/commands.md`". A
path, not a URL: the specs are read in the repository, and the tests read
the file.

### What the README keeps

Why, Installation, Usage (the list of commands and the exit codes), a link
to the site, Development, License. It loses "Example source" and "Checking
the `ontrack` key in your editor", which the tutorial and
`docs/file-formats.md` cover, and the six contract sections.

The npm package page shows this README. A short page that links to the site
serves that reader better than 350 lines of formats.

### arc42 follows

Section 2's constraint "a change to what a command prints goes through the
README first" becomes "goes through the commands reference first". The
principle is unchanged: an output format is a contract, and its
documentation changes before the code. Sections 1 and 8 and the glossary
are updated where they name the README for a contract.

## Risks / Trade-offs

- [A fence is altered while moving, and a test fails] → The tests are the
  check: they fail on any byte of difference. Run them after each section
  moves.
- [The `review` prompts are long single lines, and the site shows them in
  code blocks that scroll sideways] → Check the rendering. If it reads
  badly, turn on line wrapping for code blocks in the site's configuration.
  Do not add anything to the fence line: `test/review.test.ts` matches
  `~~~` followed by a line break.
- [The `instructions` example is a `~~~` block that contains a fenced block]
  → Check that the site renders the inner fence as text.
- [External links to the README's contract anchors break] → They come from
  this repository's own documentation, all updated here, and from the
  governance source's README, which links to the README's top. No redirect
  is possible for an anchor in a file.
- [The README of the version already published on npm keeps the old
  contracts] → It describes that version. Nothing to do.
- [`docs/commands.md` and `docs/file-formats.md` are also touched by open
  pull requests #91, #93 and #96] → Those touch other lines. Merge #92
  first, since this change needs its page.

## Migration Plan

One pull request. No step is deployed apart from the others: the site is
built from `main`, and the README changes in the same merge.

Rollback: revert the merge. No data and no published artifact is involved.

## Open Questions

- Should `review` get its own reference page once its contract is on the
  site? Left for after the move, when the page can be read as rendered.
