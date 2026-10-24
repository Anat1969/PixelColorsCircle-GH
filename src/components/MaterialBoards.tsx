import React, { useMemo, useState } from 'react';
import type { RevealedColor } from '@/hooks/useColorWheel';
import { RING_LABELS } from '@/data/newton';
import { contrastRatio, greyHex, greyStep, GREY_STEPS } from '@/lib/color';

interface Board {
  key: 'dark' | 'light';
  title: string;
  base: string;
  text: string;
  muted: string;
  line: string;
  shadow: string;
}

/** Two sample boards, like an architect's material board: one on a dark base, one on white. */
const BOARDS: Board[] = [
  {
    key: 'dark', title: 'לוח 1 · בסיס כהה', base: greyHex(2),
    text: greyHex(46), muted: greyHex(33), line: 'rgba(255,255,255,0.12)',
    shadow: '0 1px 0 rgba(255,255,255,.08) inset, 0 10px 18px -8px rgba(0,0,0,.95), 0 2px 3px rgba(0,0,0,.6)',
  },
  {
    key: 'light', title: 'לוח 2 · בסיס לבן', base: greyHex(49),
    text: greyHex(4), muted: greyHex(18), line: 'rgba(0,0,0,0.12)',
    shadow: '0 1px 0 rgba(255,255,255,.5) inset, 0 12px 20px -10px rgba(0,0,0,.45), 0 2px 3px rgba(0,0,0,.18)',
  },
];

/** 60·30·10: the first colour leads, the second supports, the rest accent. */
export function proportions(n: number): number[] {
  if (n <= 0) return [];
  if (n === 1) return [100];
  if (n === 2) return [65, 35];
  const rest = 10 / (n - 2);
  return [60, 30, ...Array(n - 2).fill(rest)];
}

const MaterialBoards: React.FC<{ revealedColors: RevealedColor[] }> = ({ revealedColors }) => {
  const [mono, setMono] = useState(false);
  const shares = useMemo(() => proportions(revealedColors.length), [revealedColors.length]);
  const empty = revealedColors.length === 0;

  return (
    <section aria-labelledby="boards-title" className="newton-panel p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label-mono mb-2">03 · לוחות חומרים</p>
          <h2 id="boards-title" className="display text-[1.9rem] text-newton-text">על בסיס כהה ועל בסיס לבן</h2>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-newton-muted">
            אותה פלטה, שני בסיסים. הריבוע האפור בפינת כל דוגמה הוא הערך שלה בסולם 50 גווני האפור, והקו בסולם מסמן אותו. ליד כל צבע: הניגוד מול הבסיס.
            חלוקת השטח 60·30·10: הצבע הראשון שנפתח מוביל.
          </p>
        </div>
        <button type="button" className="btn btn-sm" aria-pressed={mono} onClick={() => setMono(m => !m)}>
          {mono ? 'חזרה לצבע' : 'בדיקת ערכים באפור'}
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-2">
        {BOARDS.map(board => {
          const low = revealedColors.filter(c => contrastRatio(c.color, board.base) < 3);
          return (
            <figure key={board.key} aria-label={board.title} className="m-0 p-4 md:p-5"
              style={{
                background: board.base,
                color: board.text,
                border: `1px solid ${board.line}`,
                boxShadow: '0 30px 60px -30px rgba(0,0,0,.9), 0 2px 6px rgba(0,0,0,.4)',
                filter: mono ? 'grayscale(1)' : undefined,
                transition: 'filter .4s',
              }}>
              <figcaption className="mb-4 flex items-baseline justify-between gap-2 font-mono text-[11px] tracking-[0.12em]" style={{ color: board.muted }}>
                <span>{board.title}</span>
                <span>אפור {greyStep(board.base)}/{GREY_STEPS - 1}</span>
              </figcaption>

              {empty ? (
                <div className="grid h-40 place-items-center text-center text-sm" style={{ border: `1px dashed ${board.line}`, color: board.muted }}>
                  פתחו תאים בגלגל, והדוגמאות יונחו כאן.
                </div>
              ) : (
                <div className="flex h-44 gap-2.5 md:h-52">
                  {revealedColors.map((c, i) => (
                    <div key={`${c.ring}-${c.sector}-${i}`} className="flex min-w-0 flex-col" style={{ flex: `${shares[i]} 1 0` }}>
                      <div className="relative min-h-0 flex-1" style={{ background: c.color, boxShadow: board.shadow }}>
                        <span className="absolute bottom-0 left-0 h-1/4 w-1/4 min-w-[14px]"
                          style={{ background: greyHex(greyStep(c.color)), boxShadow: '0 0 0 1px rgba(127,127,127,.35)' }}
                          title={`ערך באפור: ${greyStep(c.color)}`} aria-hidden="true" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!empty && (
                <ul className="mt-3 grid gap-y-1.5 text-[12px]">
                  {revealedColors.map((c, i) => {
                    const ratio = contrastRatio(c.color, board.base);
                    return (
                      <li key={`${c.ring}-${c.sector}-${i}`} className="flex min-w-0 items-baseline gap-2">
                        <span className="h-2.5 w-2.5 shrink-0 self-center" style={{ background: c.color, boxShadow: `0 0 0 1px ${board.line}` }} aria-hidden="true" />
                        <span className="truncate">{c.name} · {RING_LABELS[c.ring]}</span>
                        <span className="ms-auto flex shrink-0 gap-3 font-mono" style={{ color: board.muted }}>
                          <span>אפור {greyStep(c.color)}</span>
                          <bdi dir="ltr" className="w-[3.6em] text-left">{ratio.toFixed(1)}:1</bdi>
                          <bdi dir="ltr" className="w-[2.6em] text-left">{Math.round(shares[i])}%</bdi>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {/* Fifty greys with a mark at each colour's value */}
              <div className="mt-4">
                <div className="relative" aria-hidden="true" dir="ltr">
                  <div className="flex h-4" style={{ boxShadow: `0 0 0 1px ${board.line}` }}>
                    {Array.from({ length: GREY_STEPS }, (_, i) => <span key={i} className="h-full flex-1" style={{ background: greyHex(i) }} />)}
                  </div>
                  {revealedColors.map((c, i) => (
                    <span key={i} className="absolute -top-1.5 h-7 w-[3px] -translate-x-1/2"
                      style={{ left: `${((greyStep(c.color) + 0.5) / GREY_STEPS) * 100}%`, background: c.color, boxShadow: `0 0 0 1px ${board.text}` }} />
                  ))}
                  <span className="absolute -bottom-2 h-2 w-2 -translate-x-1/2 rotate-45"
                    style={{ left: `${((greyStep(board.base) + 0.5) / GREY_STEPS) * 100}%`, background: board.text }} />
                </div>
                <div className="mt-2.5 flex justify-between font-mono text-[10px]" style={{ color: board.muted }} dir="ltr">
                  <span>0 · שחור</span><span>50 גווני אפור</span><span>לבן · 49</span>
                </div>
              </div>

              {!empty && (
                <p className="mt-3 text-[12px] leading-relaxed" style={{ color: board.muted }}>
                  {low.length === 0
                    ? 'כל הדוגמאות בולטות מהבסיס (ניגוד 3:1 ומעלה).'
                    : `נבלעים בבסיס (מתחת ל־3:1): ${low.map(c => c.name).join(', ')}. כדאי מסגרת, מרווח או גוון אחר בטבעת.`}
                </p>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
};

export default React.memo(MaterialBoards);
