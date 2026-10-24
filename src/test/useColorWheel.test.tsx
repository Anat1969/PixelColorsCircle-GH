import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useColorWheel, revealColors } from '@/hooks/useColorWheel';

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/wheel');
});

describe('useColorWheel (mask logic is final)', () => {
  it('opens cells up to the limit and toggles them closed', () => {
    const { result } = renderHook(() => useColorWheel());
    act(() => result.current.onCellClick(3, 0));
    act(() => result.current.onCellClick(3, 6));
    act(() => result.current.onCellClick(3, 3));
    expect(result.current.opened).toEqual([{ ring: 3, sector: 0 }, { ring: 3, sector: 6 }]);
    expect(result.current.harmony.key).toBe('complementary');
    act(() => result.current.onCellClick(3, 0));
    expect(result.current.opened).toEqual([{ ring: 3, sector: 6 }]);
  });

  it('same-ring mode only allows the anchor ring', () => {
    const { result } = renderHook(() => useColorWheel());
    act(() => result.current.changeLimit(3));
    act(() => result.current.setMode('sameRing'));
    act(() => result.current.onCellClick(1, 2));
    expect(result.current.canSelectByMode(2, 5)).toBe(false);
    expect(result.current.canSelectByMode(1, 5)).toBe(true);
  });

  it('undo restores the previous selection', () => {
    const { result } = renderHook(() => useColorWheel());
    act(() => result.current.onCellClick(0, 1));
    act(() => result.current.resetHoles());
    expect(result.current.opened).toHaveLength(0);
    act(() => result.current.undo());
    expect(result.current.opened).toEqual([{ ring: 0, sector: 1 }]);
  });

  it('rotation changes the revealed hue, not the pattern', () => {
    expect(revealColors([{ ring: 3, sector: 0 }], 0)[0].newtonKey).toBe('red');
    expect(revealColors([{ ring: 3, sector: 0 }], 6)[0].newtonKey).toBe('blue');
    expect(revealColors([{ ring: 3, sector: 0 }], 6)[0].baseSector).toBe(0);
  });

  it('writes the state to the address bar and to storage, and restores it', () => {
    const { result, unmount } = renderHook(() => useColorWheel());
    act(() => result.current.onCellClick(2, 4));
    act(() => result.current.rotateForward());
    expect(window.location.search).toContain('c=2.4');
    expect(window.location.search).toContain('r=1');
    unmount();
    window.history.replaceState(null, '', '/wheel');
    const again = renderHook(() => useColorWheel());
    expect(again.result.current.opened).toEqual([{ ring: 2, sector: 4 }]);
    expect(again.result.current.rotationOffset).toBe(1);
  });
});
