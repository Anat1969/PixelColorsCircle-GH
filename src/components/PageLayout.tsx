import { useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import TopNav from '@/components/TopNav';
import { APP_NAME } from '@/data/site';

interface Props {
  title: string;
  children: ReactNode;
  wide?: boolean;
}

/** Shared page frame: top bar, skip link, page title, gentle entrance. */
export default function PageLayout({ title, children, wide = false }: Props) {
  const reduce = useReducedMotion();

  useEffect(() => {
    document.title = title === APP_NAME ? `${APP_NAME} · גלגל ניוטון למעצבים` : `${title} · ${APP_NAME}`;
  }, [title]);

  return (
    <div dir="rtl" className="newton-app">
      <a href="#main"
        className="btn is-primary sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-2 focus:z-[60]">
        דילוג לתוכן
      </a>
      <TopNav />
      <motion.main id="main" tabIndex={-1}
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
        className={`mx-auto w-full px-4 pb-24 pt-[124px] outline-none md:px-6 md:pt-[96px] ${wide ? 'max-w-[1380px]' : 'max-w-[1040px]'}`}>
        {children}
      </motion.main>
      <footer className="border-t border-white/[0.06] px-4 py-8 text-center">
        <p className="label-mono">אד' ענת שטיבלמן · A&amp;I · {APP_NAME}</p>
      </footer>
    </div>
  );
}

/** Page heading block: mono kicker, thin large title, lead paragraph. */
export function PageHeader({ kicker, title, lead }: { kicker: string; title: string; lead?: ReactNode }) {
  return (
    <header className="mb-10 space-y-4 md:mb-14">
      <p className="label-mono">{kicker}</p>
      <h1 className="display text-[2.4rem] text-newton-text md:text-[3.6rem]">{title}</h1>
      {lead && <div className="max-w-[720px] text-[1.05rem] leading-relaxed text-newton-muted md:text-lg">{lead}</div>}
    </header>
  );
}
