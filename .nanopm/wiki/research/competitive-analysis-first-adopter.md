---
artifact: competitive-analysis
version: "1.0"
created: 2026-11-21
status: draft
evidence: hypothesis
related: .nanopm/wiki/research/foundation-sprint-brief-adoption.md, docs/why-ontrack.md
---

# Competitive Analysis: keeping shared conventions across repositories

> **Two levels of confidence.** What each tool does is read from its public
> pages (observed, Medium confidence). What adopters prefer, and why they
> would switch, is inferred: nobody outside the maintainer has been asked
> (hypothesis). The analysis frames the five interviews of
> `.nanopm/wiki/research/foundation-sprint-readiness-adoption.md`, precondition 2. It does
> not replace them.

## Overview

**Analysis Scope:** tools a team uses to keep the same conventions (commits,
branching, CI, licence, agent instructions) across several repositories, and
to keep coding agents following them.
**Target Segment:** a tech lead or senior engineer looking after 2 to 30
repositories, with a command-line coding agent, and conventions already
written somewhere.
**Date:** 2026-11-21
**Analyst:** coding agent, for the maintainer

## Market Context

**Market Size:** not sized. No figure would be better than a guess; see
`discover-market-sizing` once the segment is confirmed.
**Growth Trend:** growing. In 2025–2026, several tools appeared that
distribute agent instructions or standards (Ruler, rulesync, Packmind,
Archgate). `AGENTS.md` became a common file name.
**Key Trends:**
- Coding agents read a file of instructions, so conventions now have a
  machine reader. Without one, the agent makes up its own.
- Tools converge on "one source, many targets": one file, written out to
  every agent's format, or one server pushing to every repository.
- ADRs are being made executable: a decision carries a check that CI runs.

## Competitors Analyzed

| Competitor | Type | Target Market | Founded | Funding/Size |
|------------|------|---------------|---------|--------------|
| Copier (`copier update`) | Indirect: project template that can be updated | Teams generating many similar repositories | about 2019 | Open source, community |
| Packmind | Direct: standards platform for repositories and agents | Engineering organisations, platform teams | Unknown | Company; open-source edition, paid pricing not published |
| Archgate | Indirect: ADRs as executable checks | Teams with ADRs that want CI to enforce them | Unknown | Open-source CLI, no account needed |
| Ruler / rulesync | Indirect: one rules file synced to each agent's file | Developers using several coding agents | 2025 | Open source |
| Shared configuration (lint presets, shareable Renovate or commitlint configs) | Substitute: same values everywhere | Any team with a package registry | — | Built into each tool |

## Feature Comparison Matrix

