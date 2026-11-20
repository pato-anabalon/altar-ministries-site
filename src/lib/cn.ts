export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type Surface = "light" | "dark";

/** Web links open in a new tab; tel: and mailto: hand off to the phone or mail app in place. */
export function externalLinkProps(href: string) {
  return /^https?:/.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
