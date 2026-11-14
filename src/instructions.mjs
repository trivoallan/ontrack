// Gathers the traits a repository decided in its ADRs into one block for
// AGENTS.md. Trait values are copied verbatim, never parsed: governance says a
// trait "is read without interpretation", and agents read YAML natively.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { markdownFiles } from './plan.mjs';
import { frontmatter, readTitle } from './revision.mjs';

const stem = (file) => file.replace(/\.md$/, '');
const byRef = (a, b) => a.ref.localeCompare(b.ref);
const unquote = (v) => v.replace(/^(["'])(.*)\1$/, '$2');

// docs/adr/*.md as `local`, docs/adr/<namespace>/*.md as `<namespace>`.
function adrFiles(root) {
  const adrRoot = path.join(root, 'docs', 'adr');
  if (!existsSync(adrRoot)) return [];
  const files = markdownFiles(adrRoot).map((file) => ({ dir: adrRoot, ns: 'local', file }));
  for (const entry of readdirSync(adrRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const dir = path.join(adrRoot, entry.name);
    files.push(...markdownFiles(dir).map((file) => ({ dir, ns: entry.name, file })));
  }
  return files;
}

// Value of a column-zero key, without a trailing `# comment`; null when absent.
function topValue(lines, key) {
  const prefix = `${key}:`;
  const line = lines.find((l) => l.startsWith(prefix));
  return line === undefined ? null : unquote(line.slice(prefix.length).replace(/\s#.*$/, '').trim());
}

// The lines that follow `key:` and belong to it (indented, `- item` or blank).
function blockAfter(lines, key, belongs) {
  const start = lines.findIndex((l) => l.startsWith(`${key}:`));
  const block = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() !== '' && !belongs(line)) break;
    block.push(line);
  }
  while (block.length > 0 && block.at(-1).trim() === '') block.pop();
  return block;
}

function readSupersedes(lines) {
  const inline = topValue(lines, 'supersedes');
  if (inline === null) return [];
  const items = inline.startsWith('[')
    ? inline.replace(/^\[|\]$/g, '').split(',')
    : blockAfter(lines, 'supersedes', (l) => /^\s*-\s/.test(l)).map((l) => l.replace(/^\s*-\s+/, ''));
  return items.map((item) => unquote(item.trim())).filter(Boolean);
}

// The dedented traits block, or null when the ADR declares none.
function readTraitsBlock(lines, file) {
  const inline = topValue(lines, 'traits');
  if (inline === null || inline === '{}') return null;
  if (inline !== '') throw new Error(`${file}: write traits: as an indented block, not "${inline}"`);
  const block = blockAfter(lines, 'traits', (l) => /^\s/.test(l));
  if (block.length === 0) return null;
  const indent = /^\s*/.exec(block[0])[0].length;
  return block.map((l) => l.replace(new RegExp(`^\\s{0,${indent}}`), ''));
}

function readAdr(root, { dir, ns, file }) {
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

// Dotted paths of the mapping keys in a traits block, and those with no key
// nested under them. List items are not keys: they belong to their parent.
function keyPaths(traits) {
  const stack = [];
  const paths = new Set();
  const parents = new Set();
  for (const line of traits) {
    const m = /^(\s*)([A-Za-z_][\w-]*)\s*:/.exec(line);
    if (m === null) continue;
    const indent = m[1].length;
    while (stack.length > 0 && stack.at(-1).indent >= indent) stack.pop();
    if (stack.length > 0) parents.add(stack.at(-1).path);
    const p = stack.length > 0 ? `${stack.at(-1).path}.${m[2]}` : m[2];
    stack.push({ indent, path: p });
    paths.add(p);
  }
  return { paths, leaves: new Set([...paths].filter((p) => !parents.has(p))) };
}

/** Every readable ADR of the repository, unsorted. Reads docs/adr/ only. */
export function readAdrs(root) {
  return adrFiles(root).map((f) => readAdr(root, f)).filter(Boolean);
}

/**
 * Each superseded ADR mapped to the `accepted` ADR that names it in
 * `supersedes:`. A plain name matches in the superseding ADR's directory.
 */
export function supersededBy(adrs) {
  const superseded = new Map();
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
function resolve(root) {
  const adrs = readAdrs(root);
  const superseded = supersededBy(adrs);

  const inForce = adrs.filter((a) => a.status === 'accepted' && !superseded.has(a)).sort(byRef);
  const decided = inForce.filter((a) => a.traits);
  const pathOwner = new Map();
  const leafOwner = new Map();
  for (const adr of decided) {
    const { paths, leaves } = keyPaths(adr.traits);
    // A leaf of one ADR clashes with any path of the other: same key, or a
    // value one sets where the other nests keys.
    const clash = [...leaves].find((p) => pathOwner.has(p)) ?? [...paths].find((p) => leafOwner.has(p));
    if (clash !== undefined) {
      throw new Error(
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
export function buildInstructions(root) {
  const { decided, pending } = resolve(root);
  return { decided, pending };
}

/** Every `accepted` ADR not superseded, sorted by reference. Throws like buildInstructions. */
export const adrsInForce = (root) => resolve(root).inForce;

export const heading = (adr) => (adr.title ? `${adr.title} (${adr.ref})` : adr.ref);

/** The contract output (see README). */
export function formatInstructions({ decided, pending }) {
  const lines = ['<!-- ontrack:begin -->', '## Project rules (ontrack)', ''];
  for (const adr of decided) lines.push(`### ${heading(adr)}`, '', '```yaml', ...adr.traits, '```', '');
  if (pending.length > 0) {
    lines.push('### Not yet decided', '', ...pending.map((adr) => `- ${heading(adr)}`), '');
  }
  lines.push('<!-- ontrack:end -->');
  return `${lines.join('\n')}\n`;
}
