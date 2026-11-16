---
title: Features
description: What ontrack can do, ordered by what you want to do, each with the page that specifies it.
---

ontrack rests on one chain, and the sections below follow it:

1. A **convention** is written once, as a **question** with a recommended
   answer: "which commit scopes?", not "use these scopes".
2. Each repository **rules** on the question: it follows the
   recommendation, departs from it, or rejects it. The ruling is its answer.
3. The answers become the **rules** coding agents read.

[Concepts](concepts.md) explains each word. This page lists what ontrack
does at each step, and links every line to the page that specifies it:
nothing is specified here.

To see most of it at work in one repository, follow the
[tutorial](tutorial.mdx).

## Share conventions as questions

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Ask every repository the same question | A track: an npm package of ADRs, each a question with a recommended answer | [A track](concepts.md#a-track) |
| Bring the questions into a repository | `ontrack apply` copies them, byte for byte, under `docs/adr/` | [`ontrack apply`](commands.md#ontrack-apply) |
| Follow several tracks at once | One folder per track, named after the alias it is installed under | [Several tracks](how-it-works.md#several-tracks) |
| Rename a track without losing a ruling | `apply` moves the folder as a whole; its files are unchanged | [`ontrack apply`](commands.md#ontrack-apply) |
| Drop a question the track no longer ships | `apply --prune` | [`ontrack apply`](commands.md#ontrack-apply) |
| Use a track someone else wrote | A search on the npm registry | [Find a track](find-a-track.md) |
| Write your own | A `package.json` with an `ontrack` key and a directory of ADRs | [Write your own track](write-your-own-track.md) |

## Rule on each question

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Let a coding agent propose the answer | `ontrack review` prints the prompt; the agent proposes, and writes only once you agree | [`ontrack review`](commands.md#ontrack-review-adr) |
| Start from what the repository already does | Each proposed value is marked observed or absent, with its evidence | [`ontrack review`](commands.md#review-prompt-contract) |
| Depart from the recommendation | The ADR is yours to edit while it is `proposed`, and records why | [A ruling](concepts.md#a-ruling) |
| Say a question does not apply here | `rejected`, a full answer | [A ruling](concepts.md#a-ruling) |
| Change an answer you already gave | A new ADR that supersedes the first | [`ontrack review`](commands.md#ontrack-review-adr) |

## Load the answers into the agent's harness

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Have coding agents follow the answers | One marked block in `AGENTS.md`, written by `apply` | [The rules block](file-formats.md#the-rules-block-in-agentsmd) |
| See the block before it is written | `ontrack instructions` | [`ontrack instructions`](commands.md#ontrack-instructions) |
| Know when Claude Code would not read it | A warning while a `CLAUDE.md` exists without importing `AGENTS.md` | [The rules block](file-formats.md#the-rules-block-in-agentsmd) |

## Turn gaps into a compliance backlog

An answer can be ahead of the repository. Once a review is ruled, the agent
lists the rulings the code, configuration or tooling does not match, and
proposes one issue for each. It creates only the ones you agree to, in the
tracker the repository named when it answered the question on
[work tracking](adr/engineering/ADR-0014-work-tracking.md).

The repository of ontrack answered `fail_on: critical` to the question on
vulnerabilities. The scan ran, but nothing required it. This is the issue
the agent proposed:

```
[engineering/ADR-0019] vulnerabilities.fail_on: require the grype check

`fail_on` is "the lowest severity of a fixable vulnerability that fails the
required check". The `grype` job in `.github/workflows/scan.yml` fails on a
fixable critical, but the ruleset "main requires test" requires only test,
node-22 and commitlint, so a red `grype` does not stop a merge.

Done when `grype` is a required status check in the default-branch ruleset.
```

[The issue](https://github.com/trivoallan/ontrack/issues/193) was closed the
same day, by a change to the ruleset. No linter would have found it: the gap
was in the repository's settings, not in its code.

- Each issue carries the label `ontrack` and starts with the ruling it
  serves, so the next review proposes nothing for a ruling already tracked.
- A repository that answered `none` on work tracking gets the list in the
  agent's reply, and no issue.

The [`review` prompt contract](commands.md#review-prompt-contract) specifies
this step.

## Detect drift

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Learn that a question changed | `ontrack plan` names each revised ADR and exits with `2` | [`ontrack plan`](commands.md#ontrack-plan) |
| See every ADR with your verdict | `plan --all` | [`ontrack plan`](commands.md#ontrack-plan) |
| Verify the repository still follows a decision | `ontrack check` runs the command the ADR names | [`ontrack check`](commands.md#ontrack-check) |
| Read a result without parsing output | One exit-code scheme for every command | [Exit codes](commands.md#exit-codes) |
| Answer a revised question again | The steps, in the track and in each repository | [Revise a question](revise-a-question.md) |

## Automate it

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Fail a build that is behind its track, or breaks a decision | Two jobs to copy | [Run ontrack in CI](run-ontrack-in-ci.md) |
| Be told when the track itself has moved | A weekly job to copy | [Run ontrack in CI](run-ontrack-in-ci.md#3-notice-when-the-track-has-moved) |
| Draft a change proposal from an issue | A label on the issue starts a workflow you call | [Draft a change from a labelled issue](draft-a-change-from-an-issue.md) |

## No lock-in

- **Your answers.** ontrack never rewrites an ADR a repository has decided
  on. When the question changes, a person rules again.
- **Your history.** Only `apply` writes, and it never commits.
- **Your linters.** ontrack judges nothing itself: `check` runs the command
  an ADR names.
- **Your network.** No server and no account. `plan`, `instructions` and
  `review` make no network call.
- **Your way out.** The ADRs, the track and the rules block are a Markdown
  file, an npm dependency and a block in `AGENTS.md`. They remain if you
  stop using ontrack.

[What ontrack guarantees](how-it-works.md#what-ontrack-guarantees) says the
same of its commands.
