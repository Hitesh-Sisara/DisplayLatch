import SwiftUI

struct DisplayLatchApp: App {
    @StateObject private var manager = DisplayManager.shared

    init() {
        DispatchQueue.main.async { DisplayManager.shared.start() }
    }

    var body: some Scene {
        MenuBarExtra {
            MenuContent().environmentObject(manager)
        } label: {
            Image(systemName: manager.displays.contains { !$0.isOnline } ? "display.trianglebadge.exclamationmark" : "display.2")
        }
        .menuBarExtraStyle(.window)
    }
}

struct MenuContent: View {
    @EnvironmentObject var manager: DisplayManager
    @State private var expanded: Set<String> = []
    var initiallyExpandAll = false

    init(initiallyExpandAll: Bool = false) {
        self.initiallyExpandAll = initiallyExpandAll
        if initiallyExpandAll { _expanded = State(initialValue: Set(DisplayManager.shared.displays.map(\.key))) }
    }

    var body: some View {
        VStack(spacing: 10) {
            if manager.displays.filter(\.isOnline).count > 1 {
                AllDisplaysCard()
            }
            ForEach(manager.displays) { d in
                DisplayCard(display: d, expanded: binding(for: d))
            }
            if manager.displays.isEmpty {
                Text("No displays found").foregroundStyle(.secondary).padding()
            }
            Footer()
        }
        .padding(12)
        .frame(width: 340)
        .onAppear {
            manager.refresh(reason: "menu opened")
            manager.loadBrightness()
            if expanded.isEmpty, let first = manager.displays.first(where: \.isOnline) { expanded = [first.key] }
        }
    }

    private func binding(for d: Display) -> Binding<Bool> {
        Binding(get: { expanded.contains(d.key) },
                set: { if $0 { expanded.insert(d.key) } else { expanded.remove(d.key) } })
    }
}

struct DisplayCard: View {
    @EnvironmentObject var manager: DisplayManager
    let display: Display
    @Binding var expanded: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            header
            if display.isOnline && expanded {
                brightnessRow
                if display.modes.count > 1 { resolutionRow }
            }
            if display.isOnline {
                Button { withAnimation(.snappy(duration: 0.2)) { expanded.toggle() } } label: {
                    Image(systemName: expanded ? "chevron.compact.up" : "chevron.compact.down")
                        .font(.title3).frame(maxWidth: .infinity).contentShape(Rectangle())
                }
                .buttonStyle(.plain).foregroundStyle(.secondary).padding(.top, -6)
            }
        }
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(.quaternary.opacity(0.6)))
    }

    private var header: some View {
        HStack(spacing: 10) {
            Image(systemName: display.isBuiltin ? "laptopcomputer" : "display")
                .font(.title3).foregroundStyle(display.isOnline ? .primary : .secondary)
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 5) {
                    Text(display.name).font(.headline)
                    if display.isMain {
                        Text("M").font(.caption2.bold()).foregroundStyle(.background)
                            .frame(width: 15, height: 15).background(Circle().fill(.secondary))
                            .help("Main display")
                    }
                }
                Text(subtitle).font(.caption).foregroundStyle(.secondary)
            }
            Spacer()
            if !display.isBuiltin {
                Toggle("", isOn: Binding(get: { display.isOnline }, set: { manager.setConnected(display, $0) }))
                    .toggleStyle(.switch).labelsHidden().controlSize(.small)
                    .help(display.isOnline ? "Disconnect this display" : "Connect this display")
            }
        }
    }

    private var subtitle: String {
        var parts: [String] = []
        if !display.isOnline { parts.append("Not on desktop") }
        if let m = display.currentMode { parts.append(m.label) }
        if let s = display.serial { parts.append(s) }
        return parts.joined(separator: " · ")
    }

    private var brightnessRow: some View {
        let value = manager.brightness[display.key]
        return VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Brightness")
                Spacer()
                Text(value.map { "\(Int(($0 * 100).rounded()))%" } ?? "—").foregroundStyle(.secondary).monospacedDigit()
            }
            HStack(spacing: 10) {
                Image(systemName: "sun.max").foregroundStyle(.secondary)
                Slider(value: Binding(get: { value ?? 1 }, set: { manager.setBrightness($0, for: display) }), in: 0...1)
                    .disabled(value == nil)
            }
            if value == nil {
                Text("Reading brightness… (needs DDC support on the monitor)").font(.caption2).foregroundStyle(.tertiary)
            }
        }
    }

    private var resolutionRow: some View {
        ResolutionRow(display: display)
    }
}

/// One slider that sets every monitor to the same brightness at once.
struct AllDisplaysCard: View {
    @EnvironmentObject var manager: DisplayManager

