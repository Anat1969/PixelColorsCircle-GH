import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PageLayout from '@/components/PageLayout';
import HeroWheel3D from '@/components/HeroWheel3D';
import EditableText from '@/components/EditableText';
import { NEWTON_SEVEN, newtonHex } from '@/data/newton';
import { APP_NAME } from '@/data/site';

const TOOLS = [
  {
    n: '01', to: '/wheel', title: 'גלגל הצבעים של ניוטון',
    doing: 'פותחים חורים במסכה, מסובבים, משווים.',
    result: 'פלטה עם סוג הרמוניה, טמפרטורה וניגודיות WCAG, מוכנה להעתקה כ־HEX, CSS או JSON.',
    visual: 'wheel',
  },
  {
    n: '02', to: '/color-psychology', title: 'פסיכולוגיית הצבעים',
    doing: 'נעים לאורך הספקטרום מאינפרא־אדום ועד אולטרה־סגול.',
    result: 'לכל אחד משבעת הצבעים: תדר, אורך גל, משמעות, השפעה וצבע מאזֵן.',
    visual: 'spectrum',
  },
  {
    n: '03', to: '/how-colors-work', title: 'איך צבעים עובדים',
    doing: 'חוקרים צבע במוזיקה, בטבע החי ובפיזיקה, ומסננים לפי תפקיד.',
    result: 'עשר דוגמאות מתועדות שמראות מה צבע עושה: רגש, תקשורת, הישרדות ופיזיקה.',
    visual: 'domains',
  },
] as const;

const PILLARS = [
  { k: 'חזון', t: 'לא עוד צבע כתחושה בלבד', d: 'לעבור מאינטואיציה להבנה: לראות יחסים בין צבעים, להבין השפעה, לקרוא משמעות, וליישם נכון במותג, בממשק, בחלל ובחומר.' },
  { k: 'מטרה', t: 'להפוך מידע להחלטה', d: 'כל חקירה מסתיימת בתוצר שאפשר לעבוד איתו: פלטה מנומקת, קוד צבע, וקישור שמשחזר את הבחירה בדיוק.' },
  { k: 'כלים', t: 'שלושה כלים, שפה אחת', d: 'גלגל, ספקטרום ותחומי עולם. אותם שבעה צבעים, אותם ערכים ואותה משמעות בכל מקום באפליקציה.' },
  { k: 'תוצאות', t: 'החלטות שאפשר להסביר', d: 'כל המלצה נשענת על חישוב גלוי (הרמוניה, ניגודיות, טמפרטורה), ועל פרשנות שמסומנת כפרשנות.' },
];

const STEPS = [
  { title: 'לחקור', text: 'לזהות יחסים, ניגודיות, הרמוניה, טמפרטורה ועומק.' },
  { title: 'להבין', text: 'לראות איך צבע פועל על העין, על הקשב, על התחושה ועל הקריאה של צורה.' },
  { title: 'לפרש', text: 'להבין מה צבע מסמן, רומז, מדגיש או מסתיר בהקשר תרבותי, רגשי וסימבולי.' },
  { title: 'ליישם', text: 'להפוך ידע צבעוני להחלטות עיצוביות מדויקות.' },
];

const WORLD = [
  { title: 'חי', key: 'red', text: 'בטבע החי, צבע משמש להסוואה, אזהרה, חיזור, זיהוי והישרדות.' },
  { title: 'צומח', key: 'green', text: 'בצומח, צבע קשור לאור, לעונות, להבשלה, למשיכת מאביקים ולמצב החומרי של הצמח.' },
  { title: 'דומם', key: 'orange', text: 'בחפצים, חומרים ומשטחים, צבע נבנה דרך אור, מרקם, שקיפות, ספיגה, החזר וגימור.' },
  { title: 'מדע', key: 'blue', text: 'צבע מוסבר דרך אור, אורך גל, ראייה, ניגוד, אדפטציה ותפיסה.' },
  { title: 'תרבות', key: 'violet', text: 'צבע נושא זיכרון, סמליות, היררכיה, רגש והקשר.' },
] as const;

const USES = [
  'לבנות פלטות צבע מדויקות יותר',
  'לחדד זהות מותגית',
  'לשפר היררכיה וקריאות בממשקים',
  'להבין השפעה צבעונית בחלל',
  'לבחור חומרים וגימורים מתוך הבנת אור ותפיסה',
  'לספר סיפור חזותי עקבי דרך צבע',
];

