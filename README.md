<p align="center"><img src="docs/assets/logo.png" alt="" width="160"></p>

# ontrack

ontrack imports shared architecture decision records (ADRs) into a repository
from **sources**. A source is an npm dependency whose `package.json` carries
an `ontrack` key; its npm alias is its namespace.

## Why

Teams that share conventions (how to commit, branch, test, deliver) tend to
copy them from repository to repository, where the copies drift. With ontrack
the conventions are written once, as ADRs in a source repository. Each ADR
asks a question and recommends an answer.

- Every repository that depends on the source imports the ADRs and answers them for itself.
- When a question changes upstream, `ontrack plan` says which answers must be taken again; a CI job can rely on its exit code.
- The answers are written to `AGENTS.md`, so coding agents follow the rules the repository decided.

## Installation

Node 22.18 or later. Installing compiles ontrack once, which npm does on its own.

```bash
npm i -D ontrack@git+https://github.com/trivoallan/ontrack.git
```

Add a source with npm, under the alias of your choice:

```bash
npm i -D <alias>@git+<source-repository-url>
```

### Example source

[trivoallan/governance](https://github.com/trivoallan/governance) is a
minimal source: a `package.json` whose `ontrack` key points to its `adr/`
directory, and the ADRs in it. Its catalogue grows over time, so the output
below is a snapshot, abridged here.

```json
{
  "name": "governance",
  "ontrack": { "adr": "adr", "namespace": "trivoallan" }
}
```

Install it under the namespace it proposes, then see what importing it would
change:

```bash
npm i -D trivoallan@git+https://github.com/trivoallan/governance.git
npx ontrack plan
```

```
trivoallan: 17 new, 0 unchanged
  new           ADR-0001-record-architecture-decisions
  new           ADR-0002-localization
  new           ADR-0003-architecture
  …
  new           ADR-0017-agent-tooling
```

Then import them, and let a coding agent propose a ruling for each:

```bash
npx ontrack apply
claude "$(npx ontrack review)"
```

## Usage

```bash
npx ontrack --help         # list commands
npx ontrack --version
npx ontrack plan          # what importing the sources would change
npx ontrack apply         # do it (see below)
npx ontrack instructions  # the decided traits, as a block for AGENTS.md
npx ontrack review        # a prompt asking a coding agent to rule the proposed ADRs, or to supersede an accepted one
npx ontrack check         # run the check command of each decided ADR
```

### Exit codes

Every command shares the same exit codes:

| Code | Meaning |
|------|---------|
| `0` | Nothing to do |
| `2` | Changes pending, or a check failed |
| `1` | Error (unknown command, unreadable source…) |

A CI job can detect an out-of-date repository on `2` without parsing the output.

## `ontrack plan` output contract

`plan` never modifies a file and makes no network call. Its output follows
this format, one block per source, sources sorted by alias:

```
platform: 2 revised, 1 new, 3 unchanged
  revised       SDR-0006  Commits (revision 1 → 2)
  revised       SDR-0010  Forge and CI (revision 3 → 4)
  new           SDR-0015  Observability
migration: 5 files docs/adr/ → docs/adr/platform/
  move          SDR-0001.md
  move          SDR-0003.md
  move          SDR-0006.md
  move          SDR-0008.md
  move          SDR-0010.md
```

- Line 1, per source: `<alias>: <count per category>`, in the order revised, new, removed, undetermined, unreadable, check, unchanged. Zero counts are omitted, except "unchanged".
- Then one line per ADR that is not unchanged, sorted by name: two spaces, the category in a 12-character column, two spaces, the file name without `.md`, then two spaces and the ADR's title, unless the name already carries a slug (`ADR-0006-commits`). A `revised` line ends with `(revision <local> → <upstream>)`.
- The title is the frontmatter `title:` key, or else the first `# ` heading, without a leading `<name>: ` that repeats the file name. It comes from the source's copy (the local copy for a `removed` ADR). An ADR without a title shows its name only.
- Categories: `new` (not imported yet), `revised` (the question moved upstream), `removed` (no longer shipped by the source), `undetermined` (no usable `revision:` to compare), `unreadable` (no recognizable frontmatter), `check` (up to date, but the source's `check:` line differs from yours).
- A `check` line is followed by the `check:` line that would go (four spaces, `- `) and the one that would come (four spaces, `+ `), so you read the command before `apply` writes it:

  ```
  trivoallan: 1 check, 13 unchanged
    check         ADR-0006-commits
      - check: exit 0
      + check: npx commitlint --last
  ```

  The `check:` line is the first one at column zero in the frontmatter. Only an ADR that is up to date can be `check`: a `revised` ADR gets its check once you have ruled again.
- A flat-layout migration (`docs/adr/<file>` that belongs to the source but is not under `docs/adr/<alias>/`) is always shown: `migration: <n> file(s) docs/adr/ → docs/adr/<alias>/`, then one `move` line per file.
- When there is nothing to do, one line per source (`platform: 14 unchanged`), and the exit code is `0`. Any other category, or a migration, gives `2`.
- With no source at all, `plan` prints `no ontrack source found` and exits with `0`.

Any change to this format goes through this README first.

## `ontrack apply`

`apply` brings the repository in line with what `plan` reports, in one
command. It is the only command that writes, it never commits, and it never
touches an ADR you already decided on, except for its `check:` line. Besides
`docs/adr/`, it writes one
file: the rules block of `AGENTS.md` (see below).

```bash
npx ontrack apply --dry-run          # print what apply would do, write nothing
npx ontrack apply                    # import new ADRs, move flat files
npx ontrack apply --prune            # also delete ADRs the source no longer ships
npx ontrack apply --confirm SDR-0003 # declare an undetermined verdict still holds
npx ontrack apply --confirm all      # same, for every undetermined ADR
```

What it does, per source:

- `imported`: a `new` ADR is copied, byte for byte, into `docs/adr/<alias>/`.
- `moved`: a flat-layout file moves from `docs/adr/` to `docs/adr/<alias>/` (`git mv` in a git repository, a plain rename otherwise).
- `pruned`, only with `--prune`: a `removed` ADR is deleted.
- `confirmed`, only with `--confirm`: an `undetermined` ADR gets the upstream `revision:`; nothing else in the file changes.
- `synced`: a `check` ADR gets the source's `check:` line, set, replaced or removed; nothing else in the file changes. It needs no option. The `check:` line of an imported ADR belongs to its source: to run a different check, supersede the ADR with one of your own.

A `revised` or `unreadable` ADR is never written to or deleted (only moved by
a migration): its verdict must be taken again by a person.

Its output lists the actions, then every Markdown link the migration breaks
(links to a moved file, and links held by a moved file to a file left in
place; it lists them, it does not rewrite them), then what still needs a
human, in the `plan` format:

```
dry run: nothing written
platform: 1 imported, 2 moved
  imported      SDR-0015  Observability
  moved         SDR-0006.md
  moved         SDR-0010.md
links to update:
  docs/arc42.md:12  adr/SDR-0006.md → adr/platform/SDR-0006.md
remaining:
platform: 1 revised, 2 unchanged
  revised       SDR-0010  Forge and CI (revision 3 → 4)
```

The first line only appears with `--dry-run`. With nothing to do, `apply`
prints the same output as `plan`. Exit codes are those of `plan`, computed on
what remains after the run: `0` nothing left, `2` something still needs a
human, `1` error. Every check runs before the first write, so an error never
leaves a half-applied repository.

## `ontrack instructions` output contract

Coding agents read `AGENTS.md`, not ADRs. A trivoallan/governance ADR ships
its question as empty **trait** keys. Your repository answers in its own copy:
it fills the keys and switches `status:` to `accepted`.

```yaml
---
adr: ADR-0006
title: Commits
status: accepted
traits:
  commits:
    scopes: [api, cli, docs]
    tool: commitlint
---
```

`instructions` prints the decided traits as the rules block of `AGENTS.md`. You do not paste it: `ontrack apply` writes it (see below), and `instructions` only previews it:

~~~
<!-- ontrack:begin -->
## Project rules (ontrack)

### Commits (trivoallan/ADR-0006-commits)

```yaml
commits:
  scopes: [api, cli, docs]
  tool: commitlint
```

### Not yet decided

- Localization (trivoallan/ADR-0002-localization)

<!-- ontrack:end -->
~~~

- The ADRs read are the repository's: `docs/adr/*.md`, named `local/<file name without .md>`, and `docs/adr/<namespace>/*.md`, named `<namespace>/<file name without .md>`. Sources in `node_modules` are not read, because a shipped ADR holds a question, not an answer.
- An ADR carries decided traits when it is `accepted`, is not superseded, and has an indented `traits:` block. The block is copied verbatim, dedented, and its values are never interpreted. `traits: {}` declares nothing, and any other inline value is an error.
- An `accepted` ADR supersedes the ADRs named in its `supersedes:` key (`[A, B]` or `- A` lines). A plain name matches an ADR's `adr:` value, or its file name, in the same directory. `<namespace>/<name>` and `local/<name>` reach another directory.
- `proposed` ADRs are listed under "Not yet decided". Every other status is ignored.
- Two decided ADRs sharing a top-level trait key are an error that names both. Superseding one of them settles it.
- Sections are sorted by reference. With nothing decided and nothing pending, the block holds only its heading.
- `instructions` never writes a file and makes no network call. It exits with `0`, or with `1` on an error; it never returns `2`.

Any change to this format goes through this README first.

## `ontrack review` prompt contract

An ADR stays `proposed` until someone rules. `review` prints a prompt that
asks a coding agent to rule them with you, one at a time: the agent proposes,
you agree, and only then does it write.

```bash
claude "$(npx ontrack review)"           # every proposed ADR, in sequence
claude "$(npx ontrack review ADR-0006)"  # this one alone
claude "$(npx ontrack review ADR-0001)"  # an accepted one: supersede it
```

Without an argument, the prompt lists every `proposed` ADR and gives the
steps once:

~~~
Review the architecture decision records of this repository that are still `proposed`, one at a time, in this order:

- `docs/adr/trivoallan/ADR-0002-localization.md` (Localization)
- `docs/adr/trivoallan/ADR-0006-commits.md` (Commits)

Each is a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where an ADR itself says how to rule, it prevails over this prompt.

For each ADR, in turn:

1. Read its file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under `traits:` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose `rejected` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the `traits:` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run `npx ontrack apply` to update AGENTS.md.

Then take the next ADR in the list. Do not start an ADR before the previous one is ruled.

Once every ADR is ruled, list the rulings this repository does not follow yet: a value its code, configuration or tooling does not match, or a tool the ruling names that is not set up. For each one, propose a tracking item: a title, and the ADR it serves. Create in the tracker named by the decided `tracking` trait in AGENTS.md (`tracking.tool`, in `tracking.project`) only the items the user agrees to, asked with a question tool such as `AskUserQuestion` when you have one. When no `tracking` trait is decided, or `tracking.tool` is `none`, give the list in your reply and create nothing.
~~~

With an argument, the prompt names that ADR alone, with the same steps. It is
the same text for every ADR, apart from its path and title:

~~~
Review one architecture decision record of this repository: `docs/adr/trivoallan/ADR-0006-commits.md` (Commits).

It is `proposed`: a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where the ADR itself says how to rule, it prevails over this prompt.

1. Read its file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under `traits:` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose `rejected` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the `traits:` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run `npx ontrack apply` to update AGENTS.md.

Once every ADR is ruled, list the rulings this repository does not follow yet: a value its code, configuration or tooling does not match, or a tool the ruling names that is not set up. For each one, propose a tracking item: a title, and the ADR it serves. Create in the tracker named by the decided `tracking` trait in AGENTS.md (`tracking.tool`, in `tracking.project`) only the items the user agrees to, asked with a question tool such as `AskUserQuestion` when you have one. When no `tracking` trait is decided, or `tracking.tool` is `none`, give the list in your reply and create nothing.
~~~

Naming an `accepted` ADR reopens its decision. Its text is frozen, so the
prompt asks for a new ADR in `docs/adr/` that supersedes it. It is the same
text for every ADR, apart from its path, title and reference:

~~~
Supersede one architecture decision record of this repository: `docs/adr/trivoallan/ADR-0001-record-architecture-decisions.md` (Record architecture decisions).

It is `accepted`: a decision this repository has taken, whose text is frozen. Changing the decision takes a new ADR that supersedes it. Propose that ADR; the user decides. Where the rules of this repository on recording decisions say how to supersede an ADR, they prevail over this prompt.

1. Read its file in full. Read the rules of this repository on recording decisions, in AGENTS.md and in the ADR they come from.
2. Establish what changes in the decision; ask the user when they have not said. Cite the file or command output that supports the change: what moved in this repository since the decision was taken, or what the decision never matched. If you find nothing, say so in one line.
3. List every key under its `traits:`. For each one, propose the value it keeps or the value it takes, with the evidence for every change. Leave no key out: a key the new ADR omits is no longer decided.
4. When it has a `check:` command, propose to keep it, change it or drop it, and say why.
5. Present the proposal: the new ADR's file name, in `docs/adr/` and numbered after the ADRs that sit directly in that directory, from 0001 when there is none; its title; one line per trait key with its value; the check; and the reason for the change. Then stop and ask for the user's agreement, with a question tool such as `AskUserQuestion` when you have one. Write nothing until the user agrees.
6. Once the user agrees: write the new ADR in `docs/adr/`, in the format the repository's rules prescribe, with `status: accepted`, `supersedes: [trivoallan/ADR-0001-record-architecture-decisions]` and the traits; refer to the superseded ADR for context instead of restating it. Mark the superseded ADR only as the repository's rules spell out; when they do not say what to write in it, leave its file untouched. Then run `npx ontrack apply` to update AGENTS.md.

Once every ADR is ruled, list the rulings this repository does not follow yet: a value its code, configuration or tooling does not match, or a tool the ruling names that is not set up. For each one, propose a tracking item: a title, and the ADR it serves. Create in the tracker named by the decided `tracking` trait in AGENTS.md (`tracking.tool`, in `tracking.project`) only the items the user agrees to, asked with a question tool such as `AskUserQuestion` when you have one. When no `tracking` trait is decided, or `tracking.tool` is `none`, give the list in your reply and create nothing.
~~~

- The ADRs read are those of `instructions`. Without an argument, the prompt lists every `proposed` ADR in reference order, the order of "Not yet decided", even when there is only one.
- An argument with a `/` is a reference (`trivoallan/ADR-0006-commits`). Any other argument is a file name without `.md` (`ADR-0006-commits`) or an `adr:` identifier (`ADR-0006`), looked up in every directory. It must name exactly one ADR, and that ADR must be `proposed`, or `accepted` and not superseded.
- An `accepted` ADR gets the supersession prompt only when named: without an argument, `review` never reopens a decision. Supersession is that of `instructions`: an ADR another `accepted` ADR names in `supersedes:` is already superseded, and naming it is an error that says which ADR supersedes it.
- The supersession prompt does not say how a superseded ADR is marked, nor which sections the new ADR has: those are the repository's rules on recording decisions, which the agent reads. When they say nothing on marking, the superseded file is left untouched.
- An ADR without a title is named by its path alone.
- Once the review is ruled, the agent proposes a tracking item for every ruling the repository does not follow yet, and creates only those you agree to, in the tracker your `tracking` trait names. Without one, it lists them.
- `review` never writes a file and makes no network call. Two decided ADRs sharing a trait key do not stop it.
- It exits with `2` when it prints a prompt, because a ruling is pending. With no `proposed` ADR it exits with `0`, says so on standard error and prints nothing, so that no agent receives that sentence as a prompt. An unknown or ambiguous name, a `rejected` ADR, or one already superseded, is an error, with `1`.

Any change to this prompt goes through this README first.

## `ontrack check` output contract

`instructions` tells an agent what the repository decided. `check` tells it
when its work departs from a decision. ontrack judges nothing itself: an ADR
names the command that does, in a top-level `check:` key of its frontmatter.

```yaml
---
adr: ADR-0006
title: Commits
status: accepted
check: npx commitlint --from origin/main
traits:
  commits:
    scopes: [api, cli, docs]
    tool: commitlint
---
```

`check` runs each command and reports one line per ADR:

```
unchecked  Record architecture decisions (trivoallan/ADR-0001-record-architecture-decisions)
fail       Commits (trivoallan/ADR-0006-commits)
  rule: docs/adr/trivoallan/ADR-0006-commits.md
  check: echo "scope may not be empty"; exit 1
  | scope may not be empty
pass       Branching (trivoallan/ADR-0009-branching)
1 failed, 1 passed, 1 unchecked
```

- The ADRs read, their status and their supersession are those of `instructions`. An ADR carries a check when it is `accepted`, is not superseded, and has a non-empty `check:` value. A local ADR that supersedes a source's ADR silences its check and may carry its own.
- The command is the rest of the `check:` line. A trailing ` # comment` is removed, and so is one pair of matching quotes around the whole value. Lines below are not part of it: put a longer command in a script.
- Commands run through the shell, from the project root, with your environment, one at a time, in reference order. A failure does not stop the run.
- `pass`: the command exited with `0`. `fail`: anything else, including a program that is not installed. `unchecked`: the ADR carries decided traits and no `check:`.
- A `fail` line is followed by the ADR's path, the command, and the command's standard output then standard error, each line after `  | `. The output of a passing command is not printed.
- Lines are sorted by reference. The last line counts each status, and is the only line when there is nothing to report.
- Conflicting traits are an error, as in `instructions`, and no command runs.
- `check` exits with `2` when at least one check failed, `0` otherwise, `1` on an error. `unchecked` ADRs do not change the exit code.
- Only ADRs committed under `docs/adr/` are read, never `node_modules`. A source's command therefore runs only once `apply` has written it into your copy and your repository holds the ADR as `accepted`. `apply` keeps that line in step with the source, so updating a source can change what runs here: `plan` prints the old and new lines first. Read them as you would an npm install script.

Any change to this format goes through this README first.

## The rules block in `AGENTS.md`

`ontrack apply` keeps the block printed by `ontrack instructions` current in
the `AGENTS.md` at the root of the repository, and `ontrack plan` reports its
state. The text between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`
belongs to ontrack and is overwritten; everything outside the markers is
yours and is never touched.

- `apply` replaces the block when the file holds one marker pair, appends it after an empty line when the file has no marker, and creates `AGENTS.md` when there is none. It prints `AGENTS.md: rules block updated` or `AGENTS.md: rules block created`. With `--dry-run` it prints `AGENTS.md: rules block to update` or `AGENTS.md: rules block to create` and writes nothing.
- `plan` prints `AGENTS.md: rules block missing` or `AGENTS.md: rules block out of date` and exits with `2`, like any other pending change.
- The block is needed as soon as one ADR is decided or pending. With none, and no marker in `AGENTS.md`, nothing is printed and no file is created.
- When the block cannot be written (a marker without its pair, more than one pair, or two decided ADRs sharing a trait key), only this step is skipped: the ADRs are still handled, `AGENTS.md` is left untouched, and both commands print `AGENTS.md: skipped, <reason>` and exit with `2`.
- Claude Code reads `AGENTS.md` on its own only when the repository has no `CLAUDE.md` and no `CLAUDE.local.md`. When one of them exists and `CLAUDE.md` holds no line `@AGENTS.md`, both commands print `AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md`. ontrack never writes `CLAUDE.md`; this warning does not change the exit code.

## Development

The code is TypeScript, written so that Node runs it as it is: nothing is
compiled to work in this repository. Development uses Node 24 (see `.nvmrc`);
CI also runs the tests on Node 22.18, the lowest supported version.

```bash
npm install
node bin/ontrack.ts plan   # the CLI, from the sources
npm test                   # tests and coverage; fails below 95% lines, branches or functions
npm run typecheck          # strict type check of bin/, src/ and test/
npm run build              # compiles bin/ and src/ to dist/, what an install ships
```

Node does not run TypeScript from `node_modules`, so the installed package is
the JavaScript in `dist/`. npm builds it when it installs ontrack from git
(`prepare`); `dist/` is never committed.

### Documentation site

The pages under `docs/` are published at
<https://trivoallan.github.io/ontrack/> by a [Starlight](https://starlight.astro.build/)
site. It is a separate package in `site/`, built with Node 24, and it reads
`docs/` in place: to add a page, add a Markdown file with a `title:` under
`docs/`.

```bash
cd site
npm ci
npm run dev      # local preview, reloads on change
npm run build    # build into site/dist/, then check every internal link
```

## License

[Apache License 2.0](LICENSE).
