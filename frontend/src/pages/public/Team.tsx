import { Link } from 'react-router-dom';
import { ShieldCheck, Compass, FileText, CheckCircle2, HandHeart } from 'lucide-react';
import { brand } from '@/config/brand';
import { useSeo } from '@/hooks/useSeo';
import { PageHero } from '@/components/layout/PageHero';
import { TrustStrip } from '@/components/layout/TrustStrip';
import { DemoNote } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';

// Team components & data
import {
  chairperson,
  trustees,
  advisors,
  executiveLeadership,
  administrationTeam,
  communicationTeam,
  programmeTeam,
} from '@/data/team';
import { LeadershipCard } from '@/components/team/LeadershipCard';
import { TrusteeCard } from '@/components/team/TrusteeCard';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { TeamSection } from '@/components/team/TeamSection';
import { OrganizationChart } from '@/components/team/OrganizationChart';

const subNavItems = [
  { label: 'Governing Body', id: 'trustees' },
  { label: 'Advisory Board', id: 'advisory' },
  { label: 'Executive Leadership', id: 'executive' },
  { label: 'Org Structure', id: 'org-structure' },
  { label: 'Administration', id: 'admin' },
  { label: 'Outreach', id: 'outreach' },
  { label: 'Programmes', id: 'programmes' },
];

