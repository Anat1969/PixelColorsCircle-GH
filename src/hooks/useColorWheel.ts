import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  RINGS, SECTORS, BASE_COLORS, NEWTON_SEVEN, SECTOR_TO_NEWTON, RING_WHITE_RATIO,
  WARM_SECTORS, COOL_SECTORS, newtonColor, type NewtonKey,
} from '@/data/newton';
import { mixWithWhite, detectHarmony, type Harmony } from '@/lib/color';
import { readJSON, writeJSON } from '@/lib/storage';
import {
  DEFAULT_SNAPSHOT, decodeSnapshot, encodeSnapshot,
  type CellPosition, type SelectionMode, type WheelSnapshot,
} from '@/lib/wheelState';

export type { CellPosition, SelectionMode, WheelSnapshot };
export { RINGS, SECTORS, NEWTON_SEVEN };

export interface RevealedColor {
  ring: number;
  sector: number;
  baseSector: number;
  color: string;
  name: string;
  newtonKey: NewtonKey;
}

export interface AnalysisResult {
  logical: string;
  psych: string;
  temperature: 'חם' | 'קר' | 'מאוזן' | null;
  contrast: 'קרבה' | 'ניגוד בינוני' | 'ניגוד גבוה' | null;
  maxGap: number;
  warm: number;
  cool: number;
}

export const OUTER_RADIUS = 400;
export const INNER_GAP = 48;
export const RING_THICKNESS = (OUTER_RADIUS - INNER_GAP) / RINGS;
export const CENTER = 450;
export const ROTATION_STEP_DEG = 360 / SECTORS;

export const MODE_LABELS: Record<SelectionMode, string> = {
  any: 'בחירה חופשית',
  sameRing: 'אותה טבעת',
  sameSector: 'אותו פלח',
  symmetric: 'סימטריה',
};

export const MODE_DESCRIPTIONS: Record<SelectionMode, string> = {
  any: 'בחירה חופשית מאפשרת לפתוח כל תא ללא מגבלה צורנית.',
  sameRing: 'אותה טבעת: כל הבחירות החדשות נפתחות רק באותה רמת רוויה/בהירות.',
  sameSector: 'אותו פלח: כל הבחירות נצמדות לאותו גוון לאורך ארבע הטבעות.',
  symmetric: 'סימטריה: לאחר הבחירה הראשונה, נפתחות רק עמדות במרחקים שווי־ערך על הגלגל.',
};

// --- Pure utility functions ---

export function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * Math.PI / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function ringSectorPath(cx: number, cy: number, innerR: number, outerR: number, startDeg: number, endDeg: number) {
  const p1 = polarToCartesian(cx, cy, outerR, startDeg);
  const p2 = polarToCartesian(cx, cy, outerR, endDeg);
  const p3 = polarToCartesian(cx, cy, innerR, endDeg);
  const p4 = polarToCartesian(cx, cy, innerR, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    'Z'
  ].join(' ');
}

export function ringColor(base: string, ringIndex: number) {
  return mixWithWhite(base, RING_WHITE_RATIO[ringIndex]);
}

export function sectorToBaseColor(index: number) {
  return BASE_COLORS[index % BASE_COLORS.length];
}

export function sectorToNewtonKey(index: number): NewtonKey {
  return SECTOR_TO_NEWTON[((index % SECTORS) + SECTORS) % SECTORS];
}

export function sectorToNewtonName(index: number) {
  return newtonColor(sectorToNewtonKey(index)).name;
}

export function selectionStructureName(count: number) {
  const map: Record<number, string> = {
    1: 'מוקד', 2: 'ניגודיות', 3: 'דירוג', 4: 'סדר',
    5: 'תנועה', 6: 'המשכיות', 7: 'מחזוריות'
  };
  return map[count] || 'קומפוזיציה';
}

export function decompositionText(count: number) {
  const map: Record<number, string> = {
    1: 'בחירה בודדת: מוקד, מקור, עוגן.',
    2: '2 בחירות: ניגודיות.',
    3: '3 בחירות: דירוג, וגם ניתוח 2+1.',
    4: '4 בחירות: סדר, וגם 3+1, 2+2.',
    5: '5 בחירות: תנועה, וגם 4+1, 3+2.',
    6: '6 בחירות: המשכיות, וגם 5+1, 4+2, 3+3.',
    7: '7 בחירות: מחזוריות, כל השילובים פתוחים לניתוח.',
  };
  return map[count] || 'המערכת מפרקת את השילוב לתת־מבנים לפי מספר הבחירות.';
}

