---
artifact: solution-brief
version: "1.0"
created: 2026-11-15
status: draft
evidence: hypothesis
source: research/problem-statement-backlog-reveal.md
related: research/hypothesis-first-proposal.md, research/journey-map-repo-adopter-onboarding.md
---

# Solution Brief: Rule what the history answers, stop when you choose

> **Built on an unvalidated problem.** Feature 1 is cheap enough to ship
> alone; features 2–4 wait for observation round 1.

## Problem Recap

After `ontrack apply`, a first-time adopter reads "24 proposed ADRs to rule":
questions with no shape, no stopping point, and one long agree-on-each loop.
The likely outcomes are an abandoned list or rulings agreed without reading
(see the [problem statement](problem-statement-backlog-reveal.md)).

## Proposed Solution

Make the first session short and evidence-led. `apply` says the repository
works now. `review` starts with the questions the repository's history
already answers, shows the evidence behind every value, and lets the adopter
stop whenever they like. The order comes from evidence the agent finds, not
from ontrack deciding what matters, and the adopter still agrees to every
ruling.

## Key Features

1. **"Usable now" after `apply`:** say the rules block is valid and `check`
   runs only what is decided, and suggest starting with a few questions.

2. **History first:** `review` with no argument has the agent put the ADRs
   the repository already answers (commits, branching, license, tools)
   before those that need a discussion, so the first proposal reads as the
   adopter's own practice.

3. **Evidence on every value:** each value is marked observed (with the file
   or commit that shows it) or absent, building on #205.

4. **Stop anywhere:** a session ends with what was decided and what is still
   open; leaving questions open is a normal outcome.

## Success Metrics

Baselines from observation round 1 (3–5 first-time adopters on their own
repositories); targets measured in round 2.

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Primary: first-session rulings the adopter can justify unprompted | Unknown | ≥ 80%, 5 adopters | Round 2 |
| Adopters who say, unprompted, the repository is usable with questions open | Unknown | ≥ 4 of 5 | Round 2 |
| Guardrail: rulings where the adopter changed or questioned a value | Unknown | At or above baseline | Ongoing |
| Guardrail: proposals citing evidence that doesn't say what it claims | Unknown | ≤ 1 in 20 | Desk test rerun |

## Trade-offs Considered

| What We're Not Doing | Why |
|---------------------|-----|
| A "7 of 24 ruled" counter | On its own it rewards agreeing faster |
| "Accept all recommended" | Removes the per-ruling agreement the review contract requires |
| ontrack ranking questions | ontrack judges nothing; order comes from evidence or the track |
| Importing part of a track | Changes `plan` / `apply`; revisit if round 1 shows adopters want fewer questions |
| Telemetry | A trust problem for a CLI that governs repositories |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Adopters read "24" as a fine to-do list | Med | High | Ship feature 1 only until round 1 confirms |
| "History answers this" invites rubber-stamping | Med | High | Evidence per value and the changed-value guardrail; drop the grouping if it falls |
| The agent misreads the history (desk test run 2: 60%) | Med | Med | Rerun the desk test with observed/absent marking first |
| Some command fails with only `proposed` ADRs | Low | High | Confirm `plan` and `check` exit codes before changing the wording |

## Next Steps

1. Confirm `plan` and `check` exit `0` with only `proposed` ADRs - maintainer, before feature 1
2. OpenSpec change for feature 1, with `docs/commands.md` and the tutorial - maintainer, this week
3. Rerun the desk test with observed/absent marking - maintainer, this week
4. Observation round 1 on current behaviour - maintainer, next two weeks
5. Ask the ontrack-engineering track maintainer whether the track should flag questions that need a discussion - maintainer, alongside round 1
