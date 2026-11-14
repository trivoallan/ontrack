# Design

## Context

See proposal.md for motivation. Constraints that shape the approach:

- ontrack is installed from git, not from the npm registry (the `ontrack`
  name there belongs to another project, ADR-0012): the "release" is a tag
  and a GitHub release, with no publish step.
- `main` is protected by a ruleset requiring status checks. A pull request
  opened with the workflow's default `GITHUB_TOKEN` does not trigger
  workflows, so its required checks would never run and it could not merge.
- Commit format is Conventional Commits with a closed scope list (ADR-0006);
  actions are pinned by SHA (ADR-0011 rule 3); secrets are named by the
  agent and set by a person (ADR-0011).
- The history holds `feat` and one `feat!` commit and no tag.

## Goals / Non-Goals

**Goals:**
- A tagged, changelogged version produced by merging one pull request.
- A README that always shows the latest tag.

**Non-Goals:**
- Publishing to the npm registry.
- Attaching build artefacts to the release.
- Backfilling tags for past states of `main`.

## Decisions

**`googleapis/release-please-action`, manifest mode, `release-type: node`.**
The manifest configuration (`release-please-config.json` and
`.release-please-manifest.json`) keeps every option in reviewed files rather
than in workflow inputs. The workflow runs on `push` to `main` with
`contents: write` and `pull-requests: write`, the action pinned by SHA.
Alternative: `semantic-release`, which releases on every merge with no
reviewable release pull request, and is not what the ADR ruled.

**A dedicated token, `RELEASE_PLEASE_TOKEN`.** A fine-grained personal access
token scoped to this repository (contents and pull requests: read and
write) makes the release pull request trigger `test`, `node-20` and
`commitlint`, so it can satisfy the ruleset. Alternatives: the default
`GITHUB_TOKEN` (checks never run, the pull request is unmergeable under the
ruleset); a GitHub App (more setup than one solo-maintained repository
needs). The workflow only names the secret; the maintainer creates the token
and sets its value.

**Release pull request title `chore: release ${version}`**
(`pull-request-title-pattern`). The default, `chore(main): release …`, uses
a scope that ADR-0006's list does not hold and commitlint would refuse.

**Tags are `vX.Y.Z`** (`include-component-in-tag: false`), the form ADR-0012
documents for installation.

**The first release is `v0.2.0`.** The manifest starts at `0.1.0`, what
`package.json` says today, and `bump-minor-pre-major: true` keeps a breaking
change below 1.0 from producing `1.0.0`. The first changelog lists the
history so far. Alternative: force `0.1.0` with `release-as`, which needs a
second change to remove the override and tags as `0.1.0` a state users
already ran untagged under that number.

**The README version is updated by release-please.** The install block is
wrapped in `x-release-please-start-version` / `x-release-please-end`
comments and `README.md` is listed in `extra-files`, so the documented tag
never lags the latest release. Alternative: a hand-edited version, which is
wrong the day after each release.

## Risks / Trade-offs

- [The token expires or is revoked] → the workflow fails visibly on the next
  push to `main`; renewing it is a maintainer task, noted in the README's
  development section.
- [A mistyped squash title yields a wrong version] → commitlint on the pull
  request title; the release pull request shows the computed version before
  anything is tagged.
- [The generic updater does not rewrite the README as expected] → checked in
  the first release pull request's diff before merging it.
- [release-please's own commits on `main`] → they come from merging its pull
  request like any other, so the ruleset and squash policy apply unchanged.

## Migration Plan

1. Merge the workflow and configuration; the maintainer adds the secret.
2. release-please opens the `v0.2.0` pull request; review its changelog and
   README diff, then merge.
3. Rollback: delete the workflow file. Tags and releases already created
   stay valid install targets.
