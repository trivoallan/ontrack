// Reads the `revision:` of an inherited ADR from files ontrack did not write.
// No YAML parser: two fences and a column-zero key are all we need. The
// values the scanner finds are parsed with the `adrFrontmatter` model.

import type { z } from 'zod';
import { adrFrontmatter } from './schemas.ts';
import { OntrackError } from './errors.ts';

export type Comparison = 'up-to-date' | 'stale' | 'undetermined' | 'unreadable';

const FENCE = /^---\s*$/;
const PAIR = /^([A-Za-z_][\w-]*):\s*(.*?)\s*$/;

type Fields = z.infer<typeof adrFrontmatter>;

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

// The value of each top-level `key:` line, in order; null where the model
// refuses it. A refused value is "no value", never an error.
function values<K extends keyof Fields>(lines: string[], key: K): (Fields[K] | null)[] {
  const found: (Fields[K] | null)[] = [];
  for (const line of lines) {
    const pair = PAIR.exec(line);
    if (pair?.[1] !== key) continue;
    const parsed = adrFrontmatter.shape[key].safeParse(pair[2]);
    found.push(parsed.success ? (parsed.data as Fields[K]) : null);
  }
  return found;
}

function revisionOf(lines: string[]): number | null {
  return values(lines, 'revision').find((value) => value !== null) ?? null;
}

/**
 * The ADR's title: frontmatter `title:`, else the first `# ` heading without
 * a leading `<name>:` repeating the file name. null when there is none.
 */
export function readTitle(text: string, name: string): string | null {
  const lines = text.split('\n');
  const fm = frontmatter(text);
  const titles = values(fm ?? [], 'title');
  if (titles.length) return titles[0];
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
  if (fm === null) throw new OntrackError('E206', 'cannot set revision: no recognizable frontmatter');
  const lines = text.split('\n');
  const eol = lines[0].endsWith('\r') ? '\r' : '';
  const line = `revision: ${revision}${eol}`;
  const at = (re: RegExp) => fm.findIndex((l) => re.test(l)) + 1; // index in `lines`, 0 if absent
  const existing = at(/^revision:/);
  if (existing) lines[existing] = line;
  else lines.splice((at(/^status:/) || 0) + 1, 0, line);
  return lines.join('\n');
}

/** The first column-zero `check:` line of the frontmatter, right-trimmed; null when there is none. */
export function readCheckLine(text: string): string | null {
  const line = (frontmatter(text) ?? []).find((l) => l.startsWith('check:'));
  return line === undefined ? null : line.trimEnd();
}

/**
 * `text` with its frontmatter `check:` line set to `line`: replaced, inserted
 * after `revision:`, or removed when `line` is null. Nothing else changes.
 * Throws when the frontmatter is unreadable.
 */
export function setCheckLine(text: string, line: string | null): string {
  const fm = frontmatter(text);
  if (fm === null) throw new OntrackError('E207', 'cannot set check: no recognizable frontmatter');
  const lines = text.split('\n');
  const eol = lines[0].endsWith('\r') ? '\r' : '';
  const at = (re: RegExp) => fm.findIndex((l) => re.test(l)) + 1; // index in `lines`, 0 if absent
  const existing = at(/^check:/);
  if (line === null) lines.splice(existing, 1);
  else if (existing) lines[existing] = line + eol;
  else lines.splice(at(/^revision:/) + 1, 0, line + eol);
  return lines.join('\n');
}

/** The ADR's verdict: its first frontmatter `status:` value, or null when unreadable, absent or empty. */
export function readStatus(text: string): string | null {
  return values(frontmatter(text) ?? [], 'status')[0] ?? null;
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
