#!/usr/bin/env python3
"""Generates the GitHub Pages site in docs/ (landing page + search-intent guides,
sitemap, robots). Run: python3 scripts/build-site.py"""
import datetime
import html
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
BASE = "https://hitesh-sisara.github.io/DisplayLatch/"
REPO = "https://github.com/Hitesh-Sisara/DisplayLatch"
DOWNLOAD = REPO + "/releases/latest"
TODAY = datetime.date.today().isoformat()

APP_LD = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DisplayLatch",
    "operatingSystem": "macOS 14 or later (Apple silicon)",
    "applicationCategory": "UtilitiesApplication",
    "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"},
    "license": "https://opensource.org/licenses/MIT",
    "downloadUrl": DOWNLOAD,
    "url": BASE,
    "codeRepository": REPO,
    "image": BASE + "images/social-preview.png",
    "description": "Free, open-source macOS menu-bar app that keeps external monitors connected, fixes monitors that stay black after sleep, controls DDC brightness and disconnects displays without unplugging.",
}

NAV = [
    ("fix-external-monitor-not-detected-after-sleep-mac.html", "Monitor black after sleep"),
    ("disconnect-display-mac-without-unplugging.html", "Disconnect a display"),
    ("control-external-monitor-brightness-mac.html", "External monitor brightness"),
    ("free-betterdisplay-alternative.html", "BetterDisplay alternative"),
]


def page(slug, title, description, body, faq=None, extra_ld=None):
    url = BASE + ("" if slug == "index.html" else slug)
    lds = [APP_LD] + ([extra_ld] if extra_ld else [])
    if faq:
        lds.append({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [{"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq],
        })
        body += "<section><h2>Frequently asked questions</h2>" + "".join(
            f"<h3>{html.escape(q)}</h3><p>{html.escape(a)}</p>" for q, a in faq) + "</section>"
    nav = "".join(f'<a href="{s}">{html.escape(t)}</a>' for s, t in NAV)
    ld = "\n".join(f'<script type="application/ld+json">{json.dumps(x)}</script>' for x in lds)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(description)}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(description)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}images/social-preview.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="images/icon-256.png">
<link rel="stylesheet" href="style.css">
{ld}
</head>
<body>
<header class="top"><a class="brand" href="./"><img src="images/icon-256.png" alt="" width="28" height="28">DisplayLatch</a>
<nav>{nav}<a class="gh" href="{REPO}">GitHub</a></nav></header>
<main>
{body}
<section class="cta"><h2>Get DisplayLatch, free</h2>
<p>Native macOS menu-bar app, about 1.5 MB, open source (MIT). Apple silicon, macOS 14+.</p>
<p><a class="button" href="{DOWNLOAD}">Download the latest release</a> <a class="button ghost" href="{REPO}">View source on GitHub</a></p></section>
</main>
<footer><p>DisplayLatch is free and open source under the MIT license. BetterDisplay is a trademark of its owner; DisplayLatch is an independent project, not affiliated with or endorsed by BetterDisplay, MonitorControl or Apple.</p></footer>
</body>
</html>
"""


PAGES = {}

PAGES["index.html"] = page(
    "index.html",
    "DisplayLatch: Keep Mac External Monitors Connected (Free)",
    "Free, open-source Mac menu-bar app: fixes external monitors stuck black after sleep, controls DDC brightness and disconnects displays without unplugging.",
    f"""<section class="hero">
