import { Link } from 'react-router-dom';
import { ArrowRight, Siren } from 'lucide-react';
import { brand } from '@/config/brand';

export function AnnouncementBar() {
  const e = brand.emergency;
  if (e) {
    return (
      <div className="bg-hibiscus text-white">
        <div className="container-page flex items-center justify-center gap-2 py-2 text-sm">
          <Siren className="h-4 w-4 shrink-0" aria-hidden="true" />
          <p className="truncate font-medium">{e.message}</p>
          <Link to={`/campaigns/${e.campaignSlug}`} className="inline-flex shrink-0 items-center gap-1 font-semibold underline underline-offset-4">Help now <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    );
  }
  return (
    <div className="border-b border-emerald-900/30 bg-gradient-to-r from-[#072427] via-[#0B3B3E] to-[#072427] text-white/95">
      <div className="container-page flex items-center justify-between py-2 text-[0.82rem]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 shrink-0 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-amber-300 ring-1 ring-amber-400/30">
            50% 80G Tax Relief
          </span>
          <p className="truncate text-white/90 text-xs sm:text-sm">{brand.announcement}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-xs">
          <Link to="/verify" className="inline-flex items-center gap-1 font-bold text-amber-300 hover:text-white underline underline-offset-2">
            Verify NGO <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-white/60">Helpline: <a href={`tel:${brand.contact.phone}`} className="font-semibold text-amber-300 hover:underline">{brand.contact.phone}</a></span>
            <Link to="/transparency" className="inline-flex items-center gap-1 font-semibold text-white/80 hover:text-white hover:underline">
              Documents
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
