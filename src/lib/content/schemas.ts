import { z } from "zod";
import { localized, localizedText, status, text } from "./localized";

/** URL segment: lowercase ASCII words joined by hyphens (no accents, so URLs stay clean). */
const slugText = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase ASCII words joined by hyphens");
const id = slugText;

const titledText = z.object({ title: localizedText, body: localizedText }).strict();

export const experienceSchema = z
  .object({
    id,
    name: localizedText,
    summary: localizedText,
    schedule: localizedText.optional(),
    location: localizedText.optional(),
    details: localizedText.optional(),
    status,
  })
  .strict();

export const namedItemSchema = z.object({ id, name: localizedText, description: localizedText }).strict();

export const leadersSchema = z
  .object({
    senior: z.array(
      z
        .object({
          id,
          name: text,
          roles: localizedText,
          bio: localizedText.nullable(),
          bioStatus: status,
          /** Path under /public once supplied; null renders a placeholder. */
          photo: text.nullable(),
        })
        .strict(),
    ),
    elders: z.array(text),
    pastorsInTraining: z.array(text),
  })
  .strict();

export const milestoneSchema = z
  .object({
    id,
    date: z
      .string()
      .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "date must be YYYY, YYYY-MM or YYYY-MM-DD")
      .nullable(),
    dateLabel: localizedText,
    description: localizedText,
    status,
  })
  .strict();

export const ministrySchema = z
  .object({
    id,
    group: z.enum(["people", "serve"]),
    slug: localized(slugText),
    name: localizedText,
    /** null = description not supplied yet (shown as "coming soon", never invented). */
    summary: localizedText.nullable(),
    sections: z.array(titledText).default([]),
    status,
  })
  .strict();

export const communitySchema = z.object({ id, title: localizedText, body: localizedText, status }).strict();

export const globalSchema = z
  .object({
    community: titledText,
    altarGlobal: titledText,
    missions: titledText,
    partners: z.array(
      z
        .object({ id, name: text, description: localizedText.optional(), url: z.url().optional(), status })
        .strict(),
    ),
  })
  .strict();

export const eventSchema = z
  .object({
    id,
    slug: localized(slugText),
    title: localizedText,
    /** ISO 8601 with offset, e.g. 2026-12-19T16:00:00+13:00 (Auckland). */
    start: z.iso.datetime({ offset: true }),
    end: z.iso.datetime({ offset: true }).optional(),
    /** How much of `start` is known: past events sometimes only have a month. */
    precision: z.enum(["datetime", "day", "month"]),
    summary: localizedText.optional(),
    location: localizedText.optional(),
    status,
  })
  .strict();

/** A downloadable or playable file (Vercel Blob URL), in one language. */
const fileSchema = z.object({ language: z.enum(["en", "es"]), label: localizedText, url: z.url() }).strict();

export const resourceCategorySchema = z
  .object({ id, name: localizedText, description: localizedText, files: z.array(fileSchema) })
  .strict();

export const policySchema = z.object({ id, name: localizedText, files: z.array(fileSchema) }).strict();

export const photoSchema = z
  .object({ id, src: z.string().regex(/^\/images\/[\w/.-]+\.(avif|webp|jpe?g|png)$/), alt: localizedText })
  .strict();

const pageCopy = z.object({ title: localizedText, intro: localizedText.optional() }).catchall(localizedText);

export const pagesSchema = z
  .object({
    home: pageCopy,
    visit: pageCopy,
    about: pageCopy,
    history: pageCopy,
    dna: pageCopy,
    leadership: pageCopy,
    ministries: pageCopy,
    community: pageCopy,
    global: pageCopy,
    events: pageCopy,
    resources: pageCopy,
    newsletters: pageCopy,
    policies: pageCopy,
    contact: pageCopy,
  })
  .strict();
