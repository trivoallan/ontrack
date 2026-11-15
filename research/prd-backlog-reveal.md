---
artifact: prd
version: "1.0"
created: 2026-11-15
status: draft
evidence: hypothesis
source: research/solution-brief-backlog-reveal.md
related: research/problem-statement-backlog-reveal.md, research/hypothesis-first-proposal.md
---

# PRD: Rule what the history answers, stop when you choose

> **Two phases, one gate.** Phase 1 (the `apply` wording) is small and safe
> to ship now. Phase 2 (history-first order, evidence, stopping) ships only
> if observation round 1 confirms the problem. The problem is not validated
> yet.

## Overview

### Problem Statement

`ontrack apply` ends with `next: 24 proposed ADRs to rule`. All the questions
look the same, nothing says the repository already works, and `review` walks
through every ADR in catalogue order, one agreement after another. The
likely outcomes are an abandoned list, or rulings agreed without reading
them. See the [problem statement](problem-statement-backlog-reveal.md).

### Solution Summary

`apply` says the repository is usable with questions open. `review` with no
argument starts with the questions the repository's history already answers,
shows the evidence for every value, lets the adopter skip a question, and
ends whenever the adopter says so, with a summary of what is decided and what
is still open. See the [solution brief](solution-brief-backlog-reveal.md).

### Target Users

Repo adopters: tech leads or senior engineers bringing ontrack to an existing
repository for the first time, with a command-line coding agent. Track
authors and returning adopters are not the target, but they see the same
output.

## Goals & Success Metrics

### Goals

1. Adopters can justify the rulings they make in their first session.
2. Adopters know the repository is usable before every ADR is ruled.
3. The first proposal is one the adopter recognises as their own practice.

### Success Metrics

Baselines come from observation round 1 (3–5 first-time adopters, current
behaviour); targets are measured in round 2, after phase 2.

| Metric | Current Baseline | Target | Timeline |
|--------|-----------------|--------|----------|
| Primary: first-session rulings the adopter can justify unprompted | Unknown (round 1) | ≥ 80%, 5 adopters | Round 2 |
| Adopters who say, unprompted, the repository is usable with questions open | Unknown (round 1) | ≥ 4 of 5 | Round 2 |
| Adopters who recognise their first proposal as their own practice | Unknown (round 1) | ≥ 4 of 5 | Round 2 |
| Guardrail: rulings where the adopter changed or questioned a value | Unknown (round 1) | At or above baseline | Ongoing |
| Guardrail: time from `npm i` to the `AGENTS.md` rules block | 14 s | Under 1 minute | Ongoing |

### Non-Goals

- More rulings per session. Ruling count only matters if the primary holds.
- Fewer questions in a track. The track decides what it asks.
- Finishing the backlog in one sitting.

## User Stories

| ID | User Story | Priority |
|----|-----------|----------|
| US-1 | As a repo adopter, I want `apply` to tell me the repository works now, so that I don't read 24 questions as a blocker | P0 |
| US-2 | As a repo adopter, I want my first proposals to be questions my history already answers, so that I can check them against what I know | P1 |
| US-3 | As a repo adopter, I want to see what each proposed value rests on, so that I agree to something I can check | P1 |
| US-4 | As a repo adopter, I want to skip a question or end the session, and be told what is left, so that I can stop without leaving a mess | P1 |

US-2 to US-4 are phase 2.

## Scope

### In Scope

- Phase 1: the `next:` hint printed by `apply`, and the docs that quote it.
- Phase 2: the prompt `review` prints with no argument (`formatSequence`):
  a survey step, history-first order, skipping, and an end-of-session
  summary.

### Out of Scope

- A progress counter ("7 of 24 ruled"). On its own it rewards agreeing
  faster.
- Agreeing to several ADRs in one step, or an "accept all recommended" option.
- ontrack ranking questions itself: the CLI judges nothing.
- A new ADR status (such as `deferred`): `proposed` already means "not
  decided yet".
