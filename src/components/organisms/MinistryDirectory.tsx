"use client";

import { useState, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Modal } from "@/components/molecules/Modal";
import { Reveal } from "@/components/molecules/Reveal";
import { MinistryDetail, type Ministry, type MinistryLabels } from "@/components/organisms/MinistryDetail";

type Entry = { ministry: Ministry; href: string; labels: MinistryLabels };
type Group = { id: string; title: string; entries: Entry[] };

/**
 * The ministries grid. Each name is a real link to the ministry's page (works without JS, in a new
 * tab, when shared); a plain click instead opens it in a modal and pushes that same URL with the
 * History API, which Next keeps in sync with usePathname. The modal is open exactly while the URL
 * is a ministry's, so Back and the close button (history.back) always agree with it.
 */
export function MinistryDirectory({ groups, closeLabel }: { groups: Group[]; closeLabel: string }) {
  const pathname = usePathname();
  const entries = groups.flatMap((group) => group.entries);
  const active = entries.find((entry) => entry.href === pathname);
  // Remember the last ministry (React's "previous render" pattern) so the modal leaves with its
  // content instead of emptying mid-animation.
  const [shown, setShown] = useState(active);
  if (active && active.href !== shown?.href) setShown(active);
  const content = active ?? shown;

  const open = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    // Let the browser handle new-tab / new-window / download clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
  };

  return (
    <>
      {groups.map((group, groupIndex) => (
        <Section key={group.id} surface={groupIndex % 2 === 0 ? "white" : "cream"} aria-labelledby={`ministries-${group.id}`}>
          <Container>
            <Reveal>
              <h2 id={`ministries-${group.id}`} className="type-h2">
                {group.title}
              </h2>
            </Reveal>
            <ul className="mt-10 grid border-b border-rule md:grid-cols-2 md:gap-x-10">
              {group.entries.map(({ ministry, href, labels }) => (
                <li key={ministry.id} className="border-t border-rule">
                  <Reveal>
                    <a href={href} onClick={(event) => open(event, href)} className="group grid gap-2 py-7 pr-12 relative">
                      <span className="font-serif text-[clamp(1.5rem,1.2rem+1.1vw,2.25rem)] leading-tight transition-colors duration-300 group-hover:text-accent">
                        {ministry.name}
                      </span>
                      <span className="type-small line-clamp-2 text-muted">{ministry.summary ?? labels.pending}</span>
                      <ArrowRight
                        aria-hidden
                        strokeWidth={1.25}
                        className="absolute top-8 right-0 size-6 transition-transform duration-500 ease-out-expo group-hover:translate-x-1.5"
                      />
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ))}

      <Modal open={Boolean(active)} onClose={() => window.history.back()} title={content?.ministry.name ?? ""} closeLabel={closeLabel}>
        {content && <MinistryDetail ministry={content.ministry} labels={content.labels} />}
      </Modal>
    </>
  );
}
