import { describe, it, expect } from 'vitest';
import { contrastRatio, wcagLevel, detectHarmony, sectorGaps, readableOn, mixWithWhite, greyHex, greyStep } from '@/lib/color';

const cells = (...sectors: number[]) => sectors.map(sector => ({ ring: 3, sector }));

describe('WCAG contrast', () => {
  it('matches the reference values', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBe(1);
  });
  it('is symmetric', () => {
    expect(contrastRatio('#E53935', '#1E88E5')).toBeCloseTo(contrastRatio('#1E88E5', '#E53935'), 10);
  });
  it('grades by the 1.4.3 / 1.4.6 thresholds', () => {
    expect(wcagLevel(7)).toBe('AAA');
    expect(wcagLevel(4.5)).toBe('AA');
    expect(wcagLevel(3)).toBe('AA-large');
    expect(wcagLevel(2.99)).toBe('fail');
  });
  it('picks a readable text colour', () => {
    expect(readableOn('#FDD835')).toBe('#111214');
    expect(readableOn('#3949AB')).toBe('#ffffff');
  });
  it('mixes toward white', () => {
    expect(mixWithWhite('#000000', 1)).toBe('#ffffff');
    expect(mixWithWhite('#123456', 0)).toBe('#123456');
  });
});

describe('Itten harmony on a 12-step wheel', () => {
  it.each([
    [[], 'none'],
    [[0], 'single'],
    [[0, 6], 'complementary'],
    [[3, 9], 'complementary'],
    [[0, 1], 'analogous'],
    [[0, 1, 2], 'analogous'],
    [[11, 0, 1], 'analogous'],
    [[0, 4, 8], 'triad'],
    [[0, 5, 7], 'split'],
    [[0, 3, 6, 9], 'square'],
    [[0, 2, 6, 8], 'rectangle'],
    [[0, 3], 'contrast'],
    [[0, 2, 5, 7, 9], 'polychrome'],
  ])('%j → %s', (sectors, key) => {
    expect(detectHarmony(cells(...sectors)).key).toBe(key);
  });

  it('treats one hue in several rings as monochrome', () => {
    expect(detectHarmony([{ ring: 0, sector: 4 }, { ring: 3, sector: 4 }]).key).toBe('monochrome');
  });

  it('computes gaps that always sum to 12', () => {
    expect(sectorGaps([0, 5, 7])).toEqual([5, 2, 5]);
    expect(sectorGaps([10, 1]).reduce((a, b) => a + b, 0)).toBe(12);
  });
});

describe('fifty greys', () => {
  it('runs from black to white', () => {
    expect(greyHex(0)).toBe('#000000');
    expect(greyHex(49)).toBe('#ffffff');
  });
  it('matches the CSS tokens', () => {
    expect(greyHex(3)).toBe('#141414');
    expect(greyHex(36)).toBe('#b4b4b4');
  });
  it('maps every grey back to its own step', () => {
    for (let i = 0; i < 50; i++) expect(greyStep(greyHex(i))).toBe(i);
  });
  it('puts yellow far lighter than blue', () => {
    expect(greyStep('#FDD835')).toBeGreaterThan(greyStep('#1E88E5') + 10);
  });
});
