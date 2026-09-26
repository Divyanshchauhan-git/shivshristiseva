import { Link } from 'react-router-dom';
import { Compass, Eye, HandHeart, Handshake, Heart, Scale, Sprout, Target, Users } from 'lucide-react';
import { brand } from '@/config/brand';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader, DemoNote, Reveal } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { Media } from '@/components/media/Media';
import { Scene } from '@/components/media/Scene';
import { milestones, team } from '@/data/content';
import { programmes } from '@/data/programmes';
import { Icon } from '@/components/media/Icon';
import { TrustStrip } from '@/components/layout/TrustStrip';

const values = [
  { t: 'Dignity', d: 'We treat every person and animal with respect, and ask before we photograph or tell a story.', i: Heart },
  { t: 'Transparency', d: 'We publish verified reports and explain how funds are used.', i: Eye },
  { t: 'Community first', d: 'Local people shape our programmes and help run them.', i: Users },
  { t: 'Compassion for all life', d: 'We see the welfare of people, animals and the environment as connected.', i: Sprout },
  { t: 'Safeguarding', d: 'Children and vulnerable adults come first in every decision.', i: Scale },
  { t: 'Accountability', d: 'We measure what changes and say so honestly when something does not work.', i: Target },
];

export default function About() {
  useSeo({ title: 'About Us', description: `The story, vision, mission, values and team of ${brand.name}.`, path: '/about' });
  const sub = [['Our Story', 'story'], ['Vision & Mission', 'vision'], ['Values', 'values'], ['Team', 'team'], ['Where We Work', 'where'], ['Transparency', 'transparency']];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'About Us' }]} eyebrow="About us" theme="community" seed={8}
        title="People helping people, and the animals around them." text={`${brand.name} began with neighbours responding to needs on their own streets. That is still how we work.`} />
      <TrustStrip />

      <nav aria-label="On this page" className="sticky top-[4.5rem] z-30 border-b border-line bg-surface/90 backdrop-blur-md">
        <ul className="container-page flex gap-1 overflow-x-auto py-2.5 text-sm [scrollbar-width:none]">
          {sub.map(([l, id]) => <li key={id}><Link to={`/about#${id}`} className="block whitespace-nowrap rounded-full px-3.5 py-1.5 font-semibold text-muted hover:bg-surface-2 hover:text-brand-text transition-colors">{l}</Link></li>)}
        </ul>
      </nav>

      <section id="story" className="section" aria-labelledby="story-title">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="trust-chip-gold mb-3">Est. 2019 · Registered Society</span>
            <h2 id="story-title" className="h-section mt-2">It started with one learning centre and a bag of dog food.</h2>
            <div className="prose-body mt-6 text-muted">
              <p>Founded with a grassroots commitment to dignity and community solidarity, {brand.name} began when a passionate group of volunteers noticed neighbourhood children falling behind in school, and injured street animals suffering without basic food or care.</p>
              <p>Starting with an after-school study circle in a shared room and a weekend feeding route, the initiative expanded organically into formal programmes in primary education, women's handicraft training, preventative health camps, and emergency animal rescue.</p>
              <p>Today, our foundation brings together devoted field volunteers, verified veterinary surgeons, educators, and transparent donors under one guiding principle: care for people, animals, and the planet is an interconnected sacred responsibility.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Media theme="education" seed={3} alt="A learning centre for children" ratio="aspect-[3/4]" className="rounded-3xl shadow-lift ring-4 ring-white" />
            <Media theme="animals" seed={6} alt="Animal rescue and welfare care" ratio="aspect-[3/4]" className="mt-8 rounded-3xl shadow-lift ring-4 ring-white" />
          </div>
        </div>
      </section>

      <section id="vision" className="bg-gradient-to-br from-[#072427] via-[#0B3B3E] to-[#0A3338] py-16 text-white sm:py-20" aria-label="Vision and mission">
        <div className="container-page grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur-sm shadow-soft">
            <Compass className="h-9 w-9 text-amber-400" aria-hidden="true" />
            <h2 className="mt-5 text-3xl text-white">Vision</h2>
            <p className="mt-3 text-lg text-white/85 leading-relaxed">A society where every person can live with dignity and opportunity, every animal is treated with compassion, and every community is empowered to nurture its own.</p>
          </div>
          <div className="rounded-3xl bg-white/10 p-8 ring-1 ring-white/15 backdrop-blur-sm shadow-soft">
            <Target className="h-9 w-9 text-amber-400" aria-hidden="true" />
            <h2 className="mt-5 text-3xl text-white">Mission</h2>
            <p className="mt-3 text-lg text-white/85 leading-relaxed">To work directly with communities to create educational opportunities, provide emergency relief, protect voiceless animals, and foster self-reliance through accountable, 100% transparent programmes.</p>
          </div>
        </div>
      </section>

      <section id="values" className="section" aria-labelledby="values-title">
        <div className="container-page">
          <SectionHeader id="values-title" eyebrow="Values" title="What guides our decisions." />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map(({ t, d, i: I }) => (
              <Reveal key={t} className="rounded-2xl border border-line bg-surface p-6">
                <I className="h-6 w-6 text-marigold" aria-hidden="true" />
                <h3 className="mt-4 text-xl">{t}</h3>
                <p className="mt-2 text-muted">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface-2/60" aria-labelledby="problem-title">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">The problem we address</p>
            <h2 id="problem-title" className="h-section">Needs are connected, so our work is too.</h2>
            <p className="mt-5 text-lg text-muted">A family that loses income may pull a child out of school, skip a health check-up and stop feeding the dog that lives outside their door. Help that looks at only one of these problems often falls short.</p>
          </div>
          <div>
            <p className="eyebrow mb-3">Our approach</p>
            <ol className="space-y-4">
              {[
                ['Listen first', 'Programmes start with conversations with the community and local partners.'],
                ['Work with local people', 'Volunteers and community leaders help plan, deliver and monitor the work.'],
                ['Connect to what exists', 'We link families to government schemes and services instead of duplicating them.'],
                ['Measure and report', 'We track outcomes and publish verified reports.'],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4 rounded-2xl bg-surface p-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-marigold font-semibold text-marigold-fg tabular">{i + 1}</span>
                  <div><h3 className="font-sans text-base font-semibold">{t}</h3><p className="text-sm text-muted">{d}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="where" className="section" aria-labelledby="where-title">
        <div className="container-page grid items-center gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="eyebrow mb-3">Where we work</p>
            <h2 id="where-title" className="h-section">Urban settlements, peri-urban towns and rural blocks.</h2>
            <p className="mt-5 text-muted">[Replace with verified operational locations.] We prioritise areas where our volunteers live, where partners are present and where needs are clearly documented.</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {programmes.slice(0, 8).map((p) => <li key={p.slug}><Link to={`/programmes/${p.slug}`} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm hover:border-brand-text/50"><Icon name={p.icon} className="h-4 w-4 text-brand-text" />{p.title}</Link></li>)}
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-3xl">
            <Scene theme="environment" seed={22} className="aspect-[4/3] w-full" />
            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-surface/95 p-4 text-sm shadow-soft backdrop-blur">
              <p className="font-semibold">Map of operating areas</p><p className="text-muted">Add a map once locations are verified. Avoid exact addresses for sensitive programmes.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section bg-surface-2/60" aria-labelledby="team-title">
        <div className="container-page">
          <SectionHeader id="team-title" eyebrow="Team & leadership" title="The people behind the work." text="Replace these placeholders with real team members who have agreed to be listed." />
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
            {team.map((m, i) => (
              <div key={m.role} className="text-center">
                <div className="mx-auto h-32 w-32 overflow-hidden rounded-full ring-4 ring-surface"><Scene theme={m.theme} seed={i + 60} className="h-full w-full" birds={false} /></div>
                <p className="mt-3 font-semibold">{m.name}</p><p className="text-sm text-muted">{m.role}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid gap-6 rounded-3xl bg-surface p-6 sm:p-8 md:grid-cols-[auto_1fr]">
            <div className="mx-auto h-40 w-40 overflow-hidden rounded-3xl"><Scene theme="community" seed={70} className="h-full w-full" /></div>
            <div>
              <p className="eyebrow">Founder&rsquo;s note</p>
              <blockquote className="mt-3 font-display text-2xl leading-snug">&ldquo;[Replace with a short, real message from the founder or leadership.]&rdquo;</blockquote>
              <p className="mt-3 text-sm text-muted">[Founder name], Founder &amp; Managing Trustee</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="partners-title">
        <div className="container-page">
          <SectionHeader id="partners-title" eyebrow="Partners" title="Organisations we work with." text="Partner logos will appear here only with written permission from each partner." />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {['Hospitals', 'Veterinary clinics', 'Schools', 'Government departments', 'Companies (CSR)', 'Community groups'].map((p) => (
              <div key={p} className="grid h-24 place-items-center rounded-2xl border border-dashed border-line px-3 text-center text-sm text-muted"><Handshake className="mb-1 h-5 w-5" aria-hidden="true" />{p}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-surface-2/60" aria-labelledby="miles-title">
        <div className="container-page">
          <SectionHeader id="miles-title" eyebrow="Milestones" title="How we have grown." />
          <DemoNote className="mb-8">Milestone years are placeholders. Replace with verified dates.</DemoNote>
          <ol className="relative grid gap-8 border-l-2 border-marigold/60 pl-8 md:grid-cols-3 md:border-l-0 md:border-t-2 md:pl-0 md:pt-8">
            {milestones.map((m) => (
              <li key={m.title} className="relative">
                <span className="absolute -left-[2.55rem] top-1 h-4 w-4 rounded-full border-4 border-bg bg-marigold md:-top-[2.6rem] md:left-0" aria-hidden="true" />
                <p className="font-mono text-sm text-brand-text">{m.year}</p>
                <h3 className="mt-1 text-xl">{m.title}</h3>
                <p className="mt-1 text-muted">{m.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="transparency" className="section" aria-labelledby="t-title">
        <div className="container-page"><div className="grid items-center gap-8 rounded-[2rem] bg-[#0F3D44] p-6 text-white sm:p-12 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 id="t-title" className="text-3xl text-white sm:text-4xl">Transparency is part of the work.</h2>
            <p className="mt-3 text-white/80">Registration details, audited accounts, annual reports and policies are published in our Transparency Centre as soon as they are verified.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <ButtonLink to="/transparency" variant="light" size="lg">Visit the Transparency Centre</ButtonLink>
            <ButtonLink to="/donate" variant="donate" size="lg" icon={<HandHeart className="h-4 w-4" />}>Support our work</ButtonLink>
          </div>
        </div></div>
      </section>
    </>
  );
}
