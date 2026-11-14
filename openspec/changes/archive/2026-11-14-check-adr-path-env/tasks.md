# Tasks

## 1. Behaviour

- [x] 1.1 In `runChecks`, run each command with the caller's environment plus `ONTRACK_ADR` set to the ADR's path (the value of the `rule:` line); verify a test whose check is `test "$ONTRACK_ADR" = docs/adr/trivoallan/ADR-0006-commits.md` passes
- [x] 1.2 Verify with a test that two ADRs each see their own path, and that a variable of the caller's environment still reaches the command

## 2. Contract

- [x] 2.1 Document the variable in the README's `ontrack check` contract (the bullet on how commands run); verify the README example is unchanged and its byte-for-byte test still passes

## 3. Verify

- [x] 3.1 Run `npm test`, `npm run typecheck` and `npm run build`; verify all pass and coverage holds at 95 %
- [x] 3.2 Verify the pull request's checks pass
