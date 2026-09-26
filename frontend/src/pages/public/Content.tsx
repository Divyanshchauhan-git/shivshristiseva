import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, Clock, Heart, MapPin, ShieldCheck, Users, Play, Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { PageHero } from '@/components/layout/PageHero';
import { FilterChips, Pagination, SearchInput } from '@/components/ui/Controls';
import { AsyncView, EmptyState, ErrorState, LoadingBlock, SkeletonCards } from '@/components/ui/States';
import { StoryCard } from '@/components/cards/StoryCard';
import { EventCard } from '@/components/cards/EventCard';
import { ButtonLink } from '@/components/ui/Button';
import { DemoNote } from '@/components/ui/Section';
import { Media } from '@/components/media/Media';
import { Scene } from '@/components/media/Scene';
import { Badge } from '@/components/ui/Badge';
import { EventRegistrationForm } from '@/components/forms/QuickForms';
import { programmeBySlug, programmes } from '@/data/programmes';
import type { GalleryAlbum, StoryCategory, StoryKind } from '@/types';
import { fmtDate, fmtTime, today } from '@/utils/format';
import NotFound from './NotFound';

/* ================================ STORIES ================================ */
const storyCats: StoryCategory[] = ['Education', 'Women', 'Animals', 'Healthcare', 'Community', 'Volunteer'];
const kinds: { id: StoryKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All stories' }, { id: 'success', label: 'Success stories' }, { id: 'animal', label: 'Animal stories' },
  { id: 'volunteer', label: 'Volunteer stories' }, { id: 'field', label: 'Field updates' },
];

