#!/bin/zsh
# usage: run-adr.sh <repo-dir-name> <adr-number>: one named-ADR review, headless and read-only
S=${0:a:h}; d=$1; n=$2; out=$S/out-adr/$d.$n.json
[ -s $out ] && exit 0
cd $S/repos/$d 2>/dev/null || cd $S/held/$d || exit 1
claude -p "$(cat $S/prompts-adr/$d.$n.txt)" \
  --output-format stream-json --verbose --no-session-persistence \
  --setting-sources project --strict-mcp-config \
  --permission-mode default \
  --allowedTools "Read" "Grep" "Glob" "Bash(git log:*)" "Bash(git show:*)" "Bash(git branch:*)" "Bash(git ls-files:*)" "Bash(git shortlog:*)" "Bash(git remote:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" "Bash(wc:*)" "Bash(find:*)" "Bash(grep:*)" \
  --disallowedTools "Edit" "Write" "NotebookEdit" "WebFetch" "WebSearch" "Agent" "Task" \
  > $out.tmp 2> $S/out-adr/$d.$n.err && mv $out.tmp $out
