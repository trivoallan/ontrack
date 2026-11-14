---
title: Write your own source
description: Create an ontrack source for your own conventions - a package with an ontrack key and one ADR - try it against a repository, and publish it.
---

This guide shows how to create a source that holds your own conventions,
try it against one repository, and publish it for the others.

You need Node 22.18 or later, and to have gone through the
[tutorial](tutorial.md) once. The examples name the source
`platform-governance` and install it under the alias `platform`.

## 1. Create the package

A source is an npm package. Create a directory with a `package.json` and a
directory for the ADRs:

```bash
mkdir -p platform-governance/adr
cd platform-governance
```

```json
{
  "name": "platform-governance",
  "version": "0.1.0",
  "files": ["adr/"],
  "ontrack": { "adr": "adr", "namespace": "platform" }
}
```

`adr` names the directory of the ADRs. `namespace` is the alias you propose
to the repositories that install the source.

## 2. Write a first question

Add one Markdown file per convention in `adr/`. Write it as a question: the
status is `proposed`, the revision is `1`, and the trait keys are empty.

```markdown
---
adr: ADR-0001
title: Commits
status: proposed
revision: 1
supersedes: []
traits:
  commits:
    scopes:
    tool:
---

# Commits

## Context

Without a list of scopes, each commit invents one, and the history cannot be
filtered.

## Decision

We recommend `tool: commitlint`. List the scopes of this repository under
`scopes`.
```

Save it as `adr/ADR-0001-commits.md`. The file name, without `.md`, is how
`plan` and `apply` name the ADR.

The body is yours. Say what you recommend and why: it is what a person, or
the agent that `ontrack review` briefs, reads before answering.
[File formats](file-formats.md#the-frontmatter-of-an-adr) lists the keys
ontrack reads and how to write them.

## 3. Try it against a repository

Before you publish, install the source from its directory into a repository
next to it:

```bash
cd ../service
npm i -D @trivoallan/ontrack
npm i -D platform@file:../platform-governance
npx ontrack plan
```

```
platform: 1 new, 0 unchanged
  new           ADR-0001-commits
```

Then import the question:

```bash
npx ontrack apply
```

```
platform: 1 imported
  imported      ADR-0001-commits
AGENTS.md: rules block created
```

The ADR is now in `docs/adr/platform/`, and `AGENTS.md` lists it under "Not
yet decided". Answer it with `claude "$(npx ontrack review)"` to see your
question the way a repository will.

npm installs a `file:` dependency as a link. Each change you make in the
source shows in the next `npx ontrack plan`, with no reinstall.

## 4. Publish it

First add the keyword `ontrack-source` to its `package.json`. On the public
registry, the keyword is how a person [finds your source](find-a-source.md):

```json
"keywords": ["ontrack-source"]
```

Then publish the source to an npm registry, as you would any package:

```bash
npm publish
```

A repository then installs it under the alias you proposed:

```bash
npm i -D platform@npm:platform-governance
```

`platform@npm:` is npm's alias syntax: the package keeps its name on the
registry and is installed as `platform`. A scoped package works the same
way: `platform@npm:@acme/platform-governance`.

The alias is the namespace: the ADRs land in `docs/adr/platform/`. It must
be unscoped. A repository may pick another alias than the one you propose.

In the trial repository, replace the `file:` dependency with this one before
you commit.

A source can also be installed from its git repository, with
`platform@git+https://github.com/<owner>/platform-governance.git`. npm 12
fetches no git dependency by default: each repository then needs
`allow-git=root` in its `.npmrc`.

### Say what the source asks

A repository that installs your source receives every question in it. Write
a README, which the registry and the git host both show, so that a person
can judge the source before installing it:

- how many questions it asks, and on which subjects;
- which questions carry a `check` command, because that command runs in the
  repository that accepts the ADR;
- the alias you propose.

ontrack does not read the README.

## When you change a question

Raise its `revision` in the source. Each repository that answered the
earlier revision sees it in `plan`, once it has updated the dependency:

```
platform: 1 revised, 0 unchanged
  revised       ADR-0001-commits (revision 1 → 2)
```

Raise it only when the question itself moves. A fixed typo is not a new
question.

[Revise a question](revise-a-question.md) follows the change through to a
repository that rules again.

## Go further

- Read [how ontrack works](how-it-works.md) for the model behind these
  steps: the pieces, the life of a question, and the cycle.
- Have a question name the command that verifies its answer, in a `check`
  key. [`ontrack check`](commands.md#ontrack-check) runs it in each
  repository that accepted the ADR.
- Let your editor check the `ontrack` key as you type, with the
  [published JSON Schema](file-formats.md#the-ontrack-key-of-a-source).
- See how a person [finds a source](find-a-source.md) to install, yours
  included.
- Read [trivoallan/governance](https://github.com/trivoallan/governance), a
  source in use.
