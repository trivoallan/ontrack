## Context

`apply` prints `next: N proposed ADRs to rule` on stderr (`nextStep` in `src/commands/apply.ts`). `review` without an argument prints the sequence prompt (`formatSequence` in `src/review.ts`): the proposed ADRs in reference order, the seven `STEPS`, "Do not start an ADR before the previous one is ruled", then `TRACKING`, which starts "Once every ADR is ruled". Every prompt is fixed text plus paths and titles; the CLI reads no history and judges nothing.

Observed before writing: an imported `proposed` ADR matches its track's copy, so `plan` reports it `unchanged` and `hasPendingChanges` is false; `check` runs only ADRs in force (`src/check.ts`). "The repository works as it is" is true after `apply` writes the rules block.

Constraints: exit codes and stdout are public contracts (`docs/commands.md`); the review contract makes the agent stop and ask before every write; the seven steps are the same text in both prompt forms, and so is `TRACKING`.

## Goals / Non-Goals

**Goals:**
- The `apply` hint says the rulings are the user's to schedule.
- The sequence prompt starts with the questions the history answers, lets the user skip or stop, and ends with what is left.
- Keep phase 1 (apply hint) and phase 2 (sequence prompt) separable, so phase 1 can ship before observation round 1.

**Non-Goals:**
- Any ordering, grouping or scoring computed by the CLI.
- A progress counter, a batch agreement, a new ADR status, or anything written to record a skip.
- Changes to the named-ADR, import, revision and supersession prompts, other than the shared `TRACKING` sentence.

## Decisions

1. **The agent groups, the CLI lists.** The survey is an instruction in the prompt; `pendingAdrs` keeps reference order. Alternative: a track-declared or CLI-computed order. Rejected: the CLI judges nothing, and no track field exists for it; a track hint stays a future consideration.
2. **Survey and summary live outside `STEPS`.** They are sequence-only text in `formatSequence`, so the seven steps stay identical in both forms and the named-ADR prompt is unchanged. Alternative: a step 0 in `STEPS`. Rejected: it would add a survey to the named prompt.
3. **Skip leaves no trace on disk.** A skipped ADR stays `proposed`, byte-identical. Alternative: a `deferred` status or a note in the ADR. Rejected: `proposed` already means "not decided yet", and a status is a file format change.
4. **`TRACKING` runs when the review ends** (user's answer during planning): "Once the review ends, whether every ADR is ruled or the user stops". One sentence, the same in both forms; for a named ADR the review ends after that ADR, so the behaviour there does not change. Alternative: keep "once every ADR is ruled". Rejected: a stopped session would never propose tracking items.
5. **The hint keeps its frame.** First line `next: N proposed ADR(s), ruled when you choose: the repository works as it is`, then `  check runs only the decided ADRs. Start with a few:`, then the two existing invocation lines. The extra line only appears for proposed ADRs; the revised hint is untouched. No pronoun depends on N, so only `ADR`/`ADRs` pluralises, as today.

## Risks / Trade-offs

- [The survey adds a wait before the first proposal on large tracks] → time it in the desk test rerun; with one ADR the survey is skipped.
- [Grouping "already answered" invites agreeing without reading] → the observed/absent marks of #205 stay in every proposal; the changed-value guardrail in the PRD decides whether the grouping stays.
- [Agents ignore skip and stop] → AB-5 in `research/prd-backlog-reveal.md`; a failure blocks phase 2.
- [Docs drift from the prompt] → `docs/commands.md` quotes the full sequence prompt; tests compare it (task 3).

## Migration Plan

No data migration. Phase 1 can merge alone; phase 2 merges after the go/no-go that follows observation round 1. Rollback is a revert of the prompt text.

## Open Questions

- Should the end-of-review summary also be written somewhere, such as the "Not yet decided" list of `AGENTS.md`? Assumed no: it stays in the session.
- No in-force ADR needs revisiting.
