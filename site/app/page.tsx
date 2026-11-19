import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "../components/chrome";
import { BrightnessDemo, HeroPopover } from "../components/demos";
import {
  Apple,
  Arrow,
  Bolt,
  GitHub,
  Laptop,
  Moon,
  Pin,
  Power,
  Resize,
  Shield,
  Terminal,
} from "../components/icons";
import { GUIDES, HOME_FAQ, OG_IMAGE, SITE } from "../lib/site";

export const metadata: Metadata = {
  title: { absolute: "DisplayLatch: Free External Monitor Brightness Control & Auto-Reconnect for Mac" },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "DisplayLatch",
    images: OG_IMAGE,
    url: "/",
    title: "DisplayLatch: external monitor brightness and auto-reconnect for Mac",
    description:
      "Real DDC brightness for every monitor, one slider for all screens, and monitors that come back on their own after sleep. Free and open source.",
  },
};

const FEATURES = [
  {
    icon: <Laptop />,
    title: "Built-in display too",
    text: "The MacBook screen sits in the same list, so one slider can move the laptop and every monitor together.",
  },
  {
    icon: <Resize />,
    title: "Resolution switcher",
    text: "Every mode macOS offers for each display, HiDPI included, from a slider or a menu. No trip to System Settings.",
  },
  {
    icon: <Pin />,
    title: "Arrangement memory",
    text: "Each monitor's position is saved. After a reconnect it goes back exactly where it was, not stacked on the left.",
  },
  {
    icon: <Terminal />,
    title: "Command-line tool",
    text: "Script brightness, resolution and connections from Terminal, Shortcuts, cron or a Raycast script.",
  },
  {
    icon: <Bolt />,
    title: "Native and tiny",
    text: "Swift and SwiftUI, about 1.5 MB. No Electron, no helper daemons, no account. Starts at login, then stays out of the way.",
  },
  {
    icon: <Shield />,
    title: "Private by default",
    text: "No telemetry and no analytics. The only network call is an optional daily check for a new GitHub release.",
  },
];

const COMPARE: [string, string, string, string][] = [
  ["Price", "Free", "Free + paid Pro", "Free"],
  ["Open source", "Yes, MIT", "No", "Yes, MIT"],
  ["External monitor brightness (DDC)", "Yes", "Yes", "Yes"],
  ["Auto-reconnect monitors left dark after sleep", "Yes", "Not advertised", "No"],
  ["Disconnect a display without unplugging", "Yes", "Pro only", "No"],
  ["Resolution switcher", "Yes", "Yes", "No"],
  ["Command-line tool", "Yes", "Yes", "Not documented"],
  ["Brightness keys and native OSD", "No", "Yes", "Yes"],
  ["HiDPI scaling, virtual screens, PIP, XDR", "No", "Yes", "No"],
];

