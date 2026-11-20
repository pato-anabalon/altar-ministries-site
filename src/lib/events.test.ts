import { createFormatter } from "next-intl";
import { describe, expect, it } from "vitest";
import { formatEventBadge, formatEventWhen, type Event } from "./events";

const timeZone = "Pacific/Auckland";
const en = createFormatter({ locale: "en-NZ", timeZone });
const es = createFormatter({ locale: "es", timeZone });

const event = (start: string, precision: Event["precision"]) =>
  ({ id: "x", slug: "x", title: "X", start, precision, status: "confirmed" }) as Event;

describe("formatEventWhen", () => {
  const concert = event("2026-12-19T16:00:00+13:00", "datetime");

  it("writes date and time in New Zealand English, in Auckland time", () => {
    expect(formatEventWhen(en, concert)).toBe("Saturday, 19 December 2026, 4:00 pm");
  });

  it("writes it in Spanish", () => {
    expect(formatEventWhen(es, concert)).toBe("sábado, 19 de diciembre de 2026, 16:00");
  });

  it("only says what is known", () => {
    expect(formatEventWhen(en, event("2026-06-01T00:00:00+12:00", "month"))).toBe("June 2026");
    expect(formatEventWhen(en, event("2026-06-14T00:00:00+12:00", "day"))).toBe("Sunday, 14 June 2026");
  });
});

describe("formatEventBadge", () => {
  it("shows the day large, or the month for month-only events", () => {
    expect(formatEventBadge(en, event("2026-12-19T16:00:00+13:00", "datetime"))).toEqual({ large: "19", small: "Dec 2026" });
    expect(formatEventBadge(en, event("2026-06-01T00:00:00+12:00", "month"))).toEqual({ large: "Jun", small: "2026" });
  });
});
