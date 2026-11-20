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

/** Paths whose top band is dark (photo/green hero): the header starts transparent over it. */
export const overlayHeaderPaths: readonly AppPathname[] = ["/"];

export function isActive(pathname: string, href: AppPathname) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
