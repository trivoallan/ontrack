---
title: Glossary
---

# Glossary

| Term | Meaning |
| --- | --- |
| Source | An npm dependency of the project whose `package.json` carries an `ontrack` key naming the directory of the ADRs it ships. |
| Alias | The name a dependency is installed under, the key in the project's `dependencies` or `devDependencies`. It can differ from the package's own name, and the project chooses it. |
| Namespace | The name of a source inside the project: its alias. Imported ADRs live in `docs/adr/<namespace>/` and are referred to as `<namespace>/<file name without .md>`. ADRs placed directly in `docs/adr/` have the namespace `local`. |
| Ruling | The repository's answer to the question an ADR asks, written in its own copy: the `status:` changes from `proposed` to `accepted` or `rejected`, and the trait keys are filled. Also called a verdict. |
| Revision | The integer `revision:` in an ADR's frontmatter. The source raises it when the question changes; ontrack compares the local value with the source's to say whether a ruling must be taken again. |
| Trait | A key under `traits:` in an ADR's frontmatter. The source ships it empty, as the question; the repository fills it, as the answer. ontrack copies trait values and never interprets them. |
| Plan | What importing the sources would change: per source, each ADR with its category (`new`, `revised`, `removed`, `undetermined`, `unreadable`, `unchanged`) and the files to move out of a flat layout. Also the command that prints it. |
| Managed block | The lines of the root `AGENTS.md` between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`, which hold the decided traits. ontrack writes them and nothing outside them. The documentation calls it the rules block. |
