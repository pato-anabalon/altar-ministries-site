import type { MDXContent } from "mdx/types";

/**
 * Optional long descriptions for events, written as MDX per language next to this file
 * (e.g. todo-por-amor-2026.en.mdx / .es.mdx) and registered here by event id. Events without an
 * entry simply show their summary. Kept as an explicit map (not a dynamic import) so the bundler
 * knows every file and a missing translation is a type error, not a runtime 404.
 */
type Body = () => Promise<{ default: MDXContent }>;

export const eventBodies: Record<string, { en: Body; es: Body }> = {
  // "todo-por-amor-2026": {
  //   en: () => import("./todo-por-amor-2026.en.mdx"),
  //   es: () => import("./todo-por-amor-2026.es.mdx"),
  // },
};