- Telemetry.
- `review ADR-xxxx`, the revision and supersession prompts: unchanged.

### Future Considerations

- Importing only part of a track. Revisit if round 1 shows adopters want
  fewer questions rather than better-ordered ones.
- A track-level hint on which questions need a discussion. Wait for the
  ontrack-engineering maintainer's view.

## Solution Design

### Functional Requirements

#### Phase 1: the `apply` hint

- FR-1: When `proposed` ADRs remain, the `next:` hint on stderr says that
  the repository is usable now, that `check` runs only the decided ADRs, and
  suggests ruling a few to start. It keeps both invocation forms (shell and
  prompt). Proposed wording:

  ```
  next: 24 proposed ADRs, ruled when you choose: the repository is usable now
    check runs only the decided ones; start with a few:
    from a shell:  claude "$(npx ontrack review)"
    as a prompt:   Run `npx ontrack review` and follow its output.
  ```

- FR-2: The hint for revised ADRs (`to rule again`) is unchanged.
- FR-3: stdout and exit codes of `apply` are unchanged.
- FR-4: `docs/commands.md` and `docs/tutorial.mdx` quote the new hint.

#### Phase 2: the review sequence

- FR-5: Before ruling anything, the prompt has the agent read every
  `proposed` ADR and the repository, then present two lists: the ADRs the
  repository already answers (most values `observed`), and those that need a
  discussion. It asks the user to agree to the order, or change it, before
  the first ruling. It writes nothing during this step.
- FR-6: The agent rules the ADRs in the agreed order, with the existing
  steps 1–7 (each value marked `observed` or `absent`, with its evidence;
  one agreement per ADR).
- FR-7: At each proposal, the user can skip the ADR. A skipped ADR stays
  `proposed`, unchanged on disk, and the agent moves on.
- FR-8: The user can end the session at any proposal. The agent then writes
  nothing more for the open ADR.
- FR-9: When the list is done or the user stops, the agent prints a summary:
  the ADRs ruled this session, the ADRs still `proposed` with the group each
  belongs to, and a sentence saying the repository is usable with them open.
- FR-10: The prompt no longer says "Do not start an ADR before the previous
  one is ruled"; it says "before the previous one is ruled or skipped".
- FR-11: `review` with no argument still exits `2` when it prints a prompt.

### User Experience

The adopter's path: `apply` (14 s), the reassuring hint, `review`, a
two-list survey they agree to, then a few proposals they recognise, each
value with its source. They stop when they choose and see what is left.
There is no counter anywhere.

### Edge Cases

| Scenario | Expected Behavior |
|----------|------------------|
| One `proposed` ADR | Hint uses the singular; no survey step, the prompt goes straight to the ADR |
| Every ADR needs a discussion | The survey says so; the first list is empty, the order stays catalogue order |
| The user rejects the proposed order | The agent uses the order the user gives |
| The user skips every ADR | Nothing is written; summary lists all of them as open |
| The user stops before the end | The tracking step (TRACKING) runs on the rulings made, or not at all: see Open Questions |
| Only revised ADRs remain | FR-2: the revision hint and prompt are unchanged |

## AI Behavior and Evaluation

Phase 2's output comes from the coding agent that follows the prompt, so it
varies run to run. Phase 1 is deterministic and is covered by unit tests.

### Behavior Requirements and Their Evidence

