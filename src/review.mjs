// Prints the prompt that asks a coding agent to rule `proposed` ADRs: every
// one in sequence, or a single named one. The prompt is fixed text plus paths
// and titles: everything specific to a question is in its ADR, which the
// agent reads.
import { readAdrs } from './instructions.mjs';

const stem = (adr) => adr.ref.slice(adr.ns.length + 1);
const sorted = (root) => readAdrs(root).sort((a, b) => a.ref.localeCompare(b.ref));
const named = (adr) => `\`${adr.path}\`${adr.title ? ` (${adr.title})` : ''}`;

const STEPS = `1. Read its file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under \`traits:\` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose \`rejected\` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop and ask for the user's agreement, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
7. Once the user agrees: fill the \`traits:\` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run \`npx ontrack apply\` to update AGENTS.md.
`;

// Rulings ahead of the repository become tracking items, proposed once the
// whole review is ruled, since the tracker may be one of the ADRs ruled.
const TRACKING = `Once every ADR is ruled, list the rulings this repository does not follow yet: a value its code, configuration or tooling does not match, or a tool the ruling names that is not set up. For each one, propose a tracking item: a title, and the ADR it serves. Create in the tracker named by the decided \`tracking\` trait in AGENTS.md (\`tracking.tool\`, in \`tracking.project\`) only the items the user agrees to, asked with a question tool such as \`AskUserQuestion\` when you have one. When no \`tracking\` trait is decided, or \`tracking.tool\` is \`none\`, give the list in your reply and create nothing.
`;

/** The `proposed` ADRs, in reference order. */
export function pendingAdrs(root) {
  return sorted(root).filter((a) => a.status === 'proposed');
}

/**
 * The ADR `name` designates: a reference, a file name without .md, or an
 * identifier. Throws when the name matches no ADR, several, or one that is
 * not `proposed`.
 */
export function selectAdr(root, name) {
  const adrs = sorted(root);
  const matches = name.includes('/')
    ? adrs.filter((a) => a.ref === name)
    : adrs.filter((a) => a.id === name || stem(a) === name);
  if (matches.length === 0) throw new Error(`no ADR named "${name}" under docs/adr/`);
  if (matches.length > 1) {
    throw new Error(`"${name}" names several ADRs: ${matches.map((a) => a.ref).join(', ')}; name one by its reference`);
  }
  const [adr] = matches;
  if (adr.status !== 'proposed') {
    throw new Error(`${adr.ref} is ${adr.status ?? 'without a status'}, not proposed: nothing to review`);
  }
  return adr;
}

/** The contract prompt for one ADR (see README). */
export function formatReview(adr) {
  return `Review one architecture decision record of this repository: ${named(adr)}.

It is \`proposed\`: a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where the ADR itself says how to rule, it prevails over this prompt.

${STEPS}
${TRACKING}`;
}

/** The contract prompt for every pending ADR, ruled one at a time (see README). */
export function formatSequence(adrs) {
  return `Review the architecture decision records of this repository that are still \`proposed\`, one at a time, in this order:

${adrs.map((adr) => `- ${named(adr)}`).join('\n')}

Each is a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where an ADR itself says how to rule, it prevails over this prompt.

For each ADR, in turn:

${STEPS}
Then take the next ADR in the list. Do not start an ADR before the previous one is ruled.

${TRACKING}`;
}
