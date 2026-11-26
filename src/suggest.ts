// Prints the prompt that asks a coding agent to audit the repository, once,
// for the decisions it holds and never recorded, and to record those the user
// agrees to. ontrack reads nothing of the repository but its ADRs and its
// tracks: the agent reads the rest (local/ADR-0029).
import { readAdrs } from './instructions.ts';
import type { Adr } from './instructions.ts';
import { NUMBERING, newAdrs, tracksPlan } from './review.ts';
import type { NewAdr } from './review.ts';

const titled = (file: string, title: string | null) => `\`${file}\`${title ? ` (${title})` : ''}`;

/** The first step of the prompts that write a new ADR of the repository (`suggest`, `decide`). */
export const READ_RULES = 'Read the rules of this repository on recording decisions, in AGENTS.md and in the ADR they come from. Write nothing yet.';

/** How those prompts write the new ADR, once the user agrees. */
export const WRITE_ADR =
  'write the new ADR in `docs/adr/local/`, in the format the repository\'s rules prescribe, with `status: accepted`, `supersedes: []`, its traits under `traits:` and its check under `check:` when it has one, its context drawn from the evidence. Then run `npx ontrack apply` to update AGENTS.md: an ADR without traits does not reach it.';

const STEPS = `1. ${READ_RULES}
2. Look for the decisions this repository made, in this order of weight: review comments a maintainer repeats on pull requests; reversals in the git history, where a dependency, a tool or a pattern was replaced by another; rules written by hand in AGENTS.md or CLAUDE.md that no ADR backs; design notes and change proposals, archived ones included, where a choice was argued; then configuration and dependencies, which show what is, not what was chosen. When the forge cannot be read, or holds no review comment, say so in one line and go on with the other sources.
3. Keep a candidate only when a credible alternative exists, one an agent or a newcomer could take instead. A fact with no alternative is not a decision.
4. Drop a candidate that an \`accepted\` ADR in force already covers. When the ADR that covers it is \`proposed\`, or among the ADRs to import, drop it and say that \`npx ontrack review\` rules it. An ADR that only mentions a fact in passing does not cover it.
5. Merge into one the candidates a single decision explains. Keep at most five candidates, the weightiest first. For each: a title, the decision in one sentence, the alternative it rules out, the traits that state it (keys under a top-level key that no ADR in force uses), a check command when one can verify it, and its evidence, each piece cited as a file and line, a commit, or a review comment. When none is left, say so and stop.
6. Present the candidates, with their traits and checks and the file name each new ADR would take, ${NUMBERING}. Then stop and ask the user which ones to record, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
7. For each candidate the user agrees to: ${WRITE_ADR}
`;

/** What the prompt lists: the ADRs here, in reference order, and those the tracks would import. Unreadable tracks give none to import. */
export function suggestInputs(root: string): { held: Adr[]; fresh: NewAdr[] } {
  return {
    held: readAdrs(root).sort((a, b) => a.ref.localeCompare(b.ref)),
    fresh: newAdrs(root, tracksPlan(root)),
  };
}

/** The lists of ADRs here and to import, and what they mean, shared by `suggest` and `decide`. */
export function adrLists(held: Adr[], fresh: NewAdr[]): string {
  const heldList =
    held.length === 0
      ? 'The repository holds no ADR.'
      : `The repository holds these ADRs:\n\n${held.map((a) => `- ${titled(a.path, a.title)}, ${a.status ?? 'no status'}`).join('\n')}`;
  const freshList =
    fresh.length === 0
      ? 'Its tracks would import no ADR.'
      : `Its tracks would import these ADRs:\n\n${fresh.map((a) => `- ${titled(a.path, a.title)}`).join('\n')}`;
  return `${heldList}

${freshList}

A decision one of them covers is already recorded, or awaits a ruling: do not record it again.`;
}

/** The contract prompt of `suggest` (see docs/commands.md). */
export function formatSuggest(held: Adr[], fresh: NewAdr[]): string {
  return `Audit this repository for the decisions it holds and has not recorded as architecture decision records, then record the ones the user agrees to. This is done once, when the repository adopts ontrack: a decision taken from now on is recorded by the change that takes it.

${adrLists(held, fresh)}

${STEPS}`;
}
