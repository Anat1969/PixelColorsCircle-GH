import { chromium } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { test, expect, PAGES, noHorizontalScroll, clickCell, openAIMenu } from "./helpers";

const SHOTS = process.env.SHOTS_DIR;

test.describe("every page", () => {
  for (const p of PAGES) {
    test(`${p.path}: top bar, A&I button, title, no horizontal scroll`, async ({ page }, info) => {
      await page.goto(p.path);
      await expect(page).toHaveTitle(p.title);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.h1);
      await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

      // A&I standard: logo visible, no loose development buttons in the bar.
      await expect(page.locator("ai-menu .logo")).toBeVisible();
      await expect(page.locator("header").getByText("העתקת קישור")).toHaveCount(0);
      await expect(page.locator("header").getByRole("link", { name: /תורת הצבע, לדף הבית/ })).toBeVisible();

      await noHorizontalScroll(page);
      if (SHOTS) {
        // Scroll like a reader so scroll-revealed sections are in their final state.
        for (let y = 0; y < (await page.evaluate(() => document.body.scrollHeight)); y += 500) {
          await page.mouse.wheel(0, 500);
          await page.waitForTimeout(120);
        }
        await page.waitForTimeout(700);
        await page.screenshot({ path: `${SHOTS}/${info.project.name}-${p.path === "/" ? "home" : p.path.slice(1)}.png`, fullPage: true });
      }
    });
  }
});

test("navigation: every nav link, app name back home, active state", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "ניווט ראשי" });
  for (const [name, url] of [[/גלגל/, "/wheel"], [/פסיכולוגיה|פסיכולוגיית/, "/color-psychology"], [/בעולם|איך צבעים/, "/how-colors-work"]] as const) {
    await nav.getByRole("link", { name }).click();
    await expect(page).toHaveURL(new RegExp(url));
    await expect(nav.getByRole("link", { name })).toHaveAttribute("aria-current", "page");
  }
  await page.getByRole("link", { name: /לדף הבית/ }).click();
  await expect(page).toHaveURL(/\/$/);
});

test("skip link: hidden until focused from the keyboard, then jumps to the content", async ({ page, isMobile }) => {
  test.skip(isMobile);
  await page.goto("/wheel");
  const skip = page.getByRole("link", { name: "דילוג לתוכן" });
  await page.mouse.move(1400, 20);
  expect((await skip.boundingBox())?.width ?? 0).toBeLessThanOrEqual(1);
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();
  expect((await skip.boundingBox())!.width).toBeGreaterThan(40);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("home: content map links to the three tools", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "מה יש כאן" }).click();
  for (const name of ["גלגל הצבעים של ניוטון", "פסיכולוגיית הצבעים", "איך צבעים עובדים"]) {
    await expect(page.locator("#map").getByRole("link", { name: new RegExp(name) })).toBeVisible();
  }
  await page.locator("#map").getByRole("link", { name: /פסיכולוגיית הצבעים/ }).click();
  await expect(page).toHaveURL(/color-psychology/);
});

