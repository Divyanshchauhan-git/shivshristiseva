import { Check, Minus } from 'lucide-react';
import type { Animal } from '@/types';
import { Media } from '@/components/media/Media';
import { StatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function AnimalCard({ a, onInterest }: { a: Animal; onInterest: (a: Animal, type: 'adopt' | 'foster') => void }) {
  const canAdopt = a.status === 'Available for adoption';
  const canFoster = a.status === 'Needs foster' || a.status === 'Under treatment';
  const Flag = ({ on, label }: { on: boolean; label: string }) => (
    <li className="flex items-center gap-1.5">{on ? <Check className="h-4 w-4 text-ok" aria-hidden="true" /> : <Minus className="h-4 w-4 text-muted" aria-hidden="true" />}<span>{label}{on ? '' : ': pending'}</span></li>
  );
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="relative">
        <Media theme="animals" seed={a.seed} alt={`${a.species} named ${a.name}`} ratio="aspect-square" />
        <div className="absolute left-3 top-3"><StatusBadge status={a.status} /></div>
        <span className="absolute bottom-3 right-3 rounded-md bg-black/55 px-2 py-0.5 font-mono text-[0.7rem] text-white">{a.code}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-2xl">{a.name}</h3>
          <p className="text-sm text-muted">{a.species} · {a.gender !== 'Unknown' ? a.gender : ''}</p>
        </div>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
          <dt className="text-muted">Age</dt><dd className="font-medium">{a.ageEstimate}</dd>
          <dt className="text-muted">Area</dt><dd className="font-medium">{a.area}</dd>
          <dt className="text-muted">Temperament</dt><dd className="font-medium">{a.temperament}</dd>
        </dl>
        <p className="mt-3 text-sm text-muted">{a.health}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm"><Flag on={a.vaccinated} label="Vaccinated" /><Flag on={a.sterilised} label="Sterilised" /></ul>
        <p className="mt-3 flex-1 text-sm">{a.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {canAdopt && <Button size="sm" onClick={() => onInterest(a, 'adopt')}>Adopt {a.name}</Button>}
          {canFoster && <Button size="sm" onClick={() => onInterest(a, 'foster')}>Foster {a.name}</Button>}
          {(canAdopt || canFoster) && <Button size="sm" variant="secondary" onClick={() => onInterest(a, canAdopt ? 'foster' : 'adopt')}>{canAdopt ? 'Foster' : 'Adopt later'}</Button>}
          {!canAdopt && !canFoster && <p className="col-span-2 rounded-full bg-surface-2 py-2 text-center text-sm text-muted">{a.status === 'Adopted' ? 'Happily adopted' : 'Not available right now'}</p>}
        </div>
      </div>
    </article>
  );
}
