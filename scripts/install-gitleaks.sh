#!/bin/sh
# Installs gitleaks, the secret guard of ADR-0015, into the directory given as
# its one argument. gitleaks is a Go binary outside npm: it is pinned here by
# version and checksum (ADR-0011 rule 3), and here only. The test workflow and
# the apply sessions (.github/apply-session.md) both run this file.
#
# Linux x86-64 only: that is what a runner and a remote session are. On a
# workstation, install gitleaks with the system's package manager.
set -eu

GITLEAKS_VERSION=8.30.1
GITLEAKS_SHA256=551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb

dest="${1:?usage: install-gitleaks.sh <directory>}"

if [ "$(uname -s)-$(uname -m)" != "Linux-x86_64" ]; then
  echo "install-gitleaks: only Linux x86_64 is pinned here, this is $(uname -s) $(uname -m)" >&2
  exit 1
fi

archive="gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT

curl -fsSL -o "$work/$archive" \
  "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/${archive}"
echo "${GITLEAKS_SHA256}  $work/$archive" | sha256sum -c - > /dev/null
mkdir -p "$dest"
tar -xzf "$work/$archive" -C "$dest" gitleaks
"$dest/gitleaks" version
