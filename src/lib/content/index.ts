import { z } from "zod";
import { beliefs } from "@/content/data/beliefs";
import { community } from "@/content/data/community";
import { events } from "@/content/data/events";
import { experiences } from "@/content/data/experiences";
import { global } from "@/content/data/global";
import { history } from "@/content/data/history";
import { leaders } from "@/content/data/leaders";
import { ministries } from "@/content/data/ministries";
import { pages } from "@/content/data/pages";
import { values } from "@/content/data/values";
import type { Locale } from "@/i18n/routing";
import { isPublished, resolve } from "./localized";
import {
  communitySchema,
  eventSchema,
  experienceSchema,
  globalSchema,
  leadersSchema,
  milestoneSchema,
  ministrySchema,
  namedItemSchema,
  pagesSchema,
} from "./schemas";

/**
 * The only door to site content. Pages call these getters and never read src/content directly,
 * so the source (TS/MDX today, a database tomorrow) can change without touching a page.
 * Everything is validated at import: a missing translation or malformed date fails the build.
 */
function parse<T extends z.ZodType>(name: string, schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`Invalid content in src/content/data/${name}.ts:\n${z.prettifyError(result.error)}`);
  return result.data;
}

const content = {
  experiences: parse("experiences", z.array(experienceSchema), experiences),
  beliefs: parse("beliefs", z.array(namedItemSchema), beliefs),
  values: parse("values", z.array(namedItemSchema), values),
  leaders: parse("leaders", leadersSchema, leaders),
  history: parse("history", z.array(milestoneSchema), history),
  ministries: parse("ministries", z.array(ministrySchema), ministries),
  community: parse("community", z.array(communitySchema), community),
  global: parse("global", globalSchema, global),
  events: parse("events", z.array(eventSchema), events),
  pages: parse("pages", pagesSchema, pages),
};

export type PageKey = keyof typeof content.pages;

export function getPage<K extends PageKey>(key: K, locale: Locale) {
  return resolve(content.pages[key], locale);
}

export function getExperiences(locale: Locale) {
  return resolve(content.experiences.filter(isPublished), locale);
}

export function getBeliefs(locale: Locale) {
  return resolve(content.beliefs, locale);
}

export function getValues(locale: Locale) {
  return resolve(content.values, locale);
}

export function getLeaders(locale: Locale) {
  const { senior, ...rest } = content.leaders;
  return resolve(
    {
      ...rest,
      // Unapproved bios are reviewed in development only.
      senior: senior.map(({ bioStatus, ...leader }) => ({ ...leader, bio: isPublished({ status: bioStatus }) ? leader.bio : null })),
    },
    locale,
  );
}

/** Dated milestones in order, then the ones still waiting for a date. */
export function getHistory(locale: Locale) {
  const sorted = content.history
    .filter(isPublished)
    .toSorted((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999"));
  return resolve(sorted, locale);
}

export function getMinistries(locale: Locale) {
  return resolve(content.ministries.filter(isPublished), locale);
}

export function getMinistry(slug: string, locale: Locale) {
  const ministry = content.ministries.find((item) => isPublished(item) && item.slug[locale] === slug);
  return ministry ? resolve(ministry, locale) : null;
}

export function getCommunity(locale: Locale) {
  return resolve(content.community.filter(isPublished), locale);
}

export function getGlobal(locale: Locale) {
  return resolve({ ...content.global, partners: content.global.partners.filter(isPublished) }, locale);
}

/** Splits published events at `now`: upcoming soonest first, past most recent first. */
export function getEvents(locale: Locale, now = new Date()) {
  const published = content.events.filter(isPublished);
  const isUpcoming = (event: (typeof published)[number]) => new Date(event.end ?? event.start) >= now;
  return {
    upcoming: resolve(published.filter(isUpcoming).toSorted((a, b) => a.start.localeCompare(b.start)), locale),
    past: resolve(published.filter((event) => !isUpcoming(event)).toSorted((a, b) => b.start.localeCompare(a.start)), locale),
  };
}

export function getEvent(slug: string, locale: Locale) {
  const event = content.events.find((item) => isPublished(item) && item.slug[locale] === slug);
  return event ? resolve(event, locale) : null;
}

/** Slugs to prerender per locale for the dynamic routes. */
export function getStaticSlugs(collection: "ministries" | "events", locale: Locale) {
  return content[collection].filter(isPublished).map((item) => item.slug[locale]);
}
