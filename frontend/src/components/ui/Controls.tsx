import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useId } from 'react';
import { cn } from '@/utils/format';

/** Single-select filter rendered as a row of pill buttons (radio semantics). */
export function FilterChips<T extends string>({ label, options, value, onChange, counts }: { label: string; options: readonly T[]; value: T | 'All'; onChange: (v: T | 'All') => void; counts?: Partial<Record<T | 'All', number>> }) {
  const all = ['All', ...options] as (T | 'All')[];
  return (
    <div role="radiogroup" aria-label={label} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
      {all.map((o) => {
        const on = value === o;
        return (
          <button key={o} type="button" role="radio" aria-checked={on} onClick={() => onChange(o)}
            className={cn('shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors', on ? 'border-brand bg-brand text-brand-fg' : 'border-line bg-surface text-fg hover:border-brand-text/40')}>
            {o}{counts?.[o] !== undefined && <span className={cn('ml-1.5 tabular text-xs', on ? 'text-brand-fg/75' : 'text-muted')}>{counts[o]}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search', label = 'Search' }: { value: string; onChange: (v: string) => void; placeholder?: string; label?: string }) {
  const id = useId();
  return (
    <div className="relative w-full sm:max-w-xs">
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
      <input id={id} type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm focus:border-brand-text focus:outline-none focus:ring-4 focus:ring-marigold/30" />
    </div>
  );
}

export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  const btn = 'grid h-10 min-w-10 place-items-center rounded-full border border-line bg-surface px-3 text-sm font-semibold tabular hover:border-brand-text/40 disabled:opacity-40';
  const list = Array.from({ length: pages }, (_, i) => i + 1).filter((p) => p === 1 || p === pages || Math.abs(p - page) <= 1);
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      <button className={btn} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
      {list.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && list[i - 1] !== p - 1 && <span className="text-muted" aria-hidden="true">…</span>}
          <button className={cn(btn, p === page && 'border-brand bg-brand text-brand-fg')} aria-current={p === page ? 'page' : undefined} onClick={() => onChange(p)}>{p}</button>
        </span>
      ))}
      <button className={btn} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
    </nav>
  );
}
