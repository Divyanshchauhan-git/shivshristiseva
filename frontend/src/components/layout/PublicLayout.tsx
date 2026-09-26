import { Suspense, useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { AnnouncementBar } from './AnnouncementBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { LoadingBlock } from '@/components/ui/States';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // Wait for lazy content, then bring the anchored section into view.
      const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
      return () => clearTimeout(t);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

import { Phone } from 'lucide-react';
import { brand } from '@/config/brand';

/** Floating donate and helpline bar on small screens, hidden on donation flow itself. */
function MobileDonateBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 300); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f); }, []);
  if (pathname.startsWith('/donate') || !show) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line/80 bg-white/95 px-3 py-2 shadow-2xl backdrop-blur-md animate-rise [animation-duration:.25s] md:hidden" style={{ paddingBottom: 'calc(0.6rem + env(safe-area-inset-bottom, 0px))' }}>
      <div className="flex items-center gap-2">
        <a
          href={`tel:${brand.contact.phone}`}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-brand-text hover:bg-brand-soft active:scale-95 transition-transform"
          aria-label="Call emergency helpline"
        >
          <Phone className="h-4 w-4" />
        </a>
        <Link
          to="/donate"
          className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-4 text-xs font-bold uppercase tracking-wider text-stone-950 shadow-glow active:scale-[0.98] transition-transform"
        >
          <Heart className="h-4 w-4 fill-current animate-pulseSlow" aria-hidden="true" />
          <span>Donate Now</span>
          <span className="rounded-full bg-stone-950/15 px-1.5 py-0.5 text-[0.65rem] font-bold">80G</span>
        </Link>
      </div>
    </div>
  );
}

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus(); }} className="sr-only z-[100] rounded-lg bg-brand px-4 py-2 text-brand-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Skip to main content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Suspense fallback={<div className="container-page py-16"><LoadingBlock /></div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <div className="h-[calc(4rem+env(safe-area-inset-bottom,0px))] bg-[#05181a] md:hidden" aria-hidden="true" />
      <MobileDonateBar />
    </div>
  );
}
