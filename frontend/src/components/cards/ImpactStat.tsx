import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { num } from '@/utils/format';
import { cn } from '@/utils/format';

export function ImpactStat({ value, suffix, label, className, light }: { value: number; suffix?: string; label: string; className?: string; light?: boolean }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const v = useCountUp(value, inView);
  return (
    <div ref={ref} className={cn('min-w-0', className)}>
      <p className={cn('font-display text-4xl leading-none tabular sm:text-5xl', light ? 'text-white' : 'text-fg')} aria-hidden="true">
        {num(v)}<span className={light ? 'text-[#F4B154]' : 'text-marigold'}>{suffix}</span>
      </p>
      <p className="sr-only">{num(value)}{suffix} {label}</p>
      <p className={cn('mt-2 text-sm font-medium', light ? 'text-white/75' : 'text-muted')} aria-hidden="true">{label}</p>
    </div>
  );
}
