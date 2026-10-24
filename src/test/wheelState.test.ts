import { describe, it, expect } from 'vitest';
import { decodeSnapshot, encodeSnapshot, DEFAULT_SNAPSHOT } from '@/lib/wheelState';

describe('wheel state in the URL', () => {
  it('round-trips', () => {
    const s = { limit: 3, mode: 'symmetric' as const, rotation: 5, mask: 40, opened: [{ ring: 0, sector: 3 }, { ring: 3, sector: 11 }] };
    expect(decodeSnapshot(encodeSnapshot(s))).toEqual(s);
  });
  it('returns null when the query has no wheel state', () => {
    expect(decodeSnapshot('?stop=red')).toBeNull();
    expect(decodeSnapshot('')).toBeNull();
  });
  it('rejects out-of-range and malformed values', () => {
    const s = decodeSnapshot('l=99&m=evil&r=40&o=-3&c=9.9-1.2-x.y-1.2');
    expect(s).toEqual({ ...DEFAULT_SNAPSHOT, opened: [{ ring: 1, sector: 2 }] });
  });
  it('never opens more cells than the limit', () => {
    expect(decodeSnapshot('l=1&c=0.0-1.1-2.2')?.opened).toHaveLength(1);
  });
});
