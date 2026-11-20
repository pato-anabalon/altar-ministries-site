import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import es from "@/messages/es.json";
import { locales, routing } from "./routing";

function keyPaths(value: unknown, prefix = ""): string[] {
  if (value === null || typeof value !== "object") return [prefix];
  return Object.entries(value).flatMap(([key, child]) => keyPaths(child, prefix ? `${prefix}.${key}` : key));
}

describe("messages", () => {
  it("has the same keys in every locale", () => {
    expect(keyPaths(es).sort()).toEqual(keyPaths(en).sort());
  });

  it("has no empty strings", () => {
    for (const messages of [en, es]) {
      const empty = keyPaths(messages).filter((path) => {
        const leaf = path.split(".").reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], messages);
        return typeof leaf === "string" && leaf.trim() === "";
      });
      expect(empty).toEqual([]);
    }
  });
});

describe("routing", () => {
  const publicPath = (locale: (typeof locales)[number], value: (typeof routing.pathnames)[keyof typeof routing.pathnames]) =>
    typeof value === "string" ? value : value[locale];

  it.each(locales)("gives every route a unique public URL in %s", (locale) => {
    const paths = Object.values(routing.pathnames).map((value) => publicPath(locale, value));
    expect(new Set(paths).size).toBe(paths.length);
  });

  it.each(locales)("uses lowercase, slash-prefixed URLs without accents in %s", (locale) => {
    for (const value of Object.values(routing.pathnames)) {
      expect(publicPath(locale, value)).toMatch(/^\/[a-z0-9\-/[\]]*$/);
    }
  });
});
