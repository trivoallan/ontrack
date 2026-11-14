# Design

## Context

See proposal.md for motivation. What shapes the approach:

- ADR-0010 places the model in `docs/architecture/model/` as `.c4` files
  and says sections 3, 5 and 7 "use views of that model rather than
  hand-drawn diagrams". ADR-0008 says LikeC4 views are "embedded through
  its Vite plugin with no generation step".
- A view embedded through the Vite plugin is a component, so the page that
  shows it must be MDX. ADR-0010 lists the section files as `.md`; the
  site's loader pattern (`**/*.{md,mdx}`, ADR-0008) accepts both.
- The site is a separate Node project in `site/`, reading `docs/` in place
  (tracked by trivoallan/ontrack#34, proposed on another branch; the `site/` location is assumed here and follows whatever that change settles).
- The system is small: a CLI of ten modules, with these import relations
  today: `cli` → the four `commands`; `commands` → `plan`, `apply`,
  `agents`, `instructions`, `review`, `links`; `plan` → `sources`,
  `revision`; `apply` → `plan`, `revision`; `instructions` → `plan`,
  `revision`; `agents` → `instructions`; `review` → `instructions`.

## Goals / Non-Goals

**Goals:**
- One model, three views, no structural diagram written anywhere else.
- A model error (unknown element, dangling relationship) fails CI.

**Non-Goals:**
- Sequences and flows: they stay in Mermaid, in section 6 (ADR-0010).
- Generating the model from the code, or checking it against the imports.
- Modelling functions or files below the module level.

## Decisions

**Model content.** Three files, by concern:

- `specification.c4`: element kinds `actor`, `system`, `module`,
  `external`; deployment node kinds for a machine and a runtime.
- `model.c4`: the maintainer and the coding agent (actors); `ontrack`
  (system) with one `module` element per file of `src/` (the four commands
  grouped under `cli`); externals: the project repository (`package.json`,
  `docs/adr/<namespace>/`, `AGENTS.md`), the installed source packages in
  `node_modules`, and npm/git as the way sources arrive. Relationships
  follow the imports listed in Context and the files each module reads or
  writes.
- `views.c4` (with the deployment model): `context` (ontrack and its
  neighbours), `building-blocks` (the modules inside ontrack), `deployment`
  (ontrack as a dev dependency run by Node on a developer machine and on a
  CI runner).

Alternative: one file. Three keep a diff to "what exists" apart from a diff
to "how it is shown".

**Views are embedded with the LikeC4 Vite plugin, in the site project.**
`likec4` is added to `site/package.json` and its plugin to
`site/astro.config.mjs`, pointed at `../docs/architecture/model`. Nothing is
generated into the repository. Alternative: exporting PNG or Mermaid files
and committing them, a generation step whose output can lag the model,
which is what ADR-0008 chose LikeC4's plugin to avoid.

**Sections 3, 5 and 7 become `.mdx`.** Each keeps its name and prose and
gains one component showing its view. This departs from the `.md` extension
in ADR-0010's table for three of the twelve files; it follows from that
ADR's own requirement that these sections show model views, and the body of
ADR-0010 gets one sentence recording it. Alternative: keep `.md` and link
to a separate page holding the view, which splits each section in two.

**On GitHub, the three sections show prose and a link to the model
directory.** MDX components do not render there. The `.c4` files are
readable text, which is the fallback.

**Validation in the existing `docs` job.** The site build fails when the
model does not compile, so the required `docs` check covers it; a
`likec4 validate` step is added before the build for a clearer error
message. No new job.

## Risks / Trade-offs

- [The model drifts from the code: a new module, a changed import] → the
  model is small enough to check by eye against `grep "^import" src/`; the
  arc42 section 5 task of any change adding a module includes the model.
  Automatic checking is a non-goal.
- [Three sections unreadable as diagrams on GitHub] → prose and model text
  remain; the site is where views are read.
- [LikeC4 is one more tool with its own release pace] → confined to
  `site/`, pinned by its lockfile.
- [Two diagram languages overlap] → rule from ADR-0010, restated in section
  5's header comment: structure in the model, behaviour in Mermaid.

## Open Questions

- Whether view components need an Astro island directive to be interactive
  (pan, zoom) or are rendered statically. Either satisfies the requirement;
  decided when the first view is embedded.