| ID | Behavior required | How it is evaluated | Passing threshold |
|----|-------------------|---------------------|-------------------|
| AB-1 | The survey puts evidence-rich ADRs (commits, branching, languages, license, forge and CI, tools) in the first list | Desk test harness on its 10 repositories, scored against the answer key | Each evidence-rich ADR is in the first list in ≥ 8 of 10 repositories; a judgement fixed before the run, since no grouping has been measured yet |
| AB-2 | A value marked `observed` cites a file, config or commit that says what the agent claims | Manual check of every citation in the desk test proposals | ≤ 1 wrong citation in 20, as in the hypothesis guardrail |
| AB-3 | Abstention: where the repository shows nothing, the value is marked `absent` and says so, not `observed` | Answer-key values whose truth is "does nothing", scored per value | No value the answer key lists as absent is marked `observed` |
| AB-4 | Refusal: no write before agreement, no agreement asked for several ADRs at once, nothing written during the survey | Transcript review of the desk test runs and the observation sessions | Zero occurrences; a single one blocks phase 2 |
| AB-5 | Skip and stop: a skipped ADR is untouched on disk; after "stop", no further file changes and a summary per FR-9 | Scripted sessions where the tester skips one ADR and stops at the third | Zero writes to skipped or open ADRs; summary present in every session |

Each component (survey, per-value marking, write discipline, stopping) is
scored on its own; an end-to-end pass hides which one failed.

### Evaluation Set

- **Where the cases live:** `research/desk-test-first-proposal/` (repositories
  in `repos-at.txt`, `answer-key.md`, harness `run-one-v2.sh`), plus a new
  scripted-session script for AB-5.
- **Slices that must be covered:** each AB-n row; absent values (AB-3) as
  their own slice, since a wrongly `observed` absence is what writes a
  practice nobody has into `AGENTS.md`; the write-discipline cases (AB-4),
  where one failure breaks the review contract.
- **Floor per slice, and what it commits you to:** AB-1: all 10 desk test
  repositories, so every evidence-rich ADR is looked for in every one. AB-3:
  every answer-key value marked "does nothing" (27 in the last run), so each
  known absence is searched for. AB-4 and AB-5: 5 scripted sessions, enough
  to exercise skip, stop and refusal paths at least once each in a repository
  with history; this is a coverage floor, not a rate.
- **Held-out cases:** none so far. The prompt wording was tuned on the same 10
  repositories, so 3 new repositories are added and kept back from tuning
  before phase 2 ships.
- **Slices scored separately:** AB-1 per ADR, AB-3 per ADR, AB-4 and AB-5 per
  session.
- **If someone asks for a rate:** this set does not support one. Report raw
  counts per slice and the floor each was held to.

## Technical Considerations

### Constraints

- Exit codes (`0` / `2` / `1`) are a public contract; CI relies on them.
- stdout formats are documented; the hint goes to stderr for that reason.
- The review contract: the agent stops and asks before writing every ruling.
- ontrack judges nothing: the grouping is the agent's reading of the
  repository, presented for agreement, never computed by the CLI.

### Integration Points

- `src/commands/apply.ts` (`nextStep`): phase 1.
- `src/review.ts` (`formatSequence`, `STEPS`): phase 2. `formatImport`
  points at `review` and needs no change.
- `docs/commands.md` (apply output, `review` prompt contract) and
  `docs/tutorial.mdx`.

### Data Requirements

None. No file format changes, no new status, nothing stored.

### Verified Before Writing

`plan` exits `0` with only `proposed` ADRs left: an imported ADR matches its
track's copy, so `plan` reports it `unchanged` (`src/plan.ts`,
`hasPendingChanges`). `check` runs only ADRs in force (`src/check.ts`). The
"usable now" claim in FR-1 holds.

## Agent Execution Contract

The changes will be implemented through an OpenSpec change by a coding
agent.

### Authoritative Sources

| Source | Path or link | Definitive for |
|--------|--------------|----------------|
| This PRD | `research/prd-backlog-reveal.md` | What to build, scope, FR-n |
| Command reference | `docs/commands.md` | Output and exit contracts; wins over code comments |
| Repository rules | `AGENTS.md` and `docs/adr/` | Commits, branching, tests (95% coverage), languages |
| Desk test | `research/desk-test-first-proposal/` | Evaluation cases and answer key |

When this PRD and `docs/commands.md` disagree on a contract, stop and escalate.

### Do Not Touch

