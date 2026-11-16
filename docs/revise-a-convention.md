---
title: Revise a convention
description: Change a convention in your track, and take each repository that ruled on it through ruling again.
---

This guide shows how to change a convention in a track you maintain, then how
a repository that ruled on the earlier version takes its ruling again.

It follows [Write your own track](write-your-own-track.md) and uses the
same names: the track `platform-governance`, installed under the alias
`platform`.

## In the track

### 1. Change the convention

Edit the ADR: its text, its recommendation, or its trait keys. Leave the
status `proposed` and the trait values empty, as for any shipped convention.

### 2. Raise the revision

Add one to `revision` in the ADR's frontmatter:

```yaml
revision: 2
```

This is what tells a repository that its ruling is to be taken again. Raise
it only when the convention itself moves, so that a repository is never asked
to rule again on a fixed typo.

### 3. Publish

Commit and push the track, the way you publish any other change to it.

## In each repository

### 4. Update the track

```bash
npm update platform
```

`plan` reads the track as it is installed. Until this step, the repository
cannot see the revision.

### 5. See what moved

```bash
npx ontrack plan
```

```
platform: 1 revised, 0 unchanged
  revised       ADR-0001-commits (revision 1 → 2)
```

`plan` exits with `2`. The ruling the repository made on revision 1 stands
until it is taken again: `AGENTS.md` still carries it.

No `apply` step comes next. `apply` does not write to a `revised` ADR, so
there is nothing for it to do until the convention is ruled again. The agent
runs it at the end of the next step.

### 6. Rule again

```bash
claude "$(npx ontrack review)"
```

The agent reads the repository's copy and the track's, keeps your ruling
where the convention did not move, and proposes one where it did. It writes
nothing until you agree. This needs a version of ontrack later than 0.3.0.

Once you agree, the agent replaces the repository's copy with the track's,
which carries the new revision, writes the ruling in it, and runs
`npx ontrack apply` to update `AGENTS.md`.

`ontrack apply` alone never does this. It does not write to a `revised` ADR:
a person rules.

### 7. Check, then commit

```bash
npx ontrack plan
```

```
platform: 1 unchanged
```

`plan` exits with `0`. Commit the lockfile, the ADR and `AGENTS.md`
together.

## Other changes to a track

| You | The repository sees in `plan` | What it does |
| --- | --- | --- |
| Add a convention | `new` | Rules it with `review`, whose prompt has the agent run `npx ontrack apply` first |
| Change the `check` line only | `check` | `npx ontrack apply` copies the new line |
| Remove a convention | `removed` | `npx ontrack apply --prune` deletes its copy |

None of these needs a new revision.

## Related

- To have each repository told that the track moved, without anyone
  remembering step 4, see [Run ontrack in CI](run-ontrack-in-ci.md).
- [File formats](file-formats.md#how-revision-is-compared) says how `plan`
  compares two revisions.
