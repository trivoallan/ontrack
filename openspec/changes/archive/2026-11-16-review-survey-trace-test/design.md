## Context

The survey defined in `review-survey-labelled-citations` and refined since says "an absence counts as a citation only when the absence is the value", and a citation shows the value when it states it. Runs 12 to 14 compared this prompt (p10) with the same prompt plus the two edits below (p11), on 15 repositories, 10 of them never used for tuning, scored blind.

## Decisions

1. **The trace test for absences.** An absence is conclusive when the thing would leave a file or a configuration in the repository: an OpenSpec directory, an audit tool in a workflow. It is not for a dependency-update app, the provenance a registry records, a convention, or the agents contributors use. Alternative: list more cases. Rejected: run 6 showed that examples bound what the agent checks; the test generalises.
2. **The file tree shows the main language.** Alternative: leave it to a discussion. Rejected: the question is answered by the files in every repository where one language dominates.
3. **No history check.** Run 14 tried a paragraph asking for bot authors and tags in the history before a `none`. It was applied (22 calls against 4) and showed no gain; the rule preferred the simpler prompt.

## Evidence, and the exception

Across runs 12 to 14 (15 surveys of each): doubtful first-group ADRs 9 for p10 against 2 for p11; mislabels 11 against 2; the main language in the first group in 6 of 15 against 15 of 15; failing ADRs 2 against 1.

**This is an exception to the decision rule of run 13**, which asked for no failing ADR and was not met: p11 had one (postcss, a `none` for a dependency updater and scanner while the history shows Dependabot commits). p10 had a failing ADR in the same repository. Run 14 met the rule's criteria for p11 on five other repositories. The maintainer chose to adopt p11 on that evidence, with the history blind spot known and untreated.

## Risks / Trade-offs

- [The criterion is the rule itself] → the runs show that the agent applies the trace test, not that adopters are better served by the resulting first group.
- [A `none` contradicted by the history still gets through] → the ruling step re-reads the repository for each value before anything is written.
