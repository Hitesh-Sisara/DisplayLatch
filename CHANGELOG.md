# Changelog

## 1.0.0 (2026-11-18)

First public release.

- **Keep monitors connected:** automatically reconnects external monitors that macOS leaves dark or off the desktop (WindowServer independent output or a disabled display) after sleep, wake, a restart or a replug, and restores their position.
- Connect or disconnect any display without unplugging it.
- Hardware brightness over DDC/CI for external monitors, and built-in display brightness.
- One brightness slider for all displays.
- Resolution slider and menu.
- `displaylatch` CLI: `list`, `fix`, `connect`, `disconnect`, `brightness`, `resolution`, `move`.
- Starts at login (Login Items), optional daily update check, log file.
