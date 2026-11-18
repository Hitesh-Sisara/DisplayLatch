import CoreGraphics
import Foundation
import IOKit

/// Private macOS display APIs, resolved at runtime with dlsym so a missing
/// symbol on a future macOS degrades a feature instead of crashing at launch.
enum SkyLight {
    typealias ConfigureBool = @convention(c) (CGDisplayConfigRef?, CGDirectDisplayID, Bool) -> CGError

    private static let handle = dlopen("/System/Library/PrivateFrameworks/SkyLight.framework/SkyLight", RTLD_NOW)

    /// Adds/removes a display from the desktop. `false` = the display is driven
    /// on its own and is NOT part of the desktop (this is what hid the Samsung).
    static let configureIndependentOutput: ConfigureBool? = sym("SLSConfigureDisplayIndependentOutput")
    /// Classic enable/disable of a display.
    static let configureEnabled: ConfigureBool? = sym("SLSConfigureDisplayEnabled")

    private static func sym<T>(_ name: String) -> T? {
        guard let handle, let p = dlsym(handle, name) else { return nil }
        return unsafeBitCast(p, to: T.self)
    }
}

enum CoreDisplayPrivate {
    typealias InfoFn = @convention(c) (CGDirectDisplayID) -> Unmanaged<CFDictionary>?
    private static let handle = dlopen("/System/Library/Frameworks/CoreDisplay.framework/CoreDisplay", RTLD_NOW)
    private static let infoFn: InfoFn? = {
        guard let handle, let p = dlsym(handle, "CoreDisplay_DisplayCreateInfoDictionary") else { return nil }
        return unsafeBitCast(p, to: InfoFn.self)
    }()

    static func info(_ id: CGDirectDisplayID) -> [String: Any] {
        (infoFn?(id)?.takeRetainedValue() as? [String: Any]) ?? [:]
    }
}

/// Built-in panel brightness (MacBook screen).
enum DisplayServices {
    typealias GetFn = @convention(c) (CGDirectDisplayID, UnsafeMutablePointer<Float>) -> Int32
    typealias SetFn = @convention(c) (CGDirectDisplayID, Float) -> Int32
    private static let handle = dlopen("/System/Library/PrivateFrameworks/DisplayServices.framework/DisplayServices", RTLD_NOW)
    private static let getFn: GetFn? = {
        guard let handle, let p = dlsym(handle, "DisplayServicesGetBrightness") else { return nil }
        return unsafeBitCast(p, to: GetFn.self)
    }()
    private static let setFn: SetFn? = {
        guard let handle, let p = dlsym(handle, "DisplayServicesSetBrightness") else { return nil }
        return unsafeBitCast(p, to: SetFn.self)
    }()

    static func brightness(_ id: CGDirectDisplayID) -> Double? {
        var v: Float = 0
        guard let getFn, getFn(id, &v) == 0 else { return nil }
        return Double(v)
    }

    static func setBrightness(_ id: CGDirectDisplayID, _ value: Double) {
        _ = setFn?(id, Float(value))
    }
}

// IOAVService (DDC/CI over the display link on Apple silicon). Exported by IOKit.
@_silgen_name("IOAVServiceCreateWithService")
func IOAVServiceCreateWithService(_ allocator: CFAllocator?, _ service: io_service_t) -> Unmanaged<CFTypeRef>?
@_silgen_name("IOAVServiceReadI2C")
func IOAVServiceReadI2C(_ service: CFTypeRef, _ chip: UInt32, _ offset: UInt32, _ buf: UnsafeMutableRawPointer, _ len: UInt32) -> IOReturn
@_silgen_name("IOAVServiceWriteI2C")
func IOAVServiceWriteI2C(_ service: CFTypeRef, _ chip: UInt32, _ offset: UInt32, _ buf: UnsafeMutableRawPointer, _ len: UInt32) -> IOReturn
