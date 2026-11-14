---
adr: ADR-0012
slug: delivery
title: Delivery
status: proposed
revision: 1
date:
authors: []
supersedes: []
traits:
  delivery:
    target:
    environments:
    release_tool:
    registry:
  deployment:
    manifests:
---

# Delivery

## Status

Proposed

> **What is this file?** A question governance asks your repository, with
> the answer it recommends. While it says `status: proposed`, you may edit
> it freely. `revision:` dates the question, not the file: you do not fill
> it, and it only moves when the question changes. `rejected` is a full
> answer: when the question does not apply here, rule `rejected`, remove
> the whole `traits:` block, and say what stands in for it.
> [ADR-0001](ADR-0001-record-architecture-decisions.md) explains the
> mechanics.

## Context

While these keys are empty, an agent finishing a change does not know
whether merging puts it in front of users or only onto the default branch,
nor what produces a version. Of all the questions governance asks, this is
the one where a wrong guess reaches people outside the repository.

**Releasing and deploying are two acts.** Releasing makes a named version
with its changelog (`delivery.release_tool`). Deploying puts something in
service (each environment's trigger). A repository can do one without the
other: a library releases and never deploys; a service can deploy every
merge without naming versions.

**Semantic versioning is not a question here**: `feat` gives a minor
version, `fix` and `perf` a patch, a breaking change a major. The commit
format is [ADR-0006](ADR-0006-commits.md). Calendar versioning would be a
departure, declared in your own ADR.

## Decision

**What governance recommends, and why.**

| Key | Recommended value | Reason |
| --- | --- | --- |
| `delivery.target` | *no recommendation* | it describes what this repository ships, which governance cannot know. It is the trait that changes most what an agent writes: an image job, platform configuration, a publish job, or nothing |
| `delivery.environments` | staging on `merge`, production on `tag` | staging should mirror the default branch with no extra step; production runs a named version, so a rollback has a target. **The list itself is asked, never guessed** |
| `delivery.release_tool` | `release-please` | governance assumes GitHub, and it is the most widely used tool there that turns Conventional Commits into a version, a changelog and a release pull request |
| `delivery.registry` | *a form, not a value*: an address such as `ghcr.io/<owner>` | needed as soon as `delivery.target` is `container`; GitHub's registry needs no other account |
| `deployment.manifests` | *a form, not a value*: a relative path or a URL | the form decides the pipeline (below), and only this repository knows where its manifests live |

**`delivery.target` says what leaves the repository.**

- **`container`:** an image is built and pushed to `delivery.registry`, and
  manifests describe how it runs (Kubernetes or another orchestrator).
- **`platform`:** a platform builds and runs the code itself (Vercel,
  Netlify, Fly.io, Render, Cloudflare Pages…). The agent writes the
  platform's declaration, not manifests, and there is no image job.
- **`package`:** the repository publishes a package (npm, PyPI…). Its one
  environment is the registry it publishes to, triggered on `tag`.
- **`none`:** nothing is deployed.

The trait exists because `deployment.manifests: none` alone cannot tell
"deploys without manifests" from "deploys nothing".

**The form of `deployment.manifests` decides the pipeline**
([ADR-0011](ADR-0011-forge-and-ci.md)):

- **A relative path:** the manifests are here, and the pipeline applies
  them, with one deploy job per environment.
- **A URL:** the manifests live in another repository. The pipeline
  proposes a change there and has no deploy job here; merging over there is
  the deployment (GitOps).
- **`none`:** nothing is applied.

Write URLs with their scheme (`https://`, `ssh://`, or `git@host:path`).
Without one, `forge.example.test/group/repo` is a valid relative path. If the
value is neither form, or is a relative path to a directory that does not
exist, the agent stops and asks, writing nothing. With a URL, an
environment's trigger describes what triggers the *proposal*, not the
deployment. Keeping manifest sources here and pushing rendered output
elsewhere is not covered: declare it in your own ADR.

**`manual` is not `none`.** `manual` means versions are made by hand (number,
changelog, tag). `none` means there are no versions at all. A repository
that publishes a package answers `manual`, never `none`. A tool that does
only half the job (publishes without a changelog) still counts: say
"changelog by hand" under Consequences.

**Once a pipeline file exists**, the last task of any change checks that it
passes on the pull request, even when there is no deploy job.

Everything below disappears when you rule, from this sentence up to the
Consequences heading, which stays.

**How to rule: five steps, all in this file.** Read all of them before
doing any, because the last one deletes the other four, and do them in one
commit.

1. **Write the value of each key** under `traits:` in the frontmatter, or,
   if you rule `rejected`, **remove the whole `traits:` block**.
2. **Change `status:`** from `proposed` to `accepted` or `rejected`.
3. **Fill `date:` and `authors:`**: `date:` as `YYYY-MM-DD`, the day you
   rule; `authors:`, the names of the people who decided, without email
   addresses.
4. **Rewrite the Positive, Negative and Neutral lists under Consequences**
   for your verdict: what it makes easier, and what it costs.
5. **Last, delete this block**, from its first sentence up to the
   Consequences heading, which stays. In its place, write the reason for
   your decision wherever you depart from the recommendation, or, if you
   adopt it as is, one line that says so.

The first step is the one people forget: a decision written only in prose
leaves an agent guessing. This is what the frontmatter looks like once
filled, and it is the one part of the file an agent reads without
interpreting it:

```yaml
---
adr: ADR-0012
slug: delivery
title: Delivery
status: accepted
revision: 1
date: 2026-11-14
authors: [Your Name]
supersedes: []
traits:
  delivery:
    target: container
    environments:
      - { name: staging, trigger: merge }
      - { name: production, trigger: tag }
    release_tool: release-please
    registry: ghcr.io/your-name
  deployment:
    manifests: https://github.com/your-name/your-app-manifests
---
```

The Alternatives Considered below were weighed by governance without
knowing your context. Weighing them against yours is still to do, and it is
what makes a decision different from an accepted default.

## Consequences

### Positive

- An agent knows what a merge puts in service and what makes a version,
  without asking at every change.
- Production runs named versions, so a rollback has a target and a
  changelog.
- The pipeline's jobs follow from these keys (ADR-0011), so they are not
  invented.

### Negative

- Deploying production on `tag` adds a step after every merge that should
  ship.
- `release-please` ties version history to commit messages: a badly typed
  merge message produces a wrong version (see ADR-0006 on `commitlint`).

### Neutral

- When the repository does not deploy itself (`platform` with the
  platform's own Git integration, or GitOps elsewhere), what happens after
  the merge is outside this repository and is not checked here.

## Alternatives Considered

### Deploy on tag

What runs has a name. One more step, and a rollback has a target.

### Deploy on merge

The merge is enough, and the delay is minimal. What runs becomes a SHA
nobody remembers, and a rollback has no obvious target.

### Deploy by hand

Someone decides and runs it. Honest for a repository that ships rarely; the
cost is that the act is written nowhere.

### `releaser-pleaser`

surdesrails' recommendation, because it covers GitHub and GitLab alike, and
it is proven on GitHub Actions. governance assumes GitHub only, where
`release-please` is the more widely used choice. A repository already on
`releaser-pleaser` has no reason to migrate.

## References

- Adapted from surdesrails [SDR-0011](https://github.com/trivoallan/surdesrails/blob/main/resources/docs/adr/SDR-0011-delivery.md), revision 1 (its internal hosting-offer trait `hosting.offer` replaced by `delivery.target`; recommends `release-please` instead of `releaser-pleaser`).
- [ADR-0001](ADR-0001-record-architecture-decisions.md): how governance ADRs are ruled on.
- [release-please](https://github.com/googleapis/release-please) and [Semantic Versioning](https://semver.org/).

**The keys.**

| Key | What it holds | Allowed values |
| --- | --- | --- |
| `delivery.target` | what leaves the repository | `container`, `platform`, `package`, `none` |
| `delivery.environments` | the environments a version goes through, in order, each with its trigger | a list of `{ name, trigger }`, `trigger` being `tag`, `merge` or `manual`; `[]` for a repository that deploys nothing |
| `delivery.release_tool` | what makes a version and its changelog | `release-please`, `releaser-pleaser`, another tool, `manual` or `none` |
| `delivery.registry` | where images are pushed | an address, or `none` |
| `deployment.manifests` | where the deployment manifests live | a relative path, a URL with a scheme, or `none` |

**`delivery.registry` sits under `delivery`** because pushing an image builds
an artifact; it puts nothing in service. A registry is not an environment.

**What the check does not see.** It refuses an empty key and an unknown
`delivery.target`. It does not check a `trigger` value inside
`delivery.environments`, and it cannot tell a path from a URL in
`deployment.manifests`: review does.

**`rejected` means nothing leaves the repository**: no service, no package,
no image, as in a documentation, schema or configuration repository. It is
not the same as deploying by hand, which is `manual`.

**All five keys are required**: an empty key is not an answer. This file
decides when, where and what is delivered; the rules a pipeline follows are
ADR-0011's. The value is written in this file and nowhere else; whoever
needs it links here. See ADR-0001 for the check command.
