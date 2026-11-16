## Context

`docs/index.mdx` is a Starlight splash page: a hero, then a list of six
capabilities in three columns, then nine sections of prose, about 220
lines. At 1280 by 720 the hero and the list end at 621 pixels: the rest is
below the first screen.

What the nine sections say, and where else it is said:

| Section | Elsewhere |
| --- | --- |
| Conventions are copied, then they drift | Nowhere in full |
| A convention, a ruling, an instruction the agent reads | The tutorial |
| When a convention changes, every repository is told | The features page, the reference of `plan` |
| Next to what you already have | Nowhere |
| Your teams keep their rulings | The features page, "No lock-in" |
| Nothing to migrate away from | The features page, "No lock-in" |
| It governs itself | In part, the page of the reference track |
| Where the project stands | The README; the header, once `show-version-in-header` is applied |
| Common questions | The features page and two guides, but for one answer |

`release-please-config.json` lists `docs/index.mdx` in `extra-files`, for
the version in "Where the project stands".

ADRs in force that bear on this: engineering/ADR-0008 (Starlight, `docs/`,
pages readable on GitHub), engineering/ADR-0002 (English),
engineering/ADR-0012 (release-please).

## Goals / Non-Goals

**Goals:**

- The home page is one screen.
- The problem and the comparison are one click from it, on a page a reader
  chooses to open.

**Non-Goals:**

- Rewrite the hero or the six capabilities.
- Merge the comparison into the features page.

## Decisions

**A page for the "why", not a spread over other pages.** The problem and
the comparison answer one question, "is this for me?", asked before
"what does it do?". Put in "How it works" and in the features page, the
table would sit in a reference a newcomer does not open. Alternative: drop
both; rejected, they are what a reader who does not know ontrack needs,
and nothing else on the site says them.

**"Why ontrack", first in "Start here".** The group then reads why, what,
try, the words, the model. It pairs with "How it works". Alternative: "The
problem", plainer, which names one of the page's four sections.

**The hero's second action leads to it.** "Browse docs" opened the
concepts page; the six capabilities under the hero already are the way
into the documentation. The first action, the tutorial, and the third,
GitHub, stay.

**A Markdown file.** `docs/why-ontrack.md` reads on GitHub as on the site.
The note on linters is written as a GitHub alert, which the site renders
as an aside.

**The text moves; it is not rewritten.** The four sections keep their
wording, with the words of `local/ADR-0027`. One paragraph is new: "Proposed,
not imposed", five lines that link to the section of "How it works" which
says what the approach costs.

**The version leaves the home page.** With the header showing it, a line
of prose that repeats it is one more file for release-please to write.
`show-version-in-header` is applied first, so the site is never without
the number.

## Risks / Trade-offs

- [A home page of sixty words gives a search engine little to index] →
  The text is still on the site, at another address, with a title that
  says what it answers.
- [A reader who arrives cold reads the hero and leaves] → The hero's
  second action is "Why ontrack"; before, the same reader had to scroll.
- [An answer of "Common questions" is lost] → Each of the five is checked
  against the page that now gives it, in the tasks; one line is added to
  the features page.
- [This change is applied before the header shows the version] → The
  order is in the proposal and in the first task.

## Open Questions

- None.
