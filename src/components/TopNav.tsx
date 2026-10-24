import { Link, NavLink } from 'react-router-dom';
import AppIcon from '@/components/AppIcon';
import AIMenu from '@/components/AIMenu';
import { NAV_ITEMS, APP_NAME } from '@/data/site';

/**
 * Fixed top bar on every page: the app name (home), content navigation,
 * and the single A&I logo button. Nothing else lives here.
 */
const TopNav = () => (
  <header dir="rtl" className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08]"
    style={{ background: 'linear-gradient(180deg, hsl(220 6% 9% / 0.96), hsl(220 6% 8% / 0.9))', backdropFilter: 'blur(14px)' }}>
    <div className="mx-auto grid max-w-[1380px] grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 px-4 py-2.5 md:grid-cols-[auto_minmax(0,1fr)_auto] md:px-6">
      <Link to="/" className="group col-start-1 row-start-1 flex min-w-0 items-center gap-3 justify-self-start" aria-label={`${APP_NAME}, לדף הבית`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden border border-white/10 shadow-[0_6px_14px_-6px_rgba(0,0,0,.9)] transition-transform duration-200 group-hover:-translate-y-0.5">
          <AppIcon size={36} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[1.05rem] font-medium leading-tight text-newton-text">{APP_NAME}</span>
          <span className="label-mono block truncate text-[10px]">NEWTON · OPTICKS 1704</span>
        </span>
      </Link>

      <nav aria-label="ניווט ראשי"
        className="col-span-2 col-start-1 row-start-2 grid min-w-0 grid-cols-3 gap-1.5 md:col-span-1 md:col-start-2 md:row-start-1 md:flex md:justify-center md:gap-2">
        {NAV_ITEMS.map(({ label, short, to }) => (
          <NavLink key={to} to={to} className="btn btn-sm min-w-0 px-2 md:px-4">
            <span className="truncate md:hidden">{short}</span>
            <span className="hidden truncate md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="col-start-2 row-start-1 justify-self-end md:col-start-3">
        <AIMenu />
      </div>
    </div>
    <div className="spectrum-rule opacity-70" aria-hidden="true" />
  </header>
);

export default TopNav;
