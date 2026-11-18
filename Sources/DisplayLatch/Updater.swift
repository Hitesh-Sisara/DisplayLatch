import Foundation

/// Once-a-day check of the latest GitHub release. Sends nothing but the
/// request itself; no identifiers, no analytics.
enum Updater {
    struct Release: Equatable {
        let version: String
        let url: URL
    }

    static func check(force: Bool) async -> Release? {
        let key = "lastUpdateCheck"
        if !force, let last = UserDefaults.standard.object(forKey: key) as? Date, Date().timeIntervalSince(last) < 86_400 {
            return cached()
        }
        UserDefaults.standard.set(Date(), forKey: key)
        var req = URLRequest(url: URL(string: "https://api.github.com/repos/\(AppInfo.repo)/releases/latest")!)
        req.setValue("application/vnd.github+json", forHTTPHeaderField: "Accept")
        req.setValue("\(AppInfo.name)/\(AppInfo.version)", forHTTPHeaderField: "User-Agent")
        req.timeoutInterval = 15
        guard let (data, resp) = try? await URLSession.shared.data(for: req),
              (resp as? HTTPURLResponse)?.statusCode == 200,
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let tag = json["tag_name"] as? String,
              let page = (json["html_url"] as? String).flatMap(URL.init(string:)) else { return cached() }
        UserDefaults.standard.set(tag, forKey: "latestTag")
        UserDefaults.standard.set(page.absoluteString, forKey: "latestURL")
        return isNewer(tag, than: AppInfo.version) ? Release(version: clean(tag), url: page) : nil
    }

    private static func cached() -> Release? {
        guard let tag = UserDefaults.standard.string(forKey: "latestTag"),
              let url = UserDefaults.standard.string(forKey: "latestURL").flatMap(URL.init(string:)),
              isNewer(tag, than: AppInfo.version) else { return nil }
        return Release(version: clean(tag), url: url)
    }

    static func clean(_ v: String) -> String { v.hasPrefix("v") ? String(v.dropFirst()) : v }

    /// Numeric dotted-version compare: "v1.10.0" > "1.9.3". Non-numeric builds ("dev") never update.
    static func isNewer(_ candidate: String, than current: String) -> Bool {
        let a = clean(candidate).split(separator: ".").map { Int($0) }
        let b = clean(current).split(separator: ".").map { Int($0) }
        guard !a.isEmpty, !b.isEmpty, !a.contains(nil), !b.contains(nil) else { return false }
        let x = a.compactMap { $0 }, y = b.compactMap { $0 }
        for i in 0..<max(x.count, y.count) {
            let l = i < x.count ? x[i] : 0, r = i < y.count ? y[i] : 0
            if l != r { return l > r }
        }
        return false
    }
}
