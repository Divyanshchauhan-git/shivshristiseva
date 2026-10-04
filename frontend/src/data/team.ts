export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation?: string;
  department?: string;
  level?: 'chairperson' | 'trustee' | 'advisor' | 'executive' | 'manager' | 'staff';
  bio: string;
  image?: string;
  credentials?: string;
  socials?: {
    linkedin?: string;
    email?: string;
    phone?: string;
  };
}

/* ==========================================================================
 * 1. GOVERNING BODY — CHAIRPERSON & BOARD OF TRUSTEES
 * Placeholders are used. Replace [Chairperson Name] and [Trustee Name]
 * with verified details and photos.
 * ========================================================================== */

export const chairperson: TeamMember = {
  id: 'chairperson',
  name: 'Priyanka Chauhan',
  role: 'Chairperson & Senior Trustee',
  designation: 'Chairperson, Board of Trustees',
  credentials: 'Chief Patron & Strategic Governance',
  level: 'chairperson',
  bio: 'Guides the overarching vision, strategic governance, ethical mission, and fiduciary oversight of Shivshristi Seva Sansthan, ensuring all community, education, and animal welfare programmes operate with deep compassion, integrity, and grassroots accountability.',
  image: '/images/priyanka_chauhan.png',
  socials: {
    linkedin: 'https://linkedin.com',
    email: 'mailto:chairperson@shivshristiseva.org',
  },
};

export const trustees: TeamMember[] = [
  {
    id: 'trustee-1',
    name: 'Rajeev Kumar',
    role: 'Director, Board of Trustees',
    designation: 'Member, Board of Directors',
    credentials: 'Strategic Development & Social Governance',
    level: 'trustee',
    bio: 'Serves on the Board of Directors, steering long-term institutional strategy, statutory compliance, and empowering underserved communities.',
    image: '/images/rajeev_kumar.png',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:rajeev.kumar@shivshristiseva.org',
    },
  },
  {
    id: 'trustee-2',
    name: 'Ravish Kumar',
    role: 'Director, Board of Trustees',
    designation: 'Member, Board of Directors',
    credentials: 'Community Welfare & Institutional Growth',
    level: 'trustee',
    bio: 'Guides social welfare initiatives, healthcare partnerships, animal care standards, and grassroots mobilization.',
    image: '/images/ravish_kumar.png',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:ravish.kumar@shivshristiseva.org',
    },
  },
  {
    id: 'trustee-3',
    name: 'Kalidas Debsarma',
    role: 'Director, Board of Trustees',
    designation: 'Member, Board of Directors',
    credentials: 'Community Outreach & Non-Profit Leadership',
    level: 'trustee',
    bio: 'Oversees community-led welfare initiatives, volunteer mobilization, and ensures equitable programme reach across regional clusters.',
    image: '/images/kalidas_debsarma.png',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:kalidas.debsarma@shivshristiseva.org',
    },
  },
  {
    id: 'trustee-4',
    name: '[Trustee Name]',
    role: 'Trustee',
    designation: 'Member, Board of Trustees',
    credentials: 'Legal Compliance & Institutional Governance',
    level: 'trustee',
    bio: 'Guarantees statutory compliance, NGO regulatory filings, institutional ethics, and transparent stakeholder documentation.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:trustee4@example.org',
    },
  },
  {
    id: 'trustee-5',
    name: '[Trustee Name]',
    role: 'Trustee',
    designation: 'Member, Board of Trustees',
    credentials: 'Rural Development & Sustainable Livelihoods',
    level: 'trustee',
    bio: 'Drives women’s self-help groups, vocational training, sustainable rural outreach, and emergency distribution logistics.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:trustee5@example.org',
    },
  },
];

/* ==========================================================================
 * 2. ADVISORY BODY — ADVISORY BOARD
 * Provides independent counsel to the Governing Body & Leadership.
 * ========================================================================== */

