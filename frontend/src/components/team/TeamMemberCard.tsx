import { Mail, Linkedin } from 'lucide-react';
import type { TeamMember } from '@/data/team';
import { NeutralAvatar } from './NeutralAvatar';

interface TeamMemberCardProps {
  member: TeamMember;
  variant?: 'standard' | 'advisor' | 'executive' | 'compact';
  className?: string;
}

export function TeamMemberCard({
  member,
  variant = 'standard',
  className,
}: TeamMemberCardProps) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-text/30 hover:shadow-lift ${className ?? ''}`}
    >
      <div>
        <div className="flex items-center gap-4">
          <NeutralAvatar
            src={member.image}
            name={member.name}
            size={isCompact ? 'sm' : 'md'}
            shape="circle"
            className="ring-2 ring-line/80 group-hover:ring-brand-text/40 transition-colors"
          />
          <div className="min-w-0 flex-1">
            <h4 className="truncate text-base font-display font-medium text-fg sm:text-lg">
              {member.name}
            </h4>
            <p className="truncate text-xs font-bold uppercase tracking-wider text-brand-text">
              {member.role}
            </p>
            {member.credentials && (
              <p className="mt-0.5 truncate text-[0.72rem] text-muted">
                {member.credentials}
              </p>
            )}
            {member.department && (
              <span className="mt-1 inline-block rounded bg-surface-2 px-1.5 py-0.5 text-[0.68rem] font-medium text-muted">
                {member.department}
              </span>
            )}
          </div>
        </div>

        <p className="mt-3.5 text-sm text-muted leading-relaxed">
          {member.bio}
        </p>
      </div>

      {member.socials && (member.socials.linkedin || member.socials.email) && (
        <div className="mt-4 flex items-center gap-2 border-t border-line/60 pt-3">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-7 w-7 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-[#0077b5]"
              aria-label={`${member.name} LinkedIn`}
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
          )}
          {member.socials.email && (
            <a
              href={member.socials.email}
              className="grid h-7 w-7 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand-text hover:bg-surface-2 hover:text-brand-text"
              aria-label={`Email ${member.name}`}
            >
              <Mail className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
