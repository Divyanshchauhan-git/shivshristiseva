import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Bone, Building2, CalendarDays, FileCheck2, FileText, HandCoins, Heart, HeartPulse, Home as HomeIcon,
  Landmark, MapPin, Megaphone, PawPrint, Phone, Scale, ScrollText, ShieldPlus, Siren, Syringe, Truck, Users, Mail, MessageCircle,
} from 'lucide-react';
import { brand } from '@/config/brand';
import { useSeo } from '@/hooks/useSeo';
import { useAsync } from '@/hooks/useAsync';
import { contentApi } from '@/services/api';
import { programmes } from '@/data/programmes';
import { headlinePeriod, headlineStats } from '@/data/impact';
import { Scene } from '@/components/media/Scene';
import { Media } from '@/components/media/Media';
import { ButtonLink } from '@/components/ui/Button';
import { DemoNote, Reveal, SectionHeader } from '@/components/ui/Section';
import { AsyncView, EmptyState, SkeletonCards } from '@/components/ui/States';
import { ProgrammeCard } from '@/components/cards/ProgrammeCard';
import { CampaignMeta } from '@/components/cards/CampaignCard';
import { StoryCard } from '@/components/cards/StoryCard';
import { ImpactStat } from '@/components/cards/ImpactStat';
import { Badge } from '@/components/ui/Badge';
import { NewsletterForm } from '@/components/forms/NewsletterForm';
import { ContactForm } from '@/components/forms/ContactForm';
import { SocialRow } from '@/components/layout/Footer';
import { cn, fmtDate, inr, pct } from '@/utils/format';

import { TrustStrip } from '@/components/layout/TrustStrip';
import { OfficialCertifications } from '@/components/layout/OfficialCertifications';

const orgJsonLd = {
  '@context': 'https://schema.org', '@type': 'NGO', name: brand.name, url: brand.siteUrl, slogan: brand.tagline,
  email: brand.contact.email, telephone: brand.contact.phone, sameAs: Object.values(brand.social),
};

