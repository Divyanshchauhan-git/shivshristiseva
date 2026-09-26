import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, ArrowRight, Sparkles, BookOpen, PawPrint,
  HeartPulse, Utensils, Users, Compass, Quote
} from 'lucide-react';
import { domainWorkDetails, type DomainDetails } from '@/data/domainWork';
import { inr, cn } from '@/utils/format';

interface DomainImpactShowcaseProps {
  initialDomain?: string;
  onSelectCause?: (causeId: string, amount?: number) => void;
  compact?: boolean;
  className?: string;
  showDonateButton?: boolean;
}

const domainTabs = [
  { id: 'Women', label: 'Women Empowerment', icon: Users, badge: 'High Impact', theme: 'women' },
  { id: 'Education', label: 'Child Education', icon: BookOpen, badge: 'Schools & Kits', theme: 'education' },
  { id: 'Animals', label: 'Animal Welfare', icon: PawPrint, badge: '24/7 Rescue', theme: 'animals' },
  { id: 'Healthcare', label: 'Healthcare & Camps', icon: HeartPulse, badge: 'Free Medicine', theme: 'health' },
  { id: 'Food', label: 'Food & Rations', icon: Utensils, badge: 'Staple Kits', theme: 'food' },
  { id: 'General Fund', label: 'General Fund', icon: Compass, badge: 'Where Needed', theme: 'community' },
];

