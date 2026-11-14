## Why

The `propose` and `apply` workflows work in this repository, and the measure
of the experiment is positive. The maintainer wants the same path, from a
labelled issue to a draft proposal and from an approved pull request to an
apply session, in `governance`, in the pilot repositories and in other open
source projects. Copying 500 lines of security posture into each one would
let every copy drift on its own. This change answers task 5.3 of
`propose-change-on-issue-label` (#152) with "keep": the workflows stay here
and other repositories call them.

They stay in ontrack because their real dependency is ontrack: they read the
traits of the `AGENTS.md` that ontrack writes, and they refuse the `check:`
commands that `ontrack check` would run. Every caller already uses ontrack,
so no new repository and no new dependency is needed.

## What Changes

- `propose.yml` and `apply.yml` gain a `workflow_call` trigger next to their
  current one. ontrack keeps running them on its own issues and pull
  requests, and other repositories call them by commit SHA.
- The change frameworks the agent may write for form a closed catalog kept in
  this repository. Version 1 has two entries, `openspec` and `adr`. A caller
  picks entries from the catalog and never passes a path or a pattern. Each
  entry fixes the agent's tool rules, what is installed and the `publish`
  filter. Adding a framework is a pull request to the catalog.
- The run fails before the agent starts when the `changes` trait of the
  caller's `AGENTS.md` names a framework the caller did not enable.
- The labels become inputs, with `ontrack:propose` and `ontrack:apply` as
  defaults. Their values reach the scripts through `env`, never through an
  expression inside a `run` script.
- `apply` takes the routine identifier as an input and the token that fires
  it as a named secret. Callers never pass `secrets: inherit`.
- The ADR directory comes from a new trait of ADR-0001 in the governance
  source, with `docs/adr` as the default until the trait exists. The file
  name pattern, the "added files only" rule and the ban on `check:` do not
  change.
- `governance` calls `propose` with the `openspec` entry only: no ADR is
  drafted from an issue there, because its ADRs are rules that every
  repository ends up running.

## Capabilities

### New Capabilities

- `shared-change-workflows`: other repositories call the `propose` and
  `apply` workflows of ontrack, with a closed framework catalog, labels as
  inputs, the ADR directory taken from a trait, and the apply credentials
  passed explicitly.

### Modified Capabilities

None. The `issue-proposal` requirements of `propose-change-on-issue-label`
still hold for ontrack's own runs. This change only adds what holds when
another repository calls the workflows.

## Impact

- `.github/workflows/propose.yml` and `.github/workflows/apply.yml`: new
  trigger, inputs and secret, catalog lookup, and paths taken from the
  inputs.
- A catalog file in this repository that both workflows read.
- `test/propose-workflow.test.ts` and `test/apply-workflow.test.ts`: cases
  for the catalog, for a mismatch with the trait, and for the label input.
- Documentation: a page that shows a caller, with a comment that explains why
  the caller grants the union of the jobs' permissions.
- The Anthropic federation rule may need to match `job_workflow_ref` for a
  call from another repository. That is checked first.
- Upstream, in `trivoallan/governance`: a new trait of ADR-0001 for the ADR
  directory. It is proposed there and is not written in this repository.
- The roadmap: this work comes before the pilot review of 2026-12-18, which
  the plan did not foresee.
