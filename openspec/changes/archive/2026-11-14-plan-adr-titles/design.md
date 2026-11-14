# Design

## Context

See proposal.md (Why). Sources write titles two ways: a frontmatter `title:`
key, or only a first `# ` heading that often repeats the identifier
(`# ADR-0001: Record significant decisions as ADRs`).

## Goals / Non-Goals

**Goals:**
- A short, human title on every ADR line, without opening the file.

**Non-Goals:**
- Titles on `move` lines: they list files to move, and the same ADRs already appear with titles above when they need attention.
- Truncating long titles or aligning them in a column.

## Decisions

**Frontmatter `title:` first, then the first `# ` heading.**
The frontmatter is the declared metadata; the heading is the fallback that
every Markdown ADR has. *Alternative:* heading only, which ignores sources
that keep the identifier in the heading and the title in the frontmatter.

**Strip a leading `<name>: ` from the heading.**
The name is already printed just before. Only an exact `<name>:` prefix is
removed, so a heading like `# Commits: a convention` stays whole.

**Title from the source's copy, local copy only for `removed`.**
The source states the current question; a local copy may have been edited.
A removed ADR has no source copy left. *Alternative:* local copy first, which
would show a stale title for a revised ADR.

**Revision moves into parentheses after the title.**
The title varies in length; putting it last except for a short trailing
revision keeps the line readable. **Breaking** for anyone parsing the
previous `  revision 1 → 2` suffix, which only existed for one day.

**`readTitle(text, name)` lives in `src/revision.mjs`.**
It reuses the bounded frontmatter. The heading fallback scans the body after
the frontmatter, or the whole file when the frontmatter is unreadable.

## Risks / Trade-offs

- [A first `# ` line inside a fenced code block] → Read as the title. Acceptable: ADRs put their title heading first.
- [Multiline or flow-style YAML titles] → Only a single-line scalar is read; otherwise the heading fallback applies.
