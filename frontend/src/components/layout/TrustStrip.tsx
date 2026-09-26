import { ShieldCheck, Award, FileCheck, Lock } from 'lucide-react';
import { brand } from '@/config/brand';

export function TrustStrip() {
  const trustPoints = [
    {
      icon: Award,
      badge: '50% Tax Benefit',
      title: '80G & 12A Certified',
      desc: 'Eligible for 50% tax deduction under Indian IT Act. Instant certificate issued.',
    },
    {
      icon: ShieldCheck,
      badge: 'Govt. Registered',
      title: 'NITI Aayog Darpan',
      desc: brand.legal.darpan,
    },
    {
      icon: FileCheck,
      badge: 'Audited Accounts',
      title: '100% Transparency',
      desc: 'Clear financial allocation, audited balance sheets & geo-verified field reports.',
    },
    {
      icon: Lock,
      badge: 'Bank Grade',
      title: 'Secure Payment Gateway',
      desc: '256-bit encrypted checkout via UPI, Google Pay, PhonePe, Cards & Net Banking.',
    },
  ];

  return (
    <section className="relative z-10 -mt-6 sm:-mt-10 mb-8 sm:mb-12">
      <div className="container-page">
        <div className="rounded-2xl sm:rounded-3xl border border-line/80 bg-white/95 p-4 sm:p-6 lg:p-8 shadow-soft backdrop-blur-md">
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
        </div>
      </div>
    </section>
  );
}
