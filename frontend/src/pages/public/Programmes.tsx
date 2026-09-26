import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Heart, MapPin, Users } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader, DemoNote } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { AsyncView, EmptyState, ErrorState, LoadingBlock } from '@/components/ui/States';
import { ProgrammeCard } from '@/components/cards/ProgrammeCard';
import { CampaignCard } from '@/components/cards/CampaignCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { AnimalCard } from '@/components/cards/AnimalCard';
import { AnimalInterestModal } from '@/components/forms/QuickForms';
import { Media } from '@/components/media/Media';
import { Icon } from '@/components/media/Icon';
import { FilterChips } from '@/components/ui/Controls';
import { Alert } from '@/components/ui/Alert';
import { causes } from '@/components/forms/DonationForm';
import type { Animal, AnimalStatus, Programme } from '@/types';
import { num } from '@/utils/format';
import NotFound from './NotFound';

export function Programmes() {
  useSeo({ title: 'Our Work', description: 'Education, women empowerment, healthcare, food, livelihoods, child protection, elderly care, animal welfare, emergency relief and environment programmes.', path: '/programmes' });
  const s = useAsync(() => contentApi.programmes(), []);
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Work' }]} eyebrow="Our work" theme="environment" seed={4}
        title="Programmes for people, animals and communities." text="Explore each programme to see the problem it addresses, how we work, who we support and how you can help." />
      <section className="section">
        <div className="container-page">
          <AsyncView state={s} retry={s.retry} loading={undefined} empty={<EmptyState title="No programmes published yet." />}>
            {(d) => <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{d.map((p, i) => <ProgrammeCard key={p.slug} p={p} index={i} />)}</div>}
          </AsyncView>
        </div>
      </section>
    </>
  );
}

const donateCause: Record<string, string> = {
  education: 'Education', 'women-empowerment': 'Women', healthcare: 'Healthcare', 'food-essentials': 'Food', 'animal-welfare': 'Animals',
  'emergency-relief': 'Emergency Relief', 'environment-community': 'Environment',
};

function AnimalListings() {
  const s = useAsync(() => contentApi.animals(), []);
  const [filter, setFilter] = useState<AnimalStatus | 'All'>('All');
  const [target, setTarget] = useState<{ a: Animal; type: 'adopt' | 'foster' } | null>(null);
  const statuses = ['Available for adoption', 'Needs foster', 'Under treatment', 'Adopted'] as const;
  return (
    <section id="adopt" className="section bg-marigold-soft/50" aria-labelledby="adopt-title">
      <div className="container-page">
        <SectionHeader id="adopt-title" eyebrow="Adoption & fostering" title="Looking for a safe, loving home."
          text="Adoption is free. Every animal is health-checked, and we visit your home before and after adoption. Only a general area is shown to protect animals and caregivers." />
        <div className="mb-6"><FilterChips label="Filter animals by status" options={statuses} value={filter} onChange={(v) => setFilter(v as AnimalStatus | 'All')} /></div>
        <AsyncView state={s} retry={s.retry} empty={<EmptyState title="No animals listed right now." text="Check back soon, or support our rescue work." />}
          isEmpty={(d) => d.filter((a) => filter === 'All' || a.status === filter).length === 0}>
          {(d) => (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {d.filter((a) => filter === 'All' || a.status === filter).map((a) => <AnimalCard key={a.id} a={a} onInterest={(a, type) => setTarget({ a, type })} />)}
            </div>
          )}
        </AsyncView>
        <DemoNote className="mt-6">These animal profiles are sample listings.</DemoNote>
      </div>
      <AnimalInterestModal animal={target?.a ?? null} type={target?.type ?? 'adopt'} onClose={() => setTarget(null)} />
    </section>
  );
}

