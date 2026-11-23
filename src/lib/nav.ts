import type { AppPathname } from "@/i18n/routing";

type NavItem = { href: AppPathname; key: string };

/** Main navigation, in order (plan §3). Labels live in messages under `nav.<key>`. */
export const mainNav = [
  { href: "/visit", key: "visit" },
  { href: "/about", key: "about" },
  { href: "/ministries", key: "ministries" },
  { href: "/community", key: "community" },
  { href: "/global", key: "global" },
  { href: "/events", key: "events" },
  { href: "/resources", key: "resources" },
] as const satisfies readonly NavItem[];

/** Secondary links shown in the footer and the mobile menu. */
export const connectNav = [
  { href: "/contact", key: "contact" },
  { href: "/resources/newsletters", key: "newsletters" },
  { href: "/resources/policies", key: "policies" },
] as const satisfies readonly NavItem[];

/**
 * Phase 2 pages (plan §3): linked, listed in the sitemap and rendered only while `isPageLive(key)`
 * (lib/content), so in production they appear one by one as the client supplies their material.
 * `key` is both the page copy key and the `nav.<key>` label. Our churches and supporters are
 * linked from Global; the rest from the footer.
 */
export const phase2Nav = [
  { href: "/give", key: "give" },
  { href: "/opportunities", key: "opportunities" },
  { href: "/bookshop", key: "bookshop" },
  { href: "/global/churches", key: "churches" },
  { href: "/global/supporters", key: "supporters" },
] as const satisfies readonly NavItem[];

/** Paths whose top band is dark (photo/green hero): the header starts transparent over it. */
export const overlayHeaderPaths: readonly AppPathname[] = ["/"];

export function isActive(pathname: string, href: AppPathname) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