| Feature | ontrack | Copier | Packmind | Archgate | Ruler / rulesync | Shared config |
|---------|---------|--------|----------|----------|------------------|---------------|
| One source for a convention, used by many repositories | Full | Full | Full | None | Partial (one source per repository) | Full |
| The repository rules on each convention and writes down why it departs | Full | Partial (answers to template questions, no reason) | Unknown (can pin or skip a package) | None | None | None (override in place) |
| Repositories are told when the convention changes | Full (`plan`, rule again) | Full (`check-update`, `update` with a diff) | Full | None | None | Full (version bump) |
| Writes instructions coding agents read | Full (`AGENTS.md` block) | None | Full | Partial | Full (every agent's format) | None |
| Checks the decision in CI | Partial (runs the command an ADR names) | None | Partial (paid tiers) | Full (rules per ADR) | None | Full (the tool itself) |
| A coding agent drafts the ruling from the repository's own practice | Full (measured: 60% on departing values) | None | Unknown | None | None | None |
| Works with no server or account | Full | Full | Partial (open-source edition) | Full | Full | Full |
| Supports several coding agents | Partial (Claude Code only) | n/a | Full | Full | Full | n/a |
| Works in any language ecosystem | Partial (runs on Node/npm) | Full | Full | Full | Full | Partial (per tool) |

## Pricing Comparison

| Competitor | Entry Price | Mid-Tier | Enterprise | Pricing Model |
|------------|-------------|----------|------------|---------------|
| ontrack | Free | — | — | Open source (Apache-2.0) |
| Copier | Free | — | — | Open source |
| Packmind | Free (open-source edition) | Unknown | Contact sales | Not published |
| Archgate | Free | — | — | Open source |
| Ruler / rulesync | Free | — | — | Open source |

Price does not separate the field. The cost that counts is the time to
adopt: ontrack's is about 25 rulings before `AGENTS.md` holds real
instructions (see `.nanopm/wiki/research/problem-statement-backlog-reveal.md`).

## Positioning Map

**Axis X:** who decides: the source imposes (left) or each repository
rules (right).
**Axis Y:** after the first copy: the copy drifts (low) or stays linked
to the source (high).

```
                     [Stays linked]
                           |
   Packmind                |            ontrack
   Shared config           |
              Copier       |
[Source imposes] ----------+---------- [Repository rules]
                           |
   Templates (one-shot)    |   Archgate
                           |   Ruler / rulesync
                           |
                     [Copy drifts]
```

**White Space Identified:** the upper right. A convention stays linked to its
source and each repository records its own ruling. Copier comes closest:
its answers file links the copy to the template, but it records values, not
reasons. Whether anyone wants that corner is the open question. Nothing
shows that adopters miss "the reason for a departure".

## Competitor Deep Dives

### Copier

**Overview:** a project generator that, unlike most templates, can update
a project when its template changes.
**Target Customer:** teams that create many repositories from one template.
**Key Differentiator:** `copier update` replays the template on the
project, shows a diff and asks only the new questions.

**Strengths:**
- Mature, well documented, ecosystem-neutral.
- Its update is a real three-way merge with conflict markers: closer to
  ontrack's "repositories are told" than any other tool here.
- Teams already know the "template + answers file" model.

**Weaknesses:**
- It records answers, not why a project differs from the template.
- It has nothing for coding agents.
- Updates are tied to the template's files, so a project that has moved
  far from the template gets conflicts on every update.

**Recent Moves:** steady releases. No move toward agents found.

---

### Packmind

**Overview:** an open-source framework and platform to version, distribute
and enforce standards across repositories and coding agents.
**Target Customer:** organisations with a platform or enablement team.
**Key Differentiator:** central playbooks pushed to every repository and
every agent, with governance in paid tiers.

**Strengths:**
- Covers several agents and any language.
- A company behind it, with governance features, support and sales.
- Fits the organisation that wants standards applied, not discussed.

**Weaknesses:**
- Central by design: a repository can pin or skip, but has no place to
  record why it differs (as read from its public pages).
- A server and an account are part of the full product.
- Paid pricing is not published.

**Recent Moves:** launched an open-source edition (Product Hunt).

---

### Archgate

**Overview:** an open-source CLI that runs a rules file next to each ADR and
fails CI when the code breaks a decision.
**Target Customer:** teams that already write ADRs and want them enforced.
**Key Differentiator:** ADRs as code-level checks, reported by file and
line, in CI, pre-commit and agents.

**Strengths:**
- Enforcement that ontrack's `check` leaves to the command an ADR names.
- No account; frequent releases (0.45 to 0.50 on PyPI).
- Talks to ADR writers, the same audience ontrack needs.

**Weaknesses:**
- Decisions are per repository: nothing propagates a shared ADR or its
  changes.
- A shared ADR is copied and edited, not ruled on.

**Recent Moves:** published for several package ecosystems (npm, PyPI, Go,
gems).

---

### Ruler / rulesync

**Overview:** tools that keep one instructions file and write it out to
each coding agent's file (`CLAUDE.md`, Cursor rules, `AGENTS.md`).
**Target Customer:** developers using more than one coding agent.
**Key Differentiator:** one edit, every agent.

**Strengths:**
- Solve a real, visible pain in one command.
- Tiny adoption cost: one file, one command.
- Ecosystem-neutral.

**Weaknesses:**
- Say nothing about where the rules come from, or whether they still match
  what the team agreed.
- One repository at a time.

**Recent Moves:** many look-alikes appeared (agentsync, agent-rules-sync):
the space is crowded and cheap to enter.

## Competitive Gaps and Opportunities

| Gap | Opportunity | Strategic Value | Difficulty |
|-----|-------------|-----------------|------------|
| No tool records why a repository departs from a shared convention | ontrack's ruling, with its reason, as the thing to show first | High, if adopters want it (unknown) | Low: built |
| Agent-instruction tools don't know where rules come from | ontrack writes `AGENTS.md` from rulings, so Ruler or rulesync can take it from there | Medium | Low |
| Archgate enforces per-repository ADRs that nothing shares | Tracks as the shared source for ADRs that Archgate then enforces | Medium | Medium: needs a `check:` that calls Archgate |
| Copier updates code, not decisions | Position next to Copier, not against it: template for files, track for decisions | Medium | Low |

## Strategic Recommendations

### Where to Compete Head-On
1. The first ruling. The desk test showed the agent drafts it from the
   repository's practice 60% of the time on values that depart from the
   recommendation. No competitor drafts a ruling at all. Keep raising this
   figure. It is the only measured advantage.
2. Staying linked: `plan` and rule-again must be as trustworthy as
   `copier update`, which is the bar adopters will compare against.

### Where to Differentiate
1. Do not chase agent coverage or enforcement. Hand off to Ruler, rulesync or
   Archgate, and say so on the "next to what you already have" page.
2. Sell the recorded departure, not distribution. Others distribute; only
   ontrack asks the repository and writes the answer down.

### Messaging Implications
- Lead with "your repository rules, and the reason is kept", not with "one
  source for every repository": every competitor says that.
- Name Copier on `docs/why-ontrack.md`; it is the closest alternative and
  today's page omits it.

### Watch List
- Packmind adding per-repository exceptions with reasons: it would take the
  white space with a funded team.
- Archgate adding shared ADR packages.
- `AGENTS.md` gaining a standard way to include a remote source.

## Sources and Confidence

| Information Type | Source | Confidence |
|------------------|--------|------------|
| Feature data | Public docs and package pages (copier.readthedocs.io, pypi.org/project/archgate, Packmind on Product Hunt, intellectronica/ruler), searched 2026-11-21 | Medium |
| Pricing | Same pages; Packmind paid tiers not published | Low for Packmind, High for the rest |
| Market size | None | None |
| ontrack figures | `.nanopm/wiki/research/desk-test-first-proposal/results.md`; `.nanopm/wiki/research/foundation-sprint-readiness-adoption.md` | High |
| Strategy inference | Agent reasoning, no adopter input | Low |

## Next Steps

- [ ] Ask the five interviewees what they use today, and add what they name to this table (maintainer, by 2027-01-31).
- [ ] Add Copier to `docs/why-ontrack.md`'s comparison table (maintainer).
- [ ] Re-check Packmind's public pages for per-repository exceptions before the next sprint.

---

*Analysis valid as of 2026-11-21. Competitive landscape changes frequently; recommend quarterly updates.*
