## Context

ontrack finds the sources of a repository by reading the `ontrack` key of each installed dependency (`openspec/specs/sources/spec.md`). That works once a source is installed. Nothing helps a person find a source to install.

What exists today:

- `docs/write-your-own-source.md` ends with "Publish it", which describes publishing to an npm registry and installing under an alias (#119). It says nothing of how the source is found afterwards.
- This repository installs its own source from the npm registry, as `trivoallan@npm:@trivoallan/ontrack-governance`.
- The registry cannot search on an arbitrary `package.json` key. It can search on `keywords`.
- `keywords:ontrack` on npm returns three unrelated packages. `keywords:ontrack-source` returns none.
- One source is published, by the author of ontrack. It declares no keyword.
- The sidebar of the site is an explicit list in `site/astro.config.mjs`. A new page needs one entry there.

Two readers are served: one who wants to install a source, one who wants to read sources before writing their own.

In-force ADRs that bear on this change: ADR-0002 (English), ADR-0008 (Starlight, `docs/` as root, public audience), ADR-0020 (a person approves each new dependency).

## Goals / Non-Goals

**Goals:**

- A reader finds published sources from the documentation in one click.
- An author knows how to publish to the registry and how to make the source findable.
- A reader who hesitates to install a source knows what it will cost: the number of questions, and that each can be rejected.

**Non-Goals:**

- A list of sources kept by hand in the documentation.
- A command that searches for sources.
- Any check of the `keywords` or the README of a source by ontrack.
- Finding sources published by git URL only.

## Decisions

### A keyword and a search link, not a list

The documentation links to `https://www.npmjs.com/search?q=keywords:ontrack-source` and asks authors to declare that keyword.

Alternative considered: a table of sources in the documentation. Rejected: it has one row today, it needs an edit for each new source, and a row in the official documentation reads as an endorsement of a package whose `check` commands run in the reader's repository. ADR-0020 leaves that approval to a person in each repository.

### The keyword is `ontrack-source`

Alternative considered: `ontrack`. Rejected: unrelated packages already use it, so the search would return noise from the first day.

The keyword is a convention of the documentation. No code reads it. If a later change makes ontrack read it, that change records the decision.

### The README of the source is its listing

The registry shows the README of a package on its page. The guide tells authors what to put there: the number of questions, their subjects, which carry a `check`, and the proposed alias. ontrack does not verify it.

Alternative considered: new fields under the `ontrack` key (a description, a list of subjects) and a command that prints them. Rejected: it adds a format and a command for a need nobody has expressed yet.

### A new page for the reader who installs

`docs/find-a-source.md` is a short how-to. The person who looks for a source to install does not read "Write your own source".

Alternative considered: a section at the end of the author guide. Rejected for that reason. The cost of the page is one sidebar entry.

The page states the cost of a source in plain terms: every question arrives as `proposed` and waits for a ruling; `rejected` is a full answer; a question the author revises comes back, even when it was rejected (`docs/commands.md`, revised ADRs).

### Install from the registry under an alias

The new page gives the registry form of the install, `npm i -D <alias>@npm:<package>`, as the guide and the tutorial already do since #119.

## Risks / Trade-offs

- [The search link returns nothing until one source declares the keyword] → Add the keyword to `@trivoallan/ontrack-governance` in trivoallan/governance before or with the merge. The page also links to that source by name, so it is never a dead end.
- [The link checker of the site covers internal links only] → The npm URL is checked by hand in the tasks.
- [A source published by git URL only stays invisible] → Accepted. Add a second way when someone publishes that way.
- [An author ignores the README advice] → Accepted. It is advice; the reader still sees the ADRs in the repository of the source.

## Open Questions

None.
