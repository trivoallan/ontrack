## Context

The track page is read by two people: one evaluating ontrack, who wants to
see what a repository gets, and one who adopted the track, who wants to
install it and keep it current. ontrack-engineering is the only public
track.

## Goals / Non-Goals

**Goals:** one page per job: the track page explains, "Use it" guides,
"Questions" is the reference.

**Non-Goals:** moving the adopter steps out of "Revise a question", which
walks a maintainer's own track end to end; a place for a second public
track.

## Decisions

- **Top-level, after "Start here".** The tutorial installs this track, so
  it is the next thing a reader meets. Rejected: under "Use a track",
  where it was hidden behind a collapsed group.
- **"Use it" links to "Revise a question" for a revised question** rather
  than repeating its steps: that guide stays whole for maintainers.
- **"Questions", not "Contents".** A package of questions is called a
  track (local/ADR-0022).

## Risks / Trade-offs

- The site now gives one track the rank of the tool. True while it is the
  only public track; the sidebar's comment says a second one needs its
  place decided.
