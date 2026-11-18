#!/bin/zsh
# Build and install into /Applications, link the CLI, and launch.
# The app registers itself as a login item on first launch (System Settings › Login Items).
set -euo pipefail
ROOT="${0:A:h:h}"
source "$ROOT/scripts/config.sh"
"$ROOT/scripts/build-app.sh" "${1:-0.0.0-dev}" >/dev/null
DEST="/Applications/$APP_NAME.app"

# Stop a running copy (and the LaunchAgent used by early builds).
launchctl bootout "gui/$(id -u)/$BUNDLE_ID" 2>/dev/null || true
rm -f "$HOME/Library/LaunchAgents/$BUNDLE_ID.plist"
pkill -x "$APP_NAME" 2>/dev/null || true
sleep 0.5

rm -rf "$DEST"
cp -R "$ROOT/dist/$APP_NAME.app" "$DEST"
mkdir -p "$HOME/.local/bin"
ln -sf "$DEST/Contents/MacOS/$APP_NAME" "$HOME/.local/bin/${APP_NAME:l}"
open "$DEST"
echo "Installed $DEST; CLI: ${APP_NAME:l}"
