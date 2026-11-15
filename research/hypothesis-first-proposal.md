---
artifact: hypothesis
version: "1.0"
created: 2026-11-15
status: draft
evidence: hypothesis
source: research/journey-map-repo-adopter-onboarding.md (moment of truth "the first proposal", severity 5)
related: research/problem-statement-backlog-reveal.md
---

# Hypothesis: The first proposal is where adopters recognise their own practice

> **Result (2026-11-15): H1 invalidated, H2 not run.** The desk test matched
> 19 of 42 departing values (45%, threshold 50%). The agent finds a practice
> that is present in the files (8 / 8) but keeps the track's recommendation
> where the practice is an absence (7 / 27), because the review prompt asks
> it for "evidence that [the recommendation] does not apply". See
> [desk-test-first-proposal/results.md](desk-test-first-proposal/results.md).
>
> **Run 2 (same day), step 2 reworded to "start from what this repository
> does today": 25 of 42 (60%), inconclusive.** "Kept for lack of evidence"
> fell from 11 to 1. What's left is the agent proposing to *adopt* the
> recommendation where the repository does nothing (`forge.audit` 0 / 8). The
> next fix is to mark each proposed value as observed or absent.

## Hypothesis Statement

This is two linked claims. The first can be tested without any adopter, so
it runs first: if it fails, the second has nothing to stand on.

**H1: the agent can find the practice.**

**We believe that** running `ontrack review` on an ADR whose answer the
repository's history already holds (commits, branching, languages, license,
forge and CI, tools)

**for** existing repositories with at least six months of history

**will** produce trait values that match what the repository actually does,
**including where that practice departs from the track's recommendation**

**as measured by** the match rate on trait values where the repository's
practice differs from the recommendation (target ≥ 70%).

**H2: recognition is the aha.**

**We believe that** making the adopter's first proposal one their history
answers well, instead of the first ADR in catalogue order,

**for** repo adopters onboarding an existing repository with a coding agent

**will** lead them to recognise the proposal as their own practice, and to
keep ruling with reasons of their own

**as measured by** the share of adopters who, at their first proposal, say
unprompted that the value describes what they already do (target ≥ 4 of 5,
against the catalogue-order baseline).

## Background & Rationale

### Problem Context

The journey map places the "aha" at the first ruling. The agent either writes
down what the team already does, or offers a generic guess. The problem
statement on the backlog reveal adds the constraint: a ruling only counts
when the adopter can justify it. Recognition at the first proposal is the
earliest point where that can happen.

### Supporting Evidence

Product signals, no user research:

- **The first proposal an adopter sees is not chosen.** Without an argument,
  `review` takes the proposed ADRs in catalogue order (`docs/commands.md`).
  With ontrack-engineering, ADR-0001 comes already decided, so the first
  proposal is **ADR-0002 Localization**. The history answers it weakly: the
  answer is "English, presumably", and the question is low stakes, so it
  shows nothing about ontrack.
- **The tutorial already works around it.** It sends the reader to
  `review ADR-0006` (commits), one of the questions a history answers best.
  The docs picked the showcase question by hand; the product does not.
- **Where there is no history, there is no match.** On an empty repository,
  the tutorial's agent proposed `scopes: []`, `tool: none`.
- **The review prompt anchors on the recommendation.** Step 2: "Start from
  the recommendation the ADR makes. Look in this repository for evidence that
  it does not apply here." So a proposal can match the practice because the
  practice happens to equal the recommendation, without the agent having
  found anything. Hence H1's metric counts only the values where practice and
  recommendation differ.

### Alternative Hypotheses Considered

- **A1: order doesn't matter, volume does.** Adopters give up because of the
  24 questions, whatever comes first (the backlog reveal problem). H2 fails
  if the order change doesn't move recognition or persistence, while a
  reframed `apply` message does.
- **A2: the aha is the rules block, not a proposal.** Adopters are won over
  by seeing `AGENTS.md` gain a rule, whatever its value. If so, recognition
  would not predict persistence, and agreement without recognition would be
  as common as with it.
- **A3: recognition is cheap and proves little.** Adopters "recognise"
  whatever is plausible. The control is H1: the score is checked against the
  repository, not against the adopter's feeling alone.

## Target User Segment

### Definition

- Brings ontrack to an **existing** repository: a `package.json`, at least
  six months of git history, a CI on a forge.
- Uses a coding agent on the command line (the examples use Claude Code).
- First time ruling ontrack ADRs. Imports ontrack-engineering or a track of
  similar scope.
