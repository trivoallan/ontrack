import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ontrackKey, projectManifest, sourceManifest } from './schemas.ts';

/** An installed package that ships ADRs. The npm alias is the namespace. */
export type Source = {
  namespace: string;
  declaredNamespace: string | null;
  packageName: string;
  adrDir: string;
};

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * Lists the project's ontrack sources: npm dependencies whose installed
 * package.json carries an `ontrack` object. Sorted by namespace.
 */
export function discoverSources(projectRoot: string): Source[] {
  const manifest = path.join(projectRoot, 'package.json');
  let aliases: string[];
  try {
    const project = projectManifest.parse(readJson(manifest));
    aliases = Object.keys({ ...project.dependencies, ...project.devDependencies });
  } catch {
    throw new Error(`cannot read ${manifest}`);
  }

  const sources: Source[] = [];

  for (const alias of aliases) {
    const pkgDir = path.join(projectRoot, 'node_modules', alias);
    let raw: unknown;
    try {
      raw = readJson(path.join(pkgDir, 'package.json'));
    } catch {
      throw new Error(`dependency "${alias}" is not installed; run npm install`);
    }
    const pkg = sourceManifest.safeParse(raw);
    if (!pkg.success) {
      const field = pkg.error.issues[0].path.join('.');
      throw new Error(`dependency "${alias}" has an invalid package.json${field && ` ("${field}")`}`);
    }

    const key = ontrackKey.safeParse(pkg.data.ontrack);
    // An issue at the root means `ontrack` is absent or not an object: the
    // dependency is not a source. Any other issue names a field of the key.
    if (!key.success && key.error.issues[0].path.length === 0) continue;

    if (alias.startsWith('@')) {
      throw new Error(`source "${alias}" must be installed under an unscoped alias`);
    }
    if (!key.success) {
      const field = key.error.issues[0].path.join('.');
      throw new Error(`source "${alias}" has no "${field}" string in its ontrack key`);
    }
    const { adr, namespace } = key.data;
    const adrDir = path.resolve(pkgDir, adr);
    const inside = path.relative(pkgDir, adrDir);
    if (inside.startsWith('..') || path.isAbsolute(inside)) {
      throw new Error(`source "${alias}" declares adr "${adr}" outside its package`);
    }

    sources.push({
      namespace: alias,
      declaredNamespace: namespace ?? null,
      packageName: pkg.data.name,
      adrDir,
    });
  }

  return sources.sort((a, b) => a.namespace.localeCompare(b.namespace));
}
