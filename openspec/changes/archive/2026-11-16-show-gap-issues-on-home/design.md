## Context

The home page (`docs/index.mdx`) has ten sections. The second, "A question,
an answer, a rule the agent reads", already uses this repository as its
example. The seventh, "It governs itself", is one paragraph of links.

The behaviour to show is specified: the tail of the `ontrack review` prompt
and its contract in `docs/commands.md`. Nothing here changes it.

ADRs in force that bear on this: engineering/ADR-0008 (Starlight, `docs/`),
engineering/ADR-0002 (English), engineering/ADR-0014 (the tracker, and the
rule that an agent creates nothing in it without an explicit request).

## Goals / Non-Goals

**Goals:**

- A reader of the home page learns that an answer the repository does not
  follow yet becomes a proposed issue, and sees one real issue.
- The home page does not grow by a section.

**Non-Goals:**

- Document the mechanism in full: duplicates against closed issues and an
  unreadable tracker stay in `docs/commands.md`.
- Revise the question of ADR-0014 in the track.
- Add a capabilities page.

## Decisions

**Merge into "It governs itself" rather than add a section.** The example
is this repository correcting itself, which is the best evidence that
section could give. A separate section would say "it governs itself" twice.
Alternative: a section of its own, shorter to write, one more heading on a
page that already has many.

**Put both ideas in the heading.** Under "It governs itself" alone, the
capability would stay as hidden as it is now. Alternative: keep the heading
and its anchor; rejected because nothing links to the anchor.

**Move the section up, after the second one.** The story then reads
question, answer, rule, gap issue, revision, and the two sections that use
this repository as their example sit together. Where it is today, the
section comes after the comparison table, which is the table this
capability helps to read.

**Say "issue".** GitHub, Linear and Jira all use the word, and it is the
word of ADR-0014 and of the reference pages.

**Quote the issue, minus its first line.** That line cites
`trivoallan/ADR-0019`, the namespace before the track was renamed, with a
link that no longer resolves. The rest is quoted as written, in a plain
code block, and the page links to the issue for the whole text.
Alternative: rewrite the line under `engineering/`; rejected, a quotation
that was edited is no longer one.

**Address the reader as "you" for the agreement.** "It creates only the
ones you agree to" matches the voice of the rest of the page, though the
paragraphs around it speak of this repository.

## Risks / Trade-offs

- [The example ages: a ruleset or a check is renamed] → The text reports
  what the issue said on the day; the link gives the source.
- [One issue reads as a promise of many] → The section states one case and
  its outcome, and makes no claim about other repositories.
- ["No linter would have found it" is true of #193 and #192, not of #194]
  → The sentence is about the issue shown, and says why.
- [The page of ADR-0014 still does not mention these issues] → Left as an
  open question below.

## Open Questions

- Should the question of ADR-0014 say that its answer is where gap issues
  are opened? That is a revision in the ontrack-engineering track.
