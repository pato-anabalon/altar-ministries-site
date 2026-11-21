import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Only the production deployment is crawlable; Vercel previews stay out of search results. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/en/dev/", "/es/dev/"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