export const advisors: TeamMember[] = [
  {
    id: 'advisor-chief',
    name: '[Chief Advisor Name]',
    role: 'Chief Advisor',
    designation: 'Chair of the Advisory Board',
    credentials: 'Distinguished Public Service & Non-Profit Strategy',
    level: 'advisor',
    bio: 'Provides senior advisory counsel on long-term institutional roadmaps, government coordination, and ethical integrity.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'advisor-legal',
    name: '[Legal Advisor Name]',
    role: 'Legal Advisor',
    designation: 'Legal Counsel & Regulatory Oversight',
    credentials: 'High Court Advocate / Non-Profit Law Specialist',
    level: 'advisor',
    bio: 'Counsels the board on statutory adherence, society registration rules, contracts, safeguarding legalities, and donor agreements.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'advisor-finance',
    name: '[Financial Advisor Name]',
    role: 'Financial Advisor',
    designation: 'Financial Strategy & Audit Oversight',
    credentials: 'FCA / Chartered Accountant',
    level: 'advisor',
    bio: 'Offers strategic guidance on 80G/12A regulatory filings, audited annual accounts, CSR-1 grant tracking, and fiscal risk management.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'advisor-welfare',
    name: '[Social Welfare Advisor Name]',
    role: 'Social / Welfare Advisor',
    designation: 'Community Welfare & Vulnerable Groups',
    credentials: 'MSW / Senior Field Specialist',
    level: 'advisor',
    bio: 'Ensures community-first values in ground relief programmes, disaster rehabilitation, and inclusive beneficiary selection.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 'advisor-other',
    name: '[Senior Advisor Name]',
    role: 'Institutional Growth Advisor',
    designation: 'Partnerships & Capacity Building',
    credentials: 'CSR & Institutional Development Lead',
    level: 'advisor',
    bio: 'Advises on multi-stakeholder corporate partnerships, institutional scaling, volunteer training frameworks, and sustainable impact.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
    },
  },
];

/* ==========================================================================
 * 3. EXECUTIVE LEADERSHIP
 * Manages daily executive operations, programme execution, and compliance.
 * ========================================================================== */

export const executiveLeadership: TeamMember[] = [
  {
    id: 'exec-director',
    name: 'Jitendar Kumar',
    role: 'Executive Director',
    designation: 'Executive Director & Chief Operations Officer',
    credentials: 'Institutional Leadership & Operations',
    level: 'executive',
    bio: 'Leads day-to-day executive management, ground field centre operations, emergency welfare response, and organizational mission execution.',
    image: '/images/executive_director.png',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:jitendar.kumar@shivshristiseva.org',
    },
  },
  {
    id: 'exec-secretary',
    name: 'Dharmender Kumar',
    role: 'Secretary',
    designation: 'General Secretary',
    credentials: 'Institutional Governance & Public Administration',
    level: 'executive',
    bio: 'Oversees board documentation, institutional correspondence, statutory compliance filings, and administrative coordination across all Sansthan programmes.',
    image: '/images/dharmender_kumar.png',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:dharmender.kumar@shivshristiseva.org',
    },
  },
  {
    id: 'exec-treasurer',
    name: '[Treasurer Name]',
    role: 'Treasurer',
    designation: 'Chief Financial Officer / Treasurer',
    credentials: 'Finance & Accounts Specialist',
    level: 'executive',
    bio: 'Directs financial accounting, budget disbursements, bank reconciliations, transparent donor receipts, and statutory audits.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:treasurer@example.org',
    },
  },
  {
    id: 'exec-joint-secretary',
    name: '[Joint Secretary Name]',
    role: 'Joint Secretary',
    designation: 'Deputy Secretary & Field Liaison',
    credentials: 'Social Work & Operations Management',
    level: 'executive',
    bio: 'Assists the General Secretary in operational supervision, field centre liaison, and volunteer network engagement.',
    image: '',
    socials: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:jointsecretary@example.org',
    },
  },
];

/* ==========================================================================
 * 4. ADMINISTRATION & FINANCE BRANCH
 * ========================================================================== */

