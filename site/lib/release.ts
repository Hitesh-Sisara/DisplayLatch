import { SITE } from "./site";

let cached: Promise<string> | undefined;

/**
 * The newest release tag, read once at build time so the site never announces an old version.
 * Falls back to SITE.version when GitHub can't be reached (offline builds, rate limits).
 */
export function latestVersion(): Promise<string> {
  cached ??= (async () => {
    try {
      const res = await fetch("https://api.github.com/repos/Hitesh-Sisara/DisplayLatch/releases/latest", {
        headers: { accept: "application/vnd.github+json", "user-agent": "displaylatch-site-build" },
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return SITE.version;
      const tag = String(((await res.json()) as { tag_name?: string }).tag_name ?? "");
      return /^v?\d+\.\d+\.\d+$/.test(tag) ? tag.replace(/^v/, "") : SITE.version;
    } catch {
      return SITE.version;
    }
  })();
  return cached;
}
