import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import { cn } from '@/utils/format';

/** Mark: a rising wing over a horizon line. Wordmark reads from brand config. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#0F3D44" />
      <path d="M9 31c8.5-1 15.5-6.6 19-16.5 1.4 7.6 5.3 12.8 11 15.2-8.3 4.2-18.5 5.4-30 1.3z" fill="#EFA23A" />
      <path d="M17 29.6c4.2-1.4 7.7-4.2 10.2-8.6" stroke="#0F3D44" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M10 36.5h28" stroke="#7FC7C0" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  const [first, ...rest] = brand.shortName.split(' ');
  return (
    <Link to="/" className={cn('group inline-flex items-center gap-2.5 rounded-lg', className)} aria-label={`${brand.name}, home`}>
      <LogoMark className="h-10 w-10 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
      <span className="flex flex-col leading-none">
        <span className={cn('font-display text-[1.28rem] tracking-tight', light ? 'text-white' : 'text-fg')}>
          {first} <span className={light ? 'text-[#F4B154]' : 'text-brand-text'}>{rest.join(' ')}</span>
        </span>
        <span className={cn('mt-1 flex items-center gap-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em]', light ? 'text-white/65' : 'text-muted')}>
          Sansthan <span className="hidden font-deva sm:inline text-[0.72rem] normal-case tracking-normal" lang="hi">{brand.nativeName}</span>
        </span>
      </span>
    </Link>
  );
}