/* ------------------------------------------------------------------ HERO */
function Hero() {
  const featured = { raised: 318500, goal: 500000 };
  const quickImpacts = [
    { amt: 500, label: 'Feed 5 Strays', icon: PawPrint },
    { amt: 1000, label: 'Child Education Kit', icon: FileCheck2 },
    { amt: 2500, label: 'Medical Camp Support', icon: HeartPulse },
  ];

  return (
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16 bg-gradient-to-b from-[#f4f8f7]/70 via-bg to-bg mesh-glow">
      <div className="pointer-events-none absolute -right-20 top-10 select-none font-deva text-[16rem] leading-none text-brand-text/[0.04] sm:text-[22rem]" aria-hidden="true" lang="hi">सेवा</div>
      <div className="container-page grid items-center gap-12 pb-6 pt-6 sm:pt-8 lg:grid-cols-[1.08fr_1fr] lg:gap-12 lg:pb-12">
        <div className="relative animate-rise z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="trust-chip">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              80G Tax Exemption Available
            </span>
            <span className="trust-chip-gold">
              NITI Aayog Darpan Regd.
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] leading-[1.14] sm:leading-[1.05] tracking-tight">
            Together, we empower lives &amp;{' '}
            <span className="relative inline-block whitespace-nowrap text-brand-text">
              protect the voiceless.
              <svg viewBox="0 0 300 18" className="absolute -bottom-2 left-0 h-3 w-full sm:h-4" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 13 C 60 3, 140 3, 297 10" stroke="rgb(var(--marigold))" strokeWidth="6" fill="none" strokeLinecap="round" className="[stroke-dasharray:320] [stroke-dashoffset:320] animate-[draw_1.2s_.4s_ease-out_forwards]" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl leading-relaxed">
            From educating underserved children and supporting women's self-help groups, to rescuing injured street animals and providing emergency relief across India.
          </p>

          {/* Quick Impact Selector */}
          <div className="mt-7 rounded-2xl border border-line/70 bg-white/90 p-4 shadow-soft backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-muted flex items-center justify-between">
              <span>Direct Impact Giving</span>
              <span className="text-emerald-700 font-semibold">100% Goes To Cause</span>
            </p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {quickImpacts.map((q) => (
                <Link
                  key={q.amt}
                  to={`/donate?amount=${q.amt}`}
                  className="group flex flex-col items-center justify-center rounded-xl border border-line/80 bg-surface p-2.5 text-center transition-all hover:border-amber-500/50 hover:bg-amber-50/50 hover:shadow-soft"
                >
                  <span className="text-xs font-bold text-fg group-hover:text-amber-800">{inr(q.amt)}</span>
                  <span className="mt-0.5 line-clamp-1 text-[0.68rem] text-muted group-hover:text-amber-900">{q.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/donate" variant="donate" size="lg" className="shadow-glow" icon={<Heart className="h-5 w-5 fill-current animate-pulseSlow" />}>
              DONATE NOW (80G TAX RELIEF)
            </ButtonLink>
            <ButtonLink to="/volunteer" variant="secondary" size="lg" icon={<Users className="h-4 w-4" />}>
              JOIN AS A VOLUNTEER
            </ButtonLink>
          </div>

          <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted">
            <li className="flex items-center gap-1.5"><FileCheck2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />Instant 80G Tax Exemption Certificate</li>
            <li className="flex items-center gap-1.5"><ShieldPlus className="h-4 w-4 text-emerald-600" aria-hidden="true" />Secure UPI, Cards &amp; Net Banking</li>
          </ul>
        </div>

        {/* Collage with Real Photos */}
        <div className="relative mx-auto w-full max-w-[34rem] lg:max-w-none">
          <div className="grid grid-cols-[1.35fr_1fr] gap-3 sm:gap-4">
            <div className="group relative row-span-2 overflow-hidden rounded-t-[999px] rounded-b-3xl shadow-lift bg-surface-2 ring-4 ring-white">
              <img
                src="/images/hero_community.jpg"
                alt="Joyful children, volunteer and happy dog"
                className="h-full min-h-[22rem] w-full sm:min-h-[29rem] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block rounded-full bg-amber-500/90 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-stone-950">Ground Mission</span>
                <p className="mt-1 text-sm font-semibold leading-snug">Education &amp; Care for Every Life</p>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-3xl shadow-soft bg-surface-2 ring-4 ring-white">
              <img
                src="/images/animal_rescue.jpg"
                alt="Compassionate animal care and rescue"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[0.68rem] font-medium text-white backdrop-blur-sm">
                Street Animal Care
              </span>
            </div>

            <div className="group relative overflow-hidden rounded-3xl rounded-br-[4.5rem] shadow-soft bg-surface-2 ring-4 ring-white">
              <img
                src="/images/women_livelihood.jpg"
                alt="Women empowerment and livelihood training"
                className="aspect-square h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 px-2 py-0.5 text-[0.68rem] font-medium text-white backdrop-blur-sm">
                Women's Self-Help
              </span>
            </div>
          </div>

          {/* Floating Impact Card */}
          <Link to="/campaigns/education-kits" className="absolute -bottom-6 left-3 w-[min(16.5rem,calc(100%-1.5rem))] rounded-2xl border border-line bg-white/95 p-4 shadow-lift transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl sm:-left-6 sm:bottom-8 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-[0.68rem] font-bold uppercase tracking-wider text-amber-700">Urgent Appeal</p>
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
            </div>
            <p className="mt-1 text-sm font-bold text-fg leading-tight">Education kits for new term</p>
            <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${pct(featured.raised, featured.goal)}%` }} />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted">
              <span className="font-bold text-fg tabular">{inr(featured.raised)}</span>
              <span>Goal: {inr(featured.goal)}</span>
            </div>
          </Link>

          {/* Floating Rescue & Care Badge */}
          <div className="absolute -right-3 top-6 hidden rounded-2xl bg-gradient-to-br from-[#0B3B3E] to-[#14565C] px-4 py-3 text-white shadow-lift ring-1 ring-white/20 sm:block [animation-delay:1.5s] animate-float">
            <p className="flex items-center gap-2 text-sm font-bold text-amber-300"><PawPrint className="h-4 w-4" aria-hidden="true" />Daily Animal Feeding</p>
            <p className="text-[0.72rem] text-white/80">150+ Community animals protected</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- INTRO */
function Intro() {
  const cols = [
    { h: 'Who we are', t: `${brand.name} is a non-profit organisation working alongside local volunteers, partners and community leaders.` },
    { h: 'What we do', t: 'We run programmes in education, women’s livelihoods, healthcare, food security, elderly care, animal welfare, emergency relief and the environment.' },
    { h: 'Who we support', t: 'Children, women, families, older people and animals who need support, with a focus on dignity, consent and long-term change.' },
  ];
  return (
    <section className="section pt-12 sm:pt-16" aria-labelledby="intro-title">
      <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <p className="eyebrow mb-3"><span className="h-px w-6 bg-marigold" aria-hidden="true" />About the foundation</p>
          <h2 id="intro-title" className="h-section">A local organisation with a simple belief: every life deserves care.</h2>
          <ButtonLink to="/about" variant="ghost" className="mt-6 -ml-4" icon={<ArrowRight className="h-4 w-4" />}>Learn about us</ButtonLink>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {cols.map((c, i) => (
            <Reveal key={c.h} className="border-t-2 border-marigold pt-5">
              <p className="font-mono text-xs text-muted">0{i + 1}</p>
              <h3 className="mt-2 text-xl">{c.h}</h3>
              <p className="mt-2 text-[0.95rem] text-muted">{c.t}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- STATS */
function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#0F3D44] py-16 text-white sm:py-20" aria-labelledby="stats-title">
      <div className="garland absolute inset-x-0 bottom-0 opacity-50" aria-hidden="true" />
      <div className="container-page relative">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <h2 id="stats-title" className="max-w-lg text-3xl text-white sm:text-4xl">Every number is a person, a family or an animal.</h2>
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-dashed border-[#F4B154]/60 px-3 py-1 text-xs text-[#F4B154]">Demo figures · {headlinePeriod.split('·')[1]}</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {headlineStats.map((s) => <ImpactStat key={s.label} value={s.value} suffix={s.suffix} label={s.label} light />)}
        </div>
        <p className="mt-10 max-w-2xl text-sm text-white/65">These are sample figures for demonstration and are not verified achievements. They will be replaced with audited data and a stated reporting period. <Link to="/impact" className="font-semibold text-[#F4B154] underline underline-offset-4">Explore the impact dashboard</Link></p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- OUR WORK */
function OurWork() {
  const order = ['education', 'women-empowerment', 'healthcare', 'food-essentials', 'livelihood-skills', 'child-protection', 'elderly-care', 'animal-welfare', 'emergency-relief', 'environment-community'];
  const list = order.map((s) => programmes.find((p) => p.slug === s)!);
  return (
    <section className="section" aria-labelledby="work-title">
      <div className="container-page">
        <SectionHeader id="work-title" eyebrow="Our work" title="Ten programmes, one community."
          text="Each programme is designed with the people it serves and reviewed against what actually changes."
          action={<ButtonLink to="/programmes" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />}>All programmes</ButtonLink>} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((p, i) => {
            const wide = p.slug === 'education' || p.slug === 'animal-welfare';
            return (
              <Reveal key={p.slug} className={cn(wide && 'sm:col-span-2')}>
                {wide ? <WideProgramme p={p} i={i} /> : <ProgrammeCard p={p} index={i} />}
              </Reveal>
            );
          })}
        </div>
        <p className="mt-6 text-sm text-muted">We also offer <Link to="/programmes/marriage-assistance" className="link">Marriage Assistance</Link> for eligible families, handled confidentially.</p>
      </div>
    </section>
  );
}
function WideProgramme({ p, i }: { p: (typeof programmes)[number]; i: number }) {
  return (
    <article className="group relative grid h-full overflow-hidden rounded-2xl bg-[#0F3D44] text-white transition-shadow hover:shadow-lift sm:grid-cols-2">
      <Media theme={p.theme} seed={i + 2} alt={`Illustration for ${p.title}`} ratio="aspect-[16/10] sm:aspect-auto sm:h-full" />
      <div className="flex flex-col p-6">
        <Badge tone="plain" className="self-start bg-white/15 text-white">Focus programme</Badge>
        <h3 className="mt-3 text-2xl text-white">{p.title}</h3>
        <p className="mt-2 flex-1 text-white/75">{p.summary}</p>
        <Link to={`/programmes/${p.slug}`} className="mt-5 inline-flex items-center gap-1 font-semibold text-[#F4B154] after:absolute after:inset-0 after:content-['']">
          Learn more <ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only">about {p.title}</span>
        </Link>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------- FEATURED CAMPAIGN */
function FeaturedCampaign() {
  const s = useAsync(() => contentApi.campaigns(), []);
  return (
    <section className="section bg-surface-2/60" aria-labelledby="featured-title">
      <div className="container-page">
        <AsyncView state={s} retry={s.retry} loading={<SkeletonCards count={1} className="lg:grid-cols-1" />}
          isEmpty={(d) => !d.some((c) => c.featured && c.status === 'active')}
          empty={<EmptyState title="No campaigns available right now." text="Please check back soon, or give to our General Fund." action={<ButtonLink to="/donate">Give to the General Fund</ButtonLink>} />}>
          {(data) => {
            const c = data.find((x) => x.featured && x.status === 'active')!;
            return (
              <article className="grid overflow-hidden rounded-3xl border border-line bg-surface shadow-soft lg:grid-cols-[1.1fr_1fr]">
                <div className="relative min-h-[16rem]">
                  <Scene theme={c.theme} seed={31} className="absolute inset-0 h-full w-full" />
                  <Badge tone="plain" className="absolute left-5 top-5 bg-white/90 text-[#0F3D44]" dot>Featured campaign</Badge>
                </div>
                <div className="p-6 sm:p-10">
                  <p className="eyebrow">{c.category}</p>
                  <h2 id="featured-title" className="mt-3 text-3xl sm:text-4xl">{c.title}</h2>
                  <p className="mt-4 text-muted">{c.description}</p>
                  <div className="mt-8"><CampaignMeta c={c} large /></div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <ButtonLink to={`/donate?campaign=${c.slug}`} variant="donate" size="lg" icon={<Heart className="h-4 w-4 fill-current" />}>DONATE NOW</ButtonLink>
                    <ButtonLink to={`/campaigns/${c.slug}`} variant="secondary" size="lg">Read the campaign</ButtonLink>
                  </div>
                  <DemoNote className="mt-6">Campaign amounts and supporter counts are sample values.</DemoNote>
                </div>
              </article>
            );
          }}
        </AsyncView>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- SUPPORT HELPS */
function SupportHelps() {
  const tiers = [
    { amt: 500, text: 'Can support educational materials for a child for a term.', icon: FileText, tone: 'bg-marigold-soft' },
    { amt: 1000, text: 'Can support essential healthcare or food assistance for a family.', icon: HeartPulse, tone: 'bg-leaf-soft' },
    { amt: 2500, text: 'Can support skill-development activities for a trainee.', icon: HandCoins, tone: 'bg-brand-soft' },
  ];
  return (
    <section className="section" aria-labelledby="helps-title">
      <div className="container-page">
        <SectionHeader id="helps-title" eyebrow="How your support helps" title="Small amounts, practical help." align="center" />
        <div className="grid gap-5 md:grid-cols-3">
          {tiers.map((t) => (
            <Reveal key={t.amt}>
              <Link to={`/donate?amount=${t.amt}`} className={cn('group flex h-full flex-col rounded-3xl p-7 transition-transform hover:-translate-y-1', t.tone)}>
                <t.icon className="h-7 w-7 text-brand-text" aria-hidden="true" />
                <p className="mt-6 font-display text-5xl tabular">{inr(t.amt)}</p>
                <p className="mt-3 flex-1 text-[1.02rem]">{t.text}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-brand-text">Give {inr(t.amt)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-muted">Illustrative examples. Replace with verified, NGO-defined impact statements. Funds are used where needs are greatest within the chosen cause.</p>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- ANIMALS */
function AnimalWelfare() {
  const items = [
    { t: 'Animal rescue', i: Siren }, { t: 'Food & feeding', i: Bone }, { t: 'Veterinary treatment', i: HeartPulse }, { t: 'Vaccination', i: Syringe },
    { t: 'Sterilisation', i: ShieldPlus }, { t: 'Shelter support', i: HomeIcon }, { t: 'Adoption', i: Heart }, { t: 'Fostering', i: PawPrint },
  ];
  return (
    <section className="relative overflow-hidden bg-[#241710] py-20 text-white sm:py-24" aria-labelledby="animals-title">
      <div className="absolute inset-0 opacity-80" aria-hidden="true">
        <img src="/images/animal_rescue.jpg" alt="Animal shelter volunteer caring for rescue dog" className="h-full w-full object-cover object-center" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-[#180e08] via-[#180e08]/90 to-[#180e08]/30 sm:via-[#180e08]/85" aria-hidden="true" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#F4B154]">Animal welfare</p>
          <h2 id="animals-title" className="mt-3 text-4xl text-white sm:text-5xl">Care for the animals who share our streets.</h2>
          <p className="mt-5 max-w-xl text-lg text-white/80">From an injured dog at a market to a litter of kittens in the rain, our team and partner vets respond, treat, vaccinate and find safe homes.</p>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map(({ t, i: I }) => (
              <li key={t} className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-sm ring-1 ring-white/15">
                <I className="h-5 w-5 text-[#F4B154]" aria-hidden="true" /><span className="mt-2 block text-sm font-semibold">{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/donate?cause=Animals" variant="donate" size="lg" icon={<PawPrint className="h-4 w-4" />}>Support Animal Welfare</ButtonLink>
            <ButtonLink to="/programmes/animal-welfare#adopt" variant="light" size="lg">Adopt or foster</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- STORIES */
function Stories() {
  const s = useAsync(() => contentApi.stories(), []);
  return (
    <section className="section" aria-labelledby="stories-title">
      <div className="container-page">
        <SectionHeader id="stories-title" eyebrow="Success stories" title="Change, in people's own words."
          text="Shared with consent. Names and identifying details are changed where needed."
          action={<ButtonLink to="/stories" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />}>All stories</ButtonLink>} />
        <AsyncView state={s} retry={s.retry} empty={<EmptyState title="No stories published yet." />}>
          {(d) => <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{d.slice(0, 3).map((x, i) => <Reveal key={x.id}><StoryCard s={x} index={i} /></Reveal>)}</div>}
        </AsyncView>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- UPDATES */
function Updates() {
  const s = useAsync(() => contentApi.updates(), []);
  const icons = { Campaign: Megaphone, Event: CalendarDays, 'Field activity': Truck, 'Volunteer activity': Users, 'Community programme': Landmark } as Record<string, typeof Megaphone>;
  return (
    <section className="section bg-surface-2/60" aria-labelledby="updates-title">
      <div className="container-page">
        <SectionHeader id="updates-title" eyebrow="Latest updates" title="What's happening now."
          action={<ButtonLink to="/events" variant="secondary" icon={<CalendarDays className="h-4 w-4" />}>Events calendar</ButtonLink>} />
        <AsyncView state={s} retry={s.retry} loading={<SkeletonCards count={2} />} empty={<EmptyState title="No updates yet." />}>
          {(d) => (
            <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
              <Link to={d[0].to} className="group relative overflow-hidden rounded-3xl bg-surface shadow-soft">
                <Media theme={d[0].theme} seed={44} alt="" ratio="aspect-[16/9]" />
                <div className="p-6">
                  <p className="flex items-center gap-2 text-xs text-muted"><Badge tone="hibiscus">{d[0].kind}</Badge><time dateTime={d[0].date}>{fmtDate(d[0].date)}</time></p>
                  <h3 className="mt-3 text-2xl group-hover:text-brand-text">{d[0].title}</h3>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-text">Read more <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                </div>
              </Link>
              <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-3xl bg-surface shadow-soft">
                {d.slice(1).map((u, i) => {
                  const I = icons[u.kind] ?? Megaphone;
                  return (
                    <li key={u.id}>
                      <Link to={u.to} className="group flex items-center gap-4 p-4 hover:bg-surface-2/60 sm:p-5">
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl"><Scene theme={u.theme} seed={50 + i} className="h-full w-full" birds={false} /></div>
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-xs text-muted"><I className="h-3.5 w-3.5" aria-hidden="true" />{u.kind} · <time dateTime={u.date}>{fmtDate(u.date, { day: 'numeric', month: 'short' })}</time></p>
                          <p className="mt-1 font-semibold leading-snug group-hover:text-brand-text">{u.title}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </AsyncView>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- VOLUNTEER CTA */
function VolunteerCta() {
  return (
    <section className="section" aria-labelledby="vol-title">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#EFA23A]">
          <div className="absolute inset-0" aria-hidden="true"><Scene theme="volunteer" seed={7} className="h-full w-full" /></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D44] via-[#0F3D44]/60 to-transparent sm:bg-gradient-to-r sm:from-[#0F3D44] sm:via-[#0F3D44]/75 sm:to-transparent" aria-hidden="true" />
          <div className="relative max-w-xl p-8 pt-40 text-white sm:p-14">
            <h2 id="vol-title" className="text-4xl text-white sm:text-5xl">Your time can make a difference.</h2>
            <p className="mt-4 text-lg text-white/85">Teach a child to read, walk a feeding route, help at a health camp or lend your professional skills. Two hours a week is enough to start.</p>
            <ButtonLink to="/volunteer" variant="donate" size="lg" className="mt-8" icon={<Users className="h-4 w-4" />}>BECOME A VOLUNTEER</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- CSR */
function Csr() {
  const points = ['Programme-aligned CSR projects', 'Clear milestones and impact reporting', 'Employee volunteering days', 'Long-term partnerships'];
  return (
    <section className="pb-16 sm:pb-24" aria-labelledby="csr-title">
      <div className="container-page"><div className="grid items-center gap-10 rounded-[2rem] border border-line bg-surface p-6 sm:p-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow mb-3"><Building2 className="h-4 w-4" aria-hidden="true" />CSR &amp; partnerships</p>
          <h2 id="csr-title" className="h-section">Partner with us for greater impact.</h2>
          <p className="mt-4 text-lg text-muted">We work with companies, foundations and institutions to design projects that meet real community needs and report honestly on results.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/csr" size="lg">CSR PARTNERSHIP</ButtonLink>
            <ButtonLink to="/csr#enquiry" variant="secondary" size="lg">PARTNER WITH US</ButtonLink>
          </div>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {points.map((p, i) => (
            <li key={p} className="rounded-2xl bg-surface-2 p-5">
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <p className="mt-2 font-semibold">{p}</p>
            </li>
          ))}
        </ul>
      </div></div>
    </section>
  );
}

/* ----------------------------------------------------------- TRANSPARENCY */
function Transparency() {
  const cards = [
    { t: 'Annual Reports', i: ScrollText }, { t: 'Financial Reports', i: Landmark }, { t: 'Impact Reports', i: FileText },
    { t: 'Policies', i: ShieldPlus }, { t: 'Legal Documents', i: Scale },
  ];
  return (
    <section className="section bg-surface-2/60" aria-labelledby="trans-title">
      <div className="container-page">
        <SectionHeader id="trans-title" eyebrow="Transparency" title="Open books, verified documents."
          text="We publish documents only after they are verified. Until then, each slot is marked as pending."
          action={<ButtonLink to="/transparency" variant="secondary" icon={<ArrowUpRight className="h-4 w-4" />}>Transparency centre</ButtonLink>} />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {cards.map(({ t, i: I }) => (
            <Link key={t} to="/transparency" className="group flex flex-col rounded-2xl border border-line bg-surface p-5 transition-shadow hover:shadow-soft">
              <I className="h-6 w-6 text-brand-text" aria-hidden="true" />
              <p className="mt-4 font-semibold">{t}</p>
              <p className="mt-1 text-xs text-muted">Awaiting verified upload</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- NEWSLETTER */
function Newsletter() {
  return (
    <section className="bg-[#0F3D44] py-16 text-white" aria-labelledby="news-title">
      <div className="container-page flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-md">
          <h2 id="news-title" className="text-3xl text-white sm:text-4xl">Stay connected with our work.</h2>
          <p className="mt-3 text-white/75">Monthly stories, campaign updates and volunteering opportunities.</p>
        </div>
        <NewsletterForm dark />
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- CONTACT */
export function ContactBlock() {
  const rows = [
    { i: Phone, l: 'Phone', v: brand.contact.phone, n: brand.contact.phoneNote },
    { i: MessageCircle, l: 'WhatsApp', v: brand.contact.whatsapp },
    { i: Mail, l: 'Email', v: brand.contact.email, n: brand.contact.emailNote },
    { i: MapPin, l: 'Office', v: brand.contact.address.join(', ') },
  ];
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <div className="space-y-5">
        <ul className="space-y-4">
          {rows.map(({ i: I, l, v, n }) => (
            <li key={l} className="flex gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand-text"><I className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0"><p className="text-sm text-muted">{l}</p><p className="select-all break-words font-semibold">{v}</p>{n && <p className="text-xs text-muted">{n}</p>}</div>
            </li>
          ))}
        </ul>
        <p className="text-sm text-muted">{brand.contact.hours}</p>
        <SocialRow light={false} />
        <div className="relative overflow-hidden rounded-2xl border border-line" role="img" aria-label="Map placeholder. Replace with the office location map.">
          <svg viewBox="0 0 400 180" className="h-44 w-full" aria-hidden="true">
            <rect width="400" height="180" fill="rgb(var(--surface-2))" />
            {Array.from({ length: 9 }, (_, i) => <line key={'h' + i} x1="0" x2="400" y1={i * 22} y2={i * 22 + 8} stroke="rgb(var(--line))" strokeWidth={i % 3 ? 1 : 5} />)}
            {Array.from({ length: 12 }, (_, i) => <line key={'v' + i} y1="0" y2="180" x1={i * 36} x2={i * 36 - 14} stroke="rgb(var(--line))" strokeWidth={i % 4 ? 1 : 6} />)}
            <path d="M0 130 C 90 110, 160 150, 260 120 S 380 90, 400 100" stroke="rgb(var(--brand-text) / 0.35)" strokeWidth="10" fill="none" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <span className="flex flex-col items-center"><MapPin className="h-9 w-9 fill-marigold text-[#0F3D44]" aria-hidden="true" /><span className="mt-1 rounded-full bg-surface px-3 py-1 text-xs font-semibold shadow-soft">Map placeholder</span></span>
          </div>
        </div>
      </div>
      <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
        <h3 className="text-2xl">Send us a message</h3>
        <p className="mb-6 mt-1 text-sm text-muted">For rescues and emergencies, please call.</p>
        <ContactForm compact />
      </div>
    </div>
  );
}
function Contact() {
  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container-page">
        <SectionHeader id="contact-title" eyebrow="Contact" title="We'd love to hear from you." />
        <ContactBlock />
      </div>
    </section>
  );
}

export default function Home() {
  useSeo({ title: brand.name, description: `${brand.name} works with communities on education, women's empowerment, healthcare, livelihoods, animal welfare and emergency relief. Donate, volunteer or partner with us.`, path: '/', jsonLd: orgJsonLd });
  return (
    <>
      <Hero />
      <TrustStrip />
      <OfficialCertifications />
      <Intro />
      <Stats />
      <OurWork />
      <FeaturedCampaign />
      <SupportHelps />
      <AnimalWelfare />
      <Stories />
      <Updates />
      <VolunteerCta />
      <Csr />
      <Transparency />
      <Newsletter />
      <Contact />
    </>
  );
}
