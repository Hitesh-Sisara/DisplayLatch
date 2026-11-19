// Writes public/sitemap.xml from the same GUIDES list the pages use, so a new guide can't be left out.
// Runs before every build (npm "prebuild"). Node 22.6+ (type stripping).
import { writeFileSync } from "node:fs";
import { GUIDES, SITE } from "../lib/site.ts";

const pages: [string, string][] = [
  ["", "1.0"],
  ...GUIDES.map((g, i): [string, string] => [`${g.slug}/`, i === 0 ? "0.9" : "0.8"]),
];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  pages
    .map(([path, priority]) => `  <url><loc>${SITE.url}/${path}</loc><lastmod>${SITE.updated}</lastmod><priority>${priority}</priority></url>`)
    .join("\n") +
  `\n</urlset>\n`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), xml);
console.log(`sitemap.xml: ${pages.length} URLs`);
