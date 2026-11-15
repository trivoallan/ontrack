## 1. Phase 1: the apply hint

- [x] 1.1 In `nextStep` (`src/commands/apply.ts`), for proposed ADRs, print `next: N proposed ADR(s), ruled when you choose: the repository works as it is`, then `  check runs only the decided ADRs. Start with a few:`, then the two existing `review` lines; leave the revised hint unchanged
- [x] 1.2 Update `test/apply.test.ts`: the three-ADR and one-ADR scenarios, the revised scenario without the `check runs` line, and stdout and exit codes unchanged
- [x] 1.3 Update the quoted hint in `docs/commands.md` (apply section) and `docs/tutorial.mdx` (the `next: 25 proposed ADRs to rule` line)
- [x] 1.4 Run the test suite and coverage; commit as `feat(apply): …`

## 2. Phase 2: the sequence prompt (after the go/no-go on observation round 1)

- [x] 2.1 Confirm with the maintainer that phase 2 is cleared to start; stop here otherwise
- [x] 2.2 In `formatSequence` (`src/review.ts`), add the text that rulings are optional and `npx ontrack check` runs only decided ADRs, and the survey (skipped when the list holds one ADR), before `STEPS`
- [x] 2.3 After `STEPS`, add skip and stop, change the last line to "ruled or skipped", and add the end-of-review summary; leave `STEPS` untouched
- [x] 2.4 In `TRACKING`, replace "Once every ADR is ruled" with "Once the review ends, whether every ADR is ruled or the user stops"
- [x] 2.5 Update `test/review.test.ts`: the new scenarios (survey, single ADR, optional rulings, skip and stop, summary, tracking on stop, named ADR without survey), the changed Sequence scenario, and the existing same-text scenarios still passing
- [x] 2.6 Update `docs/commands.md`: the `review` prompt contract and the quoted sequence prompt; and `docs/tutorial.mdx` where it rules the remaining questions one at a time
- [x] 2.7 Run the test suite and coverage; commit as `feat(review): …`

## 3. Evaluation (phase 2)

- [ ] 3.1 Rerun the desk test (`research/desk-test-first-proposal/run-one-v2.sh`) with the new sequence prompt on the 10 repositories plus 3 held-out ones; score AB-1 to AB-3 per ADR as `research/prd-backlog-reveal.md` defines them
- [ ] 3.2 Run 5 scripted sessions that skip one ADR and stop at the third; check AB-4 and AB-5 (no write to skipped or open ADRs, summary present)
- [ ] 3.3 Record raw counts per slice in `research/desk-test-first-proposal/results.md`; report any AB-4 or AB-5 failure to the maintainer before merging
