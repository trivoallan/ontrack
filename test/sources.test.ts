import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { discoverSources } from '../src/sources.ts';

const roots: string[] = [];
after(() => {
  for (const root of roots) rmSync(root, { recursive: true, force: true });
  assert.ok(roots.every((root) => !existsSync(root)));
});

// Builds a project: `deps` go in package.json, `installed` maps an alias to
// its installed package.json. `devDeps` lands in devDependencies.
function project({
  deps = {},
  devDeps = {},
  installed = {},
  manifest = true,
}: {
  deps?: Record<string, string>;
  devDeps?: Record<string, string>;
  installed?: Record<string, unknown>;
  manifest?: boolean;
} = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'ontrack-sources-'));
  roots.push(root);
  if (manifest) {
    writeFileSync(
      path.join(root, 'package.json'),
      JSON.stringify({ name: 'project', dependencies: deps, devDependencies: devDeps }),
    );
  }
  for (const [alias, pkg] of Object.entries(installed)) {
    const dir = path.join(root, 'node_modules', alias);
    mkdirSync(dir, { recursive: true });
    writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg));
  }
  return root;
}

const source = (name: string, ontrack: { namespace?: string; adr?: string } = { namespace: name, adr: 'docs/adr' }) => ({ name, ontrack });

test('one source among other dependencies', () => {
  const root = project({
    deps: { 'left-pad': '^1' },
    devDeps: { platform: 'git+https://example.com/p.git' },
    installed: { platform: source('platform'), 'left-pad': { name: 'left-pad' } },
  });
  assert.deepEqual(discoverSources(root), [{
    namespace: 'platform',
    declaredNamespace: 'platform',
    packageName: 'platform',
    adrDir: path.join(root, 'node_modules', 'platform', 'docs', 'adr'),
  }]);
});

test('sources are sorted by namespace', () => {
  const root = project({
    deps: { zeta: '1', alpha: '1' },
    installed: { zeta: source('zeta'), alpha: source('alpha') },
  });
  assert.deepEqual(discoverSources(root).map((s) => s.namespace), ['alpha', 'zeta']);
});

test('no source', () => {
  const root = project({ deps: { 'left-pad': '1' }, installed: { 'left-pad': { name: 'left-pad' } } });
  assert.deepEqual(discoverSources(root), []);
});

test('a non-object ontrack key is not a source', () => {
  const root = project({ deps: { odd: '1' }, installed: { odd: { name: 'odd', ontrack: 'yes' } } });
  assert.deepEqual(discoverSources(root), []);
});

test('alias different from the package name', () => {
  const root = project({
    deps: { platform: 'git+https://example.com/adr-catalog.git' },
    installed: { platform: source('adr-catalog', { namespace: 'catalog', adr: 'docs/adr' }) },
  });
  const [s] = discoverSources(root);
  assert.equal(s.namespace, 'platform');
  assert.equal(s.declaredNamespace, 'catalog');
  assert.equal(s.packageName, 'adr-catalog');
});

test('a source without declared namespace', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: source('platform', { adr: 'adr' }) } });
  assert.equal(discoverSources(root)[0].declaredNamespace, null);
});

test('scoped alias is rejected', () => {
  const root = project({ deps: { '@acme/rules': '1' }, installed: { '@acme/rules': source('@acme/rules') } });
  assert.throws(() => discoverSources(root), /@acme\/rules.*unscoped alias/);
});

test('the alias local is rejected', () => {
  const root = project({ deps: { local: '1' }, installed: { local: source('adr-catalog') } });
  assert.throws(() => discoverSources(root), /"local".*another alias/);
});

test('adr path escaping the package is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: source('platform', { adr: '../../etc' }) } });
  assert.throws(() => discoverSources(root), /platform.*\.\.\/\.\.\/etc/);
});

test('missing adr is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: source('platform', { namespace: 'x' }) } });
  assert.throws(() => discoverSources(root), /platform.*"adr"/);
});

test('dependency not installed', () => {
  const root = project({ deps: { platform: '1' } });
  assert.throws(() => discoverSources(root), /platform.*npm install/);
});

test('no package.json', () => {
  const root = project({ manifest: false });
  assert.throws(() => discoverSources(root), new RegExp(`${path.join(root, 'package.json')}`));
});

test('dependencies that are not a string map make the manifest unreadable', () => {
  const root = project({ manifest: false });
  const manifest = path.join(root, 'package.json');
  writeFileSync(manifest, JSON.stringify({ name: 'project', dependencies: ['platform'] }));
  assert.throws(() => discoverSources(root), { message: `cannot read ${manifest}` });
});

test('an installed manifest without a name is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: { ontrack: { adr: 'docs/adr' } } } });
  assert.throws(() => discoverSources(root), /dependency "platform".*"name"/);
});

test('a namespace that is not a string is undeclared', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: { name: 'platform', ontrack: { adr: 'docs/adr', namespace: 3 } } } });
  assert.equal(discoverSources(root)[0].declaredNamespace, null);
});
