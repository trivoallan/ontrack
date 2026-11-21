---
artifact: foundation-sprint-readiness
version: "1.0"
created: 2026-11-21
status: draft
evidence: observed
related: .nanopm/wiki/research/problem-statement-backlog-reveal.md, .nanopm/wiki/research/journey-map-repo-adopter-onboarding.md, .nanopm/wiki/research/desk-test-first-proposal/results.md
---

# Foundation Sprint Readiness Assessment: a first adopter outside our own repositories

Should a Foundation Sprint shape how ontrack gets its first public adopter,
or does something have to come first?

## Inputs Captured

**Initiative description:**

> A first public repository, outside the maintainer's own repositories and
> organizations, installs an ontrack track (`@trivoallan/ontrack-engineering`
> or `@trivoallan/ontrack-product`). No date: a milestone, not a target.

**Team composition draft:**

- Tristan Rivoallan (maintainer; Decider)

**Decider name and availability:** Tristan Rivoallan. Solo team: available
whenever the sprint runs.

**Existing customer/market knowledge level (self-assessed):** 1-4 / 10. No
interviews. The journey map of the adopter was built in hypothesis mode, and
the problem statement it feeds is at `evidence: hypothesis`.

**(Optional) Existing competitor and alternative knowledge:** Not collected.
What teams use today instead of ontrack (templates, shared linter configs,
internal wikis, ADR tools) is unknown.

**(Optional) Logistics constraints:** None stated.

## Readiness Verdict: **Wait**

Criterion 3, a hard-fail criterion, fails: nobody outside the maintainer has
been asked about conventions, so a sprint would turn assumptions into a
Founding Hypothesis that looks like a decision.

| Criterion | Status | Notes |
|---|---|---|
| 1. Initiative is named and concrete | PASS | "a first public repository outside ours installs a track" |
| 2. Stakes are meaningful | PASS | Months of track work with no adopter if the direction is wrong |
| 3. Team has existing customer/market knowledge | FAIL | Self-assessed 1-4; no interviews; every user-facing artifact in `.nanopm/wiki/research/` is at `hypothesis` |
| 4. Decider is available | PASS | The maintainer |
| 5. Team size is appropriate (max 5) | YELLOW | Solo: no second view in Note-and-Vote, every vote is the Decider's |
| 6. Inputs are collected | YELLOW | Six artifacts in `.nanopm/wiki/research/`, the desk test, and a measured baseline; no customer input among them |
| 7. Output has a path to testing | PASS | Interviews, a `Probe:` change (product/ADR-0005), or a Design Sprint |
| 8. Organization tolerates explicit tradeoffs | PASS | The repository rules every decision in an ADR |

## Diagnosis

What is in place: a concrete initiative, a Decider, a habit of written,
explicit decisions, and a baseline measured from the outside. A GitHub code
search on 2026-11-21 found the two tracks only in `package.json` files of the
maintainer's own repositories and organizations: zero external adopters. The
`@trivoallan/ontrack` package had 969 downloads from 2026-10-22 to
2026-11-20, mostly the CI of those same repositories.

What is missing is the input a Foundation Sprint runs on. Day 1 asks for the
target customer, their important problem and the alternatives they use; with
a knowledge level of 1-4 and no interviews, each answer would be the
maintainer's guess. The one tested claim points the same way: the desk test
invalidated H1, the hypothesis that the agent finds a repository's practice
(it matched 19 of 42 values, 45%).

Running solo adds a second weakness. Note-and-Vote exists to stop the
loudest voice from deciding; with one person, it only records the
Decider's opinion. That can be accepted, but it is a reason not to run the
sprint on guesses.

## Recommended Preconditions (Conditional Go or Wait only)

1. **Talk to five people who maintain repositories with written conventions**
   (Tristan Rivoallan; deadline: 2027-01-31). Prepare with
   `discovery-interview-prep`. Done when five conversations are written up and
   synthesised with `discover-interview-synthesis`, and the problem statement
   can move from `hypothesis` to `observed`, or be replaced.
2. **List what those people use today instead of ontrack** (Tristan
   Rivoallan; deadline: 2027-01-31). Asked in the same interviews. Done when
   the alternatives are named, with what each one does well.
3. **Re-run this diagnostic** (Tristan Rivoallan; after 1 and 2). Expected
   verdict: Conditional Go once the knowledge level reaches 5 or more.

## Recommended Pre-Sprint Activities (Go or Conditional Go only)

Not applicable: the verdict is Wait.

## Recommended Attendees (Go or Conditional Go only)

Not applicable: the verdict is Wait. When the sprint runs, consider one of
the interviewees as a cameo expert for Day 1 morning (Basics).

## Decider Checkpoint

**Decider sign-off required before closing this diagnostic.**

- [x] Decider accepts the diagnosis, and overrides the verdict: the sprint runs now, before the preconditions. Every Day 1 input is an assumption, and the Founding Hypothesis it produces stays at `evidence: hypothesis` until the interviews of precondition 1 test it.
- [x] Decider acknowledges that the sprint will force tradeoffs; one strategic direction becomes the top bet and others become backup or are dropped.

**Signed:** Tristan Rivoallan, maintainer, 2026-11-21

## Inversion

<!-- incongru-voix: debord — « 969 téléchargements » devient « notre propre CI qui se télécharge elle-même » — il sépare l'adoption de sa mesure -->

| Le chiffre dit | Ce qu'il nomme | Conséquence |
| --- | --- | --- |
| 969 téléchargements mensuels de `@trivoallan/ontrack` | la CI des dépôts du mainteneur, rejouée à chaque push | ne jamais citer ce chiffre comme signe d'intérêt |
| « installe un track » comme adoption | une ligne dans `devDependencies`, sans preuve qu'une convention est arbitrée | compter aussi, à côté, les dépôts qui ont un bloc `<!-- ontrack:begin -->` dans `AGENTS.md`, pour voir l'écart |

Décompte : 2 mesures, 0 qui mesure aujourd'hui autre chose que le
mainteneur lui-même.