test.describe("wheel", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/wheel");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/wheel");
  });

  test("limit, modes, rotation, reset, undo: every control works", async ({ page }) => {
    const status = page.getByRole("status").filter({ hasText: "נבחרו" });
    for (const n of [1, 2, 3, 4, 5, 6, 7]) {
      await page.getByRole("button", { name: `${n} בחירות` }).click();
      await expect(page.getByRole("button", { name: `${n} בחירות` })).toHaveAttribute("aria-pressed", "true");
    }
    await page.getByRole("button", { name: "3 בחירות" }).click();

    await clickCell(page, 3, 0);
    await clickCell(page, 3, 4);
    await clickCell(page, 3, 8);
    await expect(status).toContainText("נבחרו 3 מתוך 3");
    await expect(page.locator("#palette-title")).toHaveText("משולש");
    await expect(page.locator("#report-title")).toBeVisible();
    await expect(page.getByText(/^לבן \d+\.\d{2}$/).first()).toBeVisible();

    // A fourth cell is refused at the limit.
    await expect(page.locator('[data-cell="0-1"]')).toHaveAttribute("aria-disabled", "true");

    await page.getByRole("button", { name: "סיבוב עם השעון" }).click();
    await expect(page).toHaveURL(/r=1/);
    await page.getByRole("button", { name: "סיבוב נגד השעון" }).click();
    await expect(page).toHaveURL(/r=0/);

    await page.getByRole("button", { name: "איפוס חורים" }).click();
    await expect(status).toContainText("נבחרו 0 מתוך 3");
    await page.getByRole("button", { name: "ביטול פעולה אחרונה" }).click();
    await expect(status).toContainText("נבחרו 3 מתוך 3");

    for (const mode of ["אותה טבעת", "אותו פלח", "סימטריה", "בחירה חופשית"]) {
      await page.getByRole("button", { name: mode, exact: true }).click();
      await expect(page.getByRole("button", { name: mode, exact: true })).toHaveAttribute("aria-pressed", "true");
    }
    await page.getByRole("button", { name: "אותה טבעת", exact: true }).click();
    await clickCell(page, 1, 2);
    await expect(page.locator('[data-cell="2-5"]')).toHaveAttribute("aria-disabled", "true");
    await expect(page.locator('[data-cell="1-5"]')).toHaveAttribute("aria-disabled", "false");

    await page.getByRole("button", { name: "בחירה חדשה" }).click();
    await expect(status).toContainText("נבחרו 0");
  });

  test("keyboard: arrows move, Enter opens", async ({ page }) => {
    await page.locator('[data-cell="3-0"]').focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.locator('[data-cell="3-1"]')).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator('[data-cell="2-1"]')).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator('[data-cell="2-1"]')).toHaveAttribute("aria-pressed", "true");
    await expect(page).toHaveURL(/c=2\.1/);
  });

  test("mask slider is keyboard operable and stored in the link", async ({ page }) => {
    const thumb = page.getByRole("slider", { name: "שקיפות המסכה" });
    await thumb.focus();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(page).toHaveURL(/o=70/);
  });

  test("the address reproduces the palette (copy link)", async ({ page, context }) => {
    await clickCell(page, 3, 0);
    await clickCell(page, 3, 6);
    await expect(page).toHaveURL(/c=3\.0-3\.6/);
    const url = page.url();
    const other = await context.newPage();
    await other.goto(url);
    await expect(other.locator('[data-cell="3-0"]')).toHaveAttribute("aria-pressed", "true");
    await expect(other.locator('[data-cell="3-6"]')).toHaveAttribute("aria-pressed", "true");
    await expect(other.locator("#palette-title")).toHaveText("משלימה");
  });

  test("export, save, reload, load and delete a palette", async ({ page, context, browserName }) => {
    test.skip(browserName !== "chromium");
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await clickCell(page, 3, 0);
    await clickCell(page, 3, 6);

    await page.getByRole("button", { name: "העתקת HEX" }).click();
    await expect(page.getByText("קודי HEX הועתקו")).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toMatch(/^#[0-9A-F]{6}, #[0-9A-F]{6}$/);

    await page.getByRole("button", { name: "משתני CSS" }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("--palette-1:");

    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "קובץ JSON" }).click();
    expect((await download).suggestedFilename()).toBe("palette.json");

    await page.getByLabel("שם לפלטה").fill("כניסה לבניין");
    await page.getByRole("button", { name: "שמירת הפלטה" }).click();
    await expect(page.getByRole("button", { name: "טעינת הפלטה כניסה לבניין" })).toBeVisible();

    await page.reload();
    await expect(page.getByRole("button", { name: "טעינת הפלטה כניסה לבניין" })).toBeVisible();
    await page.getByRole("button", { name: "איפוס חורים" }).click();
    await page.getByRole("button", { name: "טעינת הפלטה כניסה לבניין" }).click();
    await expect(page.locator('[data-cell="3-6"]')).toHaveAttribute("aria-pressed", "true");

    page.once("dialog", d => d.accept());
    await page.getByRole("button", { name: "מחיקת הפלטה כניסה לבניין" }).click();
    await expect(page.getByRole("button", { name: "טעינת הפלטה כניסה לבניין" })).toHaveCount(0);
  });

  test("report links each colour to its psychology page", async ({ page }) => {
    await clickCell(page, 3, 6);
    await page.getByRole("link", { name: /כחול · רווי/ }).click();
    await expect(page).toHaveURL(/color-psychology\?stop=blue/);
    await expect(page.getByRole("heading", { level: 2, name: "כחול" })).toBeVisible();
  });
});

test.describe("color psychology", () => {
  test("every stop button opens its explanation; balancing colour jumps", async ({ page }) => {
    await page.goto("/color-psychology");
    await expect(page.getByText("ההסבר המלא נפתח")).toBeVisible();
    for (const name of ["אדום", "כתום", "צהוב", "ירוק", "כחול", "אינדיגו", "סגול"]) {
      const btn = page.getByRole("group", { name: "קפיצה לנקודות העצירה" }).getByRole("button", { name });
      await btn.click();
      await expect(btn).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("heading", { level: 2, name, exact: true })).toBeVisible();
    }
    await expect(page).toHaveURL(/stop=violet/);
    await page.getByRole("button", { name: /צהוב.*מעבר/ }).click();
    await expect(page).toHaveURL(/stop=yellow/);
  });

  test("the spectrum slider works from the keyboard", async ({ page }) => {
    await page.goto("/color-psychology?stop=red");
    const slider = page.getByRole("slider", { name: "תדר האור בטרה־הרץ" });
    await slider.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(slider).toHaveAttribute("aria-valuetext", /399/);
    for (let i = 0; i < 30; i++) await page.keyboard.press("ArrowLeft");
    await expect(page.getByText("מחוץ לאור הנראה")).toBeVisible();
  });
});

