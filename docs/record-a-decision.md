---
title: Record a decision
description: Have a coding agent record a decision you take now as an ADR of your repository, with traits that reach AGENTS.md and a check that verifies it.
---

This guide shows how to record a decision you take now, such as "we use
pnpm from now on" or "every endpoint is versioned under `/v1`". An agent
writes it as an ADR in `docs/adr/local/`, and its traits reach `AGENTS.md`,
so the next agent follows it.

It needs a version of ontrack later than 0.6.0, and a coding agent that
takes a prompt. The examples use Claude Code.

## Pick the command

| To | Run |
| --- | --- |
| Record a decision you take now | `npx ontrack decide` |
| Find the decisions the repository took and never recorded, once, at adoption | `npx ontrack suggest`, see [Record the decisions you never wrote down](record-the-decisions-you-never-wrote-down.md) |
| Change a decision already recorded | `npx ontrack review <its reference>` |

## 1. Ask the agent

Ask for the decision in your own words:

```bash
claude "Record the decision: we use pnpm from now on, not npm."
```

The instructions block of `AGENTS.md` tells the agent to run
`npx ontrack decide` and follow its prompt, so you do not need to name the
command. Until `apply` has written that block, or with an agent that does
not read `AGENTS.md`, start from the prompt itself and give the decision
when the agent asks:

```bash
claude "$(npx ontrack decide)"
```

`decide` prints the prompt and exits with `2`: there is always a prompt to
follow. It writes nothing itself. It gives the agent the ADRs the repository
holds and those its tracks would import, and the agent reads the rest.

## 2. Read the proposal

The agent first checks that the decision is new:

- when an `accepted` ADR already decides it, the agent stops and proposes
  `npx ontrack review <its reference>`, to supersede that ADR instead of
  writing a second one;
- when the ADR that decides it is still `proposed`, or among those to
  import, the agent stops: `npx ontrack review` rules it.

Otherwise it starts from what the repository does today, then presents
the ADR it would write. For example:

```
We use pnpm
  → docs/adr/local/ADR-0031-we-use-pnpm.md
  Decision: dependencies are installed and scripts run with pnpm.
  Rules out: npm or Yarn.
  Traits:
    package_manager:
      tool: pnpm
  Check: test -f pnpm-lock.yaml && test ! -f package-lock.json
  Evidence: package-lock.json is present today; the switch is new.
```

Before you agree, check three things:

- **Is there an alternative?** If nobody would ever do otherwise, the ADR
  protects nothing. The agent says so and stops.
- **Do the traits say it?** Only the traits reach `AGENTS.md`. They sit
  under a top-level key that no ADR in force uses. A decision with no
  traits is recorded, but no agent reads it.
- **Does the check verify it?** It exits with `0` when the repository
  follows the decision, and `npx ontrack check` runs it from now on.

## 3. Agree, or not

The agent writes nothing until you answer. You can agree, ask for a
change to the title, a trait or the check, or drop it.

Once you agree, the agent writes the ADR in `docs/adr/local/`:

- its status is `accepted` and its `supersedes:` is empty;
- its number follows the highest number ever used in that directory,
  deleted ADRs included, so a number is never reused;
- its format is the one your repository's rules on recording decisions
  prescribe.

Then it runs `npx ontrack apply`, which adds its traits to `AGENTS.md`.

## 4. Check, then commit

```bash
npx ontrack plan
npx ontrack check
```

`plan` exits with `0` once `AGENTS.md` is up to date. `check` runs the new
ADR's check with the others. When the decision is ahead of the repository,
the check fails until the change that applies it lands: commit the ADR with
that change, or right before it.

## Related

- [`ontrack decide`](commands.md#ontrack-decide) gives the full prompt and its contract.
- [How it works](how-it-works.md#the-decisions-no-track-ships) says where these decisions fit in the life of a repository.
