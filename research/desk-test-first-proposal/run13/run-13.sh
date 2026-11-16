#!/bin/zsh
# usage: run-cmp.sh <prompt-version> <repo-dir-name>: one survey, headless, read-only, pinned to Sonnet 5.5
S=${0:a:h}; v=$1; d=$2; out=$S/out-13/$v.$d.json
[ -s $out ] && exit 0
cd $S/run13/$d || exit 1
claude -p "$(cat $S/prompts-13/$v.$d.txt)" --model claude-sonnet-5-5 \
  --output-format stream-json --verbose --no-session-persistence \
  --setting-sources project --strict-mcp-config \
  --permission-mode default \
  --allowedTools "Read" "Grep" "Glob" "Bash(git log:*)" "Bash(git show:*)" "Bash(git branch:*)" "Bash(git ls-files:*)" "Bash(git shortlog:*)" "Bash(git remote:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" "Bash(wc:*)" "Bash(find:*)" "Bash(grep:*)" \
  --disallowedTools "Edit" "Write" "NotebookEdit" "WebFetch" "WebSearch" "Agent" "Task" \
  > $out.tmp 2> $S/out-13/$v.$d.err && mv $out.tmp $out
