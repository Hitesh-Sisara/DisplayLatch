export const SITE = {
  name: "DisplayLatch",
  url: "https://displaylatch.sisara.in",
  repo: "https://github.com/Hitesh-Sisara/DisplayLatch",
  releases: "https://github.com/Hitesh-Sisara/DisplayLatch/releases/latest",
  // GitHub serves the newest DMG at this stable URL once a release has an asset with this name.
  download: "https://github.com/Hitesh-Sisara/DisplayLatch/releases/latest",
  issues: "https://github.com/Hitesh-Sisara/DisplayLatch/issues",
  version: "1.0.0",
  author: { name: "Hitesh Sisara", url: "https://sisara.in" },
  updated: "2026-11-19",
} as const;

export type Guide = {
  slug: string;
  nav: string;
  title: string;
  description: string;
  eyebrow: string;
  keywords: string[];
};

export const GUIDES: Guide[] = [
  {
    slug: "control-external-monitor-brightness-mac",
    nav: "Monitor brightness",
    eyebrow: "Brightness guide",
    title: "Control External Monitor Brightness on Mac (Free DDC App)",
    description:
      "Change the real backlight brightness of external monitors on a Mac with DDC/CI. One slider for every display, per-monitor control and a CLI. Free and open source for Apple silicon.",
    keywords: [
      "control external monitor brightness mac",
      "external monitor brightness mac",
      "change brightness external monitor macbook",
      "ddc brightness mac apple silicon",
      "dim all monitors at once mac",
    ],
  },
  {
    slug: "fix-external-monitor-not-detected-after-sleep-mac",
    nav: "Black after sleep",
    eyebrow: "Troubleshooting guide",
    title: "External Monitor Black or Not Detected After Sleep on Mac: Fix",
    description:
      "Why a Mac's external monitor stays black or undetected after sleep or restart, how to tell a cable problem from macOS, and how to fix it for good.",
    keywords: [
      "external monitor not detected after sleep mac",
      "second monitor black after sleep macbook",
      "mac not detecting external monitor",
      "windowserver independent output",
    ],
  },
  {
    slug: "disconnect-display-mac-without-unplugging",
    nav: "Disconnect a display",
    eyebrow: "How-to guide",
    title: "Disconnect a Display on Mac Without Unplugging (Free)",
    description:
      "Turn off an external monitor on macOS without touching the cable. Windows move to your other screens, and it comes back in the same spot. Free app and CLI.",
    keywords: [
      "disconnect display mac without unplugging",
      "turn off external monitor mac",
      "disable second monitor mac",
    ],
  },
  {
    slug: "free-betterdisplay-alternative",
    nav: "BetterDisplay alternative",
    eyebrow: "Comparison",
    title: "Free, Open-Source BetterDisplay Alternative for Mac",
    description:
      "DisplayLatch is a free, open-source Mac app for external monitor brightness, keeping monitors connected, disconnecting displays and switching resolution, with a CLI.",
    keywords: [
      "betterdisplay alternative",
      "free betterdisplay alternative",
      "monitorcontrol alternative",
      "open source display app mac",
    ],
  },
];

export const guide = (slug: string) => GUIDES.find((g) => g.slug === slug)!;

export type QA = { q: string; a: string };

export const HOME_FAQ: QA[] = [
  {
    q: "How do I control external monitor brightness on a Mac?",
    a: "macOS only changes brightness on Apple displays. For other monitors, use a DDC/CI app such as DisplayLatch. It sends the monitor's own brightness command over the video cable, so the backlight really changes. Drag a monitor's slider in the menu bar, use one slider for all displays, or run displaylatch brightness all 40 in Terminal.",
  },
  {
    q: "Can I change the brightness of all my monitors at once?",
    a: "Yes. DisplayLatch shows an All displays slider whenever more than one screen is connected. It moves the MacBook's built-in screen and every DDC monitor together, and you can still fine-tune each one.",
  },
  {
    q: "Why does my external monitor stay black after sleep on Mac?",
    a: "Often the Mac still detects the monitor, but macOS WindowServer has taken it off the desktop, for example by storing it as an independent output. The monitor gets power but no picture, and the state comes back after every restart. DisplayLatch detects this and puts the monitor back automatically, in the same position.",
  },
  {
    q: "Does DisplayLatch dim the screen with an overlay?",
    a: "No. It changes the monitor's real backlight over DDC/CI, the same setting the buttons on the monitor change. That saves power and keeps blacks and colours accurate, unlike a dark overlay.",
  },
  {
    q: "Which Macs and monitors are supported?",
    a: "Any Mac with Apple silicon (M1, M2, M3, M4 or later) running macOS 14 Sonoma or newer. Brightness works with monitors that support DDC/CI, which is most desktop monitors. The built-in HDMI port on M1 Macs and the base M2 Mac mini does not pass DDC, so use a USB-C or Thunderbolt connection there.",
  },
  {
    q: "Is DisplayLatch really free?",
    a: "Yes. It is free and open source under the MIT license. There is no Pro tier, no account and no telemetry. The only network request is an optional daily check for a new GitHub release.",
  },
  {
    q: "Is it safe to use?",
    a: "DisplayLatch only asks macOS to change how displays are arranged and how bright they are. It doesn't touch firmware or system files. It uses a few private macOS display functions, looked up at runtime, so if an update removes one, only that feature stops working.",
  },
];

export const OG_IMAGE = [{ url: "/og.png", width: 1200, height: 630, alt: "DisplayLatch: external monitor brightness and auto-reconnect for Mac" }];
