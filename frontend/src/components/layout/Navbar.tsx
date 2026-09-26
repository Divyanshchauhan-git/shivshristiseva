import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Heart, Menu, X } from 'lucide-react';
import { mainNav, type NavItem } from '@/config/navigation';
import { programmes } from '@/data/programmes';
import { Icon } from '@/components/media/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/format';
import { Logo } from './Logo';

function Dropdown({ item, open, setOpen }: { item: NavItem; open: boolean; setOpen: (v: boolean) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const { pathname } = useLocation();
  const active = pathname.startsWith(item.to) || item.children!.some((c) => pathname.startsWith(c.to));
  const isWork = item.to === '/programmes';
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); ref.current?.querySelector('button')?.focus(); } };
    document.addEventListener('mousedown', onDoc); document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen]);
  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen(!open)} onMouseEnter={() => setOpen(true)}
        className={cn('flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.92rem] font-semibold transition-colors hover:bg-surface-2', active ? 'text-brand-text' : 'text-fg')}>
        {item.label}<ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className={cn('absolute top-full z-50 pt-2', isWork ? 'left-1/2 w-[min(46rem,92vw)] -translate-x-1/2' : 'left-0 w-80')}>
          <div className="animate-rise rounded-2xl border border-line bg-surface p-3 shadow-lift [animation-duration:.25s]">
            {isWork ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {programmes.map((p) => (
                  <Link key={p.slug} to={`/programmes/${p.slug}`} onClick={() => setOpen(false)} className="flex gap-3 rounded-xl p-2.5 hover:bg-surface-2">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text"><Icon name={p.icon} className="h-[18px] w-[18px]" /></span>
                    <span className="min-w-0"><span className="block text-sm font-semibold">{p.title}</span><span className="block truncate text-xs text-muted">{p.short}</span></span>
                  </Link>
                ))}
                <Link to="/programmes" onClick={() => setOpen(false)} className="flex items-center justify-center rounded-xl bg-brand-soft/70 p-2.5 text-sm font-semibold text-brand-text hover:bg-brand-soft">See all programmes →</Link>
              </div>
            ) : (
              <ul>
                {item.children!.map((c) => (
                  <li key={c.to}><Link to={c.to} onClick={() => setOpen(false)} className="block rounded-xl p-2.5 hover:bg-surface-2"><span className="block text-sm font-semibold">{c.label}</span>{c.text && <span className="block text-xs text-muted">{c.text}</span>}</Link></li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </li>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => { const f = () => setScrolled(window.scrollY > 24); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  useEffect(() => { setMobile(false); setOpenMenu(null); }, [pathname]);
  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobile(false);
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener('keydown', onKey); };
  }, [mobile]);

  return (
    <header className={cn('sticky top-[env(safe-area-inset-top,0px)] z-50 border-b transition-all duration-300', scrolled ? 'border-line/80 bg-surface/95 shadow-soft backdrop-blur-md' : 'border-line/30 bg-bg/85 backdrop-blur-sm')}>
      <div className="container-page flex h-[4.75rem] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => item.children ? (
              <Dropdown key={item.label} item={item} open={openMenu === item.label} setOpen={(v) => setOpenMenu(v ? item.label : null)} />
            ) : (
              <li key={item.label}>
                <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => cn('block whitespace-nowrap rounded-full px-3 py-2 text-[0.92rem] font-semibold transition-colors hover:bg-surface-2', isActive ? 'text-brand-text bg-brand-soft/60' : 'text-fg/90 hover:text-fg')}>{item.label}</NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2.5">
          <span className="hidden 2xl:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-50/90 px-2.5 py-1 text-[0.73rem] font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            80G Certified
          </span>
          <ButtonLink to="/donate" variant="donate" size="md" className="px-5 shadow-glow" icon={<Heart className="h-4 w-4 fill-current text-amber-950 animate-pulseSlow" aria-hidden="true" />}>
            <span className="sm:hidden">Donate</span><span className="hidden sm:inline">DONATE NOW</span>
          </ButtonLink>
          <button type="button" onClick={() => setMobile(true)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface hover:bg-surface-2 xl:hidden" aria-label="Open menu" aria-expanded={mobile} aria-controls="mobile-nav">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {mobile && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] xl:hidden">
          <div className="absolute inset-0 bg-[#06191c]/50" onClick={() => setMobile(false)} aria-hidden="true" />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface shadow-lift animate-[rise_.25s_ease-out_both]" style={{ paddingTop: 'env(safe-area-inset-top,0px)', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}>
            <div className="flex h-[4.5rem] items-center justify-between border-b border-line px-4">
              <Logo />
              <button type="button" onClick={() => setMobile(false)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-2" aria-label="Close menu" autoFocus><X className="h-5 w-5" /></button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-0.5">
                {mainNav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button type="button" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-base font-semibold hover:bg-surface-2">
                          {item.label}<ChevronDown className={cn('h-5 w-5 transition-transform', expanded === item.label && 'rotate-180')} aria-hidden="true" />
                        </button>
                        {expanded === item.label && (
                          <ul className="mb-2 ml-3 border-l-2 border-marigold/60 pl-2">
                            <li><Link to={item.to} className="block rounded-lg px-3 py-2 text-sm font-semibold text-brand-text hover:bg-surface-2">Overview</Link></li>
                            {item.children.map((c) => <li key={c.to}><Link to={c.to} className="block rounded-lg px-3 py-2 text-sm hover:bg-surface-2">{c.label}</Link></li>)}
                          </ul>
                        )}
                      </>
                    ) : (
                      <NavLink to={item.to} end={item.to === '/'} className={({ isActive }) => cn('block rounded-xl px-3 py-3 text-base font-semibold hover:bg-surface-2', isActive && 'bg-brand-soft text-brand-text')}>{item.label}</NavLink>
                    )}
                  </li>
                ))}
                {[['Events', '/events'], ['Gallery', '/gallery'], ['FAQ', '/faq'], ['Transparency', '/transparency']].map(([l, t]) => (
                  <li key={t}><NavLink to={t} className="block rounded-xl px-3 py-2.5 text-sm text-muted hover:bg-surface-2">{l}</NavLink></li>
                ))}
              </ul>
            </nav>
            <div className="border-t border-line p-4">
              <ButtonLink to="/donate" variant="donate" size="lg" className="w-full" icon={<Heart className="h-4 w-4 fill-current" />}>DONATE NOW</ButtonLink>
              <ButtonLink to="/volunteer" variant="secondary" size="md" className="mt-2 w-full">Join as a volunteer</ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
