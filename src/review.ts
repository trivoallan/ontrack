// Prints the prompt that asks a coding agent to rule `proposed` ADRs: every
// one in sequence, or a single named one; to import first the ADRs the
// repository does not hold yet; to rule again the ruled ADRs whose
// track revised the question; or, for a named `accepted` ADR, to supersede it. The prompt is fixed text plus paths, titles and references:
// everything specific to a question is in its ADR, which the agent reads.
import path from 'node:path';
import { readAdrs, supersededBy } from './instructions.ts';
import type { Adr } from './instructions.ts';
import { buildPlan } from './plan.ts';
import type { Plan } from './plan.ts';

const stem = (adr: Adr) => adr.ref.slice(adr.ns.length + 1);
const sorted = (root: string) => readAdrs(root).sort((a, b) => a.ref.localeCompare(b.ref));
const named = (adr: Adr) => `\`${adr.path}\`${adr.title ? ` (${adr.title})` : ''}`;

const STEPS = `1. Read its file in full. Do not edit any other ADR.
2. Start from what this repository does today on this question: its files, configuration, CI and history. Where it does nothing, say so: an absence is evidence too. Describe the repository as it is, not as the other \`proposed\` ADRs would make it. Then compare with the recommendation the ADR makes, and name every difference.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under \`traits:\` that the ADR leaves to the repository, propose a value with its evidence, and mark it \`observed\` when the repository does it today, or \`absent\` when it does not and the ruling would make it do so.
5. Propose \`rejected\` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value, marked observed or absent, and its evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the \`traits:\` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run \`npx ontrack apply\` to update AGENTS.md.
`;

// Rulings ahead of the repository become tracking items, proposed once the
// review ends (every ADR ruled, or the user stops), since the tracker may be
// one of the ADRs ruled.
const TRACKING = `Once the review ends, whether every ADR is ruled or the user stops, list the rulings this repository does not follow yet: a value its code, configuration or tooling does not match, or a tool the ruling names that is not set up. A ruling is identified by its ADR's reference without the slug, in brackets, and its trait key, as in \`[trivoallan/ADR-0015] secrets.guard\`. The tracker is the one named by the decided \`tracking\` trait in AGENTS.md. Before proposing, list the items in that tracker that carry the label \`ontrack\`, open and closed: propose nothing for a ruling whose identifier starts the title of one of those items, and say in one line which closed items name a ruling this repository still does not follow. When you cannot list the tracker's items, propose every ruling and say that duplicates were not checked. For each ruling left, propose a tracking item: its title starts with the ruling's identifier, as in \`[trivoallan/ADR-0015] secrets.guard: install gitleaks\`, and it names the ADR it serves. Create in the tracker (\`tracking.tool\`, in \`tracking.project\`) only the items the user agrees to, asked with a question tool such as \`AskUserQuestion\` when you have one, each with the label \`ontrack\`, creating the label first when the tracker requires it. When no \`tracking\` trait is decided, or \`tracking.tool\` is \`none\`, give the list in your reply and create nothing.
`;

// How a superseded ADR is marked, and the sections of the new one, are the
// repository's rules (its track's ADR on recording decisions), not ontrack's:
// the prompt names neither.
const supersedeSteps = (adr: Adr) => `1. Read its file in full. Read the rules of this repository on recording decisions, in AGENTS.md and in the ADR they come from.
2. Establish what changes in the decision; ask the user when they have not said. Cite the file or command output that supports the change: what moved in this repository since the decision was taken, or what the decision never matched. If you find nothing, say so in one line.
3. List every key under its \`traits:\`. For each one, propose the value it keeps or the value it takes, with the evidence for every change. Leave no key out: a key the new ADR omits is no longer decided.
4. When it has a \`check:\` command, propose to keep it, change it or drop it, and say why.
5. Present the proposal: the new ADR's file name, in \`docs/adr/local/\` and numbered after the ADRs of that directory and the repository's own ADRs still placed directly in \`docs/adr/\`, from 0001 when there is none; its title; one line per trait key with its value; the check; and the reason for the change. Then stop and ask for the user's agreement, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
6. Once the user agrees: write the new ADR in \`docs/adr/local/\`, in the format the repository's rules prescribe, with \`status: accepted\`, \`supersedes: [${adr.ns}/${adr.id}]\` and the traits; refer to the superseded ADR for context instead of restating it. Mark the superseded ADR only as the repository's rules spell out; when they do not say what to write in it, leave its file untouched. Then run \`npx ontrack apply\` to update AGENTS.md.
`;