export default function Team() {
  useSeo({
    title: 'Our Team & Governance',
    description: `Meet the Board of Trustees, Advisory Board, Executive Leadership, and field teams of ${brand.name}.`,
    path: '/team',
  });

  return (
    <>
      {/* 1. HERO / PAGE HEADER */}
      <PageHero
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Our Team & Governance' }]}
        eyebrow="Our Team & Governance"
        theme="community"
        seed={12}
        title="Leadership, governance & dedicated field teams."
        text={`At ${brand.name}, our work is steered by an experienced Board of Trustees, counseled by an independent Advisory Board, and carried out by passionate community coordinators.`}
      >
        <ButtonLink to="/transparency" variant="light" size="sm" icon={<FileText className="h-4 w-4" />}>
          View Governance Documents
        </ButtonLink>
        <ButtonLink to="/donate" variant="donate" size="sm" icon={<HandHeart className="h-4 w-4" />}>
          Support Our Mission
        </ButtonLink>
      </PageHero>

      <TrustStrip />

      {/* STICKY SUB-NAVIGATION */}
      <nav
        aria-label="On this page"
        className="sticky top-[4.5rem] z-30 border-b border-line bg-surface/90 backdrop-blur-md"
      >
        <ul className="container-page flex gap-1.5 overflow-x-auto py-2.5 text-xs sm:text-sm [scrollbar-width:none]">
          {subNavItems.map(({ label, id }) => (
            <li key={id}>
              <Link
                to={`/team#${id}`}
                className="block whitespace-nowrap rounded-full px-3.5 py-1.5 font-semibold text-muted transition-colors hover:bg-surface-2 hover:text-brand-text"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* PLACEHOLDER TRANSPARENCY NOTICE */}
      <div className="container-page pt-8">
        <DemoNote className="w-full">
          <strong>Governance Notice:</strong> Profile names and descriptions shown below use structured placeholders.
          They are ready to be updated with verified names, credentials, and consented photographs in{' '}
          <code className="rounded bg-black/5 px-1 py-0.5 font-mono text-[0.85em]">frontend/src/data/team.ts</code>.
        </DemoNote>
      </div>

      {/* ====================================================================
       * 1. GOVERNING BODY — BOARD OF TRUSTEES (CHAIRPERSON + TRUSTEES)
       * ==================================================================== */}
      <TeamSection
        id="trustees"
        eyebrow="Governing Body"
        title="Board of Trustees"
        text="The Board of Trustees holds the fiduciary, statutory, and ethical responsibility for the foundation. The Chairperson provides strategic and institutional guidance."
      >
        {/* Chairperson Highlighted Card */}
        <div className="mb-12">
          <LeadershipCard member={chairperson} />
        </div>

        {/* Board of Trustees Grid */}
        <div>
          <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
            <h3 className="font-display text-xl sm:text-2xl text-fg">
              Trustees of the Foundation
            </h3>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">
              5 Dedicated Trustees
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trustees.map((trustee) => (
              <TrusteeCard key={trustee.id} member={trustee} />
            ))}
          </div>
        </div>
      </TeamSection>

      {/* ====================================================================
       * 2. ADVISORY BODY — ADVISORY BOARD
       * ==================================================================== */}
      <TeamSection
        id="advisory"
        bg="subtle"
        eyebrow="Independent Counsel"
        title="Advisory Board"
        text="Distinguished specialists who provide independent guidance to the Governing Body in law, financial audit, public health, and social welfare."
      >
        {/* Visual Advisory Guidance Banner */}
        <div className="mb-8 flex flex-col md:flex-row items-center gap-4 rounded-2xl border border-amber-500/30 bg-amber-50/70 p-4 sm:p-5 text-amber-950 backdrop-blur-sm">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-800">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm sm:text-base font-semibold">
              Strategic, Legal & Financial Advisory Oversight
            </p>
            <p className="mt-0.5 text-xs sm:text-sm text-amber-900/80">
              The Advisory Board holds an independent, consultative role—reviewing programmatic impact, ensuring 80G/12A statutory integrity, and counseling trustees on long-term institutional growth.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-amber-500/40 bg-surface px-3 py-1 text-xs font-bold text-amber-900">
            Advisory Counsel
          </span>
        </div>

        {/* Advisory Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {advisors.map((advisor) => (
            <TeamMemberCard key={advisor.id} member={advisor} variant="advisor" />
          ))}
        </div>
      </TeamSection>

      {/* ====================================================================
       * 3. EXECUTIVE LEADERSHIP
       * ==================================================================== */}
      <TeamSection
        id="executive"
        eyebrow="Management & Operations"
        title="Executive Leadership"
        text="The executive officers oversee daily field coordination, administrative governance, financial disbursements, and programme execution."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {executiveLeadership.map((leader) => (
            <TeamMemberCard key={leader.id} member={leader} variant="executive" />
          ))}
        </div>
      </TeamSection>

      {/* ====================================================================
       * 4. ORGANIZATIONAL STRUCTURE (VISUAL ORG CHART)
       * ==================================================================== */}
      <TeamSection
        id="org-structure"
        bg="subtle"
        eyebrow="Institutional Hierarchy"
        title="Organizational Structure"
        text="A transparent visual view of leadership tiers, advisory relationships, and operational department branches."
      >
        <div className="mt-4">
          <OrganizationChart />
        </div>
      </TeamSection>

      {/* ====================================================================
       * 5. ADMINISTRATION & FINANCE TEAM
       * ==================================================================== */}
      <TeamSection
        id="admin"
        eyebrow="Branch 1 — Operations"
        title="Administration & Finance Team"
        text="Ensuring seamless day-to-day office management, rigorous financial accounts, legal documentation, and volunteer onboarding."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {administrationTeam.map((member) => (
            <TeamMemberCard key={member.id} member={member} variant="compact" />
          ))}
        </div>
      </TeamSection>

      {/* ====================================================================
       * 6. COMMUNICATION & OUTREACH TEAM
       * ==================================================================== */}
      <TeamSection
        id="outreach"
        bg="subtle"
        eyebrow="Branch 2 — Engagement"
        title="Communication & Outreach Team"
        text="Amplifying verified impact stories, coordinating media dissemination, digital engagement, and public advocacy."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {communicationTeam.map((member) => (
            <TeamMemberCard key={member.id} member={member} variant="compact" />
          ))}
        </div>
      </TeamSection>

      {/* ====================================================================
       * 7. PROGRAMMES & PROJECTS FIELD TEAM
       * ==================================================================== */}
      <TeamSection
        id="programmes"
        eyebrow="Branch 3 — Field Delivery"
        title="Programmes & Field Team"
        text="Delivering grassroots programmes directly into communities—from education centres and health camps to emergency animal rescue."
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {programmeTeam.map((member) => (
            <TeamMemberCard key={member.id} member={member} variant="compact" />
          ))}
        </div>
      </TeamSection>

      {/* ====================================================================
       * 8. TRANSPARENCY & VERIFICATION BANNER
       * ==================================================================== */}
      <section className="section bg-gradient-to-br from-[#072427] via-[#0B3B3E] to-[#0A3338] text-white">
        <div className="container-page">
          <div className="grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-300">
                <ShieldCheck className="h-4 w-4" />
                Ethical Governance & Accountability
              </div>
              <h2 className="mt-4 text-3xl font-display text-white sm:text-4xl">
                Committed to 100% public accountability.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-white/80 leading-relaxed max-w-2xl">
                Every programme milestone, financial statement, and registration certificate is held to statutory standards.
                Our team members, volunteers, and trustees adhere to rigorous safeguarding and code-of-conduct guidelines.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs font-medium text-white/70">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Registered Society
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Independent Financial Audits
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Child & Vulnerable Adult Safeguarding
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 sm:flex-row lg:flex-col lg:items-end">
              <ButtonLink to="/transparency" variant="light" size="lg" className="w-full sm:w-auto text-center">
                Visit Transparency Centre
              </ButtonLink>
              <ButtonLink to="/verify" variant="secondary" size="lg" className="w-full sm:w-auto text-center border-white/20 text-white hover:bg-white/10">
                Verify Volunteer / Staff ID
              </ButtonLink>
              <ButtonLink to="/contact" variant="ghost" size="md" className="w-full sm:w-auto text-center text-white/90 hover:text-white">
                Contact Governance Office →
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
