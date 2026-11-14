import { readFileSync } from 'node:fs';
import path from 'node:path';

// The part of a package.json ontrack reads. Taken on trust: JSON.parse is
// untyped, and validating it is the zod change's job.
type Manifest = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  ontrack?: unknown;
};

/** An installed package that ships ADRs. The npm alias is the namespace. */
export type Source = {
  namespace: string;
  declaredNamespace: string | null;
  packageName: string;
  adrDir: string;
};

function readJson(file: string): Manifest {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Lists the project's ontrack sources: npm dependencies whose installed
 * package.json carries an `ontrack` object. Sorted by namespace.
 */
export function discoverSources(projectRoot: string): Source[] {
  const manifest = path.join(projectRoot, 'package.json');
  let project: Manifest;
  try {
    project = readJson(manifest);
  } catch {
    throw new Error(`cannot read ${manifest}`);
  }

  const aliases = Object.keys({ ...project.dependencies, ...project.devDependencies });
  const sources: Source[] = [];

  for (const alias of aliases) {
    const pkgDir = path.join(projectRoot, 'node_modules', alias);
    let pkg: Manifest;
    try {
      pkg = readJson(path.join(pkgDir, 'package.json'));
    } catch {
      throw new Error(`dependency "${alias}" is not installed; run npm install`);
    }
    if (!isObject(pkg.ontrack)) continue;

    if (alias.startsWith('@')) {
      throw new Error(`source "${alias}" must be installed under an unscoped alias`);
    }
    const { adr, namespace } = pkg.ontrack;
    if (typeof adr !== 'string') {
      throw new Error(`source "${alias}" has no "adr" string in its ontrack key`);
    }
    const adrDir = path.resolve(pkgDir, adr);
    const inside = path.relative(pkgDir, adrDir);
    if (inside.startsWith('..') || path.isAbsolute(inside)) {
      throw new Error(`source "${alias}" declares adr "${adr}" outside its package`);
    }

    sources.push({
      namespace: alias,
      declaredNamespace: typeof namespace === 'string' ? namespace : null,
      packageName: pkg.name,
      adrDir,
    });
  }

  return sources.sort((a, b) => a.namespace.localeCompare(b.namespace));
}
