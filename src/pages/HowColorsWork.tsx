import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Music, Leaf, Atom, Heart, MessageCircle, Shield, Lightbulb } from "lucide-react";
import { colorExplorationData, colorExplorationFunctions } from "@/data/colorExplorationData";
import { colorExplorationLabels as labels } from "@/data/colorExplorationLabels";

const domainIcons: Record<string, typeof Music> = {
  music: Music,
  living: Leaf,
  physics: Atom,
};

const functionIconMap: Record<string, typeof Heart> = {
  emotion: Heart,
  communication: MessageCircle,
  survival: Shield,
  physics: Lightbulb,
};

const functionColorMap: Record<string, string> = {
  emotion: "#E53935",
  communication: "#1E88E5",
  survival: "#43A047",
  physics: "#F9A825",
};

const { hero, domains } = colorExplorationData;

const HowColorsWork = () => {
  const [activeDomainKey, setActiveDomainKey] = useState(domains[0].key);
  const activeDomain = domains.find((d) => d.key === activeDomainKey)!;
  const DomainIcon = domainIcons[activeDomainKey] ?? Atom;

  return (
    <div
      dir="rtl"
      className="newton-app min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #1d2230 0%, #0f1115 45%, #0b0d11 100%)",
      }}
    >
      <div className="max-w-[1060px] mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold" style={{ color: "hsl(var(--newton-text))" }}>
            {hero.title}
          </h1>
          <Link to="/" className="newton-action-btn text-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            גלגל הצבעים
          </Link>
        </div>

        {/* Hero */}
        <div className="newton-panel p-8 text-center space-y-4">
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(var(--newton-muted))" }}
          >
            {hero.intro}
          </p>
        </div>

        {/* Summary strip — 4 color functions */}
        <div className="newton-panel p-5">
          <h3 className="text-sm font-semibold mb-4" style={{ color: "hsl(var(--newton-muted))" }}>
            {labels.summaryTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorExplorationFunctions.map((f) => {
              const FIcon = functionIconMap[f.key] ?? Lightbulb;
              return (
                <div
                  key={f.key}
                  className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <FIcon className="w-5 h-5 shrink-0" style={{ color: functionColorMap[f.key] }} />
                  <span className="text-sm font-medium" style={{ color: "hsl(var(--newton-text))" }}>
                    {f.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {domains.map((d) => {
            const DIcon = domainIcons[d.key] ?? Atom;
            const active = d.key === activeDomainKey;
            return (
              <button
                key={d.key}
                onClick={() => setActiveDomainKey(d.key)}
                className={`newton-mode-btn flex items-center gap-2 flex-1 justify-center ${active ? "active" : ""}`}
              >
                <DIcon className="w-4 h-4" />
                {d.title}
              </button>
            );
          })}
        </div>

        {/* Domain intro */}
        <div className="flex items-start gap-3 px-2">
          <DomainIcon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--newton-accent))" }} />
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--newton-muted))" }}>
            {activeDomain.intro}
          </p>
        </div>

        {/* Example cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {activeDomain.examples.map((ex) => (
            <div key={ex.id} className="newton-panel p-5 space-y-4 flex flex-col">
              {/* Image area */}
              <div
                className="h-36 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${ex.colors[0]}33, ${ex.colors[1] ?? ex.colors[0]}22)`,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span className="text-xs" style={{ color: "hsl(var(--newton-muted))" }}>
                  {labels.imagePlaceholder}
                </span>
              </div>

              {/* Content */}
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold" style={{ color: "hsl(var(--newton-text))" }}>
                  {ex.title}
                </h3>
                <p className="text-xs font-medium" style={{ color: "hsl(var(--newton-accent))" }}>
                  {ex.subtitle}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--newton-muted))" }}>
                  {ex.description}
                </p>
              </div>

              {/* Footer: swatches + function tag */}
              <div
                className="flex items-center justify-between pt-2 border-t"
                style={{ borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "hsl(var(--newton-muted))" }}>
                    {labels.colorsTitle}:
                  </span>
                  <div className="flex gap-1.5">
                    {ex.colors.map((c) => (
                      <div
                        key={c}
                        className="w-5 h-5 rounded-full border"
                        style={{ backgroundColor: c, borderColor: "rgba(255,255,255,0.15)" }}
                      />
                    ))}
                  </div>
                </div>
                <span
                  className="text-[11px] px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "hsl(var(--newton-accent))",
                  }}
                >
                  {colorExplorationFunctions.find((f) => f.key === ex.functionTag)?.label ?? ex.functionTag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowColorsWork;
