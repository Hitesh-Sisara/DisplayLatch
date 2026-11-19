import type { Metadata, Viewport } from "next";
import { Footer, Header, JsonLd } from "../components/chrome";
import { SITE } from "../lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "DisplayLatch: Free External Monitor Brightness Control & Auto-Reconnect for Mac",
    template: "%s | DisplayLatch",
  },
  description:
    "Control external monitor brightness on your Mac with real DDC backlight control, one slider for every display, and automatic reconnect for monitors that stay black after sleep. Free and open source.",
  applicationName: "DisplayLatch",
  authors: [{ name: SITE.author.name, url: SITE.author.url }],
  creator: SITE.author.name,
  keywords: [
    "external monitor brightness mac",
    "control external monitor brightness mac",
    "DDC brightness mac",
    "monitor not detected after sleep mac",
    "BetterDisplay alternative",
    "MonitorControl alternative",
    "disconnect display mac",
  ],
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: "/images/icon-256.png",
  },
  openGraph: {
    type: "website",
    siteName: "DisplayLatch",
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "DisplayLatch for Mac" }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#fff8f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" href="/fonts/Outfit-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DisplayLatch",
            url: SITE.url,
            publisher: { "@type": "Person", name: SITE.author.name, url: SITE.author.url },
          }}
        />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
