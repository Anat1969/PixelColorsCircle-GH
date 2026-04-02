export interface ColorPsychologyEntry {
  name: string;
  hex: string;
  frequencyTHz: number;
  wavelengthNm: number;
  positiveMeaning: string;
  negativeMeaning: string;
  effects: string;
  balanceNeed: string;
  balanceReason: string;
  scientificExplanation: string;
  psychologicalExplanation: string;
  balancingColorName: string;
  balancingColorHex: string;
}

export const colorPsychologyData: ColorPsychologyEntry[] = [
  {
    name: "אדום",
    hex: "#E53935",
    frequencyTHz: 430,
    wavelengthNm: 700,
    positiveMeaning: "אנרגיה, אומץ, תשוקה, פעולה ונוכחות חזקה.",
    negativeMeaning: "תוקפנות, לחץ, אימפולסיביות ועומס רגשי.",
    effects: "מעלה דופק, מגביר ערנות, יוצר תחושת דחיפות ומושך תשומת לב מיידית.",
    balanceNeed: "עודף אדום עלול ליצור מתח, עוינות ותחושת חוסר מנוחה.",
    balanceReason: "ירוק מוסיף רוגע, התחדשות ומרחב נשימה רגשי — מרכך את העוצמה מבלי להסיר את החיוניות.",
    scientificExplanation: "אדום הוא אורך הגל הארוך ביותר בספקטרום הנראה (~700nm). העין רגישה אליו מאוד, ולכן הוא בולט ומושך מבט גם ממרחק.",
    psychologicalExplanation: "אדום מפעיל את מערכת העצבים הסימפתטית — מגביר דריכות, תשוקה ורצון לפעולה. בתרבויות רבות הוא מסמל סכנה, אהבה או כוח.",
    balancingColorName: "ירוק",
    balancingColorHex: "#43A047",
  },
  {
    name: "כתום",
    hex: "#FB8C00",
    frequencyTHz: 496,
    wavelengthNm: 605,
    positiveMeaning: "חום, חברותיות, יצירתיות, התלהבות ואופטימיות.",
    negativeMeaning: "חוסר מנוחה, שטחיות, גירוי יתר וחוסר מיקוד.",
    effects: "מעורר תיאבון, מגביר חברותיות, יוצר תחושת חום ונגישות.",
    balanceNeed: "עודף כתום עלול ליצור תחושת עומס חושי, חוסר רצינות וקושי להתמקד.",
    balanceReason: "כחול מוסיף בהירות, מבנה ורוגע — שומר על חום ויצירתיות תוך הפחתת רעש ועודף.",
    scientificExplanation: "כתום נמצא בטווח 590–620nm. הוא שילוב של אורכי גל אדומים וצהובים, ולכן נתפס כחם ואנרגטי.",
    psychologicalExplanation: "כתום משדר חום אנושי וקלילות. הוא מפחית ריחוק ויוצר תחושת קרבה — אך בעוצמה גבוהה עלול להיתפס כילדותי או צעקני.",
    balancingColorName: "כחול",
    balancingColorHex: "#1E88E5",
  },
  {
    name: "צהוב",
    hex: "#FDD835",
    frequencyTHz: 517,
    wavelengthNm: 580,
    positiveMeaning: "בהירות, סקרנות, למידה, ערנות ואופטימיות.",
    negativeMeaning: "חרדה, עייפות מנטלית, ביקורתיות ומתח עצבני.",
    effects: "ממריץ חשיבה, מגביר ערנות מנטלית, מעודד תקשורת פתוחה ותחושת קלילות.",
    balanceNeed: "עודף צהוב עלול ליצור חרדה, מחשבות מהירות מדי וקושי להירגע.",
    balanceReason: "סגול מוסיף עומק, רפלקציה ומשקל רגשי — יוצר שילוב מעוגן ומהורהר יותר.",
    scientificExplanation: "צהוב נמצא סביב 570–590nm ונתפס כבהיר ביותר על ידי העין האנושית. הוא הכי קרוב לנקודת הרגישות המקסימלית של קולטני M ו-L ברשתית.",
    psychologicalExplanation: "צהוב מזוהה עם אינטלקט, אופטימיות ותשומת לב. הוא מעורר את המוח אך בעוצמה גבוהה עלול להעמיס ולהציף.",
    balancingColorName: "סגול",
    balancingColorHex: "#8E24AA",
  },
  {
    name: "ירוק",
    hex: "#43A047",
    frequencyTHz: 566,
    wavelengthNm: 530,
    positiveMeaning: "איזון, צמיחה, ריפוי, יציבות והתחדשות.",
    negativeMeaning: "קיפאון, פסיביות, ריחוק רגשי והתנגדות לשינוי.",
    effects: "מרגיע את מערכת העצבים, מוריד מתח, יוצר תחושת בטחון ויציבות.",
    balanceNeed: "עודף ירוק עלול ליצור שאננות, חוסר תנועה והימנעות מעימות נחוץ.",
    balanceReason: "אדום מוסיף מומנטום, דחיפות והפעלה — תומך בתנועה כאשר הירוק הופך פסיבי מדי.",
    scientificExplanation: "ירוק נמצא במרכז הספקטרום הנראה (~530nm). העין האנושית רגישה ביותר לירוק, ולכן הוא נתפס כנוח וטבעי.",
    psychologicalExplanation: "ירוק מייצג איזון ביולוגי ורגשי. הוא נקשר לטבע, צמיחה ובריאות — ולכן מרגיע ומייצב, אך עלול גם ליצור סטגנציה.",
    balancingColorName: "אדום",
    balancingColorHex: "#E53935",
  },
  {
    name: "כחול",
    hex: "#1E88E5",
    frequencyTHz: 638,
    wavelengthNm: 470,
    positiveMeaning: "רוגע, אמון, הגיון, בהירות וויסות רגשי.",
    negativeMeaning: "קרירות, ניתוק, נוקשות ושליטת יתר.",
    effects: "מוריד לחץ דם, מאט דופק, מעודד חשיבה אנליטית ותחושת אמינות.",
    balanceNeed: "עודף כחול עלול ליצור ריחוק רגשי, קרירות בינאישית ותחושת בדידות.",
    balanceReason: "כתום מוסיף חום, ספונטניות וחיבור אנושי — עוזר למנוע את הריחוק הרגשי שכחול יוצר.",
    scientificExplanation: "כחול נמצא בטווח 450–495nm. אורכי גל קצרים יותר מכילים יותר אנרגיה, ולכן כחול נתפס כעמוק וחד.",
    psychologicalExplanation: "כחול מזוהה עם אמון, יציבות ושליטה עצמית. הוא הצבע הנפוץ ביותר כצבע מועדף בעולם, ונקשר לשמיים ולים.",
    balancingColorName: "כתום",
    balancingColorHex: "#FB8C00",
  },
  {
    name: "אינדיגו",
    hex: "#3949AB",
    frequencyTHz: 685,
    wavelengthNm: 438,
    positiveMeaning: "תובנה, אינטואיציה, עומק, ריכוז ותפיסה פנימית.",
    negativeMeaning: "נסיגה, כבדות, חשיבת יתר ובידוד.",
    effects: "מעמיק חשיבה, מגביר ריכוז, מעודד אינטרוספקציה ותפיסה עדינה.",
    balanceNeed: "עודף אינדיגו עלול ליצור נסיגה פנימית, כבדות רגשית ותחושת ניתוק מהסביבה.",
    balanceReason: "צהוב מוסיף קלילות, פתיחות מנטלית ואנרגיה גלויה — מרים את האינדיגו כשהוא הופך פנימי מדי.",
    scientificExplanation: "אינדיגו נמצא בטווח 420–450nm, בין כחול לסגול. הוא קשה להבחנה כצבע נפרד, ומוגדר כך מסיבות היסטוריות מאז ניוטון.",
    psychologicalExplanation: "אינדיגו נקשר לעומק פנימי, מדיטציה ותובנה. הוא מפעיל תהליכים של הבנה עמוקה אך עלול להוביל לבידוד ולהתנתקות.",
    balancingColorName: "צהוב",
    balancingColorHex: "#FDD835",
  },
  {
    name: "סגול",
    hex: "#8E24AA",
    frequencyTHz: 750,
    wavelengthNm: 400,
    positiveMeaning: "דמיון, רוחניות, טרנספורמציה, רגישות וחזון.",
    negativeMeaning: "בריחה מהמציאות, עודף רגשי, בלבול וחוסר הארקה.",
    effects: "מעורר דמיון, מעודד יצירתיות, יוצר תחושת מסתורין ועומק רגשי.",
    balanceNeed: "עודף סגול עלול ליצור ניתוק מהמציאות, בלבול ותחושת חוסר יציבות.",
    balanceReason: "צהוב מוסיף בהירות, פשטות ותשומת לב מודעת — מחבר דמיון עם מודעות מעשית.",
    scientificExplanation: "סגול הוא אורך הגל הקצר ביותר בספקטרום הנראה (~380–420nm). הוא מכיל את האנרגיה הגבוהה ביותר מבין הצבעים הנראים.",
    psychologicalExplanation: "סגול נקשר לרוחניות, מלכות וטרנספורמציה. הוא מפעיל את הדמיון ומעודד חיבור לתחושות עמוקות — אך עלול לערער יציבות.",
    balancingColorName: "צהוב",
    balancingColorHex: "#FDD835",
  },
];

// Spectrum constants
export const SPECTRUM_MIN_THZ = 300; // infrared
export const SPECTRUM_MAX_THZ = 850; // ultraviolet
export const VISIBLE_MIN_THZ = 400;
export const VISIBLE_MAX_THZ = 789;

// Snap threshold in THz
export const SNAP_THRESHOLD_THZ = 15;
