import type { getFormatter } from "next-intl/server";
import type { getEvents } from "@/lib/content";

export type Event = ReturnType<typeof getEvents>["upcoming"][number];
type Formatter = Awaited<ReturnType<typeof getFormatter>>;

/**
 * Human date line for an event, saying only as much as is known (`precision`), in Auckland time
 * (set in i18n/request.ts) and the locale's format (en-NZ / es):
 * datetime → "Saturday, 19 December 2026, 4:00 pm"; day → "Saturday, 19 December 2026"; month → "June 2026".
 */
export function formatEventWhen(format: Formatter, event: Event) {
  const start = new Date(event.start);
  if (event.precision === "month") return format.dateTime(start, { month: "long", year: "numeric" });
  const day = format.dateTime(start, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  if (event.precision === "day") return day;
  return `${day}, ${format.dateTime(start, { hour: "numeric", minute: "2-digit" })}`;
}

/** The large day number and short month shown beside an event (month-only events show the month). */
export function formatEventBadge(format: Formatter, event: Event) {
  const start = new Date(event.start);
  if (event.precision === "month") return { large: format.dateTime(start, { month: "short" }), small: format.dateTime(start, { year: "numeric" }) };
  return { large: format.dateTime(start, { day: "numeric" }), small: format.dateTime(start, { month: "short", year: "numeric" }) };
}
