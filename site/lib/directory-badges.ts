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
  { href: "https://auraplusplus.com/projects/displaylatch", img: "https://auraplusplus.com/images/badges/featured-on-light.svg", alt: "Featured on Aura++", width: 109 },
  { href: "https://tinylaunch.com", img: "https://tinylaunch.com/tinylaunch_badge_launching_soon.svg", alt: "TinyLaunch Badge", width: 105 },
  { href: "https://deeplaunch.io", img: "https://deeplaunch.io/badge/badge_light.svg", alt: "Featured on DeepLaunch.io", width: 111 },
  { href: "https://www.scrolllaunch.com/products/displaylatch?ref=badge", img: "https://www.scrolllaunch.com/api/badge/displaylatch", alt: "Featured on ScrollLaunch", width: 147 },
  { href: "https://startupfa.st", img: "https://startupfa.st/images/badges/powered-by-light.svg", alt: "Powered by Startup Fast", width: 76 },
  { href: "https://foundrlist.com/product/displaylatch?utm_source=badge&utm_medium=embed", img: "https://foundrlist.com/api/badge/displaylatch", alt: "Featured on FoundrList", width: 100 },
  { href: "https://openhunts.com", img: "https://cdn.openhunts.com/badges/club.webp", alt: "OpenHunts Club Member", width: 120 },
  { href: "https://launchpadly.co/startup/displaylatch?ref=badge", img: "https://launchpadly.co/embed/badges/startup/displaylatch.svg?variant=light", alt: "Launchpadly Startup Directory", width: 147, data: { "data-launchpadly-badge": "displaylatch", "data-launchpadly-badge-variant": "light" } },
  { href: "https://newtool.site/item/displaylatch?utm_source=displaylatch.sisara.in", img: "https://newtool.site/badges/newtool-light.svg", alt: "Featured on NewTool.site", width: 124 },
  { href: "https://www.tinystartups.com/startup/displaylatch", img: "https://www.tinystartups.com/api/badge/launching-soon/displaylatch", alt: "Launched on Tiny Startups", width: 130 },
  { href: "https://toolindex.net/?ref=badge", img: "https://toolindex.net/badges/listed-on-toolindex.svg", alt: "Listed on Tool Index", width: 119, rel: "nofollow noopener" },
  { href: "https://firstlook.tools", img: "https://firstlook.tools/badge/badge_light.svg", alt: "Featured on First Look", width: 116 },
  { href: "https://www.nxgntools.com/tools/displaylatch?utm_source=displaylatch", img: "https://www.nxgntools.com/api/embed/displaylatch?type=FEATURED_ON", alt: "Featured on NxGn Tools", width: 108 },
  { href: "https://productwatch.io/products/displaylatch?utm_source=badge", img: "https://productwatch.io/backend/api/v1/badge/featured?productId=e2f1b664-0466-46a3-83f7-9e9594aa078e&darkMode=false", alt: "DisplayLatch", width: 154 },
  { href: "https://tooldirs.com", img: "https://tooldirs.com/badge/badge_light.svg", alt: "Featured on ToolDirs", width: 101 },
  { href: "https://ufind.best/products/displaylatch", img: "https://ufind.best/badges/ufind-best-badge-light.svg", alt: "Featured on ufind.best", width: 101 },
  { href: "https://uno.directory", img: "https://uno.directory/uno-directory.svg", alt: "Listed on Uno Directory", width: 106 },
  { href: "https://saascity.io", img: "https://saascity.io/badges/featured-light.svg", alt: "Featured on SaaSCity", width: 84 },
  { href: "https://thesaasdir.com/product/displaylatch?ref=badge", img: "https://thesaasdir.com/badge/displaylatch.svg", alt: "Featured on TheSaaSDir", width: 127 },
];

// Directories that accept only a plain text link, not an image badge.
export type DirectoryTextLink = { href: string; name: string; rel: string };

export const DIRECTORY_TEXT_LINKS: readonly DirectoryTextLink[] = [
];
