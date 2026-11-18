import AppKit
import Combine
import CoreGraphics
import Foundation

@MainActor
final class DisplayManager: ObservableObject {
    static let shared = DisplayManager()

    @Published private(set) var displays: [Display] = []
    @Published var brightness: [String: Double] = [:]   // by Display.key
    @Published private(set) var status: String = ""
    @Published var autoReconnect: Bool {
        didSet { UserDefaults.standard.set(autoReconnect, forKey: "autoReconnect"); if autoReconnect { heal(reason: "auto-reconnect on") } }
    }
    @Published private(set) var launchAtLogin: Bool = LoginItem.isEnabled
    @Published private(set) var loginItemNeedsApproval: Bool = LoginItem.needsApproval
    @Published private(set) var update: Updater.Release?
    @Published var checkForUpdates: Bool {
        didSet { UserDefaults.standard.set(checkForUpdates, forKey: "checkForUpdates"); if checkForUpdates { checkUpdate(force: true) } }
    }
    let demo: Bool

    /// Displays the user switched off on purpose; auto-reconnect leaves them alone.
    private var userDisconnected: Set<String> {
        get { Set(UserDefaults.standard.stringArray(forKey: "userDisconnected") ?? []) }
        set { UserDefaults.standard.set(Array(newValue), forKey: "userDisconnected") }
    }
    private var lastAttempt: [String: Date] = [:]
    private var failures: [String: Int] = [:]
    /// Last known desktop position of each monitor, so a reconnect puts it back
    /// where it was instead of wherever macOS chooses.
    private var savedOrigins: [String: [Double]] {
        get { UserDefaults.standard.dictionary(forKey: "origins") as? [String: [Double]] ?? [:] }
        set { UserDefaults.standard.set(newValue, forKey: "origins") }
    }
    private var restoreOrigin: [String: [Double]] = [:]
    private var refreshTask: Task<Void, Never>?
    private var timer: Timer?
    private let brightnessWriter = BrightnessWriter()

    private init() {
        autoReconnect = UserDefaults.standard.object(forKey: "autoReconnect") as? Bool ?? true
        checkForUpdates = UserDefaults.standard.object(forKey: "checkForUpdates") as? Bool ?? true
        demo = AppInfo.isDemo
    }

    func start() {
        if demo { displays = Demo.displays; brightness = Demo.brightness; return }
        LoginItem.enableOnFirstLaunch()
        launchAtLogin = LoginItem.isEnabled
        loginItemNeedsApproval = LoginItem.needsApproval
        checkUpdate(force: false)
        CGDisplayRegisterReconfigurationCallback({ _, flags, _ in
            guard !flags.contains(.beginConfigurationFlag) else { return }
            Task { @MainActor in DisplayManager.shared.scheduleRefresh(after: 1.5, reason: "display change") }
        }, nil)
        let nc = NSWorkspace.shared.notificationCenter
        for name in [NSWorkspace.didWakeNotification, NSWorkspace.screensDidWakeNotification, NSWorkspace.sessionDidBecomeActiveNotification] {
            nc.addObserver(forName: name, object: nil, queue: .main) { _ in
                Task { @MainActor in DisplayManager.shared.scheduleRefresh(after: 3, reason: "wake") }
            }
        }
        // Safety net in case a change arrives without a callback.
        timer = Timer.scheduledTimer(withTimeInterval: 20, repeats: true) { _ in
            Task { @MainActor in DisplayManager.shared.refresh(reason: "periodic") }
        }
        refresh(reason: "launch")
    }

    func scheduleRefresh(after delay: TimeInterval, reason: String) {
        refreshTask?.cancel()
        refreshTask = Task { @MainActor [weak self] in
            try? await Task.sleep(nanoseconds: UInt64(delay * 1_000_000_000))
            guard !Task.isCancelled else { return }
            self?.refresh(reason: reason)
        }
    }

    func refresh(reason: String) {
        if demo { return }
        let now = Displays.all()
        if now != displays {
            displays = now
            DDC.invalidate()
        }
        trackOrigins()
        if autoReconnect { heal(reason: reason) }
    }

    /// Brings back every attached external monitor that is off the desktop,
    /// unless the user switched it off here.
    func heal(reason: String) {
        let offline = displays.filter { !$0.isOnline && !$0.isBuiltin && !userDisconnected.contains($0.key) }
        guard !offline.isEmpty else { return }
        var changed = false
        for d in offline {
            if let t = lastAttempt[d.key], Date().timeIntervalSince(t) < 10 { continue }
            // A monitor that keeps refusing is retried only on real events, not every 20 s.
            if reason == "periodic", failures[d.key, default: 0] >= 3 { continue }
            lastAttempt[d.key] = Date()
            if let o = savedOrigins[d.key] { restoreOrigin[d.key] = o }
            let ok = Displays.setConnected(d.id, true)
            failures[d.key] = ok ? 0 : failures[d.key, default: 0] + 1
            let msg = ok ? "Reconnected \(d.name)" : "Couldn't reconnect \(d.name)"
            Log.write("\(msg) [id \(d.id), \(d.serial ?? d.key), trigger: \(reason)]")
            setStatus(msg)
            changed = true
        }
        if changed { scheduleRefresh(after: 2, reason: "after reconnect") }
    }

