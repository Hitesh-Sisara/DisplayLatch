import Link from "next/link";
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
