import AppKit
import CoreGraphics
import Foundation
import IOKit

struct ModeOption: Hashable {
    let width: Int
    let height: Int
    let hiDPI: Bool
    let refresh: Double
    var label: String { "\(width) × \(height)" + (hiDPI ? " HiDPI" : "") }
}

struct Display: Identifiable, Equatable {
    let id: CGDirectDisplayID
    var name: String
    var serial: String?
    /// Stable identity across reboots/ID changes (serial, else EDID UUID).
    var key: String
    var isBuiltin: Bool
    var isOnline: Bool
    var isMain: Bool
    var registryPath: String?
    var modes: [ModeOption]
    var currentMode: ModeOption?
}

/// Stateless display operations, shared by the menu-bar app and the CLI.
enum Displays {
    /// Every display the Mac can drive right now: online ones plus external
    /// monitors that are physically attached but kept off the desktop.
    static func all() -> [Display] {
        _ = CGMainDisplayID() // initialises the CoreGraphics connection
        var n: UInt32 = 0
        CGGetOnlineDisplayList(0, nil, &n)
        var online = [CGDirectDisplayID](repeating: 0, count: Int(max(n, 1)))
        CGGetOnlineDisplayList(n, &online, &n)
        var ids = Set(online.prefix(Int(n)))
        for i in UInt32(1)...64 {
            let v = CGDisplayVendorNumber(i)
            if v != 0 && v != 0xFFFF_FFFF { ids.insert(i) }
        }

        var found: [Display] = []
        for id in ids {
            let info = CoreDisplayPrivate.info(id)
            let path = info["IODisplayLocation"] as? String
            let isOnline = CGDisplayIsOnline(id) != 0
            let isBuiltin = CGDisplayIsBuiltin(id) != 0 || (path?.contains("/disp0@") ?? false)
            let attrs = path.flatMap(registryAttributes)
            if !isOnline {
                // A closed lid is not a fault: never resurrect the built-in panel.
                if isBuiltin { continue }
                guard let attrs, attrs.matches(vendor: CGDisplayVendorNumber(id), model: CGDisplayModelNumber(id)) else { continue }
            }
            let name = screenName(id) ?? attrs?.productName ?? productName(info) ?? (isBuiltin ? "Built-in Display" : "Display \(id)")
            let (modes, current) = isOnline ? modeOptions(id) : ([], nil)
            found.append(Display(
                id: id, name: name, serial: attrs?.serial,
                key: attrs?.serial ?? attrs?.edidUUID ?? (isBuiltin ? "builtin" : "id-\(id)"),
                isBuiltin: isBuiltin, isOnline: isOnline, isMain: CGDisplayIsMain(id) != 0,
                registryPath: path, modes: modes, currentMode: current))
        }

        // A monitor can leave a stale offline ID behind; keep one entry per port.
        var byPort: [String: Display] = [:]
        var noPort: [Display] = []
        for d in found {
            guard let p = d.registryPath else { noPort.append(d); continue }
            if let existing = byPort[p] {
                if (d.isOnline && !existing.isOnline) || (d.isOnline == existing.isOnline && d.id > existing.id) { byPort[p] = d }
            } else { byPort[p] = d }
        }
        var result = (Array(byPort.values) + noPort).sorted { a, b in
            if a.isBuiltin != b.isBuiltin { return a.isBuiltin }
            return a.key < b.key
        }
        let names = disambiguate(result.map(\.name))
        for i in result.indices { result[i].name = names[i] }
        return result
    }

    // MARK: Pure helpers (unit-tested)

    /// One entry per size and HiDPI flag, keeping the highest refresh rate,
    /// sorted from smallest to largest.
    static func dedupeModes(_ modes: [ModeOption]) -> [ModeOption] {
        var best: [String: ModeOption] = [:]
        for o in modes {
            let k = "\(o.width)x\(o.height)\(o.hiDPI)"
            if let e = best[k], e.refresh >= o.refresh { continue }
            best[k] = o
        }
        return best.values.sorted { ($0.width * $0.height, $0.hiDPI ? 1 : 0) < ($1.width * $1.height, $1.hiDPI ? 1 : 0) }
    }

    /// Two monitors of the same model get " 1", " 2" suffixes, in order.
    static func disambiguate(_ names: [String]) -> [String] {
        var out = names
        let groups = Dictionary(grouping: names.indices, by: { names[$0] })
        for (_, idxs) in groups where idxs.count > 1 {
            for (n, i) in idxs.sorted().enumerated() { out[i] += " \(n + 1)" }
        }
        return out
    }

    // MARK: Connect / disconnect

    @discardableResult
    static func setConnected(_ id: CGDirectDisplayID, _ connected: Bool) -> Bool {
        var cfg: CGDisplayConfigRef?
        guard CGBeginDisplayConfiguration(&cfg) == .success else { return false }
        var ok = true
        if connected {
            if let f = SkyLight.configureIndependentOutput { ok = f(cfg, id, false) == .success && ok }
            if let f = SkyLight.configureEnabled { ok = f(cfg, id, true) == .success && ok }
        } else {
            guard let f = SkyLight.configureIndependentOutput else { CGCancelDisplayConfiguration(cfg); return false }
            ok = f(cfg, id, true) == .success
        }
        guard ok else { CGCancelDisplayConfiguration(cfg); return false }
        return CGCompleteDisplayConfiguration(cfg, .permanently) == .success
    }

