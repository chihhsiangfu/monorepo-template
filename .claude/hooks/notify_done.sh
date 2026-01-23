#!/bin/bash

# Exit early if running in remote environment
if [ "$CLAUDE_CODE_REMOTE" = "true" ]; then
  exit 0
fi

# Play a sound to notify that the process is done
afplay /System/Library/Sounds/Glass.aiff

exit 0
