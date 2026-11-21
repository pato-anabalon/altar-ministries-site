import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

/** Share image for every page in a language: the cross on the hill at night, with the wordmark. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${site.name} · Ponsonby, Auckland`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const assets = join(process.cwd(), "src/app/_og");

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = ((await params).locale as Locale) ?? "en";
  const t = await getTranslations({ locale, namespace: "footer" });
  const [font, background] = await Promise.all([
    readFile(join(assets, "tan-mon-cheri-regular.ttf")),
    readFile(join(assets, "background.jpg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: "#000" }}>
        <img src={`data:image/jpeg;base64,${background}`} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0 }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            padding: "0 64px 60px",
            color: "#EFEBD2",
            fontFamily: "Mon Cheri",
            backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
          }}
        >
          <div style={{ fontSize: 104, lineHeight: 1, letterSpacing: 4 }}>ALTAR</div>
          <div style={{ marginTop: 20, fontSize: 24, letterSpacing: 6 }}>{t("tagline").toUpperCase()}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Mon Cheri", data: font, style: "normal", weight: 400 }] },
  );
}
