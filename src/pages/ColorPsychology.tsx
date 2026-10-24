import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  colorPsychologySpectrumData,
  SPECTRUM_MIN_THZ,
  SPECTRUM_MAX_THZ,
  VISIBLE_MIN_THZ,
  VISIBLE_MAX_THZ,
  SNAP_THRESHOLD_THZ,
  type ColorPsychologyStop,
} from '@/data/colorPsychologyData';
import { colorPsychologySpectrumLabels as L } from '@/data/colorPsychologyLabels';
import PageLayout, { PageHeader } from '@/components/PageLayout';
import EditableText from '@/components/EditableText';
import { readableOn } from '@/lib/color';

const { stops, spectrumZones } = colorPsychologySpectrumData;
const SPAN = SPECTRUM_MAX_THZ - SPECTRUM_MIN_THZ;
const pctOf = (thz: number) => ((thz - SPECTRUM_MIN_THZ) / SPAN) * 100;

function thzToColor(thz: number): string {
  if (thz < VISIBLE_MIN_THZ || thz > VISIBLE_MAX_THZ) return 'transparent';
  const t = (thz - VISIBLE_MIN_THZ) / (VISIBLE_MAX_THZ - VISIBLE_MIN_THZ);
  return `hsl(${t * 270}, 90%, 50%)`;
}

function findSnappedStop(thz: number): ColorPsychologyStop | null {
  for (const entry of stops) {
    if (Math.abs(thz - entry.frequencyTHz) <= SNAP_THRESHOLD_THZ) return entry;
  }
  return null;
}

/** Wavelength in nm from frequency in THz (c = λ·f). */
const nmOf = (thz: number) => Math.round(299_792 / thz);

