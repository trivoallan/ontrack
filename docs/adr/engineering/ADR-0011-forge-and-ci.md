---
adr: ADR-0011
slug: forge-and-ci
title: Forge and continuous integration
status: accepted
revision: 5
date: 2026-11-26
authors: [Tristan Rivoallan]
supersedes: []
check: npx --no-install ontrack-engineering-check ADR-0011
traits:
  forge:
    gate: blocking
    audit: zizmor
    integration: up-to-date
---

# Forge and continuous integration

## Status

Accepted

> **What is this file?** A convention ontrack-engineering proposes to your
> repository, with the values it recommends. While it says
> `status: proposed`, you may edit it freely. `revision:` dates the
> convention, not the file: you do not fill it, and it only moves when the
> convention changes. `rejected` is a full ruling: when the convention
> does not apply here, rule `rejected`, remove the whole `traits:` block,
> and say what stands in for it.
> [ADR-0001](ADR-0001-record-architecture-decisions.md) explains the
> mechanics.

## Context

ontrack-engineering assumes **GitHub** as the forge: pull requests, GitHub Actions
workflows in `.github/workflows/`, secrets in repository or environment
settings, and branch protection in rulesets. A repository on another forge
rules this ADR `rejected` and names its forge in the reason.

While the key is empty, an agent opening a pull request does not know
whether a red pipeline **blocks the merge** or only **reports**. It either
spends time fixing a red that had no consequence, or merges a red that did.

**A red pipeline blocks nothing on its own.** It blocks a merge only once a
ruleset on the repository (or the organisation) names the check as
required. That setting lives on GitHub, not in a file of the repository, so
the value written here is a statement of intent that the ruleset makes
real.

**The workflows are code an agent writes, and nothing reads them.** The
rules below are written for whoever writes a workflow. Measured on
ontrack-engineering's own workflows with zizmor 1.32.0, five findings slipped past
them, among them a template injection and write permissions granted to the
whole workflow, while every action was correctly pinned. While
`forge.audit` is empty, an agent does not know whether a tool will read
what it wrote.

**A green pull request is green against the base it ran on.** The
pipeline tests a pull request merged with the default branch as it was
when the run started. Two pull requests can each be green and leave the
default branch red once both have merged, because neither ran on top of
the other. GitHub lets a pull request merge without being up to date, so
nothing tests what lands. This is common when several agent sessions open
pull requests in parallel. While `forge.integration` is empty, an agent
does not know whether to bring its branch up to date before saying it is
green, or whether anything guards the default branch at all.

What a pipeline runs on which branch follows from other ADRs: the branching
model ([ADR-0009](ADR-0009-branching.md)), the delivery
([ADR-0012](ADR-0012-delivery.md)), the languages and tests
([ADR-0004](ADR-0004-languages.md), [ADR-0007](ADR-0007-tests.md)).

## Decision

**What ontrack-engineering recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `forge.gate` | `blocking` | a check that prevents nothing is not a check, it is a report. Make it real with a ruleset that requires the pipeline's checks on the default branch |
| `forge.audit` | `zizmor` | it reads workflows for what this ADR's rules forbid: a movable action reference, `pull_request_target`, a template expanded into `run:`, permissions wider than a job needs. actionlint checks that a workflow parses, not that it is safe |
| `forge.integration` | `queue` when an organization owns the repository, `up-to-date` otherwise | either one makes the default branch hold exactly what a pipeline ran on. A queue does it without asking anyone to update a branch. GitHub offers merge queues only to public repositories owned by an organization, and to private ones on GitHub Enterprise Cloud, so a repository owned by a user rules `up-to-date` |

`none` is how a repository says it has no pipeline at all: keep `traits:`
and write `none`. `rejected` has one use only, a forge other than GitHub.

Who reviews a change to this repository, and who merges it, is
[ADR-0022](ADR-0022-review-and-merge.md)'s convention: `review.by`.

`forge.integration` says what is tested before a pull request lands on
the default branch:

- `queue`: a merge queue tests each pull request on top of the ones ahead
  of it, and merges it only when that run is green;
