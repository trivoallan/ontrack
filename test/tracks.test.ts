import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { discoverTracks } from '../src/tracks.ts';

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
  const root = mkdtempSync(path.join(tmpdir(), 'ontrack-tracks-'));
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

const track = (name: string, ontrack: { namespace?: string; adr?: string } = { namespace: name, adr: 'docs/adr' }) => ({ name, ontrack });

test('one track among other dependencies', () => {
  const root = project({
    deps: { 'left-pad': '^1' },
    devDeps: { platform: 'git+https://example.com/p.git' },
    installed: { platform: track('platform'), 'left-pad': { name: 'left-pad' } },
  });
  assert.deepEqual(discoverTracks(root), [{
    namespace: 'platform',
    declaredNamespace: 'platform',
    packageName: 'platform',
    adrDir: path.join(root, 'node_modules', 'platform', 'docs', 'adr'),
  }]);
});

test('tracks are sorted by namespace', () => {
  const root = project({
    deps: { zeta: '1', alpha: '1' },
    installed: { zeta: track('zeta'), alpha: track('alpha') },
  });
  assert.deepEqual(discoverTracks(root).map((s) => s.namespace), ['alpha', 'zeta']);
});

test('no track', () => {
  const root = project({ deps: { 'left-pad': '1' }, installed: { 'left-pad': { name: 'left-pad' } } });
  assert.deepEqual(discoverTracks(root), []);
});

test('a non-object ontrack key is not a track', () => {
  const root = project({ deps: { odd: '1' }, installed: { odd: { name: 'odd', ontrack: 'yes' } } });
  assert.deepEqual(discoverTracks(root), []);
});

test('alias different from the package name', () => {
  const root = project({
    deps: { platform: 'git+https://example.com/adr-catalog.git' },
    installed: { platform: track('adr-catalog', { namespace: 'catalog', adr: 'docs/adr' }) },
  });
  const [s] = discoverTracks(root);
  assert.equal(s.namespace, 'platform');
  assert.equal(s.declaredNamespace, 'catalog');
  assert.equal(s.packageName, 'adr-catalog');
});

test('a track without declared namespace', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: track('platform', { adr: 'adr' }) } });
  assert.equal(discoverTracks(root)[0].declaredNamespace, null);
});

test('scoped alias is rejected', () => {
  const root = project({ deps: { '@acme/rules': '1' }, installed: { '@acme/rules': track('@acme/rules') } });
  assert.throws(() => discoverTracks(root), /@acme\/rules.*unscoped alias/);
});

test('the alias local is rejected', () => {
  const root = project({ deps: { local: '1' }, installed: { local: track('adr-catalog') } });
  assert.throws(() => discoverTracks(root), /"local".*another alias/);
});

test('adr path escaping the package is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: track('platform', { adr: '../../etc' }) } });
  assert.throws(() => discoverTracks(root), /platform.*\.\.\/\.\.\/etc/);
});

test('missing adr is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: track('platform', { namespace: 'x' }) } });
  assert.throws(() => discoverTracks(root), /platform.*"adr"/);
});

test('dependency not installed', () => {
  const root = project({ deps: { platform: '1' } });
  assert.throws(() => discoverTracks(root), /platform.*npm install/);
});

test('no package.json', () => {
  const root = project({ manifest: false });
  assert.throws(() => discoverTracks(root), new RegExp(`${path.join(root, 'package.json')}`));
});

test('dependencies that are not a string map make the manifest unreadable', () => {
  const root = project({ manifest: false });
  const manifest = path.join(root, 'package.json');
  writeFileSync(manifest, JSON.stringify({ name: 'project', dependencies: ['platform'] }));
  assert.throws(() => discoverTracks(root), { message: `cannot read ${manifest}` });
});

test('an installed manifest without a name is rejected', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: { ontrack: { adr: 'docs/adr' } } } });
  assert.throws(() => discoverTracks(root), /dependency "platform".*"name"/);
});

test('a namespace that is not a string is undeclared', () => {
  const root = project({ deps: { platform: '1' }, installed: { platform: { name: 'platform', ontrack: { adr: 'docs/adr', namespace: 3 } } } });
  assert.equal(discoverTracks(root)[0].declaredNamespace, null);
});