test.describe("how colours work", () => {
  test("filters, expanding domains and copying swatches", async ({ page, context, browserName }) => {
    await page.goto("/how-colors-work");
    const music = page.getByRole("button", { name: /מוזיקה וצבע/ });
    await music.click();
    await expect(music).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("heading", { name: "מוזיקה מהירה ובהירה מרגישה חמה" })).toBeVisible();
    await music.click();
    await expect(music).toHaveAttribute("aria-expanded", "false");

    for (const [label, count] of [["הישרדות", 2], ["תקשורת", 2], ["פיזיקה", 3], ["רגש", 3]] as const) {
      await page.getByRole("button", { name: new RegExp(`^${label}`) }).click();
      await expect(page.locator("article")).toHaveCount(count);
    }
    await page.getByRole("button", { name: /^הכול/ }).click();
    await expect(page.locator("article")).toHaveCount(0);

    if (browserName === "chromium") {
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await page.getByRole("button", { name: /פיזיקה של צבע/ }).click();
      await page.getByRole("button", { name: "העתקת הצבע #90CAF9" }).click();
      await expect(page.getByText("#90CAF9 הועתק")).toBeVisible();
    }
  });
});

test("A&I menu: edit mode edits text, saves, survives reload, and restores", async ({ page }) => {
  await page.goto("/how-colors-work");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await openAIMenu(page);
  const menu = page.locator("ai-menu");
  await expect(menu.getByRole("menuitem", { name: /העתקת קישור/ })).toBeVisible();
  await expect(menu.getByRole("menuitem", { name: /שיחת הפיתוח/ })).toHaveAttribute("href", /claude\.ai\/code\/session_/);
  await expect(menu.getByRole("menuitem", { name: /התקנת האפליקציה/ })).toBeVisible();
  await menu.getByRole("menuitem", { name: /מצב עריכה/ }).click();
  await expect(page.locator("ai-menu .status")).toHaveText("מצב עריכה");

  const intro = page.getByRole("textbox", { name: /עריכת טקסט: צבעים הם לא רק/ });
  await intro.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type("נוסח חדש לפתיח");
  await page.keyboard.press("Enter");
  await expect(page.locator("ai-menu .status")).toHaveText("נשמר");

  // Image slots offer upload only in edit mode.
  await page.getByRole("button", { name: /מוזיקה וצבע/ }).click();
  await expect(page.getByRole("button", { name: "העלאת תמונה" }).first()).toBeVisible();

  await page.reload();
  await expect(page.getByText("נוסח חדש לפתיח")).toBeVisible();

  await openAIMenu(page);
  await menu.getByRole("menuitem", { name: /סיום עריכה/ }).click();
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await page.getByRole("button", { name: /מוזיקה וצבע/ }).click();
  await expect(page.getByRole("button", { name: "העלאת תמונה" })).toHaveCount(0);

  await openAIMenu(page);
  page.once("dialog", d => d.accept());
  await menu.getByRole("menuitem", { name: /שחזור הטקסטים המקוריים/ }).click();
  await expect(page.getByText("צבעים הם לא רק משמעויות סמליות", { exact: false })).toBeVisible();

  await openAIMenu(page);
  await page.keyboard.press("Escape");
  await expect(page.locator("ai-menu .panel")).toBeHidden();
});

test("installable: manifest, service worker, no installability errors", async ({ browserName, baseURL }, info) => {
  test.skip(browserName !== "chromium");
  // Chrome never offers install in incognito, which is Playwright's default; use a real profile.
  const context = await chromium.launchPersistentContext(mkdtempSync(path.join(tmpdir(), "pcc-")), {
    ...info.project.use.launchOptions,
    baseURL,
  });
  await context.route("https://appofapp-gh.vercel.app/ai-menu.js", r => r.fulfill({ path: "tests/fixtures/ai-menu.js" }));
  const page = context.pages()[0] ?? (await context.newPage());
  await page.goto("/");
  const manifest = await (await page.request.get("/manifest.webmanifest")).json();
  expect(manifest.icons.some((i: { purpose: string }) => i.purpose === "maskable")).toBe(true);
  expect(await page.evaluate(() => navigator.serviceWorker.ready.then(r => !!r.active))).toBe(true);
  const cdp = await page.context().newCDPSession(page);
  const { installabilityErrors } = await cdp.send("Page.getInstallabilityErrors");
  expect(installabilityErrors).toEqual([]);
  await context.close();
});

test("reduced motion: every page still shows all of its content", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("heading", { name: "שלושה כלים, מסלול אחד" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "שלושה כלים, מסלול אחד" })).toBeVisible();
  const opacity = await page.locator("#map a").first().evaluate(el => getComputedStyle(el.parentElement!).opacity);
  expect(opacity).toBe("1");
  await page.goto("/color-psychology?stop=green");
  await expect(page.getByRole("heading", { level: 2, name: "ירוק" })).toBeVisible();
});
