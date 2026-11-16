## Context

The home page is a Starlight splash page: a hero (title, tagline, three
actions, the logo), then prose 45rem wide. At 1440 by 900 the hero ends
near 700px; nothing else is read without scrolling.

"Start here" holds the tutorial, the concepts and the model. The
navigation is an explicit list in `site/astro.config.mjs`.

ADRs in force that bear on this: engineering/ADR-0008 (Starlight, `docs/`,
pages readable on GitHub), engineering/ADR-0002 (English),
engineering/ADR-0014 (the tracker, and the rule that an agent creates
nothing in it without an explicit request).

## Goals / Non-Goals

**Goals:**

- One page answers "what can it do?", by need, and sends the reader to the
  page that specifies each answer.
- The home page shows six capabilities before the first scroll.

**Non-Goals:**

- Specify behaviour on the new page: the references do.
- Keep the page in step with the code by a check.
- Change the home page's story below the list.

## Decisions

**A page of links, not of prose.** Each capability is a line of a table:
what the reader wants, what ontrack gives, where it is specified. A page
that restated behaviour would be a second copy to keep true. The one
exception is the gap issue, shown with a real example, because no other
page shows one.

**A Markdown file.** `docs/features.md` reads on GitHub as it does on the
site, like the other guides.

**First in "Start here".** A reader deciding whether to try ontrack reads
what it does before the tutorial. Alternative: under "Reference", where
the page would be found by those who already use ontrack and missed by
those who do not yet.

**Six lines on the home page, as a list in a grid.** Starlight's link cards
take two columns and about 80px each: six of them are a screen of their
own. A Markdown list laid out in three columns by CSS takes two rows. It
stays a plain list on a narrow screen. The links are Markdown, so the
build rewrites them like every other link.

**Shorten the hero by CSS, keep its content.** The title, the tagline, the
actions and the logo stay. The padding and the size of the logo are
reduced on the home page only. Alternative: drop the logo or cut the
tagline; rejected, they are what the page says first.

**The gap-issue example lives on the features page.** An earlier draft of
this work put it in the home page's "It governs itself", which made a long
page longer. That section is left as it was.

**Quote the issue, minus its first line.** That line cites
`trivoallan/ADR-0019`, with a link that no longer resolves. The rest is
quoted as written, backticks included, and the page links to the issue.

## Risks / Trade-offs

- [The page drifts from the code] → It holds links and one-line names, not
  behaviour; a renamed anchor fails the link check. A capability added
  later is not caught: review has to.
- [The list is below the fold on a smaller window] → Measured at 1280 by
  720 and at 1440 by 900; a phone shows the hero alone, as before.
- [Six entries is a choice] → Five are the steps of the cycle the home page
  tells, the sixth is what ontrack needs to run; the full list is one
  click away.

## Open Questions

- Should the question of ADR-0014 say that its answer is where gap issues
  are opened? That is a revision in the ontrack-engineering track.
- `docs-site` requires that adding a page edits no navigation file, and the
  navigation is an explicit list. The requirement is stale; this change
  follows the list and leaves the requirement to a change of its own.
