import { afterEach, describe, expect, it, vi } from "vitest";
import { locales } from "@/i18n/routing";
import { phase2Nav } from "@/lib/nav";
import { getEvents, getHistory, getMinistry, getMinistries, getPage, getStaticSlugs, isPageLive } from "./index";
import { isPublished, resolve } from "./localized";
import { ministrySchema } from "./schemas";
import { translateSlug } from "./slugs";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("content validation", () => {
  it("loads every collection (schemas pass at import)", () => {
    expect(getMinistries("en").length).toBeGreaterThan(0);
    expect(getPage("about", "es").title).toBe("Conoce Altar Ministries");
  });

  it("rejects a missing or empty translation and accented slugs", () => {
    const base = { id: "kids", group: "people", slug: { en: "kids", es: "ninos" }, name: { en: "Altar Kids", es: "Altar Kids" }, summary: null };
    expect(ministrySchema.safeParse(base).success).toBe(true);
    expect(ministrySchema.safeParse({ ...base, name: { en: "Altar Kids" } }).success).toBe(false);
    expect(ministrySchema.safeParse({ ...base, name: { en: "Altar Kids", es: " " } }).success).toBe(false);
    expect(ministrySchema.safeParse({ ...base, slug: { en: "kids", es: "niños" } }).success).toBe(false);
  });

  it.each(["ministries", "events"] as const)("gives %s unique slugs in each language", (collection) => {
    for (const locale of locales) {
      const slugs = getStaticSlugs(collection, locale);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });
});

describe("resolve", () => {
  it("picks the requested language at any depth and leaves other values alone", () => {
    const tree = { id: "x", name: { en: "Worship", es: "Adoración" }, list: [{ en: "a", es: "b" }], count: 2 };
    expect(resolve(tree, "es")).toEqual({ id: "x", name: "Adoración", list: ["b"], count: 2 });
  });
});

describe("ministries", () => {
  it("resolves to plain strings in the type system too", () => {
    const ministry = getMinistry("youth", "en");
    const name: string | undefined = ministry?.name;
    const sectionTitle: string | undefined = ministry?.sections[0]?.title;
    const summary: string | null | undefined = ministry?.summary;
    expect([name, sectionTitle, summary].every((value) => typeof value === "string")).toBe(true);
  });

  it("finds a ministry by its slug in each language", () => {
    expect(getMinistry("youth", "en")?.name).toBe("Youth Ministry");
    expect(getMinistry("jovenes", "es")?.name).toBe("Ministerio de Jóvenes");
    expect(getMinistry("youth", "es")).toBeNull();
  });

  it("translates slugs for the language switcher", () => {
    expect(translateSlug("/ministries/[slug]", "youth", "es")).toBe("jovenes");
    expect(translateSlug("/ministries/[slug]", "jovenes", "en")).toBe("youth");
    expect(translateSlug("/events/[slug]", "church-opening-2026", "es")).toBe("inauguracion-iglesia-2026");
  });
});

describe("events", () => {
  it("splits upcoming and past at the given moment", () => {
    const { upcoming, past } = getEvents("en", new Date("2026-11-20T12:00:00+13:00"));
    expect(upcoming.map((event) => event.id)).toEqual(["todo-por-amor-2026"]);
    expect(past.map((event) => event.id)).toEqual(["church-opening-2026"]);
  });

  it("moves an event to past once it has started", () => {
    const { upcoming } = getEvents("en", new Date("2026-12-20T00:00:00+13:00"));
    expect(upcoming).toEqual([]);
  });
});

describe("pending content", () => {
  it("is shown in development and hidden in production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(isPublished({ status: "pending" })).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(isPublished({ status: "pending" })).toBe(false);
    expect(isPublished({ status: "confirmed" })).toBe(true);
  });

  it("is shown on the Vercel test site and hidden on the production deployment", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isPublished({ status: "pending" })).toBe(true);
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isPublished({ status: "pending" })).toBe(false);
    vi.stubEnv("SITE_ENV", "test");
    expect(isPublished({ status: "pending" })).toBe(true);
  });

  it("leaves unconfirmed milestones out of production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(getHistory("en").map((milestone) => milestone.id)).not.toContain("nexus-initiative");
  });

  it("keeps phase 2 pages out of production until their material arrives", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(phase2Nav.filter((item) => isPageLive(item.key))).toEqual([]);
    vi.stubEnv("SITE_ENV", "test");
    expect(phase2Nav.every((item) => isPageLive(item.key))).toBe(true);
    expect(isPageLive("about")).toBe(true);
  });
});
