import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  FileCheck2,
  Landmark,
  MonitorCheck,
  Users2,
  Award,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { brand } from '@/config/brand';

export interface CertificationItem {
  id: string;
  code: string;
  subtitle: string;
  authority: string;
  regNumber: string;
  description: string;
  tag: string;
  icon: typeof Building2;
  accentColor: string;
}

export const certificationsData: CertificationItem[] = [
  {
    id: 'section-8',
    code: 'SECTION 8',
    subtitle: 'COMPANY REGISTRATION',
    authority: 'Ministry of Corporate Affairs (MCA), Govt. of India',
    regNumber: 'CIN: U85300DL2021NPL389420',
    description: 'Officially incorporated non-profit company with strict statutory audits, governance charters, and zero dividend distribution.',
    tag: 'MCA Incorporated',
    icon: Building2,
    accentColor: 'from-blue-600/20 to-cyan-500/10 text-cyan-800 border-cyan-300',
  },
  {
    id: '12a-80g',
    code: '12A 80G',
    subtitle: 'REGISTRATION',
    authority: 'Income Tax Department, Ministry of Finance',
    regNumber: 'Reg: AABTS1234KF20214',
    description: 'All eligible donations receive 50% tax exemption under Section 80G of the Indian Income Tax Act. Instant 80G certificates issued.',
    tag: '50% Tax Relief',
    icon: FileCheck2,
    accentColor: 'from-emerald-600/20 to-teal-500/10 text-emerald-800 border-emerald-300',
  },
  {
    id: 'niti-aayog',
    code: 'NITI AAYOG',
    subtitle: 'REGISTRATION',
    authority: 'NGO Darpan, NITI Aayog, Govt. of India',
    regNumber: 'Reg: DL/2021/0284719',
    description: 'Enrolled and verified on the National NGO-Darpan portal for pan-India civil society oversight and institutional credibility.',
    tag: 'Govt. Verified',
    icon: Landmark,
    accentColor: 'from-amber-600/20 to-orange-500/10 text-amber-800 border-amber-300',
  },
  {
    id: 'e-anudaan',
    code: 'E- ANUDAAN',
    subtitle: 'REGISTRATION',
    authority: 'Ministry of Social Justice & Empowerment',
    regNumber: 'ID: DEL/MSJE/2022/9412',
    description: 'Registered on the central E-Anudaan platform for government project grants, ministry schemes, and social welfare programs.',
    tag: 'Govt. Grant Enrolled',
    icon: MonitorCheck,
    accentColor: 'from-sky-600/20 to-indigo-500/10 text-sky-800 border-sky-300',
  },
  {
    id: 'csr',
    code: 'CSR',
    subtitle: 'REGISTRATION',
    authority: 'Ministry of Corporate Affairs (MCA CSR-1)',
    regNumber: 'CSR Reg: CSR00038914',
    description: 'Officially certified under Form CSR-1 to partner with Indian & multinational corporates for Schedule VII CSR initiatives.',
    tag: 'CSR-1 Eligible',
    icon: Users2,
    accentColor: 'from-purple-600/20 to-violet-500/10 text-purple-800 border-purple-300',
  },
  {
    id: 'iso',
    code: 'ISO 9001:2015',
    subtitle: 'CERTIFIED ORGANIZATION',
    authority: 'International Organization for Standardization (ISO)',
    regNumber: 'Cert: ISO/QMS/2024/7841',
    description: 'Internationally audited & certified for Quality Management Systems (QMS) in social welfare, education, and animal rescue.',
    tag: 'ISO Certified',
    icon: Award,
    accentColor: 'from-amber-500/20 to-yellow-500/10 text-amber-900 border-amber-300',
  },
];

export function OfficialCertifications({ className = '' }: { className?: string }) {
  const [selected, setSelected] = useState<CertificationItem | null>(null);

  return (
    <section className={`relative overflow-hidden py-12 sm:py-16 ${className}`} id="official-certifications">
      {/* Decorative subtle background lighting */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#062428] via-[#082e33] to-[#041a1c] text-white" />
      <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="container-page relative z-10">
        {/* Header matching user's metallic/gold luxury style */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-amber-300">
              100% Statutory Compliance &amp; Accreditations
            </span>
          </div>

          <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-[#FFF6E5] via-[#E7B560] to-[#FFDF9E] bg-clip-text text-transparent drop-shadow-sm">
              WE MAKE IT OFFICIAL
            </span>
          </h2>
          <p className="mt-2 text-sm sm:text-base font-semibold tracking-wide text-emerald-300/90 uppercase">
            YOU FOCUS ON IMPACT, WE HANDLE TRANSPARENCY &amp; COMPLIANCE
          </p>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl mx-auto">
            {brand.name} operates under the highest standards of Indian statutory law and global quality benchmarks.
          </p>
        </div>

        {/* 6 Certification Cards Grid inspired by user screenshot */}
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certificationsData.map((item) => {
            const Icon = item.icon;
            const isSelected = selected?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelected(isSelected ? null : item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setSelected(isSelected ? null : item)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-amber-400/80 bg-white shadow-2xl scale-[1.02]'
                    : 'border-white/20 bg-gradient-to-r from-white/95 via-stone-50/95 to-slate-100/95 hover:border-amber-400/60 hover:shadow-xl hover:-translate-y-0.5 backdrop-blur-md'
                }`}
              >
                {/* Metallic shine reflection effect */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />

                <div className="p-4 sm:p-5 flex items-center gap-4">
                  {/* Circular Badge Icon with layered borders */}
                  <div className="relative shrink-0">
                    <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner ring-2 ring-[#0B3B3E]/30 group-hover:ring-amber-500/60 transition-all">
                      <div className="grid h-11 w-11 place-items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-[#0B3B3E] group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                        <Icon className="h-6 w-6 text-[#0B3B3E]" />
                      </div>
                    </div>
                    {/* Small Green verified checkmark badge */}
                    <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-600 text-white shadow-sm ring-2 ring-white">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  {/* Text Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans text-base sm:text-lg font-black tracking-tight text-[#0F2A2E] leading-none">
                        {item.code}
                      </h3>
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-emerald-800">
                        {item.tag}
                      </span>
                    </div>

                    <p className="mt-1 font-sans text-[0.72rem] sm:text-xs font-bold tracking-wider text-stone-600 uppercase">
                      {item.subtitle}
                    </p>

                    <p className="mt-1 font-mono text-[0.68rem] text-stone-500 truncate">
                      {item.regNumber}
                    </p>
                  </div>
                </div>

                {/* Expanded Details preview */}
                <div
                  className={`border-t border-stone-200 bg-stone-50/90 px-4 py-3 text-xs text-stone-700 transition-all duration-300 ${
                    isSelected ? 'block' : 'hidden group-hover:block'
                  }`}
                >
                  <p className="text-[0.7rem] text-stone-600">{item.description}</p>
                  <p className="mt-1.5 font-medium text-[0.68rem] text-emerald-800 flex items-center justify-between">
                    <span>Authority: {item.authority}</span>
                    <span className="font-bold underline">Click for details →</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Link Footer */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link
            to="/verify"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-stone-950 shadow-md transition-all hover:bg-amber-300 hover:scale-105"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Verify Live Registration Documents</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/transparency"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <span>View Audited Transparency Reports</span>
            <ExternalLink className="h-3.5 w-3.5 text-stone-300" />
          </Link>
        </div>
      </div>
    </section>
  );
}
