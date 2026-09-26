import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FlaskConical } from 'lucide-react';
import { cn } from '@/utils/format';

export function SectionHeader({ eyebrow, title, text, action, align = 'left', id }: { eyebrow?: string; title: ReactNode; text?: ReactNode; action?: ReactNode; align?: 'left' | 'center'; id?: string }) {
  return (
    <div className={cn('mb-10 flex flex-col gap-4 sm:mb-12', align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between')}>
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && <p className="eyebrow mb-3"><span className="h-px w-6 bg-marigold" aria-hidden="true" />{eyebrow}</p>}
        <h2 id={id} className="h-section">{title}</h2>
        {text && <p className="mt-4 text-lg text-muted">{text}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-white/80">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />}
            {it.to ? <Link to={it.to} className="rounded hover:text-white hover:underline">{it.label}</Link> : <span aria-current="page" className="text-white">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Small, honest label for demo/sample figures and placeholder content. */
export function DemoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('inline-flex items-start gap-2 rounded-lg border border-dashed border-warn/50 bg-marigold-soft/60 px-3 py-2 text-xs text-fg', className)}>
      <FlaskConical className="mt-px h-3.5 w-3.5 shrink-0 text-warn" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/** Scroll-linked fade-up using CSS scroll timelines (progressive enhancement:
 *  browsers without support simply show the content, so nothing is ever hidden). */
export function Reveal({ children, className, as: As = 'div' }: { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'section' }) {
  return <As className={cn('reveal', className)}>{children}</As>;
}
