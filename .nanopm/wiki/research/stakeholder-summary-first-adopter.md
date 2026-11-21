---
artifact: stakeholder-summary
version: "1.0"
created: 2026-11-21
status: draft
evidence: hypothesis
related: .nanopm/wiki/research/competitive-analysis-first-adopter.md, .nanopm/wiki/research/foundation-sprint-brief-adoption.md
---

# Stakeholder Summary: a first adopter outside our own repositories

> Every stakeholder but the maintainer is described without having been
> asked. Needs and concerns below are hypotheses for the interviews to
> confirm or replace.

## Overview

**Project:** a first public repository, outside the maintainer's own
accounts and organisations, holds a ruled ontrack convention.
**Purpose:** know whose needs decide whether that happens, and who can
block it.
**Date:** 2026-11-21
**Owner:** Tristan Rivoallan (maintainer, Decider)

## Stakeholder Map

```
                    [High Interest]
                          |
   KEEP INFORMED          |    MANAGE CLOSELY
   Adopter's teammates    |    Maintainer
   Interviewees           |    Adopting tech lead
                          |
[Low Influence] ----------+---------- [High Influence]
                          |
   MONITOR                |    KEEP SATISFIED
   Future track authors   |    Coding agent host (Claude Code)
                          |    Upstream projects (OpenSpec, pm-skills)
                          |    Adopter's organisation (security review)
                    [Low Interest]
```

### Quadrant Placement

**Manage Closely:** the maintainer; the adopting tech lead.
**Keep Satisfied:** the coding agent host; upstream projects; the
adopter's organisation.
**Keep Informed:** the adopter's teammates; the interviewees.
**Monitor:** future track authors.

## Stakeholder Profiles

| Stakeholder | Role | Influence | Interest | Alignment | Key Need |
|-------------|------|-----------|----------|-----------|----------|
| Tristan Rivoallan | Maintainer, sole Decider | High | High | Supportive | Evidence that someone else wants this, before more track work |
| Adopting tech lead | Brings ontrack to an existing repository | High | Medium | Neutral | Conventions stop drifting, with less work than today |
| Adopter's teammates | Commit under the rulings | Low | Medium | Neutral to resistant | Rules they agreed with, not rules that arrived |
| Adopter's organisation | Security or platform review | High | Low | Neutral | A third-party package that is safe to install and to remove |
| Coding agent host (Claude Code) | Runs the review prompt | High | Low | Neutral | Nothing: it does not know ontrack exists |
| Upstream projects (OpenSpec, pm-skills) | The product track builds on them | Medium | Low | Neutral | Nothing: changes on their side can break ontrack |
| Interviewees | Five maintainers asked before the sprint | Low | Medium | Unknown | Their time respected; to hear back what came of it |
| Future track authors | Would publish their own track | Low | Low | Unknown | A format worth writing for |

## Detailed Stakeholder Analysis

### Tristan Rivoallan (maintainer)

**Role:** writes ontrack, both tracks, and every decision in this repository.
**Influence Level:** High: decides alone.
**Interest Level:** High: months of track work depend on the answer.
**Current Alignment:** Supportive, and that is a risk: the only voice in
every vote (see the inversion in the sprint brief).

**Needs:**
- One external adopter, counted in a way that does not count himself.
- A reason to stop or change direction early, if nobody wants this.

**Concerns:**
- Building for a user he imagined.
- Cost in time of interviews and concierge onboarding, against features.

**What Motivates Them:**
- A tool that governs itself, used by someone else.

**Preferred Communication:**
- Channel: artifacts under `.nanopm/wiki/research/`, ADRs, this conversation.
- Frequency: at each checkpoint.
- Style: written decisions with reasons.

---

### Adopting tech lead

**Role:** tech lead or senior engineer looking after several repositories,
with a coding agent, and conventions written in a wiki, template or
shared configuration.
**Influence Level:** High: installs it, rules on it, or removes it.
**Interest Level:** Medium: drift is a pain, not an emergency.
**Current Alignment:** Neutral: has never heard of ontrack.