- `up-to-date`: a pull request must contain the tip of the default branch
  before it merges, so its own run is the one that counts;
- `none`: nothing beyond the pull request's own run.

`queue` and `up-to-date` require `forge.gate: blocking`: without a
required check, there is nothing to integrate. `up-to-date` costs a new
run of every open pull request each time one merges, and that cost grows
with the number of pull requests open in parallel. A queue avoids it,
which is why it is recommended wherever GitHub offers one.

**What ontrack-engineering fixes, whatever you rule.** Five rules apply to every
workflow job, not only to deployment:

1. **Deploy only from the default branch.** A pushed feature branch deploys
   nothing. Bind each deploy job to the default branch in its workflow
   `on:` and its job `if:`, and protect the environment it uses.
2. **Deploy secrets are protected.** They live in repository secrets, or in
   environment secrets when rule 1 needs them, never in a file.
3. **Pin actions and images immutably.** An action tag such as
   `actions/checkout@v4` can be moved, so the only immutable form is the
   commit SHA, with the tag in a comment. An image is pinned by digest or by
   a tag nobody moves, never `latest`.
4. **No job writes a secret's value to a log.** The rule targets the fact,
   not a list of commands. Printing what the pipeline publishes anyway (a
   staging URL, a commit) is fine.
5. **An untrusted contribution receives no secrets**, and a job running with
   the repository's rights does not execute proposed code: that is
   `pull_request_target` checking out the fork's head. Secret-free CI still
   runs on pull requests from forks: what stops is the secret, not the test.

**What ontrack-engineering fixes when you rule `forge.audit: zizmor`:**

1. **A job runs zizmor on every pull request**, through
   `zizmorcore/zizmor-action` pinned by SHA (rule 3). In CI it also runs
   the online audits, with the job's `GITHUB_TOKEN`.
2. **A finding is silenced only inline**, on its line, with its reason:
   `# zizmor: ignore[template-injection] the title is only echoed`. The
   agent proposes it and a person approves or merges it, as
   [ADR-0022](ADR-0022-review-and-merge.md)'s `review.by` says and as
   [ADR-0019](ADR-0019-vulnerabilities.md) rule 4 has for an ignore rule. A
   `zizmor.yml` that loosens or disables an audit is not a way to silence:
   the check does not read it.
3. **Every action is pinned by hash**, GitHub's own (`actions/*`)
   included. zizmor's default policy already requires it.

**What ontrack-engineering fixes for each `forge.integration`:**

- With `queue`:
  1. **Every workflow that reports a check the default branch requires
     also runs on `merge_group`**, and so does every workflow that uploads
     code scanning results. A required check that never runs in the queue
     blocks every merge.
  2. **The default branch's ruleset holds a `merge_queue` rule** whose
     `merge_method` follows [ADR-0009](ADR-0009-branching.md)'s
     `branching.merge`: `squash` gives `SQUASH`, `merge-commit` gives
     `MERGE`, and `rebase` gives `REBASE`. Its `grouping_strategy` is
     `ALLGREEN`. With `HEADGREEN`, a pull request whose own checks fail
     lands when the last one of its group passes, and `blocking` no longer
     holds.
  3. **The other parameters of the rule stay at GitHub's defaults.** These
     are the group sizes, the concurrency and the timeouts. A repository
     that changes them says so in its own ADR.
  4. **`gh pr merge` adds a pull request to the queue.** ADR-0022's
     `review.by` governs adding a pull request to the queue exactly as it
     governs merging one: with `maintainer`, the agent does not do it.
- With `up-to-date`:
  1. **The default branch's required status checks are strict**
     (`strict_required_status_checks_policy: true`).
  2. **The agent may bring its own pull request's branch up to date.**
     That is a push, not a merge. It then says when the checks are green
     again, as ADR-0022 rule 1 asks.
- With `none`, **a workflow runs on pushes to the default branch**. It
  does not stop the default branch from breaking, but it shows the
  breakage. With `forge.gate: none` there is no pipeline, and nothing to
  run.

