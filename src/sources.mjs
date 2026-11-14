import { readFileSync } from 'node:fs';
import path from 'node:path';

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Lists the project's ontrack sources: npm dependencies whose installed
 * package.json carries an `ontrack` object. The npm alias is the namespace.
 * @returns {{ namespace: string, declaredNamespace: string | null,
 *   packageName: string, adrDir: string }[]} sorted by namespace
 */
export function discoverSources(projectRoot) {
  const manifest = path.join(projectRoot, 'package.json');
  let project;
  try {
    project = readJson(manifest);
  } catch {
    throw new Error(`cannot read ${manifest}`);
  }

  const aliases = Object.keys({ ...project.dependencies, ...project.devDependencies });
  const sources = [];

  for (const alias of aliases) {
    const pkgDir = path.join(projectRoot, 'node_modules', alias);
    let pkg;
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
