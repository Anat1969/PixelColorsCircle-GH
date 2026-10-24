import { describe, it, expect } from 'vitest';
import { proportions } from '@/components/MaterialBoards';

describe('material board proportions (60·30·10)', () => {
  it('handles an empty palette', () => {
    expect(proportions(0)).toEqual([]);
  });
  it.each([1, 2, 3, 4, 7])('always fills 100%% for %i colours', n => {
    const p = proportions(n);
    expect(p).toHaveLength(n);
    expect(p.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 6);
  });
  it('leads with 60 and 30 from three colours up', () => {
    expect(proportions(4).slice(0, 2)).toEqual([60, 30]);
  });
});
