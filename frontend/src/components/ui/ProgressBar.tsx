import { cn } from '@/utils/format';

/** Campaign progress. Fills in on mount (CSS only, so it is always correct at rest) and exposes its value to assistive tech. */
export function ProgressBar({ value, label, className, tone = 'marigold', size = 'md' }: { value: number; label: string; className?: string; tone?: 'marigold' | 'leaf' | 'brand' | 'hibiscus'; size?: 'sm' | 'md' | 'lg' }) {
  const v = Math.max(0, Math.min(100, value));
  const fill = { marigold: 'bg-marigold', leaf: 'bg-leaf', brand: 'bg-brand', hibiscus: 'bg-hibiscus' }[tone];
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' }[size];
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={v} className={cn('w-full overflow-hidden rounded-full bg-surface-2', h, className)}>
      <div className={cn('h-full rounded-full animate-[grow_1.2s_cubic-bezier(.2,.7,.2,1)_both]', fill)} style={{ width: `${v}%` }} />
    </div>
  );
}