// The ruling is carried over where the question did not move, and taken as
// for a new question where it did. The track's copy replaces the local one,
// so the new text and its `revision:` come with it.
const RULE_AGAIN = `1. Read both files in full: the repository's copy, which holds the ruling, and the track's copy, which holds the question as it is asked now. Edit neither the track's copy nor any other ADR.
2. List what moved in the question between the two: every key under \`traits:\` added, removed or renamed, every set of allowed values that changed, and every recommendation that changed. Leave out what only the ruling changed. If nothing that moved touches the ruling, say so in one line.
3. For every trait key that did not move, keep the value this repository ruled, and the reason written for it where it departs from the recommendation.
4. For every trait key that moved, start from the recommendation the track's copy makes. Look in this repository for evidence that it does not apply here, check every condition it states ("if this repository…"), and propose a value drawn from the repository, with its evidence.
5. Keep the status, unless what moved settles whether the question applies here. Propose \`rejected\` only on evidence that it does not, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value, marked kept or changed, the evidence for every change, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
7. Once the user agrees: replace the repository's copy with the track's copy, which carries the new \`revision:\`; write the ruling in it: the agreed status, the \`traits:\` keys filled, or the block removed when rejected, and the reason for every departure from the recommendation; then run \`npx ontrack apply\` to update AGENTS.md.
`;

/**
 * What `plan` reports for the tracks; empty when they cannot be read (no
 * `package.json`, a dependency not installed): `plan` is the command that
 * says why.
 */
export function tracksPlan(root: string): Plan {
  try {
    return buildPlan(root);
  } catch {
    return [];
  }
}

/** An ADR its track ships and the repository holds no copy of: where `apply` writes it, and its title. */
export type NewAdr = { path: string; title: string | null };

/** The ADRs `plan` reports as `new`, in reference order. */
export function newAdrs(root: string, plan: Plan = tracksPlan(root)): NewAdr[] {
  return plan
    .flatMap((track) =>
      track.adrs
        .filter((planned) => planned.category === 'new')
        .map((planned) => ({ ref: `${track.namespace}/${planned.name.replace(/\.md$/, '')}`, title: planned.title })),
    )
    .sort((a, b) => a.ref.localeCompare(b.ref))
    .map(({ ref, title }) => ({ path: `docs/adr/${ref}.md`, title }));
}

/** The contract prompt to import the new ADRs, then review them (see docs/commands.md). */
export function formatImport(adrs: NewAdr[]): string {
  return `Import the architecture decision records this repository does not hold yet, then review them.

1. Run \`npx ontrack apply\`. It imports these ADRs as \`proposed\`, and writes nothing to an ADR this repository has ruled:
${adrs.map(({ path: file, title }) => `   - \`${file}\`${title ? ` (${title})` : ''}`).join('\n')}
   If \`apply\` fails, stop and report its error.
2. Run \`npx ontrack review\` and follow the prompt it prints. It exits with \`2\` when it prints a prompt: that is not an error.
`;
}

/** A ruled ADR whose track asks a later revision of the question. */
export type Revised = { adr: Adr; track: string; from: number; to: number };

/**
 * The ruled ADRs whose track has revised the question, in reference order.
 * A `proposed` one is left to the review prompt.
 */
export function revisedAdrs(root: string, plan: Plan = tracksPlan(root)): Revised[] {
  const adrs = sorted(root);
  return plan
    .flatMap((track) =>
      track.adrs.flatMap((planned): Revised[] => {
        if (planned.category !== 'revised') return [];
        const paths = [`docs/adr/${track.namespace}/${planned.name}`, `docs/adr/${planned.name}`];
        const adr = adrs.find((a) => paths.includes(a.path) && a.status !== 'proposed');
        if (!adr) return [];
        const copy = path.relative(root, path.join(track.adrDir, planned.name)).split(path.sep).join('/');
        return [{ adr, track: copy, from: planned.from as number, to: planned.to as number }];
      }),
    )
    .sort((a, b) => a.adr.ref.localeCompare(b.adr.ref));
}

/** The `proposed` ADRs, in reference order. */
export function pendingAdrs(root: string): Adr[] {
  return sorted(root).filter((a) => a.status === 'proposed');
}

// The one ADR `name` designates. Throws when it matches none, or several.
function findAdr(adrs: Adr[], name: string): Adr {
  const matches = name.includes('/')
    ? adrs.filter((a) => a.ref === name)
    : adrs.filter((a) => a.id === name || stem(a) === name);
  if (matches.length === 0) throw new Error(`no ADR named "${name}" under docs/adr/`);
  if (matches.length > 1) {
    throw new Error(`"${name}" names several ADRs: ${matches.map((a) => a.ref).join(', ')}; name one by its reference`);
  }
  return matches[0];
}

/**
 * The ADR `name` designates: a reference, a file name without .md, or an
 * identifier. Throws when the name matches no ADR, several, or one that is
 * neither `proposed` nor `accepted` and in force.
 */
