#!/bin/zsh
# usage: run-one.sh <repo-dir-name> <adr-number>
S=${0:a:h}; d=$1; n=$2; out=$S/out/$d.$n.json
[ -s $out ] && exit 0
cd $S/repos/$d || exit 1
claude -p "$(cat $S/prompts/$d.$n.txt)" \
  --output-format json --no-session-persistence \
  --setting-sources project --strict-mcp-config \
  --permission-mode default \
  --allowedTools "Read" "Grep" "Glob" "Bash(git log:*)" "Bash(git show:*)" "Bash(git branch:*)" "Bash(git ls-files:*)" "Bash(git shortlog:*)" "Bash(git remote:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" "Bash(wc:*)" "Bash(find:*)" "Bash(grep:*)" \
  --disallowedTools "Edit" "Write" "NotebookEdit" "WebFetch" "WebSearch" "Agent" "Task" \
  > $out.tmp 2> $S/out/$d.$n.err && mv $out.tmp $out
