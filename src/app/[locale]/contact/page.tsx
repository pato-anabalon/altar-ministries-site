import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { TextLink } from "@/components/atoms/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { ContactForm } from "@/components/organisms/ContactForm";
import { PageHeader } from "@/components/organisms/PageHeader";
import type { Locale } from "@/i18n/routing";
import { getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  const page = getPage("contact", locale);
  return pageMetadata({ locale, href: "/contact", title: page.title, description: page.intro });
}

/** Contact: the form beside every other way to reach the church. */
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("contact", locale);
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");
  const tVisit = await getTranslations("visit");

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <Section surface="white" aria-labelledby="contact-form-title">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
            <Reveal className="lg:col-span-7">
              <h2 id="contact-form-title" className="type-h2">
                {t("formTitle")}
              </h2>
              <div className="relative mt-10">
                {/* The form reads ?about= / ?topic=, which needs a Suspense boundary on a static page. */}
                <Suspense>
                  <ContactForm />
                </Suspense>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="lg:col-span-4 lg:col-start-9">
              <dl className="grid gap-8">
                <div className="grid gap-2 border-t border-rule pt-5">
                  <dt className="type-h3">{t("sunday")}</dt>
                  <dd className="grid justify-items-start gap-2 type-body text-muted">
                    <span>{tFooter("sundayTimes")}</span>
                    <span>
                      {site.venue.name}
                      <br />
                      {site.venue.streetAddress}, {site.venue.suburb}
                    </span>
                    <TextLink externalHref={site.venue.mapsUrl} className="type-ui text-fg">
                      {tVisit("directions")}
                    </TextLink>
                  </dd>
                </div>
                <div className="grid gap-2 border-t border-rule pt-5">
                  <dt className="type-h3">{t("call")}</dt>
                  <dd className="flex flex-wrap gap-x-6 gap-y-2 type-ui">
                    {site.phones.map((phone) => (
                      <TextLink key={phone.href} externalHref={phone.href}>
                        {phone.label}
                      </TextLink>
                    ))}
                  </dd>
                </div>
                <div className="grid gap-2 border-t border-rule pt-5">
                  <dt className="type-h3">{t("write")}</dt>
                  <dd className="type-ui">
                    <TextLink externalHref={`mailto:${site.email}`}>{site.email}</TextLink>
                  </dd>
                </div>
                <div className="grid gap-2 border-t border-rule pt-5">
                  <dt className="type-h3">{t("follow")}</dt>
                  <dd className="type-ui">
                    <TextLink externalHref={site.instagram}>Instagram</TextLink>
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </Section>
    </>
  );
}
