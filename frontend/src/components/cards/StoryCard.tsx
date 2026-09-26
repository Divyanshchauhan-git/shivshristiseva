import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck } from 'lucide-react';
import type { Story } from '@/types';
import { Media } from '@/components/media/Media';
import { Badge } from '@/components/ui/Badge';
import { programmeBySlug } from '@/data/programmes';
import { fmtDate } from '@/utils/format';

export function StoryCard({ s, index = 0 }: { s: Story; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-shadow hover:shadow-lift">
      <Media theme={s.theme} seed={index + 21} alt={`Illustration for the story: ${s.title}`} ratio="aspect-[3/2]" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Badge tone="brand">{programmeBySlug(s.programme)?.title ?? s.category}</Badge>
          <span className="inline-flex items-center gap-1 text-muted"><MapPin className="h-3.5 w-3.5" aria-hidden="true" />{s.location}</span>
        </div>
        <h3 className="mt-3 text-xl">
          <Link to={`/stories/${s.slug}`} className="after:absolute after:inset-0 after:content-[''] group-hover:text-brand-text">{s.title}</Link>
        </h3>
        <p className="mt-2 flex-1 text-[0.95rem] text-muted">{s.excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted">
          <time dateTime={s.date}>{fmtDate(s.date)}</time>
          <span className="inline-flex items-center gap-1" title={s.consent === 'recorded' ? 'Published with recorded consent' : 'Names and identifying details changed'}>
            <ShieldCheck className="h-3.5 w-3.5 text-leaf" aria-hidden="true" />{s.consent === 'recorded' ? 'Consent recorded' : 'Identity protected'}
          </span>
        </div>
        <span className="mt-4 text-sm font-semibold text-brand-text">Read more →</span>
      </div>
    </article>
  );
}