    @discardableResult
    static func setOrigin(_ id: CGDirectDisplayID, x: Int32, y: Int32) -> Bool {
        var cfg: CGDisplayConfigRef?
        guard CGBeginDisplayConfiguration(&cfg) == .success else { return false }
        guard CGConfigureDisplayOrigin(cfg, id, x, y) == .success else { CGCancelDisplayConfiguration(cfg); return false }
        return CGCompleteDisplayConfiguration(cfg, .permanently) == .success
    }

    // MARK: Resolution

    static func modeOptions(_ id: CGDirectDisplayID) -> ([ModeOption], ModeOption?) {
        let opts = [kCGDisplayShowDuplicateLowResolutionModes: kCFBooleanTrue] as CFDictionary
        guard let all = CGDisplayCopyAllDisplayModes(id, opts) as? [CGDisplayMode] else { return ([], nil) }
        let sorted = dedupeModes(all.filter { $0.isUsableForDesktopGUI() }.map {
            ModeOption(width: $0.width, height: $0.height, hiDPI: $0.pixelWidth > $0.width, refresh: $0.refreshRate)
        })
        let current = CGDisplayCopyDisplayMode(id).map {
            ModeOption(width: $0.width, height: $0.height, hiDPI: $0.pixelWidth > $0.width, refresh: $0.refreshRate)
        }
        let match = current.flatMap { c in sorted.first { $0.width == c.width && $0.height == c.height && $0.hiDPI == c.hiDPI } }
        return (sorted, match)
    }

    @discardableResult
    static func apply(_ option: ModeOption, to id: CGDirectDisplayID) -> Bool {
        let opts = [kCGDisplayShowDuplicateLowResolutionModes: kCFBooleanTrue] as CFDictionary
        guard let all = CGDisplayCopyAllDisplayModes(id, opts) as? [CGDisplayMode] else { return false }
        let candidates = all.filter {
            $0.isUsableForDesktopGUI() && $0.width == option.width && $0.height == option.height && ($0.pixelWidth > $0.width) == option.hiDPI
        }
        guard let mode = candidates.max(by: { $0.refreshRate < $1.refreshRate }) else { return false }
        var cfg: CGDisplayConfigRef?
        guard CGBeginDisplayConfiguration(&cfg) == .success else { return false }
        guard CGConfigureDisplayWithDisplayMode(cfg, id, mode, nil) == .success else { CGCancelDisplayConfiguration(cfg); return false }
        return CGCompleteDisplayConfiguration(cfg, .permanently) == .success
    }

    // MARK: Brightness (0...1)

    static func brightness(of d: Display) -> Double? {
        if d.isBuiltin { return DisplayServices.brightness(d.id) }
        guard let svc = DDC.service(forRegistryPath: d.registryPath),
              let r = DDC.read(svc, vcp: DDC.brightnessVCP) else { return nil }
        return Double(r.current) / Double(r.max)
    }

    static func setBrightness(of d: Display, _ value: Double) {
        let v = min(max(value, 0), 1)
        if d.isBuiltin { DisplayServices.setBrightness(d.id, v); return }
        guard let svc = DDC.service(forRegistryPath: d.registryPath) else { return }
        DDC.write(svc, vcp: DDC.brightnessVCP, value: Int((v * 100).rounded()))
    }

    // MARK: Registry helpers

    struct RegistryAttributes {
        var edidUUID: String?
        var serial: String?
        var productName: String?
        var vendor: UInt32?
        var product: UInt32?

        func matches(vendor v: UInt32, model m: UInt32) -> Bool {
            if let vendor, let product { return vendor == v && product == m }
            guard let edidUUID else { return false }
            let prefix = String(format: "%04X%02X%02X", v, m & 0xFF, (m >> 8) & 0xFF)
            return edidUUID.uppercased().hasPrefix(prefix)
        }
    }

    /// Reads what the display driver knows about the monitor on a port. Returns
    /// nil when no monitor is attached there.
    static func registryAttributes(_ path: String) -> RegistryAttributes? {
        let entry = IORegistryEntryFromPath(kIOMainPortDefault, path)
        guard entry != 0 else { return nil }
        defer { IOObjectRelease(entry) }
        func prop(_ k: String) -> Any? { IORegistryEntryCreateCFProperty(entry, k as CFString, nil, 0)?.takeRetainedValue() }
        let edid = prop("EDID UUID") as? String
        let product = (prop("DisplayAttributes") as? [String: Any])?["ProductAttributes"] as? [String: Any]
        guard edid != nil || product != nil else { return nil }
        return RegistryAttributes(
            edidUUID: edid,
            serial: (product?["AlphanumericSerialNumber"] as? String).flatMap { $0.isEmpty ? nil : $0 },
            productName: product?["ProductName"] as? String,
            vendor: (product?["LegacyManufacturerID"] as? NSNumber)?.uint32Value,
            product: (product?["ProductID"] as? NSNumber)?.uint32Value)
    }

    private static func screenName(_ id: CGDirectDisplayID) -> String? {
        NSScreen.screens.first { ($0.deviceDescription[NSDeviceDescriptionKey("NSScreenNumber")] as? NSNumber)?.uint32Value == id }?.localizedName
    }

    private static func productName(_ info: [String: Any]) -> String? {
        (info["DisplayProductName"] as? [String: String])?.values.first
    }
}
