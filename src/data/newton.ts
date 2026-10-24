/**
 * Single source of truth for Newton's colours.
 * Every page (wheel, legend, analysis, psychology spectrum) reads from here.
 * Sources: Isaac Newton, Opticks (1704), Book I Part II, the seven-colour circle.
 */

export type NewtonKey = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'indigo' | 'violet';

export interface NewtonColor {
  key: NewtonKey;
  name: string;
  latin: string;
  hex: string;
}

export const NEWTON_SEVEN: NewtonColor[] = [
  { key: 'red', name: 'אדום', latin: 'Red', hex: '#E53935' },
  { key: 'orange', name: 'כתום', latin: 'Orange', hex: '#FB8C00' },
  { key: 'yellow', name: 'צהוב', latin: 'Yellow', hex: '#FDD835' },
  { key: 'green', name: 'ירוק', latin: 'Green', hex: '#43A047' },
  { key: 'blue', name: 'כחול', latin: 'Blue', hex: '#1E88E5' },
  { key: 'indigo', name: 'אינדיגו', latin: 'Indigo', hex: '#3949AB' },
  { key: 'violet', name: 'סגול', latin: 'Violet', hex: '#8E24AA' },
];

export function newtonColor(key: NewtonKey): NewtonColor {
  const c = NEWTON_SEVEN.find(n => n.key === key);
  if (!c) throw new Error(`Unknown Newton colour: ${key}`);
  return c;
}

export const newtonHex = (key: NewtonKey) => newtonColor(key).hex;

/** Geometry of the wheel: 4 rings (value) by 12 sectors (hue). */
export const RINGS = 4;
export const SECTORS = 12;

/** Paint of the 12 hue sectors, starting at red and going clockwise. */
export const BASE_COLORS = [
  '#e2001a', '#f06a00', '#f7df00', '#a9c800', '#35ad27', '#14a7a0',
  '#26a1d0', '#136faf', '#54429a', '#843b97', '#b80a72', '#e60073',
];

/** Which of Newton's seven names each of the 12 sectors belongs to. */
export const SECTOR_TO_NEWTON: NewtonKey[] = [
  'red', 'orange', 'yellow', 'yellow', 'green', 'green',
  'blue', 'blue', 'indigo', 'violet', 'violet', 'red',
];

/** Ring 0 is the palest (mixed most with white), ring 3 is the full hue. */
export const RING_WHITE_RATIO = [0.78, 0.55, 0.28, 0.0];
export const RING_LABELS = ['בהיר מאוד', 'בהיר', 'בינוני', 'רווי'];

export const WARM_SECTORS = [11, 0, 1, 2];
export const COOL_SECTORS = [5, 6, 7, 8, 9];
