import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  Heart,
  Menu,
  X,
  ShieldCheck,
  Home as HomeIcon,
  Sparkles,
  Phone,
  MessageCircle,
  Users,
  CheckCircle2,
  Building2,
  Calendar,
  Camera,
  HelpCircle,
  Info,
  Award,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { mainNav, type NavItem } from '@/config/navigation';
import { programmes } from '@/data/programmes';
import { Icon } from '@/components/media/Icon';
import { ButtonLink } from '@/components/ui/Button';
import { cn } from '@/utils/format';
import { brand } from '@/config/brand';
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
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [open, setOpen]);

  return (
    <li ref={ref} className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        className={cn(
          'flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.92rem] font-semibold transition-colors hover:bg-surface-2',
          active ? 'text-brand-text' : 'text-fg'
        )}
      >
        {item.label}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className={cn('absolute top-full z-50 pt-2', isWork ? 'left-1/2 w-[min(46rem,92vw)] -translate-x-1/2' : 'left-0 w-80')}>
          <div className="animate-rise rounded-2xl border border-line bg-surface p-3 shadow-lift [animation-duration:.25s]">
            {isWork ? (
              <div className="grid gap-1 sm:grid-cols-2">
                {programmes.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/programmes/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex gap-3 rounded-xl p-2.5 hover:bg-surface-2 transition-colors"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-text">
                      <Icon name={p.icon} className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold">{p.title}</span>
                      <span className="block truncate text-xs text-muted">{p.short}</span>
                    </span>
                  </Link>
                ))}
                <Link
                  to="/programmes"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-brand-soft/70 p-2.5 text-sm font-semibold text-brand-text hover:bg-brand-soft"
                >
                  See all programmes →
                </Link>
              </div>
            ) : (
              <ul className="space-y-1">
                {item.children!.map((c) => (
                  <li key={c.to}>
                    <Link
                      to={c.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl p-2.5 hover:bg-surface-2 transition-colors"
                    >
                      <span className="block text-sm font-semibold">{c.label}</span>
                      {c.text && <span className="block text-xs text-muted">{c.text}</span>}
                    </Link>
                  </li>
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
  const { pathname } = useLocation();

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 24);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobile(false);
    setOpenMenu(null);
  }, [pathname]);

  // Lock background scroll when drawer is open
  useEffect(() => {
    if (!mobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobile(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobile]);

  const closeMobile = () => setMobile(false);

  return (
    <>
      <header
        className={cn(
          'sticky top-[env(safe-area-inset-top,0px)] z-50 border-b transition-all duration-300',
          scrolled ? 'border-line/80 bg-surface/95 shadow-soft backdrop-blur-md' : 'border-line/30 bg-bg/85 backdrop-blur-sm'
        )}
      >
        <div className="container-page flex h-[4.25rem] sm:h-[4.75rem] items-center justify-between gap-2 sm:gap-4">
          <Logo />

          {/* Desktop Navigation (>= xl) */}
          <nav aria-label="Main" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) =>
                item.children ? (
                  <Dropdown key={item.label} item={item} open={openMenu === item.label} setOpen={(v) => setOpenMenu(v ? item.label : null)} />
                ) : (
                  <li key={item.label}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'block whitespace-nowrap rounded-full px-3 py-2 text-[0.92rem] font-semibold transition-colors hover:bg-surface-2',
                          isActive ? 'text-brand-text bg-brand-soft/60' : 'text-fg/90 hover:text-fg'
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Verify Button - 1 tap directly to /verify on both mobile & desktop */}
            <Link
              to="/verify"
              className={cn(
                'flex items-center gap-1 sm:gap-1.5 rounded-full border px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all shadow-sm active:scale-95',
                pathname === '/verify'
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-emerald-500/30 bg-emerald-50/90 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-500/50'
              )}
              title="Official Verification Portal"
            >
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
              <span className="text-[0.72rem] sm:text-xs">Verify</span>
            </Link>

            {/* Donate CTA */}
            <ButtonLink
              to="/donate"
              variant="donate"
              size="sm"
              className="px-3 sm:px-5 shadow-glow"
              icon={<Heart className="h-3.5 w-3.5 fill-current text-amber-950 animate-pulseSlow" aria-hidden="true" />}
            >
              <span className="text-xs sm:text-sm font-bold">Donate</span>
            </ButtonLink>

            {/* Hamburger Button on Mobile / Tablet */}
            <button
              type="button"
              onClick={() => setMobile(true)}
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-line bg-surface hover:bg-surface-2 xl:hidden text-fg shadow-sm active:scale-95 transition-all"
              aria-label="Open mobile navigation menu"
              aria-expanded={mobile}
              aria-controls="mobile-nav"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
       * MOBILE APP BOTTOM NAVIGATION BAR (Visible on mobile/tablet < md)
       * Persistent, 1-tap navigation for Home, Verify, Donate, Work & Menu
       * ==================================================================== */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/95 backdrop-blur-lg shadow-2xl md:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.35rem)' }}
      >
        <div className="grid grid-cols-5 items-center justify-around px-1 py-1 text-center">
          {/* 1. Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 text-[0.65rem] font-bold transition-colors active:scale-95',
                isActive ? 'text-brand' : 'text-stone-600 hover:text-stone-900'
              )
            }
          >
            <HomeIcon className="h-5 w-5" />
            <span className="mt-0.5">Home</span>
          </NavLink>

          {/* 2. Verify Portal (DIRECT 1-TAP TO /verify) */}
          <NavLink
            to="/verify"
            className={({ isActive }) =>
              cn(
                'relative flex flex-col items-center justify-center py-1 text-[0.65rem] font-bold transition-colors active:scale-95',
                isActive ? 'text-emerald-700' : 'text-emerald-800 hover:text-emerald-950'
              )
            }
          >
            <span className="relative">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </span>
            <span className="mt-0.5 font-extrabold text-emerald-900">Verify</span>
          </NavLink>

          {/* 3. Donate (Center highlighted CTA) */}
          <NavLink
            to="/donate"
            className="flex flex-col items-center justify-center -mt-4 active:scale-95 transition-transform"
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-stone-950 shadow-glow ring-2 ring-white">
              <Heart className="h-6 w-6 fill-current animate-pulseSlow" />
            </div>
            <span className="mt-0.5 text-[0.62rem] font-black uppercase tracking-wider text-amber-900">Donate</span>
          </NavLink>

          {/* 4. Programmes / Our Work */}
          <NavLink
            to="/programmes"
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center py-1 text-[0.65rem] font-bold transition-colors active:scale-95',
                isActive ? 'text-brand' : 'text-stone-600 hover:text-stone-900'
              )
            }
          >
            <Sparkles className="h-5 w-5" />
            <span className="mt-0.5">Work</span>
          </NavLink>

          {/* 5. Menu Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobile(true)}
            className="flex flex-col items-center justify-center py-1 text-[0.65rem] font-bold text-stone-600 hover:text-stone-900 active:scale-95 transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="mt-0.5">Menu</span>
          </button>
        </div>
      </nav>

      {/* ====================================================================
       * FULL MOBILE NAVIGATION DRAWER
       * Complete directory of all pages with categorized links & 1-tap exit
       * ==================================================================== */}
      {mobile && (
        <div id="mobile-nav" role="dialog" aria-modal="true" aria-label="Mobile Navigation" className="fixed inset-0 z-[70] xl:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#06191c]/60 backdrop-blur-sm transition-opacity" onClick={closeMobile} aria-hidden="true" />

          {/* Drawer Content */}
          <div
            className="absolute inset-y-0 right-0 flex w-full max-w-[21rem] sm:max-w-sm flex-col bg-surface shadow-2xl animate-[rise_.2s_ease-out_both]"
            style={{ paddingTop: 'env(safe-area-inset-top,0px)', paddingBottom: 'env(safe-area-inset-bottom,0px)' }}
          >
            {/* Drawer Top Header */}
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                onClick={closeMobile}
                className="grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-2 text-fg hover:bg-surface active:scale-95"
                aria-label="Close menu"
                autoFocus
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Navigation Body */}
            <nav aria-label="Mobile Directory" className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
              {/* FEATURED: Instant Verification Portal Banner */}
              <Link
                to="/verify"
                onClick={closeMobile}
                className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-50/90 to-teal-50/90 p-3.5 text-emerald-950 shadow-sm transition-all hover:border-emerald-600 active:scale-[0.98]"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-emerald-950">Online Verification</span>
                    <span className="rounded-full bg-emerald-600 px-1.5 py-0.2 text-[0.6rem] font-bold text-white uppercase">Live</span>
                  </div>
                  <p className="text-[0.72rem] text-emerald-800 leading-snug mt-0.5">
                    Verify Volunteer IDs, 80G Receipts &amp; Certificates
                  </p>
                </div>
              </Link>

              {/* 1. Core Pages */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted px-2 mb-2">Explore</p>
                <ul className="space-y-1">
                  {[
                    { label: 'Home', to: '/', icon: HomeIcon },
                    { label: 'About Us & Mission', to: '/about', icon: Info },
                    { label: 'Our Team & Governance', to: '/team', icon: Users },
                    { label: 'Our Work & Programmes', to: '/programmes', icon: Sparkles },
                    { label: 'Urgent Campaigns', to: '/campaigns', icon: Heart },
                    { label: 'Impact & Audited Metrics', to: '/impact', icon: Award },
                    { label: 'Real Field Stories', to: '/stories', icon: FileCheck2 },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={closeMobile}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                            isActive ? 'bg-brand text-white shadow-sm' : 'text-fg hover:bg-surface-2 active:bg-surface-2'
                          )}
                        >
                          <IconComp className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-brand-text')} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 2. Trust, Accreditations & Transparency */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted px-2 mb-2">Trust &amp; Governance</p>
                <ul className="space-y-1">
                  {[
                    { label: 'Online Verification Portal', to: '/verify', icon: ShieldCheck, badge: 'Official' },
                    { label: 'Transparency & Audits', to: '/transparency', icon: Building2 },
                    { label: 'Official Certifications (Section 8, ISO)', to: '/#official-certifications', icon: CheckCircle2 },
                    { label: 'Frequently Asked Questions (FAQ)', to: '/faq', icon: HelpCircle },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={closeMobile}
                          className={cn(
                            'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                            isActive ? 'bg-brand text-white shadow-sm' : 'text-fg hover:bg-surface-2 active:bg-surface-2'
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <IconComp className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-emerald-600')} />
                            <span>{item.label}</span>
                          </span>
                          {item.badge && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-800">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 3. Get Involved */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted px-2 mb-2">Get Involved</p>
                <ul className="space-y-1">
                  {[
                    { label: 'Donate Online (50% Tax Relief)', to: '/donate', icon: Heart },
                    { label: 'Volunteer With Us', to: '/volunteer', icon: Users },
                    { label: 'Corporate CSR Partnerships', to: '/csr', icon: Building2 },
                    { label: 'Start a Fundraiser', to: '/fundraise', icon: Sparkles },
                    { label: 'Campus & Community', to: '/get-involved/campus', icon: Layers },
                    { label: 'Careers & Internships', to: '/careers', icon: Info },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={closeMobile}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                            isActive ? 'bg-brand text-white shadow-sm' : 'text-fg hover:bg-surface-2 active:bg-surface-2'
                          )}
                        >
                          <IconComp className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-amber-600')} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* 4. Events, Media & Contact */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-widest text-muted px-2 mb-2">Media &amp; Contact</p>
                <ul className="space-y-1">
                  {[
                    { label: 'Events & Drives', to: '/events', icon: Calendar },
                    { label: 'Photo & Video Gallery', to: '/gallery', icon: Camera },
                    { label: 'Contact Us & Office', to: '/contact', icon: Phone },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isActive = pathname === item.to;
                    return (
                      <li key={item.to}>
                        <Link
                          to={item.to}
                          onClick={closeMobile}
                          className={cn(
                            'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all',
                            isActive ? 'bg-brand text-white shadow-sm' : 'text-fg hover:bg-surface-2 active:bg-surface-2'
                          )}
                        >
                          <IconComp className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-brand-text')} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            {/* Bottom Actions inside drawer */}
            <div className="border-t border-line p-4 space-y-2.5 bg-surface-2/40">
              <ButtonLink
                to="/donate"
                variant="donate"
                size="md"
                className="w-full shadow-glow"
                onClick={closeMobile}
                icon={<Heart className="h-4 w-4 fill-current" />}
              >
                DONATE (80G TAX RELIEF)
              </ButtonLink>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={`tel:${brand.contact.phone}`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-surface p-2.5 font-bold text-fg hover:bg-surface-2 active:scale-95"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-500" />
                  <span>Call Us</span>
                </a>
                <a
                  href={`https://wa.me/${brand.contact.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-50 p-2.5 font-bold text-emerald-800 hover:bg-emerald-100 active:scale-95"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
