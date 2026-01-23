#!/bin/bash

LOG_FILE=~/.claude/sessions.log

echo "[$(date)] Starting install_pkgs.sh" >> "$LOG_FILE"

# Exit early if not running in remote environment
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  exit 0
fi

# Install project dependencies
pnpm install --frozen-lockfile

exit 0
