# Tasks

## 1. Ruleset

- [x] 1.0 Read the job names in `.github/workflows/test.yml`; if the lowest-version job is no longer `node-20` (renamed `node-22` by `migrate-to-typescript`), use that name wherever the tasks below say `node-20`; verify the name used matches a check reported on the latest pull request
- [x] 1.1 Read the current ruleset (`gh api repos/trivoallan/ontrack/rulesets/27253716`) and keep its JSON as the rollback copy; verify its only required check is `test` with `integration_id` 15368
- [x] 1.2 With the maintainer's go-ahead, `PUT` the same ruleset with `node-20` (same `integration_id`) added to `required_status_checks`, every other field unchanged; verify `gh api repos/trivoallan/ontrack/rulesets/27253716 --jq '.rules[].parameters.required_status_checks[].context'` prints `test` and `node-20`

## 2. Record

- [x] 2.1 Update the "Adopted as recommended" sentence of `docs/adr/trivoallan/ADR-0011-forge-and-ci.md` to name both required checks; verify `ontrack plan` still reports the ADR as up to date

## 3. Verify

- [ ] 3.1 On the pull request carrying 2.1, verify the merge box lists both `test` and `node-20` as required
