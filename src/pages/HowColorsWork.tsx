import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Music, Leaf, Atom, Heart, MessageCircle, Shield, Lightbulb } from "lucide-react";
import { howColorsWorkData, type ColorExample } from "@/data/howColorsWorkData";
import { howColorsWorkLabels as labels } from "@/data/howColorsWorkLabels";

const domains = ["music", "nature", "physics"] as const;
type Domain = (typeof domains)[number];

const domainMeta: Record<Domain, { label: string; icon: typeof Music; intro: string }> = {
  music: { label: labels.tabMusic, icon: Music, intro: labels.musicIntro },
  nature: { label: labels.tabNature, icon: Leaf, intro: labels.natureIntro },
  physics: { label: labels.tabPhysics, icon: Atom, intro: labels.physicsIntro },
};

const functionIcons = [
  { label: labels.functionEmotion, icon: Heart, color: "#E53935" },
  { label: labels.functionCommunication, icon: MessageCircle, color: "#1E88E5" },
  { label: labels.functionSurvival, icon: Shield, color: "#43A047" },
  { label: labels.functionPhysics, icon: Lightbulb, color: "#F9A825" },
];

const HowColorsWork = () => {
  const [activeDomain, setActiveDomain] = useState<Domain>("music");
  const meta = domainMeta[activeDomain];
  const Icon = meta.icon;
  const examples = howColorsWorkData.filter((e) => e.domain === activeDomain);

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
            {labels.pageTitle}
          </h1>
          <Link to="/" className="newton-action-btn text-sm gap-2">
            <ArrowLeft className="w-4 h-4" />
            {labels.backToWheel}
          </Link>
        </div>

        {/* Hero */}
        <div className="newton-panel p-8 text-center space-y-4">
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: "hsl(var(--newton-muted))" }}
          >
            {labels.heroSubtitle}
          </p>
        </div>

        {/* Summary strip — 4 color functions */}
        <div className="newton-panel p-5">
          <h3
            className="text-sm font-semibold mb-4"
            style={{ color: "hsl(var(--newton-muted))" }}
          >
            {labels.summaryTitle}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {functionIcons.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <f.icon className="w-5 h-5 shrink-0" style={{ color: f.color }} />
                <span className="text-sm font-medium" style={{ color: "hsl(var(--newton-text))" }}>
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {domains.map((d) => {
            const DIcon = domainMeta[d].icon;
            const active = d === activeDomain;
            return (
              <button
                key={d}
                onClick={() => setActiveDomain(d)}
                className={`newton-mode-btn flex items-center gap-2 flex-1 justify-center ${active ? "active" : ""}`}
              >
                <DIcon className="w-4 h-4" />
                {domainMeta[d].label}
              </button>
            );
          })}
        </div>

        {/* Domain intro */}
        <div className="flex items-start gap-3 px-2">
          <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "hsl(var(--newton-accent))" }} />
          <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--newton-muted))" }}>
            {meta.intro}
          </p>
        </div>

        {/* Example cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {examples.map((ex) => (
            <ExampleCard key={ex.id} example={ex} />
          ))}
        </div>
      </div>
    </div>
  );
};

function ExampleCard({ example }: { example: ColorExample }) {
  return (
    <div className="newton-panel p-5 space-y-4 flex flex-col">
      {/* Image placeholder */}
      <div
        className="h-36 rounded-xl flex items-center justify-center"
        style={{
          background: example.image
            ? `url(${example.image}) center/cover`
            : `linear-gradient(135deg, ${example.colors[0]?.hex}33, ${example.colors[1]?.hex ?? example.colors[0]?.hex}22)`,
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {!example.image && (
          <span className="text-xs" style={{ color: "hsl(var(--newton-muted))" }}>
            תמונה
          </span>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2 flex-1">
        <h3 className="text-base font-bold" style={{ color: "hsl(var(--newton-text))" }}>
          {example.title}
        </h3>
        <p className="text-xs font-medium" style={{ color: "hsl(var(--newton-accent))" }}>
          {example.subtitle}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "hsl(var(--newton-muted))" }}>
          {example.description}
        </p>
      </div>

      {/* Footer: swatches + function tag */}
      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2">
          <span className="text-[11px]" style={{ color: "hsl(var(--newton-muted))" }}>
            {labels.keyColors}:
          </span>
          <div className="flex gap-1.5">
            {example.colors.map((c) => (
              <div
                key={c.hex}
                className="w-5 h-5 rounded-full border"
                style={{ backgroundColor: c.hex, borderColor: "rgba(255,255,255,0.15)" }}
                title={c.name}
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
          {example.functionTag}
        </span>
      </div>
    </div>
  );
}

export default HowColorsWork;
