import { defineConfig, devices } from "@playwright/test";
import { existsSync } from "node:fs";

// Cloud sessions ship a pre-installed Chromium; use it when present.
const PRESET_CHROMIUM = "/opt/pw-browsers/chromium";
const launchOptions = existsSync(PRESET_CHROMIUM) ? { executablePath: PRESET_CHROMIUM } : {};

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    locale: "he-IL",
    launchOptions,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions } },
    { name: "mobile", use: { ...devices["Pixel 7"], launchOptions } },
  ],
  webServer: {
    command: "npm run build && npx vite preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
