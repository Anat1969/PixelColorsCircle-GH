import { useState, useMemo, useCallback } from 'react';
import {
  colorPsychologySpectrumData,
  SPECTRUM_MIN_THZ,
  SPECTRUM_MAX_THZ,
  VISIBLE_MIN_THZ,
  VISIBLE_MAX_THZ,
  SNAP_THRESHOLD_THZ,
  type ColorPsychologyStop,
} from '@/data/colorPsychologyData';
import { colorPsychologySpectrumLabels as labels } from '@/data/colorPsychologyLabels';
import TopNav from '@/components/TopNav';

const { stops, spectrumZones } = colorPsychologySpectrumData;

/** Convert THz to an approximate visible-spectrum hex color. */
function thzToColor(thz: number): string {
  if (thz < VISIBLE_MIN_THZ || thz > VISIBLE_MAX_THZ) return 'transparent';
  const t = (thz - VISIBLE_MIN_THZ) / (VISIBLE_MAX_THZ - VISIBLE_MIN_THZ);
  const hue = t * 270;
  return `hsl(${hue}, 90%, 50%)`;
}

/** Find nearest stop point within threshold. */
function findSnappedStop(thz: number): ColorPsychologyStop | null {
  for (const entry of stops) {
    if (Math.abs(thz - entry.frequencyTHz) <= SNAP_THRESHOLD_THZ) {
      return entry;
    }
  }
  return null;
}

