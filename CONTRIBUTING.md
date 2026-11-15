# Contributing to ontrack

ontrack is built under its own rules: the decisions cited below are ADRs in
[`docs/adr/trivoallan/`](docs/adr/trivoallan/), and `AGENTS.md` holds what
each one decided.

## Report a problem, or ask a question

Open an [issue](https://github.com/trivoallan/ontrack/issues/new/choose). For
a bug, give the command you ran, what it printed, what you expected, and the
output of `npx ontrack --version`.

## Correct a page of the documentation

Every page of <https://trivoallan.github.io/ontrack/> ends with an **Edit
page** link, which opens its Markdown file under `docs/` on GitHub. The ADR
pages have none: a decided ADR is superseded by a new one, not edited.

## Change the code

1. For anything larger than a fix, open an issue first, so that the change is
   agreed before it is written.
2. Set up the repository as the [Development](README.md#development) section
   of the README describes.
3. Branch from `main`, with a `feat/`, `fix/`, `docs/` or `chore/` prefix
   ([ADR-0009](docs/adr/trivoallan/ADR-0009-branching.md)).
4. A change in what a command does starts as an OpenSpec change under
   `openspec/changes/`
   ([ADR-0016](docs/adr/trivoallan/ADR-0016-changes.md)). The format of what a
   command prints is a contract: it changes in
   [`docs/commands.md`](docs/commands.md) before it changes in the code.
5. Run `npm test` and `npm run typecheck`. The tests fail below 95% coverage
   ([ADR-0007](docs/adr/trivoallan/ADR-0007-tests.md)).
6. Open a pull request. It is merged by squashing, so its title is the commit
   message: a [Conventional Commit](https://www.conventionalcommits.org/),
   with one of the scopes of `commitlint.config.mjs` when it has one
   ([ADR-0006](docs/adr/trivoallan/ADR-0006-commits.md)). CI checks it.

Code, comments, commits and documentation are in English
([ADR-0002](docs/adr/trivoallan/ADR-0002-localization.md)).

A new dependency is approved by a person before it is added
([ADR-0020](docs/adr/trivoallan/ADR-0020-adding-dependencies.md)), and a
person merges every pull request
([ADR-0022](docs/adr/trivoallan/ADR-0022-review-and-merge.md)).
