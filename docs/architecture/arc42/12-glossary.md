---
title: Glossary
sidebar:
  hidden: true
---

# Glossary

| Term | Meaning |
| --- | --- |
| Alias | The name a dependency is installed under, the key in the project's `dependencies` or `devDependencies`. It can differ from the package's own name, and the project chooses it. |
| Managed block | The lines of the root `AGENTS.md` between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`, which hold the decided traits. ontrack writes them and nothing outside them. The documentation calls it the rules block. |
| Namespace | The name of a track inside the project: its alias. Imported ADRs live in `docs/adr/<namespace>/` and are referred to as `<namespace>/<file name without .md>`. ADRs placed directly in `docs/adr/` have the namespace `local`. |
| Plan | What importing the tracks would change: per track, each ADR with its category (`new`, `revised`, `removed`, `undetermined`, `unreadable`, `unchanged`) and the files to move out of a flat layout. Also the command that prints it. |
| Revision | The integer `revision:` in an ADR's frontmatter. The track raises it when the question changes; ontrack compares the local value with the track's to say whether a ruling must be taken again. |
| Ruling | The repository's answer to the question an ADR asks, written in its own copy: the `status:` changes from `proposed` to `accepted` or `rejected`, and the trait keys are filled. Also called a verdict. |
| Track | An npm dependency of the project whose `package.json` carries an `ontrack` key naming the directory of the ADRs it ships. Called a source before ontrack 0.5. |
| Trait | A key under `traits:` in an ADR's frontmatter. The track ships it empty, as the question; the repository fills it, as the answer. ontrack copies trait values and never interprets them. |