const ColorPsychology = () => {
  const [rawValue, setRawValue] = useState(SPECTRUM_MIN_THZ);

  const snappedEntry = useMemo(() => findSnappedStop(rawValue), [rawValue]);
  const currentColor = useMemo(() => {
    if (snappedEntry) return snappedEntry.hex;
    return thzToColor(rawValue);
  }, [rawValue, snappedEntry]);

  const isInVisible = rawValue >= VISIBLE_MIN_THZ && rawValue <= VISIBLE_MAX_THZ;

  const irEndPct = ((VISIBLE_MIN_THZ - SPECTRUM_MIN_THZ) / (SPECTRUM_MAX_THZ - SPECTRUM_MIN_THZ)) * 100;
  const uvStartPct = ((VISIBLE_MAX_THZ - SPECTRUM_MIN_THZ) / (SPECTRUM_MAX_THZ - SPECTRUM_MIN_THZ)) * 100;
  const handlePct = ((rawValue - SPECTRUM_MIN_THZ) / (SPECTRUM_MAX_THZ - SPECTRUM_MIN_THZ)) * 100;

  const stopPositions = useMemo(
    () =>
      stops.map((entry) => ({
        entry,
        pct: ((entry.frequencyTHz - SPECTRUM_MIN_THZ) / (SPECTRUM_MAX_THZ - SPECTRUM_MIN_THZ)) * 100,
      })),
    []
  );

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRawValue(Number(e.target.value));
  }, []);

  return (
    <div dir="rtl" className="newton-app min-h-screen" style={{ background: 'radial-gradient(circle at top, #1d2230 0%, #0f1115 45%, #0b0d11 100%)' }}>
      <TopNav />
      <div className="max-w-[960px] mx-auto p-6 pt-20 space-y-8">

        {/* Header */}
        <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--newton-text))' }}>
          {labels.pageTitle}
        </h1>

        {/* Spectrum Bar */}
        <div className="newton-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--newton-muted))' }}>
            {labels.spectrumTitle}
          </h2>

          {/* Visual spectrum bar */}
          <div className="relative h-12 rounded-xl overflow-hidden select-none" style={{ direction: 'ltr' }}>
            {/* Infrared zone */}
            <div
              className="absolute inset-y-0 left-0 flex items-center justify-center"
              style={{ width: `${irEndPct}%`, background: 'linear-gradient(to right, #1a0a0a, #3d0000)' }}
            >
              <span className="text-[10px] font-medium" style={{ color: 'hsl(var(--newton-muted))' }}>
                {spectrumZones.infrared.label}
              </span>
            </div>

            {/* Visible spectrum */}
            <div
              className="absolute inset-y-0"
              style={{
                left: `${irEndPct}%`,
                width: `${uvStartPct - irEndPct}%`,
                background: 'linear-gradient(to right, #ff0000, #ff8800, #ffff00, #00ff00, #0088ff, #4400cc, #8800aa)',
              }}
            />

            {/* Ultraviolet zone */}
            <div
              className="absolute inset-y-0 right-0 flex items-center justify-center"
              style={{ width: `${100 - uvStartPct}%`, background: 'linear-gradient(to right, #1a0033, #0a0015)' }}
            >
              <span className="text-[10px] font-medium" style={{ color: 'hsl(var(--newton-muted))' }}>
                {spectrumZones.ultraviolet.label}
              </span>
            </div>

            {/* Stop point markers */}
            {stopPositions.map(({ entry, pct }) => (
              <div
                key={entry.key}
                className="absolute top-0 bottom-0 w-0.5 opacity-60"
                style={{ left: `${pct}%`, backgroundColor: 'rgba(255,255,255,0.5)' }}
              />
            ))}

            {/* Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 shadow-lg transition-shadow pointer-events-none z-10"
              style={{
                left: `${handlePct}%`,
                transform: `translate(-50%, -50%)`,
                backgroundColor: isInVisible ? currentColor : '#333',
                borderColor: snappedEntry ? '#fff' : 'rgba(255,255,255,0.4)',
                boxShadow: snappedEntry ? `0 0 12px ${currentColor}` : 'none',
              }}
            />

            {/* Invisible range input */}
            <input
              type="range"
              min={SPECTRUM_MIN_THZ}
              max={SPECTRUM_MAX_THZ}
              step={1}
              value={rawValue}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              style={{ direction: 'ltr' }}
            />
          </div>

          {/* Color name markers */}
          <div className="relative h-6" style={{ direction: 'ltr' }}>
            {stopPositions.map(({ entry, pct }) => (
              <span
                key={entry.key}
                className="absolute text-[10px] -translate-x-1/2 transition-colors"
                style={{
                  left: `${pct}%`,
                  color: snappedEntry?.key === entry.key ? '#fff' : 'hsl(var(--newton-muted))',
                  fontWeight: snappedEntry?.key === entry.key ? 700 : 400,
                }}
              >
                {entry.name}
              </span>
            ))}
          </div>

          {/* Live frequency display */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg border" style={{ backgroundColor: isInVisible ? currentColor : '#222', borderColor: 'hsl(var(--newton-panel-2))' }} />
              <span className="text-sm" style={{ color: 'hsl(var(--newton-text))' }}>
                {labels.currentFrequency}: <strong>{rawValue} {labels.frequencyUnit}</strong>
              </span>
            </div>
            {!snappedEntry && isInVisible && (
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>
                {labels.snapHint}
              </span>
            )}
            {!isInVisible && (
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>
                {rawValue < VISIBLE_MIN_THZ ? spectrumZones.infrared.label : spectrumZones.ultraviolet.label}
              </span>
            )}
          </div>
        </div>

        {/* Explanation panel — only at stop points */}
        {snappedEntry && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Color header */}
            <div className="newton-panel p-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl shadow-lg" style={{ backgroundColor: snappedEntry.hex }} />
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.name}</h2>
                  <p className="text-sm mt-1" style={{ color: 'hsl(var(--newton-muted))' }}>
                    {labels.frequencyLabel}: {snappedEntry.frequencyTHz} {labels.frequencyUnit} · {labels.wavelengthLabel}: {snappedEntry.wavelengthNm} {labels.wavelengthUnit}
                  </p>
                </div>
              </div>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="newton-panel p-6 space-y-5">
                <Section title={labels.positiveTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.positiveMeaning}</p>
                </Section>
                <Section title={labels.negativeTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.negativeMeaning}</p>
                </Section>
                <Section title={labels.effectsTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.effects}</p>
                </Section>
              </div>

              <div className="newton-panel p-6 space-y-5">
                <Section title={labels.balanceNeedTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.needForBalance}</p>
                </Section>
                <Section title={labels.balanceReasonTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.whyBalanceIsNeeded}</p>
                </Section>
                <Section title={labels.balancingColorTitle}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shadow" style={{ backgroundColor: snappedEntry.balancingColorHex }} />
                    <span className="text-sm font-medium" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.balancingColorName}</span>
                  </div>
                </Section>
                <Section title={labels.balancingExplanationTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.balancingExplanation}</p>
                </Section>
              </div>
            </div>

            {/* Science & Psychology */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="newton-panel p-6">
                <Section title={labels.scientificTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.scientificExplanation}</p>
                </Section>
              </div>
              <div className="newton-panel p-6">
                <Section title={labels.psychologicalTitle}>
                  <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>{snappedEntry.psychologicalExplanation}</p>
                </Section>
              </div>
            </div>

            {/* Preview */}
            <div className="newton-panel p-6 space-y-4">
              <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--newton-muted))' }}>{labels.previewTitle}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-xl" style={{ backgroundColor: snappedEntry.hex }} />
                  <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>{snappedEntry.name}</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-xl" style={{ backgroundColor: snappedEntry.balancingColorHex }} />
                  <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>{snappedEntry.balancingColorName}</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-xl flex overflow-hidden">
                    <div className="flex-1" style={{ backgroundColor: snappedEntry.hex }} />
                    <div className="flex-1" style={{ backgroundColor: snappedEntry.balancingColorHex }} />
                  </div>
                  <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>זה לצד זה</span>
                </div>
                <div className="space-y-2 text-center">
                  <div className="h-24 rounded-xl p-3 flex flex-col justify-between" style={{ backgroundColor: snappedEntry.hex }}>
                    <span className="text-xs font-bold" style={{ color: snappedEntry.balancingColorHex }}>כרטיס לדוגמה</span>
                    <div className="h-6 rounded-md" style={{ backgroundColor: snappedEntry.balancingColorHex, opacity: 0.8 }} />
                  </div>
                  <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>משולב</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-semibold" style={{ color: 'hsl(var(--newton-accent))' }}>{title}</h3>
      {children}
    </div>
  );
}

export default ColorPsychology;