const SOURCES = ['Newton · Opticks · 1704', 'Itten · The Art of Color · 1961', 'WCAG 2.2 · 1.4.3', 'ISO 3664 · סביבת צפייה ניטרלית'];

function ToolVisual({ kind }: { kind: string }) {
  if (kind === 'spectrum') {
    return <div className="h-full w-full" style={{ background: 'linear-gradient(90deg,#1a0606 0%,#3d0000 14%,#ff0000 15%,#ff8800 25%,#ffff00 33%,#00ff00 45%,#0088ff 55%,#4400cc 62%,#8800aa 69%,#1a0033 70%,#07000f 100%)' }} />;
  }
  if (kind === 'domains') {
    return (
      <div className="grid h-full w-full grid-cols-3">
        {(['violet', 'green', 'blue'] as const).map(k => <div key={k} style={{ background: `linear-gradient(180deg, ${newtonHex(k)}, ${newtonHex(k)}55)` }} />)}
      </div>
    );
  }
  return (
    <div className="grid h-full w-full grid-cols-7">
      {NEWTON_SEVEN.map(c => <div key={c.key} style={{ background: c.hex }} />)}
    </div>
  );
}

const Landing = () => {
  const reduce = useReducedMotion();
  const rise = (i = 0) => (reduce ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.2, 0.7, 0.2, 1] },
  });

  return (
    <PageLayout title={APP_NAME} wide>
      {/* Hero */}
      <section className="grid grid-cols-[minmax(0,1fr)] items-center gap-8 overflow-hidden pb-16 pt-4 md:pb-24 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="space-y-6">
          <p className="label-mono">כלי עבודה למעצבים · עברית · אד' ענת שטיבלמן</p>
          <h1 className="display text-[2.9rem] text-newton-text sm:text-[3.6rem] md:text-[4.6rem]">
            תורת הצבע,<br />ככלי עבודה<br />למעצבים
          </h1>
          <EditableText id="home.lead" as="p" className="max-w-[560px] text-lg leading-relaxed text-newton-muted">
            להבין איך צבע פועל, איך הוא נתפס, איך הוא מופיע בטבע, במדע ובתרבות, ואיך מתרגמים את כל זה להחלטות עיצוב מדויקות.
          </EditableText>
          <div className="flex flex-wrap gap-2">
            <Link to="/wheel" className="btn is-primary px-7">להתחיל בגלגל הצבעים</Link>
            <a href="#map" className="btn px-7">מה יש כאן</a>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 pt-2" aria-label="מקורות ותקנים">
            {SOURCES.map(s => <li key={s} className="label-mono">{s}</li>)}
          </ul>
        </div>
        <HeroWheel3D />
      </section>

      {/* Content map */}
      <section id="map" aria-labelledby="map-title" className="py-12 md:py-16">
        <motion.div {...rise()} className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono mb-2">מפת התוכן</p>
            <h2 id="map-title" className="display text-[2.2rem] md:text-[3rem]">שלושה כלים, מסלול אחד</h2>
          </div>
          <p className="max-w-[420px] text-newton-muted">מתחילים בגלגל כדי לבנות פלטה, ממשיכים לספקטרום כדי להבין כל צבע, ומסיימים בעולם כדי לראות מה צבע עושה באמת.</p>
        </motion.div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
          {TOOLS.map((t, i) => (
            <motion.div key={t.to} {...rise(i)}>
              <Link to={t.to} className="newton-panel card-press flex h-full flex-col">
                <div className="h-28 border-b border-white/10"><ToolVisual kind={t.visual} /></div>
                <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
                  <span className="label-mono">{t.n}</span>
                  <h3 className="text-2xl font-light text-newton-text">{t.title}</h3>
                  <p className="text-newton-text/90">{t.doing}</p>
                  <p className="flex-1 text-sm leading-relaxed text-newton-muted"><span className="label-mono ml-2">תוצאה</span>{t.result}</p>
                  <span className="label-mono text-newton-text">פתיחה ←</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Vision, goal, tools, results */}
      <section aria-labelledby="pillars-title" className="py-12 md:py-16">
        <h2 id="pillars-title" className="sr-only">חזון, מטרה, כלים ותוצאות</h2>
        <div className="grid grid-cols-[minmax(0,1fr)] border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <motion.div key={p.k} {...rise(i)} className="border-white/10 p-6 md:p-7 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 lg:[&:not(:first-child)]:border-r lg:[&:not(:first-child)]:border-t-0">
              <p className="label-mono mb-4">0{i + 1} · {p.k}</p>
              <h3 className="mb-3 text-xl font-light text-newton-text">{p.t}</h3>
              <p className="text-sm leading-relaxed text-newton-muted">{p.d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-title" className="py-12 md:py-16">
        <motion.div {...rise()} className="mb-8">
          <p className="label-mono mb-2">שיטה</p>
          <h2 id="how-title" className="display text-[2.2rem] md:text-[3rem]">איך זה עובד</h2>
          <p className="mt-3 max-w-[640px] text-newton-muted">המערכת מציגה את תורת הצבע לא רק כחוק חזותי, אלא כשפה של תפיסה, חומר, הקשר ומשמעות.</p>
        </motion.div>
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.li key={s.title} {...rise(i)} className="newton-panel relative overflow-hidden p-6">
              <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: NEWTON_SEVEN[i * 2].hex }} aria-hidden="true" />
              <span className="font-mono text-4xl font-light text-newton-text/30">0{i + 1}</span>
              <h3 className="mb-2 mt-3 text-xl font-light text-newton-text">{s.title}</h3>
              <p className="text-sm leading-relaxed text-newton-muted">{s.text}</p>
            </motion.li>
          ))}
        </ol>
      </section>

      {/* Colour in the world */}
      <section aria-labelledby="world-title" className="py-12 md:py-16">
        <motion.div {...rise()} className="mb-8">
          <p className="label-mono mb-2">הקשר</p>
          <h2 id="world-title" className="display text-[2.2rem] md:text-[3rem]">צבע בעולם: מהעין אל הפרשנות</h2>
          <p className="mt-3 max-w-[640px] text-newton-muted">צבע אינו רק תכונה נראית. הוא מנגנון, אות, התאמה, חומר, סמל ושפה.</p>
        </motion.div>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {WORLD.map((w, i) => (
            <motion.div key={w.title} {...rise(i)} className="newton-panel p-5">
              <span className="swatch mb-4 block h-2 w-10" style={{ background: newtonHex(w.key) }} aria-hidden="true" />
              <h3 className="mb-2 text-lg font-light text-newton-text">{w.title}</h3>
              <p className="text-sm leading-relaxed text-newton-muted">{w.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Two layers + uses */}
      <section className="grid grid-cols-[minmax(0,1fr)] gap-4 py-12 md:py-16 lg:grid-cols-2">
        <motion.div {...rise()} className="newton-panel p-6 md:p-8">
          <p className="label-mono mb-3">לא רק הסבר. גם פרשנות.</p>
          <p className="text-lg font-light leading-relaxed text-newton-text">
            הכלי מציג צבע בשתי שכבות משלימות: איך הוא עובד, ומה הוא אומר. מצד אחד תפיסה, מדע, מבנה ויחסים. מצד שני תרבות, רגש, סימבוליקה והקשר.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-newton-muted">
            כל מה שמחושב מסומן כחישוב, וכל מה שמפורש מסומן כפרשנות. ההחלטה נשארת אצל המעצבת.
          </p>
        </motion.div>
        <motion.div {...rise(1)} className="newton-panel p-6 md:p-8">
          <p className="label-mono mb-4">מה מעצבים יכולים לעשות עם זה</p>
          <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {USES.map((u, i) => (
              <li key={u} className="flex items-start gap-3 text-newton-text">
                <span className="mt-2 h-2 w-2 shrink-0" style={{ background: NEWTON_SEVEN[i % 7].hex }} aria-hidden="true" />
                <span>{u}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Final CTA */}
      <motion.section {...rise()} className="newton-panel mt-8 overflow-hidden text-center">
        <div className="spectrum-rule" aria-hidden="true" />
        <div className="space-y-5 p-8 md:p-12">
          <h2 className="display text-[2.2rem] md:text-[3rem]">להפוך צבע ממידע להחלטה עיצובית</h2>
          <p className="mx-auto max-w-[600px] text-newton-muted">התחילו לחקור את תורת הצבע ככלי של הבנה, הבחנה ויישום, בין טבע, מדע, תרבות ועיצוב.</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/wheel" className="btn is-primary px-7">פתיחת הגלגל</Link>
            <Link to="/color-psychology" className="btn px-7">מסע בספקטרום</Link>
            <Link to="/how-colors-work" className="btn px-7">צבע בעולם</Link>
          </div>
        </div>
      </motion.section>
    </PageLayout>
  );
};

export default Landing;