**Needs:**
- Their existing practice written down, not a track's opinion (the desk
  test measured how often the agent manages this: 60% of departing values).
- Value before the end of the first session.

**Concerns:**
- About 25 rulings before anything works.
- A solo-maintained package with no other users.
- Lock-in: what is left in the repository if they remove it.

**What Motivates Them:**
- Agents that stop inventing conventions.
- Less time explaining the same conventions in every review.

**Preferred Communication:**
- Channel: README, the docs site, a pull request in their own repository.
- Frequency: when they look.
- Style: show it on their repository, not on a demo.

---

### Adopter's organisation (security or platform review)

**Role:** approves third-party packages and CI workflows.
**Influence Level:** High: can say no without looking at the product.
**Interest Level:** Low.
**Current Alignment:** Neutral.

**Needs:**
- Provenance, a licence, no install scripts, a clear list of what runs in CI.

**Concerns:**
- An agent prompt that writes files; reusable workflows from an outside
  repository.

**What Motivates Them:**
- Not being surprised.

**Preferred Communication:**
- Channel: the package page and the security policy.
- Frequency: once, at review.
- Style: a checklist they can tick.

## Key Relationships

### Dependencies
| From | To | Dependency Type |
|------|-----|-----------------|
| Adopting tech lead | Adopter's organisation | Approval to install |
| Adopting tech lead | Teammates | Agreement on the rulings |
| Maintainer | Interviewees | Information: the inputs the sprint lacked |
| ontrack | Coding agent host | Resources: the review only works with Claude Code today |
| Product track | OpenSpec, pm-skills | Resources: formats it builds on |

### Alliances
- Ruling together: the tech lead and teammates, if the rulings record what
  they already do.

### Potential Conflicts
| Parties | Conflict Area | Risk Level |
|---------|---------------|------------|
| Tech lead, teammates | The tech lead rules alone, teammates find rules in `AGENTS.md` | Med |
| Maintainer, adopting tech lead | Track recommendations against the repository's practice | Med |
| Maintainer, maintainer | Building features instead of running interviews | High |

## Communication Plan

| Stakeholder | Frequency | Channel | Content | Owner |
|-------------|-----------|---------|---------|-------|
| Interviewees | Once, then once after synthesis | Direct message, video call | The interview, then what was decided from it | Maintainer |
| Adopting tech lead | During the concierge adoption | A pull request in their repository | Proposed rulings with evidence, marked observed or absent | Maintainer |
| Adopter's organisation | Once | Package provenance, and a security policy (none yet: no `SECURITY.md`) | What the package and workflows run | Maintainer |
| Public | Monthly | `.nanopm/wiki/research/` adopter count (ADR-0029) | Installed and ruled counts; repositories named only with their agreement | Maintainer |

## Risk Mitigation

### Resistant Stakeholders

| Stakeholder | Concern | Mitigation Strategy | Owner |
|-------------|---------|---------------------|-------|
| Teammates | Rules arriving from outside | The concierge pull request carries the proposed rulings for review, not merged rulings | Maintainer |
| Adopter's organisation | Third-party agent prompt and workflows | Point to provenance, no install scripts and the licence; adoption works without the reusable workflows | Maintainer |

### Political Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| The Decider agrees with himself | A direction no one else wants | Interviews before any new track feature; ADR-0029 counts only outside repositories |
| A breaking change upstream (Claude Code, OpenSpec) | Review or product track stops working for the adopter | Pin versions in the tracks; watch upstream changelogs |

## Action Items

- [ ] Find and book five interviewees with several repositories and written conventions (maintainer, by 2027-01-31).
- [ ] Prepare the interview with `discovery-interview-prep`.
- [ ] Write the one-page "what ontrack runs in your repository" for security reviews.
- [ ] Run the first adopter count (ADR-0029) and record it.

## Document History

| Date | Change | Author |
|------|--------|--------|
| 2026-11-21 | Initial creation | Coding agent, for Tristan Rivoallan |

---

*Review and update this document when stakeholder dynamics change or at major project milestones.*
