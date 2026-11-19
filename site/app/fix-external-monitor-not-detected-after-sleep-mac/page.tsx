import Link from "next/link";
import { GuidePage, guideMetadata } from "../../components/guide";

const SLUG = "fix-external-monitor-not-detected-after-sleep-mac";
export const metadata = guideMetadata(SLUG);

const FAQ = [
  {
    q: "Why does my Mac not detect my external monitor after sleep?",
    a: "If System Information doesn't list the monitor, the cause is physical: the cable, adapter, input or power. If it is listed but stays black, macOS WindowServer has kept it off the desktop, for example as an independent output, and DisplayLatch can bring it back automatically.",
  },
  {
    q: "Why does my second monitor stay black but show as connected on my Mac?",
    a: "macOS can keep a detected monitor off the desktop. The monitor gets power and is identified, but it receives no picture. The state is saved, so it can come back after every restart. Running displaylatch fix, or keeping DisplayLatch running, puts the monitor back on the desktop.",
  },
  {
    q: "Do I need to delete WindowServer plist files to fix a missing monitor?",
    a: "Usually not. WindowServer often writes the same stored state back on the next boot. DisplayLatch fixes it through the macOS display configuration instead, without deleting files or restarting.",
  },
  {
    q: "Will DisplayLatch turn on a monitor I switched off on purpose?",
    a: "No. Monitors you switch off in DisplayLatch are remembered and stay off until you turn them back on. It also never wakes the built-in screen while the lid is closed.",
  },
];

export default function Page() {
  return (
    <GuidePage
      slug={SLUG}
      h1={
        <>
          External monitor black or <span className="accent">not detected</span> after sleep on Mac
        </>
      }
      lede="You wake your Mac and one monitor stays black, or it's missing from the desktop. Replugging may not help, and it can come back after every restart. Here's how to tell a cable problem from a macOS one, and how to fix each for good."
      faq={FAQ}
      howTo={{
        name: "Fix an external monitor that stays black after sleep on Mac",
        steps: [
          "Open System Information › Graphics/Displays and check whether the monitor is listed.",
          "If it isn't listed, reseat or replace the cable, adapter or dock and check the monitor's input and power.",
          "If it is listed but black, install DisplayLatch or run displaylatch fix to put it back on the desktop.",
          "Leave Keep monitors connected on so DisplayLatch fixes it automatically after every wake and restart.",
        ],
      }}
    >
      <h2>Step 1: is it the cable or macOS?</h2>
      <p>
        Open <b>System Information</b> (hold Option and choose Apple menu › System Information),
        then select <b>Graphics/Displays</b>.
      </p>
      <ul>
        <li>
          <b>The monitor is not listed.</b> The Mac doesn't see it at all, so the cause is physical.
          Reseat the cable at both ends, try another cable or port, check the monitor's input source
          and power, and remove any dock or adapter to test.
        </li>
        <li>
          <b>The monitor is listed but stays black</b>, or <code>displaylatch list</code> shows it as{" "}
          <code>OFFLINE</code>. The Mac detects the monitor, but macOS is keeping it off the
          desktop. Read on.
        </li>
      </ul>

      <h2>Step 2: why macOS keeps a detected monitor off the desktop</h2>
      <p>
        WindowServer, the part of macOS that manages screens, decides which detected monitors join
        the desktop. It can store a monitor as an <b>independent output</b> or leave it{" "}
        <b>disabled</b>. The monitor then gets power and macOS reads its details, but it never gets
        a picture.
      </p>
      <p>
        WindowServer saves this state, so the monitor can stay dark after every reboot. Display
        utilities that "disconnect" monitors, and the macOS option to stop extending to a display,
        can leave a monitor in this state. Deleting preference files often doesn't help, because
        WindowServer writes the same state back.
      </p>

      <h2>Step 3: fix it</h2>
      <h3>Quick things to try first</h3>
      <ol>
        <li>Put the displays to sleep and wake them (Control-Shift-Power, or close and open the lid), then wait 10 seconds.</li>
        <li>Unplug all external monitors, wait 10 seconds, and connect them again one at a time.</li>
        <li>Open System Settings › Displays and check the monitor isn't mirrored and is set to Extended display.</li>
      </ol>
      <p>If the monitor comes back but disappears again after the next sleep or restart, the stored state is the cause.</p>

      <h3>Fix it automatically with DisplayLatch</h3>
      <p>
        <Link href="/">DisplayLatch</Link> is a free menu-bar app that checks after every display
        change, after wake and every 20 seconds. If a monitor is attached but off the desktop, it
        clears the independent-output flag, enables the display again and puts it back where it
        was in your arrangement. Usually within about a second.
      </p>
      <p>To run the fix once from Terminal:</p>
      <pre>
        <code>displaylatch fix</code>
      </pre>
      <div className="callout">
        <b>Good to know</b>
        Monitors you switched off on purpose in DisplayLatch stay off, and the built-in screen stays
        dark while the lid is closed. Every fix is written to <code>~/Library/Logs/DisplayLatch.log</code>.
      </div>

      <h2>Further reading</h2>
      <ul>
        <li>
          <a href="https://blog.cheverjohn.me/macos-26-stop-extending-blanked-my-monitor-fixing-windowserver-independentoutput">
            A detailed write-up of the WindowServer IndependentOutput problem
          </a>
        </li>
        <li>
          <a href="https://apple.stackexchange.com/questions/339671">
            Apple Stack Exchange: external display not recognised after waking from sleep
          </a>
        </li>
        <li>
          <Link href="/control-external-monitor-brightness-mac/">
            Control external monitor brightness on a Mac
          </Link>
        </li>
      </ul>
    </GuidePage>
  );
}
