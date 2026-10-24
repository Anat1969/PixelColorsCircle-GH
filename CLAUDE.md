# CLAUDE.md

לפני כל עבודה: לקרוא את הקובץ הזה ואת `.claude/skills/anat-app-builder/SKILL.md`.

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## כללי הפרויקט

- **מקור אחד לצבע:** שבעת צבעי ניוטון, 12 הפלחים והטבעות מוגדרים רק ב-`src/data/newton.ts`. לא כותבים hex של צבעי ניוטון בשום מקום אחר.
- **לוגיקת המסכה בגלגל סופית** (ראו `docs/ARCHITECTURE.md`). לא משנים את התנהגות המסכה. סימוני ריחוף ופוקוס מצוירים מעליה.
- **שכבות שקופות בדוח:** חישוב, פרשנות מכללים, מגבלות. פרשנות לעולם לא מוצגת כעובדה.
- **מצב הגלגל בכתובת:** כל פרמטר חדש של הגלגל נכנס ל-`src/lib/wheelState.ts` (קידוד ופענוח עם בדיקת גבולות) ולבדיקה ב-`src/test/wheelState.test.ts`.
- **עיצוב:** אסימונים ב-`src/index.css` בלבד. כפתורים מרובעים (`.btn`), נבחר דרך `aria-pressed`, כבוי דרך `disabled`. בלי אייקונים בממשק, מלבד `AppIcon`.
- **טקסט חדש שמוצג למשתמש** עוטפים ב-`EditableText` עם מזהה יציב, כדי שיהיה ניתן לעריכה.
- **לפני מסירה:** `npm run check` ירוק (טיפוסים, lint, Vitest, Playwright בדסקטופ ובנייד), ומסתכלים בעין על צילומי המסך (`SHOTS_DIR=...`).

## יומן תיקונים

- **2026-10-24 · שדרוג 2.0.** הקוד עבר מ-pixel-perfect-clone-50803 (Lovable) לריפו הזה, כולל ההיסטוריה. נוספו: כפתור A&I ומצב עריכה, PWA (manifest, sw.js, אייקונים), דף בית ממפה עם גלגל תלת־ממדי, דוח בשלוש שכבות (הרמוניה לפי איטן, ניגודיות WCAG לכל צבע ולכל זוג), שמירת פלטות וייצוא, מצב בכתובת, ניווט מקלדת בגלגל, כפתורי קפיצה וקישור ישיר בספקטרום, סינון לפי תפקיד ב"איך צבעים עובדים", מערכת עיצוב "Optical Graphite" מרובעת, 34 בדיקות יחידה ו־39 בדיקות קצה. אוחדו צבעי ניוטון, שהוגדרו פעמיים עם ערכי hex שונים. הוסרו 47 רכיבי ממשק ו־38 חבילות שלא היו בשימוש.

## למדנו בבנייה

- **`server.host: "::"` ב-vite.config** מפיל את `vite preview` בסביבת הענן (`EAFNOSUPPORT`). מריצים preview עם `--host 127.0.0.1`.
- **`Page.getInstallabilityErrors` מחזיר `in-incognito`** בהקשר הרגיל של Playwright. בודקים התקנה עם `launchPersistentContext`.
- **אנימציית `whileInView`** משאירה תוכן שקוף בצילום עמוד מלא ובהדפסה. בבדיקה גוללים לפני צילום, וב-CSS יש עקיפה ל-`@media print`.
- **קישור "דילוג לתוכן" עם `.btn`:** אפקט ההרמה בריחוף דורס את `translate` שמסתיר אותו. מסתירים עם `sr-only` ומציגים ב-`focus:not-sr-only`.
- **פריטים עם מיקום שורה מפורש ב-grid** מוצבים לפני פריטים אוטומטיים. בסרגל העליון נותנים לכל פריט עמודה ושורה מפורשות.
- **לחיצה על תא SVG בגלגל מסתובב:** מחשבים את מרכז התא ב-`getScreenCTM` ולוחצים בעכבר אמיתי (`tests/e2e/helpers.ts`), ולא לוחצים על מרכז ה-bounding box.
- **`pkill -f "vite preview"`** הורג גם את מעטפת ה-bash שמריצה אותו. עוצרים לפי PID.
