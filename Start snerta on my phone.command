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
printf '  If the phone shows an old version, pull down to refresh it.\n'
printf '  Leave this window open while you test.\n\n'

npm run dev -- --host
