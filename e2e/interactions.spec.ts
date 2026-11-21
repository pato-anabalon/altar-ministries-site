import { expect, test } from "@playwright/test";

test("skip link moves focus to the main content", async ({ page }) => {
  await page.goto("/en/visit");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("language switcher keeps the page and translates the slug", async ({ page }) => {
  await page.goto("/en/visit");
  await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "es", exact: true }).first().click();
  await expect(page).toHaveURL(/\/es\/visitanos$/);
});

test("contact form: errors are announced, focus moves to the first, and a valid message is sent", async ({ page }) => {
  await page.goto("/en/contact");
  const form = page.locator("form");
  await form.getByRole("button", { name: /send/i }).click();
  await expect(form.getByLabel("Name")).toBeFocused();
  await expect(form.getByLabel("Name")).toHaveAttribute("aria-invalid", "true");
  await expect(form.getByText("This field is required.").first()).toBeVisible();

  // A flagged field follows the correction: the message updates while typing and goes once valid.
  await form.getByLabel("Name").fill("Test Visitor");
  await expect(form.getByLabel("Name")).toHaveAttribute("aria-invalid", "false");
  await form.getByLabel("Email").fill("visitor@");
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await form.getByLabel("Email").fill("visitor@example.com");
  await expect(form.getByLabel("Email")).toHaveAttribute("aria-invalid", "false");
  await form.getByLabel("What is it about?").selectOption("visit");
  await form.getByLabel("Message").fill("Hello, I would like to visit on Sunday.");
  await form.getByRole("checkbox").check();

  // Answer the request here so the test never sends a real email, whatever the environment.
  await page.route("**/api/contact", (route) => route.fulfill({ json: { ok: true, simulated: true } }));
  await form.getByRole("button", { name: /send/i }).click();
  await expect(page.getByRole("status")).toBeVisible();
});

test("Plan your visit form starts with the visit topic", async ({ page }) => {
  await page.goto("/en/visit");
  await expect(page.getByLabel("What is it about?")).toHaveValue("visit");
});

test("a ministry opens as a dialog with its own URL and closes back to the list", async ({ page }) => {
  await page.goto("/en/ministries");
  await page.getByRole("link", { name: /youth/i }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page).toHaveURL(/\/en\/ministries\/youth$/);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/en\/ministries$/);
});

test.describe("with motion", () => {
  test.use({ reducedMotion: "no-preference" });

  test("switching language from the hero loads the other document with its motion state", async ({ page }) => {
    const errors: string[] = [];
    // Vercel Analytics only exists once deployed; its scripts 404 locally.
    page.on("console", (message) => {
      if (message.type() === "error" && !message.location().url.includes("/_vercel/")) errors.push(message.text());
    });
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("data-preloader", "done", { timeout: 10_000 });
    await page.getByRole("navigation", { name: "Language" }).getByRole("link", { name: "es", exact: true }).first().click();
    await expect(page).toHaveURL(/\/es$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page.locator("html")).toHaveClass(/\bmotion\b/);
    expect(errors).toEqual([]);
  });
});
