import Link from "next/link";
import { GuidePage, guideMetadata } from "../../components/guide";

const SLUG = "disconnect-display-mac-without-unplugging";
export const metadata = guideMetadata(SLUG);

const FAQ = [
  {
    q: "Can I turn off an external monitor on Mac without unplugging it?",
    a: "Yes. DisplayLatch adds a switch for each monitor in the menu bar, and the command displaylatch disconnect. Either one takes the display off the desktop without touching the cable.",
  },
  {
    q: "Will my windows come back when I reconnect the display?",
    a: "macOS moves windows to the remaining screens when a display is disconnected. When you reconnect it, DisplayLatch restores the display's position in your arrangement, and macOS decides where windows go.",
  },
  {
    q: "Is disconnecting the same as setting brightness to zero?",
    a: "No. At zero brightness the screen is still part of the desktop, so the mouse and new windows can end up there. Disconnecting removes it from the arrangement completely.",
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={SLUG}
      h1={
        <>
          Disconnect a display on Mac <span className="accent">without</span> unplugging it
        </>
      }
      lede="Sometimes you want one monitor gone: for a call, for focus, to save power, or so windows stop landing on a screen you aren't using. macOS has no switch for this. Here's how to do it for free."
      faq={FAQ}
      howTo={{
        name: "Disconnect an external display on Mac without unplugging",
        steps: [
          "Install DisplayLatch and click the display icon in the menu bar.",
          "Turn off the switch next to the monitor you want to disconnect.",
          "Turn the switch back on to restore the monitor in the same position.",
        ],
      }}
    >
      <h2>With DisplayLatch (menu bar)</h2>
      <ol>
        <li>
          Install <Link href="/">DisplayLatch</Link> (free and open source).
        </li>
        <li>Click the display icon in the menu bar.</li>
        <li>Turn off the switch next to the monitor. It leaves the desktop, and its windows move to your other displays.</li>
        <li>Turn the switch back on to restore it in the same place in your arrangement.</li>
      </ol>

      <h2>From Terminal</h2>
      <pre>
        <code>{`displaylatch list
displaylatch disconnect ABC1234567     # by serial, ID or name
displaylatch connect ABC1234567`}</code>
      </pre>

      <h2>What "disconnect" means here</h2>
      <p>
        The monitor stays physically connected and powered, but macOS stops using it as a screen.
        That's different from dimming it to black: the space disappears from your arrangement, so
        the mouse and new windows can't go there.
      </p>
      <p>
        DisplayLatch remembers monitors you disconnected, so its automatic reconnect leaves them off
        until you turn them back on. DisplayLatch won't let you disconnect your last screen.
      </p>

      <h2>Alternatives</h2>
      <p>
        BetterDisplay has this feature in its paid Pro version. <code>displayplacer</code> can
        rearrange displays from the command line. Turning a monitor off with its own power button
        often works too, but some monitors keep the Mac thinking they're still connected, so windows
        can stay on a dark screen.
      </p>
      <p>
        Want the monitor on, just dimmer? See{" "}
        <Link href="/control-external-monitor-brightness-mac/">how to control external monitor brightness</Link>.
      </p>
    </GuidePage>
  );
}
