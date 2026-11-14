# Tasks

## 1. Configuration

- [ ] 1.1 Add `release-please-config.json` (`release-type: node`, `include-component-in-tag: false`, `bump-minor-pre-major: true`, `pull-request-title-pattern: "chore: release ${version}"`, `extra-files: ["README.md"]`) and `.release-please-manifest.json` (`{ ".": "0.1.0" }`); verify both parse with `node -e "JSON.parse(require('fs').readFileSync(process.argv[1]))" <file>`
- [ ] 1.2 Add `.github/workflows/release.yml`: on `push` to `main`, `permissions: contents: write, pull-requests: write`, `googleapis/release-please-action` pinned by SHA with its tag in a comment, `token: ${{ secrets.RELEASE_PLEASE_TOKEN }}`; verify `grep -En 'uses: .*@v[0-9]' .github/workflows/release.yml` prints nothing

## 2. README

- [ ] 2.1 Change the install command to `npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git#v0.1.0` wrapped in `<!-- x-release-please-start-version -->` / `<!-- x-release-please-end -->` comments, and add a sentence pointing to the releases page (the updater needs a version to rewrite; `v0.1.0` is never tagged, so the README is only correct once 4.3 is done: do sections 3 and 4 right after merging); verify the comments are invisible in GitHub's rendering of the branch
- [ ] 2.2 Add to the development section how a release is made (merge the release pull request) and that `RELEASE_PLEASE_TOKEN` must be renewed when it expires; verify the section names the secret but holds no value

## 3. Secret (maintainer)

- [ ] 3.1 Ask the maintainer to create a fine-grained token for `trivoallan/ontrack` (contents and pull requests: read and write) and store it as the repository secret `RELEASE_PLEASE_TOKEN`; verify `gh secret list` shows the name

## 4. First release

- [ ] 4.1 After merge, verify the `release` workflow run on `main` succeeds and opens a pull request titled `chore: release 0.2.0` whose checks (`test`, `node-20`, and `commitlint` if required by then) run
- [ ] 4.2 Verify the release pull request's diff sets `0.2.0` in `package.json`, `package-lock.json`, `.release-please-manifest.json` and the README install command, and adds `CHANGELOG.md`
- [ ] 4.3 With the maintainer's go-ahead, merge it; verify tag `v0.2.0` and its GitHub release exist, and that `npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git#v0.2.0` in a scratch directory installs a working `npx ontrack --version` printing `0.2.0`
