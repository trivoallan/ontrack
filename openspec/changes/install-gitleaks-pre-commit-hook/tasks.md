# Tasks

## 1. Hook

- [x] 1.1 Add an executable `.githooks/pre-commit` (POSIX `sh`) that exits non-zero with an install hint when `gitleaks` is not on `PATH`, and otherwise runs `gitleaks git --pre-commit --staged --redact`; verify `git ls-files -s .githooks/pre-commit` shows mode `100755`
- [ ] 1.2 Enable it locally with `git config core.hooksPath .githooks`; verify that staging a file holding a fake key in a known format (for instance a generated `-----BEGIN RSA PRIVATE KEY-----` block) makes `git commit` fail with a redacted finding, then unstage and delete the file
- [ ] 1.3 Verify a clean commit passes, and that with `gitleaks` removed from `PATH` (`PATH=/usr/bin:/bin git commit`) the commit is refused with the install hint

## 2. Documentation

- [x] 2.1 Add to the README's development section the gitleaks install command and `git config core.hooksPath .githooks`, with one sentence on why (ADR-0015); verify the two commands, run on a fresh clone, reproduce 1.2

## 3. Verify

- [ ] 3.1 Verify `npm pack --dry-run` does not list `.githooks/`, and that the pull request's checks pass
