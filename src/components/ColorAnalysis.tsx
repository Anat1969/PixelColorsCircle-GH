import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { RevealedColor, AnalysisResult } from '@/hooks/useColorWheel';
import type { Harmony } from '@/lib/color';
import { contrastRatio, wcagLevel, WCAG_LABELS, readableOn, sectorDistance, type WcagLevel } from '@/lib/color';
import { RING_LABELS } from '@/data/newton';
import { copyText } from '@/lib/share';

interface ColorAnalysisProps {
  analysis: AnalysisResult;
  harmony: Harmony;
  revealedColors: RevealedColor[];
  decomposition: string;
}

const LEVEL_TONE: Record<WcagLevel, string> = {
  AAA: 'text-newton-ok',
  AA: 'text-newton-ok',
  'AA-large': 'text-newton-warn',
  fail: 'text-newton-fail',
};

const WHITE = '#FFFFFF';
const INK = '#111214';

/**
 * Report in transparent layers:
 * 1. Measured in code (harmony, temperature, distance, value, WCAG contrast).
 * 2. Rule-based interpretation (fixed rules, not a model).
 * 3. Limits of the tool.
 */
const ColorAnalysis: React.FC<ColorAnalysisProps> = ({ analysis, harmony, revealedColors, decomposition }) => {
  const pairs = useMemo(() => {
    const out: { a: RevealedColor; b: RevealedColor; ratio: number }[] = [];
    for (let i = 0; i < revealedColors.length; i++)
      for (let j = i + 1; j < revealedColors.length; j++)
        out.push({ a: revealedColors[i], b: revealedColors[j], ratio: contrastRatio(revealedColors[i].color, revealedColors[j].color) });
    return out.sort((x, y) => y.ratio - x.ratio);
  }, [revealedColors]);

  const ringCounts = RING_LABELS.map((label, ring) => ({ label, n: revealedColors.filter(c => c.ring === ring).length }));
  const empty = revealedColors.length === 0;

  return (
    <section aria-labelledby="report-title" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono mb-2">03 · דוח הפלטה</p>
          <h2 id="report-title" className="display text-[1.9rem] text-newton-text">מה הבחירה אומרת</h2>
        </div>
        <p className="label-mono">שכבה 1 חישוב · שכבה 2 פרשנות · שכבה 3 מגבלות</p>
      </div>

      {empty ? (
        <div className="newton-panel p-6 md:p-8">
          <p className="text-lg text-newton-text">עוד לא נפתח אף תא.</p>
          <p className="mt-2 max-w-[60ch] leading-relaxed text-newton-muted">
            לחצו על תא בגלגל (או Tab ואז Enter). הדוח יחשב מיד את סוג ההרמוניה, הטמפרטורה, המרחק בין הגוונים
            והניגודיות לפי WCAG, ויציע פרשנות למרחב.
          </p>
        </div>
      ) : (
        <>
          {/* Layer 1 */}
          <div className="newton-panel p-5 md:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-medium text-newton-text">שכבה 1 · מה חושב בקוד</h3>
              <span className="label-mono">חישוב דטרמיניסטי, אותה בחירה תמיד אותה תוצאה</span>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <Metric title="הרמוניה (איטן, 1961)" value={harmony.name} note={harmony.description} />
              <Metric title="טמפרטורה" value={analysis.temperature ?? '—'}
                note={`${analysis.warm} חמים · ${analysis.cool} קרים · ${revealedColors.length - analysis.warm - analysis.cool} ביניים`} />
              <Metric title="מרחק גוונים מרבי" value={`${analysis.maxGap} פלחים · ${analysis.maxGap * 30}°`}
                note={`${analysis.contrast}. 6 פלחים הם משלים מלא.`} />
            </div>

            <div className="mt-3 grid grid-cols-4 gap-1.5" aria-label="פיזור לפי טבעות בהירות">
              {ringCounts.map(r => (
                <div key={r.label} className="newton-well px-2 py-2 text-center">
                  <span className="block font-mono text-lg">{r.n}</span>
                  <span className="block truncate text-[11px] text-newton-muted">{r.label}</span>
                </div>
              ))}
            </div>

            <h4 className="label-mono mb-2 mt-6">כל צבע מול לבן ומול שחור · WCAG 2.2 · 1.4.3</h4>
            <ul className="grid gap-2 sm:grid-cols-2">
              {revealedColors.map((c, i) => {
                const onWhite = contrastRatio(c.color, WHITE);
                const onInk = contrastRatio(c.color, INK);
                return (
                  <li key={`${c.ring}-${c.sector}-${i}`} className="newton-well flex items-center gap-3 p-2.5">
                    <button type="button" className="swatch grid h-12 w-12 shrink-0 place-items-center font-mono text-[11px]"
                      style={{ background: c.color, color: readableOn(c.color) }}
                      onClick={() => copyText(c.color.toUpperCase(), `${c.color.toUpperCase()} הועתק`)}
                      aria-label={`העתקת ${c.name} ${c.color}`}>Aa</button>
                    <div className="min-w-0 flex-1 text-sm">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                        <Link to={`/color-psychology?stop=${c.newtonKey}`} className="font-medium text-newton-text underline decoration-white/25 underline-offset-4 hover:decoration-newton-accent">
                          {c.name} · {RING_LABELS[c.ring]}
                        </Link>
                        <span className="font-mono text-[11px] text-newton-muted">{c.color.toUpperCase()}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 font-mono text-[11px]">
                        <span className={LEVEL_TONE[wcagLevel(onWhite)]}>לבן {onWhite.toFixed(2)}</span>
                        <span className={LEVEL_TONE[wcagLevel(onInk)]}>שחור {onInk.toFixed(2)}</span>
                        <span className="text-newton-muted">טקסט מומלץ: {readableOn(c.color) === '#ffffff' ? 'לבן' : 'שחור'}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {pairs.length > 0 && (
              <>
                <h4 className="label-mono mb-2 mt-6">צבע מול צבע · מהניגוד הגבוה לנמוך</h4>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {pairs.map(({ a, b, ratio }) => {
                    const level = wcagLevel(ratio);
                    return (
                      <li key={`${a.ring}${a.sector}-${b.ring}${b.sector}`} className="newton-well flex items-center gap-3 p-2.5">
                        <span className="swatch grid h-10 w-16 shrink-0 place-items-center text-sm font-medium"
                          style={{ background: a.color, color: b.color }} aria-hidden="true">טקסט</span>
                        <div className="min-w-0 flex-1 text-sm">
                          <div className="truncate">{a.name} × {b.name} <span className="text-newton-muted">· {sectorDistance(a.sector, b.sector)} פלחים</span></div>
                          <div className={`font-mono text-[12px] ${LEVEL_TONE[level]}`}>{ratio.toFixed(2)}:1 · {WCAG_LABELS[level]}</div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>

          {/* Layer 2 */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="newton-panel p-5 md:p-6">
              <p className="label-mono mb-2">שכבה 2 · פרשנות לוגית</p>
              <p className="leading-7 text-newton-text">{analysis.logical}</p>
            </div>
            <div className="newton-panel p-5 md:p-6">
              <p className="label-mono mb-2">שכבה 2 · פרשנות פסיכולוגית־מרחבית</p>
              <p className="leading-7 text-newton-text">{analysis.psych}</p>
              <p className="mt-3 text-sm leading-relaxed text-newton-muted">{decomposition}</p>
            </div>
          </div>
        </>
      )}

      {/* Layer 3 */}
      <details className="newton-panel group p-5 md:p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-newton-text">
          <span><span className="label-mono ml-3">שכבה 3</span>מגבלות הכלי ושיטת החישוב</span>
          <span className="label-mono transition-transform group-open:rotate-45" aria-hidden="true">+</span>
        </summary>
        <ul className="mt-4 list-disc space-y-2 pr-5 text-sm leading-relaxed text-newton-muted">
          <li>הניגודיות מחושבת לפי נוסחת הבהירות היחסית של WCAG 2.2 (sRGB). סף 4.5:1 לטקסט רגיל, 3:1 לטקסט גדול, 7:1 ל־AAA.</li>
          <li>סוג ההרמוניה נקבע לפי המרחקים בין הפלחים על גלגל של 12 צעדים, לפי המינוח של יוהנס איטן (Johannes Itten), אמנות הצבע, 1961.</li>
          <li>הפרשנות בשכבה 2 נוצרת מכללים קבועים בקוד (טמפרטורה, מרחק ורוויה), ולא ממודל שפה. היא נקודת פתיחה לשיקול דעת מקצועי, לא מסקנה.</li>
          <li>משמעויות רגשיות של צבע תלויות בתרבות, בהקשר ובחומר. אין כאן קביעה אוניברסלית.</li>
          <li>הצבעים על המסך תלויים בכיול המסך ובתאורת החדר. לפני הפקה בודקים על החומר האמיתי.</li>
        </ul>
      </details>
    </section>
  );
};

function Metric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="newton-well p-4">
      <p className="label-mono mb-1.5">{title}</p>
      <p className="text-xl font-light text-newton-text">{value}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-newton-muted">{note}</p>
    </div>
  );
}

export default React.memo(ColorAnalysis);
