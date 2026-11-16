---
title: Glossary
sidebar:
  hidden: true
---

# Glossary

| Term | Meaning |
| --- | --- |
| Alias | The name a dependency is installed under, the key in the project's `dependencies` or `devDependencies`. It can differ from the package's own name, and the project chooses it. |
| Convention | An ADR a track ships: a recommendation, with trait keys left empty for the repository to fill. It is `proposed` until the repository rules on it. Called a question before ontrack 0.6. |
| Decision | An ADR a repository writes for itself, in `docs/adr/local/`. No track proposed it, so it is not a convention. |
| Instructions block | The lines of the root `AGENTS.md` between `<!-- ontrack:begin -->` and `<!-- ontrack:end -->`, which hold the decided traits. ontrack writes them and nothing outside them. Its heading is `## Project instructions (ontrack)`. Called the rules block before ontrack 0.6. |
| Namespace | The name of a track inside the project: its alias. Imported ADRs live in `docs/adr/<namespace>/` and are referred to as `<namespace>/<file name without .md>`. ADRs placed directly in `docs/adr/` have the namespace `local`. |
| Plan | What importing the tracks would change: per track, each ADR with its category (`new`, `revised`, `removed`, `undetermined`, `unreadable`, `unchanged`) and the files to move out of a flat layout. Also the command that prints it. |
| Revision | The integer `revision:` in an ADR's frontmatter. The track raises it when the convention changes; ontrack compares the local value with the track's to say whether a ruling must be taken again. |
| Ruling | What a repository decides on the convention an ADR carries, written in its own copy: the `status:` changes from `proposed` to `accepted` or `rejected`, and the trait keys are filled. |
| Track | An npm dependency of the project whose `package.json` carries an `ontrack` key naming the directory of the ADRs it ships. Called a source before ontrack 0.5. |
| Trait | A key under `traits:` in an ADR's frontmatter. The track ships it empty, as a parameter of the convention; the repository fills it when it rules. ontrack copies trait values and never interprets them. |
