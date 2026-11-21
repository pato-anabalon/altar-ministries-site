import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.E2E_PORT ?? 3200);

/**
 * End-to-end checks against a production build (`npm run test:e2e` builds first). Reduced motion
 * by default so pages render their static state (no preloader, no entrance fades) for axe.
 * Point E2E_BASE_URL at a running server (e.g. `npm run dev`) to skip starting one.
 */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${port}`,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : { command: `npx next start --port ${port}`, port, reuseExistingServer: !process.env.CI, timeout: 60_000 },
});
