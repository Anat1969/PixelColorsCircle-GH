/**
 * Pure colour maths. No UI here.
 * Contrast follows WCAG 2.2, success criteria 1.4.3 and 1.4.6.
 * Harmony names follow Johannes Itten, The Art of Color (1961), on a 12-step wheel.
 */
import { SECTORS } from '@/data/newton';

export interface RGB { r: number; g: number; b: number }

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) clean = clean.split('').map(c => c + c).join('');
  const n = parseInt(clean, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const h = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  return `#${h(r)}${h(g)}${h(b)}`;
}

export function mixWithWhite(hex: string, ratio: number): string {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHex({ r: r + (255 - r) * ratio, g: g + (255 - g) * ratio, b: b + (255 - b) * ratio });
}

/** WCAG relative luminance, 0 (black) to 1 (white). */
export function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** WCAG contrast ratio, 1 to 21. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

export type WcagLevel = 'AAA' | 'AA' | 'AA-large' | 'fail';

export function wcagLevel(ratio: number): WcagLevel {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA-large';
  return 'fail';
}

export const WCAG_LABELS: Record<WcagLevel, string> = {
  AAA: 'AAA · כל טקסט',
  AA: 'AA · טקסט רגיל',
  'AA-large': 'AA · טקסט גדול בלבד',
  fail: 'לא עובר',
};

/** Text colour (near-black or near-white) that reads best on a background. */
export function readableOn(bg: string): string {
  return contrastRatio(bg, '#111214') >= contrastRatio(bg, '#ffffff') ? '#111214' : '#ffffff';
}

/** Shortest distance between two sectors on the wheel, 0 to 6. */
export function sectorDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % SECTORS;
  return Math.min(d, SECTORS - d);
}

export type HarmonyKey =
  | 'none' | 'single' | 'monochrome' | 'complementary' | 'analogous' | 'triad'
  | 'split' | 'square' | 'rectangle' | 'contrast' | 'polychrome';

export interface Harmony {
  key: HarmonyKey;
  name: string;
  description: string;
}

const HARMONIES: Record<HarmonyKey, Omit<Harmony, 'key'>> = {
  none: { name: 'אין בחירה', description: 'פתחו תא אחד לפחות בגלגל.' },
  single: { name: 'גוון יחיד', description: 'תא אחד: נקודת מוקד, עוגן לפלטה.' },
  monochrome: { name: 'מונוכרומטית', description: 'גוון אחד בכמה רמות בהירות. אחידות, שקט ודירוג ברור.' },
  complementary: { name: 'משלימה', description: 'שני גוונים מנוגדים על הגלגל (6 צעדים). ניגוד מרבי, כל צבע מעצים את השני.' },
  analogous: { name: 'אנלוגית', description: 'גוונים שכנים על הגלגל. רציפות, רכות והרמוניה טבעית.' },
  triad: { name: 'משולש', description: 'שלושה גוונים במרחק שווה (4 צעדים). איזון חי בין שלושה מוקדים.' },
  split: { name: 'משלימה מפוצלת', description: 'גוון אחד ושני השכנים של המשלים שלו. ניגוד חזק אבל רך מהמשלימה.' },
  square: { name: 'ריבוע', description: 'ארבעה גוונים במרחק שווה (3 צעדים). עושר מלא, דורש גוון מוביל אחד.' },
  rectangle: { name: 'מלבן (טטרדה)', description: 'שני זוגות משלימים. עשיר ומורכב, מומלץ לבחור זוג דומיננטי.' },
  contrast: { name: 'ניגוד חלקי', description: 'שני גוונים במרחק בינוני. מתח מבוקר בלי קיצוניות.' },
  polychrome: { name: 'רב־גוונית', description: 'פיזור רחב על הגלגל בלי תבנית קלאסית. דורשת היררכיה ברורה בכמויות.' },
};

function harmony(key: HarmonyKey): Harmony {
  return { key, ...HARMONIES[key] };
}

/** Gaps between consecutive selected sectors around the wheel (sum is 12). */
export function sectorGaps(sectors: number[]): number[] {
  const s = [...new Set(sectors.map(v => ((v % SECTORS) + SECTORS) % SECTORS))].sort((a, b) => a - b);
  if (s.length < 2) return [];
  return s.map((v, i) => (i === s.length - 1 ? s[0] + SECTORS - v : s[i + 1] - v));
}

export function detectHarmony(cells: { ring: number; sector: number }[]): Harmony {
  if (cells.length === 0) return harmony('none');
  const unique = [...new Set(cells.map(c => c.sector))];
  if (unique.length === 1) return harmony(cells.length > 1 ? 'monochrome' : 'single');
  const gaps = sectorGaps(unique);
  const sorted = [...gaps].sort((a, b) => a - b).join(',');
  const arc = SECTORS - Math.max(...gaps);

  if (unique.length === 2) {
    const d = sectorDistance(unique[0], unique[1]);
    if (d === 6) return harmony('complementary');
    if (d <= 2) return harmony('analogous');
    return harmony('contrast');
  }
  if (unique.length === 3) {
    if (sorted === '4,4,4') return harmony('triad');
    if (sorted === '2,5,5') return harmony('split');
    if (arc <= 3) return harmony('analogous');
  }
  if (unique.length === 4) {
    if (sorted === '3,3,3,3') return harmony('square');
    if (sorted === '2,2,4,4' && gaps[0] === gaps[2]) return harmony('rectangle');
    if (arc <= 4) return harmony('analogous');
  }
  if (arc <= 4) return harmony('analogous');
  return harmony('polychrome');
}

/* ---------- Value: fifty greys ---------- */

export const GREY_STEPS = 50;

/** CIE L* (perceived lightness, 0 to 100) from sRGB. */
export function lightness(hex: string): number {
  const Y = relativeLuminance(hex);
  return Y <= 216 / 24389 ? (Y * 24389) / 27 : 116 * Math.cbrt(Y) - 16;
}

/** Hex of grey step i (0 black … 49 white), evenly spaced in L*. Same values as --g0…--g49. */
export function greyHex(step: number): string {
  const L = (Math.max(0, Math.min(GREY_STEPS - 1, step)) / (GREY_STEPS - 1)) * 100;
  const Y = L > 8 ? Math.pow((L + 16) / 116, 3) : (L * 27) / 24389;
  const s = Y <= 0.0031308 ? 12.92 * Y : 1.055 * Math.pow(Y, 1 / 2.4) - 0.055;
  const v = Math.round(Math.max(0, Math.min(1, s)) * 255);
  return rgbToHex({ r: v, g: v, b: v });
}

/** The grey step with the same perceived lightness as a colour: its value in black and white. */
export function greyStep(hex: string): number {
  return Math.round((lightness(hex) / 100) * (GREY_STEPS - 1));
}