- Excluded: empty or new repositories (H1 cannot apply), track authors, and
  the ontrack repository itself (its rulings are already known).

### Segment Size

Unknown. ontrack collects no telemetry. npm weekly downloads of
`@trivoallan/ontrack` give an upper bound on installs, not on adopters.

### Current Behavior

Unknown for real adopters. What can be stated from the product: an adopter
who follows the `next:` hint as printed meets ADR-0002 first. An adopter who
follows the tutorial meets ADR-0006 first.

## Success Metrics

### Primary Metric

| Metric | Current Baseline | Target | Minimum Detectable Effect |
|--------|-----------------|--------|--------------------------|
| H1: match rate on trait values where the repository's practice differs from the recommendation | Unknown (the desk test sets it) | ≥ 70% | n/a: a threshold, not a comparison |
| H2: adopters who, at their first proposal, say unprompted that the value describes what they already do | Unknown (catalogue-order sessions set it) | ≥ 4 of 5 with history-first order | A gap of at least 2 adopters out of 5 against the baseline; smaller is noise at this sample |

### Secondary Metrics

| Metric | Current Baseline | Expected Direction |
|--------|-----------------|-------------------|
| H1: match rate on all trait values of evidence-rich ADRs | Unknown | Increase; reported but not decisive (inflated by the recommendation) |
| H1: match rate on ADR-0002 Localization | Unknown | Lower than evidence-rich ADRs; if not, order is not the issue |
| H2: first-session rulings the adopter can justify without being prompted | Unknown | Increase (primary metric of the backlog reveal problem) |
| H2: ADRs ruled in the first session | Unknown | Increase; volume only counts if justification holds |

### Guardrail Metrics

