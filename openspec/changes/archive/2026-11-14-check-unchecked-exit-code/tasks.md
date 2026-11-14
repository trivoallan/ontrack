# Tasks

## 1. Behaviour

- [x] 1.1 In `runChecks`, report a command that exits with `78` as `unchecked`, with no output lines; verify a test with `check: exit 78` gets an `unchecked` line, no `rule:` line, and exit code `0`
- [x] 1.2 Verify with a test that the output of such a command is not printed (`check: echo nothing to check; exit 78`), and that it counts in the last line as unchecked, not passed

## 2. Contract

- [x] 2.1 Document the code in the README's `ontrack check` contract (the status bullet); verify the README example is unchanged and its byte-for-byte test still passes

## 3. Verify

- [x] 3.1 Run `npm test`, `npm run typecheck` and `npm run build`; verify all pass and coverage holds at 95 %
- [x] 3.2 Verify the pull request's checks pass
