import { programmes } from '@/data/programmes';

export interface NavItem { label: string; to: string; children?: { label: string; to: string; text?: string }[] }

export const mainNav: NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'About Us', to: '/about' },
  { label: 'Our Work', to: '/programmes', children: programmes.map((p) => ({ label: p.title, to: `/programmes/${p.slug}`, text: p.short })) },
  { label: 'Campaigns', to: '/campaigns' },
  { label: 'Impact', to: '/impact' },
  { label: 'Stories', to: '/stories' },
  {
    label: 'Get Involved', to: '/get-involved', children: [
      { label: 'Volunteer', to: '/volunteer', text: 'Give your time and skills' },
      { label: 'Fundraise', to: '/fundraise', text: 'Raise funds for a cause you care about' },
      { label: 'CSR / Corporate Partnerships', to: '/csr', text: 'Partner with us as a company' },
      { label: 'Campus / Community', to: '/get-involved/campus', text: 'Bring your college or community group' },
      { label: 'Internships / Careers', to: '/careers', text: 'Work or intern with our team' },
      { label: 'Events', to: '/events', text: 'Drives, camps and meetups' },
      { label: 'Verify ID & Certificates', to: '/verify', text: 'Online verification portal with QR code' },
    ],
  },
  { label: 'Verify', to: '/verify' },
  { label: 'Contact', to: '/contact' },
];

export const footerNav = [
  { title: 'Organisation', links: [['About Us', '/about'], ['Our Work', '/programmes'], ['Impact', '/impact'], ['Stories', '/stories'], ['Events', '/events'], ['Gallery', '/gallery']] },
  { title: 'Get Involved', links: [['Donate', '/donate'], ['Volunteer', '/volunteer'], ['Fundraise', '/fundraise'], ['CSR Partnerships', '/csr'], ['Careers', '/careers'], ['Campaigns', '/campaigns']] },
  { title: 'Trust & Verification', links: [['Verify ID & Certificate', '/verify'], ['Transparency', '/transparency'], ['FAQ', '/faq'], ['Contact', '/contact'], ['Privacy Policy', '/legal/privacy'], ['Terms', '/legal/terms'], ['Donation / Refund Policy', '/legal/donation-refund']] },
] as const;
