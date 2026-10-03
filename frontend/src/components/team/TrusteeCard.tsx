import { Mail, Linkedin } from 'lucide-react';
import type { TeamMember } from '@/data/team';
import { NeutralAvatar } from './NeutralAvatar';

interface TrusteeCardProps {
  member: TeamMember;
  className?: string;
}

/**
 * TrusteeCard: Equal-sized, reusable profile card for Board of Trustees members.
 */
export function TrusteeCard({ member, className }: TrusteeCardProps) {
  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-text/40 hover:shadow-lift ${className ?? ''}`}
    >
      <div>
        {/* Photo / Avatar */}
        <div className="mb-4">
          <NeutralAvatar
            src={member.image}
            name={member.name}
            size="lg"
            shape="circle"
            className="ring-2 ring-line/80 group-hover:ring-brand-text/40 transition-colors"
          />
        </div>

        {/* Name & Role */}
        <div className="text-center">
          <h4 className="text-lg font-display font-medium text-fg">
            {member.name}
          </h4>
          <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-brand-text">
            {member.role}
          </p>
          {member.credentials && (
            <p className="mt-1 text-[0.75rem] font-medium text-muted">
              {member.credentials}
            </p>
          )}
        </div>

        {/* Bio */}
        <p className="mt-3 text-center text-sm text-muted leading-relaxed">
          {member.bio}
        </p>
      </div>

      {/* Social / Contact */}
      {member.socials && (member.socials.linkedin || member.socials.email) && (
        <div className="mt-5 flex items-center justify-center gap-2 border-t border-line/60 pt-3">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-[#0077b5]"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.socials.email && (
            <a
              href={member.socials.email}
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-brand-text"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="h-4 w-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
