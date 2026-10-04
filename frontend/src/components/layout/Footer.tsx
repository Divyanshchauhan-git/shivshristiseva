import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter, Youtube } from 'lucide-react';
import { brand } from '@/config/brand';
import { footerNav } from '@/config/navigation';
import { Logo } from './Logo';

export const socialLinks = [
  { label: 'Instagram', href: brand.social.instagram, icon: Instagram },
  { label: 'Facebook', href: brand.social.facebook, icon: Facebook },
  { label: 'X (Twitter)', href: brand.social.x, icon: Twitter },
  { label: 'YouTube', href: brand.social.youtube, icon: Youtube },
  { label: 'LinkedIn', href: brand.social.linkedin, icon: Linkedin },
];

export function SocialRow({ light = true }: { light?: boolean }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {socialLinks.map(({ label, href, icon: I }) => (
        <li key={label}>
          <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${brand.shortName} on ${label} (opens in a new tab)`}
            className={light ? 'grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#EFA23A] hover:text-[#211a08]' : 'grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-fg hover:border-brand-text hover:text-brand-text'}>
            <I className="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-[#072427] text-white/80">
      <div className="garland opacity-80" aria-hidden="true" />
      
      {/* Trust & Accreditations Ribbon */}
      <div className="border-b border-white/10 bg-[#051c1e] py-6">
        <div className="container-page flex flex-col lg:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="rounded-full bg-blue-500/20 px-3 py-1 font-bold text-blue-300 ring-1 ring-blue-400/30">
              ✓ Section 8 Company
            </span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 font-bold text-emerald-300 ring-1 ring-emerald-400/30">
              ✓ 12A &amp; 80G Tax Exemption
            </span>
            <span className="rounded-full bg-amber-500/20 px-3 py-1 font-bold text-amber-300 ring-1 ring-amber-400/30">
              ✓ NITI Aayog NGO Darpan
            </span>
            <span className="rounded-full bg-cyan-500/20 px-3 py-1 font-bold text-cyan-300 ring-1 ring-cyan-400/30">
              ✓ E-Anudaan Registered
            </span>
            <span className="rounded-full bg-purple-500/20 px-3 py-1 font-bold text-purple-300 ring-1 ring-purple-400/30">
              ✓ MCA CSR-1 Form Approved
            </span>
            <span className="rounded-full bg-amber-400/20 px-3 py-1 font-bold text-amber-200 ring-1 ring-amber-300/40">
              ★ ISO 9001:2015 Certified
            </span>
          </div>
          <p className="text-white/60 text-center lg:text-right shrink-0">
            Accepting UPI, Google Pay, PhonePe, Cards &amp; Net Banking via 256-bit SSL
          </p>
        </div>
      </div>

      <div className="container-page grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo light />
          <p className="mt-5 text-sm leading-relaxed text-white/75">{brand.mission}</p>
          <ul className="mt-6 space-y-2.5 text-sm">
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" /><span className="select-all font-medium text-white">{brand.contact.phone}</span></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" /><span className="select-all font-medium text-white">{brand.contact.email}</span></li>
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" /><span>{brand.contact.address.join(', ')}</span></li>
          </ul>
          <div className="mt-6"><SocialRow /></div>
        </div>
        <div className="grid gap-10 sm:grid-cols-3">
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-amber-400">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map(([label, to]) => <li key={to}><Link to={to} className="text-white/80 hover:text-amber-300 hover:underline transition-colors">{label}</Link></li>)}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#05181a]">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {brand.name}. {brand.legal.registration}</p>
          <p>Donations eligible for 50% Tax Exemption under Sec 80G. We never store financial credentials.</p>
          <Link to="/admin" className="hover:text-white">Staff login</Link>
        </div>
      </div>
    </footer>
  );
}
