# Copies run 4's raw results and scripts into research/desk-test-first-proposal/run4/.
import glob, os, shutil, subprocess, sys
E = os.path.dirname(os.path.abspath(__file__))
R = sys.argv[1]
for sub in ('proposals', 'surveys', 'sessions'):
    os.makedirs(f'{R}/{sub}', exist_ok=True)
for f in glob.glob(f'{E}/byrepo/*.md'):
    shutil.copy(f, f'{R}/proposals/')
def texts(f):
    return subprocess.run([sys.executable, '-I', f'{E}/last.py', f, '--all'], capture_output=True, text=True).stdout
for f in glob.glob(f'{E}/out-survey/*.json'):
    open(f'{R}/surveys/{os.path.basename(f)[:-5]}.md', 'w').write(texts(f))
msgs = ['(the sequence prompt)', 'I agree to that order. Go on.', "Skip this one: I don't want to rule it today.", 'I agree with this ruling. Write it.', "Let's stop the review here for today."]
for d in glob.glob(f'{E}/out-session/*'):
    name = os.path.basename(d); out = []
    for t in range(1, 6):
        status = open(f'{d}/turn{t}.status').read()
        body = texts(f'{d}/turn{t}.json').split('\n', 1)[-1]
        out.append(f'## Turn {t}, user: {msgs[t - 1]}\n\nFiles changed after this turn:\n\n```\n{status or "(none)"}\n```\n\n{body}\n')
    open(f'{R}/sessions/{name}.md', 'w').write('\n'.join(out))
    diff = subprocess.run(['git', 'diff'], cwd=f'{E}/sessions/{name}', capture_output=True, text=True).stdout
    open(f'{R}/sessions/{name}.diff', 'w').write(diff)
for f in ('run-survey.sh', 'run-adr.sh', 'run-session.sh', 'last.py', 'collect.py'):
    shutil.copy(f'{E}/{f}', R)
open(f'{R}/held-out-at.txt', 'w').write('pinojs__pino 8d6927c\ntj__commander.js a5a7dc0\nvuejs__pinia 4817135a\n')
