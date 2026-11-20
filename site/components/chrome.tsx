import Link from "next/link";
import { BADGE_HEIGHT, DIRECTORY_BADGES, DIRECTORY_TEXT_LINKS } from "../lib/directory-badges";
import { GUIDES, SITE } from "../lib/site";
import { Apple, GitHub } from "./icons";

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link className="brand" href="/" aria-label="DisplayLatch home">
          <img src="/images/icon-256.png" alt="" width={30} height={30} />
          DisplayLatch
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#brightness">Brightness</Link>
          <Link href="/#reconnect">Auto-reconnect</Link>
          <Link href="/#features">Features</Link>
          <Link href="/#compare">Compare</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <div className="header-cta">
          <a className="gh-link" href={SITE.repo} rel="noopener">
            <GitHub />
            <span>GitHub</span>
          </a>
          <a className="btn btn-dark btn-sm" href={SITE.download} rel="noopener">
            <Apple />
            Download
          </a>
        </div>
      </div>
    </header>
  );
}

// A directory's badge image sometimes fails (hotlink block, or no image until the
// listing is approved). Swap it for a text pill with the badge's label instead of
// showing a broken image. The script runs right after the markup, before any lazy
// image has started loading, so an `error` listener catches every failure.
const BROKEN_BADGE_SCRIPT = `(function(){function b(i){var p=i.parentElement;if(p&&p.hasAttribute("data-badge-label"))p.classList.add("badge-broken")}document.querySelectorAll(".badge-marquee img").forEach(function(i){i.addEventListener("error",function(){b(i)},{once:true})})})();`;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link className="brand" href="/">
              <img src="/images/icon-256.png" alt="" width={30} height={30} />
              DisplayLatch
            </Link>
            <p>
              Free, open-source Mac menu-bar app for external monitor brightness and for keeping
              monitors connected after sleep.
            </p>
          </div>
          <div>
            <h2>Guides</h2>
            <ul>
              {GUIDES.map((g) => (
                <li key={g.slug}>
                  <Link href={`/${g.slug}/`}>{g.nav}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Project</h2>
            <ul>
              <li>
                <a href={SITE.releases}>Download</a>
              </li>
              <li>
                <a href={SITE.repo}>Source code</a>
              </li>
              <li>
                <a href={`${SITE.repo}/blob/main/CHANGELOG.md`}>Changelog</a>
              </li>
              <li>
                <a href={SITE.issues}>Report an issue</a>
              </li>
            </ul>
          </div>
          <div>
            <h2>Author</h2>
            <ul>
              <li>
                <a href={SITE.author.url}>Hitesh Sisara</a>
              </li>
              <li>
                <a href="https://github.com/Hitesh-Sisara">GitHub profile</a>
              </li>
              <li>
                <a href={`${SITE.repo}/blob/main/LICENSE`}>MIT License</a>
              </li>
            </ul>
          </div>
        </div>
        {(DIRECTORY_BADGES.length > 0 || DIRECTORY_TEXT_LINKS.length > 0) && (
          <div className="featured-on">
            <h2>Featured on</h2>
            {/* Every badge stays in the server-rendered HTML, because directories check
                for their link. The second group only repeats the images so the strip
                loops, so it carries no links and is hidden from screen readers. */}
            <div className="badge-marquee">
              <div
                className="badge-track"
                style={{ animationDuration: `${(DIRECTORY_BADGES.length + DIRECTORY_TEXT_LINKS.length) * 4}s` }}
              >
                <div className="badge-group">
                  {DIRECTORY_BADGES.map((b) => (
                    <a
                      key={b.href}
                      href={b.href}
                      target="_blank"
                      rel={b.rel ?? "noopener"}
                      data-badge-label={b.alt}
                      {...(b.data ?? {})}
                    >
                      <img src={b.img} alt={b.alt} width={b.width} height={BADGE_HEIGHT} loading="lazy" decoding="async" />
                    </a>
                  ))}
                  {DIRECTORY_TEXT_LINKS.map((t) => (
                    <a key={t.href} className="badge-text" href={t.href} target="_blank" rel={t.rel}>
                      {t.name}
                    </a>
                  ))}
                </div>
                <div className="badge-group" aria-hidden="true">
                  {DIRECTORY_BADGES.map((b) => (
                    <span key={b.href} data-badge-label={b.alt}>
                      <img src={b.img} alt="" width={b.width} height={BADGE_HEIGHT} loading="lazy" decoding="async" />
                    </span>
                  ))}
                  {DIRECTORY_TEXT_LINKS.map((t) => (
                    <span key={t.href} className="badge-text">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <script dangerouslySetInnerHTML={{ __html: BROKEN_BADGE_SCRIPT }} />
          </div>
        )}
        <div className="foot-bottom">
          <span>
            © 2026 <a href={SITE.author.url}>Hitesh Sisara</a>. DisplayLatch is free software under
            the MIT License.
          </span>
          <span>
            Not affiliated with Apple, BetterDisplay, MonitorControl or Lunar. Mac and macOS are
            trademarks of Apple Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
