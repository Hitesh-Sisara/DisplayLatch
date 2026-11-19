// Fast sanity check for lib/directory-badges.ts, run before each badge PR.
// No dependencies: parses the one-row-per-line arrays with regexes.
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../lib/directory-badges.ts", import.meta.url), "utf8");
const rows = [...src.matchAll(/\{ href: "([^"]*)", img: "([^"]*)", alt: "([^"]*)", width: (\d+)/g)];
const texts = [...src.matchAll(/\{ href: "([^"]*)", name: "([^"]*)"/g)];
const errors = [];
const hosts = new Set();
for (const [, href, img, alt, width] of rows) {
  if (!/^https:\/\//.test(href)) errors.push(`badge href not https: ${href}`);
  if (!/^(https:\/\/|\/badges\/)/.test(img)) errors.push(`badge img not https: ${img}`);
  if (!alt.trim()) errors.push(`badge without alt: ${href}`);
  if (!(Number(width) > 0)) errors.push(`badge without width: ${href}`);
}
for (const [, href] of [...rows, ...texts]) {
  const h = new URL(href).hostname.replace(/^www\./, "");
  if (hosts.has(h)) errors.push(`duplicate directory: ${h}`);
  hosts.add(h);
}
for (const m of src.matchAll(/data: \{([^}]*)\}/g)) {
  for (const k of m[1].matchAll(/"([^"]+)":/g)) if (!/^data-[a-z0-9-]+$/.test(k[1])) errors.push(`bad data attribute ${k[1]}`);
}
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`directory badges ok: ${rows.length} badges, ${texts.length} text links`);
