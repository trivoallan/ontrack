## Context

The survey sorted ADRs into "already answers" and "needs a discussion" with no definition of the first group. In run 5 the agent filled it with ADRs it could read from history or infer from documents, including values only the forge holds.

## Goals / Non-Goals

**Goals:** make "already answers" mean what the adopter can check in the repository, and make the agent say what it could not see.

**Non-Goals:** changing the seven steps, the order rule, or how an ADR is ruled once reached.

## Decisions

1. **Define the first group by where the value lives, not by how confident the agent is.** A value written in a file or set in configuration qualifies. A ruleset, a forge or registry setting, or an external preset does not, even when a document in the repository describes it. Alternative: let the agent judge "enough evidence". Rejected: that is what run 5 measured.
2. **History alone does not qualify.** A scope list read from past commits is a choice the team still has to make. Alternative: accept history as evidence. Rejected: 4 of the 7 failures in run 5.
3. **Name the value and where it lives.** The second-group row then says what the adopter has to look up.

## Risks / Trade-offs

- [The first group shrinks, and the first ruling may still be ADR-0002] → measured by the next survey run on unseen repositories.
- [Run 5's repositories are now tuning data] → the next run uses new ones.
