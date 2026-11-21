import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { sitemapPaths } from "./pages";

const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
/** Elements marked `data-decorative` (the footer wordmark) are ornament, exempt from contrast. */
const scan = (page: Page) => new AxeBuilder({ page }).withTags(tags).exclude("[data-decorative]");

/** WCAG 2.2 AA (axe) on every page of the sitemap, in both languages. */
test("every page passes axe (WCAG 2.2 AA)", async ({ page, request }) => {
  test.setTimeout(180_000);
  const failures: string[] = [];
  for (const path of await sitemapPaths(request)) {
    await page.goto(path);
    const { violations } = await scan(page).analyze();
    for (const violation of violations) {
      failures.push(`${path} · ${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(" ")).slice(0, 3).join(" | ")}`);
    }
  }
  expect(failures, failures.join("\n")).toEqual([]);
});

test("the open ministry modal passes axe", async ({ page }) => {
  await page.goto("/en/ministries");
  await page.getByRole("link", { name: /youth/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  const { violations } = await scan(page).include("dialog").analyze();
  expect(violations.map((violation) => violation.id)).toEqual([]);
});
