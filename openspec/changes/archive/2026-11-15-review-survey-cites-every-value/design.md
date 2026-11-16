## Context

`review-survey-visible-values` defined the first group by where a value lives and gave four examples of values outside the repository. Run 6 showed the agent checking exactly those examples and missing kinds outside them.

## Goals / Non-Goals

**Goals:** one rule that holds for any value, which the adopter can check from the survey itself.

**Non-Goals:** changing the seven steps or the order rule.

## Decisions

1. **A citation per value, not a category list.** The agent must point at what shows each value: a file, a configuration, or a command's output. Where it can't, the ADR goes to the second group. Alternative: extend the examples. Rejected: run 6 showed the examples bound what the agent checks.
2. **Show the citations in the first group.** The adopter sees what each "already answered" value rests on before agreeing to the order.
3. **"Inferred" is named as a reason for the second group.** Run 5 and run 6 both had inferences (approvals from one maintainer, `none` from no `.env`) placed in the first group.

## Risks / Trade-offs

- [The survey gets longer, with one citation per value] → its length is read in the next run.
- [The first group may shrink to very few ADRs] → counted in the next run; an empty first group is a valid outcome.
