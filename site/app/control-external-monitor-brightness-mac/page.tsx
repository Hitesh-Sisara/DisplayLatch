import Link from "next/link";
import { GuidePage, guideMetadata } from "../../components/guide";

const SLUG = "control-external-monitor-brightness-mac";
export const metadata = guideMetadata(SLUG);

const FAQ = [
  {
    q: "How do I adjust the brightness of a second monitor on a Mac?",
    a: "Use a DDC/CI app such as DisplayLatch. It changes the monitor's hardware brightness from the menu bar, with a slider per monitor or one slider for all displays. macOS itself only changes brightness on Apple displays.",
  },
  {
    q: "Why can't I change external monitor brightness in System Settings?",
    a: "System Settings only shows a brightness slider for displays that Apple controls directly, like the MacBook screen and Apple Studio Display. Other monitors expect brightness changes over DDC/CI, which macOS doesn't expose, so you need an app to send them.",
  },
  {
    q: "Can I change the brightness of all my monitors at once?",
    a: "Yes. DisplayLatch shows an All displays slider when more than one screen is connected. It moves the built-in screen and every DDC monitor together. From Terminal, run displaylatch brightness all 40.",
  },
  {
    q: "Does DDC brightness work on M1, M2, M3 and M4 Macs?",
    a: "Yes, through USB-C, Thunderbolt and DisplayPort connections, and through HDMI on most newer Macs. The built-in HDMI port on M1 Macs and the base M2 Mac mini doesn't pass DDC, so use a USB-C to HDMI or DisplayPort cable there.",
  },
  {
    q: "Is software dimming the same as DDC brightness?",
    a: "No. Software dimming darkens the picture with an overlay or gamma change while the backlight stays at full power. DDC changes the backlight itself, which saves power, avoids washed-out blacks and keeps the full range of colours.",
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={SLUG}
      h1={
        <>
          Control external monitor brightness on a <span className="accent">Mac</span>
        </>
      }
      lede="macOS only dims Apple displays, so for most monitors you're stuck pressing tiny buttons on the back. Here's how to change the real backlight of any DDC/CI monitor from your menu bar or Terminal, one at a time or all together, for free."
      faq={FAQ}
      howTo={{
        name: "Change external monitor brightness on a Mac",
        steps: [
          "Turn on DDC/CI in the monitor's own on-screen menu if it has that option.",
          "Download DisplayLatch from GitHub and drag it into Applications.",
          "Open DisplayLatch and click the display icon in the menu bar.",
          "Drag a monitor's brightness slider, or the All displays slider to change every screen at once.",
        ],
      }}
    >
      <figure className="figure">
        <img
          src="/images/popover-light.png"
          alt="DisplayLatch menu with an All displays brightness slider and a DDC brightness slider for each external monitor"
          width={386}
          height={612}
          loading="lazy"
        />
        <figcaption>One slider for every screen, plus a slider per monitor.</figcaption>
      </figure>

      <h2>Why macOS can't dim your external monitor</h2>
      <p>
        The brightness keys and the slider in <b>System Settings › Displays</b> only work on screens
        Apple drives directly: the MacBook's built-in panel, the Studio Display and the Pro Display
        XDR. A Dell, LG, Samsung or BenQ monitor keeps its brightness setting inside the monitor,
        and macOS has no built-in way to change it.
      </p>
      <p>
        That setting can be changed from the computer through <b>DDC/CI</b> (Display Data Channel
        Command Interface). It's a standard command channel that runs over the same HDMI,
        DisplayPort or USB-C cable as the picture. Nearly every desktop monitor made in the last 15
        years supports it.
      </p>

      <h2>Step by step: change brightness with DisplayLatch</h2>
      <ol>
        <li>
          <b>Check DDC/CI on the monitor.</b> Open its on-screen menu and look for{" "}
          <i>DDC/CI</i>, usually under System or Other settings. Turn it on if it's off.
        </li>
        <li>
          <b>Install DisplayLatch.</b> <Link href="/">Download it free</Link>, drag it into
          Applications and open it. A display icon appears in the menu bar.
        </li>
        <li>
          <b>Drag a slider.</b> Each monitor has its own <b>Brightness</b> slider. The monitor's
          backlight changes right away.
        </li>
        <li>
          <b>Or move them all.</b> With two or more screens, the <b>All displays</b> slider changes
          the MacBook screen and every monitor together.
        </li>
      </ol>

      <div className="callout">
        <b>Tip</b>
        Monitors from different brands rarely look equally bright at the same percentage. Set each
        one by eye once, then use <b>All displays</b> to move them together.
      </div>

      <h2>Change brightness from Terminal, Shortcuts or cron</h2>
      <p>The app doubles as a command-line tool, which makes brightness easy to automate:</p>
      <pre>
        <code>{`displaylatch brightness all          # read every display
displaylatch brightness all 40       # set every display to 40%
displaylatch brightness ABC1234567 70  # one monitor, by serial, ID or name`}</code>
      </pre>
      <p>
        For example, a Shortcuts automation at sunset can run{" "}
        <code>displaylatch brightness all 35</code>, and another at sunrise can set 80.
      </p>

      <h2>Brightness doesn't change? Check these</h2>
      <ul>
        <li>
          <b>DDC/CI is off</b> in the monitor's menu. Some monitors ship with it disabled, and
          some turn it off when you pick certain picture modes.
        </li>
        <li>
          <b>A dock, KVM or adapter</b> is in the way. Many don't pass DDC through. Test with a
          direct cable first.
        </li>
        <li>
          <b>M1 built-in HDMI.</b> The HDMI port on M1 Macs and the base M2 Mac mini doesn't
          carry DDC. Use USB-C to HDMI or USB-C to DisplayPort instead.
        </li>
        <li>
          <b>The monitor doesn't support DDC.</b> TVs, many portable USB-C monitors and DisplayLink
          screens usually don't.
        </li>
        <li>
          <b>HDR is on.</b> Some monitors lock brightness in HDR mode. Turn HDR off in System
          Settings › Displays to test.
        </li>
      </ul>

      <h2>Other ways to dim an external monitor on Mac</h2>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Real backlight</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Monitor buttons</td>
            <td>Yes</td>
            <td>Always works, but slow and different on every monitor.</td>
          </tr>
          <tr>
            <td>DDC app (DisplayLatch, MonitorControl, Lunar)</td>
            <td>Yes</td>
            <td>Fast, per-monitor or all at once. Needs DDC/CI support.</td>
          </tr>
          <tr>
            <td>Overlay or gamma dimming</td>
            <td>No</td>
            <td>Works on any screen, but greys out blacks and saves no power.</td>
          </tr>
          <tr>
            <td>Night Shift</td>
            <td>No</td>
            <td>Changes colour temperature, not brightness.</td>
          </tr>
        </tbody>
      </table>
      <p>
        If you also want your MacBook's brightness keys to control external monitors, MonitorControl
        is the best free option for that. DisplayLatch focuses on sliders, the All displays control,
        scripting, and{" "}
        <Link href="/fix-external-monitor-not-detected-after-sleep-mac/">
          keeping monitors connected after sleep
        </Link>
        .
      </p>
    </GuidePage>
  );
}
