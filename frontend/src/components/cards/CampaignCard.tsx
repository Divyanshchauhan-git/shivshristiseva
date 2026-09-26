import { Link } from 'react-router-dom';
import { CalendarClock, Heart, Users } from 'lucide-react';
import type { Campaign } from '@/types';
import { Media } from '@/components/media/Media';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { buttonClass } from '@/components/ui/Button';
import { daysLeft, fmtDate, inr, num, pct } from '@/utils/format';

export function CampaignMeta({ c, large }: { c: Campaign; large?: boolean }) {
  const p = pct(c.raised, c.goal);
  const d = daysLeft(c.endDate);
  const done = c.status === 'completed' || p >= 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className={large ? 'font-display text-3xl sm:text-4xl tabular' : 'font-display text-2xl tabular'}>{inr(c.raised)}</p>
        <p className="text-sm font-semibold tabular text-brand-text">{p}%</p>
      </div>
      <p className="mb-3 text-sm text-muted">raised of <span className="tabular font-semibold text-fg">{inr(c.goal)}</span> goal</p>
      <ProgressBar value={p} label={`${p}% of ${inr(c.goal)} goal raised`} tone={c.urgent ? 'hibiscus' : done ? 'leaf' : 'marigold'} size={large ? 'lg' : 'md'} />
      <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
        <div className="flex items-center gap-1.5"><Users className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">Supporters</dt><dd><span className="tabular font-semibold text-fg">{num(c.supporters)}</span> supporters</dd></div>
        <div className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" aria-hidden="true" /><dt className="sr-only">Time left</dt>
          <dd>{done ? 'Goal reached' : d === 0 ? 'Ends today' : <><span className="tabular font-semibold text-fg">{d}</span> days left</>}</dd></div>
      </dl>
    </div>
  );
}

export function CampaignCard({ c, index = 0 }: { c: Campaign; index?: number }) {
  const done = c.status === 'completed';
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative">
        <Media theme={c.theme} seed={index + 11} alt={`Illustration for ${c.title}`} ratio="aspect-[16/10]" />
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge tone="plain" className="bg-white/90 text-[#0F3D44]">{c.category}</Badge>
          {c.urgent && <Badge tone="plain" className="bg-[#BE4832] text-white" dot>Urgent</Badge>}
          {done && <Badge tone="plain" className="bg-[#2E7A57] text-white">Completed</Badge>}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl"><Link to={`/campaigns/${c.slug}`} className="hover:text-brand-text">{c.title}</Link></h3>
        <p className="mt-2 line-clamp-2 text-[0.95rem] text-muted">{c.description}</p>
        <div className="mt-5 flex-1"><CampaignMeta c={c} /></div>
        <p className="mt-3 text-xs text-muted">Ends {fmtDate(c.endDate)}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/campaigns/${c.slug}`} className={buttonClass('secondary', 'sm')}>Details</Link>
          {done ? <span className={buttonClass('ghost', 'sm', 'pointer-events-none opacity-70')}>Closed</span> :
            <Link to={`/donate?campaign=${c.slug}`} className={buttonClass('donate', 'sm')}><Heart className="h-3.5 w-3.5 fill-current" aria-hidden="true" />Donate<span className="sr-only"> to {c.title}</span></Link>}
        </div>
      </div>
    </article>
  );
}