function Detail({ p }: { p: Programme }) {
  const camps = useAsync(() => contentApi.campaigns(), []);
  const stories = useAsync(() => contentApi.stories(), []);
  const cause = donateCause[p.slug] && causes.some((c) => c.id === donateCause[p.slug]) ? donateCause[p.slug] : 'General Fund';
  useSeo({ title: p.title, description: p.summary, path: `/programmes/${p.slug}`, jsonLd: { '@context': 'https://schema.org', '@type': 'Service', name: p.title, description: p.summary, provider: { '@type': 'NGO', name: 'Shivshristi Seva Sansthan' } } });
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Work', to: '/programmes' }, { label: p.title }]} eyebrow="Programme" theme={p.theme} seed={7}
        title={p.title} text={p.summary}>
        <ButtonLink to={`/donate?cause=${encodeURIComponent(cause)}`} variant="donate" size="lg" icon={<Heart className="h-4 w-4 fill-current" />}>Donate to {p.title}</ButtonLink>
        <ButtonLink to="/volunteer" variant="light" size="lg" icon={<Users className="h-4 w-4" />}>Volunteer</ButtonLink>
      </PageHero>

      {p.sensitive && <div className="container-page -mt-6 relative z-10"><Alert tone="warning" title="Privacy and safeguarding">{p.sensitive}</Alert></div>}

      <section className="section" aria-labelledby="problem">
        <div className="container-page grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="eyebrow mb-3">The problem</p>
            <h2 id="problem" className="h-section">Why this work matters</h2>
            <p className="mt-5 text-lg text-muted">{p.problem}</p>
            <h3 className="mt-10 text-2xl">Our approach</h3>
            <ul className="mt-4 space-y-3">
              {p.approach.map((a) => <li key={a} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" /><span>{a}</span></li>)}
            </ul>
          </div>
          <aside className="space-y-5">
            <Media theme={p.theme} seed={3} alt={`Illustration for ${p.title}`} ratio="aspect-[4/3]" className="rounded-3xl" />
            <div className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-sans text-sm font-semibold uppercase tracking-wider text-muted">Who we support</h3>
              <ul className="mt-3 space-y-2">{p.whoWeSupport.map((w) => <li key={w} className="flex gap-2 text-[0.95rem]"><Users className="mt-1 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />{w}</li>)}</ul>
              <h3 className="mt-5 font-sans text-sm font-semibold uppercase tracking-wider text-muted">Locations</h3>
              <ul className="mt-3 space-y-2">{p.locations.map((w) => <li key={w} className="flex gap-2 text-[0.95rem]"><MapPin className="mt-1 h-4 w-4 shrink-0 text-brand-text" aria-hidden="true" />{w}</li>)}</ul>
            </div>
          </aside>
        </div>
      </section>

      <section className="section bg-surface-2/60" aria-labelledby="what">
        <div className="container-page">
          <SectionHeader id="what" eyebrow="What we do" title="Practical support, delivered with care." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {p.whatWeDo.map((w) => (
              <div key={w.title} className="rounded-2xl bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand-text"><Icon name={p.icon} className="h-5 w-5" /></span>
                <h3 className="mt-4 text-xl">{w.title}</h3><p className="mt-2 text-muted">{w.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <h3 className="text-xl">Regular activities</h3>
            <ul className="mt-3 flex flex-wrap gap-2">{p.activities.map((a) => <li key={a} className="rounded-full bg-surface px-3.5 py-1.5 text-sm ring-1 ring-line">{a}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="metrics">
        <div className="container-page">
          <SectionHeader id="metrics" eyebrow="Impact" title="Programme metrics" action={<ButtonLink to="/impact" variant="secondary">Full impact dashboard</ButtonLink>} />
          <div className="grid gap-5 sm:grid-cols-3">
            {p.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-line bg-surface p-6">
                <p className="font-display text-5xl tabular">{num(m.value)}<span className="text-marigold">{m.suffix}</span></p>
                <p className="mt-2 font-semibold">{m.label}</p><p className="text-xs text-muted">{m.period}</p>
              </div>
            ))}
          </div>
          <DemoNote className="mt-5">Sample figures. Replace with verified data for the stated reporting period.</DemoNote>
        </div>
      </section>

      {p.slug === 'animal-welfare' && <AnimalListings />}

      <section className="section bg-surface-2/60" aria-labelledby="camps">
        <div className="container-page">
          <SectionHeader id="camps" eyebrow="Current campaigns" title={`Support ${p.title} today`} />
          <AsyncView state={camps} retry={camps.retry} isEmpty={(d) => !d.some((c) => c.programme === p.slug && c.status === 'active')}
            empty={<EmptyState title="No active campaigns for this programme right now." text="You can still give directly to this programme." action={<ButtonLink to={`/donate?cause=${encodeURIComponent(cause)}`} variant="donate">Donate to {p.title}</ButtonLink>} />}>
            {(d) => <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{d.filter((c) => c.programme === p.slug && c.status === 'active').map((c, i) => <CampaignCard key={c.id} c={c} index={i} />)}</div>}
          </AsyncView>
        </div>
      </section>

      <section className="section" aria-labelledby="pstories">
        <div className="container-page">
          <SectionHeader id="pstories" eyebrow="Stories" title="From the field" />
          <AsyncView state={stories} retry={stories.retry} isEmpty={(d) => !d.some((s) => s.programme === p.slug)}
            empty={<EmptyState title="Stories from this programme are coming soon." text="We publish stories only with consent." />}>
            {(d) => <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{d.filter((s) => s.programme === p.slug).map((s, i) => <StoryCard key={s.id} s={s} index={i} />)}</div>}
          </AsyncView>
          <h3 className="mt-14 text-2xl">Gallery</h3>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <Media key={i} theme={p.theme} seed={i * 13} alt={`${p.title} gallery illustration ${i}`} ratio="aspect-square" className="rounded-2xl" />)}
          </div>
          <Link to="/gallery" className="link mt-4 inline-block text-sm">View the full gallery</Link>
        </div>
      </section>

      <section className="pb-20" aria-label="Get involved">
        <div className="container-page grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-[#0F3D44] p-8 text-white">
            <Heart className="h-7 w-7 fill-[#EFA23A] text-[#EFA23A]" aria-hidden="true" />
            <h2 className="mt-4 text-3xl text-white">Fund this programme</h2>
            <p className="mt-2 text-white/75">Your donation goes only to {p.title}.</p>
            <ButtonLink to={`/donate?cause=${encodeURIComponent(cause)}`} variant="donate" size="lg" className="mt-6">Donate now <ArrowRight className="h-4 w-4" /></ButtonLink>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-8">
            <Users className="h-7 w-7 text-brand-text" aria-hidden="true" />
            <h2 className="mt-4 text-3xl">{p.volunteerCta ?? 'Volunteer with us'}</h2>
            <p className="mt-2 text-muted">Orientation and support are provided. No experience needed for most roles.</p>
            <ButtonLink to="/volunteer" size="lg" className="mt-6">Apply to volunteer</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

export function ProgrammeDetail() {
  const { slug = '' } = useParams();
  const s = useAsync(() => contentApi.programme(slug), [slug]);
  if (s.status === 'loading') return <div className="container-page py-16"><LoadingBlock /></div>;
  if (s.status === 'error') return (s.error as { status?: number }).status === 404 ? <NotFound /> : (
    <div className="container-page py-16"><ErrorState message={s.error.message} onRetry={s.retry} /></div>
  );
  return <Detail p={s.data} />;
}
