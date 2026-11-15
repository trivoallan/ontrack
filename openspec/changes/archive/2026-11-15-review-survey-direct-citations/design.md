## Context

`review-survey-cites-every-value` asked for a citation per value. In run 7 every wrong first-group placement had a citation that was true of the repository but showed a neighbouring fact, not the value.

## Goals / Non-Goals

**Goals:** make the agent tell the adopter, for each citation, whether it shows the value or only supports an inference, and keep inferences out of the first group.

**Non-Goals:** changing the seven steps, the order rule, or the second group's reasons.

## Decisions

1. **Name the distinction, not more cases.** "Shows the value itself" against "shows something next to it". Alternative: add the run 7 cases as examples. Rejected: run 6 showed examples bound what the agent checks.
2. **Label every citation, in both groups.** The adopter can see which values are read and which are inferred before agreeing to the order.

## Risks / Trade-offs

- [Longer survey output again] → read in the next run.
- [The agent labels a neighbouring citation as direct] → that is what the next run counts.
