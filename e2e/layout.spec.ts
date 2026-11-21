import { expect, test } from "@playwright/test";
import { sitemapPaths } from "./pages";

const widths = [375, 768, 1024, 1440];

/** No page scrolls sideways at the widths the site is designed for. */
test("no horizontal overflow at 375/768/1024/1440", async ({ page, request }) => {
  test.setTimeout(240_000);
  const paths = await sitemapPaths(request);
  const failures: string[] = [];
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      if (overflow > 0) failures.push(`${width}px ${path}: ${overflow}px wider`);
    }
  }
  expect(failures, failures.join("\n")).toEqual([]);
});

test("every sitemap page answers 200 with one h1 and its own lang", async ({ page, request }) => {
  test.setTimeout(120_000);
  for (const path of await sitemapPaths(request)) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator("html"), path).toHaveAttribute("lang", path.split("/")[1]!);
  }
});

test("unknown pages are a 404 in the visitor's language", async ({ page }) => {
  const response = await page.goto("/es/no-existe");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
});
