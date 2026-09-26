import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Briefcase, Building2, Camera, CheckCircle2, ClipboardCheck, GraduationCap, HandHeart, Heart, HeartPulse, Laptop, Megaphone, PawPrint, Share2, Sprout, Target, Truck, Users } from 'lucide-react';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHeader } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { VolunteerForm } from '@/components/forms/VolunteerForm';
import { PartnershipForm } from '@/components/forms/PartnershipForm';
import { FundraiserForm } from '@/components/forms/QuickForms';
import { ContactForm } from '@/components/forms/ContactForm';
import { Scene } from '@/components/media/Scene';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';

export function GetInvolved() {
  useSeo({ title: 'Get Involved', description: 'Volunteer, fundraise, partner through CSR, bring your campus or community, or work with us.', path: '/get-involved' });
  const ways = [
    { t: 'Volunteer', d: 'Give your time and skills on the ground or remotely.', to: '/volunteer', i: Users, theme: 'volunteer' as const },
    { t: 'Fundraise', d: 'Start a fundraiser for a birthday, a run or your office.', to: '/fundraise', i: Megaphone, theme: 'education' as const },
    { t: 'CSR / Corporate Partnerships', d: 'Fund programmes and engage your employees.', to: '/csr', i: Building2, theme: 'livelihood' as const },
    { t: 'Campus / Community', d: 'Bring your college, school or residents’ group.', to: '/get-involved/campus', i: GraduationCap, theme: 'environment' as const },
    { t: 'Internships / Careers', d: 'Work or intern with our team.', to: '/careers', i: Briefcase, theme: 'community' as const },
    { t: 'Donate', d: 'Support a cause with a one-time or monthly gift.', to: '/donate', i: Heart, theme: 'women' as const },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved' }]} eyebrow="Get involved" theme="volunteer" seed={6} title="There's a place for you here." text="Choose the way of helping that fits your time, skills and resources." />
      <section className="section">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ways.map(({ t, d, to, i: I, theme }, idx) => (
            <Link key={t} to={to} className="group overflow-hidden rounded-3xl border border-line bg-surface transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-lift">
              <div className="relative h-32"><Scene theme={theme} seed={idx + 30} className="h-full w-full" /><span className="absolute bottom-3 left-4 grid h-11 w-11 place-items-center rounded-xl bg-surface text-brand-text shadow-soft"><I className="h-5 w-5" aria-hidden="true" /></span></div>
              <div className="p-6"><h2 className="text-2xl group-hover:text-brand-text">{t}</h2><p className="mt-2 text-muted">{d}</p><span className="mt-4 inline-block text-sm font-semibold text-brand-text">Get started →</span></div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export function Volunteer() {
  useSeo({ title: 'Volunteer', description: 'Volunteer with Shivshristi Seva Sansthan in education, animal welfare, health camps, distributions, events and more. Apply online.', path: '/volunteer' });
  const roles = [
    { t: 'Tutor or mentor', d: 'Weekly study support at a learning centre.', i: BookOpen, time: '2–4 hrs/week' },
    { t: 'Feeding route volunteer', d: 'Feed and check on community animals.', i: PawPrint, time: 'Weekends' },
    { t: 'Health camp support', d: 'Registration, crowd management, follow-up calls.', i: HeartPulse, time: 'Monthly' },
    { t: 'Distribution volunteer', d: 'Pack and hand over ration and relief kits.', i: Truck, time: 'As needed' },
    { t: 'Photography & stories', d: 'Document work with care and consent.', i: Camera, time: 'Flexible' },
    { t: 'Skilled / remote', d: 'Design, data, finance, legal or tech support.', i: Laptop, time: 'Remote' },
    { t: 'Green drives', d: 'Plantations and clean-ups.', i: Sprout, time: 'Monthly' },
    { t: 'Elder companion', d: 'Weekly visits or calls to older people.', i: HandHeart, time: '1–2 hrs/week' },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved', to: '/get-involved' }, { label: 'Volunteer' }]} eyebrow="Volunteer" theme="volunteer" seed={2}
        title="Your time can make a difference." text="Join a community of volunteers who teach, feed, heal, pack, plant and listen.">
        <ButtonLink to="/volunteer#apply" variant="donate" size="lg">Apply now</ButtonLink>
      </PageHero>
      <section className="section" aria-labelledby="why">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeader id="why" eyebrow="Why volunteer" title="Meaningful work, real people, real skills." />
            <ul className="space-y-3">
              {['Orientation and training before you start', 'A named coordinator you can call', 'Certificate of volunteering on request', 'Work that fits your schedule, on-site or remote', 'Learn about communities, public health and animal care'].map((b) => (
                <li key={b} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf" aria-hidden="true" />{b}</li>
              ))}
            </ul>
            <div className="mt-8 rounded-2xl border border-dashed border-line p-5 text-sm text-muted">Volunteer testimonials will be shown here once real volunteers share them with consent.</div>
          </div>
          <div>
            <h2 className="text-2xl">Opportunities &amp; roles</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {roles.map(({ t, d, i: I, time }) => (
                <li key={t} className="flex gap-3 rounded-2xl border border-line bg-surface p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-marigold-soft text-warn"><I className="h-5 w-5" aria-hidden="true" /></span>
                  <div><p className="font-semibold">{t}</p><p className="text-sm text-muted">{d}</p><Badge className="mt-2">{time}</Badge></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section id="apply" className="section bg-surface-2/60" aria-labelledby="apply-title">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className="eyebrow mb-3">Application</p>
            <h2 id="apply-title" className="h-section">Apply to volunteer</h2>
            <p className="mt-4 text-muted">It takes about three minutes. We review every application and reply within a week.</p>
            <ol className="mt-8 space-y-4">
              {['Apply online', 'Short call with our coordinator', 'Orientation and code of conduct', 'Start with your first activity'].map((s, i) => (
                <li key={s} className="flex items-center gap-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-brand font-semibold text-brand-fg tabular">{i + 1}</span>{s}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"><VolunteerForm /></div>
        </div>
      </section>
    </>
  );
}

export function Fundraise() {
  useSeo({ title: 'Fundraise', description: 'Start a fundraiser for a cause you care about. Share it, track progress and see the impact.', path: '/fundraise' });
  const steps = [
    { t: 'Create your fundraiser', d: 'Choose a cause, set a goal and tell people why it matters to you.', i: Target },
    { t: 'Share it', d: 'Send your page to friends, family and colleagues on WhatsApp and social media.', i: Share2 },
    { t: 'Track progress', d: 'See donations come in and post updates for your supporters.', i: BarChart3 },
    { t: 'See the impact', d: 'We share how the funds were used once the work is done.', i: ClipboardCheck },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved', to: '/get-involved' }, { label: 'Fundraise' }]} eyebrow="Fundraise" theme="education" seed={40}
        title="Turn your occasion into support for others." text="Birthdays, marathons, weddings, office drives or in memory of someone. Rally your people around a cause." />
      <section className="section" aria-labelledby="how">
        <div className="container-page">
          <SectionHeader id="how" eyebrow="How it works" title="Four simple steps." />
          <ol className="grid gap-5 md:grid-cols-4">
            {steps.map(({ t, d, i: I }, n) => (
              <li key={t} className="relative rounded-3xl border border-line bg-surface p-6">
                <span className="font-mono text-sm text-muted">Step {n + 1}</span>
                <I className="mt-4 h-7 w-7 text-brand-text" aria-hidden="true" />
                <h3 className="mt-3 text-xl">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section bg-surface-2/60" aria-labelledby="start">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div>
            <h2 id="start" className="h-section">Start a fundraiser</h2>
            <p className="mt-4 text-muted">Self-serve fundraiser pages are coming soon. For now, tell us about your fundraiser and we will set up a page for you.</p>
            <div className="mt-8"><h3 className="font-sans font-semibold">Support an existing campaign</h3><p className="mt-1 text-sm text-muted">You can also share one of our active campaigns.</p><ButtonLink to="/campaigns" variant="secondary" className="mt-4">Browse campaigns</ButtonLink></div>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"><FundraiserForm /></div>
        </div>
      </section>
    </>
  );
}

export function Csr() {
  useSeo({ title: 'CSR & Corporate Partnerships', description: 'Partner with Shivshristi Seva Sansthan for CSR programmes, employee volunteering, corporate giving and long-term impact.', path: '/csr' });
  const why = [
    { t: 'Why partner with us', d: 'Grounded programmes, local volunteers and a commitment to verified reporting.', i: Target },
    { t: 'CSR programmes', d: 'Projects aligned to Schedule VII areas: education, health, livelihoods, environment, animal welfare and disaster relief.', i: Briefcase },
    { t: 'Impact measurement', d: 'Agreed indicators, baselines, milestone reports and field visits.', i: BarChart3 },
    { t: 'Employee volunteering', d: 'Plantation drives, kit packing, mentoring and skills-based volunteering.', i: Users },
    { t: 'Corporate donations', d: 'Payroll giving, matched giving and festival campaigns.', i: Heart },
    { t: 'Long-term partnerships', d: 'Multi-year programmes that build lasting change.', i: HandHeart },
  ];
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved', to: '/get-involved' }, { label: 'CSR / Partnerships' }]} eyebrow="CSR & partnerships" theme="livelihood" seed={3}
        title="Partner with us for greater impact." text="Design CSR programmes with measurable outcomes, and give your people meaningful ways to contribute.">
        <ButtonLink to="/csr#enquiry" variant="donate" size="lg">Partner with us</ButtonLink>
      </PageHero>
      <section className="section">
        <div className="container-page grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {why.map(({ t, d, i: I }) => (
            <div key={t} className="rounded-3xl border border-line bg-surface p-6"><I className="h-7 w-7 text-brand-text" aria-hidden="true" /><h2 className="mt-4 text-xl">{t}</h2><p className="mt-2 text-muted">{d}</p></div>
          ))}
        </div>
        <p className="container-page mt-6 text-sm text-muted">CSR eligibility: [Replace with verified CSR-1 registration and 12A/80G status.]</p>
      </section>
      <section id="enquiry" className="section bg-surface-2/60" aria-labelledby="enq">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="enq" className="h-section">Start a conversation</h2>
            <p className="mt-4 text-muted">Tell us about your priorities. We will share a tailored proposal, budget and reporting plan.</p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"><PartnershipForm /></div>
        </div>
      </section>
    </>
  );
}

export function Campus() {
  useSeo({ title: 'Campus & Community', description: 'Bring your college, school, NSS unit or residents’ association to volunteer, run drives and raise awareness.', path: '/get-involved/campus' });
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved', to: '/get-involved' }, { label: 'Campus / Community' }]} eyebrow="Campus & community" theme="environment" seed={11}
        title="Bring your campus or community." text="NSS units, student clubs, schools and residents' associations can run drives, host awareness sessions and volunteer together." />
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <ul className="grid gap-4 sm:grid-cols-2">
            {[['Collection drives', 'Books, stationery, clothes and animal food.'], ['Awareness sessions', 'Waste segregation, animal coexistence, health.'], ['Volunteer days', 'Plantations, clean-ups and kit packing.'], ['Student chapters', 'Run a year-long chapter with our support.']].map(([t, d]) => (
              <li key={t} className="rounded-2xl border border-line bg-surface p-5"><h2 className="font-sans text-lg font-semibold">{t}</h2><p className="mt-1 text-sm text-muted">{d}</p></li>
            ))}
          </ul>
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"><h2 className="mb-4 text-2xl">Tell us about your group</h2><ContactForm compact /></div>
        </div>
      </section>
    </>
  );
}

export function Careers() {
  useSeo({ title: 'Internships & Careers', description: 'Internships and job openings at Shivshristi Seva Sansthan.', path: '/careers' });
  return (
    <>
      <PageHero crumbs={[{ label: 'Home', to: '/' }, { label: 'Get Involved', to: '/get-involved' }, { label: 'Careers' }]} eyebrow="Careers & internships" theme="community" seed={19}
        title="Work with us." text="We look for people who care about communities and animals, and who are honest, organised and kind." />
      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl">Open positions</h2>
            <div className="mt-5"><EmptyState title="No open positions right now." text="Openings and internships will be listed here. You can still send us your CV and area of interest." icon={<Briefcase className="h-6 w-6" aria-hidden="true" />} /></div>
            <h2 className="mt-12 text-2xl">Internships</h2>
            <p className="mt-2 text-muted">We offer 6–12 week internships in programme research, communications, data and fundraising for students in social work, public health, veterinary science, design and management.</p>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8"><h2 className="mb-4 text-2xl">Send your interest</h2><ContactForm compact /></div>
        </div>
      </section>
    </>
  );
}
