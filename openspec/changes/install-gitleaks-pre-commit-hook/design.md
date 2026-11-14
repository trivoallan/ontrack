# Design

## Context

See proposal.md for motivation. Git hooks are not versioned: something has to
install them on each clone. The repository has no hook manager, and its
`package.json` is also what consumers install from git, so anything put in an
npm lifecycle script runs on their machines too. Work also happens in git
worktrees (`.claude/worktrees/`).

## Goals / Non-Goals

**Goals:**
- One committed hook, enabled with one command per clone.
- A missing gitleaks binary blocks the commit instead of silently skipping
  the scan.

**Non-Goals:**
- Server-side enforcement: GitHub push protection is already enabled.
- Scanning history or running gitleaks in CI.
- Setting up direnv or the keychain (`secrets.storage`): ontrack handles no
  secret yet.

## Decisions

**A plain script in `.githooks/`, enabled with `core.hooksPath`.** A relative
`core.hooksPath` resolves from the working tree root, so the same setting
works in the main checkout and in every worktree. Alternatives: `husky` (one
more dev dependency to do what one git setting does); the `pre-commit`
framework (brings Python into a Node repository).

**Enabling the hook is a documented command, not an npm `prepare` script.**
npm runs `prepare` when a package is installed from git, which is how ontrack
is installed: a `git config` there would run in every consumer's install.
The cost is that a contributor can forget the command; ADR-0015 already
accepts that the hook is installed per clone.

**The hook fails when `gitleaks` is not on `PATH`**, with a message naming
the install command (`brew install gitleaks`). A hook that skips quietly
would look like a passing scan.

## Risks / Trade-offs

- [A clone without the setting commits unscanned] → README step; push
  protection remains the backstop.
- [`git commit --no-verify` skips the hook] → known and accepted in ADR-0015.
- [`core.hooksPath` hides hooks already in `.git/hooks`] → none exist in this
  repository today.
