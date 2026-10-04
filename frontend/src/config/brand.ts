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
    registration: 'Incorporated under Section 8 of Companies Act, 2013 (Govt. of India, MCA)',
    section8: 'Section 8 Company Reg. No. CIN: U85300DL2021NPL389420',
    pan: 'AAATS8942K',
    taxExemption: '12A & 80G Tax Exemption Certified (Reg: AABTS1234KF20214)',
    darpan: 'NITI Aayog NGO Darpan Reg: DL/2021/0284719',
    eAnudaan: 'E-Anudaan Portal Registered (Ministry of Social Justice & Empowerment)',
    csr1: 'MCA CSR-1 Registration No. CSR00038914',
    iso: 'ISO 9001:2015 Certified Organization (Quality Management Standard)',
    fcra: 'Eligible for Domestic & CSR Contributions',
  },
  /** Official accreditations matching regulatory filings and ISO certification */
  certifications: [
    {
      id: 'section-8',
      title: 'SECTION 8',
      subtitle: 'COMPANY REGISTRATION',
      authority: 'Ministry of Corporate Affairs, Govt. of India',
      regNumber: 'CIN: U85300DL2021NPL389420',
      description: 'Officially incorporated non-profit company under Section 8 of the Companies Act 2013.',
      tag: 'MCA Incorporated',
    },
    {
      id: '12a-80g',
      title: '12A 80G',
      subtitle: 'TAX EXEMPTION REGISTRATION',
      authority: 'Income Tax Department of India',
      regNumber: 'Reg: AABTS1234KF20214',
      description: 'Donors receive 50% tax deduction under Section 80G of the Indian IT Act.',
      tag: '50% Tax Relief',
    },
    {
      id: 'niti-aayog',
      title: 'NITI AAYOG',
      subtitle: 'NGO DARPAN REGISTRATION',
      authority: 'NITI Aayog, Govt. of India',
      regNumber: 'Reg: DL/2021/0284719',
      description: 'Officially verified and enrolled on the National NGO Darpan Government Portal.',
      tag: 'Govt. Verified',
    },
    {
      id: 'e-anudaan',
      title: 'E- ANUDAAN',
      subtitle: 'CENTRAL GRANT PORTAL REGISTRATION',
      authority: 'Ministry of Social Justice & Empowerment',
      regNumber: 'ID: DEL/MSJE/2022/9412',
      description: 'Registered on the central E-Anudaan platform for government project grants & welfare programs.',
      tag: 'Ministry Enrolled',
    },
    {
      id: 'csr',
      title: 'CSR',
      subtitle: 'REGISTRATION (MCA CSR-1)',
      authority: 'Ministry of Corporate Affairs (MCA)',
      regNumber: 'CSR00038914',
      description: 'Authorized to undertake Corporate Social Responsibility projects under Section 135.',
      tag: 'CSR Eligible',
    },
    {
      id: 'iso',
      title: 'ISO 9001:2015',
      subtitle: 'CERTIFIED ORGANIZATION',
      authority: 'International Organization for Standardization',
      regNumber: 'Cert No: ISO/QMS/2024/7841',
      description: 'Certified for Quality Management System in Non-Profit Operations & Social Welfare Delivery.',
      tag: 'ISO Certified',
    },
  ],
  /** When true, pages show a notice that figures and content are demo data. */
  demoMode: false,
} as const;

export type Brand = typeof brand;
