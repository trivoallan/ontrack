import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', '.git']);
const INLINE = /!?\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+["'][^"']*["'])?\s*\)/g;
const REFERENCE = /^\s{0,3}\[[^\]]+\]:\s*<?(\S+?)>?(?:\s+["'(].*)?$/;
const FENCE = /^\s*(```|~~~)/;

function markdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) files.push(...markdownFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(full);
    }
  }
  return files;
}

// A relative path target, without anchor; null for URLs, absolute paths, anchors.
function relativeTarget(raw) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) || raw.startsWith('/') || raw.startsWith('#')) return null;
  return raw.split('#')[0];
}

const posix = (p) => p.split(path.sep).join('/');

/**
 * Links a migration breaks: those whose target is a moved file, and those
 * held by a moved file whose existing target stays in place.
 * `moves`: [{ from, to }] absolute paths. Reads only; never rewrites.
 * @returns {{ file: string, line: number, old: string, new: string }[]}
 */
export function findLinks(root, moves) {
  const moved = new Map(moves.map((m) => [m.from, m.to]));
  const found = [];
  for (const file of markdownFiles(root)) {
    const dir = path.dirname(file);
    // A moved file is reported, and its links resolved, at its new place.
    const holder = moved.get(file) ?? file;
    const newDir = path.dirname(holder);
    let inFence = false;
    readFileSync(file, 'utf8').split('\n').forEach((text, index) => {
      if (FENCE.test(text)) {
        inFence = !inFence;
        return;
      }
      if (inFence) return;
      const targets = [...text.matchAll(INLINE)].map((m) => m[1]);
      const ref = REFERENCE.exec(text);
      if (ref) targets.push(ref[1]);
      for (const raw of targets) {
        const target = relativeTarget(raw);
        if (!target) continue;
        const resolved = path.resolve(dir, target);
        const to = moved.get(resolved) ?? (holder !== file && existsSync(resolved) ? resolved : null);
        const next = to && posix(path.relative(newDir, to));
        if (next && next !== target) {
          found.push({ file: posix(path.relative(root, holder)), line: index + 1, old: target, new: next });
        }
      }
    });
  }
  return found.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}