What GitHub does not document: what the `code_scanning` rule evaluates
inside a queue. Code scanning's own documentation asks for the
`merge_group` trigger, which rule 1 for `queue` gives. ontrack-engineering
has not observed the rule's behaviour in a queue.

**Secrets are named, never given.** An agent produces the list of secret
*names* a workflow needs; a person sets the values on GitHub. A token, a
password or a kubeconfig never goes into a change, a commit or a reply to
the agent.

**Departing from a rule** is declared in your own ADR, with its reason. A
silent bypass is not a departure.

**Which jobs exist follows from other ADRs, not from the agent's judgement.**
With `forge.integration: queue`, the `test`, `scan` and `audit` stages
also run on `merge_group`. A merge group runs on a temporary branch, not
on the default branch, so rule 1 keeps it from deploying.

| Stage | Exists when | Its form comes from |
| --- | --- | --- |
| `lint` | a tracked file (a `package.json` script, a Makefile target, a `pyproject.toml` section) carries a lint command | that command; the workflow cites the file |
| `test` | the same, for a test command | that command; the failing threshold is `tests.coverage_target` (ADR-0007) |
| `scan` | `vulnerabilities.scanner` is not `none` (ADR-0019), on pull requests and on a schedule | that scanner; the failing threshold is `vulnerabilities.fail_on` (ADR-0019) |
| `audit` | `forge.audit` is not `none` | that tool, on the files under `.github/workflows/` |
| `build` | always | `languages.main.name` (ADR-0004), plus the frontend (ADR-0013) if ruled |
| `image` | `delivery.target: container` (ADR-0012) | the registry in `delivery.registry` |
| `release` | `delivery.release_tool` is neither `manual` nor `none` | that tool (ADR-0012), plus the SBOM when `vulnerabilities.sbom` is not `none` (ADR-0019) |
| `deploy` | `deployment.manifests` is a relative path; one job per entry of `delivery.environments`, in order, each with its own trigger | the manifests in that path |
| propose elsewhere | `deployment.manifests` is a URL; this replaces `deploy` | that address |

An absent stage is a full ruling: an agent that adds a job in these cases
has invented one. A command named only in an agent instructions file does
not create a stage. If `deployment.manifests` is neither a relative path to
an existing directory nor a URL with a scheme, the agent asks and writes
nothing. The table never writes a job's content.

**Ask before writing, once.** None of the following follows from a trait:
the names of the registry and cluster credentials, the namespace or the
platform's service declaration, the apply tool (ontrack-engineering prescribes
none), who reviews a change proposed elsewhere, and the service URL. The
order is: rule ADR-0012, collect these, then write.

**What a deploy job prints.** The staging URL, the deployed commit, and a
dated line naming that commit. On failure, the stage that failed and a link
to the job log, with three known causes: a policy refused the manifest (fix
the manifest, not the policy), a secret is missing (set it, named as
listed), an image is not found (check it was pushed and matches the pin).

Adopted as recommended: `blocking`. The ruleset "main requires checks" is
active on the default branch. It requires the `test`, `node-22`,
`commitlint` and `grype` checks, CodeQL results at `high_or_higher` and a
pull request.