| Path or system | Reason it is off limits |
|----------------|-------------------------|
| Exit code logic in `src/commands/*.ts` | Public contract that CI jobs rely on |
| stdout of `plan` and `apply` | Documented format; only the stderr hint changes |
| `docs/adr/trivoallan/` | Track copies managed by `apply` |
| Review steps 1–7 wording (`STEPS`) | Changed and measured in #205; edit only what FR-10 names |
| `research/desk-test-first-proposal/proposals*` | Raw results of past runs |

### Requirement Verification Map

| Requirement | How it is verified | Who verifies |
|-------------|--------------------|--------------|
| FR-1 | Unit test on the stderr of `apply` with proposed ADRs | Automated |
| FR-2 | Existing test on the revised hint passes unchanged | Automated |
| FR-3 | Existing stdout and exit-code tests pass unchanged | Automated |
| FR-4 | `docs-workflows` test and a read of both pages | Automated + maintainer |
| FR-5 – FR-10 | Unit tests on `formatSequence` text; AB-1 to AB-5 | Automated + maintainer |
| FR-11 | Existing `review` exit-code test passes | Automated |

### Stop and Escalate

| Condition | Escalate to |
|-----------|-------------|
| A requirement needs an exit code or stdout change | Maintainer |
| A test outside the touched code fails | Maintainer |
| Starting phase 2 before round 1 has been reported | Maintainer |
| The tracking step behaviour on early stop (open question) | Maintainer |

## Dependencies & Risks

### Dependencies

| Dependency | Owner | Status | Impact if Delayed |
|------------|-------|--------|-------------------|
| Observation round 1 | Maintainer | Not started | Phase 2 doesn't start |
| Desk test rerun with observed/absent marking | Maintainer | Not started | AB-1 to AB-3 have no evidence |
| ontrack-engineering maintainer's view on grouping | Maintainer | Not asked | Future consideration only |

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Adopters read "24" as a fine to-do list | M | H | Phase 2 gated on round 1 |
| The first list invites rubber-stamping | M | H | AB-2, AB-3 and the changed-value guardrail; drop the grouping if it falls |
| The survey step adds a long wait before the first proposal | M | M | Time it in the desk test; report it with AB-1 |
| Agents ignore the skip and stop instructions | L | H | AB-5; a failure blocks phase 2 |

## Timeline & Milestones

| Milestone | Description | Target Date |
|-----------|-------------|-------------|
| M1 | Phase 1 OpenSpec change merged (FR-1 to FR-4) | Week of 2026-11-16 |
| M2 | Desk test rerun with observed/absent marking | Week of 2026-11-16 |
| M3 | Observation round 1 reported (baselines) | 2026-11-30 |
| Gate | Go / no-go on phase 2 | After M3 |
| M4 | Phase 2 merged (FR-5 to FR-11), AB-1 to AB-5 passing | After the gate |
| M5 | Observation round 2 against the targets | After M4 |

## Open Questions

- [ ] When the user stops early, does the tracking step run on the rulings
      made, or wait until every ADR is ruled? - Owner: maintainer
- [ ] Does the survey step stay readable with 40+ proposed ADRs? - Owner:
      maintainer (desk test)
- [ ] Should the summary also be written somewhere (such as `AGENTS.md`'s
      "Not yet decided" list), or stay in the session? - Owner: maintainer

## Appendix

### Related Documents

- Problem statement: [problem-statement-backlog-reveal.md](problem-statement-backlog-reveal.md)
- Solution brief: [solution-brief-backlog-reveal.md](solution-brief-backlog-reveal.md)
- Hypothesis and desk test: [hypothesis-first-proposal.md](hypothesis-first-proposal.md), [desk-test-first-proposal/results.md](desk-test-first-proposal/results.md)
- Journey map: [journey-map-repo-adopter-onboarding.md](journey-map-repo-adopter-onboarding.md)

### Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-11-15 | Maintainer, with Claude | Initial draft |
