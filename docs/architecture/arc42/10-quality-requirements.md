---
title: Quality Requirements
---

# Quality Requirements

The three quality goals of
[Introduction and Goals](01-introduction-and-goals.md), as scenarios. Each
scenario is stated in full in the specification it links to, and tested by
the test file of the module named beside it.

## No silent overwrite of a ruled ADR

| Scenario | Specified in | Tested in |
| --- | --- | --- |
| The track raises the revision of an ADR the repository ruled: `apply` reports it and leaves the file as it is. | [apply, "Revised ADR left alone"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#scenario-revised-adr-left-alone) | `test/apply.test.ts` |
| `apply --confirm` names an ADR it cannot confirm: `apply` fails before writing any file. | [apply, "Confirm a name that is not undetermined"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#scenario-confirm-a-name-that-is-not-undetermined) | `test/apply.test.ts` |
| Only the local verdict differs from the track's copy: the ADR is `unchanged`. | [adr-revision, "Only the local verdict changed"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/adr-revision/spec.md#scenario-only-the-local-verdict-changed) | `test/revision.test.ts` |
| `apply --confirm` on an undetermined ADR changes its `revision:` line and nothing else. | [apply, "Confirm one ADR"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#scenario-confirm-one-adr) | `test/apply.test.ts` |
| `apply` rewrites the rules block of `AGENTS.md` and leaves the rest of the file untouched. | [agents-file, "Block replaced, the rest untouched"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/agents-file/spec.md#scenario-block-replaced-the-rest-untouched) | `test/agents.test.ts` |

## Repeatable imports

| Scenario | Specified in | Tested in |
| --- | --- | --- |
| Nothing differs from the tracks: `apply` writes nothing, prints what `plan` prints and exits with `0`. | [apply, "Nothing to apply"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#scenario-nothing-to-apply) | `test/apply.test.ts` |
| `plan` leaves the working tree as it found it. | [plan, "Tree unchanged"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/plan/spec.md#scenario-tree-unchanged) | `test/plan.test.ts` |
| A new ADR is copied byte for byte from the track. | [apply, "New ADR imported"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#scenario-new-adr-imported) | `test/apply.test.ts` |
| The same project always gives the same output: tracks are sorted by namespace and ADRs by name. | [plan, "Output format"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/plan/spec.md#requirement-output-format) | `test/plan.test.ts` |
| `apply --dry-run` writes nothing and announces what a real run would do. | [apply, "Dry run"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#requirement-dry-run) | `test/apply.test.ts` |

## Few dependencies

| Scenario | Checked by |
| --- | --- |
| The package declares two runtime dependencies, `yargs` and `zod`. | `dependencies` in [`package.json`](https://github.com/trivoallan/ontrack/blob/main/package.json) |
| The package ships compiled code only, and nothing under `docs/` or `site/`. | `files` in [`package.json`](https://github.com/trivoallan/ontrack/blob/main/package.json); [docs-site, "Package content"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/docs-site/spec.md#scenario-package-content) |
| No command opens a network connection. | [plan, "Read-only and offline"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/plan/spec.md#requirement-read-only-and-offline), [apply, "Same plan as plan"](https://github.com/trivoallan/ontrack/blob/main/openspec/specs/apply/spec.md#requirement-same-plan-as-plan) |
| The lowest supported Node runs the whole test suite. | the `node-22` job of [`test.yml`](https://github.com/trivoallan/ontrack/blob/main/.github/workflows/test.yml) |