export function analyzePalette(items: RevealedColor[]): AnalysisResult {
  if (!items.length) {
    return {
      logical: 'בחרי לפחות תא אחד כדי לזקק כיוון כרומטי.',
      psych: 'ללא חשיפה אין עדיין אקלים רגשי־מרחבי.',
      temperature: null, contrast: null, maxGap: 0, warm: 0, cool: 0,
    };
  }
  const sectorsList = items.map(i => i.sector).sort((a, b) => a - b);
  const uniqueNames = [...new Set(items.map(i => i.name))];
  const warm = items.filter(i => WARM_SECTORS.includes(i.sector)).length;
  const cool = items.filter(i => COOL_SECTORS.includes(i.sector)).length;
  const highSaturation = items.filter(i => i.ring === 3).length;
  const pale = items.filter(i => i.ring === 0).length;

  let contrast: AnalysisResult['contrast'] = 'קרבה';
  let maxGap = 0;
  for (let i = 0; i < sectorsList.length; i++) {
    for (let j = i + 1; j < sectorsList.length; j++) {
      const d = Math.abs(sectorsList[i] - sectorsList[j]);
      maxGap = Math.max(maxGap, Math.min(d, SECTORS - d));
    }
  }
  if (maxGap >= 5) contrast = 'ניגוד גבוה';
  else if (maxGap >= 3) contrast = 'ניגוד בינוני';

  const temperature = warm > cool ? 'חם' : cool > warm ? 'קר' : 'מאוזן';
  const valueState = highSaturation > pale ? 'רוויה מודגשת' : pale > highSaturation ? 'מעודן ובהיר' : 'מאוזן בעוצמה';

  const logical = `המבנה מציג ${contrast}, עם טמפרטורה ${temperature} ותחושה של ${valueState}. הגוונים הפעילים: ${uniqueNames.join(' · ')}. זהו מערך שמתווה יחסים בין קרבה, מרחק, קצב ורמת עוצמה בין הטבעות.`;

  let psych = 'נוצר אקלים ניטרלי־מרוכז.';
  if (temperature === 'חם' && contrast === 'ניגוד גבוה') psych = 'השילוב מייצר דרמה, נוכחות ומתח חיובי בחלל. מתאים לנקודות מוקד, כניסות ואזורים ציבוריים דינמיים.';
  else if (temperature === 'קר' && contrast !== 'ניגוד גבוה') psych = 'השילוב יוצר רוגע, התבוננות והתרחבות שקטה. מתאים לחללי עבודה, שהייה, ריפוי או רקע מאוזן.';
  else if (temperature === 'מאוזן') psych = 'השילוב מחזיק מתח מבוקר בין חום לקור ולכן יוצר תחושת עומק והרמוניה מורכבת. מתאים לחללים שרוצים גם רוך וגם דיוק.';
  else if (valueState === 'רוויה מודגשת') psych = 'נוכחות כרומטית חזקה מטעינה את החלל באנרגיה, תנועה ובולטות.';
  else if (valueState === 'מעודן ובהיר') psych = 'הצבעוניות הרכה מרחיבה את החלל ומביאה קלילות, אוויר ואור.';

  return { logical, psych, temperature, contrast, maxGap, warm, cool };
}

/** Colour actually visible under an opened mask cell, given the mask's rotation. */
export function revealColors(opened: CellPosition[], rotationOffset: number): RevealedColor[] {
  return opened.map(({ ring, sector }) => {
    const actualSector = ((sector + rotationOffset) % SECTORS + SECTORS) % SECTORS;
    const key = sectorToNewtonKey(actualSector);
    return {
      ring, sector: actualSector, baseSector: sector,
      color: ringColor(sectorToBaseColor(actualSector), ring),
      name: newtonColor(key).name, newtonKey: key,
    };
  });
}

const STORAGE_KEY = 'wheel';

function initialSnapshot(): WheelSnapshot {
  if (typeof window !== 'undefined') {
    const fromUrl = decodeSnapshot(window.location.search);
    if (fromUrl) return fromUrl;
  }
  return { ...DEFAULT_SNAPSHOT, ...readJSON<Partial<WheelSnapshot>>(STORAGE_KEY, {}) };
}

// --- Hook ---

