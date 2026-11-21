# Deeper reading of run 11 from the five score reports and the blind key.
# usage: python3 -I analyse.py   (run from this directory)
import collections, glob, json, os, re
key = json.load(open('blind-key.json')); P = ('p8', 'p9', 'p10')
rows = collections.defaultdict(list)  # (repo, prompt) -> ADR numbers placed in the first group, one per scored key
for f in sorted(glob.glob('scores/*.md')):
    repo = os.path.basename(f)[:-3]; cur = None
    for line in open(f):
        m = re.match(r'^## (?:Survey )?([XYZ])\b', line)
        if m: cur = key[f'{repo}/{m.group(1)}']; continue
        if line.startswith('## '): cur = None; continue
        if cur and line.startswith('|'):
            c = [x.strip() for x in line.strip().strip('|').split('|')]
            if re.match(r'^\d{4}', c[0]): rows[(repo, cur)].append(c[0][:4])
repos = sorted({r for r, _ in rows}); adrs = {k: sorted(set(v)) for k, v in rows.items()}
ABSENCE_READ = {'0002', '0013', '0018', '0021', '0025'}  # placements the scorers called borderline, or read as visible by an absence
CLEAN = {'0004', '0010', '0014', '0016', '0023'}         # the other ADRs placed; fixed after seeing the data (post hoc)
print('placements per prompt:', {p: sum(len(adrs[(r, p)]) for r in repos) for p in P})
print('\n1. agreement between prompts, per repository (ADRs placed by 3 / 2 / 1 of the 3):')
t = collections.Counter()
for r in repos:
    k = collections.Counter(collections.Counter(a for p in P for a in adrs[(r, p)]).values()); t.update(k)
    print(f'   {r.split("__")[1]:8}', dict(sorted(k.items(), reverse=True)))
print('   total   ', dict(sorted(t.items(), reverse=True)))
print('\n2. what each prompt placed, by kind of reading:')
for p in P:
    a = {r: [x for x in adrs[(r, p)] if x in ABSENCE_READ] for r in repos}
    print(f'   {p:4} read-by-absence {sum(map(len, a.values())):2}  other {sum(len([x for x in adrs[(r, p)] if x in CLEAN]) for r in repos):2}  repos with more than one read-by-absence: {[r.split("__")[1] for r in repos if len(a[r]) > 1]}')
print('\n3. placements per ADR (15 surveys):', dict(sorted(collections.Counter(a for v in adrs.values() for a in v).items())))
print('   by prompt:', {p: dict(sorted(collections.Counter(a for r in repos for a in adrs[(r, p)]).items())) for p in P})
print('\n4. lowest-numbered first-group ADR, the first proposal if the group is taken in number order:')
for p in P: print(f'   {p:4}', [min(adrs[(r, p)]) if adrs[(r, p)] else None for r in repos])
print('\n5. coverage against the union of ADRs any prompt placed (every one scored visible):')
u = {r: set().union(*(set(adrs[(r, p)]) for p in P)) for r in repos}
print('   union', sum(map(len, u.values())), {p: sum(len(adrs[(r, p)]) for r in repos) for p in P})
for p in P: print(f'   left in the second group by {p}:', {r.split("__")[1]: sorted(u[r] - set(adrs[(r, p)])) for r in repos if u[r] - set(adrs[(r, p)])})
