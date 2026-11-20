import { Button } from "@/components/atoms/Button";
import { Placeholder } from "@/components/atoms/Placeholder";
import type { getMinistries } from "@/lib/content";

export type Ministry = ReturnType<typeof getMinistries>[number];
export type MinistryLabels = { pending: string; askCta: string; photo: string };

/**
 * A ministry's content, shared by the modal (grid) and the full page (direct link) so both always
 * show the same thing. Without a supplied description it says so instead of inventing one.
 */
export function MinistryDetail({ ministry, labels }: { ministry: Ministry; labels: MinistryLabels }) {
  return (
    <div className="grid gap-8">
      <Placeholder label={labels.photo} ratio="16/9" />
      <p className="type-lead measure text-muted">{ministry.summary ?? labels.pending}</p>
      {ministry.sections.length > 0 && (
        <dl className="grid gap-6">
          {ministry.sections.map((section) => (
            <div key={section.title} className="grid gap-2 border-t border-rule pt-5">
              <dt className="type-h3">{section.title}</dt>
              <dd className="type-body measure text-muted">{section.body}</dd>
            </div>
          ))}
        </dl>
      )}
      <div>
        <Button href={{ pathname: "/contact", query: { about: ministry.name, topic: "team" } }} arrow>
          {labels.askCta}
        </Button>
      </div>
    </div>
  );
}
