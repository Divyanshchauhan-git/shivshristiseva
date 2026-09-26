/**
 * Single source of truth for organisation branding and contact details.
 * Replace the placeholder values below with the NGO's verified information.
 * Everything in the UI reads from here, so a rename is a one-file change.
 */
export const brand = {
  name: 'Shivshristi Seva Sansthan',
  shortName: 'Shivshristi Seva',
  /** Devanagari rendering of the name, used as a small accent in the wordmark. */
  nativeName: 'शिवसृष्टि सेवा संस्थान',
  tagline: 'Empowering Lives. Protecting Animals. Strengthening Communities.',
  mission: 'Together, we empower underprivileged children, protect abandoned animals, and build resilient rural communities across India.',
  announcement: 'All donations are eligible for 50% Tax Exemption under Section 80G of the Income Tax Act.',
  /** Set to a campaign slug + message to turn the announcement bar into an emergency appeal. */
  emergency: null as null | { message: string; campaignSlug: string },
  siteUrl: (import.meta.env.VITE_SITE_URL as string | undefined) || 'https://www.shivshristiseva.org',
  contact: {
    phone: '+91 98765 43210',
    phoneNote: 'Mon–Sat, 9:00 am – 7:00 pm IST',
    whatsapp: '+91 98765 43210',
    email: 'contact@shivshristiseva.org',
    emailNote: 'For donations, volunteer & general enquiries',
    address: ['Shivshristi Seva Sansthan, Sector 4, Rohini', 'New Delhi, Delhi 110085', 'India'],
    hours: 'Mon–Sat, 9:00 am – 7:00 pm IST',
  },
  social: {
    instagram: 'https://instagram.com/shivshristiseva',
    facebook: 'https://facebook.com/shivshristiseva',
    x: 'https://x.com/shivshristiseva',
    youtube: 'https://youtube.com/@shivshristiseva',
    linkedin: 'https://linkedin.com/company/shivshristiseva',
  },
  legal: {
    registration: 'Reg. No. S/ND/8942/2019 under Societies Registration Act XXI of 1860',
    pan: 'AAATS8942K',
    taxExemption: '80G & 12A Certified (Unique Regn: AABTS1234KF20214)',
    darpan: 'NITI Aayog NGO Darpan Reg: DL/2021/0284719',
    csr1: 'MCA CSR-1 Registration No. CSR00038914',
    fcra: 'Eligible for Domestic & CSR Contributions',
  },
  /** When true, pages show a notice that figures and content are demo data. */
  demoMode: false,
} as const;

export type Brand = typeof brand;
