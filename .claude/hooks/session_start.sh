#!/bin/bash

LOG_FILE="$CLAUDE_PROJECT_DIR/.claude/sessions.log"

echo "[$(date)] Starting session_start.sh" >> "$LOG_FILE"

# Exit early if not running in remote environment
if [ "$CLAUDE_CODE_REMOTE" != "true" ]; then
  echo "[$(date)] Not running in remote environment, skipping session_start.sh" >> "$LOG_FILE"
  exit 0
fi

# Copy environment variables
cp "$CLAUDE_PROJECT_DIR/apps/server/.env.example" "$CLAUDE_PROJECT_DIR/apps/server/.env"
cp "$CLAUDE_PROJECT_DIR/apps/web-with-auth/.env.example" "$CLAUDE_PROJECT_DIR/apps/web-with-auth/.env"

# Install project dependencies
pnpm install --frozen-lockfile

# Reset local database
pnpm local:db:reset

exit 0
