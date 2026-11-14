// Prints the prompt that asks a coding agent to rule one `proposed` ADR.
// The prompt is fixed text plus a path and a title: everything specific to
// the question is in the ADR, which the agent reads.
import { readAdrs } from './instructions.mjs';

const stem = (adr) => adr.ref.slice(adr.ns.length + 1);

/**
 * The ADR to review: the one `name` designates (a reference, a file name
 * without .md, or an identifier), or the first pending one in reference
 * order. Null when no name is given and nothing is pending. Throws when the
 * name matches no ADR, several, or one that is not `proposed`.
 */
export function selectAdr(root, name) {
  const adrs = readAdrs(root).sort((a, b) => a.ref.localeCompare(b.ref));
  if (name === undefined) return adrs.find((a) => a.status === 'proposed') ?? null;

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

/** The contract prompt (see README). */
export function formatReview(adr) {
  const title = adr.title ? ` (${adr.title})` : '';
  return `Review one architecture decision record of this repository: \`${adr.path}\`${title}.

It is \`proposed\`: a question this repository has not answered yet, shipped with the answer its source recommends. Propose a ruling; the user decides. Where the ADR itself says how to rule, it prevails over this prompt.

1. Read that file in full. Do not edit any other ADR.
2. Start from the recommendation the ADR makes. Look in this repository for evidence that it does not apply here. If you find none, say so in one line.
3. When a recommendation is conditional ("if this repository…"), check the condition and cite the file or command output that settles it.
4. For every key under \`traits:\` that the ADR leaves to the repository, propose a value drawn from the repository, with its evidence.
5. Propose \`rejected\` only on evidence that the question does not apply here, and say what stands in for it.
6. Present the proposed ruling: the status, one line per trait key with its value and evidence, and every departure from the recommendation with its reason. Then stop. Write nothing until the user agrees.
7. Once the user agrees: fill the \`traits:\` keys, or remove the block when rejected; set the status; write in the ADR the reason for every departure from the recommendation; then run \`npx ontrack apply\` to update AGENTS.md.
`;
}
