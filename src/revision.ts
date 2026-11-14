// Reads the `revision:` of an inherited ADR from files ontrack did not write.
// No YAML parser: two fences and a column-zero key are all we need.

export type Comparison = 'up-to-date' | 'stale' | 'undetermined' | 'unreadable';

const FENCE = /^---\s*$/;
const REVISION = /^revision:\s*(\d+)\s*$/;

// A line that may sit inside a frontmatter. Anything else (a prose line, a
// code fence) is body, and stops the search for the closing fence: that is
// what keeps a truncated frontmatter from swallowing a body example.
function mayBelongToFrontmatter(line: string): boolean {
  return (
    line.trim() === '' ||
    line.startsWith('#') ||
    /^[A-Za-z_][\w-]*\s*:/.test(line) ||
    /^-( |$)/.test(line) ||
    /^\s/.test(line)
  );
}

// Lines between the fences, or null when the frontmatter is unreadable.
export function frontmatter(text: string): string[] | null {
  const lines = text.split('\n');
  if (!FENCE.test(lines[0])) return null;
  for (let i = 1; i < lines.length; i += 1) {
    if (FENCE.test(lines[i])) return lines.slice(1, i);
    if (!mayBelongToFrontmatter(lines[i])) return null;
  }
  return null;
}

function revisionOf(lines: string[]): number | null {
  for (const line of lines) {
    const match = REVISION.exec(line);
    if (match) return Number(match[1]);
  }
  return null;
}

/**
 * The ADR's title: frontmatter `title:`, else the first `# ` heading without
 * a leading `<name>:` repeating the file name. null when there is none.
 */
export function readTitle(text: string, name: string): string | null {
  const lines = text.split('\n');
  const fm = frontmatter(text);
  for (const line of fm ?? []) {
    const match = /^title:\s*(.*?)\s*$/.exec(line);
    if (match) return match[1].replace(/^(["'])(.*)\1$/, '$2').trim() || null;
  }
  const heading = lines.slice(fm ? fm.length + 2 : 0).find((line) => line.startsWith('# '));
  if (!heading) return null;
  const title = heading.slice(2).trim();
  const prefix = `${name}:`;
  return (title.startsWith(prefix) ? title.slice(prefix.length).trim() : title) || null;
}

/**
 * `text` with its frontmatter `revision:` set to `revision`: the column-zero
 * line is replaced, or inserted after `status:` (first line otherwise).
 * Nothing else changes. Throws when the frontmatter is unreadable.
 */
export function setRevision(text: string, revision: number): string {
  const fm = frontmatter(text);
  if (fm === null) throw new Error('cannot set revision: no recognizable frontmatter');
  const lines = text.split('\n');
  const eol = lines[0].endsWith('\r') ? '\r' : '';
  const line = `revision: ${revision}${eol}`;
  const at = (re: RegExp) => fm.findIndex((l) => re.test(l)) + 1; // index in `lines`, 0 if absent
  const existing = at(/^revision:/);
  if (existing) lines[existing] = line;
  else lines.splice((at(/^status:/) || 0) + 1, 0, line);
  return lines.join('\n');
}

/** The ADR's revision, or null when unreadable, absent or not an integer. */
export function readRevision(text: string): number | null {
  const lines = frontmatter(text);
  return lines === null ? null : revisionOf(lines);
}

/**
 * Classifies an imported ADR against its upstream copy.
 * Only `revision:` is compared; status, fields and verdict never count.
 */
export function compareRevision(importedText: string, upstreamText: string): Comparison {
  const lines = frontmatter(importedText);
  if (lines === null) return 'unreadable';
  const imported = revisionOf(lines);
  const upstream = readRevision(upstreamText);
  // 0 is the "never compared" flag, not a number.
  if (!imported || upstream === null) return 'undetermined';
  return imported < upstream ? 'stale' : 'up-to-date';
}
