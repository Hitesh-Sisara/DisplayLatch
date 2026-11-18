// Renders the 1280x640 GitHub social preview.
// Usage: swift scripts/make-social.swift <name> <tagline> <icon.png> <screenshot.png> <out.png>
import AppKit
import SwiftUI

let a = CommandLine.arguments
guard a.count == 6, let icon = NSImage(contentsOfFile: a[3]), let shot = NSImage(contentsOfFile: a[4]) else {
    print("usage: make-social.swift <name> <tagline> <icon.png> <screenshot.png> <out.png>"); exit(2)
}

struct Card: View {
    let name: String, tagline: String, icon: NSImage, shot: NSImage
    var body: some View {
        ZStack {
            LinearGradient(colors: [Color(red: 0.07, green: 0.09, blue: 0.22), Color(red: 0.23, green: 0.19, blue: 0.62)],
                           startPoint: .topLeading, endPoint: .bottomTrailing)
            RadialGradient(colors: [Color(red: 1, green: 0.6, blue: 0.25).opacity(0.35), .clear], center: .init(x: 0.82, y: 0.35), startRadius: 0, endRadius: 520)
            HStack(alignment: .center, spacing: 56) {
                VStack(alignment: .leading, spacing: 22) {
                    HStack(spacing: 22) {
                        Image(nsImage: icon).resizable().frame(width: 116, height: 116)
                        Text(name).font(.system(size: 76, weight: .heavy, design: .rounded)).foregroundStyle(.white)
                    }
                    Text(tagline).font(.system(size: 38, weight: .semibold)).foregroundStyle(.white.opacity(0.92))
                        .fixedSize(horizontal: false, vertical: true)
                    HStack(spacing: 12) {
                        ForEach(["Free", "Open source", "Native Swift", "Apple silicon"], id: \.self) { t in
                            Text(t).font(.system(size: 22, weight: .semibold)).foregroundStyle(.white)
                                .padding(.horizontal, 16).padding(.vertical, 8)
                                .background(Capsule().fill(.white.opacity(0.16)))
                        }
                    }
                }
                .frame(width: 640, alignment: .leading)
                Image(nsImage: shot).resizable().aspectRatio(contentMode: .fit)
                    .frame(height: 540)
                    .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
                    .shadow(color: .black.opacity(0.5), radius: 30, y: 16)
            }
            .padding(.horizontal, 64)
        }
        .frame(width: 1280, height: 640)
    }
}

MainActor.assumeIsolated {
    let r = ImageRenderer(content: Card(name: a[1], tagline: a[2], icon: icon, shot: shot))
    r.scale = 1
    guard let cg = r.cgImage else { fatalError("render failed") }
    try! NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: a[5]))
    print(a[5])
}
