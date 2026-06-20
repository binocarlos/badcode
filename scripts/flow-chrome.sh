#!/usr/bin/env bash
# Launch a persistent Chrome with a remote-debugging port for Flow automation.
# Log into Google/Flow ONCE in this window; the session persists in .flow-profile/.
set -euo pipefail

PORT="${FLOW_CDP_PORT:-9222}"
PROFILE="$(cd "$(dirname "$0")/.." && pwd)/.flow-profile"

# Resolve a Chrome binary across platforms.
CHROME="${CHROME_BIN:-}"
if [ -z "$CHROME" ]; then
  for c in \
    "google-chrome" "google-chrome-stable" "chromium" "chromium-browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
if [ -z "$CHROME" ]; then echo "No Chrome found. Set CHROME_BIN=/path/to/chrome" >&2; exit 1; fi

echo "Launching Chrome on CDP port $PORT with profile $PROFILE"
echo "→ Log into Google/Flow in the window that opens, then leave it running."
exec "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run --no-default-browser-check \
  "https://labs.google/fx/tools/flow"
