#!/usr/bin/env bash
# Launch a persistent Chrome/Chromium with a remote-debugging port for Flow automation.
# Log into Google/Flow ONCE in this window; the session persists in .flow-profile/.
#
# Resolution order for the browser binary:
#   1. $CHROME_BIN (explicit override)
#   2. A system Chrome/Chromium on PATH (Linux/macOS)
#   3. Playwright's bundled Linux Chromium (newest ~/.cache/ms-playwright/chromium-*).
#      This is the preferred path under WSL: it runs INSIDE WSL, so its debug port
#      is on WSL's own localhost — exactly where the Playwright MCP can attach —
#      and it renders via WSLg. (A Windows-side chrome.exe is intentionally NOT
#      used: under default WSL NAT networking its CDP port is not reachable here.)
set -euo pipefail

PORT="${FLOW_CDP_PORT:-9222}"
PROFILE="$(cd "$(dirname "$0")/.." && pwd)/.flow-profile"

# Resolve a browser binary.
CHROME="${CHROME_BIN:-}"
if [ -z "$CHROME" ]; then
  for c in \
    "google-chrome" "google-chrome-stable" "chromium" "chromium-browser" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; do
    if command -v "$c" >/dev/null 2>&1 || [ -x "$c" ]; then CHROME="$c"; break; fi
  done
fi
# Fall back to Playwright's bundled Chromium (newest build by numeric suffix).
if [ -z "$CHROME" ]; then
  for d in $(ls -d "$HOME"/.cache/ms-playwright/chromium-*/ 2>/dev/null | sort -t- -k2 -n -r); do
    if [ -x "${d}chrome-linux64/chrome" ]; then CHROME="${d}chrome-linux64/chrome"; break; fi
  done
fi
if [ -z "$CHROME" ]; then
  echo "No Chrome/Chromium found. Set CHROME_BIN=/path/to/chrome, or run: npx playwright install chromium" >&2
  exit 1
fi

echo "Launching: $CHROME"
echo "CDP port:  $PORT    profile: $PROFILE"
echo "→ Log into Google/Flow in the window that opens, then leave it running."
exec "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run --no-default-browser-check \
  --no-sandbox \
  "https://labs.google/fx/tools/flow"
