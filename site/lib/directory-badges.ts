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
  { href: "https://swipetolaunch.com/p/displaylatch?ref=badge", img: "https://swipetolaunch.com/api/badge/displaylatch?theme=light", alt: "Featured on SwipeToLaunch", width: 147 },
  { href: "https://twelve.tools", img: "https://twelve.tools/badge0-light.svg", alt: "Featured on Twelve Tools", width: 119 },
  { href: "https://www.uneed.best/tool/displaylatch", img: "https://www.uneed.best/EMBED3B.png", alt: "Launching Soon on Uneed", width: 123 },
  { href: "https://findly.tools/displaylatch?utm_source=displaylatch", img: "https://findly.tools/badges/findly-tools-badge-light.svg", alt: "Featured on Findly.tools", width: 101 },
  { href: "https://nicklaunches.com/", img: "https://nicklaunches.com/badges/featured.png", alt: "Featured on Nick Launches", width: 137 },
  { href: "https://startupfa.me/s/displaylatch?utm_source=displaylatch.sisara.in", img: "https://startupfa.me/badge?t=classic&theme=light", alt: "DisplayLatch - Featured on Startup Fame", width: 120 },
  { href: "https://turbo0.com/item/displaylatch", img: "https://img.turbo0.com/badge-listed-light.svg", alt: "Listed on Turbo0", width: 96 },
  { href: "https://smollaunch.com", img: "https://smollaunch.com/badges/featured.svg", alt: "DisplayLatch — Featured on Smol Launch", width: 134 },
  { href: "https://neeed.directory/products/displaylatch?utm_source=displaylatch", img: "https://neeed.directory/badges/neeed-badge-light.svg", alt: "Featured on neeed.directory", width: 101 },
  { href: "https://www.tinyshelf.co/?ref=displaylatch.sisara.in", img: "https://www.tinyshelf.co/badge/tinyshelf-badge-light-5ca4026a.svg", alt: "Featured on TinyShelf", width: 108 },
];

// Directories that accept only a plain text link, not an image badge.
export type DirectoryTextLink = { href: string; name: string; rel: string };

export const DIRECTORY_TEXT_LINKS: readonly DirectoryTextLink[] = [
];
