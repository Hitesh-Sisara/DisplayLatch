import CoreGraphics

/// Sample monitors for `--demo` (README screenshots). No hardware is touched.
enum Demo {
    private static let modes4K = Displays.dedupeModes([
        ModeOption(width: 1920, height: 1080, hiDPI: true, refresh: 60),
        ModeOption(width: 2560, height: 1440, hiDPI: true, refresh: 60),
        ModeOption(width: 3008, height: 1692, hiDPI: true, refresh: 60),
        ModeOption(width: 3840, height: 2160, hiDPI: false, refresh: 60),
        ModeOption(width: 1280, height: 720, hiDPI: true, refresh: 60),
    ])
    private static let modes1080 = Displays.dedupeModes([
        ModeOption(width: 1920, height: 1080, hiDPI: false, refresh: 75),
        ModeOption(width: 1600, height: 900, hiDPI: false, refresh: 60),
        ModeOption(width: 1280, height: 720, hiDPI: false, refresh: 60),
        ModeOption(width: 960, height: 540, hiDPI: true, refresh: 60),
    ])

    static let displays: [Display] = [
        Display(id: 9001, name: "Studio 27 4K", serial: "DEMO27A", key: "demo-a", isBuiltin: false, isOnline: true, isMain: true,
                registryPath: nil, modes: modes4K, currentMode: modes4K.first { $0.width == 2560 }),
        Display(id: 9002, name: "Office 24 FHD", serial: "DEMO24B", key: "demo-b", isBuiltin: false, isOnline: true, isMain: false,
                registryPath: nil, modes: modes1080, currentMode: modes1080.last),
        Display(id: 9003, name: "Side 22 FHD", serial: "DEMO22C", key: "demo-c", isBuiltin: false, isOnline: false, isMain: false,
                registryPath: nil, modes: [], currentMode: nil),
    ]
    static let brightness: [String: Double] = ["demo-a": 0.72, "demo-b": 0.64]
}
