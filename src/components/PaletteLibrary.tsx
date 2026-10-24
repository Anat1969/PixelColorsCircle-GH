import React, { useState } from 'react';
import type { RevealedColor, WheelSnapshot } from '@/hooks/useColorWheel';
import { revealColors } from '@/hooks/useColorWheel';
import { RING_LABELS } from '@/data/newton';
import { readJSON, writeJSON } from '@/lib/storage';
import { copyText, downloadFile } from '@/lib/share';
import { readableOn, type Harmony } from '@/lib/color';
import { encodeSnapshot } from '@/lib/wheelState';
import { toast } from 'sonner';

export interface SavedPalette {
  id: string;
  name: string;
  createdAt: string;
  snapshot: WheelSnapshot;
}

const KEY = 'palettes';

interface Props {
  revealedColors: RevealedColor[];
  harmony: Harmony;
  snapshot: WheelSnapshot;
  saved: boolean;
  onLoad: (s: WheelSnapshot) => void;
}

const cssVars = (colors: RevealedColor[]) =>
  `:root {\n${colors.map((c, i) => `  --palette-${i + 1}: ${c.color.toUpperCase()}; /* ${c.name}, ${RING_LABELS[c.ring]} */`).join('\n')}\n}`;

/** The current palette as an output: copy, export, save, and the saved collection. */
const PaletteLibrary: React.FC<Props> = ({ revealedColors, harmony, snapshot, saved, onLoad }) => {
  const [palettes, setPalettes] = useState<SavedPalette[]>(() => readJSON<SavedPalette[]>(KEY, []));
  const [name, setName] = useState('');
  const empty = revealedColors.length === 0;

  const persist = (next: SavedPalette[]) => {
    setPalettes(next);
    if (!writeJSON(KEY, next)) toast.error('השמירה נכשלה: האחסון בדפדפן מלא או חסום.');
  };

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (empty) return;
    const finalName = name.trim() || `${harmony.name} · ${revealedColors.map(c => c.name).join(' ')}`;
    persist([{ id: crypto.randomUUID?.() ?? String(Date.now()), name: finalName, createdAt: new Date().toISOString(), snapshot }, ...palettes]);
    setName('');
    toast.success(`הפלטה "${finalName}" נשמרה`);
  };

  const remove = (p: SavedPalette) => {
    if (!window.confirm(`למחוק את הפלטה "${p.name}"?`)) return;
    persist(palettes.filter(x => x.id !== p.id));
  };

  const exportJson = () =>
    downloadFile('palette.json', JSON.stringify({
      harmony: harmony.name,
      link: `${location.origin}/wheel?${encodeSnapshot(snapshot)}`,
      colors: revealedColors.map(c => ({ name: c.name, ring: RING_LABELS[c.ring], hex: c.color.toUpperCase() })),
    }, null, 2));

  return (
    <section aria-labelledby="palette-title" className="newton-panel p-5 md:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono mb-2">02 · הפלטה</p>
          <h2 id="palette-title" className="display text-[1.9rem] text-newton-text">{empty ? 'פלטה ריקה' : harmony.name}</h2>
        </div>
        <span className="label-mono" role="status">{saved ? 'נשמר אוטומטית בדפדפן' : 'לא נשמר: האחסון חסום'}</span>
      </div>

      {empty ? (
        <p className="newton-well px-4 py-6 text-center text-newton-muted">הצבעים שתפתחו בגלגל יופיעו כאן, מוכנים להעתקה ולייצוא.</p>
      ) : (
        <div className="flex min-h-[96px] overflow-hidden border border-white/15 shadow-[0_18px_40px_-20px_rgba(0,0,0,.9)]">
          {revealedColors.map((c, i) => (
            <button key={`${c.ring}-${c.sector}-${i}`} type="button"
              onClick={() => copyText(c.color.toUpperCase(), `${c.name} ${c.color.toUpperCase()} הועתק`)}
              className="group flex min-w-0 flex-1 flex-col justify-end p-2 text-start transition-[flex-grow] duration-300 hover:flex-[1.6]"
              style={{ background: c.color, color: readableOn(c.color) }}
              aria-label={`העתקת ${c.name} ${c.color}`}>
              <span className="truncate text-xs font-medium">{c.name}</span>
              <span className="truncate font-mono text-[10px] opacity-80">{c.color.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        <button type="button" className="btn btn-sm" disabled={empty}
          onClick={() => copyText(revealedColors.map(c => c.color.toUpperCase()).join(', '), 'קודי HEX הועתקו')}>העתקת HEX</button>
        <button type="button" className="btn btn-sm" disabled={empty}
          onClick={() => copyText(cssVars(revealedColors), 'משתני CSS הועתקו')}>משתני CSS</button>
        <button type="button" className="btn btn-sm" disabled={empty} onClick={exportJson}>קובץ JSON</button>
      </div>

      <form onSubmit={save} className="mt-5 flex gap-1.5">
        <label htmlFor="palette-name" className="sr-only">שם לפלטה</label>
        <input id="palette-name" className="field min-w-0 flex-1" value={name} onChange={e => setName(e.target.value)}
          placeholder={empty ? 'פתחו תאים כדי לשמור' : 'שם לפלטה (לא חובה)'} disabled={empty} maxLength={60} />
        <button type="submit" className="btn is-primary shrink-0" disabled={empty}>שמירת הפלטה</button>
      </form>

      <h3 className="label-mono mb-2 mt-6">הפלטות שלי · {palettes.length}</h3>
      {palettes.length === 0 ? (
        <p className="text-sm leading-relaxed text-newton-muted">אין עדיין פלטות שמורות. שמירה מוסיפה את הבחירה הנוכחית לכאן, כולל הסיבוב והמצב, כדי לחזור אליה בלחיצה.</p>
      ) : (
        <ul className="space-y-1.5">
          {palettes.map(p => {
            const colors = revealColors(p.snapshot.opened, p.snapshot.rotation);
            return (
              <li key={p.id} className="newton-well flex items-center gap-2 p-1.5">
                <button type="button" onClick={() => { onLoad(p.snapshot); toast.success(`"${p.name}" נטענה לגלגל`); }}
                  className="btn btn-sm min-w-0 flex-1 justify-start gap-3" aria-label={`טעינת הפלטה ${p.name}`}>
                  <span className="flex shrink-0" aria-hidden="true">
                    {colors.map((c, i) => <span key={i} className="h-5 w-4" style={{ background: c.color }} />)}
                  </span>
                  <span className="truncate">{p.name}</span>
                </button>
                <button type="button" className="btn btn-sm is-quiet is-danger shrink-0" onClick={() => remove(p)}
                  aria-label={`מחיקת הפלטה ${p.name}`}>מחיקה</button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default PaletteLibrary;
