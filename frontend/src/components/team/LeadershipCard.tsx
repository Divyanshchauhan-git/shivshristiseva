import { Mail, Linkedin, ShieldCheck, Award } from 'lucide-react';
import type { TeamMember } from '@/data/team';
import { NeutralAvatar } from './NeutralAvatar';

interface LeadershipCardProps {
  member: TeamMember;
  className?: string;
}

/**
 * LeadershipCard: Prominent, elevated card specifically tailored for
 * the Chairperson / Senior Governance Head.
 */
export function LeadershipCard({ member, className }: LeadershipCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-surface via-surface to-amber-50/20 p-6 sm:p-8 md:p-10 shadow-lift transition-all duration-300 hover:border-amber-500/60 hover:shadow-2xl ${className ?? ''}`}
    >
      {/* Decorative background aura */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/5 blur-3xl transition-opacity group-hover:opacity-100"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-6 sm:gap-8 lg:gap-10">
        {/* Prominent Photo / Avatar */}
        <div className="shrink-0 flex flex-col items-center">
          {member.image ? (
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl ring-4 ring-amber-400/50 shadow-glow w-48 sm:w-56 aspect-[3/4] bg-surface-2 transition-transform duration-300 group-hover:scale-[1.01]">
              <img
                src={member.image}
                alt={member.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ) : (
            <NeutralAvatar
              src={member.image}
              name={member.name}
              size="xl"
              shape="rounded"
              isSenior
              className="ring-4 ring-amber-400/50 shadow-glow"
            />
          )}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-50/90 px-3.5 py-1 text-xs font-bold text-amber-900 shadow-sm">
            <Award className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
            Senior Leadership
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-text">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              Governing Body Head
            </span>
            {member.credentials && (
              <span className="text-xs font-medium text-muted bg-surface-2 px-2.5 py-1 rounded-md border border-line">
                {member.credentials}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-2xl sm:text-3xl font-display font-medium text-fg tracking-tight">
            {member.name}
          </h3>

          <p className="mt-1 text-base sm:text-lg font-semibold text-brand-text">
            {member.role}
          </p>

          <p className="mt-4 text-base text-muted leading-relaxed max-w-2xl">
            {member.bio}
          </p>

          {/* Social / Contact Links */}
          {member.socials && (
            <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3 border-t border-line/60 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Official Contact:
              </span>
              {member.socials.linkedin && (
                <a
                  href={member.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-brand-text"
                  aria-label={`${member.name} LinkedIn Profile`}
                >
                  <Linkedin className="h-3.5 w-3.5 text-[#0077b5]" />
                  <span>LinkedIn Profile</span>
                </a>
              )}
              {member.socials.email && (
                <a
                  href={member.socials.email}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-fg transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-brand-text"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail className="h-3.5 w-3.5 text-muted" />
                  <span>Executive Office Email</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
