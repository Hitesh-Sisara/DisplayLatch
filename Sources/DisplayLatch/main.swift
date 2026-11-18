import AppKit
import Foundation
import SwiftUI

// `DisplayLatch <command>` runs as a CLI; no arguments starts the menu-bar app.
let args = Array(CommandLine.arguments.dropFirst())

func printList() {
    for d in Displays.all() {
        let state = d.isOnline ? "online " : "OFFLINE"
        let mode = d.currentMode?.label ?? "-"
        print("\(d.id)\t\(state)\t\(d.name)\t\(d.serial ?? "")\t\(mode)\(d.isMain ? "\tmain" : "")")
    }
}

func find(_ s: String) -> Display? {
    Displays.all().first { "\($0.id)" == s || $0.serial == s || $0.name.lowercased() == s.lowercased() }
}

if let cmd = args.first, !cmd.hasPrefix("-") {
    switch cmd {
    case "list":
        printList()
    case "fix":
        let offline = Displays.all().filter { !$0.isOnline && !$0.isBuiltin }
        if offline.isEmpty { print("All attached monitors are on the desktop.") }
        for d in offline {
            let ok = Displays.setConnected(d.id, true)
            print("\(ok ? "Reconnected" : "FAILED to reconnect") \(d.name) (id \(d.id))")
            Log.write("CLI fix: \(d.name) [id \(d.id)] -> \(ok)")
        }
        if !offline.isEmpty { sleep(2); printList() }
    case "connect", "disconnect":
        guard args.count > 1, let d = find(args[1]) else { print("usage: displaylatch \(cmd) <id|serial|name>"); exit(2) }
        let on = cmd == "connect"
        if !on && Displays.all().filter(\.isOnline).count <= 1 { print("Refusing to disconnect the only screen."); exit(1) }
        print(Displays.setConnected(d.id, on) ? "ok" : "failed")
        sleep(2); printList()
    case "brightness":
        if args.count > 1, args[1] == "all" {
            let targets = Displays.all().filter(\.isOnline)
            if args.count > 2, let v = Double(args[2]) { for d in targets { Displays.setBrightness(of: d, v / 100) } }
            for d in targets { print("\(d.name)\t" + (Displays.brightness(of: d).map { "\(Int(($0 * 100).rounded()))%" } ?? "not readable")) }
            exit(0)
        }
        guard args.count > 1, let d = find(args[1]) else { print("usage: displaylatch brightness <id|serial|name|all> [0-100]"); exit(2) }
        if args.count > 2, let v = Double(args[2]) {
            Displays.setBrightness(of: d, v / 100)
        }
        print(Displays.brightness(of: d).map { "\(Int(($0 * 100).rounded()))%" } ?? "brightness not readable")
    case "resolution":
        guard args.count > 1, let d = find(args[1]) else { print("usage: displaylatch resolution <id|serial|name> [WIDTHxHEIGHT[@2x]]"); exit(2) }
        if args.count > 2 {
            let spec = args[2].lowercased()
            let hi = spec.hasSuffix("@2x")
            let wh = spec.replacingOccurrences(of: "@2x", with: "").split(separator: "x").compactMap { Int($0) }
            guard wh.count == 2, let m = d.modes.first(where: { $0.width == wh[0] && $0.height == wh[1] && $0.hiDPI == hi }) else {
                print("no such mode; available: " + d.modes.map { "\($0.width)x\($0.height)\($0.hiDPI ? "@2x" : "")" }.joined(separator: " ")); exit(1)
            }
            print(Displays.apply(m, to: d.id) ? "ok" : "failed")
        } else {
            print("current: \(d.currentMode?.label ?? "-")")
            print("available: " + d.modes.map { "\($0.width)x\($0.height)\($0.hiDPI ? "@2x" : "")" }.joined(separator: " "))
        }
    case "move":
        guard args.count > 3, let d = find(args[1]), let x = Int32(args[2]), let y = Int32(args[3]) else { print("usage: displaylatch move <id|serial|name> X Y"); exit(2) }
        print(Displays.setOrigin(d.id, x: x, y: y) ? "ok" : "failed")
    case "snapshot": // renders the popover to a PNG (for checking the UI)
        let out = args.count > 1 ? args[1] : "displaylatch-menu.png"
        MainActor.assumeIsolated {
            let m = DisplayManager.shared
            m.refresh(reason: "snapshot")
            for d in m.displays where d.isOnline { if let b = Displays.brightness(of: d) { m.brightness[d.key] = b } }
            let view = MenuContent(initiallyExpandAll: true).environmentObject(m)
                .background(Color(nsColor: .windowBackgroundColor)).environment(\.colorScheme, .dark)
            let r = ImageRenderer(content: view)
            r.scale = 2
            if let img = r.nsImage, let tiff = img.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
               let png = rep.representation(using: .png, properties: [:]) {
                try? png.write(to: URL(fileURLWithPath: out)); print(out)
            } else { print("render failed") }
        }
    case "help", "-h", "--help":
        print("""
        DisplayLatch: menu-bar display manager
          displaylatch                    start the menu-bar app
          displaylatch list               list displays (id, state, name, serial, mode)
          displaylatch fix                bring back attached monitors that are off the desktop
          displaylatch connect <d>        put a display on the desktop
          displaylatch disconnect <d>     take a display off the desktop
          displaylatch brightness <d|all> [n] read or set hardware brightness (0-100)
          displaylatch resolution <d> [m] list modes or set one, e.g. 1920x1080@2x
          displaylatch move <d> X Y       place a display on the desktop (main is at 0,0)
        <d> = display id, serial (e.g. ABC1234567) or name
        """)
    default:
        print("unknown command '\(cmd)'; try: displaylatch help"); exit(2)
    }
    exit(0)
}

// `--preview` shows the popover in a normal window (for screenshots).
if CommandLine.arguments.contains("--preview") {
    NSApplication.shared.setActivationPolicy(.regular)
    MainActor.assumeIsolated { PreviewWindow.show() }
    NSApplication.shared.run()
    exit(0)
}

// Only one menu-bar copy at a time.
let me = ProcessInfo.processInfo.processIdentifier
let others = NSRunningApplication.runningApplications(withBundleIdentifier: Bundle.main.bundleIdentifier ?? "io.github.hitesh-sisara.displaylatch")
    .filter { $0.processIdentifier != me }
if !others.isEmpty { exit(0) }

NSApplication.shared.setActivationPolicy(.accessory)
DisplayLatchApp.main()
