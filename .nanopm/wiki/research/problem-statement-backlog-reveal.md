---
artifact: problem-statement
version: "1.0"
created: 2026-11-15
status: draft
evidence: hypothesis
source: .nanopm/wiki/research/journey-map-repo-adopter-onboarding.md (moment of truth "the backlog reveal", severity 5)
---

# Problem Statement: The import ends on a wall of unanswered questions

> **This problem is not validated yet.** It comes from a journey map built in
> hypothesis mode: no adopter has been interviewed or observed. The product
> signals below are real; how adopters react to them is a guess. Treat this
> statement as the frame for the validation research listed under
> [Open Questions](#open-questions). If the research confirms it, move on to
> `develop-solution-brief`. If it doesn't, downgrade it to a hypothesis
> (`define-hypothesis`).

## Problem Summary

A tech lead imports a track into an existing repository and, within seconds,
ontrack reports that the repository now holds about two dozen questions it has
not answered. Nothing tells them which questions matter first, how long ruling
takes, or that the repository is already in a valid state with most of them
still open. The first impression flips from "that was fast" to "that's a lot
of homework" at the exact moment the adopter decides whether ontrack is worth
continuing.

## User Impact

### Who is affected?

Repo adopters: tech leads or senior engineers bringing ontrack to an
**existing** repository (with a history and a CI) for the first time,
working with a command-line coding agent. They have shared conventions they
want to stop drifting. They have not written a track, and they are not yet
convinced ontrack is worth adopting across repositories.

Not affected: track authors, and adopters adding a second track or taking a
track upgrade (they have already gone through the reveal once).

### How are they affected?

What the adopter sees today at the end of `ontrack apply`, using the public
ontrack-engineering track (product signal: tutorial and `apply` output):

```
trivoallan: 25 imported
…
AGENTS.md: rules block created
next: 24 proposed ADRs to rule
  from a shell:  claude "$(npx ontrack review)"
```

and, in `AGENTS.md`, a "Not yet decided" list of 24 entries.

Hypothesised friction:

- **Size without shape.** All 24 questions look alike: no order of
  importance, no grouping by subject, no estimate of the effort they take.
  The adopter can't tell whether "commits" and "build provenance" carry the
  same weight.
- **Unclear stopping point.** Nothing says the repository is usable now.
  In fact it is: the rules block is valid with open questions, and `check`
  only runs the ADRs already decided (product signal: `docs/commands.md`).
  Without being told, the adopter may read "24 to rule" as "not done until all
  24 are ruled".
- **A long, uniform loop.** `review` without an argument goes through every
  proposed ADR in sequence, and asks for an agreement on each one. That makes
  for many interruptions in a single sitting.
- **Downstream symptoms** (hypothesised): the adopter stops after a few
  rulings and leaves the "Not yet decided" list to rot, or accepts the agent's
  proposals without reading them to get through. The first one leaves the
  repository with rules that never arrive. The second one fills `AGENTS.md`
  with rules nobody really decided, which breaks ontrack's core promise
  ("decisions the repository took for itself").

### Scale of impact

- **Reach:** every first-time adopter of a non-trivial track goes through
  this moment once per repository. With ontrack-engineering it is 24 of 25
  ADRs; the catalogue grows over time, so the number will rise.
- **Frequency:** once per repository at onboarding. It comes back in a
  smaller form each time a track release adds questions.
- **Unknown:** how many adopters exist today and where they stop. ontrack
  collects no telemetry, so no funnel data exists.

## Business Context

### Strategic Alignment

ontrack's value only shows once the repository holds **its own** answers:
rules in `AGENTS.md` that coding agents follow, and `plan` / `check` gating
CI. The import alone delivers none of that. If adopters stop between the
import and the rulings, ontrack becomes a folder of unread ADRs, and the
three promises in the README ("Why") never come true for them.

### Business Impact

ontrack is an open-source CLI (Apache-2.0) with no revenue. The impact is on
adoption and on the track ecosystem:

- **Activation:** a repository that rules few or no questions gets no value
  and is unlikely to wire ontrack into CI or adopt it in a second
  repository.
- **Track ecosystem:** track authors (the engineering track included) face
  pressure to ship fewer questions to look approachable, even when the
  questions are worth asking.
- **Trust in the output:** ruled-without-reading answers produce
  `AGENTS.md` rules that agents enforce but nobody chose. That damages the
  product's credibility more than an unfinished list does.

No figures exist; any estimate would be invented.

### Why Now?

- The tutorial and the ontrack-engineering track are now public and
  promoted on the docs site (recent commits #198, #203), so first-time
  adopters will see this moment more and more.
- The track's catalogue is growing (ADR-0025 is the current highest), which
  makes the reveal larger with every release.
- The `next:` hint in `apply` is recent and small; changing what it says is
  cheap now, before adopters and docs come to rely on its wording.

## Success Criteria

There is no baseline: ontrack collects no telemetry. The baselines come from
the observation sessions proposed in the journey map (3–5 first-time
adopters, each on their own existing repository), run before and after any
change.

<!-- incongru-voix: debord — "rule at least 5 ADRs" counts the image of a decision, not the decision — separates the adopter who clicks "agree" from the developers whose agents then enforce a rule nobody chose -->

| Metric | Current Baseline | Target | Timeline |
|--------|-----------------|--------|----------|
| Primary: rulings the adopter can justify without being prompted (asked after the session: "why this value?"; counts when they point to their own practice or a reason they state, not "the agent proposed it") | Unknown (measure in observation round 1) | ≥ 80% of first-session rulings, across 5 observed adopters | Observation round 2, after a change ships |
| Secondary: adopters who rule at least 5 ADRs in their first session | Unknown (round 1) | ≥ 4 of 5 | Round 2: volume only counts once the primary holds |
| Secondary: adopters who say, unprompted, that the repository is usable before every ADR is ruled | Unknown (round 1) | ≥ 4 of 5 | Round 2 |
| Secondary: adopters who return to rule more within a week | Unknown (round 1 follow-up) | ≥ 3 of 5 | One week after round 2 |
| Guardrail: rulings where the adopter changed or questioned at least one value the agent proposed | Unknown (round 1) | Stays at or above the baseline | Ongoing: faster must not mean rubber-stamped |
| Guardrail: time from `npm i` to `AGENTS.md` rules block | 14 s (tutorial, fresh repository) | Stays under 1 minute | Ongoing |

### Why ruling count is not the primary metric

ontrack promises "decisions the repository took for itself". What it
writes, and what can be counted, is a ruling: a status and some values in a
file, which then becomes a rule in `AGENTS.md`. A ruling is the
representation of a decision. When it gets cheap, it can exist without the
decision behind it. A metric that counts rulings rewards that exact gap. That
gap is the rubber-stamping symptom above.

| The artifact says | What it actually names | Who bears the cost |
|---|---|---|
| "24 proposed ADRs to rule" | A quota of agreements to give, not questions to settle | The adopter, who reads volume as the work |
| "Rule at least 5 ADRs" (former primary) | Agreements per session: the throughput of the image | Developers whose agents enforce the rules |
| "next: N to rule" / a "7 of 24 ruled" counter (journey map opportunity) | Progress through the image of governance, which the adopter can finish without ever deciding | Same as above |
| "The repository is usable now" | True and needed, but it also licenses leaving the questions to the agent's defaults | Contributors who inherit the defaults as "our rules" |
| "Decisions the repository took for itself" | The promise: it holds only if a person can say why | — |

**Decision this changes.** The primary metric becomes rulings the adopter can
justify without being prompted. Ruling count drops to secondary and only
counts once the primary holds. Any solution that raises the count while
lowering justification fails this problem statement, even if adopters finish
faster. This applies to the progress counter idea in the journey map: it
ships only together with something that keeps the evidence in front of the
adopter.

**Concession.** The friction is real, and some of it should go. A rule taken
from the commit history the team already writes *is* the team's own
practice, written down, and ontrack does that well. Ordering and batching the
easy questions stays in scope. The line is drawn at making agreement cheaper
than understanding.

## Constraints & Considerations

- **No telemetry, by design.** Measurement relies on qualitative sessions and
  on public signals (issues, discussions). Adding tracking to a CLI that
  governs repositories would be a trust problem of its own.
- **ontrack judges nothing itself.** Questions, their order and their
  recommended answers belong to the track. Any notion of priority or
  grouping has to come from the track or from evidence in the repository, not
  from ontrack deciding what matters.
- **The user decides every ruling.** The review contract makes the agent
  stop and ask for agreement before writing. Reducing friction must not
  remove that step.
- **Exit codes are a public contract** (`0` / `2` / `1`). CI jobs rely on
  them, so the solution must not change when commands exit `2`.
- **Output stability.** Standard output and stderr hints are documented in
  `docs/commands.md`; the tutorial quotes them. Any wording change updates
  both.
- **Consideration:** some questions are cheap to rule from the repository's
  history (commits, branching, license), others need a real discussion
  (architecture, delivery). The problem may be less "24 is too many" than
  "24 look the same".

## Open Questions

- [ ] Do adopters actually read "24 proposed ADRs to rule" as a blocker, or as
      a to-do list they're fine with? (Observation round 1, reaction at the
      `apply` output.)
- [ ] Where do adopters stop in their first session, and why: fatigue,
      a hard question, or a sense of being done?
- [ ] Do adopters know the repository is valid with open questions? Does any
      command or CI job (`plan` in CI, in particular) behave as if it weren't?
      Confirm whether `plan` exits `0` with only `proposed` ADRs left.
- [ ] Is rubber-stamping happening? How often do adopters change a value the
      agent proposed, early versus late in a session?
- [ ] Is the right unit one track, or a subset of it? Would adopters prefer to
      import fewer questions at first (an install-time choice) instead of
      ruling or deferring many? This is solution territory: keep it for the
      solution brief.
- [ ] Do track authors have a view on question order or grouping that ontrack
      could surface? Ask the ontrack-engineering maintainer first.