<img src="images/icon-256.png" width="112" height="112" alt="DisplayLatch app icon">
<h1>Keep external monitors connected on your Mac</h1>
<p class="lead">DisplayLatch is a free, open-source menu-bar app. If an external monitor stays <b>black or undetected after sleep</b>, it brings it back on its own. It also controls monitor brightness over DDC and lets you <b>disconnect a display without unplugging it</b>.</p>
<p><a class="button" href="{DOWNLOAD}">Download for macOS</a> <a class="button ghost" href="{REPO}">GitHub</a></p>
<img class="shot" src="images/popover-dark.png" width="386" height="612" alt="DisplayLatch menu bar popover with brightness sliders for each external monitor, an all-displays slider, resolution controls and connect switches">
</section>
<section class="grid">
<div><h3>Monitors that stay connected</h3><p>After sleep, wake, a restart or a replug, macOS sometimes leaves a monitor dark even though it still detects it. DisplayLatch puts it back on the desktop in the same position. <a href="fix-external-monitor-not-detected-after-sleep-mac.html">How it works</a>.</p></div>
<div><h3>Disconnect without unplugging</h3><p>One switch takes a display off the desktop and the same switch brings it back, for free. <a href="disconnect-display-mac-without-unplugging.html">Guide</a>.</p></div>
<div><h3>Real brightness control</h3><p>It changes the monitor's own backlight over DDC/CI, per monitor or with one slider for all of them. <a href="control-external-monitor-brightness-mac.html">Guide</a>.</p></div>
<div><h3>Resolution and CLI</h3><p>A resolution slider for each display, plus a <code>displaylatch</code> command for scripts: <code>list</code>, <code>fix</code>, <code>brightness all 40</code>.</p></div>
<div><h3>Tiny and private</h3><p>Native Swift, no Electron, no account, no telemetry. The only network request is an optional update check.</p></div>
<div><h3>Free and open source</h3><p>MIT licensed. Read the code, build it yourself, or <a href="free-betterdisplay-alternative.html">compare it with BetterDisplay</a>.</p></div>
</section>""",
    faq=[
        ("Is DisplayLatch free?", "Yes. DisplayLatch is free and open source under the MIT license. It has no paid tier and no account."),
        ("Which Macs does DisplayLatch support?", "Macs with Apple silicon (M1, M2, M3, M4 and later) running macOS 14 Sonoma or later."),
        ("Does DisplayLatch collect data?", "No. Its only network request is an optional daily check of the latest GitHub release, used to show an update notice."),
    ],
)

PAGES["fix-external-monitor-not-detected-after-sleep-mac.html"] = page(
    "fix-external-monitor-not-detected-after-sleep-mac.html",
    "Mac External Monitor Black or Not Detected After Sleep: Fix",
    "Why a Mac's external monitor stays black or undetected after sleep or restart, how to tell a cable problem from macOS, and how to fix it for good.",
    """<article>
