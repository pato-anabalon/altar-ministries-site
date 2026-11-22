import { z } from "zod";
import type { Locale } from "@/i18n/routing";
import { isTestSite } from "@/lib/stage";

/**
 * Bilingual content is written once, side by side, so the two languages can never drift apart:
 * `{ en: "Visit us", es: "Visítanos" }`. Schemas require both, non-empty.
 */
export type Localized<T = string> = { en: T; es: T };

export const text = z.string().trim().min(1);
export const localized = <T extends z.ZodType>(schema: T) => z.object({ en: schema, es: schema }).strict();
export const localizedText = localized(text);

/** Replaces every `{ en, es }` pair in a content tree with the value for `locale`. */
export type Resolved<T> =
  T extends Localized<infer U>
    ? Resolved<U>
    : T extends readonly (infer Item)[]
      ? Resolved<Item>[]
      : T extends object
        ? { [K in keyof T]: Resolved<T[K]> }
        : T;

function isLocalized(value: unknown): value is Localized<unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value);
  return keys.length === 2 && keys.includes("en") && keys.includes("es");
}

export function resolve<T>(value: T, locale: Locale): Resolved<T> {
  if (isLocalized(value)) return resolve(value[locale], locale) as Resolved<T>;
  if (Array.isArray(value)) return value.map((item) => resolve(item, locale)) as Resolved<T>;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolve(child, locale)])) as Resolved<T>;
  }
  return value as Resolved<T>;
}

/**
 * Publishing state for facts the client still has to confirm. `pending` items render in
 * development and on the test site (`lib/stage.ts`) so they can be reviewed in context, and are
 * left out of production: the `main` deployment and local production builds.
 */
export const status = z.enum(["confirmed", "pending"]).default("confirmed");

export function isPublished(item: { status?: "confirmed" | "pending" }) {
  return item.status !== "pending" || process.env.NODE_ENV !== "production" || isTestSite();
}
