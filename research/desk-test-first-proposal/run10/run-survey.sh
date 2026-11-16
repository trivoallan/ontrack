#!/bin/zsh
# usage: run-survey.sh <repo-dir-name>: the sequence prompt, headless and read-only
S=${0:a:h}; d=$1; out=$S/out-survey/$d.json
[ -s $out ] && exit 0
cd $S/run10/$d || exit 1
claude -p "$(cat $S/prompts-survey/$d.txt)" \
  --output-format stream-json --verbose --no-session-persistence \
  --setting-sources project --strict-mcp-config \
  --permission-mode default \
  --allowedTools "Read" "Grep" "Glob" "Bash(git log:*)" "Bash(git show:*)" "Bash(git branch:*)" "Bash(git ls-files:*)" "Bash(git shortlog:*)" "Bash(git remote:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" "Bash(wc:*)" "Bash(find:*)" "Bash(grep:*)" \
  --disallowedTools "Edit" "Write" "NotebookEdit" "WebFetch" "WebSearch" "Agent" "Task" \
  > $out.tmp 2> $S/out-survey/$d.err && mv $out.tmp $out
