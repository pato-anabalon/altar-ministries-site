import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { isTestSite } from "@/lib/stage";

/** Only the production site is crawlable; the test site stays out of search results. */
export default function robots(): MetadataRoute.Robots {
  if (isTestSite()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/en/dev/", "/es/dev/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
