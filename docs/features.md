---
title: Features
description: What ontrack can do, ordered by what you want to do, each with the page that specifies it.
---

ontrack rests on one chain, and the sections below follow it:

1. A **convention** is written once, in a track, and proposed to every
   repository with the values it recommends. It is not imposed.
2. Each repository **rules** on the convention: it follows the
   recommendation, departs from it, or rejects it.
3. Its rulings become the **instructions** coding agents read.

[Concepts](concepts.md) explains each word. This page lists what ontrack
does at each step, and links every line to the page that specifies it:
nothing is specified here.

To see most of it at work in one repository, follow the
[tutorial](tutorial.mdx).

## Share conventions

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Propose the same convention to every repository | A track: an npm package of ADRs, each a convention with recommended values | [A track](concepts.md#a-track) |
| Bring the conventions into a repository | `ontrack apply` copies them, byte for byte, under `docs/adr/` | [`ontrack apply`](commands.md#ontrack-apply) |
| Follow several tracks at once | One folder per track, named after the alias it is installed under | [Several tracks](how-it-works.md#several-tracks) |
| Rename a track without losing a ruling | `apply` moves the folder as a whole; its files are unchanged | [`ontrack apply`](commands.md#ontrack-apply) |
| Drop a convention the track no longer ships | `apply --prune` | [`ontrack apply`](commands.md#ontrack-apply) |
| Use a track someone else wrote | A search on the npm registry | [Find a track](find-a-track.md) |
| Write your own | A `package.json` with an `ontrack` key and a directory of ADRs | [Write your own track](write-your-own-track.md) |

## Rule on each convention

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Let a coding agent propose the ruling | `ontrack review` prints the prompt; the agent proposes, and writes only once you agree | [`ontrack review`](commands.md#ontrack-review-adr) |
| Start from what the repository already does | Each proposed value is marked observed or absent, with its evidence | [`ontrack review`](commands.md#review-prompt-contract) |
| Depart from the recommendation | The ADR is yours to edit while it is `proposed`, and records why | [A ruling](concepts.md#a-ruling) |
| Say a convention does not apply here | `rejected`, a full ruling | [A ruling](concepts.md#a-ruling) |
| Change a ruling you already made | A new ADR that supersedes the first | [`ontrack review`](commands.md#ontrack-review-adr) |
| Record the decisions the repository took without a track | `ontrack suggest` prints the prompt; the agent proposes at most five, with their evidence, and writes only those you agree to | [`ontrack suggest`](commands.md#ontrack-suggest) |

## Brief your agents

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Have coding agents follow your rulings | One marked block in `AGENTS.md`, written by `apply` | [The instructions block](file-formats.md#the-instructions-block-in-agentsmd) |
| Use any coding agent that reads `AGENTS.md` | Nothing to install in the agent: the block is plain Markdown in the file it already reads | [The instructions block](file-formats.md#the-instructions-block-in-agentsmd) |
| See the block before it is written | `ontrack instructions` | [`ontrack instructions`](commands.md#ontrack-instructions) |
| Know when Claude Code would not read it | A warning while a `CLAUDE.md` exists without importing `AGENTS.md` | [The instructions block](file-formats.md#the-instructions-block-in-agentsmd) |

## Keep the repository true to its rulings

A ruling can be ahead of the repository, or the repository can move away
from it later. ontrack looks at both moments.

### When you rule: a compliance backlog

Once a review is ruled, the agent lists the rulings the code, configuration
or tooling does not match, and proposes one issue for each. It creates only
the ones you agree to, in the tracker the repository named when it ruled on
the convention on [work tracking](adr/engineering/ADR-0014-work-tracking.md).

The repository of ontrack ruled `fail_on: critical` on the convention on
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
- A repository that ruled `none` on work tracking gets the list in the
  agent's reply, and no issue.

The [`review` prompt contract](commands.md#review-prompt-contract) specifies
this step.

### From then on: a check

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Verify the repository still follows a decision | `ontrack check` runs the command the ADR names | [`ontrack check`](commands.md#ontrack-check) |
| Use the check a track ships with its convention | `apply` writes the track's `check:` line into your copy | [`ontrack apply`](commands.md#ontrack-apply) |
| Fail a build that breaks a decision | A job to copy | [Run ontrack in CI](run-ontrack-in-ci.md#2-fail-when-the-work-breaks-a-decision) |

## Know when a convention changes

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Learn that a convention you ruled on was revised | `ontrack plan` names each revised ADR and exits with `2` | [`ontrack plan`](commands.md#ontrack-plan) |
| See every ADR with your status | `plan --all` | [`ontrack plan`](commands.md#ontrack-plan) |
| Be told when the track itself has moved | A weekly job to copy, which updates the installed track | [Run ontrack in CI](run-ontrack-in-ci.md#3-notice-when-the-track-has-moved) |
| Fail a build that is behind its track | A job to copy | [Run ontrack in CI](run-ontrack-in-ci.md#1-fail-when-the-repository-is-behind-its-track) |
| Rule again on a revised convention | The steps, in the track and in each repository | [Revise a convention](revise-a-convention.md) |

## Automate it

| You want to | ontrack gives you | Specified in |
| --- | --- | --- |
| Read a result without parsing output | One exit-code scheme for every command | [Exit codes](commands.md#exit-codes) |
| Run all of it on GitHub Actions | Three jobs to copy | [Run ontrack in CI](run-ontrack-in-ci.md) |
| Draft a change proposal from an issue | A label on the issue starts a workflow you call | [Draft a change from a labelled issue](draft-a-change-from-an-issue.md) |

## No lock-in

- **Your rulings.** ontrack never rewrites an ADR a repository has decided
  on. When the convention changes, a person rules again.
- **Your history.** Only `apply` writes, and it never commits.
- **Your linters.** ontrack judges nothing itself: `check` runs the command
  an ADR names.
- **Your network.** No server and no account. `plan`, `instructions` and
  `review` make no network call.
- **Your way out.** The ADRs, the track and the instructions block are a Markdown
  file, an npm dependency and a block in `AGENTS.md`. They remain if you
  stop using ontrack.

[What ontrack guarantees](how-it-works.md#what-ontrack-guarantees) says the
same of its commands.
