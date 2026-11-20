import { z } from "zod";

/**
 * Form schemas shared by the browser (inline errors) and the API routes (final check), so both
 * accept exactly the same input. Error messages are keys into messages `forms.errors.*`.
 */
const email = z.string().trim().min(1, "required").max(200, "tooLong").pipe(z.email("email"));

export const CONTACT_TOPICS = ["visit", "team", "community", "other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1, "required").max(100, "tooLong"),
  email,
  phone: z.string().trim().max(30, "tooLong").default(""),
  topic: z.enum(CONTACT_TOPICS, "required"),
  message: z.string().trim().min(10, "tooShort").max(2000, "tooLong"),
  /** What the visitor was looking at when they asked (a ministry or event name), if any. */
  about: z.string().trim().max(120).default(""),
  consent: z.literal(true, "consent"),
});

export const newsletterSchema = z.object({
  email,
  language: z.enum(["en", "es"], "required"),
  consent: z.literal(true, "consent"),
});

export type ContactInput = z.input<typeof contactSchema>;
export type NewsletterInput = z.input<typeof newsletterSchema>;
export type FieldErrors<T> = Partial<Record<keyof T, string>>;

/** First error key per field, for inline messages. */
export function fieldErrors<T>(error: z.ZodError<T>): FieldErrors<T> {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(Object.entries(flat).map(([field, messages]) => [field, messages?.[0]])) as FieldErrors<T>;
}

/** What the API routes answer; the forms turn it into a message. */
export type FormResult = { ok: true; simulated?: boolean } | { ok: false; error: "invalid" | "rate_limited" | "not_configured" | "failed" };

/** Honeypot field name: hidden from people, tempting to bots. */
export const HONEYPOT = "website";
