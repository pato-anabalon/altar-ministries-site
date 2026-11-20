import type { ComponentProps, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Reveal } from "@/components/molecules/Reveal";
import { Link } from "@/i18n/navigation";
import { capToLongestWord } from "@/lib/fitText";

/**
 * Opening band of every inner page: the H1 in Mon Cheri capitals and the page's intro. Sub-pages
 * get a quiet way back to their parent (navigation, not a label).
 */
export function PageHeader({
  title,
  intro,
  parent,
  children,
}: {
  title: string;
  intro?: string;
  parent?: { href: ComponentProps<typeof Link>["href"]; label: string };
  children?: ReactNode;
}) {
  return (
    <Section spacing="none" className="pt-14 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <Reveal>
          {parent && (
            <Link href={parent.href} className="group mb-8 inline-flex min-h-11 items-center gap-2 type-small text-muted transition-colors hover:text-fg">
              <ArrowLeft aria-hidden strokeWidth={1.5} className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              {parent.label}
            </Link>
          )}
          <h1 className="max-w-5xl type-display" style={{ fontSize: capToLongestWord("clamp(2.25rem, 1rem + 6.5vw, 6rem)", [title]) }}>
            {title}
          </h1>
          {intro && <p className="mt-8 type-lead measure text-muted">{intro}</p>}
          {children && <div className="mt-10">{children}</div>}
        </Reveal>
      </Container>
    </Section>
  );
}
