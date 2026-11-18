import XCTest
@testable import DisplayLatch

final class DDCTests: XCTestCase {
    func testGetPacketChecksum() {
        // 0x6E ^ 0x51 ^ 0x82 ^ 0x01 ^ 0x10 = 0xAC
        XCTAssertEqual(DDC.getPacket(vcp: 0x10), [0x82, 0x01, 0x10, 0xAC])
    }

    func testSetPacketEncodesValueAndChecksum() {
        let p = DDC.setPacket(vcp: 0x10, value: 70)
        XCTAssertEqual(Array(p.prefix(5)), [0x84, 0x03, 0x10, 0x00, 70])
        XCTAssertEqual(p[5], DDC.checksum(Array(p.prefix(5))))
    }

    func testSetPacketClampsValue() {
        XCTAssertEqual(DDC.setPacket(vcp: 0x10, value: -5)[4], 0)
        XCTAssertEqual(Array(DDC.setPacket(vcp: 0x10, value: 99_999)[3...4]), [0xFF, 0xFF])
    }

    func testParseReply() {
        let reply: [UInt8] = [0x6E, 0x88, 0x02, 0x00, 0x10, 0x00, 0x00, 0x64, 0x00, 0x2D, 0x00, 0x00]
        let r = DDC.parseReply(reply, vcp: 0x10)
        XCTAssertEqual(r?.current, 45)
        XCTAssertEqual(r?.max, 100)
    }

    func testParseReplyRejectsWrongCodeOrError() {
        var reply: [UInt8] = [0x6E, 0x88, 0x02, 0x00, 0x12, 0x00, 0x00, 0x64, 0x00, 0x2D, 0, 0]
        XCTAssertNil(DDC.parseReply(reply, vcp: 0x10))          // reply for contrast, asked brightness
        reply[4] = 0x10; reply[3] = 0x01
        XCTAssertNil(DDC.parseReply(reply, vcp: 0x10))          // "unsupported VCP" result code
        XCTAssertNil(DDC.parseReply([0x6E, 0x88], vcp: 0x10))   // short read
    }

    func testDispextToken() {
        XCTAssertEqual(DDC.dispextToken("IOService:/AppleARMPE/arm-io@10F00000/AppleH15IO/dispext1@48000000/IOMobileFramebufferShim"), "dispext1")
        XCTAssertEqual(DDC.dispextToken("IOService:/x/dcpext0@6C00000/dispext0:dcpav-service-epic:0/DCPAVServiceProxy"), "dispext0")
        XCTAssertNil(DDC.dispextToken("IOService:/x/disp0@84000000/IOMobileFramebufferShim"))
    }
}

final class DisplayHelperTests: XCTestCase {
    func testDedupeModesKeepsHighestRefreshAndSorts() {
        let modes = [
            ModeOption(width: 1920, height: 1080, hiDPI: false, refresh: 60),
            ModeOption(width: 1920, height: 1080, hiDPI: false, refresh: 75),
            ModeOption(width: 1920, height: 1080, hiDPI: true, refresh: 60),
            ModeOption(width: 1280, height: 720, hiDPI: false, refresh: 60),
        ]
        let out = Displays.dedupeModes(modes)
        XCTAssertEqual(out.map(\.label), ["1280 × 720", "1920 × 1080", "1920 × 1080 HiDPI"])
        XCTAssertEqual(out[1].refresh, 75)
    }

    func testDisambiguateNumbersDuplicatesOnly() {
        XCTAssertEqual(Displays.disambiguate(["S22A33x", "Color LCD", "S22A33x"]), ["S22A33x 1", "Color LCD", "S22A33x 2"])
        XCTAssertEqual(Displays.disambiguate(["A", "B"]), ["A", "B"])
    }

    func testRegistryMatchByProductAttributes() {
        let a = Displays.RegistryAttributes(edidUUID: nil, serial: "X", productName: "S22A33x", vendor: 19501, product: 28962)
        XCTAssertTrue(a.matches(vendor: 19501, model: 28962))
        XCTAssertFalse(a.matches(vendor: 19501, model: 1))
    }

    func testRegistryMatchByEDIDUUIDPrefix() {
        // EDID UUID starts with vendor (big-endian) then product (little-endian): 4C2D + 2271 = SAM 0x7122.
        let a = Displays.RegistryAttributes(edidUUID: "4C2D2271-0000-0000-1D21-010380301A78", serial: nil, productName: nil, vendor: nil, product: nil)
        XCTAssertTrue(a.matches(vendor: 0x4C2D, model: 0x7122))
        XCTAssertFalse(a.matches(vendor: 0x4C2D, model: 0x2271))
    }
}

final class UpdaterTests: XCTestCase {
    func testVersionCompare() {
        XCTAssertTrue(Updater.isNewer("v1.10.0", than: "1.9.3"))
        XCTAssertTrue(Updater.isNewer("1.0.1", than: "1.0"))
        XCTAssertFalse(Updater.isNewer("v1.0.0", than: "1.0.0"))
        XCTAssertFalse(Updater.isNewer("0.9", than: "1.0.0"))
        XCTAssertFalse(Updater.isNewer("v2.0.0", than: "dev"))
        XCTAssertFalse(Updater.isNewer("v2.0.0-beta", than: "1.0.0"))
    }
}
