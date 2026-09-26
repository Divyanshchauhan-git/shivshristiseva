import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import type { NGOEvent } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { fmtTime } from '@/utils/format';
import { themeIcon } from '@/components/media/Icon';

export function EventCard({ e, past }: { e: NGOEvent; past?: boolean }) {
  const d = new Date(e.date + 'T00:00:00');
  const I = themeIcon[e.theme];
  return (
    <article className="group relative flex gap-4 rounded-2xl border border-line bg-surface p-4 transition-shadow hover:shadow-lift sm:p-5">
      <div className={`flex w-16 shrink-0 flex-col items-center justify-center rounded-xl py-2 text-center ${past ? 'bg-surface-2 text-muted' : 'bg-brand text-brand-fg'}`}>
        <span className="text-xs font-semibold uppercase tracking-wider">{d.toLocaleDateString('en-IN', { month: 'short' })}</span>
        <span className="font-display text-3xl leading-none tabular">{d.getDate()}</span>
        <span className="text-[0.65rem] opacity-80">{d.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand"><I className="h-3 w-3" aria-hidden="true" />{e.category}</Badge>
          {!past && e.registrationOpen && <Badge tone="ok" dot>Registration open</Badge>}
        </div>
        <h3 className="mt-2 text-lg leading-snug">
          <Link to={`/events/${e.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-text">{e.title}</Link>
        </h3>
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{fmtTime(e.startTime)} – {fmtTime(e.endTime)}</span>
          <span className="inline-flex min-w-0 items-center gap-1"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{e.location}</span></span>
        </p>
      </div>
    </article>
  );
}
