/**
 * The test site: kept out of search results and shows `pending` content for client review.
 * Any Vercel preview (the `develop` branch), or a deployment flagged with SITE_ENV=test — needed
 * while the test site is the project's production deployment on altar-ministries-site.vercel.app,
 * before altar.org.nz is attached to `main`.
 */
export function isTestSite() {
  if (process.env.SITE_ENV === "test") return true;
  return Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";
}
