import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/molecules/Reveal";
import { Link } from "@/i18n/navigation";
import { formatEventBadge, formatEventWhen, type Event } from "@/lib/events";
import type { getFormatter } from "next-intl/server";

/**
 * One event in a list: the day set large, then title, when and summary. The whole row links to
 * the event's page. Past events read quieter.
 */
export function EventRow({ event, format, past = false }: { event: Event; format: Awaited<ReturnType<typeof getFormatter>>; past?: boolean }) {
  const badge = formatEventBadge(format, event);
  return (
    <li className="border-t border-rule">
      <Reveal>
        <Link
          href={{ pathname: "/events/[slug]", params: { slug: event.slug } }}
          className="group relative grid gap-6 py-8 pr-10 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-12 sm:py-10"
        >
          <time dateTime={event.start} className={`flex items-baseline gap-3 sm:flex-col sm:gap-1 ${past ? "text-muted" : ""}`}>
            <span className="pt-[0.2em] font-display text-6xl leading-none uppercase">{badge.large}</span>
            <span className="type-ui uppercase">{badge.small}</span>
          </time>
          <div className="grid content-start gap-3">
            <h3 className="font-serif text-[clamp(1.5rem,1.2rem+1.2vw,2.25rem)] leading-tight transition-colors duration-300 group-hover:text-accent">
              {event.title}
            </h3>
            <p className="type-ui">{formatEventWhen(format, event)}</p>
            {event.summary && <p className="type-body measure text-muted">{event.summary}</p>}
          </div>
          <ArrowRight
            aria-hidden
            strokeWidth={1.25}
            className="absolute top-10 right-0 size-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5 sm:top-12"
          />
        </Link>
      </Reveal>
    </li>
  );
}
