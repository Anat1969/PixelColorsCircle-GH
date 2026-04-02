export interface ColorExample {
  id: string;
  domain: "music" | "nature" | "physics";
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  colors: { hex: string; name: string }[];
  functionTag: string;
}

export const howColorsWorkData: ColorExample[] = [
  // ── Music ──
  {
    id: "music-vivaldi",
    domain: "music",
    title: "ויואלדי – ארבע העונות (קיץ)",
    subtitle: "אנרגיה סוערת ועוצמה",
    description:
      "הקצב המהיר והדינמיות הסוערת של \'קיץ\' מעוררים תחושת חום אדום-כתום — אש, דחיפות ותשוקה. אנשים רבים מדווחים על חוויית צבע חמה ועזה בעת האזנה.",
    colors: [
      { hex: "#E53935", name: "אדום" },
      { hex: "#FB8C00", name: "כתום" },
    ],
    functionTag: "רגש",
  },
  {
    id: "music-debussy",
    domain: "music",
    title: "דביוסי – אור ירח",
    subtitle: "רוגע ושלווה",
    description:
      "הצלילים הרכים והזורמים של \'אור ירח\' יוצרים תחושה כחולה-סגולה — מים שקטים, שמיים בלילה, ורפלקציה פנימית. הקשר בין המוזיקה לגוונים קרירים הוא אחד הנפוצים ביותר.",
    colors: [
      { hex: "#1E88E5", name: "כחול" },
      { hex: "#8E24AA", name: "סגול" },
    ],
    functionTag: "רגש",
  },
  {
    id: "music-bach",
    domain: "music",
    title: "באך – צ\'לו סוויטה מס׳ 1",
    subtitle: "עומק ומבנה",
    description:
      "הצלילים העמוקים והמובנים של הצ\'לו מעוררים תפיסה של גוונים חמים-כהים — חום, ענבר וזהב. העומק האקוסטי מתורגם לעומק חזותי.",
    colors: [
      { hex: "#6D4C41", name: "חום" },
      { hex: "#F9A825", name: "ענבר" },
    ],
    functionTag: "רגש",
  },

  // ── Nature ──
  {
    id: "nature-poison-frog",
    domain: "nature",
    title: "צפרדע חץ רעילה",
    subtitle: "אזהרה — אפוסמטיזם",
    description:
      "הצבעים הזוהרים — כחול, אדום, צהוב — מאותתים לטורפים: \'אני רעיל, אל תאכל אותי\'. זוהי דוגמה קלאסית לצבע כמנגנון הישרדות.",
    colors: [
      { hex: "#1E88E5", name: "כחול" },
      { hex: "#E53935", name: "אדום" },
      { hex: "#FDD835", name: "צהוב" },
    ],
    functionTag: "הישרדות",
  },
  {
    id: "nature-peacock",
    domain: "nature",
    title: "טווס",
    subtitle: "משיכה — בחירה מינית",
    description:
      "זנב הטווס הססגוני משמש למשיכת בנות זוג. הצבעים העזים והדפוסים המורכבים מאותתים על בריאות גנטית ויכולת הישרדות.",
    colors: [
      { hex: "#1565C0", name: "כחול כהה" },
      { hex: "#43A047", name: "ירוק" },
      { hex: "#F9A825", name: "זהב" },
    ],
    functionTag: "תקשורת",
  },
  {
    id: "nature-chameleon",
    domain: "nature",
    title: "זיקית",
    subtitle: "הסוואה ותקשורת",
    description:
      "הזיקית משנה צבע לא רק להסוואה — אלא גם כדי לתקשר מצב רוח, טמפרטורה ומוכנות לרבייה. צבע הוא שפה שלמה עבורה.",
    colors: [
      { hex: "#43A047", name: "ירוק" },
      { hex: "#F9A825", name: "צהוב" },
      { hex: "#6D4C41", name: "חום" },
    ],
    functionTag: "תקשורת",
  },
  {
    id: "nature-flower",
    domain: "nature",
    title: "פרחים ומאביקים",
    subtitle: "משיכת חרקים",
    description:
      "פרחים משתמשים בצבעים עזים ובדפוסי UV כדי למשוך דבורים, פרפרים ויונקי דבש. הצבע מכוון את המאביק ישירות אל הצוף.",
    colors: [
      { hex: "#8E24AA", name: "סגול" },
      { hex: "#FDD835", name: "צהוב" },
      { hex: "#E91E63", name: "ורוד" },
    ],
    functionTag: "תקשורת",
  },

  // ── Physics ──
  {
    id: "physics-sky",
    domain: "physics",
    title: "למה השמיים כחולים?",
    subtitle: "פיזור ריילי",
    description:
      "אור שמש לבן מתפזר באטמוספירה. גלי האור הכחולים, הקצרים יותר, מתפזרים בכל הכיוונים — ולכן השמיים נראים כחולים ביום.",
    colors: [
      { hex: "#42A5F5", name: "תכלת" },
      { hex: "#1565C0", name: "כחול עמוק" },
    ],
    functionTag: "פיזיקה",
  },
  {
    id: "physics-sunset",
    domain: "physics",
    title: "צבעי שקיעה",
    subtitle: "פיזור אור בזווית נמוכה",
    description:
      "בשקיעה, האור עובר מסלול ארוך יותר באטמוספירה. הגלים הכחולים מתפזרים לגמרי, ונשארים רק האדומים והכתומים — מה שיוצר את הצבעים החמים.",
    colors: [
      { hex: "#E53935", name: "אדום" },
      { hex: "#FB8C00", name: "כתום" },
      { hex: "#F9A825", name: "זהב" },
    ],
    functionTag: "פיזיקה",
  },
  {
    id: "physics-prism",
    domain: "physics",
    title: "ניוטון והמנסרה",
    subtitle: "שבירת אור לבן",
    description:
      "ניוטון הוכיח שאור לבן מורכב מכל צבעי הקשת. המנסרה שוברת את האור לרכיביו — אדום, כתום, צהוב, ירוק, כחול, אינדיגו וסגול.",
    colors: [
      { hex: "#E53935", name: "אדום" },
      { hex: "#FDD835", name: "צהוב" },
      { hex: "#43A047", name: "ירוק" },
      { hex: "#1E88E5", name: "כחול" },
      { hex: "#8E24AA", name: "סגול" },
    ],
    functionTag: "פיזיקה",
  },
  {
    id: "physics-mineral",
    domain: "physics",
    title: "צבעים במינרלים",
    subtitle: "הרכב כימי ומבנה גבישי",
    description:
      "צבעם של מינרלים נקבע על ידי יונים מתכתיים, מבנה גבישי ואינטראקציות עם אור. נחושת יוצרת כחול-ירוק, ברזל יוצר אדום, ומנגן יוצר ורוד.",
    colors: [
      { hex: "#26A69A", name: "טורקיז" },
      { hex: "#E53935", name: "אדום" },
      { hex: "#E91E63", name: "ורוד" },
    ],
    functionTag: "פיזיקה",
  },
];
