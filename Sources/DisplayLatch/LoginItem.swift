import Foundation
import ServiceManagement

/// Start at login through the system Login Items list (System Settings ›
/// General › Login Items), so users can see and remove it there.
enum LoginItem {
    static var isEnabled: Bool { SMAppService.mainApp.status == .enabled }
    static var needsApproval: Bool { SMAppService.mainApp.status == .requiresApproval }

    /// Turn it on once, the first time the app runs. After that the user's choice wins.
    static func enableOnFirstLaunch() {
        let key = "didSetUpLoginItem"
        guard !UserDefaults.standard.bool(forKey: key) else { return }
        UserDefaults.standard.set(true, forKey: key)
        set(true)
        removeLegacyLaunchAgent()
    }

    static func set(_ on: Bool) {
        do {
            if on { try SMAppService.mainApp.register() } else { try SMAppService.mainApp.unregister() }
        } catch {
            Log.write("Login item \(on ? "register" : "unregister") failed: \(error.localizedDescription)")
        }
    }

    /// Early builds used a hand-written LaunchAgent; drop it so the app doesn't start twice.
    static func removeLegacyLaunchAgent() {
        let url = FileManager.default.homeDirectoryForCurrentUser
            .appendingPathComponent("Library/LaunchAgents/\(AppInfo.bundleID).plist")
        try? FileManager.default.removeItem(at: url)
    }
}
