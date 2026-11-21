#!/bin/zsh
# usage: run-session.sh <repo-dir-name>: a scripted five-turn review (agree to the order, skip, agree, stop)
S=${0:a:h}; d=$1; o=$S/out-session/$d; mkdir -p $o
cd $S/sessions/$d || exit 1
W=/Users/tristan/Documents/Workspaces/trivoallan/ontrack/.claude/worktrees/pm-skills-solution-brief-621548
common=(--output-format stream-json --verbose --setting-sources project --strict-mcp-config --permission-mode acceptEdits
  --allowedTools "Read" "Grep" "Glob" "Edit" "Write" "Bash(git log:*)" "Bash(git show:*)" "Bash(git branch:*)" "Bash(git ls-files:*)" "Bash(git shortlog:*)" "Bash(git remote:*)" "Bash(git status:*)" "Bash(git diff:*)" "Bash(ls:*)" "Bash(cat:*)" "Bash(head:*)" "Bash(wc:*)" "Bash(find:*)" "Bash(grep:*)" "Bash(npx ontrack apply:*)" "Bash(npx -p @trivoallan/ontrack ontrack apply:*)"
  --disallowedTools "NotebookEdit" "WebFetch" "WebSearch" "Agent" "Task" "AskUserQuestion" "Bash(npm:*)" "Bash(pnpm:*)" "Bash(git commit:*)" "Bash(git checkout:*)" "Bash(git reset:*)")
snap() { git status --porcelain docs AGENTS.md > $o/turn$1.status; git diff --stat >> $o/turn$1.status; }
sid=$(uuidgen | tr A-Z a-z)
node $W/bin/ontrack.ts review > $o/prompt.txt
claude -p "$(cat $o/prompt.txt)" --session-id $sid $common > $o/turn1.json 2> $o/turn1.err; snap 1
i=2
for msg in "I agree to that order. Go on." "Skip this one: I don't want to rule it today." "I agree with this ruling. Write it." "Let's stop the review here for today."; do
  claude -p "$msg" --resume $sid $common > $o/turn$i.json 2> $o/turn$i.err; snap $i; i=$((i+1))
done
