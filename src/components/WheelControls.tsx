import React from 'react';
import { RotateCcw, RotateCw, RefreshCw, Sparkles, Undo2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import {
  NEWTON_SEVEN, MODE_DESCRIPTIONS, type SelectionMode,
} from '@/hooks/useColorWheel';

interface WheelControlsProps {
  selectionLimit: number;
  mode: SelectionMode;
  openedCount: number;
  structureName: string;
  historyLength: number;
  maskOpacity: number;
  onChangeLimit: (n: number) => void;
  onSetMode: (m: SelectionMode) => void;
  onRotateForward: () => void;
  onRotateBack: () => void;
  onReset: () => void;
  onNewPattern: () => void;
  onUndo: () => void;
  onMaskOpacityChange: (v: number) => void;
}

const modes: { key: SelectionMode; label: string }[] = [
  { key: 'any', label: 'בחירה חופשית' },
  { key: 'sameRing', label: 'אותה טבעת' },
  { key: 'sameSector', label: 'אותו פלח' },
  { key: 'symmetric', label: 'סימטריה' },
];

const WheelControls: React.FC<WheelControlsProps> = ({
  selectionLimit, mode, openedCount, structureName, historyLength,
  onChangeLimit, onSetMode, onRotateForward, onRotateBack, onReset, onNewPattern, onUndo,
}) => {
  return (
    <aside className="newton-panel p-5 lg:sticky lg:top-5 space-y-0">
      <h1 className="text-[1.9rem] leading-tight font-bold m-0 mb-2 text-newton-text">
        גלגל הצבעים של ניוטון
      </h1>
      <p className="text-newton-muted leading-relaxed text-[0.98rem] mb-5">
        שכבה תחתונה קבועה של צבעי ניוטון, ושכבה עליונה דינמית של מסכה שחורה חצי־שקופה.
        כל תא לחיץ: פתיחה חושפת צבע, סיבוב שומר על התבנית ומחליף את הקומבינציה.
      </p>

      {/* Selection limit */}
      <Section label="מספר בחירות מותר">
        <div className="grid grid-cols-4 gap-2.5">
          {[1, 2, 3, 4, 5, 6, 7].map(n => (
            <button key={n}
              onClick={() => onChangeLimit(n)}
              className={`newton-chip ${n === selectionLimit ? 'active' : ''}`}>
              {n}
            </button>
          ))}
        </div>
        <p className="text-sm text-newton-muted leading-relaxed mt-2.5">
          לאחר שמגיעים למכסה, אפשר לסובב, לאפס, או לבחור מצב עבודה חדש.
        </p>
      </Section>

      {/* Mode selection */}
      <Section label="אפשרות לבחירה חדשה">
        <div className="grid grid-cols-2 gap-2.5">
          {modes.map(m => (
            <button key={m.key}
              onClick={() => onSetMode(m.key)}
              className={`newton-mode-btn ${mode === m.key ? 'active' : ''}`}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-newton-muted leading-relaxed mt-2.5">
          {MODE_DESCRIPTIONS[mode]}
        </p>
      </Section>

      {/* Actions */}
      <Section label="פעולות">
        <div className="grid grid-cols-2 gap-2.5">
          <button className="newton-action-btn primary" onClick={onRotateForward}>
            <RotateCw className="inline w-4 h-4 ml-1" /> סיבוב +1
          </button>
          <button className="newton-action-btn" onClick={onRotateBack}>
            <RotateCcw className="inline w-4 h-4 ml-1" /> סיבוב -1
          </button>
          <button className="newton-action-btn" onClick={onReset}>
            <RefreshCw className="inline w-4 h-4 ml-1" /> איפוס חורים
          </button>
          <button className="newton-action-btn" onClick={onNewPattern}>
            <Sparkles className="inline w-4 h-4 ml-1" /> בחירה חדשה
          </button>
        </div>
        {historyLength > 0 && (
          <button className="newton-action-btn mt-2.5 w-full" onClick={onUndo}>
            <Undo2 className="inline w-4 h-4 ml-1" /> ביטול פעולה אחרונה
          </button>
        )}
      </Section>

      {/* Status */}
      <Section label="">
        <div className="space-y-2.5">
          <div className="newton-status-card">
            <strong className="block mb-1">מצב נוכחי</strong>
            <span>נבחרו {openedCount} מתוך {selectionLimit} תאים.</span>
          </div>
          <div className="newton-status-card">
            <strong className="block mb-1">שם המבנה</strong>
            <span>{structureName}</span>
          </div>
        </div>
      </Section>

      {/* Newton legend */}
      <Section label="שבעת צבעי ניוטון">
        <div className="grid grid-cols-2 gap-2">
          {NEWTON_SEVEN.map(item => (
            <div key={item.name} className="flex items-center gap-2.5 text-sm text-newton-muted p-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="w-[18px] h-[18px] rounded-full flex-shrink-0 border border-white/25"
                style={{ background: item.color }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </Section>
    </aside>
  );
};

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-t border-white/[0.08] first:border-t-0">
      {label && <label className="block text-sm text-newton-muted mb-2.5">{label}</label>}
      {children}
    </div>
  );
}

export default React.memo(WheelControls);
