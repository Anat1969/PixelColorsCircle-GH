import React from 'react';
import { Slider } from '@/components/ui/slider';
import { MODE_DESCRIPTIONS, MODE_LABELS, type SelectionMode } from '@/hooks/useColorWheel';
import { MODES } from '@/lib/wheelState';
import { NEWTON_SEVEN } from '@/data/newton';

interface WheelControlsProps {
  selectionLimit: number;
  mode: SelectionMode;
  openedCount: number;
  structureName: string;
  historyLength: number;
  maskOpacity: number;
  rotationOffset: number;
  onChangeLimit: (n: number) => void;
  onSetMode: (m: SelectionMode) => void;
  onRotateForward: () => void;
  onRotateBack: () => void;
  onReset: () => void;
  onNewPattern: () => void;
  onUndo: () => void;
  onMaskOpacityChange: (v: number) => void;
}

const WheelControls: React.FC<WheelControlsProps> = ({
  selectionLimit, mode, openedCount, structureName, historyLength, maskOpacity, rotationOffset,
  onChangeLimit, onSetMode, onRotateForward, onRotateBack, onReset, onNewPattern, onUndo, onMaskOpacityChange,
}) => {
  const full = openedCount >= selectionLimit;

  return (
    <aside aria-label="בקרת הגלגל" className="newton-panel p-5 md:p-6 lg:sticky lg:top-[96px] lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:max-h-[calc(100vh-112px)] lg:self-start lg:overflow-y-auto">
      <p className="label-mono mb-3">01 · שליטה</p>
      <h2 className="display mb-3 text-[1.9rem] text-newton-text">הגדרת החקירה</h2>
      <p className="mb-2 leading-relaxed text-newton-muted">
        שכבה תחתונה קבועה של צבעי ניוטון, ושכבה עליונה של מסכה שחורה חצי־שקופה.
        כל תא לחיץ: פתיחה חושפת צבע, וסיבוב שומר על התבנית ומחליף את הקומבינציה.
      </p>

      <Section label="מספר בחירות מותר" id="limit">
        <div role="group" aria-labelledby="limit" className="grid grid-cols-7 gap-1.5">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button key={n} type="button" onClick={() => onChangeLimit(n)} aria-pressed={n === selectionLimit}
              aria-label={`${n} בחירות`} className="btn min-w-0 px-0 font-mono">
              {n}
            </button>
          ))}
        </div>
        <Hint>שם המבנה: <strong className="font-medium text-newton-text">{structureName}</strong>. לאחר שמגיעים למכסה, אפשר לסובב, לאפס או לבחור מצב עבודה חדש.</Hint>
      </Section>

      <Section label="אפשרות לבחירה חדשה" id="mode">
        <div role="group" aria-labelledby="mode" className="grid grid-cols-2 gap-1.5">
          {MODES.map(m => (
            <button key={m} type="button" onClick={() => onSetMode(m)} aria-pressed={mode === m} className="btn">
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>
        <Hint>{MODE_DESCRIPTIONS[mode]} החלפת מצב מנקה את הבחירה.</Hint>
      </Section>

      <Section label="פעולות" id="actions">
        <div className="grid grid-cols-2 gap-1.5">
          <button type="button" className="btn is-primary" onClick={onRotateForward}>סיבוב עם השעון</button>
          <button type="button" className="btn" onClick={onRotateBack}>סיבוב נגד השעון</button>
          <button type="button" className="btn" onClick={onReset} disabled={openedCount === 0}>איפוס חורים</button>
          <button type="button" className="btn" onClick={onNewPattern} disabled={openedCount === 0 && rotationOffset === 0}>בחירה חדשה</button>
          <button type="button" className="btn col-span-2" onClick={onUndo} disabled={historyLength === 0}>ביטול פעולה אחרונה</button>
        </div>
        <Hint>סיבוב מזיז את המסכה בפלח אחד (30°). איפוס מנקה חורים, ובחירה חדשה מחזירה גם את הסיבוב לאפס.</Hint>
      </Section>

      <Section label={`שקיפות המסכה · ${maskOpacity}%`} id="mask">
        <Slider value={[maskOpacity]} onValueChange={([v]) => onMaskOpacityChange(v)}
          min={0} max={100} step={1} label="שקיפות המסכה" valueText={`${maskOpacity} אחוז`} className="w-full py-2" />
        <Hint>הורדת השקיפות חושפת את הצבעים מתחת למסכה ומאפשרת לראות ניגודיות בין הבחירות.</Hint>
      </Section>

      <Section label="מצב נוכחי" id="status">
        <div className="newton-well flex items-baseline justify-between gap-3 px-4 py-3" role="status" aria-live="polite">
          <span>נבחרו <strong className="font-mono font-medium">{openedCount}</strong> מתוך <strong className="font-mono font-medium">{selectionLimit}</strong></span>
          <span className="label-mono">{full ? 'המכסה מלאה' : `נותרו ${selectionLimit - openedCount}`} · סיבוב {rotationOffset * 30}°</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1" aria-label="מקרא: שבעת צבעי ניוטון">
          {NEWTON_SEVEN.map(c => (
            <div key={c.key} className="min-w-0 text-center">
              <span className="swatch block h-5 w-full" style={{ background: c.hex }} />
              <span className="mt-1 block truncate text-[11px] text-newton-muted">{c.name}</span>
            </div>
          ))}
        </div>
        <Hint>מקלדת: Tab לגלגל, חצים ימינה ושמאלה בין גוונים, למעלה ולמטה בין טבעות, Enter לפתיחה.</Hint>
      </Section>
    </aside>
  );
};

function Section({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/[0.08] py-4 first-of-type:border-t-0">
      <h3 id={id} className="label-mono mb-2.5">{label}</h3>
      {children}
    </div>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-2.5 text-sm leading-relaxed text-newton-muted">{children}</p>;
}

export default React.memo(WheelControls);
