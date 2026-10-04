import { Building2, FileCheck2, Landmark, MonitorCheck, Users2, Award, CheckCircle2 } from 'lucide-react';
import { brand } from '@/config/brand';

export function TrustStrip() {
  // Ordered strictly serial-wise: Section 8 -> 12A 80G -> Niti Aayog -> E-Anudaan -> CSR -> ISO
  const trustPoints = [
    {
      step: '01',
      icon: Building2,
      badge: 'MCA Registered',
      title: 'SECTION 8',
      subtitle: 'Company Registration',
      desc: brand.legal.section8,
      accent: 'border-blue-500/30 text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-300',
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border-blue-300 dark:border-blue-700',
    },
    {
      step: '02',
      icon: FileCheck2,
      badge: '50% Tax Relief',
      title: '12A 80G',
      subtitle: 'Tax Exemption',
      desc: brand.legal.taxExemption,
      accent: 'border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700',
    },
    {
      step: '03',
      icon: Landmark,
      badge: 'Govt. Verified',
      title: 'NITI AAYOG',
      subtitle: 'NGO Darpan Registry',
      desc: brand.legal.darpan,
      accent: 'border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300',
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200 border-amber-300 dark:border-amber-700',
    },
    {
      step: '04',
      icon: MonitorCheck,
      badge: 'Ministry Portal',
      title: 'E- ANUDAAN',
      subtitle: 'Central Grant Portal',
      desc: brand.legal.eAnudaan,
      accent: 'border-cyan-500/30 text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-300',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/60 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700',
    },
    {
      step: '05',
      icon: Users2,
      badge: 'CSR-1 Eligible',
      title: 'CSR',
      subtitle: 'MCA CSR-1 Form',
      desc: brand.legal.csr1,
      accent: 'border-purple-500/30 text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-300',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200 border-purple-300 dark:border-purple-700',
    },
    {
      step: '06',
      icon: Award,
      badge: 'Quality Standard',
      title: 'ISO 9001:2015',
      subtitle: 'Certified Organization',
      desc: brand.legal.iso,
      accent: 'border-yellow-500/30 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/40 dark:text-yellow-300',
      badgeColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
    },
  ];

  const quickBadges = [
    { num: '1', label: 'Section 8 Company', sub: 'MCA Incorporated' },
    { num: '2', label: '12A & 80G Certified', sub: '50% Tax Relief' },
    { num: '3', label: 'NITI Aayog Darpan', sub: 'Govt. Verified' },
    { num: '4', label: 'E-Anudaan Portal', sub: 'Grant Enrolled' },
    { num: '5', label: 'MCA CSR-1 Form', sub: 'CSR Eligible' },
    { num: '6', label: 'ISO 9001:2015', sub: 'Certified Org' },
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="container-page">
        {/* Card uses bg-surface and high-contrast text so it is 100% readable in both light & dark mode */}
        <div className="rounded-2xl sm:rounded-3xl border border-line bg-surface p-4 sm:p-6 lg:p-7 shadow-lift backdrop-blur-md">
          {/* Main 6 Seals Grid in exact serial order */}
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-line/70">
            {trustPoints.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-4 xl:pl-4' : ''} flex flex-col justify-between`}
                >
                  <div>
                    {/* Seal Icon + Badge Pill */}
                    <div className="flex items-center gap-2.5">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${item.accent} shadow-sm`}>
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className={`inline-block rounded-full border px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <h4 className="font-sans text-sm font-extrabold tracking-tight text-fg leading-tight mt-0.5">
                          {item.title}
                        </h4>
                      </div>
                    </div>

                    <p className="mt-1.5 font-sans text-[0.68rem] font-bold uppercase tracking-wider text-muted">
                      {item.subtitle}
                    </p>
                  </div>

                  <p className="mt-2 text-[0.72rem] text-muted leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* All 6 Accreditations Pill Strip in Serial Order */}
          <div className="mt-6 pt-5 border-t border-line/70">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-sans font-bold uppercase tracking-wider text-[0.72rem] text-fg flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Statutory Registrations (Serial Order):</span>
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {quickBadges.map((badge) => (
                  <span
                    key={badge.label}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface-2 px-2.5 py-1 font-mono text-[0.68rem] font-semibold text-fg"
                  >
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-emerald-500/20 text-emerald-600 text-[0.6rem] font-bold">
                      {badge.num}
                    </span>
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
