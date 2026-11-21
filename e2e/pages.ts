import type { APIRequestContext } from "@playwright/test";

const SITE = "https://altar.org.nz";

/** Every public page in both languages, read from the sitemap so new pages are tested automatically. */
export async function sitemapPaths(request: APIRequestContext): Promise<string[]> {
  const xml = await (await request.get("/sitemap.xml")).text();
  const urls = [...xml.matchAll(/(?:<loc>|href=")(https:\/\/altar\.org\.nz[^<"]*)/g)].map((match) => match[1]!.replace(SITE, ""));
  return [...new Set(urls)].sort();
}
