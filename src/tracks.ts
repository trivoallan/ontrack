import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ZodError } from 'zod';
import { ontrackKey, projectManifest, trackManifest } from './schemas.ts';

/** An installed package that ships ADRs. The npm alias is the namespace. */
export type Track = {
  namespace: string;
  declaredNamespace: string | null;
  packageName: string;
  adrDir: string;
};

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

/**
 * Lists the project's tracks: npm dependencies whose installed
 * package.json carries an `ontrack` object. Sorted by namespace.
 */
export function discoverTracks(projectRoot: string): Track[] {
  const manifest = path.join(projectRoot, 'package.json');
  let aliases: string[];
  try {
    const project = projectManifest.parse(readJson(manifest));
    aliases = Object.keys({ ...project.dependencies, ...project.devDependencies });
  } catch (err) {
    // A missing file is a wrong directory far more often than a missing
    // manifest: say where to run from. Any other cause is the file's content,
    // and the reader fixes it only when told which.
    const why =
      (err as NodeJS.ErrnoException).code === 'ENOENT' ? '; run ontrack from the root of an npm project'
      : err instanceof SyntaxError ? `: it is not valid JSON (${err.message})`
      : err instanceof ZodError ? `: "${err.issues[0].path.join('.')}" must map names to versions`
      : '';
    throw new Error(`cannot read ${manifest}${why}`);
  }

  const tracks: Track[] = [];

  for (const alias of aliases) {
    const pkgDir = path.join(projectRoot, 'node_modules', alias);
    let raw: unknown;
    try {
      raw = readJson(path.join(pkgDir, 'package.json'));
    } catch {
      throw new Error(`dependency "${alias}" is not installed; run npm install`);
    }
    const pkg = trackManifest.safeParse(raw);
    if (!pkg.success) {
      const field = pkg.error.issues[0].path.join('.');
      throw new Error(`dependency "${alias}" has an invalid package.json${field && ` ("${field}")`}`);
    }

    const key = ontrackKey.safeParse(pkg.data.ontrack);
    // An issue at the root means `ontrack` is absent or not an object: the
    // dependency is not a track. Any other issue names a field of the key.
    if (!key.success && key.error.issues[0].path.length === 0) continue;

    if (alias.startsWith('@')) {
      throw new Error(`track "${alias}" must be installed under an unscoped alias`);
    }
    if (alias === 'local') {
      throw new Error('track "local" must be installed under another alias: local names the repository\'s own ADRs');
    }
    if (!key.success) {
      const field = key.error.issues[0].path.join('.');
      throw new Error(`track "${alias}" has no "${field}" string in its ontrack key`);
    }
    const { adr, namespace } = key.data;
    const adrDir = path.resolve(pkgDir, adr);
    const inside = path.relative(pkgDir, adrDir);
    if (inside.startsWith('..') || path.isAbsolute(inside)) {
      throw new Error(`track "${alias}" declares adr "${adr}" outside its package`);
    }

    tracks.push({
      namespace: alias,
      declaredNamespace: namespace ?? null,
      packageName: pkg.data.name,
      adrDir,
    });
  }

  return tracks.sort((a, b) => a.namespace.localeCompare(b.namespace));
}
