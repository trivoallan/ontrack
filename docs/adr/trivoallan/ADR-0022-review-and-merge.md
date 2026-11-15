---
adr: ADR-0022
slug: review-and-merge
title: Review and merge
status: accepted
revision: 1
date: 2026-11-15
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install governance-check ADR-0022
traits:
  review:
    merge_by: person
---

# Review and merge

## Status

Accepted

## Context

This ADR is written for a repository kept by **one person**, who works
with a coding agent. The agent branches, commits and opens the pull
request ([ADR-0009](ADR-0009-branching.md)). While this key is empty, it
does not know **whether it may merge that pull request itself** once the
checks are green. It either waits without saying so, or merges what
nobody read.

**An agent's merge cannot be told apart afterwards.** The agent works with
the maintainer's `gh` session or token, so GitHub records its merge under
the maintainer's name. The history shows a merge, never who decided it.
The rule can only be enforced **before** the merge, not audited after it.

**For one person, the merge is the review.** GitHub does not let the author
of a pull request approve it. A repository with one maintainer that
required an approval would block every merge, or bypass the rule on each
one. What remains is the moment a person reads the diff and merges it.

Two ADRs already settle a case: [ADR-0018](ADR-0018-dependencies.md) lets
some updates merge without a person, and
[ADR-0019](ADR-0019-vulnerabilities.md) has a person merge every
vulnerability ignore rule. This ADR states the rule they are cases of.

**Not concerned:** how many approvals a pull request needs, and who owns
which path (`CODEOWNERS`). Both matter once several people review, which
this ADR does not address.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `review.merge_by` | `person` | the agent proposes, reviews and fixes; a person reading the diff and merging it is the review, and the only one a repository with one maintainer can have |

`agent` is an acceptable answer for a repository nobody depends on, such as
a demo or a throwaway, and it is justified here when you rule it.

**What governance fixes when you rule `person`:**

1. **The agent opens the pull request ready for review, says when its
   checks are green, and stops.** Not as a draft: a draft adds a click and
   no review.
2. **The agent merges nothing.** Not with `gh pr merge`, not by enabling
   auto-merge (`--auto`), not through the API, not by pushing to the
   default branch.
3. **A bot that a workflow runs under another ADR's ruling is not an
   agent session.** ADR-0018's automerge is that exception: Dependabot's
   pull request is merged by a workflow the repository ruled, not by the
   agent.
4. **A review the agent runs on its own work is advice.** It can find
   faults and fix them. The person's merge remains the review.

**On GitHub, a ruleset backs the rule.** On the default branch: require a
pull request before merging, with zero required approvals, and leave the
bypass list empty. Pushing to the default branch then fails for everyone,
the agent included. That setting lives on GitHub, not in a file of the
repository, and the check does not verify it.

**With `agent.host: claude-code`** ([ADR-0017](ADR-0017-agent-tooling.md)),
`.claude/settings.json` denies the merge:

```json
{
  "permissions": {
    "deny": ["Bash(gh pr merge:*)"]
  }
}
```

If the GitHub MCP server is installed, deny its merge tool as well, under
the name your configuration gives the server (for example
`mcp__github__merge_pull_request`).

Adopted as recommended. Other repositories install this package, so a
person reads and merges every pull request. `.claude/settings.json` denies
`gh pr merge`. Dependabot's patch updates keep their automerge
([ADR-0018](ADR-0018-dependencies.md)), the exception rule 3 allows.

## Consequences

### Positive

- An agent opens its pull request, says when the checks are green, and
  stops: nothing reaches `main` that one person did not merge.

### Negative

- Every merge waits for one person, the release pull request included.

### Neutral

- Whether `main` refuses a direct push is a GitHub setting, outside the
  repository, and nothing here checks it.

## Alternatives Considered

### `merge_by: agent`

The agent merges once the checks are green. No wait, and no reader: a
green check is not a review (ADR-0018 says why). Tenable for a repository
nobody installs from or depends on.

### One required approval

The usual rule for a team. For one maintainer it cannot work: GitHub
refuses the author's own approval, so every merge is blocked or bypassed,
and a rule bypassed on every merge is not a rule.

### `CODEOWNERS`

Routes each path to its owners for review. With one maintainer every path
has the same owner, so the file adds nothing. It belongs with required
approvals, in a revision of this ADR that addresses several reviewers.

### Draft pull requests

The agent opens a draft, and the person marks it ready, then merges. The
extra step proves nothing the merge does not already prove.

## References

- Original to governance; no surdesrails SDR asks this question.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [ADR-0009](ADR-0009-branching.md): one change, one branch, one pull request.
- [ADR-0011](ADR-0011-forge-and-ci.md): the required checks a merge waits for.
- [ADR-0017](ADR-0017-agent-tooling.md): `agent.host`, which decides what the check reads.
- [ADR-0018](ADR-0018-dependencies.md) and [ADR-0019](ADR-0019-vulnerabilities.md): the two cases this ADR generalises.
- Claude Code: [permissions](https://code.claude.com/docs/en/permissions). GitHub: [about rulesets](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [available rules](https://docs.github.com/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [approving a pull request](https://docs.github.com/en/pull-requests/how-tos/review-pull-requests/approving-a-pull-request-with-required-reviews). Read on 2026-11-15.

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `review.merge_by` | who merges a pull request into the default branch | `person`, `agent` |

**An empty key is not an answer.** The value is written in this file and
nowhere else; whoever needs it links here. See ADR-0001 for the check
command.
