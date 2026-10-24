import { test as base, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const AI_MENU = readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "../fixtures/ai-menu.js"), "utf8");

/**
 * Every test: the A&I menu script is served from a local copy (the cloud sandbox cannot
 * reach vercel.app), and any console error or page error fails the test.
 */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      await page.context().route("https://appofapp-gh.vercel.app/ai-menu.js", r =>
        r.fulfill({ body: AI_MENU, contentType: "application/javascript" }),
      );
      page.on("pageerror", e => errors.push(`pageerror: ${e.message}`));
      page.on("console", m => {
        if (m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text())) errors.push(`console: ${m.text()}`);
      });
      await use(errors);
      expect(errors, "no console or page errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export const PAGES = [
  { path: "/", title: "תורת הצבע · גלגל ניוטון למעצבים", h1: /תורת הצבע/ },
  { path: "/wheel", title: "גלגל הצבעים · תורת הצבע", h1: "גלגל הצבעים של ניוטון" },
  { path: "/color-psychology", title: "פסיכולוגיית הצבעים · תורת הצבע", h1: "פסיכולוגיית הצבעים" },
  { path: "/how-colors-work", title: "איך צבעים עובדים בפועל · תורת הצבע", h1: "איך צבעים עובדים בפועל" },
  { path: "/no-such-page", title: "הדף לא נמצא · תורת הצבע", h1: "הדף לא נמצא" },
];

export async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, "no horizontal scroll").toBeLessThanOrEqual(0);
}

/** Real mouse click at the middle of a wheel cell, wherever the rotating mask has put it. */
export async function clickCell(page: Page, ring: number, sector: number) {
  const cell = page.locator(`[data-cell="${ring}-${sector}"]`);
  await cell.scrollIntoViewIfNeeded();
  const point = await cell.evaluate((el, [r, s]) => {
    const p = el as SVGPathElement;
    const angle = ((s + 0.5) * 30 - 90) * (Math.PI / 180);
    const radius = 48 + (r + 0.5) * 88;
    const pt = p.ownerSVGElement!.createSVGPoint();
    pt.x = 450 + radius * Math.cos(angle);
    pt.y = 450 + radius * Math.sin(angle);
    const screen = pt.matrixTransform(p.getScreenCTM()!);
    return { x: screen.x, y: screen.y };
  }, [ring, sector]);
  await page.mouse.click(point.x, point.y);
}

export async function openAIMenu(page: Page) {
  await page.locator("ai-menu .logo").click();
  await expect(page.locator("ai-menu .panel")).toBeVisible();
}