    func setConnected(_ d: Display, _ on: Bool) {
        if demo {
            if let i = displays.firstIndex(of: d) { displays[i].isOnline = on }
            return
        }
        if !on && displays.filter(\.isOnline).count <= 1 {
            setStatus("Can't turn off the only screen")
            return
        }
        var set = userDisconnected
        if on { set.remove(d.key) } else { set.insert(d.key) }
        userDisconnected = set
        if on, let o = savedOrigins[d.key] { restoreOrigin[d.key] = o }
        let ok = Displays.setConnected(d.id, on)
        Log.write("User turned \(on ? "on" : "off") \(d.name) [id \(d.id)] -> \(ok ? "ok" : "failed")")
        setStatus(ok ? "\(d.name) \(on ? "connected" : "disconnected")" : "Couldn't change \(d.name)")
        scheduleRefresh(after: 1.5, reason: "user toggle")
    }

    func apply(_ mode: ModeOption, to d: Display) {
        guard mode != d.currentMode else { return }
        if demo { if let i = displays.firstIndex(of: d) { displays[i].currentMode = mode }; return }
        let ok = Displays.apply(mode, to: d.id)
        Log.write("Resolution \(d.name) -> \(mode.label): \(ok ? "ok" : "failed")")
        if !ok { setStatus("Couldn't switch \(d.name) to \(mode.label)") }
        scheduleRefresh(after: 1, reason: "resolution")
    }

    private func trackOrigins() {
        var saved = savedOrigins
        let online = displays.filter(\.isOnline)
        guard online.count > 1 else { return } // a lone screen is always at 0,0; keep the old layout
        for d in online {
            let b = CGDisplayBounds(d.id).origin
            let cur = [Double(b.x), Double(b.y)]
            if let want = restoreOrigin.removeValue(forKey: d.key) {
                if want != cur, !d.isMain {
                    let ok = Displays.setOrigin(d.id, x: Int32(want[0]), y: Int32(want[1]))
                    Log.write("Restored position of \(d.name) to \(Int(want[0])),\(Int(want[1])): \(ok)")
                    if ok { saved[d.key] = want; continue }
                }
            }
            saved[d.key] = cur
        }
        if saved != savedOrigins { savedOrigins = saved }
    }

    // MARK: Brightness

    func loadBrightness() {
        if demo { return }
        let targets = displays.filter(\.isOnline)
        let writer = brightnessWriter
        DDC.queue.async {
            var values: [String: Double] = [:]
            for d in targets { if let b = Displays.brightness(of: d) { values[d.key] = b } }
            Task { @MainActor in
                // Don't clobber a value the user is dragging right now.
                for (k, v) in values where !writer.isPending(k) { DisplayManager.shared.brightness[k] = v }
            }
        }
    }

    func setBrightness(_ value: Double, for d: Display) {
        brightness[d.key] = value
        if !demo { brightnessWriter.submit(d, value) }
    }

    /// Monitors the shared slider drives: every online display whose brightness we can control.
    var linkedDisplays: [Display] { displays.filter { $0.isOnline && brightness[$0.key] != nil } }

    /// Shared slider value: the average of the linked monitors.
    var allBrightness: Double? {
        let vals = linkedDisplays.compactMap { brightness[$0.key] }
        return vals.isEmpty ? nil : vals.reduce(0, +) / Double(vals.count)
    }

    func setAllBrightness(_ value: Double) {
        for d in linkedDisplays { setBrightness(value, for: d) }
    }

    // MARK: Misc

    func setLaunchAtLogin(_ on: Bool) {
        LoginItem.set(on)
        launchAtLogin = LoginItem.isEnabled
        loginItemNeedsApproval = LoginItem.needsApproval
    }

    func checkUpdate(force: Bool) {
        guard checkForUpdates, !demo else { return }
        Task {
            let r = await Updater.check(force: force)
            self.update = r
        }
    }

    private func setStatus(_ s: String) {
        let f = DateFormatter(); f.dateFormat = "HH:mm"
        status = "\(s) · \(f.string(from: Date()))"
    }
}

/// Coalesces slider drags: DDC writes are slow, so only the latest value per
/// display is sent and older ones are dropped.
final class BrightnessWriter: @unchecked Sendable {
    private let lock = NSLock()
    private var pending: [String: (Display, Double)] = [:]
    private var running = false

    func submit(_ d: Display, _ value: Double) {
        lock.lock()
        pending[d.key] = (d, value)
        let start = !running
        running = true
        lock.unlock()
        if start { DDC.queue.async { self.drain() } }
    }

    func isPending(_ key: String) -> Bool {
        lock.lock(); defer { lock.unlock() }
        return pending[key] != nil
    }

    private func drain() {
        while true {
            lock.lock()
            guard let (key, item) = pending.first else { running = false; lock.unlock(); return }
            pending[key] = nil
            lock.unlock()
            Displays.setBrightness(of: item.0, item.1)
        }
    }
}
