import { ShieldCheck, Award, FileCheck, Building2, CheckCircle2 } from 'lucide-react';
import { brand } from '@/config/brand';

export function TrustStrip() {
  const trustPoints = [
    {
      icon: Award,
      badge: '50% Tax Relief',
      title: '80G & 12A Certified',
      desc: brand.legal.taxExemption,
    },
    {
      icon: Building2,
      badge: 'MCA Registered',
      title: 'Section 8 Non-Profit',
      desc: brand.legal.section8,
    },
    {
      icon: Award,
      badge: 'Quality Standard',
      title: 'ISO 9001:2015 Certified',
      desc: brand.legal.iso,
    },
    {
      icon: ShieldCheck,
      badge: 'Govt. Enrolled',
      title: 'NITI Aayog & E-Anudaan',
      desc: `${brand.legal.darpan} | ${brand.legal.eAnudaan}`,
    },
  ];

  const quickBadges = [
    { label: 'Section 8 Company', sub: 'MCA Incorporated' },
    { label: '12A & 80G Certified', sub: '50% Tax Relief' },
    { label: 'NITI Aayog Darpan', sub: 'Govt. Verified' },
    { label: 'E-Anudaan Portal', sub: 'Grant Enrolled' },
    { label: 'MCA CSR-1 Form', sub: 'CSR Eligible' },
    { label: 'ISO 9001:2015', sub: 'Certified Org' },
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="container-page">
        <div className="rounded-2xl sm:rounded-3xl border border-line/80 bg-white/95 p-4 sm:p-6 lg:p-8 shadow-soft backdrop-blur-md">
          {/* Main 4 Grid */}
          <div className="grid gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-line/70">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''} flex flex-col justify-between`}>
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <span className="inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-800 ring-1 ring-emerald-500/20">
                        {item.badge}
                      </span>
                      <h4 className="font-sans text-sm font-bold text-fg leading-tight mt-0.5">{item.title}</h4>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* All 6 Accreditations Pill Strip */}
          <div className="mt-6 pt-5 border-t border-line/70">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-sans font-bold uppercase tracking-wider text-[0.72rem] text-brand flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Official Registrations &amp; Certifications:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {quickBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2/80 px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-fg"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <strong>{badge.label}</strong>
                    <span className="text-muted">({badge.sub})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
