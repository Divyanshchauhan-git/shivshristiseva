import { Link } from 'react-router-dom';
import { brand } from '@/config/brand';
import { cn } from '@/utils/format';

/** Official circular emblem mark */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/logo_emblem.png"
      alt="Shivshristi Seva Sansthan Emblem"
      className={cn('rounded-full object-contain shrink-0 drop-shadow-sm', className)}
      loading="eager"
      width={48}
      height={48}
    />
  );
}

export function Logo({
  light,
  className,
  showTaxBadge = true,
}: {
  light?: boolean;
  className?: string;
  showTaxBadge?: boolean;
}) {
  return (
    <Link
      to="/"
      className={cn('group inline-flex items-center gap-2.5 sm:gap-3 rounded-lg shrink-0', className)}
      aria-label={`${brand.name}, home`}
    >
      <LogoMark className="h-9 w-9 sm:h-11 sm:w-11 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col justify-center leading-none">
        {/* Main Brand Title: Shivshristi Seva */}
        <span className="flex items-baseline gap-1 sm:gap-1.5">
          <span
            className={cn(
              'font-sans text-base sm:text-[1.28rem] font-extrabold tracking-tight',
              light ? 'text-white' : 'text-[#0e3b32] dark:text-[#ecfdf5]'
            )}
          >
            Shivshristi
          </span>
          <span className="font-sans text-base sm:text-[1.28rem] font-extrabold tracking-tight text-[#e58e1b]">
            Seva
          </span>
        </span>

        {/* Subtitle: SANSTHAN • शिवसृष्टि सेवा संस्थान */}
        <span
          className={cn(
            'mt-0.5 flex items-center gap-1 sm:gap-1.5 text-[0.52rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.20em] sm:tracking-[0.24em]',
            light ? 'text-white/70' : 'text-stone-600 dark:text-stone-300'
          )}
        >
          <span>SANSTHAN</span>
          <span className="text-stone-400 dark:text-stone-500">•</span>
          <span
            className="font-deva normal-case tracking-normal text-[0.58rem] sm:text-[0.68rem] font-medium"
            lang="hi"
          >
            {brand.nativeName}
          </span>
        </span>

        {/* 80G & 12A TAX EXEMPT Pill Badge */}
        {showTaxBadge && (
          <span
            className={cn(
              'hidden md:inline-flex items-center gap-1.5 mt-1 self-start rounded-full px-2 py-0.5 text-[0.55rem] font-bold uppercase tracking-wider',
              light
                ? 'bg-white/10 text-emerald-200 border border-white/20'
                : 'bg-[#e7f7f2] text-[#0d5945] border border-[#a5e8d2] dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800/60'
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
            <span>80G &amp; 12A TAX EXEMPT</span>
          </span>
        )}
      </span>
    </Link>
  );
}
