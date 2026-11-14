# Design

## Context

See proposal.md for motivation. What shapes the approach:

- `src/review.mjs` holds the whole capability: `selectAdr` picks the named ADR from `readAdrs(root)` and throws unless its status is `proposed`; `formatReview` and `formatSequence` are fixed text plus path and title; `src/commands/review.mjs` writes the result and returns `2`.
- `readAdrs` already gives, for every `accepted` ADR, its `supersedes` list. The matching rule (a plain name is the same directory's `adr:` value or file name, `<namespace>/<name>` reaches another directory) lives inside the private `resolve` of `src/instructions.mjs`, which also throws on a trait conflict. The `review` spec forbids a trait conflict from stopping a prompt.
- `test/review.test.mjs` asserts that the README holds the exact output of `formatReview` between `~~~` fences. The README is the contract.
- ontrack reads `supersedes:` and treats any status other than `accepted` as out of force. It knows no `superseded` status, and this change does not teach it one.

## Goals / Non-Goals

**Goals:**

- One more branch in `review <adr>`, no new command, no new option.
- A prompt that is fixed text plus path, title and reference, like the review prompt.
- The two silent failures of a hand-written supersession are named in the prompt: a dropped trait key, and a dropped `check:`.

**Non-Goals:**

- Detecting an `accepted` ADR edited in place.
- Checking that a marked ADR and a `supersedes:` edge agree. ontrack does not know the mark.
- A lighter ADR format for one-key changes. The format is the repository's rule.
- `rejected` and `revised` ADRs.

## Decisions

**1. Extend `review <adr>` instead of adding `ontrack supersede`.** The user already types `review ADR-0004` and gets an error that says what is wrong but not what to do. Turning the error into the prompt adds no surface. Alternative considered: a dedicated command, clearer to document but a second verb for "print a prompt about this ADR". Rejected by the user during the brainstorm.

**2. `selectAdr` returns the ADR for two states and the handler picks the prompt.** `selectAdr` accepts `proposed`, and `accepted` when not superseded; the handler calls `formatReview` or a new `formatSupersession` on `adr.status`. Alternative: a second selector. Rejected: the name-matching and its three errors would be duplicated.

**3. Supersession is computed without `resolve`.** Extract from `resolve` the loop that turns `supersedes` lists into the set of superseded ADRs, as an exported function of `src/instructions.mjs` taking the ADR list, and call it from both `resolve` and `selectAdr`. `resolve` cannot be called directly because it throws on trait conflicts, and a trait conflict is one of the reasons to supersede. The function returns, for a superseded ADR, the ADR that supersedes it, so the error can name it.

**4. The marking of the superseded ADR is the repository's rule, not the tool's.** The prompt says "mark it as the repository's rules prescribe; when they prescribe nothing, leave its file untouched" and names no status value. Decided by the user: the status vocabulary beyond what ontrack reads belongs to the source. governance's ADR-0001 says today that the reverse edge is computed and not written; its revision 2 will prescribe a mark, and this prompt then follows it with no ontrack release. Alternative: write `status: superseded` from the prompt. Rejected: it would contradict ADR-0001 revision 1 in every repository that installs ontrack.

**5. The format of the new ADR is the repository's rule too.** The prompt says "in the format the repository's rules prescribe" and adds one cost-cutting instruction of its own: refer to the superseded ADR for context instead of restating it. Whether a full Nygard ADR is too heavy for a one-key change is not known; it has not been tried. Alternative: prescribe a short form in the prompt. Rejected: it would override `record-architecture-decisions.format`.

**6. The new ADR always goes to `docs/adr/`.** `docs/adr/<namespace>/` holds what a source ships; a file ontrack did not import there would show up in `plan`. A local ADR superseding a local ADR also lands in `docs/adr/`. The prompt therefore always prints the full reference (`trivoallan/ADR-0006-commits`, `local/ADR-0020-release`) in `supersedes:`, which the README documents as valid from any directory, so the agent never has to choose between the plain and the qualified form.

**7. Exit code `2`.** A prompt printed means a ruling is pending, as for the review prompt. No change to the `Exit codes` requirement.

**8. The tracking-items paragraph is reused as is.** A superseding ruling can be ahead of the repository like any other. Its opening words, "Once every ADR is ruled", read slightly off for a single supersession; one shared constant is worth more than a second wording.

## Risks / Trade-offs

- [A repository whose rules say nothing on superseding gets an untouched old ADR, and a reader of that file alone cannot tell it is superseded] → That is ADR-0001 revision 1's stated choice; `instructions` and `check` are correct regardless, since they read the edge.
- [A source prescribes a mark, someone later deletes the superseding ADR, and the marked ADR's traits vanish from AGENTS.md with no error] → Out of scope (see Non-Goals); the source can cover it with a `check:`.
- [`review <accepted ADR>` now exits `2` with output where it exited `1`] → Documented in the README; no known caller.
- [The agent omits a trait key anyway] → `npx ontrack apply` at the end of the prompt rewrites AGENTS.md, so the missing rule is visible in the diff the user reviews.
- [The prompt text is untested against a real supersession] → Task 4.1 runs it once on this repository before the change is archived.