    var body: some View {
        let value = manager.allBrightness
        VStack(alignment: .leading, spacing: 8) {
            HStack(spacing: 10) {
                Image(systemName: "display.2").font(.title3)
                Text("All displays").font(.headline)
                Spacer()
                Text(value.map { "\(Int(($0 * 100).rounded()))%" } ?? "—").foregroundStyle(.secondary).monospacedDigit()
            }
            HStack(spacing: 10) {
                Image(systemName: "sun.min").foregroundStyle(.secondary)
                Slider(value: Binding(get: { value ?? 1 }, set: { manager.setAllBrightness($0) }), in: 0...1)
                    .disabled(value == nil)
                Image(systemName: "sun.max").foregroundStyle(.secondary)
            }
        }
        .padding(14)
        .background(RoundedRectangle(cornerRadius: 14, style: .continuous).fill(.quaternary.opacity(0.6)))
    }
}

/// Slider over the display's modes; applied when the drag ends.
struct ResolutionRow: View {
    @EnvironmentObject var manager: DisplayManager
    let display: Display
    @State private var draft: Double?

    var body: some View {
        let modes = display.modes
        let currentIndex = Double(display.currentMode.flatMap { modes.firstIndex(of: $0) } ?? modes.count - 1)
        let shown = modes[Int((draft ?? currentIndex).rounded()).clamped(to: 0...(modes.count - 1))]
        return VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text("Resolution")
                Spacer()
                Menu(shown.label) {
                    ForEach(modes.reversed(), id: \.self) { m in
                        Button { manager.apply(m, to: display) } label: {
                            if m == display.currentMode { Label(m.label, systemImage: "checkmark") } else { Text(m.label) }
                        }
                    }
                }
                .menuStyle(.borderlessButton).fixedSize().foregroundStyle(.secondary)
            }
            HStack(spacing: 10) {
                Image(systemName: "arrow.up.left.and.arrow.down.right").foregroundStyle(.secondary)
                Slider(value: Binding(get: { draft ?? currentIndex }, set: { draft = $0 }),
                       in: 0...Double(max(modes.count - 1, 1)), step: 1) { editing in
                    if !editing, let d = draft {
                        manager.apply(modes[Int(d.rounded())], to: display)
                        draft = nil
                    }
                }
            }
        }
    }
}

struct Footer: View {
    @EnvironmentObject var manager: DisplayManager

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if let u = manager.update {
                Button { NSWorkspace.shared.open(u.url) } label: {
                    Label("Version \(u.version) is available", systemImage: "arrow.down.circle.fill")
                        .font(.callout.weight(.medium))
                }
                .buttonStyle(.link)
            }
            if manager.loginItemNeedsApproval {
                Button { NSWorkspace.shared.open(URL(string: "x-apple.systempreferences:com.apple.LoginItems-Settings.extension")!) } label: {
                    Label("Allow \(AppInfo.name) in Login Items to start at login", systemImage: "exclamationmark.circle")
                        .font(.caption)
                }
                .buttonStyle(.link)
            }
            if !manager.status.isEmpty {
                Text(manager.status).font(.caption).foregroundStyle(.secondary).lineLimit(2)
            }
            HStack {
                Toggle("Keep monitors connected", isOn: $manager.autoReconnect)
                    .toggleStyle(.switch).controlSize(.mini).font(.callout)
                    .help("Bring back any attached monitor that macOS leaves off the desktop (after wake, restart or replug)")
                Spacer()
                Menu {
                    Button("Fix Displays Now") { manager.heal(reason: "manual"); manager.refresh(reason: "manual") }
                    Divider()
                    Toggle("Launch at Login", isOn: Binding(get: { manager.launchAtLogin }, set: { manager.setLaunchAtLogin($0) }))
                    Toggle("Check for Updates Automatically", isOn: $manager.checkForUpdates)
                    Button("Check for Updates…") { NSWorkspace.shared.open(AppInfo.releasesURL) }
                    Divider()
                    Button("Open Log") { NSWorkspace.shared.open(Log.url) }
                    Button("Report an Issue…") { NSWorkspace.shared.open(AppInfo.issuesURL) }
                    Button("About \(AppInfo.name) \(AppInfo.version)") { showAbout() }
                    Divider()
                    Button("Quit \(AppInfo.name)") { NSApp.terminate(nil) }
                } label: {
                    Image(systemName: "ellipsis.circle").font(.title3)
                }
                .menuStyle(.borderlessButton).menuIndicator(.hidden).fixedSize()
                .accessibilityLabel("Settings")
            }
        }
        .padding(.horizontal, 4)
    }

    private func showAbout() {
        NSApp.activate(ignoringOtherApps: true)
        let credits = NSMutableAttributedString(string: "Free and open source (MIT).\n")
        credits.append(NSAttributedString(string: AppInfo.repoURL.absoluteString, attributes: [.link: AppInfo.repoURL]))
        NSApp.orderFrontStandardAboutPanel(options: [
            .applicationName: AppInfo.name,
            .applicationVersion: AppInfo.version,
            .credits: credits,
        ])
    }
}

extension Comparable {
    func clamped(to r: ClosedRange<Self>) -> Self { min(max(self, r.lowerBound), r.upperBound) }
}
