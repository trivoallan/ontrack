## Context

`review-survey-labelled-citations` restructured the survey. Run 9 showed a clean first group and form defects in the second.

## Decisions

1. **One row per value not shown.** The first group is already one row per value; the second now matches. The heading count stays in ADRs, which is what the adopter agrees an order over.
2. **Only values not shown get a row.** A value that was shown needs no place to live.
3. **Exact label words.** Alternative: accept variants. Rejected: a count of labels is the check the scorer uses.
4. **History alone is `next to it`.** It moves from the second-group clause to the label definition, where the agent assigns it.
5. **Counts come from a command.** The one false count in run 9 was a number given without one.

## Risks / Trade-offs

- [A format change can move a defect elsewhere, as between runs 6 and 7] → measured on five unseen repositories.
