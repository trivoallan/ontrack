# usage: python3 last.py <stream-json>... : cost, turns, tool writes attempted, then every assistant text
import json, sys
for f in sys.argv[1:]:
    texts, writes, res = [], [], {}
    for line in open(f):
        try: d = json.loads(line)
        except Exception: continue
        if d.get('type') == 'assistant':
            for c in d['message'].get('content', []):
                if c.get('type') == 'text': texts.append(c['text'])
                if c.get('type') == 'tool_use' and c['name'] in ('Edit', 'Write', 'NotebookEdit'): writes.append(c['input'].get('file_path'))
                if c.get('type') == 'tool_use' and c['name'] == 'Bash' and 'apply' in c['input'].get('command', ''): writes.append('BASH ' + c['input']['command'])
        if d.get('type') == 'result': res = d
    print(f'### {f.split("/")[-1]} cost={res.get("total_cost_usd", 0):.2f} turns={res.get("num_turns")} subtype={res.get("subtype")} writes={writes}')
    print('\n---\n'.join(texts[-2:]) if '--all' not in sys.argv else '\n---\n'.join(texts))
