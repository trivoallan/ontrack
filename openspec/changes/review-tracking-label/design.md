## Context

`review` never talks to a tracker. Its prompt ends with one paragraph, the
`TRACKING` constant in `src/review.ts`, shared by the review, supersession
and revised prompts. That paragraph tells the agent to propose items and to
create the ones the user agrees to, in the tracker that `tracking.tool`
names. The agent then uses its own tools (`gh`, a Linear or Jira connector).
The README copies the paragraph word for word in five prompt examples.

In-force ADRs that apply: trivoallan/ADR-0014-work-tracking (the tracker and
its trait keys) and trivoallan/ADR-0017-agent-tooling (the agent host).
Nothing in this change conflicts with them.

## Goals / Non-Goals

**Goals:**
- A second review does not propose an item that already exists.
- The items ontrack created can be filtered in the tracker.

**Non-Goals:**
- Code per tracker, or a tracker client inside ontrack.
- Updating items whose ADR was revised upstream.
- Closing items once the repository follows the ruling.

## Decisions

**Stay in the prompt.** The agent already creates the items, so the label and
the duplicate check go in the same paragraph. The only difference between
trackers is that GitHub and Linear refuse a label that does not exist and
Jira does not. "Create the label first when the tracker requires it" covers
all three. A client per tracker was rejected: it would duplicate tools the
agent already has, and it would need a token ontrack does not hold.

**The identifier is `ADR-NNNN trait.key`.** The duplicate check needs a key
that can be compared as exact text. A reworded title cannot be. The ADR
alone is too coarse, because one ADR can have several gaps, one per trait.
The trait key alone would be unique (two sources deciding the same key is a
conflict that `instructions` rejects), but `ADR-NNNN` keeps the title
readable. Using the ADR's full reference (`trivoallan/ADR-0015-secrets`) was
rejected as too long for a title.

**Closed items count.** A closed item whose gap is still there is either
abandoned work or a deliberate "won't do". Proposing it again nags, and
ignoring it hides the gap. So the item blocks the proposal, the agent
reports it in one line, and the user decides.

**Fallback when the tracker cannot be listed.** The agent proposes every
ruling and says that duplicates were not checked. This is today's behaviour,
now stated out loud.

**Wording.** The new sentences go before the last sentence ("When no
`tracking` trait is decided…"), so the paragraph still ends the same way.
The existing tests that check how the prompt ends keep passing.

## Risks / Trade-offs

- [An agent may not follow the title format] → The format is written out
  with an example. A wrong title only costs one duplicate on the next review.
- [An item can outlive a revision of its ADR] → The identifier still matches,
  so no duplicate is proposed, though the item may describe the old value.
  Accepted for now.
- [A user can rename an item and drop the identifier] → The next review
  proposes it again, which is visible and easy to undo.
