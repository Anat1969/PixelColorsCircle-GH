import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import EditableImageSlot from "@/components/EditableImageSlot";
import EditableText from "@/components/EditableText";
import PageLayout, { PageHeader } from "@/components/PageLayout";
import { colorExplorationData, colorExplorationFunctions } from "@/data/colorExplorationData";
import { colorExplorationLabels as labels } from "@/data/colorExplorationLabels";
import { newtonHex, type NewtonKey } from "@/data/newton";
import { copyText } from "@/lib/share";
import bannerMusic from "@/assets/banner_music.jpg";
import bannerNature from "@/assets/banner_nature.jpg";
import bannerPhysics from "@/assets/banner_physics.jpg";

const domainImages: Record<string, string> = {
  music: bannerMusic,
  living: bannerNature,
  physics: bannerPhysics,
};

/** Each domain takes its accent from Newton's palette, so colour meaning stays consistent. */
const domainAccent: Record<string, NewtonKey> = {
  music: "violet",
  living: "green",
  physics: "blue",
};

const { hero, domains } = colorExplorationData;
type FunctionKey = "all" | (typeof colorExplorationFunctions)[number]["key"];

const HowColorsWork = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FunctionKey>("all");
  const reduce = useReducedMotion();

  const counts = useMemo(() => {
    const all = domains.flatMap(d => d.examples);
    return Object.fromEntries(
      [["all", all.length], ...colorExplorationFunctions.map(f => [f.key, all.filter(e => e.functionTag === f.key).length])],
    ) as Record<string, number>;
  }, []);

  const visibleDomains = domains
    .map(d => ({ ...d, shown: filter === "all" ? d.examples : d.examples.filter(e => e.functionTag === filter) }))
    .filter(d => d.shown.length > 0);

  return (
    <PageLayout title={hero.title}>
      <PageHeader kicker="שלושה תחומים · עשר דוגמאות" title={hero.title}
        lead={<EditableText id="how.hero.intro" as="p">{hero.intro}</EditableText>} />

      <div className="mb-8">
        <h2 id="filter-title" className="label-mono mb-2.5">{labels.functionTitle}: מה הצבע עושה</h2>
        <div role="group" aria-labelledby="filter-title" className="grid grid-cols-5 gap-1.5">
          {([{ key: "all", label: "הכול" }, ...colorExplorationFunctions] as { key: FunctionKey; label: string }[]).map(f => (
            <button key={f.key} type="button" onClick={() => setFilter(f.key)} aria-pressed={filter === f.key}
              className="btn btn-sm min-w-0 flex-col gap-0 px-1 md:flex-row md:gap-2">
              <span className="truncate">{f.label}</span>
              <span className="font-mono text-[10px] opacity-70">{counts[f.key]}</span>
            </button>
          ))}
        </div>
        {filter !== "all" && (
          <p className="mt-2.5 text-sm text-newton-muted">מוצגות רק דוגמאות שבהן הצבע משמש ל{colorExplorationFunctions.find(f => f.key === filter)?.label}. כל התחומים הרלוונטיים פתוחים.</p>
        )}
      </div>

      <div className="space-y-6">
        {visibleDomains.map((domain, index) => {
          const accent = newtonHex(domainAccent[domain.key] ?? "blue");
          const isExpanded = filter !== "all" || expanded === domain.key;
          const panelId = `domain-${domain.key}`;

          return (
            <section key={domain.key} aria-labelledby={`${panelId}-title`} className="space-y-4">
              <button type="button" aria-expanded={isExpanded} aria-controls={panelId}
                onClick={() => {
                  if (filter !== "all") { setFilter("all"); setExpanded(null); }
                  else setExpanded(isExpanded ? null : domain.key);
                }}
                className="newton-panel card-press block w-full overflow-hidden text-start">
                <div className="flex flex-col md:h-[280px] md:flex-row">
                  <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
                    <span className="label-mono flex items-center gap-2"><span className="h-2.5 w-2.5" style={{ background: accent }} aria-hidden="true" />0{index + 1} · {domain.shown.length} {labels.examplesTitle}</span>
                    <h2 id={`${panelId}-title`} className="display text-[2rem] text-newton-text">{domain.title}</h2>
                    <EditableText id={`how.${domain.key}.intro`} as="p" className="leading-relaxed text-newton-muted">{domain.intro}</EditableText>
                    <span className="label-mono mt-1 text-newton-text">{isExpanded ? "סגירה" : "פתיחת הדוגמאות"} <span aria-hidden="true">{isExpanded ? "−" : "+"}</span></span>
                  </div>
                  <div className="relative h-44 overflow-hidden md:h-auto md:w-[42%]">
                    <img src={domainImages[domain.key]} alt="" className="h-full w-full object-cover" loading="lazy" width={1024} height={512} />
                    <div className="pointer-events-none absolute inset-0"
                      style={{ background: "linear-gradient(to left, transparent 35%, hsl(220 5% 11.5% / 0.96) 100%)" }} />
                    <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: accent }} />
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div id={panelId} key="examples"
                    initial={reduce ? false : { opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? undefined : { opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                    className="overflow-hidden">
                    <div className="grid grid-cols-[minmax(0,1fr)] gap-4 pb-2 md:grid-cols-2">
                      {domain.shown.map(ex => (
                        <article key={ex.id} className="newton-panel flex flex-col gap-3 p-5">
                          <EditableImageSlot storageKey={ex.id} className="h-32"
                            fallbackGradient={`linear-gradient(135deg, ${ex.colors[0]}55, ${ex.colors[1] ?? ex.colors[0]}22 70%, transparent)`} />
                          <div className="flex-1 space-y-1.5">
                            <EditableText id={`how.${ex.id}.title`} as="h3" className="text-lg font-medium text-newton-text">{ex.title}</EditableText>
                            <EditableText id={`how.${ex.id}.subtitle`} as="p" className="text-sm text-newton-text/85">{ex.subtitle}</EditableText>
                            <EditableText id={`how.${ex.id}.description`} as="p" className="text-sm leading-relaxed text-newton-muted">{ex.description}</EditableText>
                          </div>
                          <div className="flex items-center justify-between gap-2 border-t border-white/[0.08] pt-3">
                            <div className="flex items-center gap-1.5">
                              <span className="label-mono">{labels.colorsTitle}</span>
                              {ex.colors.map(c => (
                                <button key={c} type="button" className="swatch h-6 w-6" style={{ backgroundColor: c }}
                                  onClick={() => copyText(c, `${c} הועתק`)} aria-label={`העתקת הצבע ${c}`} title={c} />
                              ))}
                            </div>
                            <span className="label-mono border border-white/10 px-2 py-1 text-newton-text">
                              {colorExplorationFunctions.find(f => f.key === ex.functionTag)?.label ?? ex.functionTag}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          );
        })}
      </div>
    </PageLayout>
  );
};

export default HowColorsWork;