export const administrationTeam: TeamMember[] = [
  {
    id: 'admin-manager',
    name: '[Administrative Manager Name]',
    role: 'Administrative Manager',
    department: 'Administration & Finance',
    bio: 'Oversees office operations, logistics management, compliance recordkeeping, and operational procurement.',
    image: '',
    socials: { email: 'mailto:admin@example.org' },
  },
  {
    id: 'admin-assistant',
    name: '[Administrative Assistant Name]',
    role: 'Administrative Assistant',
    department: 'Administration & Finance',
    bio: 'Maintains daily documentation, scheduling, supply chains for centres, and internal coordination.',
    image: '',
  },
  {
    id: 'admin-finance-assistant',
    name: '[Finance Assistant Name]',
    role: 'Finance Assistant',
    department: 'Administration & Finance',
    bio: 'Manages ledger entries, vendor payment disbursements, expense auditing, and donation receipt generation.',
    image: '',
  },
  {
    id: 'admin-coordinator',
    name: '[Volunteer Coordinator Name]',
    role: 'Membership / Volunteer Coordinator',
    department: 'Administration & Finance',
    bio: 'Onboards and verifies volunteer applications, manages orientations, and coordinates membership records.',
    image: '',
    socials: { email: 'mailto:volunteers@example.org' },
  },
];

/* ==========================================================================
 * 5. COMMUNICATION & OUTREACH BRANCH
 * ========================================================================== */

export const communicationTeam: TeamMember[] = [
  {
    id: 'comm-manager',
    name: '[Communication Manager Name]',
    role: 'Communication & Dissemination Manager',
    department: 'Communication & Outreach',
    bio: 'Spearheads advocacy campaigns, verified impact reports, media relations, and brand integrity across all channels.',
    image: '',
    socials: { email: 'mailto:communications@example.org' },
  },
  {
    id: 'comm-pr-assistant',
    name: '[Public Relations Assistant Name]',
    role: 'Public Relations Assistant',
    department: 'Communication & Outreach',
    bio: 'Liaises with local media outlets, civic partners, and community leaders for public announcements.',
    image: '',
  },
  {
    id: 'comm-content-assistant',
    name: '[Publications & Content Assistant Name]',
    role: 'Publications / Content Assistant',
    department: 'Communication & Outreach',
    bio: 'Documents field case studies, drafts newsletters, annual report narratives, and educational material.',
    image: '',
  },
  {
    id: 'comm-social-assistant',
    name: '[Web & Social Media Assistant Name]',
    role: 'Web & Social Media Assistant',
    department: 'Communication & Outreach',
    bio: 'Curates verified digital updates, campaign highlights, website maintenance, and donor engagement channels.',
    image: '',
  },
];

/* ==========================================================================
 * 6. PROGRAMMES & PROJECTS BRANCH
 * ========================================================================== */

export const programmeTeam: TeamMember[] = [
  {
    id: 'prog-manager',
    name: '[Programme Manager Name]',
    role: 'Programme Manager',
    department: 'Programmes & Projects',
    bio: 'Supervises all active community verticals including education centres, healthcare camps, and animal care rescue lines.',
    image: '',
    socials: { email: 'mailto:programmes@example.org' },
  },
  {
    id: 'prog-project-assistants',
    name: '[Project Assistants Team]',
    role: 'Project Assistants',
    department: 'Programmes & Projects',
    bio: 'Coordinate on-site execution, baseline data collection, and resource delivery at community distribution points.',
    image: '',
  },
  {
    id: 'prog-training-assistants',
    name: '[Training Assistants Team]',
    role: 'Training Assistants',
    department: 'Programmes & Projects',
    bio: 'Facilitate vocational skills workshops, women’s livelihood modules, and youth mentorship sessions.',
    image: '',
  },
  {
    id: 'prog-programme-assistants',
    name: '[Programme Assistants Team]',
    role: 'Programme Assistants',
    department: 'Programmes & Projects',
    bio: 'Support day-to-day camp logistics, participant enrolments, and field health screening operations.',
    image: '',
  },
  {
    id: 'prog-field-staff',
    name: '[Consultants & Field Staff]',
    role: 'Consultants & Ground Field Staff',
    department: 'Programmes & Projects',
    bio: 'Dedicated ground workers, veterinary assistants, community mobilisers, and emergency response volunteers.',
    image: '',
  },
];