<h1>External monitor black or not detected after sleep on Mac</h1>
<p class="lead">You wake your Mac and one external monitor stays black, or it's missing from the desktop. Unplugging it may not help, and the problem can come back after every restart. This guide shows how to find out whether the cause is physical or macOS, and how to fix each case.</p>
<h2>Step 1: is it the cable or macOS?</h2>
<p>Open <b>System Information</b> (hold Option and choose Apple menu › System Information), then select <b>Graphics/Displays</b>.</p>
<ul>
<li><b>The monitor is not listed.</b> The Mac doesn't see it at all, so the cause is physical. Reseat the cable at both ends, try another cable or port, check the monitor's input source and power, and remove any dock or adapter to test.</li>
<li><b>The monitor is listed but stays black</b>, or <code>displaylatch list</code> shows it as <code>OFFLINE</code>. The Mac detects the monitor, but macOS is keeping it off the desktop. Read on.</li>
</ul>
<h2>Step 2: why macOS keeps a detected monitor off the desktop</h2>
<p>WindowServer, the part of macOS that manages screens, decides which detected monitors join the desktop. It can store a monitor as an <b>independent output</b> or leave it <b>disabled</b>. The monitor then gets power and macOS reads its details, but it never gets a picture. WindowServer saves this, so the monitor can stay dark after every reboot. Display utilities that "disconnect" monitors, and the macOS option to stop extending to a display, can leave a monitor in this state.</p>
<h2>Step 3: fix it</h2>
<h3>Quick things to try</h3>
<ol>
<li>Put the displays to sleep and wake them (Control-Shift-Power, or close and open the lid), then wait 10 seconds.</li>
<li>Unplug <i>all</i> external monitors, wait 10 seconds, and connect them again one at a time.</li>
<li>Open System Settings › Displays and check that the monitor isn't mirrored and is set to <b>Extended display</b>.</li>
</ol>
<p>If the monitor comes back but disappears again after the next sleep or restart, the stored state is the cause.</p>
<h3>Fix it automatically with DisplayLatch</h3>
<p>DisplayLatch is a free menu-bar app that checks for this after every display change, after wake and every 20 seconds. If it finds a monitor that is attached but off the desktop, it clears the independent-output flag, enables the display again and restores its position. To run the fix once from Terminal:</p>
<pre><code>displaylatch fix</code></pre>
<p>Any monitor you switched off on purpose in DisplayLatch stays off. It never wakes the built-in screen while the lid is closed.</p>
<h2>Further reading</h2>
<ul><li><a href="https://blog.cheverjohn.me/macos-26-stop-extending-blanked-my-monitor-fixing-windowserver-independentoutput">A detailed write-up of the WindowServer IndependentOutput problem</a></li>
<li><a href="https://apple.stackexchange.com/questions/339671">Apple Stack Exchange: External display not recognized after waking from sleep</a></li></ul>
</article>""",
    faq=[
        ("Why does my Mac not detect my external monitor after sleep?", "If System Information doesn't list the monitor, the cause is physical: the cable, adapter, input or power. If it is listed but stays black, macOS WindowServer has kept it off the desktop, for example as an independent output, and DisplayLatch can bring it back automatically."),
        ("Why does my second monitor stay black but show as connected on my Mac?", "macOS can keep a detected monitor off the desktop. The monitor gets power and is identified, but it receives no picture. The state is saved, so it can come back after every restart. Running 'displaylatch fix', or keeping DisplayLatch running, puts the monitor back on the desktop."),
        ("Do I need to delete windowserver plist files to fix a missing monitor?", "Usually not. WindowServer often writes the same stored state back. DisplayLatch fixes it through the macOS display configuration instead, without deleting files or restarting."),
    ],
)

PAGES["disconnect-display-mac-without-unplugging.html"] = page(
    "disconnect-display-mac-without-unplugging.html",
    "Disconnect a Display on Mac Without Unplugging (Free)",
    "Turn off an external monitor on macOS without unplugging the cable. Windows move to other screens; bring it back in the same spot. Free app.",
    """<article>
<h1>Disconnect a display on Mac without unplugging it</h1>
<p class="lead">Sometimes you want one monitor off: for a call, for focus, to save power, or so your windows don't land on a screen you aren't using. macOS has no built-in switch for this. Here's how to do it for free.</p>
<h2>With DisplayLatch (menu bar)</h2>
<ol>
<li>Install <a href="./">DisplayLatch</a> (free and open source).</li>
<li>Click the display icon in the menu bar.</li>
<li>Turn off the switch next to the monitor. It leaves the desktop, and its windows move to your other displays.</li>
<li>Turn the switch back on to restore it in the same place in your arrangement.</li>
</ol>
<h2>From Terminal</h2>
<pre><code>displaylatch list
displaylatch disconnect ABC1234567     # by serial, ID or name
displaylatch connect ABC1234567</code></pre>
<h2>What "disconnect" means here</h2>
<p>The monitor stays physically connected and powered, but macOS stops using it as a screen. That's different from dimming it to black: the space disappears from your arrangement, so the mouse and new windows can't go there. DisplayLatch remembers monitors you disconnected, so its auto-reconnect leaves them off until you turn them back on.</p>
<h2>Alternatives</h2>
<p>BetterDisplay also has this feature, in its paid Pro version. <code>displayplacer</code> can turn displays off from the command line. Turning off the monitor with its own power button usually works too, but some monitors keep the Mac thinking they're connected.</p>
</article>""",
    faq=[
        ("Can I turn off an external monitor on Mac without unplugging it?", "Yes. DisplayLatch adds a switch for each monitor in the menu bar, and the command 'displaylatch disconnect'. Either one takes the display off the desktop without touching the cable."),
        ("Will my windows come back when I reconnect the display?", "macOS moves windows to the remaining screens when a display is disconnected. When you reconnect it, DisplayLatch restores the display's position in your arrangement. macOS then decides where windows go."),
    ],
)

PAGES["control-external-monitor-brightness-mac.html"] = page(
    "control-external-monitor-brightness-mac.html",
    "Control external monitor brightness on Mac (DDC, free app)",
    "Change external monitor brightness on Mac over DDC/CI from the menu bar or Terminal. One slider for all displays. Free, open source, Apple silicon.",
    """<article>
