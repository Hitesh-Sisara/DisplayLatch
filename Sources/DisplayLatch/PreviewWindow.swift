import AppKit
import SwiftUI

/// Hosts the menu-bar popover in a regular window with the same material,
/// so it can be captured with `screencapture -l` for docs.
@MainActor
enum PreviewWindow {
    private static var window: NSWindow?

    static func show() {
        DisplayManager.shared.start()
        if !DisplayManager.shared.demo { DisplayManager.shared.loadBrightness() }
        let content = MenuContent(initiallyExpandAll: true)
            .environmentObject(DisplayManager.shared)
            .ignoresSafeArea()
            .environment(\.controlActiveState, .key)
        let host = NSHostingView(rootView: content)
        let effect = NSVisualEffectView()
        effect.material = .popover
        effect.state = .active
        // Within-window keeps the screenshot independent of whatever is behind it.
        effect.blendingMode = .withinWindow
        host.translatesAutoresizingMaskIntoConstraints = false
        effect.addSubview(host)
        NSLayoutConstraint.activate([
            host.leadingAnchor.constraint(equalTo: effect.leadingAnchor),
            host.trailingAnchor.constraint(equalTo: effect.trailingAnchor),
            host.topAnchor.constraint(equalTo: effect.topAnchor),
            host.bottomAnchor.constraint(equalTo: effect.bottomAnchor),
        ])
        host.safeAreaRegions = []
        let w = AlwaysKeyWindow(contentRect: NSRect(x: 200, y: 200, width: 340, height: 600),
                         styleMask: [.titled, .closable, .fullSizeContentView], backing: .buffered, defer: false)
        w.titlebarAppearsTransparent = true
        w.titleVisibility = .hidden
        w.title = "\(AppInfo.name) Preview"
        w.contentView = effect
        for b in [NSWindow.ButtonType.closeButton, .miniaturizeButton, .zoomButton] { w.standardWindowButton(b)?.isHidden = true }
        if CommandLine.arguments.contains("--dark") { NSApp.appearance = NSAppearance(named: .darkAqua) }
        if CommandLine.arguments.contains("--light") { NSApp.appearance = NSAppearance(named: .aqua) }
        w.setContentSize(host.fittingSize)
        w.center()
        w.makeKeyAndOrderFront(nil)
        w.orderFrontRegardless()
        NSApp.activate(ignoringOtherApps: true)
        window = w
        print("windowNumber \(w.windowNumber)")
        try? "\(w.windowNumber)".write(toFile: NSTemporaryDirectory() + "displaylatch-preview-window", atomically: true, encoding: .utf8)
        fflush(stdout)
    }
}

/// Draws controls in their active (accent-coloured) state even when the
/// preview isn't focused, so screenshots look like the real popover.
private final class AlwaysKeyWindow: NSWindow {
    override var isKeyWindow: Bool { true }
    override var isMainWindow: Bool { true }
    override var canBecomeKey: Bool { true }
}