export function useColorWheel(options: { syncUrl?: boolean } = {}) {
  const { syncUrl = true } = options;
  const [initial] = useState(initialSnapshot);
  const [selectionLimit, setSelectionLimit] = useState(initial.limit);
  const [rotationOffset, setRotationOffset] = useState(initial.rotation);
  const [mode, setModeState] = useState<SelectionMode>(initial.mode);
  const [opened, setOpened] = useState<CellPosition[]>(initial.opened);
  const [anchor, setAnchor] = useState<CellPosition | null>(initial.opened[0] ?? null);
  const [history, setHistory] = useState<CellPosition[][]>([]);
  const [maskOpacity, setMaskOpacity] = useState(initial.mask);
  const [saved, setSaved] = useState(true);

  const snapshot = useMemo<WheelSnapshot>(
    () => ({ limit: selectionLimit, mode, rotation: rotationOffset, mask: maskOpacity, opened }),
    [selectionLimit, mode, rotationOffset, maskOpacity, opened],
  );

  // Autosave and keep the address bar in sync, so a copied link reproduces the palette.
  useEffect(() => {
    setSaved(writeJSON(STORAGE_KEY, snapshot));
    if (syncUrl && typeof window !== 'undefined') {
      const url = `${window.location.pathname}?${encodeSnapshot(snapshot)}${window.location.hash}`;
      window.history.replaceState(window.history.state, '', url);
    }
  }, [snapshot, syncUrl]);

  const isOpened = useCallback((ring: number, sector: number) => {
    return opened.some(c => c.ring === ring && c.sector === sector);
  }, [opened]);

  const canSelectByMode = useCallback((ring: number, sector: number) => {
    if (mode === 'any' || opened.length === 0) return true;
    const first = anchor || opened[0];
    if (!first) return true;
    if (mode === 'sameRing') return ring === first.ring;
    if (mode === 'sameSector') return sector === first.sector;
    if (mode === 'symmetric') {
      const diff = Math.abs(sector - first.sector);
      const normalized = Math.min(diff, SECTORS - diff);
      if (opened.length === 1) return true;
      const existingDiffs = opened.slice(1).map(c => {
        const d = Math.abs(c.sector - first.sector);
        return Math.min(d, SECTORS - d);
      });
      return !existingDiffs.includes(normalized);
    }
    return true;
  }, [mode, opened, anchor]);

  const onCellClick = useCallback((ring: number, sector: number) => {
    const idx = opened.findIndex(c => c.ring === ring && c.sector === sector);
    if (idx >= 0) {
      setHistory(prev => [...prev, opened]);
      const next = [...opened];
      next.splice(idx, 1);
      setOpened(next);
      if (next.length === 0) setAnchor(null);
      return;
    }
    if (opened.length >= selectionLimit) return;
    if (!canSelectByMode(ring, sector)) return;
    setHistory(prev => [...prev, opened]);
    const next = [...opened, { ring, sector }];
    setOpened(next);
    if (!anchor) setAnchor({ ring, sector });
  }, [opened, selectionLimit, canSelectByMode, anchor]);

  const rotateForward = useCallback(() => {
    setRotationOffset(prev => (prev + 1) % SECTORS);
  }, []);

  const rotateBack = useCallback(() => {
    setRotationOffset(prev => (prev - 1 + SECTORS) % SECTORS);
  }, []);

  const resetHoles = useCallback(() => {
    setHistory(prev => [...prev, opened]);
    setOpened([]);
    setAnchor(null);
  }, [opened]);

  const newPattern = useCallback(() => {
    setHistory(prev => [...prev, opened]);
    setOpened([]);
    setAnchor(null);
    setRotationOffset(0);
  }, [opened]);

  const setMode = useCallback((m: SelectionMode) => {
    setHistory(prev => [...prev, opened]);
    setModeState(m);
    setOpened([]);
    setAnchor(null);
  }, [opened]);

  const changeLimit = useCallback((limit: number) => {
    setSelectionLimit(limit);
    setOpened(prev => prev.length > limit ? prev.slice(0, limit) : prev);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setOpened(prev);
    if (prev.length === 0) setAnchor(null);
    else setAnchor(prev[0]);
  }, [history]);

  /** Restore a saved palette in one step (undoable). */
  const load = useCallback((s: WheelSnapshot) => {
    setHistory(prev => [...prev, opened]);
    setSelectionLimit(s.limit);
    setModeState(s.mode);
    setRotationOffset(s.rotation);
    setMaskOpacity(s.mask);
    setOpened(s.opened.slice(0, s.limit));
    setAnchor(s.opened[0] ?? null);
  }, [opened]);

  const revealedColors = useMemo(() => revealColors(opened, rotationOffset), [opened, rotationOffset]);
  const analysis = useMemo(() => analyzePalette(revealedColors), [revealedColors]);
  const harmony = useMemo<Harmony>(() => detectHarmony(revealedColors), [revealedColors]);

  const structureName = useMemo(() => selectionStructureName(selectionLimit), [selectionLimit]);
  const decomposition = useMemo(() => decompositionText(selectionLimit), [selectionLimit]);

  return {
    selectionLimit, mode, opened, rotationOffset, revealedColors, analysis, harmony,
    structureName, decomposition, history, maskOpacity, snapshot, saved,
    isOpened, canSelectByMode, onCellClick,
    rotateForward, rotateBack, resetHoles, newPattern,
    setMode, changeLimit, undo, setMaskOpacity, load,
  };
}