<h1>Control external monitor brightness on a Mac</h1>
<p class="lead">macOS changes brightness only on Apple displays. For most other monitors you have to use the buttons on the monitor. DisplayLatch lets you change it from the menu bar instead, and it changes the monitor's real backlight.</p>
<h2>How it works: DDC/CI</h2>
<p>Most monitors support <b>DDC/CI</b>, a standard way for a computer to change the monitor's settings over the same cable that carries the picture. DisplayLatch sends the standard brightness command (VCP code 0x10), so the monitor really gets dimmer. That's different from a software overlay, which only darkens the image.</p>
<h2>Steps</h2>
<ol>
<li>Install <a href="./">DisplayLatch</a> and click its menu-bar icon.</li>
<li>Drag a monitor's <b>Brightness</b> slider, or use <b>All displays</b> to change every monitor at once.</li>
<li>From Terminal: <code>displaylatch brightness all 40</code> or <code>displaylatch brightness &lt;serial&gt; 70</code>.</li>
</ol>
<h2>Brightness doesn't change?</h2>
<ul>
<li>Turn on <b>DDC/CI</b> in the monitor's own on-screen menu. Some monitors turn it off by default.</li>
<li>Some docks, KVM switches and adapters don't pass DDC through. Test with a direct cable.</li>
<li>TVs and some portable monitors don't support DDC at all.</li>
</ul>
</article>""",
    faq=[
        ("How do I adjust the brightness of a second monitor on Mac?", "Use a DDC app such as DisplayLatch. It controls the monitor's hardware brightness from the menu bar, with a slider per monitor or one slider for all displays."),
        ("Does DisplayLatch dim the screen with an overlay?", "No. It uses DDC/CI to change the monitor's own backlight, the same setting the monitor's buttons change."),
    ],
)

PAGES["free-betterdisplay-alternative.html"] = page(
    "free-betterdisplay-alternative.html",
    "Free Open-Source BetterDisplay Alternative for Mac",
    "DisplayLatch is a free, open-source macOS app to keep monitors connected, disconnect displays and control DDC brightness and resolution, with a CLI.",
    """<article>
