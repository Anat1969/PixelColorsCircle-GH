import { useState } from 'react';
import { Link } from 'react-router-dom';
import { colorPsychologyData } from '@/data/colorPsychologyData';
import { colorPsychologyLabels as labels } from '@/data/colorPsychologyLabels';
import { ArrowLeft } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const ColorPsychology = () => {
  const [index, setIndex] = useState(0);
  const color = colorPsychologyData[index];

  return (
    <div dir="rtl" className="newton-app min-h-screen"
      style={{ background: 'radial-gradient(circle at top, #1d2230 0%, #0f1115 45%, #0b0d11 100%)' }}>
      <div className="max-w-[960px] mx-auto p-6 space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: 'hsl(var(--newton-text))' }}>
            {labels.pageTitle}
          </h1>
          <Link to="/" className="newton-action-btn text-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            גלגל הצבעים
          </Link>
        </div>

        {/* Slider */}
        <div className="newton-panel p-6 space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--newton-muted))' }}>
            {labels.sliderTitle}
          </h2>
          <div className="flex items-center gap-4">
            {colorPsychologyData.map((c, i) => (
              <div key={c.name} className="flex flex-col items-center gap-1 flex-1">
                <div className="w-6 h-6 rounded-full border-2 transition-transform"
                  style={{
                    backgroundColor: c.hex,
                    borderColor: i === index ? 'white' : 'transparent',
                    transform: i === index ? 'scale(1.3)' : 'scale(1)',
                  }}
                />
                <span className="text-[10px]" style={{ color: 'hsl(var(--newton-muted))' }}>{c.name}</span>
              </div>
            ))}
          </div>
          <Slider
            min={0}
            max={6}
            step={1}
            value={[index]}
            onValueChange={([v]) => setIndex(v)}
            className="w-full"
          />
        </div>

        {/* Selected color info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Main color card */}
          <div className="newton-panel p-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl shadow-lg" style={{ backgroundColor: color.hex }} />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'hsl(var(--newton-text))' }}>{color.name}</h2>
                <p className="text-sm mt-1" style={{ color: 'hsl(var(--newton-muted))' }}>
                  {labels.frequencyTitle}: {color.frequencyTHz} THz
                </p>
              </div>
            </div>

            <Section title={labels.positiveTitle}>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>
                {color.positiveMeaning}
              </p>
            </Section>

            <Section title={labels.negativeTitle}>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>
                {color.negativeMeaning}
              </p>
            </Section>
          </div>

          {/* Balancing color card */}
          <div className="newton-panel p-6 space-y-5">
            <Section title={labels.balancingTitle}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl shadow-lg" style={{ backgroundColor: color.balancingColorHex }} />
                <span className="text-lg font-semibold" style={{ color: 'hsl(var(--newton-text))' }}>
                  {color.balancingColorName}
                </span>
              </div>
            </Section>

            <Section title={labels.explanationTitle}>
              <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--newton-text))' }}>
                {color.balancingExplanation}
              </p>
            </Section>
          </div>
        </div>

        {/* Balanced Combination Preview */}
        <div className="newton-panel p-6 space-y-5">
          <h2 className="text-lg font-semibold" style={{ color: 'hsl(var(--newton-muted))' }}>
            {labels.previewTitle}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Selected color block */}
            <div className="space-y-2 text-center">
              <div className="h-24 rounded-xl" style={{ backgroundColor: color.hex }} />
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>{color.name}</span>
            </div>

            {/* Balancing color block */}
            <div className="space-y-2 text-center">
              <div className="h-24 rounded-xl" style={{ backgroundColor: color.balancingColorHex }} />
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>{color.balancingColorName}</span>
            </div>

            {/* Side-by-side */}
            <div className="space-y-2 text-center">
              <div className="h-24 rounded-xl flex overflow-hidden">
                <div className="flex-1" style={{ backgroundColor: color.hex }} />
                <div className="flex-1" style={{ backgroundColor: color.balancingColorHex }} />
              </div>
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>Side by Side</span>
            </div>

            {/* Sample card */}
            <div className="space-y-2 text-center">
              <div className="h-24 rounded-xl p-3 flex flex-col justify-between"
                style={{ backgroundColor: color.hex }}>
                <span className="text-xs font-bold" style={{ color: color.balancingColorHex }}>Sample Card</span>
                <div className="h-6 rounded-md" style={{ backgroundColor: color.balancingColorHex, opacity: 0.8 }} />
              </div>
              <span className="text-xs" style={{ color: 'hsl(var(--newton-muted))' }}>Combined</span>
            </div>
          </div>
        </div>

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
