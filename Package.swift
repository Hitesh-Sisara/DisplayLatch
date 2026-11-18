// swift-tools-version:5.10
import PackageDescription

let package = Package(
    name: "DisplayLatch",
    platforms: [.macOS(.v14)],
    targets: [
        .executableTarget(
            name: "DisplayLatch",
            path: "Sources/DisplayLatch",
            linkerSettings: [
                .linkedFramework("IOKit"),
                .linkedFramework("CoreGraphics"),
                .linkedFramework("AppKit"),
            ]
        ),
        .testTarget(
            name: "DisplayLatchTests",
            dependencies: ["DisplayLatch"],
            path: "Tests/DisplayLatchTests"
        ),
    ]
)