export function DomainImpactShowcase({
  initialDomain = 'Women',
  onSelectCause,
  compact: _compact = false,
  className,
  showDonateButton = true,
}: DomainImpactShowcaseProps) {
  const [selectedId, setSelectedId] = useState<string>(
    domainWorkDetails[initialDomain] ? initialDomain : 'Women'
  );
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const domain: DomainDetails = domainWorkDetails[selectedId] || domainWorkDetails['Women'];

  const handleDomainChange = (id: string) => {
    setSelectedId(id);
    setSelectedTier(null);
  };

  const handleDonateClick = (amount?: number) => {
    if (onSelectCause) {
      onSelectCause(domain.id, amount);
    }
  };

  return (
    <section className={cn('relative rounded-3xl border border-line bg-surface p-6 shadow-lift transition-all sm:p-8 lg:p-10', className)}>
      {/* Header Accent */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-soft/70 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-text">
            <Sparkles className="h-3.5 w-3.5 text-marigold" />
            <span>Interactive Impact Explorer</span>
          </div>
          <h3 className="mt-3 font-display text-2xl tracking-tight text-fg sm:text-3xl lg:text-4xl">
            See What Your Donation Accomplishes
          </h3>
          <p className="mt-1 text-sm text-muted sm:text-base">
            Select a domain below to see the specific grassroots work Shivshristi Seva Sansthan conducts.
          </p>
        </div>
        <div className="hidden items-center gap-2 text-xs font-medium text-muted md:flex">
          <span className="flex h-2 w-2 rounded-full bg-ok animate-pulse" />
          <span>Verified ground programs · 100% Tax Exemption (80G)</span>
        </div>
      </div>

      {/* Domain Selection Tabs */}
      <div className="mt-6 flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Select donation domain to view work">
        {domainTabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = selectedId === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleDomainChange(tab.id)}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200 sm:px-4 sm:py-3',
                isSelected
                  ? 'border-brand bg-brand text-white shadow-md ring-2 ring-brand/20'
                  : 'border-line bg-surface-2/60 text-fg hover:border-brand/40 hover:bg-surface-2'
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-transform group-hover:scale-110',
                  isSelected ? 'text-marigold' : 'text-brand-text'
                )}
              />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    'hidden rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider sm:inline-block',
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-brand-soft/80 text-brand-text'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1.3fr] lg:gap-10">
        {/* Left Column: Visual Story & Impact Stats */}
        <div className="flex flex-col gap-6">
          {/* Main Visual Photo with Badging */}
          <div className="group relative overflow-hidden rounded-2xl border border-line/60 bg-muted/10 shadow-soft">
            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={domain.image}
                alt={domain.name}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {/* Gradient Overlay & Badge */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="inline-block rounded-full bg-marigold px-3 py-1 text-xs font-bold text-marigold-fg shadow-sm">
                {domain.shortTag}
              </span>
              <h4 className="mt-1 font-display text-xl font-normal leading-snug text-white sm:text-2xl">
                {domain.name}
              </h4>
              <p className="mt-1 line-clamp-2 text-xs text-white/90 sm:text-sm">
                {domain.tagline}
              </p>
            </div>
          </div>

          {/* Beneficiary Quote / Testimonial Box */}
          {domain.quote && (
            <div className="relative rounded-2xl border border-line bg-surface-2/40 p-5 shadow-sm">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-text/15" />
              <p className="text-sm italic leading-relaxed text-fg sm:text-[0.95rem]">
                "{domain.quote.text}"
              </p>
              <div className="mt-3 flex items-center gap-2 border-t border-line/50 pt-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {domain.quote.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-bold text-fg">{domain.quote.author}</p>
                  <p className="text-[0.7rem] text-muted">{domain.quote.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Metric Counters */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {domain.metrics.map((m, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-line bg-surface-2/30 p-3 text-center transition-colors hover:bg-surface-2/80"
              >
                <div className="font-display text-xl font-bold tracking-tight text-brand-text sm:text-2xl">
                  {m.value}
                </div>
                <div className="mt-0.5 text-[0.72rem] font-medium leading-tight text-muted">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Exact Grassroots Work Breakdown & Giving Ladder */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-marigold-fg">
                Grassroots Implementation
              </span>
              <span className="rounded-md bg-ok/10 px-2 py-0.5 text-[0.7rem] font-bold text-ok">
                Active in Field
              </span>
            </div>
            <h4 className="mt-1 text-xl font-semibold text-fg sm:text-2xl">
              What Shivshristi Seva Sansthan is doing for {domain.id === 'Women' ? 'Women' : domain.id}:
            </h4>
            <p className="mt-1.5 text-sm text-muted">
              {domain.summaryStory}
            </p>

            {/* Groundwork Pillars */}
            <div className="mt-4 space-y-3">
              {domain.pillars.map((pillar, i) => (
                <div
                  key={i}
                  className="group flex gap-3.5 rounded-xl border border-line/60 bg-surface-2/30 p-3.5 transition-all hover:border-brand/30 hover:bg-surface-2/70"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-bold text-brand-text group-hover:bg-brand group-hover:text-white transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-fg group-hover:text-brand-text transition-colors">
                      {pillar.title}
                    </h5>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted sm:text-[0.82rem]">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Giving Transparency Ladder ("What Your Donation Funds") */}
          <div className="rounded-2xl border-2 border-brand/20 bg-brand-soft/30 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-hibiscus fill-hibiscus" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-text">
                  Transparent Giving Ladder
                </span>
              </div>
              <span className="text-[0.72rem] text-muted">Click an amount to select</span>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {domain.givingTiers.map((tier) => {
                const isSelected = selectedTier === tier.amount;
                return (
                  <button
                    key={tier.amount}
                    type="button"
                    onClick={() => {
                      setSelectedTier(tier.amount);
                      if (onSelectCause) onSelectCause(domain.id, tier.amount);
                    }}
                    className={cn(
                      'flex flex-col rounded-xl border p-3 text-left transition-all',
                      isSelected
                        ? 'border-brand bg-white shadow-sm ring-2 ring-brand/30'
                        : 'border-line/70 bg-surface/80 hover:border-brand/40 hover:bg-white'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-fg">
                        {inr(tier.amount)}
                      </span>
                      <span className="text-[0.68rem] font-semibold text-brand-text">
                        {tier.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[0.75rem] leading-snug text-muted">
                      {tier.impact}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Direct Donate Button */}
            {showDonateButton && (
              <div className="mt-4 flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted">
                  80G tax receipt issued instantly with 50% tax deduction.
                </p>
                {onSelectCause ? (
                  <button
                    type="button"
                    onClick={() => handleDonateClick(selectedTier ?? 1000)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-text transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current text-marigold" />
                    <span>Donate for {domain.id}</span>
                  </button>
                ) : (
                  <Link
                    to={`/donate?cause=${encodeURIComponent(domain.id)}${selectedTier ? `&amount=${selectedTier}` : ''}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-brand-text transition-colors"
                  >
                    <Heart className="h-4 w-4 fill-current text-marigold" />
                    <span>Donate for {domain.id} ({selectedTier ? inr(selectedTier) : 'Any Amount'})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
