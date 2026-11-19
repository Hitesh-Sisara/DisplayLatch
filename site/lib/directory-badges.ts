// "Featured on" badges for directories and launch sites that list DisplayLatch.
//
// Many directories list a product for free in exchange for one of these badges,
// and some re-check the live page (server-rendered HTML) before approving or
// keeping the listing. Removing an entry can get the listing removed, so prune
// only after checking it.
//
// Hotlinked on purpose: checkers look for their own image URL. `href` is the
// directory homepage, or DisplayLatch's listing page when a directory requires
// that exact URL. `width` is the display width at BADGE_HEIGHT. `data` holds
// data-* attributes a directory's checker looks for on the anchor. `rel` is set
// only when a snippet asks for a qualified link (nofollow, sponsored or ugc).
// The launch kit's sync_badges.py rewrites the DIRECTORY_BADGES array, one row per line.
export type DirectoryBadge = {
  href: string;
  img: string;
  alt: string;
  width: number;
  rel?: string;
  data?: Readonly<Record<`data-${string}`, string>>;
};

export const BADGE_HEIGHT = 32;

// One directory per line reads as a table.
// prettier-ignore
export const DIRECTORY_BADGES: readonly DirectoryBadge[] = [
  { href: "https://macnative.io/apps/displaylatch?utm_source=macnative-badge&utm_medium=referral", img: "https://macnative.io/badge?kind=listed&theme=light&slug=displaylatch", alt: "Listed on MacNative", width: 120 },
  { href: "https://macbase.app/apps/displaylatch?ref=badge", img: "https://macbase.app/badge/featured-on-macbase.svg", alt: "DisplayLatch is featured on MacBase", width: 100 },
];

// Directories that accept only a plain text link, not an image badge.
export type DirectoryTextLink = { href: string; name: string; rel: string };

export const DIRECTORY_TEXT_LINKS: readonly DirectoryTextLink[] = [
];
