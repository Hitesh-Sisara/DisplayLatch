import Link from "next/link";
import { GuidePage, guideMetadata } from "../../components/guide";

const SLUG = "free-betterdisplay-alternative";
export const metadata = guideMetadata(SLUG);

const FAQ = [
  {
    q: "Is there a free alternative to BetterDisplay?",
    a: "Yes. DisplayLatch is a free, open-source macOS app (MIT). It handles external monitor brightness, keeping monitors connected, disconnecting displays, resolution and a CLI. MonitorControl is another free option focused on brightness keys.",
  },
  {
    q: "Can DisplayLatch reconnect a monitor that BetterDisplay disconnected?",
    a: "Yes. If BetterDisplay disconnected a monitor and your Pro trial ended, DisplayLatch detects that the monitor is attached but off the desktop and reconnects it.",
  },
  {
    q: "Is DisplayLatch a MonitorControl alternative?",
    a: "For brightness, yes: both use DDC/CI to change the real backlight. MonitorControl adds brightness keys and the native on-screen display. DisplayLatch adds an All displays slider, auto-reconnect after sleep, disconnecting displays and resolution switching.",
  },
];

const ROWS: [string, string, string, string][] = [
  ["Price", "Free", "Free + paid Pro", "Free"],
  ["Source code", "Open (MIT)", "Closed", "Open (MIT)"],
  ["External monitor brightness (DDC)", "Yes", "Yes", "Yes"],
  ["Auto-reconnect monitors left dark after sleep", "Yes", "Not advertised", "No"],
  ["Disconnect a display without unplugging", "Yes", "Pro", "No"],
  ["Resolution switcher", "Yes", "Yes", "No"],
  ["Command-line tool", "Yes", "Yes", "Not documented"],
  ["Brightness keys and native OSD", "No", "Yes", "Yes"],
  ["HiDPI scaling, virtual screens, PIP, XDR", "No", "Yes", "No"],
];

export default function Page() {
  return (
    <GuidePage
      slug={SLUG}
      h1={
        <>
          A free, open-source <span className="accent">BetterDisplay</span> alternative
        </>
      }
      lede="BetterDisplay is an excellent, very complete display tool, and some features, like disconnecting a display, are in its paid Pro version. If you only need the everyday controls, DisplayLatch does them for free and in the open."
      faq={FAQ}
    >
      <h2>DisplayLatch vs BetterDisplay vs MonitorControl</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>DisplayLatch</th>
            <th>BetterDisplay</th>
            <th>MonitorControl</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map(([a, b, c, d]) => (
            <tr key={a}>
              <td>{a}</td>
              <td>
                <b>{b}</b>
              </td>
              <td>{c}</td>
              <td>{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: 14, color: "var(--soft)" }}>
        Based on each product's own website and README as of November 2026.
      </p>

      <h2>When to choose which</h2>
      <ul>
        <li>
          <b>Choose DisplayLatch</b> if you want a small, free, auditable app for{" "}
          <Link href="/control-external-monitor-brightness-mac/">external monitor brightness</Link>,
          one slider for all screens, monitors that{" "}
          <Link href="/fix-external-monitor-not-detected-after-sleep-mac/">come back after sleep</Link>,
          resolution and disconnecting.
        </li>
        <li>
          <b>Choose BetterDisplay</b> if you need HiDPI on non-Retina monitors, virtual screens,
          picture-in-picture or XDR brightness.
        </li>
        <li>
          <b>Choose MonitorControl</b> if you mainly want your keyboard's brightness and volume keys
          to work on external monitors.
        </li>
      </ul>

      <h2>Switching from BetterDisplay</h2>
      <p>
        If BetterDisplay disconnected a monitor and you can't turn it back on without Pro,
        DisplayLatch can bring it back. Install it and the monitor reconnects automatically, or run{" "}
        <code>displaylatch fix</code>. Quit BetterDisplay first, so the two apps don't both change
        the same displays.
      </p>
    </GuidePage>
  );
}