`forge.audit: zizmor` adopted as recommended, on 2026-11-15. The workflows
were cleared of its 18 findings first (trivoallan/ontrack#171). Four kinds
stand, silenced inline with their reason, among them `apply.yml`'s
`pull_request_target`, which the workflow makes safe: nothing of the pull
request is checked out or executed. The `zizmor` job of
`.github/workflows/zizmor.yml` runs it on every pull request, with the
version `mise.toml` pins ([ADR-0025](ADR-0025-tools.md)).

`forge.integration: up-to-date` adopted as recommended, on 2026-11-26: a
user owns this repository, so GitHub offers it no merge queue. Before this
ruling the required status checks were not strict, and `test.yml` on pushes
to `main` was the only trace of a red default branch. The ruleset now makes
them strict. Parallel agent sessions make overlapping pull requests the
normal case here, so the N² runs are the price of a `main` that holds what
a pipeline ran on.

Ruled again on revision 5: `gate` and `audit` are kept; `integration` is
new.

## Consequences

### Positive

- Nothing merges into `main` while a required check is red, and `main`
  holds what a pipeline ran on, even when several agent sessions merge in
  parallel.
- A workflow that loosens a pin, a trigger or a permission fails a pull
  request.
- Dependabot rebases its own pull requests, so `up-to-date` costs it
  nothing by hand.

### Negative

- Every merge sends the other open pull requests back through the
  pipeline: with N in parallel, about N² runs, and each branch must be
  updated before it merges.
- A flaky pipeline blocks everyone.
- Pinning actions by SHA makes updates a chore that Dependabot proposes
  ([ADR-0018](ADR-0018-dependencies.md)).
- The `zizmor` job is not a required check: its failure shows on a pull
  request and does not block.

### Neutral

- The ruleset that makes `blocking` and `up-to-date` real is a GitHub
  setting. The check reads it in CI only.

## Alternatives Considered

### `blocking`

Nothing merges on red. Recommended. The cost is real: an unstable pipeline
blocks people who did nothing wrong.

### `informative`

The pipeline reports, review decides. Less friction, and no guarantee: a red
that is reported gets ignored.

### `none`

No pipeline; review is the only control. Tenable for a repository with no
executable code.

### `forge.integration: queue`

The default branch holds only what a pipeline ran on, and nobody updates
a branch by hand. Recommended wherever GitHub offers it. The cost is a
`merge_group` trigger on every required workflow, and a queue that waits
for its runs before it merges.

### `forge.integration: up-to-date`

The same guarantee, available to every repository. Each merge makes every
other open pull request out of date, so with N pull requests in parallel,
landing all of them costs on the order of N² runs instead of N.

### `forge.integration: none`

The cheapest option, and the default branch can turn red with no pull
request at fault. Tenable when pull requests rarely overlap. The push
workflow at least shows when it happens.

### `forge.audit: none`

Nothing reads the workflows but review. Tenable when no workflow exists,
or when a person writes and reads every one of them.

### actionlint only

It catches a workflow that does not parse or a wrong expression type. It
does not flag a movable tag, `pull_request_target` or a secret in a log
(measured below): it is a linter, not an audit. It is still worth running
before pushing.

### CodeQL's `actions` language

GitHub's code scanning analyses workflows too. Measured on ontrack-engineering's
workflows on 2026-11-15, its 17 queries reported nothing where zizmor found
five issues.

### Honouring the repository's `zizmor.yml`

The usual way to configure zizmor. It lets a file turn an audit off while
the check still passes, which is the silent bypass the rules above forbid.

### A forge other than GitHub

Rule `rejected` and name the forge. The five rules then no longer apply
from here; copy those you keep into your own ADR.

## References

- Suggested skills: `setup` from `actionlint@melodic-software`, to install and wire actionlint.
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how ontrack-engineering ADRs are ruled on.
- [actionlint](https://github.com/rhysd/actionlint) and [act](https://github.com/nektos/act).
- GitHub: [managing a merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue), [rules for rulesets](https://docs.github.com/en/rest/repos/rules), [code scanning and `merge_group`](https://docs.github.com/en/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning/customizing-your-advanced-setup-for-code-scanning). Read on 2026-11-21.
- zizmor: [audits](https://docs.zizmor.sh/audits/), [usage and ignores](https://docs.zizmor.sh/usage/), [configuration](https://docs.zizmor.sh/configuration/), [zizmorcore/zizmor-action](https://github.com/zizmorcore/zizmor-action). Measured with zizmor 1.32.0 on 2026-11-15.

**The key.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `forge.gate` | what a red pipeline prevents | `blocking` (nothing merges on red), `informative` (it reports, review decides), `none` (no pipeline) |
| `forge.audit` | what reads the workflows for what the rules forbid | `zizmor`, another named tool, or `none` |
| `forge.integration` | what is tested before a pull request lands on the default branch | `queue` (a merge queue), `up-to-date` (the branch must contain the default branch's tip), `none` (the pull request's own run only) |

**Testing a workflow before pushing**, in three steps, cheapest first. Install
`actionlint` and `act` as standalone binaries from their GitHub releases,
checked against the checksum file each project publishes, in
`$HOME/.local/bin`, without `sudo`.

| Step | Command | Expect |
| --- | --- | --- |
| 1. the configuration parses | `actionlint` (it finds `.github/workflows` itself) | no error |
| 2. the predicted jobs are there | `act -l` (needs no Docker daemon) | at least the jobs the stage table predicts, and none it excludes |
| 3. they run | `act -P ubuntu-latest=catthehacker/ubuntu:act-latest --env-file /dev/null --secret-file /dev/null --var-file /dev/null` | lint, test and build green; deploy red, since it runs against nothing |

Notes on `act`, measured on 2026-09-20:

- **Always pass `-P`.** Otherwise `act` asks which image to use, and a
  non-interactive run fails with a bare `level=fatal msg=EOF`.
- **Always pass the three empty files.** `act` loads `.env` (printed in
  clear), `.secrets` and `.vars` from the repository root by default.
- **Never pass `-s GITHUB_TOKEN="$(gh auth token)"`.** `act` replaces
  `actions/checkout` with a local copy that needs no token, and the jobs that
  really need the GitHub API cannot be tested locally anyway.
- **`act -l` does not evaluate `if:`.** It lists the static graph, so
  distrust a job it shows.
- On Apple Silicon, add `--container-architecture linux/amd64`. `act -j
  <job>` runs a single job.
- Do not lift these flags to get green.
- **Three greens do not make a working deploy.** Registry access, the apply
  tool, the namespace and admission policies are untouched.

**What the tools do not catch**, measured with actionlint v1.7.12:

- **Not flagged:** a movable action tag (`@v5`), `echo ${{ secrets.X }}`, a
  bare `env`, `curl -u user:pass`, and `pull_request_target`.
- **Flagged:** direct interpolation of `github.event.pull_request.title` in
  `run:`.
- **Flagging is not enforcing:** you run it by hand, and it refuses no merge.

Measured with zizmor 1.32.0, offline, without configuration:

- **Flagged:** a movable action tag, GitHub's own included (`unpinned-uses`),
  `pull_request_target` (`dangerous-triggers`), the pull request title in
  `run:` (`template-injection`), a checkout that keeps its credentials
  (`artipacked`), and `contents: write` at workflow level when the workflow
  has several jobs (`excessive-permissions`).
- **Not flagged:** `echo ${{ secrets.X }}`, a bare `env`, `curl -u
  user:pass`, and workflow-level `contents: write` in a single-job
  workflow. Rule 4 stays with review, as does rule 1.

**Checking rule 1 by hand.** Run
`grep -rn --include='*.yml' --include='*.yaml' 'environment:' .github/workflows/`,
then check that each hit is bound to the default branch through `on:` and
`if:`. This is a floor, not a guarantee:

- It misses a deploy with no `environment:`, a branch condition set
  elsewhere, environment protections and rulesets.
- A job that publishes Pages, for example, is a false positive.

**An empty key is not a value**: both are required. The value is
written in this file and nowhere else; whoever needs it links here. See
ADR-0001 for the check command.

**Revisions.** What changed in the convention at each revision, and what
a repository that already ruled must rule on again.

- Revision 2: a new key, `forge.audit` (`zizmor`, another tool or `none`, recommended `zizmor`), three rules for `zizmor`, and an `audit` stage. Rule on `forge.audit`; nothing else to rule on again.
- Revision 3: a new key, `forge.review` (`peer`, `author` or `agent`, recommended `peer`), which says who can accept a change, and what `author` leaves beside each value of `forge.gate`. Rule on `forge.review`; nothing else to rule on again.
- Revision 4: `forge.review` moves to [ADR-0022](ADR-0022-review-and-merge.md) as `review.by`, with what it leaves beside each value of `forge.gate`. Rule on `review.by` there, then delete `forge.review` from this file: the check fails while it remains.
- Revision 5: a new key, `forge.integration` (`queue`, `up-to-date` or `none`; recommended `queue` when an organization owns the repository, `up-to-date` otherwise), and what each value fixes. Rule on `forge.integration`; nothing else to rule on again.
