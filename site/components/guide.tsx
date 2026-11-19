import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { GUIDES, OG_IMAGE, SITE, guide, type QA } from "../lib/site";
import { JsonLd } from "./chrome";
import { Apple, GitHub } from "./icons";

export function guideMetadata(slug: string): Metadata {
  const g = guide(slug);
  return {
    title: { absolute: g.title },
    description: g.description,
    keywords: g.keywords,
    alternates: { canonical: `/${slug}/` },
    openGraph: { type: "article", siteName: "DisplayLatch", url: `/${slug}/`, title: g.title, description: g.description, images: OG_IMAGE },
    twitter: { card: "summary_large_image", title: g.title, description: g.description, images: ["/og.png"] },
  };
}

export function GuidePage({
  slug,
  h1,
  lede,
  faq,
  howTo,
  children,
}: {
  slug: string;
  h1: ReactNode;
  lede: string;
  faq: QA[];
  howTo?: { name: string; steps: string[] };
  children: ReactNode;
}) {
  const g = guide(slug);
  const url = `${SITE.url}/${slug}/`;
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "TechArticle",
              headline: g.title,
              description: g.description,
              url,
              datePublished: "2026-11-18",
              dateModified: SITE.updated,
              author: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
              publisher: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
              image: `${SITE.url}/og.png`,
              mainEntityOfPage: url,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "DisplayLatch", item: `${SITE.url}/` },
                { "@type": "ListItem", position: 2, name: g.nav, item: url },
              ],
            },
            {
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
            ...(howTo
              ? [
                  {
                    "@type": "HowTo",
                    name: howTo.name,
                    step: howTo.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
                  },
                ]
              : []),
          ],
        }}
      />
      <section className="article-hero">
        <div className="wrap">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link href="/">DisplayLatch</Link> / <span>{g.nav}</span>
          </nav>
          <p className="eyebrow">{g.eyebrow}</p>
          <h1>{h1}</h1>
          <p className="lede">{lede}</p>
        </div>
      </section>
      <div className="wrap article-grid">
        <article className="prose">
          {children}
          <h2>Frequently asked questions</h2>
          {faq.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p style={{ fontSize: 14, color: "var(--soft)", marginTop: 48 }}>
            Last updated {SITE.updated} by <a href={SITE.author.url}>{SITE.author.name}</a>.
          </p>
        </article>
        <aside className="side">
          <div className="side-card dark">
            <img src="/images/icon-256.png" alt="" width={48} height={48} />
            <p className="side-title">DisplayLatch for Mac</p>
            <p>Free external monitor brightness and auto-reconnect. Open source, 1.5 MB.</p>
            <a className="btn btn-light btn-sm" href={SITE.download} rel="noopener">
              <Apple />
              Download free
            </a>
          </div>
          <div className="side-card">
            <p className="side-title">More guides</p>
            <ul>
              {GUIDES.map((x) => (
                <li key={x.slug}>
                  <Link href={`/${x.slug}/`} aria-current={x.slug === slug ? "page" : undefined}>
                    {x.nav}
                  </Link>
                </li>
              ))}
              <li>
                <a href={SITE.repo}>
                  <GitHub className="" /> Source on GitHub
                </a>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}
