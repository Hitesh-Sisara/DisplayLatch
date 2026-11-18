import Foundation

enum AppInfo {
    static let name = "DisplayLatch"
    static let bundleID = "io.github.hitesh-sisara.displaylatch"
    /// GitHub "owner/repo" used for links and the update check.
    static let repo = "Hitesh-Sisara/DisplayLatch"
    static var version: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "dev"
    }
    static var repoURL: URL { URL(string: "https://github.com/\(repo)")! }
    static var issuesURL: URL { URL(string: "https://github.com/\(repo)/issues/new/choose")! }
    static var releasesURL: URL { URL(string: "https://github.com/\(repo)/releases/latest")! }
    /// `--demo` shows sample monitors and touches no hardware (for screenshots).
    static let isDemo = CommandLine.arguments.contains("--demo")
}

enum Log {
    static let url = FileManager.default.homeDirectoryForCurrentUser
        .appendingPathComponent("Library/Logs/\(AppInfo.name).log")
    private static let maxBytes = 512 * 1024

    static func write(_ s: String) {
        let line = "\(ISO8601DateFormatter().string(from: Date())) \(s)\n"
        let fm = FileManager.default
        if let size = (try? fm.attributesOfItem(atPath: url.path)[.size] as? Int), size > maxBytes {
            let old = url.deletingPathExtension().appendingPathExtension("old.log")
            try? fm.removeItem(at: old)
            try? fm.moveItem(at: url, to: old)
        }
        if let h = try? FileHandle(forWritingTo: url) {
            h.seekToEndOfFile(); h.write(Data(line.utf8)); try? h.close()
        } else {
            try? Data(line.utf8).write(to: url)
        }
    }
}
