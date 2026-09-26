import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Programme } from '@/types';
import { Media } from '@/components/media/Media';
import { Icon } from '@/components/media/Icon';

export function ProgrammeCard({ p, index = 0 }: { p: Programme; index?: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Media theme={p.theme} seed={index + 2} alt={`Illustration for the ${p.title} programme`} ratio="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-5 pt-4">
        <div className="relative z-[1] -mt-10 mb-3 grid h-12 w-12 place-items-center rounded-2xl border-4 border-surface bg-brand text-brand-fg shadow-soft">
          <Icon name={p.icon} className="h-5 w-5" />
        </div>
        <h3 className="text-xl">{p.title}</h3>
        <p className="mt-2 flex-1 text-[0.95rem] text-muted">{p.short}</p>
        <Link to={`/programmes/${p.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-text after:absolute after:inset-0 after:content-['']">
          Learn more <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          <span className="sr-only">about {p.title}</span>
        </Link>
      </div>
    </article>
  );
}