function cell(v: string) {
  if (v.startsWith("Yes")) return <span className="yes">{v}</span>;
  if (v === "No") return <span className="no">No</span>;
  return v;
}

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "DisplayLatch",
          url: SITE.url,
          downloadUrl: SITE.releases,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "macOS 14 or later (Apple silicon)",
          softwareVersion: SITE.version,
          fileSize: "1.6MB",
          license: "https://opensource.org/licenses/MIT",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
          image: `${SITE.url}/images/icon-256.png`,
          screenshot: `${SITE.url}/images/popover-light.png`,
          sameAs: [SITE.repo],
          description:
            "Free, open-source macOS menu-bar app that controls external monitor brightness over DDC/CI and automatically reconnects monitors that stay black after sleep.",
          featureList: [
            "External monitor brightness over DDC/CI",
            "One brightness slider for all displays",
            "Automatic reconnect of monitors left dark after sleep",
            "Disconnect a display without unplugging",
            "Resolution switcher with HiDPI modes",
            "Command-line tool",
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: HOME_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <a className="pill-new" href={SITE.releases}>
              <b>NEW</b> Version {SITE.version} is out, free for everyone
            </a>
            <h1 className="display">
              Brighter monitors. <span className="accent">Zero</span> black screens.
            </h1>
            <p className="lede">
              DisplayLatch is a free, open-source Mac menu-bar app that controls external monitor
              brightness with real DDC backlight control, lets one slider dim every screen at once,
              and brings back monitors that stay black after sleep.
            </p>
            <div className="btn-row">
              <a className="btn btn-dark" href={SITE.download} rel="noopener">
                <Apple />
                Download for Mac
              </a>
              <a className="btn btn-light" href={SITE.repo} rel="noopener">
                <GitHub />
                View source
              </a>
            </div>
            <div className="fineprint">
              <span>Free & MIT licensed</span>
              <span>Apple silicon, macOS 14+</span>
              <span>1.5 MB native app</span>
            </div>
          </div>
          <HeroPopover />
        </div>
      </section>

      {/* STATS */}
      <section className="stats" aria-label="At a glance">
        <div className="wrap">
          <div className="stat">
            <strong>$0</strong>
            <span>No Pro tier, ever</span>
          </div>
          <div className="stat">
            <strong>1 slider</strong>
            <span>for every screen you own</span>
          </div>
          <div className="stat">
            <strong>~1 s</strong>
            <span>to bring a dark monitor back</span>
          </div>
          <div className="stat">
            <strong>0</strong>
            <span>trackers, accounts or daemons</span>
          </div>
        </div>
      </section>

      {/* BRIGHTNESS */}
      <section className="section" id="brightness">
        <div className="wrap split">
          <div>
            <p className="eyebrow">External monitor brightness</p>
            <h2 className="h2">
              Real backlight control. <span className="accent">One slider</span> for every screen.
            </h2>
            <p className="lede">
              macOS only dims Apple displays. DisplayLatch talks to your other monitors over DDC/CI,
              the same channel their own buttons use, so the backlight really changes. No grey
              overlay, no washed-out blacks, less power at night.
            </p>
            <ul className="checks">
              <li>
                <span>
                  <b>All displays at once.</b> Dim the MacBook and every monitor together, then
                  fine-tune any one of them.
                </span>
              </li>
              <li>
                <span>
                  <b>Per-monitor sliders</b> for mismatched panels that never look the same at the
                  same number.
                </span>
              </li>
              <li>
                <span>
                  <b>Scriptable.</b> <code>displaylatch brightness all 40</code> at sunset, from
                  Shortcuts or cron.
                </span>
              </li>
              <li>
                <span>
                  <b>Works with most desktop monitors.</b> Dell, LG, Samsung, BenQ, ASUS and most
                  other brands support DDC/CI.
                </span>
              </li>
            </ul>
            <Link className="text-link" href="/control-external-monitor-brightness-mac/">
              Read the brightness guide <Arrow />
            </Link>
          </div>
          <BrightnessDemo />
        </div>
      </section>

      {/* RECONNECT */}
      <section className="section clay" id="reconnect">
        <div className="wrap split flip">
          <div>
            <p className="eyebrow">Keep monitors connected</p>
            <h2 className="h2">
              Black screen after sleep? <span className="accent">Fixed</span> before you notice.
            </h2>
            <p className="lede">
              Sometimes macOS still detects a monitor but keeps it off the desktop, and saves that
              state so it comes back after every restart. Replugging doesn't help. DisplayLatch
              spots the monitor that is attached but missing and puts it back, in the same place.
            </p>
            <ul className="checks">
              <li>
                <span>
                  <b>Checks after every display change,</b> after wake, and every 20 seconds as a
                  safety net.
                </span>
              </li>
              <li>
                <span>
                  <b>Restores your arrangement,</b> so the monitor doesn't jump to the other side.
                </span>
              </li>
              <li>
                <span>
                  <b>Respects your choices.</b> A monitor you switched off stays off, and the
                  built-in screen stays dark with the lid closed.
                </span>
              </li>
            </ul>
            <Link className="text-link" href="/fix-external-monitor-not-detected-after-sleep-mac/">
              Why monitors stay black after sleep <Arrow />
            </Link>
          </div>
          <div className="panel">
            <div className="timeline">
              <div className="tl">
                <b>09:41:02</b>Mac wakes up
              </div>
              <div className="tl bad">
                <b>09:41:03</b>Studio 27 stays dark
              </div>
              <div className="tl done">
                <b>09:41:04</b>Back on the desktop
              </div>
            </div>
            <div className="log" role="img" aria-label="DisplayLatch log showing a monitor reconnected after wake">
              <div>
                <span className="t">09:41:02</span> wake: checking displays
              </div>
              <div>
                <span className="t">09:41:03</span> <span className="warn">Studio 27 4K attached, not on desktop</span>
              </div>
              <div>
                <span className="t">09:41:03</span> clear independent output, enable
              </div>
              <div>
                <span className="t">09:41:04</span> restore origin (2560, 0)
              </div>
              <div>
                <span className="t">09:41:04</span> <span className="ok">Reconnected Studio 27 4K [trigger: wake]</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DISCONNECT */}
      <section className="section">
        <div className="wrap split">
          <div>
            <p className="eyebrow">Disconnect without unplugging</p>
            <h2 className="h2">
              Turn a monitor off. <span className="accent">Leave</span> the cable alone.
            </h2>
            <p className="lede">
              Need one screen gone for a call, a game or some focus? Flip its switch. Windows move
              to your other displays, the mouse can't wander there, and flipping it back restores it
              in the same spot. Free, where other apps charge for it.
            </p>
            <Link className="text-link" href="/disconnect-display-mac-without-unplugging/">
              How disconnecting works <Arrow />
            </Link>
          </div>
          <div className="panel warm">
            <div className="popover" style={{ margin: "0 auto" }}>
              <div className="pop-card">
                <div className="pop-head">
                  <Power />
                  <span className="pop-name">Studio 27 4K</span>
                  <span className="badge-m">M</span>
                  <span className="toggle" aria-hidden="true" data-on="true" />
                </div>
                <div className="pop-res">
                  <span>2560 × 1440 HiDPI</span>
                  <span>On the desktop</span>
                </div>
              </div>
              <div className="pop-card off">
                <div className="pop-head">
                  <Moon />
                  <span className="pop-name">Office 24 FHD</span>
                  <span className="toggle" aria-hidden="true" data-on="false" />
                </div>
                <div className="pop-res">
                  <span>Disconnected, still plugged in</span>
                  <span>Stays off</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section clay" id="features">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Everything else you need</p>
            <h2 className="h2">
              Small app. <span className="accent">Every</span> everyday control.
            </h2>
          </div>
          <div className="grid3">
            {FEATURES.map((f) => (
              <div className="feature" key={f.title}>
                <div className="ico">{f.icon}</div>
                <h3 className="h3">{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLI */}
      <section className="section">
        <div className="wrap split">
          <div>
            <p className="eyebrow">For power users</p>
            <h2 className="h2">
              Your displays, <span className="accent">scriptable.</span>
            </h2>
            <p className="lede">
              The app is also a command-line tool. Dim everything at night, switch resolution for a
              screen share, or fix a dark monitor from an SSH session. Displays can be named by ID,
              serial number or name.
            </p>
          </div>
          <div className="terminal">
            <div className="term-bar">
              <i />
              <i />
              <i />
              <span>zsh</span>
            </div>
            <pre>
              <code>
                <span className="p">$ </span>displaylatch list{"\n"}
                <span className="o">{"  1  online  Built-in Display   1512 × 982\n"}</span>
                <span className="o">{"  3  online  Studio 27 4K       2560 × 1440  main\n"}</span>
                <span className="o">{"  2  online  Office 24 FHD      1920 × 1080\n\n"}</span>
                <span className="p">$ </span>displaylatch brightness all 40{"\n"}
                <span className="p">$ </span>displaylatch resolution 3 1920x1080@2x{"\n"}
                <span className="p">$ </span>displaylatch disconnect "Office 24"{"\n"}
                <span className="p">$ </span>displaylatch fix{"  "}
                <span className="c"># bring back any dark monitor</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* COMPARE */}
      <section className="section clay" id="compare">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">How it compares</p>
            <h2 className="h2">
              The free <span className="accent">alternative</span> for everyday displays.
            </h2>
            <p className="lede">
              BetterDisplay is the most complete display tool and MonitorControl is great for
              brightness keys. DisplayLatch focuses on brightness plus keeping your monitors
              connected, free and in the open.
            </p>
          </div>
          <div className="table-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col" className="us">
                    DisplayLatch
                  </th>
                  <th scope="col">BetterDisplay</th>
                  <th scope="col">MonitorControl</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([f, us, bd, mc]) => (
                  <tr key={f}>
                    <td>{f}</td>
                    <td className="us">{cell(us)}</td>
                    <td>{cell(bd)}</td>
                    <td>{cell(mc)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="note center">
            Based on each project's own website and README, November 2026. Spotted a mistake?{" "}
            <a href={SITE.issues}>Tell us</a>.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" id="faq">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Questions</p>
            <h2 className="h2">
              Frequently <span className="accent">asked.</span>
            </h2>
          </div>
          <div className="faq">
            {HOME_FAQ.map((f, i) => (
              <details key={f.q} open={i === 0}>
                <summary>
                  <h3 className="faq-q">{f.q}</h3>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="section clay">
        <div className="wrap">
          <div className="center">
            <p className="eyebrow">Guides</p>
            <h2 className="h2">
              Fix your <span className="accent">display</span> problems.
            </h2>
          </div>
          <div className="guides">
            {GUIDES.map((g) => (
              <Link className="guide-card" href={`/${g.slug}/`} key={g.slug}>
                <p className="eyebrow">{g.eyebrow}</p>
                <h3 className="h3">{g.title}</h3>
                <p>{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section">
        <div className="wrap">
          <div className="cta-band center">
            <p className="eyebrow">Free for Mac</p>
            <h2 className="h2">
              Your monitors deserve <span className="accent">better</span> than a replug.
            </h2>
            <p className="lede">
              Install it once. Brightness from the menu bar, and monitors that are simply there
              when you sit down.
            </p>
            <div className="btn-row">
              <a className="btn btn-dark" href={SITE.download} rel="noopener">
                <Apple />
                Download DisplayLatch
              </a>
              <a className="btn btn-light" href={SITE.repo} rel="noopener">
                <GitHub />
                Star on GitHub
              </a>
            </div>
            <div className="fineprint">
              <span>macOS 14 Sonoma or later</span>
              <span>M1, M2, M3, M4 and newer</span>
              <span>Not notarized yet: allow it once in Privacy & Security</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
