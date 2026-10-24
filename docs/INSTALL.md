# התקנה, פרסום ובדיקות

## דרישות

- Node.js 18 ומעלה (מומלץ 20 או 22), npm, Git.

## התקנה

```bash
git clone https://github.com/Anat1969/PixelColorsCircle-GH.git
cd PixelColorsCircle-GH
npm install
npm run dev
```

## פקודות

| פקודה | מה היא עושה |
|---|---|
| `npm run dev` | פיתוח עם רענון אוטומטי (פורט 8080) |
| `npm run build` | גרסת ייצור ל-`dist/` |
| `npm run preview` | הצגה מקומית של גרסת הייצור |
| `npm run lint` | בדיקת איכות קוד |
| `npm test` | בדיקות יחידה (Vitest): צבע, הרמוניה, כתובת, לוגיקת המסכה, עקביות הנתונים |
| `npm run test:e2e` | בדיקות Playwright מול `vite preview`, בדסקטופ ובנייד |
| `npm run check` | הכול ברצף: טיפוסים, lint, יחידה וקצה לקצה |

בדיקות הקצה לוחצות על כל כפתור, בודקות שאין גלילה אופקית, שכפתור A&I מופיע ושאין כפתורי פיתוח חופשיים בסרגל, שהשמירה עוברת רענון, שהאפליקציה ניתנת להתקנה (`Page.getInstallabilityErrors` ריק) ושהדפים עובדים עם הפחתת תנועה. עם `SHOTS_DIR=<תיקייה>` הן שומרות צילום מסך מלא של כל עמוד.

## פרסום ב-GitHub Pages (פעיל)

הכתובת: https://anat1969.github.io/PixelColorsCircle-GH/

כל מיזוג ל-main מריץ את `.github/workflows/pages.yml`: בדיקת טיפוסים, בדיקות יחידה, בנייה עם `PAGES_BASE=/PixelColorsCircle-GH/`, ודחיפה לענף `gh-pages`. אם הכתובת לא עולה, ב-Settings, Pages בוחרים Deploy from a branch, ענף `gh-pages`, תיקייה `/ (root)`.

## פרסום ב-Vercel (חלופה)

1. ב-Vercel: Add New Project, ובוחרים את הריפו `Anat1969/PixelColorsCircle-GH`.
2. Framework: Vite. Build: `npm run build`. Output: `dist`.
3. ב-Settings, Deployment Protection: לכבות את Vercel Authentication, כדי שהאתר יהיה ציבורי.
4. ענף הייצור הוא `main`. כל מיזוג ל-main מעדכן את הכתובת הראשית.

`vercel.json` כבר מגדיר הפניית כל הכתובות ל-`index.html` (ניתוב בצד הלקוח), ו-`sw.js` בלי מטמון. ל-Netlify קיים `public/_redirects`.

## התקנה כאפליקציה

ב-Chrome, בדסקטופ או באנדרואיד: תפריט A&I, "התקנת האפליקציה" (מופיע כש-Chrome מציע), או סמל ההתקנה בשורת הכתובת. האפליקציה עובדת גם בלי רשת אחרי הביקור הראשון.

## שמירת מידע

הכול נשמר ב-localStorage של הדפדפן: מצב הגלגל, פלטות, טקסטים ערוכים ותמונות. המידע לא עובר בין מחשבים. כדי להעביר פלטה, משתמשים ב"העתקת קישור" או בייצוא JSON.

## פתרון בעיות

- **הפורט תפוס:** `npm run dev -- --port 3000`.
- **עמוד ריק אחרי פרסום:** בודקים שההפניה ל-`index.html` פעילה (vercel.json או _redirects).
- **תמונה לא נשמרת:** האחסון בדפדפן מלא. מסירים תמונות ישנות במצב עריכה.
- **שינוי לא מופיע אחרי פרסום:** ה-service worker מגיש דפים מהרשת, אבל נכסים ישנים עשויים להישאר עד רענון נוסף.