const ColorPsychology = () => {
  const [params, setParams] = useSearchParams();
  const initialStop = stops.find(s => s.key === params.get('stop'));
  const [rawValue, setRawValue] = useState(initialStop?.frequencyTHz ?? SPECTRUM_MIN_THZ);
  const reduce = useReducedMotion();

  const snappedEntry = useMemo(() => findSnappedStop(rawValue), [rawValue]);
  const currentColor = useMemo(() => snappedEntry ? snappedEntry.hex : thzToColor(rawValue), [rawValue, snappedEntry]);
  const isInVisible = rawValue >= VISIBLE_MIN_THZ && rawValue <= VISIBLE_MAX_THZ;
  const zoneLabel = rawValue < VISIBLE_MIN_THZ ? spectrumZones.infrared.label : rawValue > VISIBLE_MAX_THZ ? spectrumZones.ultraviolet.label : spectrumZones.visible.label;

  // Keep ?stop= in the address so a copied link opens the same colour.
  useEffect(() => {
    const key = snappedEntry?.key;
    if ((params.get('stop') ?? undefined) === key) return;
    setParams(key ? { stop: key } : {}, { replace: true });
  }, [snappedEntry, params, setParams]);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(Number(e.target.value));
  }, []);

  const field = (s: ColorPsychologyStop, name: keyof ColorPsychologyStop) => (
    <EditableText id={`psy.${s.key}.${name}`} as="p" className="leading-relaxed text-newton-text">
      {String(s[name])}
    </EditableText>
  );

  return (
    <PageLayout title={L.pageTitle}>
      <PageHeader kicker="ספקטרום · 300 עד 1000 טרה־הרץ" title={L.pageTitle} lead={L.pageSubtitle} />

      <section aria-labelledby="spectrum-title" className="newton-panel p-5 md:p-7">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="label-mono mb-2">01 · {L.spectrumTitle}</p>
            <h2 id="spectrum-title" className="display text-[1.8rem]">{L.spectrumHint}</h2>
          </div>
          <p className="label-mono">גבוה בתדר = קצר באורך הגל</p>
        </div>

        {/* Visual spectrum: physical axis, low frequency on the left */}
        <div className="relative h-16 select-none overflow-hidden border border-white/10 shadow-[0_2px_10px_rgba(0,0,0,.5)_inset]" style={{ direction: 'ltr' }}>
          <div className="absolute inset-y-0 left-0 grid place-items-center"
            style={{ width: `${pctOf(VISIBLE_MIN_THZ)}%`, background: 'linear-gradient(to right, #120606, #3d0000)' }}>
            <span className="text-[11px] text-newton-muted">{spectrumZones.infrared.label}</span>
          </div>
          <div className="absolute inset-y-0"
            style={{ left: `${pctOf(VISIBLE_MIN_THZ)}%`, width: `${pctOf(VISIBLE_MAX_THZ) - pctOf(VISIBLE_MIN_THZ)}%`, background: 'linear-gradient(to right, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #4400cc, #8800aa)' }} />
          <div className="absolute inset-y-0 right-0 grid place-items-center"
            style={{ width: `${100 - pctOf(VISIBLE_MAX_THZ)}%`, background: 'linear-gradient(to right, #1a0033, #07000f)' }}>
            <span className="text-[11px] text-newton-muted">{spectrumZones.ultraviolet.label}</span>
          </div>

          {stops.map(entry => (
            <div key={entry.key} className="absolute inset-y-0 w-px bg-white/50" style={{ left: `${pctOf(entry.frequencyTHz)}%` }} />
          ))}

          <div className="pointer-events-none absolute top-1/2 z-10 h-10 w-4 border-2 transition-[box-shadow,border-color] duration-200"
            style={{
              left: `${pctOf(rawValue)}%`, transform: 'translate(-50%, -50%)',
              backgroundColor: isInVisible ? currentColor : '#2a2b2e',
              borderColor: snappedEntry ? '#fff' : 'rgba(255,255,255,0.5)',
              boxShadow: snappedEntry ? `0 0 18px ${currentColor}, 0 6px 14px rgba(0,0,0,.8)` : '0 6px 14px rgba(0,0,0,.8)',
            }} />

          <input type="range" min={SPECTRUM_MIN_THZ} max={SPECTRUM_MAX_THZ} step={1} value={rawValue}
            onChange={handleSliderChange}
            aria-label="תדר האור בטרה־הרץ"
            aria-valuetext={`${rawValue} טרה־הרץ, ${snappedEntry ? snappedEntry.name : zoneLabel}`}
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0" />
        </div>

        {/* Stop shortcuts: the seven colours as buttons */}
        <div role="group" aria-label="קפיצה לנקודות העצירה" className="mt-3 grid grid-cols-7 gap-1" style={{ direction: 'ltr' }}>
          {stops.map(entry => (
            <button key={entry.key} type="button" onClick={() => setRawValue(entry.frequencyTHz)}
              aria-pressed={snappedEntry?.key === entry.key}
              className="btn btn-sm min-w-0 flex-col gap-1 px-0.5 py-1.5" dir="rtl">
              <span className="swatch block h-2 w-full" style={{ background: entry.hex }} aria-hidden="true" />
              <span className="truncate text-[11px] md:text-xs">{entry.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4" role="status" aria-live="polite">
          <span className="swatch h-10 w-10" style={{ backgroundColor: isInVisible ? currentColor : '#222' }} aria-hidden="true" />
          <span className="text-newton-text">
            {L.currentFrequencyTitle}: <bdi dir="ltr" className="font-mono font-medium">{rawValue} {L.frequencyUnit}</bdi>
            <span className="text-newton-muted"> · אורך גל <bdi dir="ltr" className="font-mono">{nmOf(rawValue)} {L.wavelengthUnit}</bdi></span>
          </span>
          <span className="text-sm text-newton-muted">
            {snappedEntry ? `${L.selectedColorTitle}: ${snappedEntry.name}` : isInVisible ? L.intermediateStateHint : zoneLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-newton-muted">{L.stopPointHint}. אפשר לגרור, ללחוץ על שם צבע, או להשתמש בחצים במקלדת.</p>
      </section>

      <AnimatePresence mode="wait">
        {snappedEntry ? (
          <motion.section key={snappedEntry.key} aria-label={`${L.explanationPanelTitle}: ${snappedEntry.name}`}
            initial={reduce ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }} className="mt-6 space-y-5">
            <div className="newton-panel flex flex-wrap items-center gap-5 p-5 md:p-7">
              <div className="grid h-24 w-24 shrink-0 place-items-center font-mono text-xs shadow-[0_18px_40px_-14px_rgba(0,0,0,.95)]"
                style={{ backgroundColor: snappedEntry.hex, color: readableOn(snappedEntry.hex) }}>{snappedEntry.hex}</div>
              <div className="min-w-0 flex-1">
                <p className="label-mono mb-1"><bdi dir="ltr">{snappedEntry.frequencyTHz} {L.frequencyUnit}</bdi> · <bdi dir="ltr">{snappedEntry.wavelengthNm} {L.wavelengthUnit}</bdi></p>
                <h2 className="display text-[2.6rem]">{snappedEntry.name}</h2>
              </div>
              <Link to="/wheel" className="btn btn-sm">לנסות בגלגל</Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="newton-panel space-y-5 p-5 md:p-6">
                <Block title={L.positiveMeaningTitle}>{field(snappedEntry, 'positiveMeaning')}</Block>
                <Block title={L.negativeMeaningTitle}>{field(snappedEntry, 'negativeMeaning')}</Block>
                <Block title={L.effectsTitle}>{field(snappedEntry, 'effects')}</Block>
              </div>
              <div className="newton-panel space-y-5 p-5 md:p-6">
                <Block title={L.needForBalanceTitle}>{field(snappedEntry, 'needForBalance')}</Block>
                <Block title={L.whyBalanceTitle}>{field(snappedEntry, 'whyBalanceIsNeeded')}</Block>
                <Block title={L.balancingColorTitle}>
                  <button type="button" className="btn btn-sm gap-3"
                    onClick={() => { const s = stops.find(x => x.hex === snappedEntry.balancingColorHex); if (s) setRawValue(s.frequencyTHz); }}>
                    <span className="swatch h-6 w-6" style={{ backgroundColor: snappedEntry.balancingColorHex }} aria-hidden="true" />
                    <span>{snappedEntry.balancingColorName}</span>
                    <span className="label-mono">מעבר</span>
                  </button>
                </Block>
                <Block title={L.balancingExplanationTitle}>{field(snappedEntry, 'balancingExplanation')}</Block>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="newton-panel p-5 md:p-6">
                <Block title={L.scientificExplanationTitle}>{field(snappedEntry, 'scientificExplanation')}</Block>
              </div>
              <div className="newton-panel p-5 md:p-6">
                <Block title={L.psychologicalExplanationTitle}>{field(snappedEntry, 'psychologicalExplanation')}</Block>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-newton-muted">
              הנתונים הפיזיקליים (תדר ואורך גל) הם עובדה מדידה. המשמעויות הפסיכולוגיות הן אסוציאציות תרבותיות מקובלות ולא חוק אוניברסלי, ותלויות בהקשר, בכמות ובחומר.
            </p>
          </motion.section>
        ) : (
          <motion.section key="empty" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? undefined : { opacity: 0 }}
            className="newton-panel mt-6 p-6 md:p-8">
            <p className="label-mono mb-2">02 · הסבר</p>
            <p className="text-lg text-newton-text">{isInVisible ? 'אתם בין שתי נקודות עצירה.' : `אתם ב${zoneLabel}, מחוץ לאור הנראה.`}</p>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-newton-muted">
              ההסבר המלא נפתח כשהסמן מגיע לאחד משבעת צבעי ניוטון. לחצו על שם צבע מעל, או גררו את הסמן עד שהוא נצמד.
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </PageLayout>
  );
};

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="label-mono text-newton-accent">{title}</h3>
      {children}
    </div>
  );
}

export default ColorPsychology;
