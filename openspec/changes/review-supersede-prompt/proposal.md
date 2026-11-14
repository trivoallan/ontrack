# Proposal

## Why

Once an ADR is `accepted` its text is frozen, and changing the decision takes a new ADR that lists it in `supersedes:`. ontrack reads that edge (`instructions`, `check`) but offers no way to write it: `ontrack review ADR-0004` answers "is accepted, not proposed: nothing to review". The cheapest path left is to edit the frozen ADR in place, which nothing detects. Every ADR of this repository was ruled on 2026-11-14 and several rulings are ahead of the code (issues #30 to #40), so the first change of mind is near.

## What Changes

- `ontrack review <adr>` on an `accepted` ADR that is in force prints a **supersession prompt** instead of failing. It asks a coding agent to propose a new ADR in `docs/adr/` that supersedes the named one, and to write it only once the user agrees.
- The supersession prompt tells the agent to carry over every trait key of the superseded ADR, to cite what changed in the repository since the decision, and to decide what happens to its `check:`.
- The prompt does not say how the superseded ADR is marked, nor which sections the new ADR has: it defers both to the repository's own rules on recording decisions, and leaves the superseded file untouched when those rules are silent.
- `ontrack review <adr>` on an `accepted` ADR that is already superseded fails and names the ADR that supersedes it.
- `ontrack review` without an argument is unchanged: it lists `proposed` ADRs only. Reopening a decision is always a named act.
- `rejected` ADRs, and ADRs with any other status, keep the current error.
- No new command.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `review`: a named `accepted` ADR in force is now a valid selection and yields a supersession prompt; the requirement that the named prompt is one text for every ADR now holds per kind of prompt.

## Impact

- `src/review.mjs`, `src/commands/review.mjs`, `test/review.test.mjs`.
- `README.md`: the `review` section gains the supersession prompt as contract text, and the command list line for `review` is reworded.
- The spec scenario "Already ruled" changes meaning: exit code `1` becomes `2` with a prompt on standard output. A script that relied on `review <accepted ADR>` failing would break; none is known.
- Not in this change: how a superseded ADR is marked is a rule of the source. trivoallan/governance will revise its ADR-0001 (revision 2) to prescribe `status: superseded`; until then the prompt leaves superseded ADRs untouched, which is what ADR-0001 says today.
- Not in this change: reopening a `rejected` ADR, and ruling again an ADR that `plan` reports `revised`.
