#!/bin/bash
# Double-click this file to serve snerta to your phone.
# Closing this window, or pressing Control-C in it, stops the server.
cd "$(dirname "$0")" || exit 1

printf '\n  snerta — starting local server\n\n'

if ! command -v node >/dev/null 2>&1; then
  printf '  Node.js is not installed on this Mac.\n'
  printf '  Download the LTS installer from https://nodejs.org, run it,\n'
  printf '  then double-click this file again.\n\n'
  read -r -p '  Press Return to close. '
  exit 1
fi

# vite ships a native compiler binary per platform. If node_modules was installed
# on a different OS, the folder for this one exists but is empty, and vite dies
# with "Cannot find native binding". Check for the real binary, not the folder.
case "$(uname -s)-$(uname -m)" in
  Darwin-arm64) BINDING="node_modules/@rolldown/binding-darwin-arm64" ;;
  Darwin-x86_64) BINDING="node_modules/@rolldown/binding-darwin-x64" ;;
  *) BINDING="" ;;
esac

needs_install=0
[ -d node_modules ] || needs_install=1
if [ "$needs_install" = "0" ] && [ -n "$BINDING" ] && ! ls "$BINDING"/*.node >/dev/null 2>&1; then
  printf '  Dependencies were installed for a different system.\n'
  printf '  Reinstalling them for this Mac...\n\n'
  rm -rf node_modules package-lock.json
  needs_install=1
fi
# A fresh download has package.json but no packages yet.
if [ "$needs_install" = "0" ] && [ ! -d node_modules/@fontsource-variable/montserrat ]; then
  printf '  Some packages are missing. Installing...\n\n'
  needs_install=1
fi

if [ "$needs_install" = "1" ]; then
  [ -d node_modules ] || printf '  Installing dependencies (one time, up to a minute)...\n\n'
  if ! npm install --no-audit --no-fund; then
    printf '\n  Install failed. Check your internet connection and try again.\n\n'
    read -r -p '  Press Return to close. '
    exit 1
  fi
  printf '\n'
fi

# A dev server left running from an earlier go — possibly from a different copy of
# the folder — keeps port 5173. Vite would then quietly take 5174 while the line
# below still said 5173, and the phone would show the old version from the old copy.
# That is the likeliest cause of "I refreshed and nothing changed".
HOLDER=$(lsof -nP -iTCP:5173 -sTCP:LISTEN -t 2>/dev/null | head -1)
if [ -n "$HOLDER" ]; then
  HOLDER_DIR=$(lsof -a -p "$HOLDER" -d cwd -Fn 2>/dev/null | sed -n 's/^n//p' | head -1)
  printf '  Port 5173 is already being used by something else.\n'
  [ -n "$HOLDER_DIR" ] && printf '  It is running from: %s\n' "$HOLDER_DIR"
  printf '\n  That is probably a server left over from last time. If it keeps\n'
  printf '  running, your phone would load the OLD version from it.\n\n'
  read -r -p '  Press Return to stop it and carry on, or close this window to cancel. '
  kill "$HOLDER" 2>/dev/null
  sleep 2
  kill -9 "$HOLDER" 2>/dev/null
  printf '\n  Stopped it.\n\n'
fi

# What is actually in this folder, read from the source rather than remembered, so
# the phone and this window cannot disagree about which version is being served.
BUILD=$(sed -n "s/.*build: '\([^']*\)'.*/\1/p" src/lib/export.ts 2>/dev/null | head -1)
TRIAL_COMMAS=$(sed -n "s/^export const TARGETS[^=]*=[^[]*\[\(.*\)\].*/\1/p" src/lib/trial.ts 2>/dev/null | tr -cd ',' | wc -c | tr -d ' ')
NEWEST=$(find src docs -type f -newer package.json 2>/dev/null | wc -l | tr -d ' ')

IP=""
for IFACE in en0 en1 en2; do
  IP=$(ipconfig getifaddr "$IFACE" 2>/dev/null) && [ -n "$IP" ] && break
done

printf '  ----------------------------------------------\n'
if [ -n "$IP" ]; then
  printf '   On your phone, open:   http://%s:5173\n' "$IP"
  printf '   (phone must be on the same Wi-Fi as this Mac)\n'
else
  printf '   Could not detect a Wi-Fi address. Check that this\n'
  printf '   Mac is on Wi-Fi, then use the Network: line below.\n'
fi
printf '  ----------------------------------------------\n\n'

printf '  Serving from: %s\n' "$PWD"
if [ -n "$BUILD" ]; then
  printf '  Version:      %s' "$BUILD"
  [ "$TRIAL_COMMAS" -gt 0 ] && printf ' · %s timed tasks' "$((TRIAL_COMMAS + 1))"
  printf '\n'
else
  printf '  Version:      could not read it from src/ — is this the right folder?\n'
fi
printf '\n'
printf '  Check that against what you expect. If it says something older than\n'
printf '  you were told, this is the wrong copy of the folder — not a stale page.\n\n'
printf '  On the phone, a plain refresh is sometimes not enough in Safari.\n'
printf '  Close the tab and open the link again instead.\n'
printf '  Leave this window open while you test.\n\n'

npm run dev -- --host --strictPort