export function Stories() {
  useSeo({ title: 'Stories', description: 'Success stories, animal rescue stories, volunteer stories and field updates, shared with consent.', path: '/stories' });
  const s = useAsync(() => contentApi.stories(), []);
  const [cat, setCat] = useState<StoryCategory | 'All'>('All');
  const [kind, setKind] = useState<StoryKind | 'all'>('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const per = 6;
  const filtered = (d: NonNullable<typeof s.data>) => d.filter((x) => (cat === 'All' || x.category === cat) && (kind === 'all' || x.kind === kind) && (!q || (x.title + x.excerpt).toLowerCase().includes(q.toLowerCase())));
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Stories' }]} eyebrow="Stories" theme="women" seed={5}
        title="Stories of change." text="We publish stories only with informed consent. Names and identifying details are changed where needed, and we never identify children in protection situations." />
      <section className="section pt-10">
        <div className="container-page">
          <div role="tablist" aria-label="Story type" className="mb-5 flex gap-1 overflow-x-auto border-b border-line [scrollbar-width:none]">
            {kinds.map((k) => (
              <button key={k.id} role="tab" aria-selected={kind === k.id} onClick={() => { setKind(k.id); setPage(1); }}
                className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${kind === k.id ? 'border-marigold text-fg' : 'border-transparent text-muted hover:text-fg'}`}>{k.label}</button>
            ))}
          </div>
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <FilterChips label="Filter stories by programme area" options={storyCats} value={cat} onChange={(v) => { setCat(v as StoryCategory | 'All'); setPage(1); }} />
            <SearchInput value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder="Search stories" label="Search stories" />
          </div>
          <AsyncView state={s} retry={s.retry} isEmpty={(d) => filtered(d).length === 0} empty={<EmptyState title="No stories match these filters." text="Try another category." />}>
            {(d) => {
              const list = filtered(d);
              return (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{list.slice((page - 1) * per, page * per).map((x, i) => <StoryCard key={x.id} s={x} index={i} />)}</div>
                  <div className="mt-10"><Pagination page={page} pages={Math.ceil(list.length / per)} onChange={setPage} /></div>
                </>
              );
            }}
          </AsyncView>
          <DemoNote className="mt-8">These are sample stories written for demonstration.</DemoNote>
        </div>
      </section>
    </>
  );
}

export function StoryDetail() {
  const { slug = '' } = useParams();
  const s = useAsync(() => contentApi.story(slug), [slug]);
  const all = useAsync(() => contentApi.stories(), []);
  const st = s.status === 'success' ? s.data : undefined;
  useSeo({ title: st?.title ?? 'Story', description: st?.excerpt, path: `/stories/${slug}`,
    jsonLd: st ? { '@context': 'https://schema.org', '@type': 'Article', headline: st.title, datePublished: st.date, author: { '@type': 'Organization', name: st.author } } : undefined });
  if (s.status === 'loading') return <div className="container-page py-16"><LoadingBlock /></div>;
  if (s.status === 'error') return (s.error as { status?: number }).status === 404 ? <NotFound /> : <div className="container-page py-16"><ErrorState message={s.error.message} onRetry={s.retry} /></div>;
  const x = s.data;
  const prog = programmeBySlug(x.programme);
  return (
    <>
      <article>
        <header className="container-page max-w-4xl pb-8 pt-10 sm:pt-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted"><Link to="/stories" className="hover:text-fg hover:underline">← All stories</Link></nav>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-muted">
            <Badge tone="brand">{prog?.title}</Badge>
            <span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" aria-hidden="true" /><time dateTime={x.date}>{fmtDate(x.date)}</time></span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden="true" />{x.location}</span>
          </div>
          <h1 className="mt-4 h-display">{x.title}</h1>
          <p className="mt-4 text-xl text-muted">{x.excerpt}</p>
        </header>
        <div className="container-page max-w-5xl"><Media theme={x.theme} seed={21} alt={`Illustration for ${x.title}`} ratio="aspect-[16/8]" className="rounded-3xl" priority /></div>
        <div className="container-page grid max-w-5xl gap-10 py-12 lg:grid-cols-[1fr_17rem]">
          <div className="prose-body max-w-prose">
            {x.body.map((p, i) => <p key={i} className={i === 0 ? 'text-xl leading-relaxed' : ''}>{p}</p>)}
            <p className="mt-8 flex items-start gap-2 rounded-xl bg-surface-2 p-4 text-sm text-muted">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf" aria-hidden="true" />
              {x.consent === 'recorded' ? 'Published with the recorded consent of the people involved.' : 'Names and identifying details have been changed to protect privacy.'} Written by {x.author}.
            </p>
          </div>
          <aside className="space-y-4">
            <div className="rounded-2xl bg-leaf-soft/70 p-5"><p className="text-xs font-semibold uppercase tracking-wider text-leaf">Impact</p><p className="mt-2 font-display text-xl">{x.impact}</p></div>
            <div className="rounded-2xl border border-line p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Related programme</p>
              <Link to={`/programmes/${x.programme}`} className="mt-2 block font-semibold text-brand-text hover:underline">{prog?.title} →</Link>
              <ul className="mt-3 flex flex-wrap gap-1.5">{x.tags.map((t) => <li key={t}><Badge>{t}</Badge></li>)}</ul>
            </div>
          </aside>
        </div>
      </article>
      <section className="container-page pb-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-[#0F3D44] p-8 text-white sm:p-12 md:flex-row md:items-center">
          <div><h2 className="text-3xl text-white">Support this cause</h2><p className="mt-2 text-white/75">Help us write more stories like this one through {prog?.title}.</p></div>
          <ButtonLink to={`/donate`} variant="donate" size="lg" icon={<Heart className="h-4 w-4 fill-current" />}>Donate now</ButtonLink>
        </div>
        {all.status === 'success' && (
          <div className="mt-14">
            <h2 className="text-2xl">More stories</h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{all.data.filter((y) => y.slug !== x.slug).slice(0, 3).map((y, i) => <StoryCard key={y.id} s={y} index={i + 3} />)}</div>
          </div>
        )}
      </section>
    </>
  );
}

/* ================================ EVENTS ================================ */
export function Events() {
  useSeo({ title: 'Events', description: 'Upcoming and past events: health camps, education drives, vaccination drives, food distribution, tree plantation and volunteer meetups.', path: '/events' });
  const s = useAsync(() => contentApi.events(), []);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const now = today(); now.setHours(0, 0, 0, 0);
  const split = (d: NonNullable<typeof s.data>) => d.filter((e) => (tab === 'upcoming' ? new Date(e.date) >= now : new Date(e.date) < now))
    .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Events' }]} eyebrow="Events" theme="health" seed={14}
        title="Join us on the ground." text="Health camps, vaccination drives, distributions, plantations and volunteer meetups. Register to attend or help." />
      <section className="section pt-10">
        <div className="container-page max-w-4xl">
          <div role="tablist" aria-label="Event timing" className="mb-8 inline-grid grid-cols-2 rounded-full bg-surface-2 p-1">
            {(['upcoming', 'past'] as const).map((t) => (
              <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`rounded-full px-6 py-2 text-sm font-semibold capitalize ${tab === t ? 'bg-surface shadow-soft' : 'text-muted'}`}>{t}</button>
            ))}
          </div>
          <AsyncView state={s} retry={s.retry} loading={<SkeletonCards count={3} className="lg:grid-cols-1 sm:grid-cols-1" />} isEmpty={(d) => split(d).length === 0}
            empty={<EmptyState title={tab === 'upcoming' ? 'No upcoming events right now.' : 'No past events yet.'} text="Subscribe to our newsletter to hear about new events." />}>
            {(d) => <div className="grid gap-4">{split(d).map((e) => <EventCard key={e.id} e={e} past={tab === 'past'} />)}</div>}
          </AsyncView>
          <DemoNote className="mt-8">Sample events. Venues are to be confirmed.</DemoNote>
        </div>
      </section>
    </>
  );
}

export function EventDetail() {
  const { slug = '' } = useParams();
  const s = useAsync(() => contentApi.event(slug), [slug]);
  const e = s.status === 'success' ? s.data : undefined;
  useSeo({ title: e?.title ?? 'Event', description: e?.description, path: `/events/${slug}`,
    jsonLd: e ? { '@context': 'https://schema.org', '@type': 'Event', name: e.title, startDate: `${e.date}T${e.startTime}:00+05:30`, endDate: `${e.date}T${e.endTime}:00+05:30`, location: { '@type': 'Place', name: e.location }, description: e.description } : undefined });
  if (s.status === 'loading') return <div className="container-page py-16"><LoadingBlock /></div>;
  if (s.status === 'error') return (s.error as { status?: number }).status === 404 ? <NotFound /> : <div className="container-page py-16"><ErrorState message={s.error.message} onRetry={s.retry} /></div>;
  const ev = s.data;
  const past = new Date(ev.date + 'T23:59:59') < today();
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Events', to: '/events' }, { label: ev.title }]} eyebrow={ev.category} theme={ev.theme} seed={9} title={ev.title} />
      <section className="section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_24rem]">
          <div>
            <dl className="grid gap-4 sm:grid-cols-3">
              {[[Calendar, 'Date', fmtDate(ev.date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })], [Clock, 'Time', `${fmtTime(ev.startTime)} – ${fmtTime(ev.endTime)} IST`], [MapPin, 'Location', ev.location]].map(([I, k, v]) => {
                const Ic = I as typeof Calendar;
                return <div key={k as string} className="rounded-2xl border border-line bg-surface p-4"><dt className="flex items-center gap-2 text-sm text-muted"><Ic className="h-4 w-4" aria-hidden="true" />{k as string}</dt><dd className="mt-1 font-semibold">{v as string}</dd></div>;
              })}
            </dl>
            <Media theme={ev.theme} seed={9} alt={`Illustration for ${ev.title}`} ratio="aspect-[16/9]" className="mt-8 rounded-3xl" />
            <h2 className="mt-10 text-2xl">About this event</h2>
            <p className="mt-3 text-lg text-muted">{ev.description}</p>
            {ev.volunteersNeeded && !past ? (
              <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl bg-marigold-soft/70 p-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2"><Users className="h-5 w-5 text-warn" aria-hidden="true" /><span><strong>{ev.volunteersNeeded} volunteers</strong> needed for this event.</span></p>
                <ButtonLink to="/volunteer">Volunteer for events</ButtonLink>
              </div>
            ) : null}
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft">
              <h2 className="text-2xl">Registration</h2>
              {past ? <p className="mt-3 text-muted">This event has ended. See photos in the <Link to="/gallery" className="link">gallery</Link>.</p>
                : ev.registrationOpen ? <div className="mt-4"><EventRegistrationForm event={ev} /></div>
                  : <p className="mt-3 text-muted">Registration opens closer to the date. Subscribe to our newsletter to be notified.</p>}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

/* ================================ GALLERY ================================ */
export function Gallery() {
  useSeo({ title: 'Gallery', description: 'Photo and video albums from our programmes, drives and events.', path: '/gallery' });
  const s = useAsync(() => contentApi.albums(), []);
  const [type, setType] = useState<'photo' | 'video' | 'all'>('all');
  const [prog, setProg] = useState<string>('All');
  const [open, setOpen] = useState<{ album: GalleryAlbum; i: number } | null>(null);
  const progOpts = programmes.filter((p) => p.slug !== 'marriage-assistance' && p.slug !== 'child-protection').map((p) => p.title);
  const list = (d: GalleryAlbum[]) => d.filter((a) => a.published && (type === 'all' || a.kind === type) && (prog === 'All' || programmeBySlug(a.programme)?.title === prog));
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Gallery' }]} eyebrow="Gallery" theme="environment" seed={52}
        title="Moments from the field." text="Photos are shared with consent. We do not publish images that identify children in vulnerable situations or families receiving sensitive support." />
      <section className="section pt-10">
        <div className="container-page">
          <div className="mb-8 flex flex-col gap-4">
            <div role="tablist" aria-label="Media type" className="inline-grid w-max grid-cols-3 rounded-full bg-surface-2 p-1">
              {([['all', 'All albums'], ['photo', 'Photos'], ['video', 'Videos']] as const).map(([k, l]) => (
                <button key={k} role="tab" aria-selected={type === k} onClick={() => setType(k)} className={`rounded-full px-4 py-2 text-sm font-semibold ${type === k ? 'bg-surface shadow-soft' : 'text-muted'}`}>{l}</button>
              ))}
            </div>
            <FilterChips label="Filter by programme" options={progOpts} value={prog} onChange={(v) => setProg(v)} />
          </div>
          <AsyncView state={s} retry={s.retry} isEmpty={(d) => list(d).length === 0} empty={<EmptyState title="No albums match these filters." />}>
            {(d) => (
              <div className="space-y-12">
                {list(d).map((a) => (
                  <section key={a.id} aria-labelledby={`alb-${a.id}`}>
                    <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                      <h2 id={`alb-${a.id}`} className="text-2xl">{a.title}</h2>
                      <p className="flex items-center gap-2 text-sm text-muted">{a.kind === 'video' ? <Play className="h-4 w-4" aria-hidden="true" /> : <ImageIcon className="h-4 w-4" aria-hidden="true" />}{programmeBySlug(a.programme)?.title} · <time dateTime={a.date}>{fmtDate(a.date)}</time></p>
                    </div>
                    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {a.items.map((it, i) => (
                        <li key={it.id}>
                          <button type="button" onClick={() => setOpen({ album: a, i })} className="group relative block w-full overflow-hidden rounded-2xl text-left">
                            <Scene theme={it.theme} seed={it.seed} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
                            {a.kind === 'video' && <span className="absolute inset-0 grid place-items-center"><span className="grid h-12 w-12 place-items-center rounded-full bg-white/90 text-[#0F3D44] shadow-lift"><Play className="h-5 w-5 fill-current" aria-hidden="true" /></span></span>}
                            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-sm font-medium text-white">{it.caption}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            )}
          </AsyncView>
          <DemoNote className="mt-10">Illustrations stand in for photos and videos. Upload consented media from the admin gallery.</DemoNote>
        </div>
      </section>
      {open && <Lightbox album={open.album} index={open.i} onClose={() => setOpen(null)} onMove={(i) => setOpen({ album: open.album, i })} />}
    </>
  );
}

function Lightbox({ album, index, onClose, onMove }: { album: GalleryAlbum; index: number; onClose: () => void; onMove: (i: number) => void }) {
  const it = album.items[index];
  const n = album.items.length;
  return (
    <div role="dialog" aria-modal="true" aria-label={`${album.title}: ${it.caption}`} className="fixed inset-0 z-[80] flex flex-col bg-[#051316]/95 p-4 text-white"
      onKeyDown={(e) => { if (e.key === 'Escape') onClose(); if (e.key === 'ArrowRight') onMove((index + 1) % n); if (e.key === 'ArrowLeft') onMove((index - 1 + n) % n); }}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-white/70">{album.title} · {index + 1} / {n}</p>
        <button autoFocus onClick={onClose} className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close"><X className="h-5 w-5" /></button>
      </div>
      <div className="relative flex flex-1 items-center justify-center py-4">
        <button onClick={() => onMove((index - 1 + n) % n)} className="absolute left-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Previous"><ChevronLeft className="h-6 w-6" /></button>
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl"><Scene theme={it.theme} seed={it.seed} className="aspect-[4/3] max-h-[70vh] w-full" /></div>
        <button onClick={() => onMove((index + 1) % n)} className="absolute right-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Next"><ChevronRight className="h-6 w-6" /></button>
      </div>
      <p className="text-center text-lg">{it.caption}</p>
      <p className="text-center text-sm text-white/60">{fmtDate(album.date)}{album.kind === 'video' ? ' · Video placeholder' : ''}</p>
    </div>
  );
}

