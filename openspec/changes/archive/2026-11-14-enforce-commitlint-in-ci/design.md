# Design

## Context

See proposal.md for motivation. Pull requests are squash-merged (ADR-0009),
and GitHub uses the pull request title as the squash commit's subject. The
commits inside a branch never reach `main`. The existing history already
follows the format, with and without scope (`chore: add the Apache 2.0
license`, `feat(plan)!: drop the title…`). CI actions are to be pinned by SHA
(ADR-0011 rule 3).

## Goals / Non-Goals

**Goals:**
- Refuse, before merge, a title whose type is not one of the eleven, whose
  scope is not in ADR-0006's list, or that is not in Conventional Commits
  form.

**Non-Goals:**
- Linting the individual commits of a branch: squash discards them.
- A local `commit-msg` hook.
- Checking direct pushes to `main`: the ruleset already requires a pull
  request's checks.

## Decisions

**Lint the pull request title, in a dedicated workflow.** The job runs on
`pull_request` with types `opened`, `edited`, `reopened` and `synchronize`,
so that fixing the title re-runs the check. It lives in its own
`commitlint.yml`: adding `edited` to `test.yml` would re-run the test suite
on every title edit. Alternative: `wagoid/commitlint-github-action`, which
lints branch commits by default, the ones squash throws away.

**The title reaches commitlint through an environment variable**
(`env: PR_TITLE: ${{ github.event.pull_request.title }}`, then
`printf '%s' "$PR_TITLE" | npx commitlint`). Interpolating the expression
into the `run:` script would let a title inject shell. The job needs
`contents: read` only, and no secret, so it also runs on pull requests from
forks (ADR-0011 rule 5).

**`@commitlint/config-conventional` plus one rule.** Its `type-enum` is
exactly the eleven types ADR-0006 fixes. The configuration adds
`scope-enum` with the nine scopes and leaves `scope-empty` unset, because the
history legitimately holds scope-less messages. Alternative: a hand-written
rule set, which would restate what the shared configuration already is.

**The scope list is copied from ADR-0006, with a comment naming it.** Reading
it from the ADR's frontmatter at lint time would remove the copy, at the
price of a YAML reader in a ten-line configuration. The two places change in
the same pull request.

**The job is named `commitlint` and added to the ruleset.** Without it the
check reports and blocks nothing.

## Risks / Trade-offs

- [The squash dialog lets the merger retype the subject after the check ran]
  → accepted; the default text is the linted title.
- [Bot pull requests (Dependabot, release-please) must pass too] → their
  titles are configured in their own changes to use `chore` with no scope.
- [Scope list drifts between ADR-0006 and the configuration] → comment in
  the configuration; both edited together.
