import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/utils/format';

interface OrgNodeProps {
  title: string;
  role: string;
  category?: string;
  variant?: 'gold' | 'brand' | 'accent' | 'default';
  className?: string;
  items?: string[];
  isAdvisory?: boolean;
}

function OrgNode({
  title,
  role,
  category,
  variant = 'default',
  className,
  items,
  isAdvisory = false,
}: OrgNodeProps) {
  const variantStyles = {
    gold: 'border-amber-500/60 bg-gradient-to-b from-amber-500/10 via-surface to-surface text-amber-950 shadow-glow ring-2 ring-amber-400/30',
    brand: 'border-brand/40 bg-gradient-to-b from-brand-soft/70 via-surface to-surface text-brand-text shadow-soft ring-1 ring-brand/20',
    accent: 'border-emerald-500/40 bg-gradient-to-b from-emerald-500/10 via-surface to-surface text-emerald-950 shadow-soft',
    default: 'border-line bg-surface text-fg shadow-soft hover:border-brand-text/30',
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift',
        variantStyles[variant],
        isAdvisory && 'border-dashed border-amber-600/50 bg-amber-50/40',
        className
      )}
    >
      {category && (
        <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-muted">
          {category}
        </span>
      )}
      <h4 className="font-display text-sm font-semibold tracking-tight sm:text-base">
        {title}
      </h4>
      <p className="mt-0.5 text-xs font-medium text-muted">
        {role}
      </p>

      {items && items.length > 0 && (
        <ul className="mt-2.5 w-full space-y-1 border-t border-line/60 pt-2 text-left">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-1.5 text-[0.72rem] text-muted group-hover:text-fg transition-colors"
            >
              <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * OrganizationChart: Modern, responsive organizational hierarchy diagram.
 * Renders horizontally on desktop with visual connecting lines,
 * and automatically transforms into a clean vertical hierarchy on mobile/tablets
 * to guarantee ZERO horizontal overflow.
 */
export function OrganizationChart() {
  return (
    <div className="w-full">
      {/* ====================================================================
       * DESKTOP HIERARCHY CHART (Hidden on mobile & small tablets)
       * ==================================================================== */}
      <div className="hidden lg:block w-full rounded-3xl border border-line bg-surface/70 p-8 shadow-soft backdrop-blur-sm">
        <div className="mx-auto max-w-5xl flex flex-col items-center">
          
          {/* Level 1: Chairperson */}
          <div className="relative flex flex-col items-center">
            <OrgNode
              title="Priyanka Chauhan"
              role="Chairperson & Senior Leadership"
              category="Tier 1 — Apex Leadership"
              variant="gold"
              className="w-64"
            />
            {/* Stem Line Down */}
            <div className="h-8 w-0.5 bg-gradient-to-b from-amber-500/60 to-brand" />
          </div>

          {/* Level 2: Board of Trustees */}
          <div className="relative flex flex-col items-center">
            <OrgNode
              title="Board of Directors / Trustees"
              role="Rajeev Kumar · Ravish Kumar · Kalidas Debsarma"
              category="Tier 2 — Governance"
              variant="brand"
              className="w-96"
            />
            {/* Stem Line Down */}
            <div className="h-8 w-0.5 bg-brand" />
          </div>

          {/* Level 3: Cross Bar & Sub-Tier (Advisory, Executive Director, Secretary) */}
          <div className="relative w-full max-w-4xl">
            {/* Horizontal Connector Bar */}
            <div className="absolute top-0 left-[16.66%] right-[16.66%] h-0.5 bg-brand/40" />

            <div className="grid grid-cols-3 gap-6 pt-6">
              {/* Branch 3A: Advisory Board */}
              <div className="relative flex flex-col items-center">
                {/* Vertical drop line (dashed for advisory/counsel) */}
                <div className="absolute -top-6 h-6 w-0.5 border-l-2 border-dashed border-amber-500" />
                <OrgNode
                  title="Advisory Board"
                  role="Strategic, Legal & Financial Counsel"
                  category="Independent Counsel"
                  isAdvisory
                  className="w-full"
                />
              </div>

              {/* Branch 3B: Executive Director / CEO */}
              <div className="relative flex flex-col items-center">
                {/* Vertical drop line */}
                <div className="absolute -top-6 h-6 w-0.5 bg-brand" />
                <OrgNode
                  title="Jitendar Kumar"
                  role="Executive Director & Chief Operations Officer"
                  category="Executive Lead"
                  variant="brand"
                  className="w-full"
                />
                {/* Connector down to departments */}
                <div className="h-10 w-0.5 bg-brand" />
              </div>

              {/* Branch 3C: Secretary */}
              <div className="relative flex flex-col items-center">
                {/* Vertical drop line */}
                <div className="absolute -top-6 h-6 w-0.5 bg-brand/40" />
                <OrgNode
                  title="Dharmender Kumar"
                  role="General Secretary (Governance & Records)"
                  category="Secretariat"
                  variant="default"
                  className="w-full"
                  items={[
                    'Vikash Kumar (Joint Secretary - Field Operations)',
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Level 4: Operational Branches (Admin, Communication, Programmes) */}
          <div className="relative w-full max-w-5xl mt-2">
            {/* Horizontal Connector Bar across the 3 branches */}
            <div className="absolute top-0 left-[16.66%] right-[16.66%] h-0.5 bg-brand/40" />

            <div className="grid grid-cols-3 gap-6 pt-6">
              {/* Branch 4A: Administration & Finance */}
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-6 h-6 w-0.5 bg-brand/40" />
                <OrgNode
                  title="Administration"
                  role="Operations & Secretariat"
                  category="Branch A"
                  className="w-full"
                  items={[
                    'Administrative Manager & Assistant',
                    'Finance & Accounts Support',
                    'Volunteer & Membership Liaison',
                  ]}
                />
              </div>

              {/* Branch 4B: Communication & Outreach */}
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-6 h-6 w-0.5 bg-brand/40" />
                <OrgNode
                  title="Communication & Outreach"
                  role="Advocacy, Media & Digital"
                  category="Branch B"
                  className="w-full"
                  items={[
                    'Dissemination & Public Relations',
                    'Publications & Verified Reports',
                    'Web & Social Media Engagement',
                  ]}
                />
              </div>

              {/* Branch 4C: Programmes & Projects */}
              <div className="relative flex flex-col items-center">
                <div className="absolute -top-6 h-6 w-0.5 bg-brand/40" />
                <OrgNode
                  title="Programmes & Projects"
                  role="Community Impact & Field Action"
                  category="Branch C"
                  className="w-full"
                  items={[
                    'Programme & Project Management',
                    'Training & Skill Mentorship',
                    'Consultants & Ground Field Staff',
                  ]}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ====================================================================
       * MOBILE / TABLET VERTICAL CASCADING FLOW (Auto-adaptive, No Overflow)
       * ==================================================================== */}
      <div className="lg:hidden space-y-4">
        {/* Tier 1 */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/60">
          <div className="absolute -left-2 top-3 h-3.5 w-3.5 rounded-full border-2 border-surface bg-amber-500" />
          <OrgNode
            title="Priyanka Chauhan"
            role="Chairperson & Senior Leadership"
            category="Tier 1 — Apex Leadership"
            variant="gold"
            className="w-full text-left items-start"
          />
        </div>

        {/* Tier 2 */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-brand">
          <div className="absolute -left-2 top-3 h-3.5 w-3.5 rounded-full border-2 border-surface bg-brand" />
          <OrgNode
            title="Board of Directors / Trustees"
            role="Rajeev Kumar · Ravish Kumar · Kalidas Debsarma"
            category="Tier 2 — Governance"
            variant="brand"
            className="w-full text-left items-start"
          />
        </div>

        {/* Advisory Body */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-dashed border-amber-500">
          <div className="absolute -left-2 top-3 h-3.5 w-3.5 rounded-full border-2 border-surface bg-amber-400" />
          <OrgNode
            title="Advisory Board"
            role="Strategic, Legal & Financial Counsel"
            category="Independent Advisory"
            isAdvisory
            className="w-full text-left items-start"
          />
        </div>

        {/* Tier 3: Executive Leadership */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-brand">
          <div className="absolute -left-2 top-3 h-3.5 w-3.5 rounded-full border-2 border-surface bg-brand" />
          <OrgNode
            title="Jitendar Kumar"
            role="Executive Director & Chief Operations Officer"
            category="Tier 3 — Executive Directorate"
            variant="brand"
            className="w-full text-left items-start"
          />
        </div>

        {/* Tier 4: Department Branches */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-line">
          <div className="absolute -left-2 top-3 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-600" />
          <div className="space-y-3">
            <OrgNode
              title="Administration & Finance"
              role="Finance, Membership & Office Logistics"
              category="Department Branch 1"
              className="w-full text-left items-start"
              items={[
                'Administrative Manager & Assistants',
                'Finance & Volunteer Coordination',
              ]}
            />
            <OrgNode
              title="Communication & Outreach"
              role="PR, Publications & Social Media"
              category="Department Branch 2"
              className="w-full text-left items-start"
              items={[
                'Public Relations & Content Publications',
                'Web, Media & Donor Communication',
              ]}
            />
            <OrgNode
              title="Programmes & Projects"
              role="Field Implementation & Community Delivery"
              category="Department Branch 3"
              className="w-full text-left items-start"
              items={[
                'Education, Healthcare & Animal Welfare Projects',
                'Training Assistants & Ground Volunteers',
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
