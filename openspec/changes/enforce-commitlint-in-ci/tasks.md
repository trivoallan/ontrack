# Tasks

## 1. Configuration

- [x] 1.1 Add `@commitlint/cli` and `@commitlint/config-conventional` as dev dependencies; verify `npm ci` succeeds and `npx commitlint --version` prints a version on Node 24 and on Node 20.19
- [x] 1.2 Add `commitlint.config.mjs` extending `@commitlint/config-conventional` with `scope-enum` set to ADR-0006's nine scopes and a comment naming the ADR; verify `echo 'feat(plan): x' | npx commitlint` and `echo 'chore: x' | npx commitlint` pass, and `echo 'feat(nope): x' | npx commitlint` and `echo 'feature: x' | npx commitlint` fail
- [x] 1.3 Verify the existing history passes: `git log --format=%s origin/main | sed 's/ (#[0-9]*)$//' | while read -r s; do printf '%s' "$s" | npx commitlint || echo "FAIL: $s"; done` prints no `FAIL`; if one does, report it rather than loosening a rule silently

## 2. CI

- [x] 2.1 Add `.github/workflows/commitlint.yml`: job `commitlint` on `pull_request` (`opened`, `edited`, `reopened`, `synchronize`), `permissions: contents: read`, actions pinned by SHA with the tag in a comment, title passed through `env:`; verify `grep -n 'pull_request.title' .github/workflows/commitlint.yml` only matches inside an `env:` block
- [ ] 2.2 Open the pull request with a valid title and verify the `commitlint` check passes; edit the title to `feat(nope): x`, verify the check re-runs and fails, then restore the title

## 3. Gate

- [ ] 3.1 With the maintainer's go-ahead, add `commitlint` to the required status checks of ruleset `27253716` (other fields unchanged); verify `gh api repos/trivoallan/ontrack/rulesets/27253716 --jq '.rules[].parameters.required_status_checks[].context'` lists it
- [ ] 3.2 Verify `npm pack --dry-run` lists no commitlint file and `npm test` still passes
