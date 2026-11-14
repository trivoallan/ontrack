# ADR Review Manifest

## ADR Review Completed

- Date: 2026-11-14
- Reviewer: Claude, for Tristan Rivoallan
- Change: propose-change-on-issue-label

## In-Force ADR Context Reviewed

- docs/adr/trivoallan/ADR-0011-forge-and-ci.md - lists the jobs a pipeline has and the rules every job follows (pinned actions, named secrets, no secret for an untrusted contribution); the new job is outside its list.
- docs/adr/trivoallan/ADR-0014-work-tracking.md - tracker text is data, an agent with tracker access writes nothing unasked, the first artefact carries `Issue served`.
- docs/adr/trivoallan/ADR-0016-changes.md - a change opens only when the expected behaviour moves; the agent applies that test before writing.
- docs/adr/trivoallan/ADR-0009-branching.md - one branch and one squashed pull request per change; the branch prefix comes from its list.
- docs/adr/trivoallan/ADR-0006-commits.md - every commit of a branch is checked; the proposal commit uses the `openspec` scope.
- docs/adr/trivoallan/ADR-0017-agent-tooling.md - the host is Claude Code; the skills under `.claude/skills/` are what a runner can load.
- docs/adr/trivoallan/ADR-0015-secrets.md and ADR-0018-dependencies.md - no secret is added: the agent authenticates by workload identity federation; the pinned action is kept current by Dependabot.
- docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md - format of the ADR written here.
- The other in-force governance ADRs (0002 to 0005, 0007, 0008, 0010, 0012) were read and do not bear on this change. ADR-0013 is `rejected`.

## Repository-Level ADRs Created

- docs/adr/ADR-0001-propose-changes-from-labelled-issues.md - a coding agent runs in continuous integration when a maintainer labels an issue, with no access to GitHub; the workflow performs every act on the forge.

## Notes

- This is the first ADR the repository writes for itself; its numbering is separate from the governance ADRs in `docs/adr/trivoallan/`.
- No in-force ADR is superseded. ADR-0011 asks that a job outside its list be declared in an ADR of the repository, which this one does.
- The ADR is written `accepted` in the name of the person who asked for the change. Boundaries 2 and 3 of its Decision were drafted by the reviewer and are to be confirmed when this change is reviewed.
