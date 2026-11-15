---
title: The ontrack-engineering track
description: The reference track ontrack is built with, what a repository gets from it, how to install it, and its questions as a repository receives them.
---

[`@trivoallan/ontrack-engineering`](https://www.npmjs.com/package/@trivoallan/ontrack-engineering)
is the reference track: 26 questions on how a Python or TypeScript
repository on GitHub is engineered, each with the answer it recommends.
ontrack is built with it, and answers every one of its questions in
[its own decisions](adr/trivoallan/ADR-0001-record-architecture-decisions.md).

## What you get

| Domain | What you gain | What `ontrack-engineering-check` verifies |
| --- | --- | --- |
| **Agents** (0017, 0022, 0026) | The rules you accepted, written into a managed block of `AGENTS.md`, which Claude Code, opencode and Copilot CLI read on every session; plugins pinned; the agent opens the pull request and never approves one; a person merges it, or approves it so the agent can; if you choose, the agent acts under its own GitHub identity | each declared host's settings exist and deny `gh pr review`, and `gh pr merge` when a maintainer merges; in CI, the default branch's ruleset matches `review.approvals` |
| **Architecture** (0003, 0010) | A hexagonal core by default, where the domain depends on no I/O; the architecture documented in arc42's twelve sections, with C4 diagrams generated from a LikeC4 model kept as code | the twelve arc42 section files; the LikeC4 model files, if you chose them |
| **Code** (0004, 0005, 0007, 0013, 0024) | Validation at every boundary (`zod` or `pydantic`), a test coverage target you set, and your code scanned by CodeQL, its alerts blocking from `high` | a scan workflow sends its results to code scanning |
| **Decisions and docs** (0001, 0002, 0008) | Decisions kept as ADRs, docs in one language under one root | each ruled ADR carries its verdict; the docs tool and root exist |
| **Delivery** (0011, 0012, 0023) | A pipeline designed once, with a blocking gate and releases cut from tags, that zizmor audits; a licence others can reuse the code under | a workflow exists; zizmor finds nothing it forbids; release-please runs; the manifest declares the ruled licence and a licence file is committed |
| **Supply chain** (0015, 0018, 0019, 0020, 0021, 0025) | gitleaks before every commit, dependencies admitted by a person with install scripts ignored, a CycloneDX SBOM scanned by Grype, SLSA Build Level 2 provenance, and the tools outside npm pinned in one place | gitleaks finds no secret; Dependabot and its automerge are configured; the publishing workflow emits provenance; mise pins the tools your answers name |
| **Workflow** (0006, 0009, 0014, 0016) | One convention for commits and branch names, refused at the gate instead of argued in review | the commits pass commitlint; the branch name has an accepted prefix; OpenSpec uses the schema you chose |

A check confirms the wiring is there, not that it is right. Reject any
question that does not fit your repository: a rejection is a full answer.

## Install it

```bash
npm i -D trivoallan@npm:@trivoallan/ontrack-engineering
npm audit signatures
npx ontrack plan
```

The alias, `trivoallan`, is the namespace: the questions land in
`docs/adr/trivoallan/`. The [tutorial](tutorial.md) goes on from `plan`.

## Its questions

The site lists below the questions of the release ontrack depends on, as a
repository receives them: `proposed`, their traits empty, the recommended
answer in each body. They are also in
[the track's repository](https://github.com/trivoallan/ontrack-engineering/tree/main/adr).
