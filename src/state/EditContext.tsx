import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readJSON, writeJSON, removeKey } from '@/lib/storage';

export type SaveState = 'idle' | 'saved' | 'error';

interface EditContextValue {
  editing: boolean;
  setEditing: (v: boolean) => void;
  overrides: Record<string, string>;
  text: (id: string, fallback: string) => string;
  setText: (id: string, value: string, fallback: string) => void;
  resetAll: () => void;
  saveState: SaveState;
}

const EditContext = createContext<EditContextValue | null>(null);
const KEY = 'content';
const EDITING_KEY = 'editing';

/**
 * Edit mode and the text overrides it produces.
 * Content files in src/data stay the defaults; edits are stored per text id in localStorage.
 */
export function EditProvider({ children }: { children: ReactNode }) {
  const [editing, setEditingState] = useState<boolean>(() => readJSON(EDITING_KEY, false));
  const [overrides, setOverrides] = useState<Record<string, string>>(() => readJSON(KEY, {}));
  const [saveState, setSaveState] = useState<SaveState>('idle');

  useEffect(() => {
    if (saveState !== 'saved') return;
    const t = window.setTimeout(() => setSaveState('idle'), 2400);
    return () => window.clearTimeout(t);
  }, [saveState]);

  const setEditing = useCallback((v: boolean) => {
    setEditingState(v);
    writeJSON(EDITING_KEY, v);
  }, []);

  const text = useCallback((id: string, fallback: string) => overrides[id] ?? fallback, [overrides]);

  const setText = useCallback((id: string, value: string, fallback: string) => {
    setOverrides(prev => {
      const next = { ...prev };
      const clean = value.replace(/\s+/g, ' ').trim();
      if (!clean || clean === fallback) delete next[id];
      else next[id] = clean;
      setSaveState(writeJSON(KEY, next) ? 'saved' : 'error');
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    setOverrides({});
    removeKey(KEY);
    setSaveState('saved');
  }, []);

  const value = useMemo(
    () => ({ editing, setEditing, overrides, text, setText, resetAll, saveState }),
    [editing, setEditing, overrides, text, setText, resetAll, saveState],
  );
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEdit() {
  const ctx = useContext(EditContext);
  if (!ctx) throw new Error('useEdit must be used inside EditProvider');
  return ctx;
}
