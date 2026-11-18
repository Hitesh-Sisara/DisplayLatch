// Renders the app icon. Usage: swift scripts/make-icon.swift <out-dir>
// Writes AppIcon.icns plus icon-1024.png into <out-dir>.
import AppKit
import SwiftUI

struct Monitor: View {
    var size: CGFloat
    var screen: LinearGradient
    var glyph: String?
    var body: some View {
        VStack(spacing: 0) {
            RoundedRectangle(cornerRadius: size * 0.06, style: .continuous)
                .fill(.white)
                .frame(width: size, height: size * 0.62)
                .overlay(
                    RoundedRectangle(cornerRadius: size * 0.035, style: .continuous)
                        .fill(screen)
                        .padding(size * 0.045)
                        .overlay { if let glyph { Image(systemName: glyph).font(.system(size: size * 0.26, weight: .bold)).foregroundStyle(.white) } }
                )
            Rectangle().fill(.white.opacity(0.92)).frame(width: size * 0.12, height: size * 0.1)
            Capsule().fill(.white.opacity(0.92)).frame(width: size * 0.38, height: size * 0.045)
        }
        .shadow(color: .black.opacity(0.28), radius: size * 0.05, y: size * 0.03)
    }
}

struct Icon: View {
    var body: some View {
        let s: CGFloat = 1024
        ZStack {
            RoundedRectangle(cornerRadius: s * 0.225, style: .continuous)
                .fill(LinearGradient(colors: [Color(red: 0.11, green: 0.16, blue: 0.42), Color(red: 0.36, green: 0.30, blue: 0.93)],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
                .overlay(
                    RoundedRectangle(cornerRadius: s * 0.225, style: .continuous)
                        .fill(RadialGradient(colors: [.white.opacity(0.22), .clear], center: .topLeading, startRadius: 0, endRadius: s * 0.9))
                )
                .frame(width: s * 0.82, height: s * 0.82)
                .shadow(color: .black.opacity(0.35), radius: s * 0.02, y: s * 0.012)
            Monitor(size: s * 0.42,
                    screen: LinearGradient(colors: [Color(red: 0.25, green: 0.30, blue: 0.62), Color(red: 0.16, green: 0.20, blue: 0.48)], startPoint: .top, endPoint: .bottom),
                    glyph: nil)
                .offset(x: -s * 0.12, y: -s * 0.07)
            Monitor(size: s * 0.46,
                    screen: LinearGradient(colors: [Color(red: 1.0, green: 0.74, blue: 0.25), Color(red: 0.98, green: 0.45, blue: 0.20)], startPoint: .top, endPoint: .bottom),
                    glyph: "sun.max.fill")
                .offset(x: s * 0.1, y: s * 0.06)
        }
        .frame(width: s, height: s)
    }
}

let out = URL(fileURLWithPath: CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : ".")
let iconset = out.appendingPathComponent("AppIcon.iconset")
try? FileManager.default.removeItem(at: iconset)
try! FileManager.default.createDirectory(at: iconset, withIntermediateDirectories: true)

MainActor.assumeIsolated {
    let r = ImageRenderer(content: Icon())
    r.scale = 1
    guard let cg = r.cgImage else { fatalError("render failed") }
    let rep = NSBitmapImageRep(cgImage: cg)
    try! rep.representation(using: .png, properties: [:])!.write(to: out.appendingPathComponent("icon-1024.png"))
    for (pt, scale) in [(16, 1), (16, 2), (32, 1), (32, 2), (128, 1), (128, 2), (256, 1), (256, 2), (512, 1), (512, 2)] {
        let px = pt * scale
        let img = NSImage(size: NSSize(width: px, height: px))
        img.lockFocus()
        NSGraphicsContext.current?.imageInterpolation = .high
        NSImage(cgImage: cg, size: NSSize(width: 1024, height: 1024)).draw(in: NSRect(x: 0, y: 0, width: px, height: px))
        img.unlockFocus()
        let bm = NSBitmapImageRep(data: img.tiffRepresentation!)!
        let name = scale == 1 ? "icon_\(pt)x\(pt).png" : "icon_\(pt)x\(pt)@2x.png"
        try! bm.representation(using: .png, properties: [:])!.write(to: iconset.appendingPathComponent(name))
    }
}
let p = Process()
p.executableURL = URL(fileURLWithPath: "/usr/bin/iconutil")
p.arguments = ["-c", "icns", iconset.path, "-o", out.appendingPathComponent("AppIcon.icns").path]
try! p.run(); p.waitUntilExit()
try? FileManager.default.removeItem(at: iconset)
print("wrote \(out.path)/AppIcon.icns")