<h1>A free, open-source BetterDisplay alternative</h1>
<p class="lead">BetterDisplay is an excellent, very complete display tool. Some features, like disconnecting a display, are in its paid Pro version. If you only need the everyday controls, DisplayLatch does them for free and in the open.</p>
<h2>What DisplayLatch covers</h2>
<table>
<tr><th></th><th>DisplayLatch</th><th>BetterDisplay</th></tr>
<tr><td>Price</td><td>Free</td><td>Free, plus a paid Pro</td></tr>
<tr><td>Source code</td><td>Open (MIT)</td><td>Closed</td></tr>
<tr><td>Auto-reconnect monitors left dark after sleep</td><td>Yes</td><td>Not advertised</td></tr>
<tr><td>Disconnect a display without unplugging</td><td>Yes</td><td>Pro</td></tr>
<tr><td>External monitor brightness (DDC)</td><td>Yes</td><td>Yes</td></tr>
<tr><td>Command-line tool</td><td>Yes</td><td>Yes</td></tr>
<tr><td>HiDPI scaling, virtual screens, PIP, XDR</td><td>No</td><td>Yes</td></tr>
</table>
<p>This comparison is based on each product's own website as of November 2026.</p>
<h2>When to choose which</h2>
<p><b>Choose DisplayLatch</b> if you want a small, free, auditable app that keeps your monitors connected and handles brightness, resolution and disconnecting. <b>Choose BetterDisplay</b> if you need HiDPI on non-Retina monitors, virtual screens, picture-in-picture or XDR. Other free tools worth knowing: <a href="https://github.com/MonitorControl/MonitorControl">MonitorControl</a> (brightness and volume keys) and <code>displayplacer</code> (arrangement from the CLI).</p>
<h2>Switching from BetterDisplay</h2>
<p>If BetterDisplay disconnected a monitor and you can't turn it back on without Pro, DisplayLatch can bring it back. Install it and the monitor reconnects automatically, or run <code>displaylatch fix</code>. Quit BetterDisplay first, so the two apps don't both change the same displays.</p>
</article>""",
    faq=[
        ("Is there a free alternative to BetterDisplay?", "Yes. DisplayLatch is a free, open-source macOS app (MIT). It handles keeping monitors connected, disconnecting displays, DDC brightness, resolution and a CLI. MonitorControl is another free option for brightness."),
        ("Can DisplayLatch reconnect a monitor that BetterDisplay disconnected?", "Yes. If BetterDisplay disconnected a monitor and your Pro trial ended, DisplayLatch detects that the monitor is attached but off the desktop and reconnects it."),
    ],
)

STYLE = """
:root{--bg:#0d1020;--card:#161a33;--text:#e9ebf5;--muted:#a9aecb;--accent:#6b5cff;--accent2:#ff9a3c}
*{box-sizing:border-box}body{margin:0;font:17px/1.6 -apple-system,BlinkMacSystemFont,"SF Pro Text",Inter,system-ui,sans-serif;background:var(--bg);color:var(--text)}
a{color:#a99fff}a:hover{color:#fff}
.top{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:14px 24px;border-bottom:1px solid #22274a;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;color:var(--text);text-decoration:none;font-size:18px}
nav{display:flex;gap:16px;flex-wrap:wrap;font-size:14px}nav a{color:var(--muted);text-decoration:none}nav a:hover{color:#fff}.gh{font-weight:600;color:var(--text)!important}
main{max-width:920px;margin:0 auto;padding:24px}
.hero{text-align:center;padding:40px 0 10px}.hero h1{font-size:44px;line-height:1.15;margin:16px 0}
.lead{font-size:20px;color:var(--muted)}
.button{display:inline-block;background:linear-gradient(135deg,var(--accent),#8f6bff);color:#fff;padding:12px 22px;border-radius:12px;font-weight:600;text-decoration:none;margin:6px}
.button.ghost{background:transparent;border:1px solid #3a4080}
.shot{margin:32px auto 0;display:block;max-width:100%;height:auto;border-radius:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:40px 0}
.grid div,.cta,article{background:var(--card);border-radius:16px;padding:20px 24px}
article h1{font-size:36px;line-height:1.2}h2{margin-top:32px}
pre{background:#0a0c18;padding:14px 16px;border-radius:10px;overflow:auto}code{font:14px ui-monospace,SFMono-Regular,Menlo,monospace}
table{border-collapse:collapse;width:100%;margin:12px 0}td,th{border-bottom:1px solid #2a3060;padding:10px;text-align:left}
section{margin:28px 0}.cta{text-align:center;margin-top:40px}
footer{max-width:920px;margin:40px auto;padding:0 24px;color:var(--muted);font-size:13px}
@media(max-width:600px){.hero h1{font-size:32px}article h1{font-size:28px}}
"""


def main():
    DOCS.mkdir(exist_ok=True)
    for slug, content in PAGES.items():
        (DOCS / slug).write_text(content)
    (DOCS / "style.css").write_text(STYLE.strip() + "\n")
    urls = "".join(f"<url><loc>{BASE}{'' if s == 'index.html' else s}</loc><lastmod>{TODAY}</lastmod></url>" for s in PAGES)
    (DOCS / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{urls}</urlset>\n')
    (DOCS / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
    (DOCS / ".nojekyll").write_text("")
    print("wrote", ", ".join(PAGES))


if __name__ == "__main__":
    main()
