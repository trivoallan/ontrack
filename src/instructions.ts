// Gathers the traits a repository decided in its ADRs into one block for
// AGENTS.md. Trait values are copied verbatim, never parsed: governance says a
// trait "is read without interpretation", and agents read YAML natively.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import type { Link } from './links.ts';
import { OWN, markdownFiles } from './plan.ts';
import { frontmatter, readTitle } from './revision.ts';
import { OntrackError } from './errors.ts';

type AdrFile = { dir: string; ns: string; file: string };

/** An ADR as read from docs/adr/. `traits` and `check` are null unless it is `accepted`. */
export type Adr = {
  ref: string;
  path: string;
  ns: string;
  id: string;
  status: string | null;
  title: string | null;
  supersedes: string[];
  traits: string[] | null;
  check: string | null;
};
export type DecidedAdr = Adr & { traits: string[] };
export type Instructions = { decided: DecidedAdr[]; pending: Adr[] };

const stem = (file: string) => file.replace(/\.md$/, '');
const byRef = (a: Adr, b: Adr) => a.ref.localeCompare(b.ref);
const unquote = (v: string) => v.replace(/^(["'])(.*)\1$/, '$2');

// docs/adr/<namespace>/*.md as `<namespace>`; the repository's own are in
// `local`. docs/adr/*.md is their historical layout, still read as `local`.
function adrFiles(root: string): AdrFile[] {
  const adrRoot = path.join(root, 'docs', 'adr');
  if (!existsSync(adrRoot)) return [];
  const files = markdownFiles(adrRoot).map((file) => ({ dir: adrRoot, ns: OWN, file }));
  for (const { file } of files) {
    if (existsSync(path.join(adrRoot, OWN, file))) {
      throw new OntrackError('E201', `docs/adr/${file} and docs/adr/${OWN}/${file} are the same ADR; keep one`);
    }
  }
  for (const entry of readdirSync(adrRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(adrRoot, entry.name);
    files.push(...markdownFiles(dir).map((file) => ({ dir, ns: entry.name, file })));
  }
  return files;
}

// Value of a column-zero key, without a trailing `# comment`; null when absent.
function topValue(lines: string[], key: string): string | null {
  const prefix = `${key}:`;
  const line = lines.find((l) => l.startsWith(prefix));
  return line === undefined ? null : unquote(line.slice(prefix.length).replace(/\s#.*$/, '').trim());
}

// The lines that follow `key:` and belong to it (indented, `- item` or blank).
function blockAfter(lines: string[], key: string, belongs: (line: string) => boolean): string[] {
  const start = lines.findIndex((l) => l.startsWith(`${key}:`));
  const block: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() !== '' && !belongs(line)) break;
    block.push(line);
  }
  while (block.length > 0 && block[block.length - 1].trim() === '') block.pop();
  return block;
}

function readSupersedes(lines: string[]): string[] {
  const inline = topValue(lines, 'supersedes');
  if (inline === null) return [];
  const items = inline.startsWith('[')
    ? inline.replace(/^\[|\]$/g, '').split(',')
    : blockAfter(lines, 'supersedes', (l) => /^\s*-\s/.test(l)).map((l) => l.replace(/^\s*-\s+/, ''));
  return items.map((item) => unquote(item.trim())).filter(Boolean);
}

// The dedented traits block, or null when the ADR declares none.
function readTraitsBlock(lines: string[], file: string): string[] | null {
  const inline = topValue(lines, 'traits');
  if (inline === null || inline === '{}') return null;
  if (inline !== '') throw new OntrackError('E202', `${file}: write traits: as an indented block, not "${inline}"`);
  const block = blockAfter(lines, 'traits', (l) => /^\s/.test(l));
  if (block.length === 0) return null;
  const indent = block[0].length - block[0].trimStart().length;
  return block.map((l) => l.replace(new RegExp(`^\\s{0,${indent}}`), ''));
}

function readAdr(root: string, { dir, ns, file }: AdrFile): Adr | null {
  const full = path.join(dir, file);
  const text = readFileSync(full, 'utf8');
  const lines = frontmatter(text);
  if (lines === null) return null;
  const status = topValue(lines, 'status');
  const traits = status === 'accepted' ? readTraitsBlock(lines, path.relative(root, full)) : null;
  return {
    ref: `${ns}/${stem(file)}`,
    path: path.relative(root, full).split(path.sep).join('/'),
    ns,
    id: topValue(lines, 'adr') || stem(file),
    status,
    title: readTitle(text, stem(file)),
    supersedes: status === 'accepted' ? readSupersedes(lines) : [],
    traits,
    check: status === 'accepted' ? topValue(lines, 'check') || null : null,
  };
}

/**
 * `supersedes:` entries that name namespace `from`, each with its line and
 * the entry it becomes under `to`. A file of docs/adr/<from>/ is reported at
 * its path under docs/adr/<to>/. Reads only.
 */
export function supersedesNaming(root: string, from: string, to: string): Link[] {
  const found: Link[] = [];
  for (const { dir, ns, file } of adrFiles(root)) {
    const lines = readFileSync(path.join(dir, file), 'utf8').split('\n');
    if (lines[0] !== '---') continue;
    const end = lines.indexOf('---', 1);
    const start = lines.findIndex((l, i) => i > 0 && (end < 0 || i < end) && l.startsWith('supersedes:'));
    if (start < 0) continue;
    const held = ns === from ? `docs/adr/${to}/${file}` : path.relative(root, path.join(dir, file)).split(path.sep).join('/');
    const report = (index: number, items: string[]) => {
      for (const item of items.map((i) => unquote(i.trim()))) {
        if (item.startsWith(`${from}/`)) found.push({ file: held, line: index + 1, old: item, new: `${to}/${item.slice(from.length + 1)}` });
      }
    };
    const inline = lines[start].slice('supersedes:'.length).replace(/\s#.*$/, '').trim();
    if (inline.startsWith('[')) report(start, inline.replace(/^\[|\]$/g, '').split(','));
    else if (inline === '') {
      for (let i = start + 1; i < lines.length && /^\s*-\s/.test(lines[i]); i++) report(i, [lines[i].replace(/^\s*-\s+/, '')]);
    }
  }
  return found.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
}

// Dotted paths of the mapping keys in a traits block, and those with no key
// nested under them. List items are not keys: they belong to their parent.
function keyPaths(traits: string[]) {
  const stack: { indent: number; path: string }[] = [];
  const top = () => stack[stack.length - 1];
  const paths = new Set<string>();
  const parents = new Set<string>();
  for (const line of traits) {
    const m = /^(\s*)([A-Za-z_][\w-]*)\s*:/.exec(line);
    if (m === null) continue;
    const indent = m[1].length;
    while (stack.length > 0 && top().indent >= indent) stack.pop();
    if (stack.length > 0) parents.add(top().path);
    const p = stack.length > 0 ? `${top().path}.${m[2]}` : m[2];
    stack.push({ indent, path: p });
    paths.add(p);
  }
  return { paths, leaves: new Set([...paths].filter((p) => !parents.has(p))) };
}

/** Every readable ADR of the repository, unsorted. Reads docs/adr/ only. */
export function readAdrs(root: string): Adr[] {
  return adrFiles(root).map((f) => readAdr(root, f)).filter((adr) => adr !== null);
}

/**
 * Each superseded ADR mapped to the `accepted` ADR that names it in
 * `supersedes:`. A plain name matches in the superseding ADR's directory.
 */
export function supersededBy(adrs: Adr[]): Map<Adr, Adr> {
  const superseded = new Map<Adr, Adr>();
  for (const adr of adrs) {
    for (const name of adr.supersedes) {
      const slash = name.indexOf('/');
      const [ns, id] = slash < 0 ? [adr.ns, name] : [name.slice(0, slash), name.slice(slash + 1)];
      for (const other of adrs) if (other !== adr && other.ns === ns && other.id === id) superseded.set(other, adr);
    }
  }
  return superseded;
}

// Resolves supersession and trait conflicts once for instructions and check.
function resolve(root: string) {
  const adrs = readAdrs(root);
  const superseded = supersededBy(adrs);

  const inForce = adrs.filter((a) => a.status === 'accepted' && !superseded.has(a)).sort(byRef);
  const decided = inForce.filter((a): a is DecidedAdr => a.traits !== null);
  const pathOwner = new Map<string, string>();
  const leafOwner = new Map<string, string>();
  for (const adr of decided) {
    const { paths, leaves } = keyPaths(adr.traits);
    // A leaf of one ADR clashes with any path of the other: same key, or a
    // value one sets where the other nests keys.
    const clash = [...leaves].find((p) => pathOwner.has(p)) ?? [...paths].find((p) => leafOwner.has(p));
    if (clash !== undefined) {
      throw new OntrackError(
        'E203',
        `trait "${clash}" is decided by both ${pathOwner.get(clash)} and ${adr.ref}; ` +
          'supersede one of them (supersedes:) to settle it',
      );
    }
    for (const p of paths) pathOwner.set(p, adr.ref);
    for (const p of leaves) leafOwner.set(p, adr.ref);
  }
  const pending = adrs.filter((a) => a.status === 'proposed').sort(byRef);
  return { decided, pending, inForce };
}

/**
 * { decided, pending }: the ADRs whose traits are in force, and those still
 * `proposed`, each sorted by reference. Throws when two decided ADRs decide
 * the same trait key. Reads docs/adr/ only.
 */
export function buildInstructions(root: string): Instructions {
  const { decided, pending } = resolve(root);
  return { decided, pending };
}

/** Every `accepted` ADR not superseded, sorted by reference. Throws like buildInstructions. */
export const adrsInForce = (root: string) => resolve(root).inForce;

export const heading = (adr: Adr) => (adr.title ? `${adr.title} (${adr.ref})` : adr.ref);

/**
 * `npx ontrack` runs the bin the project installs, or its own when the project
 * is ontrack. Otherwise npx fetches the unrelated `ontrack` package from the
 * registry, so the commands ontrack prints name the package instead.
 */
export function qualify(root: string, text: string): string {
  if (existsSync(path.join(root, 'node_modules', '.bin', 'ontrack'))) return text;
  const manifest = path.join(root, 'package.json');
  if (existsSync(manifest) && (JSON.parse(readFileSync(manifest, 'utf8')) as { name?: unknown }).name === '@trivoallan/ontrack') return text;
  return text.replaceAll('npx ontrack', 'npx -p @trivoallan/ontrack ontrack');
}

/** Tells the agent which command prepares a ruling, so it does not improvise one. */
export const REVIEW_HINT = 'When asked to review, rule on or supersede an ADR, run `npx ontrack review [adr]` and follow its output.';

/** The contract output (see docs/commands.md). */
export function formatInstructions({ decided, pending }: Instructions): string {
  const lines = ['<!-- ontrack:begin -->', '## Project instructions (ontrack)', '', REVIEW_HINT, ''];
  for (const adr of decided) lines.push(`### ${heading(adr)}`, '', '```yaml', ...adr.traits, '```', '');
  if (pending.length > 0) {
    lines.push('### Not yet decided', '', ...pending.map((adr) => `- ${heading(adr)}`), '');
  }
  lines.push('<!-- ontrack:end -->');
  return `${lines.join('\n')}\n`;
}
