---
artifact: solution-brief
version: "1.0"
created: 2026-11-21
status: draft
evidence: hypothesis
source: .nanopm/wiki/research/opportunity-tree-first-adopter.md
related: .nanopm/wiki/research/competitive-analysis-first-adopter.md, .nanopm/wiki/research/stakeholder-summary-first-adopter.md, docs/adr/local/ADR-0029-adoption-is-counted-in-public-repositories.md
---

# Solution Brief: five conversations, then one pull request

> **A proposal for the Decider.** It names a top bet and a backup, as the
> sprint brief requires, and adds no feature. Every claim about adopters is
> a hypothesis until the interviews.

## Problem Recap

ontrack has two tracks and no adopter outside its maintainer's
repositories. The mechanics an adopter needs have shipped. The review
starts from the repository's practice, reads history first and marks each
value observed or absent. Nobody else has used them, so nobody knows which
of them matter.

## Proposed Solution

Stop building, go and ask, then do the first adoption by hand.

**Top bet:** a tech lead who looks after 2 to 30 repositories, uses a
command-line coding agent, and has conventions written somewhere already.
**Entry point:** a pull request in their own repository, opened by the
maintainer after an interview, with the track imported and every proposed
ruling marked observed or absent. They accept, edit or close it.

**Backup:** an open-source maintainer with three or more repositories of
their own. Easier to reach, but closest to the maintainer himself, so the
most likely to confirm his own taste.

## Key Features

1. **Five interviews:** maintainers in the top-bet segment, prepared with
   `discovery-interview-prep`: last drift incident, what they use today,
   what would stop them installing a third-party package.
2. **Concierge pull request:** offered at the end of each interview; the
   maintainer runs `apply` and `review` on a fork and opens the pull
   request. The adopter's time is reading, not setting up.
3. **Desk test v3:** the shipped prompt on the same 10 repositories and
   answer key. It says whether the proposals in those pull requests are
   good enough to show.
4. **One honest count:** external adopters counted from public
   repositories (ADR-0029), installs and rulings side by side, recorded
   monthly under `.nanopm/wiki/research/`.

## Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Interviews written up and synthesised | 0 | 5 | 2027-01-31 |
| Outside repositories with a ruled convention (ADR-0029) | 0 | 1 | 2027-03-31 |
| Concierge pull requests accepted | 0 | 3 of 5 offered | 2027-03-31 |
| Proposed values accepted unedited, concierge PRs | Not measured | ≥ 70% | 2027-03-31 |
| Desk test, departing values matched | 60% (v2) | ≥ 70% (v3) | Before the first PR |

## Trade-offs Considered

| What We're Not Doing | Why |
|---------------------|-----|
| New track features (starter set, drift report) | Nobody outside has used the ones already shipped |
| Support for more coding agents | Packmind and Ruler cover that; no adopter has asked |
| A launch post or listing | Downloads already mislead (969, all ours); a post adds more of them and no reasons |
| Telemetry in the CLI | ADR-0029: costs trust with the adopters we are trying to win, and counts installs, not rulings |
| Platform teams in larger organisations | Packmind's ground, with a sales team; security review alone outlasts the timeline |
| Track authors as the first adopter | A track author needs adopters for their track; it moves the problem one step away |

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Five interviewees cannot be found | Med | High | Ask in communities around ADRs and `AGENTS.md`; accept the backup segment for up to two |
| Interviews say drift is not felt | Med | High | It is the answer the sprint needs: re-run the readiness check and consider stopping |
| The concierge adoption doesn't scale | High | Low | It is not meant to: it observes the first ruling, then shapes what to build |
| Proposals below 70% embarrass the first PR | Med | Med | Desk test v3 runs first; below 70%, the PR carries only `observed` values |
| The maintainer goes back to building | High | High | No track change opened with a `PRD:` line before the synthesis, except a `Probe:` |

## Next Steps

1. Rule on ADR-0029 and run the first count: Tristan Rivoallan, this week.
2. Run desk test v3 with the shipped prompt: agent, before the first interview.
3. Prepare the interview script with `discovery-interview-prep`: Tristan Rivoallan, by 2026-12-05.
4. Hold five interviews and synthesise them: Tristan Rivoallan, by 2027-01-31.
5. Re-run `tool-foundation-sprint-readiness` with the synthesis, then run the sprint the brief describes.
