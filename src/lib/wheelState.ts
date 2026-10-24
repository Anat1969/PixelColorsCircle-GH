/**
 * The wheel's working state, serialised to a short URL query so that
 * "copy link" in the A&I menu shares the exact current palette.
 *   ?l=3&m=any&r=2&o=72&c=0.3-2.5
 */
import { RINGS, SECTORS } from '@/data/newton';

export type SelectionMode = 'any' | 'sameRing' | 'sameSector' | 'symmetric';
export const MODES: SelectionMode[] = ['any', 'sameRing', 'sameSector', 'symmetric'];

export interface CellPosition { ring: number; sector: number }

export interface WheelSnapshot {
  limit: number;
  mode: SelectionMode;
  rotation: number;
  mask: number;
  opened: CellPosition[];
}

export const DEFAULT_SNAPSHOT: WheelSnapshot = { limit: 2, mode: 'any', rotation: 0, mask: 72, opened: [] };

const clampInt = (v: string | null, min: number, max: number) => {
  if (v === null || !/^-?\d+$/.test(v)) return null;
  const n = Number(v);
  return n >= min && n <= max ? n : null;
};

export function encodeSnapshot(s: WheelSnapshot): string {
  const p = new URLSearchParams();
  p.set('l', String(s.limit));
  p.set('m', s.mode);
  p.set('r', String(s.rotation));
  p.set('o', String(s.mask));
  if (s.opened.length) p.set('c', s.opened.map(c => `${c.ring}.${c.sector}`).join('-'));
  return p.toString();
}

/** Returns null when the query holds no wheel state; invalid parts fall back to defaults. */
export function decodeSnapshot(query: string): WheelSnapshot | null {
  const p = new URLSearchParams(query);
  if (!['l', 'm', 'r', 'o', 'c'].some(k => p.has(k))) return null;
  const limit = clampInt(p.get('l'), 1, 7) ?? DEFAULT_SNAPSHOT.limit;
  const m = p.get('m') as SelectionMode;
  const mode = MODES.includes(m) ? m : DEFAULT_SNAPSHOT.mode;
  const rotation = clampInt(p.get('r'), 0, SECTORS - 1) ?? 0;
  const mask = clampInt(p.get('o'), 0, 100) ?? DEFAULT_SNAPSHOT.mask;
  const opened: CellPosition[] = [];
  for (const part of (p.get('c') ?? '').split('-')) {
    const [r, s] = part.split('.');
    const ring = clampInt(r ?? null, 0, RINGS - 1);
    const sector = clampInt(s ?? null, 0, SECTORS - 1);
    if (ring === null || sector === null) continue;
    if (opened.some(c => c.ring === ring && c.sector === sector)) continue;
    if (opened.length < limit) opened.push({ ring, sector });
  }
  return { limit, mode, rotation, mask, opened };
}
