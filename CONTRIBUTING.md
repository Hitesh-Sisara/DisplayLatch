# Contributing to DisplayLatch

Thanks for helping! DisplayLatch is a small app, so contributing is simple.

## Reporting a problem

Open an [issue](https://github.com/Hitesh-Sisara/DisplayLatch/issues/new/choose) and include:

- your Mac model and macOS version
- each monitor's model and how it's connected (HDMI port, USB-C, adapter, dock)
- the output of `displaylatch list` (you can mask serial numbers)
- the last lines of `~/Library/Logs/DisplayLatch.log`

## Building

```bash
swift build                  # debug build
swift test                   # unit tests
./scripts/install.sh         # release build into /Applications
.build/debug/DisplayLatch --demo --preview   # UI with sample monitors, no hardware touched
```

You need Xcode 16 or later and an Apple silicon Mac.

## Code layout

| File | What's in it |
|---|---|
| `Sources/DisplayLatch/Displays.swift` | Finding displays, connect and disconnect, resolution, position |
| `Sources/DisplayLatch/DDC.swift` | DDC/CI packets and I2C over IOAVService |
| `Sources/DisplayLatch/Private.swift` | Private macOS functions, looked up at runtime |
| `Sources/DisplayLatch/Manager.swift` | App state, auto-reconnect, brightness writes |
| `Sources/DisplayLatch/Views.swift` | SwiftUI menu-bar popover |
| `Sources/DisplayLatch/main.swift` | CLI commands and app startup |

## Pull requests

- Keep each pull request focused on one change, and add a test for any pure logic.
- Don't copy code or assets from closed-source apps. DisplayLatch is clean-room.
- Releases: bump the version in your tag (`git tag v1.2.0 && git push --tags`). CI builds and publishes the DMG.
