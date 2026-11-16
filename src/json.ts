// The `--json` form of what the commands print (see docs/commands.md): the
// same facts as the text, as one JSON document on standard output. Built
// here from the data the text formatters read, so the two cannot disagree.
// Every key is always present, with `null` where the text prints nothing,
// and every path is relative to the repository, with forward slashes. The
// types are those of the models the published schemas come from
// (src/documents.ts).

type PlannedJson = PlanDocument['tracks'][number]['adrs'][number];
type AdrJson = InstructionsDocument['pending'][number];
import path from 'node:path';
import type { Action } from './apply.ts';
import type { CheckResult } from './check.ts';
import type { ApplyDocument, CheckDocument, ErrorDocument, InstructionsDocument, PlanDocument, ReviewDocument } from './documents.ts';
import type { Io } from './cli.ts';
import { schemaOf } from './documents.ts';
import { DOCS, OntrackError } from './errors.ts';
import type { Adr, Instructions } from './instructions.ts';
import { stem } from './plan.ts';
import type { Plan, PlannedAdr } from './plan.ts';

export const printJson = (out: Io['stdout'], value: unknown) => out.write(`${JSON.stringify(value, null, 2)}\n`);

const relative = (root: string, file: string) => path.relative(root, file).split(path.sep).join('/');
const folder = (namespace: string) => `docs/adr/${namespace}/`;

const plannedJson = (adr: PlannedAdr): PlannedJson => ({
  name: stem(adr.name),
  title: adr.title,
  category: adr.category,
  status: adr.status ?? null,
  revision: adr.category === 'revised' || adr.category === 'undetermined' ? { from: adr.from ?? null, to: adr.to ?? null } : null,
  check: adr.check ?? null,
});

/** The tracks of a plan: every ADR, the unchanged ones too, as `plan --all` lists them. */
export const planJson = (plan: Plan): PlanDocument['tracks'] =>
  plan.map((track) => ({
    namespace: track.namespace,
    adrs: track.adrs.map(plannedJson),
    rename: track.rename === undefined ? null : { from: folder(track.rename), to: folder(track.namespace) },
    migration: track.migration,
  }));

export const actionJson = (root: string, a: Action): ApplyDocument['actions'][number] => ({
  kind: a.kind,
  track: a.track.namespace,
  adr: 'adr' in a ? plannedJson(a.adr) : null,
  from: 'from' in a ? relative(root, a.from) : null,
  to: relative(root, a.to),
});

export const adrJson = (adr: Adr): AdrJson => ({ ref: adr.ref, title: adr.title, status: adr.status, path: adr.path });

export const instructionsJson = ({ decided, pending }: Instructions, hint: string, block: string): InstructionsDocument => ({
  $schema: schemaOf('instructions'),
  hint,
  decided: decided.map((adr) => ({ ...adrJson(adr), traits: adr.traits.join('\n') })),
  pending: pending.map(adrJson),
  block,
});

export function checksJson(results: CheckResult[]): CheckDocument {
  const counts = { fail: 0, pass: 0, unchecked: 0 };
  for (const { status } of results) counts[status] += 1;
  return {
    $schema: schemaOf('check'),
    results: results.map(({ adr, status, output }) => ({ ...adrJson(adr), check: adr.check, result: status, output })),
    counts,
  };
}

/** A failure, for standard error. `code` and `docs` are null when ontrack did not foresee it. */
export function errorJson(err: unknown): ErrorDocument {
  const code = err instanceof OntrackError ? err.code : null;
  return { $schema: schemaOf('error'), error: { code, message: (err as Error).message, docs: code && `${DOCS}#${code.toLowerCase()}` } };
}
