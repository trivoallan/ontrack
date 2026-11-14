// Keeps the ontrack rules block of the root AGENTS.md current. Everything
// between the two markers belongs to ontrack; the rest of the file does not.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { buildInstructions, formatInstructions } from './instructions.mjs';

const BEGIN = '<!-- ontrack:begin -->';
const END = '<!-- ontrack:end -->';
const WARNING =
  'AGENTS.md: not read by Claude Code while CLAUDE.md exists; add a line "@AGENTS.md" to CLAUDE.md';

// Claude Code reads AGENTS.md natively only when no CLAUDE.md or
// CLAUDE.local.md exists; otherwise CLAUDE.md must import it.
function claudeWarning(root) {
  const claude = path.join(root, 'CLAUDE.md');
  const hasClaude = existsSync(claude);
  if (!hasClaude && !existsSync(path.join(root, 'CLAUDE.local.md'))) return null;
  const imported = hasClaude && readFileSync(claude, 'utf8').split('\n').some((l) => l.trim() === '@AGENTS.md');
  return imported ? null : WARNING;
}

/**
 * State of the rules block: `none` (not needed), `current`, `out of date`,
 * `missing`, or `skipped` with a `reason`. Never throws on a trait conflict
 * or malformed markers: those only skip the AGENTS.md step.
 */
export function agentsStatus(root) {
  const file = path.join(root, 'AGENTS.md');
  const text = existsSync(file) ? readFileSync(file, 'utf8') : null;
  const lines = text === null ? [] : text.split('\n');
  const at = (marker) => lines.flatMap((l, i) => (l.trimEnd() === marker ? [i] : []));
  const begins = at(BEGIN);
  const ends = at(END);
  const marked = begins.length + ends.length > 0;

  let instructions;
  try {
    instructions = buildInstructions(root);
  } catch (err) {
    return { state: 'skipped', reason: err.message, warning: claudeWarning(root) };
  }
  if (!marked && instructions.decided.length + instructions.pending.length === 0) return { state: 'none', warning: null };

  const warning = claudeWarning(root);
  const block = formatInstructions(instructions).trimEnd().split('\n');
  if (!marked) return { state: 'missing', file, text, block, warning };
  if (begins.length !== 1 || ends.length !== 1 || ends[0] < begins[0]) {
    return { state: 'skipped', reason: `expected one ${BEGIN} line followed by one ${END} line`, warning };
  }
  const span = [begins[0], ends[0]];
  const held = lines.slice(span[0], span[1] + 1).map((l) => l.trimEnd());
  const state = held.join('\n') === block.join('\n') ? 'current' : 'out of date';
  return { state, file, text, block, span, warning };
}

/** True when the block still needs a human or an `apply`. */
export const agentsPending = ({ state }) => state === 'missing' || state === 'out of date' || state === 'skipped';

/** The lines `plan` prints about the block ('' when there is nothing to say). */
export function agentsReport({ state, reason, warning }) {
  const lines = [];
  if (state === 'missing' || state === 'out of date') lines.push(`AGENTS.md: rules block ${state}`);
  if (state === 'skipped') lines.push(`AGENTS.md: skipped, ${reason}`);
  if (warning) lines.push(warning);
  return lines;
}

/** Writes a `missing` or `out of date` block. Returns 'created' or 'updated'. */
export function writeAgents({ state, file, text, block, span }) {
  if (text === null) {
    writeFileSync(file, `${block.join('\n')}\n`);
    return 'created';
  }
  const eol = text.includes('\r\n') ? '\r\n' : '\n';
  if (state === 'missing') {
    const gap = text === '' ? '' : (text.endsWith('\n') ? '' : eol) + eol;
    writeFileSync(file, text + gap + block.join(eol) + eol);
    return 'created';
  }
  const lines = text.split('\n');
  const cr = eol === '\r\n' ? '\r' : '';
  const last = lines[span[1]].endsWith('\r') ? '\r' : '';
  const fresh = block.map((l, i) => l + (i === block.length - 1 ? last : cr));
  lines.splice(span[0], span[1] - span[0] + 1, ...fresh);
  writeFileSync(file, lines.join('\n'));
  return 'updated';
}
