import { describe, it, expect } from 'vitest';
import { NEWTON_SEVEN, SECTOR_TO_NEWTON, BASE_COLORS, SECTORS } from '@/data/newton';
import { colorPsychologySpectrumData, VISIBLE_MIN_THZ, VISIBLE_MAX_THZ } from '@/data/colorPsychologyData';

const { stops } = colorPsychologySpectrumData;

describe('one source of truth for colour', () => {
  it('psychology stops use exactly the Newton palette', () => {
    expect(stops.map(s => s.key)).toEqual(NEWTON_SEVEN.map(n => n.key));
    for (const s of stops) expect(s.hex).toBe(NEWTON_SEVEN.find(n => n.key === s.key)!.hex);
  });
  it('every balancing colour is one of the seven', () => {
    const hexes = NEWTON_SEVEN.map(n => n.hex);
    for (const s of stops) expect(hexes).toContain(s.balancingColorHex);
  });
  it('the wheel geometry is complete', () => {
    expect(BASE_COLORS).toHaveLength(SECTORS);
    expect(SECTOR_TO_NEWTON).toHaveLength(SECTORS);
    expect(new Set(SECTOR_TO_NEWTON).size).toBe(7);
  });
});

describe('physics in the spectrum data', () => {
  it('frequency and wavelength agree (c = λ·f) within 2%', () => {
    for (const s of stops) {
      const nm = 299_792 / s.frequencyTHz;
      expect(Math.abs(nm - s.wavelengthNm) / s.wavelengthNm).toBeLessThan(0.02);
    }
  });
  it('all stops lie inside visible light, in order', () => {
    const f = stops.map(s => s.frequencyTHz);
    expect(f).toEqual([...f].sort((a, b) => a - b));
    for (const v of f) expect(v >= VISIBLE_MIN_THZ && v <= VISIBLE_MAX_THZ).toBe(true);
  });
});
