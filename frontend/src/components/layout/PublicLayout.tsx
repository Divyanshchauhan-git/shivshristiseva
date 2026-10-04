import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
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
      {/* Spacer so bottom navigation bar does not cover footer content on mobile */}
      <div className="h-[calc(4.5rem+env(safe-area-inset-bottom,0px))] bg-[#05181a] md:hidden" aria-hidden="true" />
    </div>
  );
}
