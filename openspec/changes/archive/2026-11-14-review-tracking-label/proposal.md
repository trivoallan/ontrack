# Proposal

Issue served: none

## Why

Every `ontrack review` ends by proposing a tracking item for each ruling the
repository does not follow yet. Nothing tells the agent which of those items
already exist, so a second review proposes them again, and nothing marks the
items ontrack created, so a team cannot filter them in its tracker.

## What Changes

- The tracking paragraph of the review prompt tells the agent to list, before
  proposing, the items of the tracker that carry the label `ontrack`, open and
  closed.
- A ruling is identified by its ADR and trait key (`ADR-0015 secrets.guard`).
  The title of every proposed item starts with that identifier
  (`ADR-0015 secrets.guard: install gitleaks`), and the agent proposes nothing
  for a ruling whose identifier already starts the title of a listed item.
- A closed item that names a ruling the repository still does not follow
  blocks a new proposal; the agent says so in one line and the user decides.
- When the agent cannot list the tracker's items, it proposes every ruling and
  says that duplicates were not checked.
- Every item the agent creates carries the label `ontrack`; the agent creates
  the label first when the tracker requires it.
- The paragraph stays the same text in every prompt that holds it (review,
  supersession, revised), and the README contract follows.

No code is written per tracker: the agent creates the items with its own
tools, as it does today.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `review`: the tracking-items text of the review prompt gains the label, the
  title format and the duplicate check.

## Impact

- `src/review.ts`: the `TRACKING` constant.
- `test/review.test.ts`: assertions on the tracking paragraph.
- `README.md`: the five verbatim copies of the paragraph, and the summary line
  on tracking items.
- An ADR revised upstream after its item was created keeps that item: the
  identifier still matches, and the item may describe the earlier value.
