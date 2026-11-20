import { getTranslations, setRequestLocale } from "next-intl/server";
import { MinistryDirectory } from "@/components/organisms/MinistryDirectory";
import { PageHeader } from "@/components/organisms/PageHeader";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getMinistries, getPage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/ministries">) {
  const locale = (await params).locale as Locale;
  const page = getPage("ministries", locale);
  return pageMetadata({ locale, href: "/ministries", title: page.title, description: page.intro });
}

/** Ministries: the teams grouped by stage of life and by service; each opens in a modal. */
export default async function MinistriesPage({ params }: PageProps<"/[locale]/ministries">) {
  const locale = (await params).locale as Locale;
  setRequestLocale(locale);
  const page = getPage("ministries", locale);
  const ministries = getMinistries(locale);
  const t = await getTranslations("ministries");
  const tCommon = await getTranslations("common");

  const entriesFor = (group: "people" | "serve") =>
    ministries
      .filter((ministry) => ministry.group === group)
      .map((ministry) => ({
        ministry,
        href: getPathname({ locale, href: { pathname: "/ministries/[slug]", params: { slug: ministry.slug } } }),
        labels: { pending: t("pending"), askCta: t("askCta"), photo: t("photo", { name: ministry.name }) },
      }));

  return (
    <>
      <PageHeader title={page.title} intro={page.intro} />
      <MinistryDirectory
        closeLabel={tCommon("close")}
        groups={[
          { id: "people", title: t("people"), entries: entriesFor("people") },
          { id: "serve", title: t("serve"), entries: entriesFor("serve") },
        ]}
      />
    </>
  );
}