| Metric | Current Value | Acceptable Range |
|--------|--------------|------------------|
| Proposals where the agent cites evidence that is wrong (a file or command that doesn't say what it claims) | Unknown | ≤ 1 in 20 |
| Rulings agreed without the adopter reading the evidence (observed) | Unknown | Not above baseline |
| Adopter changes at least one proposed value per session | Unknown | Not below baseline: recognition must not turn into deference |
| Proposals that say which values were kept for lack of evidence | Not in the prompt today (0%) | 100% in any version that ships |

## Validation Approach

### Method

**Step 1 — desk test (H1), no adopters needed.**

1. Pick 10 public Node repositories with at least six months of history, CI,
   and visible conventions (commitlint or Conventional Commits, branch
   naming, a license, a `.tool-versions` or `mise.toml`). Pick at least 5
   whose practice departs from ontrack-engineering's recommendation on at
   least one trait.
2. Before running anything, write the expected trait values for each
   repository by hand, from its files and history (the answer key).
3. On a throwaway clone, import ontrack-engineering and run
   `review <ADR>` for ADR-0002, 0004, 0006, 0009, 0011, 0023, 0025. Record the
   proposals, stop before agreeing.
4. Score each trait value: match / mismatch / no evidence found. Split the
   scores by whether the answer key equals the recommendation.

**Step 2 — observation sessions (H2), only if H1 passes.**

1. 6 first-time adopters on their own existing repositories, thinking aloud,
   about 45 minutes each.
2. Split them 3 / 3: half follow the `next:` hint as printed (catalogue
   order, ADR-0002 first); half are asked to start with `review ADR-0006`.
   This simulates a history-first order without building it.
3. At the first proposal, note whether the adopter says, unprompted, that
   it describes their practice. After the session, ask "why this value?" on
   each ruling.

### Sample Size & Duration

- Sample size: desk test, 10 repositories × 7 ADRs (70 proposals, about
  150 trait values). Sessions: 6 adopters, 3 per arm.
- Duration: desk test, about 2 days. Sessions: 2–3 weeks to recruit and run.
- Traffic allocation: none. This is not an A/B test; ontrack has no traffic
  to split, and 3 per arm only shows large effects.

### Pass/Fail Criteria

- **Validated if:** H1 ≥ 70% on departing values, with no more than 1 wrong
  citation in 20; **and** at least 2 of 3 history-first adopters recognise
  their first proposal, against at most 1 of 3 in catalogue order.
- **Invalidated if:** H1 < 50% on departing values (the agent mostly echoes
  the recommendation), or recognition is the same in both arms (A1 or A2
  holds instead).
- **Inconclusive if:** H1 falls between 50% and 70%, or recognition is high
  in both arms. Then the first proposal isn't the bottleneck: revisit the
  backlog reveal before investing here.

## Risks & Assumptions

### Key Assumptions

- Evidence-rich ADRs exist in a track and the **track author** can declare
  them. ontrack itself does not judge which ones matter (see "Who sets the
  order, and who can appeal" below).
- The coding agent used in the test behaves like the ones adopters use. The
  match rate depends on the agent and model, not on ontrack alone.
- Recognition said aloud in a session reflects what adopters feel alone at
  their own desk.

### Risks

- **The answer key is the tester's reading.** Two people should write it for
  at least 3 of the 10 repositories, and the disagreements should be
  reported.
- **Selection bias.** Public repositories with visible conventions are the
  easy case. The result says little about repositories whose conventions
  live only in people's heads, where ontrack might matter more.
- **Recognition is not justification.** An adopter can recognise a value and
  still not know why the team does it. H2 passing does not discharge the
  backlog reveal's primary metric; both are measured.
- **Tester effect.** Asking an adopter to start with ADR-0006 tells them the
  order matters. Keep the instruction neutral ("start with this one").

## Who sets the order, and who can appeal

<!-- incongru-voix: lessig — the order of review and the recommendation as starting point are regulated by architecture (ontrack's code and prompt) — recourse: `review <adr>` and supersede exist, but no output tells the adopter or the contributors they can use them -->

Both H2's intervention and H1's anchoring problem are defaults. A default is
a rule nobody votes on and almost nobody changes. It binds people who never
saw it: the adopter, and then every contributor whose coding agent enforces
the resulting `AGENTS.md`. A test that "validates" a new default is about to
enact a rule, so it should say who writes that rule.

This analysis repairs the mechanism. It does not ask whether a repository
should take its conventions from a track at all.

**Constraint 1: which question the adopter meets first.**

| Modality | Today | With H2 as drafted ("history-first order") |
|---|---|---|
| Law | Nothing | Nothing |
| Norm | The track author writes ADRs in catalogue order; the tutorial picks ADR-0006 by hand | Same |
| Price | Picking another ADR costs knowing `review <adr>` exists | Same |
| Architecture | `review` takes the proposed ADRs in catalogue order | If ontrack *computes* which ADRs the history answers well, ontrack judges, against its own constraint |
| **Recourse** | `review <adr>` exists; the `next:` hint never mentions it | Same, plus a ranking nobody can read or contest |

**Constraint 2: the track's answer as the agent's starting point.**

| Modality | Today |
|---|---|
| Law | Nothing |
| Norm | The track author's recommendation, written in the ADR |
| Price | Departing costs evidence: the agent must find it, the adopter must read it |
| Architecture | Review prompt step 2: "Start from the recommendation… look for evidence that it does not apply" |
| **Recourse** | The adopter, at the agreement step. Contributors later, by superseding the ADR. A departure is recorded in the ADR with its reason; **a value kept because no evidence was found looks exactly like a value confirmed by evidence** |

**Decisions this changes:**

1. **The order belongs to the track, not to ontrack.** If H2 is validated,
   the order is a field the track author declares and publishes in the ADR
   files, where an adopter or a contributor can read and contest it. ontrack
   only applies it. A heuristic inside ontrack that ranks questions is ruled
   out.
2. **The appeal gets printed.** Whatever order is used, the `next:` hint and
   the review prompt name the order's source ("in the order `trivoallan`
   sets") and the way out (`review <adr>`). This applies to the session arms
   as well: the catalogue-order arm sees the hint as it is today, and that is
   the baseline being measured.
3. **"No evidence found" becomes visible.** H1 adds a scoring category for it
   (already there: match / mismatch / no evidence found). The guardrail
   follows: a proposal must say which values it kept for lack of evidence, so
   the adopter knows which defaults they are actually voting on. Without
   that, contributors inherit the track's answer as "the repository's
   decision" with no sign that nobody checked it.

## Timeline

| Phase | Dates | Duration |
|-------|-------|----------|
| Setup: pick repositories, write answer keys | Week 1 | 1–2 days |
| Desk test (H1) running | Week 1 | 1 day |
| H1 analysis and go/no-go for sessions | Week 1 | Half a day |
| Recruit and run sessions (H2) | Weeks 2–4 | 2–3 weeks |
| Analysis | Week 4 | 2 days |
| Decision: change the order of the `next:` hint / review, or not | End of week 4 | - |
