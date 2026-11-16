## Why

After `ontrack apply`, a first-time adopter reads `next: 24 proposed ADRs to rule` and `review` walks through them in catalogue order, one agreement after another. Nothing says the repository already works with them open, nothing puts first the questions the history answers, and nothing lets the adopter skip or stop. The likely outcomes are an abandoned list or rulings agreed without reading them (`research/problem-statement-backlog-reveal.md`, `research/prd-backlog-reveal.md`). The ontrack-engineering track and the tutorial are now public, so more adopters meet this moment, and the hint is cheap to change before docs and habits depend on it.

## What Changes

- Phase 1, `apply`: when `proposed` ADRs remain, the `next:` hint on stderr says they are ruled when the user chooses, that the repository works as it is, and that `check` runs only the decided ADRs. stdout and exit codes do not change; the revised-ADR hint does not change.
- Phase 2, `review` without an argument (sequence prompt):
  - a survey step before any ruling: the agent reads every listed ADR and the repository, writes nothing, sorts the ADRs into those the repository already answers and those that need a discussion, and asks the user to agree to that order or give another. Skipped when the list holds one ADR;
  - at each proposal, the user can skip the ADR (its file stays untouched) or stop the review;
  - "Do not start an ADR before the previous one is ruled" becomes "ruled or skipped";
  - when the list is done or the user stops, a summary: ADRs ruled in the session, ADRs still `proposed` with their group, and a sentence saying the repository works with them open;
  - the tracking step runs when the review ends, whether every ADR is ruled or the user stops (it ran only once every ADR was ruled). Its text stays the same in both prompt forms.
- The seven review steps, the import prompt, the revision and supersession prompts, selection order and exit codes are unchanged.
- Phase 2 ships only after observation round 1 confirms the problem (`research/prd-backlog-reveal.md`, Timeline). Tasks keep the two phases separable.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `apply`: the next-step hint for `proposed` ADRs says the repository works with them open and that `check` runs only decided ADRs.
- `review`: the sequence prompt gains a survey step, skip and stop, and an end-of-review summary; the tracking step runs when the review ends rather than once every ADR is ruled.

## Impact

- Code: `src/commands/apply.ts` (`nextStep`), `src/review.ts` (`formatSequence`, `TRACKING`).
- Tests: `test/apply.test.ts`, `test/review.test.ts`.
- Docs: `docs/commands.md` (apply next step, `review` prompt contract and quoted sequence prompt), `docs/tutorial.mdx` (quoted `next:` line and the step that rules the remaining questions).
- No file format, status, dependency or exit-code change. CI jobs that read stdout or exit codes are unaffected.
