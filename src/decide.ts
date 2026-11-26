// Prints the prompt that asks a coding agent to record, with the user, the
// one decision the user's request states. Like `suggest`, ontrack gives the
// ADRs here and those to import, and the agent reads the rest, the history
// it numbers the file from included (local/ADR-0029).
import type { Adr } from './instructions.ts';
import { NUMBERING } from './review.ts';
import type { NewAdr } from './review.ts';
import { adrLists, READ_RULES, WRITE_ADR } from './suggest.ts';

const STEPS = `1. ${READ_RULES}
2. Establish the decision from the user's request; ask the user what is decided when the request does not say. Name the alternative it rules out. When no credible alternative exists, say that a fact with no alternative is not a decision, and stop.
3. When an \`accepted\` ADR in force already decides it, stop: name that ADR, and propose \`npx ontrack review <its reference>\` to supersede it. When the ADR that decides it is \`proposed\`, or among the ADRs to import, stop and say that \`npx ontrack review\` rules it.
4. Start from what this repository does today on the subject: its files, configuration, CI and history. Cite the evidence as a file and line, a commit, or a review comment. Where it does nothing, say so.
5. Propose the traits that state the decision (keys under a top-level key that no ADR in force uses), or say that it has none: an ADR without traits does not reach AGENTS.md. Propose a check command when one can verify it.
6. Present the proposal: a title, the decision in one sentence, the alternative it rules out, the traits, the check, the evidence, and the file name the new ADR would take, ${NUMBERING}. Then stop and ask for the user's agreement, with a question tool such as \`AskUserQuestion\` when you have one. Write nothing until the user agrees.
7. Once the user agrees: ${WRITE_ADR}
`;

/** The contract prompt of `decide` (see docs/commands.md). */
export function formatDecide(held: Adr[], fresh: NewAdr[]): string {
  return `Record, with the user, the decision their request states as a new architecture decision record of this repository. To change a decision already recorded, run \`npx ontrack review <adr>\` instead.

${adrLists(held, fresh)}

${STEPS}`;
}
