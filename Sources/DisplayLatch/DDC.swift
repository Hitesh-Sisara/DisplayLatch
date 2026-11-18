import Foundation
import IOKit

/// DDC/CI brightness for external monitors on Apple silicon.
/// All calls are blocking (~50-100 ms) so callers run them on `DDC.queue`.
enum DDC {
    static let queue = DispatchQueue(label: "displaylatch.ddc")
    static let brightnessVCP: UInt8 = 0x10

    /// Maps "dispextN" -> IOAVService for every external display link.
    private static var cache: [String: CFTypeRef] = [:]

    static func service(forRegistryPath path: String?) -> CFTypeRef? {
        guard let token = path.flatMap(dispextToken) else { return nil }
        if let s = cache[token] { return s }
        var it: io_iterator_t = 0
        guard IOServiceGetMatchingServices(kIOMainPortDefault, IOServiceMatching("DCPAVServiceProxy"), &it) == KERN_SUCCESS else { return nil }
        defer { IOObjectRelease(it) }
        while case let s = IOIteratorNext(it), s != 0 {
            defer { IOObjectRelease(s) }
            let loc = IORegistryEntryCreateCFProperty(s, "Location" as CFString, nil, 0)?.takeRetainedValue() as? String
            guard loc == "External" else { continue }
            var buf = [CChar](repeating: 0, count: 1024)
            IORegistryEntryGetPath(s, kIOServicePlane, &buf)
            guard dispextToken(String(cString: buf)) == token,
                  let svc = IOAVServiceCreateWithService(kCFAllocatorDefault, s)?.takeRetainedValue() else { continue }
            cache[token] = svc
            return svc
        }
        return nil
    }

    static func invalidate() { queue.async { cache.removeAll() } }

    static func dispextToken(_ path: String) -> String? {
        guard let r = path.range(of: #"dispext\d+"#, options: .regularExpression) else { return nil }
        return String(path[r])
    }

    // MARK: Packets (pure, unit-tested)

    /// "Get VCP feature" request, including the DDC/CI checksum.
    static func getPacket(vcp: UInt8) -> [UInt8] {
        var p: [UInt8] = [0x82, 0x01, vcp]
        p.append(checksum(p))
        return p
    }

    /// "Set VCP feature" request, including the DDC/CI checksum.
    static func setPacket(vcp: UInt8, value: Int) -> [UInt8] {
        let v = max(0, min(value, 0xFFFF))
        var p: [UInt8] = [0x84, 0x03, vcp, UInt8(v >> 8), UInt8(v & 0xFF)]
        p.append(checksum(p))
        return p
    }

    /// Parses a "VCP feature reply". Returns nil if it isn't a valid reply for `vcp`.
    static func parseReply(_ r: [UInt8], vcp: UInt8) -> (current: Int, max: Int)? {
        guard r.count >= 10, r[2] == 0x02, r[3] == 0x00, r[4] == vcp else { return nil }
        let mx = Int(r[6]) << 8 | Int(r[7])
        return (Int(r[8]) << 8 | Int(r[9]), mx == 0 ? 100 : mx)
    }

    /// XOR of the destination address (0x6E), the source address (0x51) and the payload.
    static func checksum(_ payload: [UInt8]) -> UInt8 {
        payload.reduce(0x6E ^ 0x51) { $0 ^ $1 }
    }

    // MARK: I/O

    static func read(_ svc: CFTypeRef, vcp: UInt8) -> (current: Int, max: Int)? {
        var req = getPacket(vcp: vcp)
        for _ in 0..<3 {
            _ = IOAVServiceWriteI2C(svc, 0x37, 0x51, &req, UInt32(req.count))
            usleep(50_000)
            var rep = [UInt8](repeating: 0, count: 12)
            if IOAVServiceReadI2C(svc, 0x37, 0x51, &rep, UInt32(rep.count)) == kIOReturnSuccess,
               let r = parseReply(rep, vcp: vcp) {
                return r
            }
            usleep(40_000)
        }
        return nil
    }

    static func write(_ svc: CFTypeRef, vcp: UInt8, value: Int) {
        var data = setPacket(vcp: vcp, value: value)
        for _ in 0..<2 {
            _ = IOAVServiceWriteI2C(svc, 0x37, 0x51, &data, UInt32(data.count))
            usleep(10_000)
        }
    }
}