export function selectAdr(root: string, name: string): Adr {
  const adrs = sorted(root);
  const adr = findAdr(adrs, name);
  if (adr.status === 'proposed') return adr;
  if (adr.status !== 'accepted') {
    throw new Error(`${adr.ref} is ${adr.status ?? 'without a status'}, neither proposed nor accepted: nothing to review`);
  }
  const by = supersededBy(adrs).get(adr);
  if (by) throw new Error(`${adr.ref} is already superseded by ${by.ref}: name that one`);
  return adr;
}

/** The contract prompt for one ADR (see docs/commands.md). */
export function formatReview(adr: Adr): string {
  return `Review one architecture decision record of this repository: ${named(adr)}.

It is \`proposed\`: a question this repository has not answered yet, shipped with the answer its track recommends. Propose a ruling; the user decides. Where the ADR itself says how to rule, it prevails over this prompt.

${STEPS}
${TRACKING}`;
}

/** The contract prompt to rule one revised ADR again (see docs/commands.md). */
export function formatRevision({ adr, track, from, to }: Revised): string {
  return `Rule again one architecture decision record of this repository: ${named(adr)}.

Its track has revised the question: this repository ruled on revision ${from}, and \`${track}\` asks revision ${to}. The ruling stands until it is taken again. Propose the new ruling; the user decides. Where the track's copy itself says how to rule, it prevails over this prompt.

${RULE_AGAIN}
${TRACKING}`;
}

/** The contract prompt for every revised ADR, ruled again one at a time (see docs/commands.md). */
export function formatRevisions(revised: Revised[]): string {
  return `Rule again the architecture decision records of this repository whose track has revised the question, one at a time, in this order:

${revised.map(({ adr, track, from, to }) => `- ${named(adr)}, ruled on revision ${from}: \`${track}\` asks revision ${to}`).join('\n')}

Each holds a ruling of this repository; the file named after it is its track's copy. The ruling stands until it is taken again. Propose the new ruling; the user decides. Where a track's copy itself says how to rule, it prevails over this prompt.

For each ADR, in turn:

${RULE_AGAIN}
Then take the next ADR in the list. Do not start an ADR before the previous one is ruled.

${TRACKING}`;
}

/** The revised ADR `name` designates, if it is one. Throws like `selectAdr` on a name that matches none, or several. */
export function selectRevised(root: string, name: string): Revised | undefined {
  const { ref } = findAdr(sorted(root), name);
  return revisedAdrs(root).find((r) => r.adr.ref === ref);
}

/** The contract prompt to supersede one `accepted` ADR (see docs/commands.md). */
export function formatSupersession(adr: Adr): string {
  return `Supersede one architecture decision record of this repository: ${named(adr)}.

It is \`accepted\`: a decision this repository has taken, whose text is frozen. Changing the decision takes a new ADR that supersedes it. Propose that ADR; the user decides. Where the rules of this repository on recording decisions say how to supersede an ADR, they prevail over this prompt.

${supersedeSteps(adr)}
${TRACKING}`;
}

/** The contract prompt for every pending ADR, ruled one at a time (see docs/commands.md). */
// The order is the agent's reading of the repository, agreed by the user:
// the CLI lists in reference order and judges nothing. The survey, skip,
// stop and summary stay outside STEPS, which both forms share.
export function formatSequence(adrs: Adr[]): string {
  return `Review the architecture decision records of this repository that are still \`proposed\`, one at a time, in the order agreed with the user:

${adrs.map((adr) => `- ${named(adr)}`).join('\n')}

Each is a question this repository has not answered yet, shipped with the answer its track recommends. Propose a ruling; the user decides. Where an ADR itself says how to rule, it prevails over this prompt.

None of them has to be ruled now: the repository works with them open, and \`npx ontrack check\` runs only the decided ADRs. The user rules as many as they choose.

First, when the list holds more than one ADR, survey them. Read every ADR in the list and look at this repository's files, configuration, CI and history, writing nothing. Put each ADR in one of two groups: those this repository already answers, and those that need a discussion. Present both groups, the first one first, and ask the user to agree to that order or give another, with a question tool such as \`AskUserQuestion\` when you have one.

Then, for each ADR, in the agreed order:

${STEPS}
When you present a ruling, the user can also skip the ADR: leave its file untouched and take the next one. The user can stop the review at any time: then write nothing more for the open ADR.

Then take the next ADR in the list. Do not start an ADR before the previous one is ruled or skipped.

When the list is done or the user stops, give a summary: the ADRs ruled in this review, the ADRs still \`proposed\` with the group each belongs to, and a sentence saying the repository works with them open.

${TRACKING}`;
}
