# Tasks

## 1. Pin the actions

- [x] 1.1 Resolve the commit SHA behind `actions/checkout@v7` and `actions/setup-node@v7` (`gh api repos/actions/checkout/commits/v7 --jq .sha`, same for `setup-node`) and note the exact release tag each SHA carries; verify each SHA is 40 hexadecimal characters
- [x] 1.2 Replace the four `uses:` lines of `.github/workflows/test.yml` with `owner/repo@<sha> # <tag>`; verify `grep -En 'uses: .*@v[0-9]' .github/workflows/` prints nothing

## 2. Keep the pins current

- [ ] 2.1 Add `.github/dependabot.yml` with one `github-actions` entry (directory `/`, weekly, `commit-message.prefix: chore`); verify the file is accepted under the repository's Insights → Dependency graph → Dependabot tab after the push

## 3. Verify

- [ ] 3.1 Open the pull request and verify the `test` and `node-20` checks both pass with the pinned actions
