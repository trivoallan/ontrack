---
adr: ADR-0029
slug: adoption-is-counted-in-public-repositories
title: Adoption is counted in public repositories
status: proposed
date: 2026-11-21
authors: [Tristan Rivoallan]
supersedes: []
---

# Adoption is counted in public repositories

## Status

Proposed

## Context

ontrack's next goal is a first adopter outside its maintainer's accounts
and organisations
([solution brief](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/solution-brief-first-adopter.md)). A goal
needs a count, and the two figures at hand count the wrong thing.

- **npm downloads.** `@trivoallan/ontrack` had 969 from 2026-10-22 to
  2026-11-20. Nearly all of them are the CI of the maintainer's own
  repositories, run again on every push.
- **`package.json` dependencies.** A track in `devDependencies` shows an
  install. It does not show that the repository ruled on anything. An
  import with 25 conventions still `proposed` is the failure the
  [problem statement](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/problem-statement-backlog-reveal.md)
  describes, not an adoption.

What does show a ruling is in a file ontrack already writes. `apply` writes
the instructions block of `AGENTS.md` between `<!-- ontrack:begin -->` and
`<!-- ontrack:end -->`. Each decided convention is a `###` heading followed
by its YAML; the conventions still open are listed under
`### Not yet decided`.

The CLI could also report usage itself. It runs in adopters' terminals and
CI, it writes files, and its users are asked to trust a solo-maintained
package. They are not told it sends anything.

## Decision

**ontrack sends nothing.** The CLI, the tracks and the reusable workflows
collect no telemetry, opt-in or opt-out.

**An adopter is a public GitHub repository that is not a fork, not owned
by the maintainer's accounts or organisations, and has an `AGENTS.md` with
the ontrack instructions block.** Two counts are kept side by side:

| Count | A repository counts when its block holds |
| --- | --- |
| Installed | the `<!-- ontrack:begin -->` marker |
| Ruled | at least one `###` heading other than `### Not yet decided` |

The difference between the two is reported with them: it measures the
problem of the backlog reveal.

**The count is taken by hand once a month.** A GitHub code search for
`"<!-- ontrack:begin -->" path:AGENTS.md`, filtered as above, then each
block read. It is recorded under `.nanopm/wiki/research/` with its date, the query and
the two numbers. Download figures may be quoted next to it, never as
adoption.

**A counted repository is named only with its maintainers' agreement.**
The record names a repository once its maintainers say yes, asked in an
issue on that repository. Until they answer, it appears as "repository 1",
"repository 2". Anyone can ask, in an issue on ontrack, for a repository
to come off the record. It is removed at the next count, with no reason
asked, and is still counted in the two numbers.

### Who is counted, and who can appeal

<!-- incongru-voix: lessig — naming an outside repository in ontrack's public adoption record, regulated by architecture (code search) and nothing else — recourse: none before this section; now consent before naming, removal on request -->

The count turns a public file in someone else's repository into a line in
ontrack's record. Its maintainers did not sign up for that, and are not
told.

```
CONSTRAINT : an outside repository appears by name in ontrack's adoption
             record, without having been asked

  law           nothing forbids it: the file is public, the search is
                GitHub's
  norm          weak: open-source projects list "who uses us" all the
                time, usually from users who added themselves
  price         zero for ontrack; for the repository, finding out it was
                listed costs reading ontrack's product wiki
  architecture  total: code search finds the block, the record names the
                repository, and nothing in either step involves its
                maintainers

  RECOURSE      none in the first draft of this ADR. Now: no name without
                agreement; removal on request at the next count
```

Rules this section adds:

1. Counting is not naming. The numbers need no one's agreement; a name
   does.
2. Agreement is asked on the repository, where its maintainers are. It is
   never assumed from silence.
3. A removal request needs no reason and gets no argument.

This repairs the record. Whether a project should keep a record of its
users at all is a different question, and this section does not answer it.

## Consequences

### Positive

- Adopters are not asked to trust a network call; the security review in
  the [stakeholder summary](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/stakeholder-summary-first-adopter.md)
  has nothing to find.
- The count measures a ruling, the thing ontrack exists for, and it excludes
  the maintainer by construction.
- Nothing to build, host or secure: one query and a short note.
- Anyone can repeat the count from the same query.

### Negative

- Private repositories, and those outside GitHub, are not counted. The
  count only goes too low, never too high.
- A repository that removed the block, or never ran `apply`, is invisible
  even if it uses a track.
- GitHub code search indexes default branches only, with delay, and its
  results are not exhaustive.
- A monthly count by hand is slow to show a trend, and depends on the
  maintainer doing it.
- Asking before naming is an issue opened on someone else's repository,
  which is itself contact they did not ask for. One issue, never a
  follow-up.

### Neutral

- When the count reaches a level where by-hand reading is tedious (about
  20 repositories), a script can run the same query; that changes the
  method, not this decision.

## Alternatives Considered

- **Opt-in telemetry in the CLI.** Counts runs, including private
  repositories, but only from those who opt in, and it counts runs, not
  rulings. It adds a network call to a tool asking for trust from people
  who have never heard of it.
- **npm downloads.** Free and already there. Dominated by the
  maintainer's CI; it cannot tell one adopter from one more push.
- **Dependents of the track packages** (`package.json`, GitHub's
  dependency graph). Shows installs, not rulings; kept as the "Installed"
  count's cross-check, not as the measure.
- **Ask adopters to register.** Precise for those who do. Nobody registers
  for a tool they are still deciding about, which is the stage that
  matters now.

## References

- [Solution brief: five conversations, then one pull request](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/solution-brief-first-adopter.md).
- [Opportunity tree: a first ruled convention outside our repositories](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/opportunity-tree-first-adopter.md).
- [Foundation Sprint readiness](https://github.com/trivoallan/ontrack/blob/main/.nanopm/wiki/research/foundation-sprint-readiness-adoption.md):
  the 2026-11-21 baseline (zero external adopters) and the inversion that
  proposed counting the block.
- `formatInstructions` in `src/instructions.ts`: the block format the count
  reads.
