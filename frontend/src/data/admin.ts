/* DEMO records for the admin dashboard. Names are fictional; no real donor data. */
import { campaigns } from './campaigns';
import type { PaymentMethod, PaymentStatus } from '@/types';

export type Role = 'super_admin' | 'admin' | 'finance' | 'content_manager' | 'volunteer_coordinator';

export interface AdminUser { id: string; name: string; email: string; role: Role; active: boolean; lastLogin: string; mfa: boolean }
export interface DonationRow {
  id: string; reference: string; donor: string; email: string; amount: number; campaign: string; cause: string;
  method: PaymentMethod; status: PaymentStatus; date: string; receipt: 'issued' | 'pending' | 'not applicable'; frequency: 'one-time' | 'monthly';
}
export type VolunteerStatus = 'New' | 'Reviewed' | 'Shortlisted' | 'Approved' | 'Rejected' | 'Completed';
export interface VolunteerRow {
  id: string; name: string; email: string; phone: string; city: string; skills: string; programme: string;
  availability: string; status: VolunteerStatus; role?: string; notes?: string; appliedOn: string;
}
export type CsrStatus = 'New' | 'Contacted' | 'Proposal' | 'Discussion' | 'Active' | 'Closed';
export interface PartnershipRow { id: string; company: string; contactPerson: string; email: string; phone: string; interest: string; budget: string; status: CsrStatus; notes?: string; receivedOn: string }
export interface MessageRow { id: string; name: string; email: string; subject: string; message: string; receivedOn: string; status: 'New' | 'Replied' | 'Closed' }
export interface AuditRow { id: string; at: string; actor: string; action: string; entity: string }

const first = ['Aarav', 'Priya', 'Rohan', 'Ananya', 'Kabir', 'Meera', 'Vikram', 'Sneha', 'Arjun', 'Isha', 'Farhan', 'Lakshmi', 'Dev', 'Nisha', 'Karan', 'Pooja', 'Samuel', 'Zoya', 'Rahul', 'Divya'];
const last = ['Sharma', 'Iyer', 'Khan', 'Reddy', 'Das', 'Menon', 'Singh', 'Patel', 'Joseph', 'Nair', 'Gupta', 'Bose'];
const methods: PaymentMethod[] = ['upi', 'upi', 'upi', 'card', 'netbanking', 'card', 'wallet'];
const statuses: PaymentStatus[] = ['success', 'success', 'success', 'success', 'success', 'pending', 'failed', 'success', 'cancelled', 'success', 'refunded'];
const amounts = [500, 1000, 2500, 1000, 5000, 500, 2000, 10000, 1500, 750, 25000];

export const demoDonations: DonationRow[] = Array.from({ length: 64 }, (_, i) => {
  const c = campaigns[i % campaigns.length];
  const d = new Date(Date.UTC(2026, 8, 25) - i * 86400000 * 1.7);
  const status = statuses[i % statuses.length];
  const name = `${first[i % first.length]} ${last[(i * 5) % last.length]}`;
  return {
    id: `don_${(1000 + i).toString(36)}${i}`,
    reference: `SSS-${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(4210 - i).padStart(5, '0')}`,
    donor: i % 9 === 4 ? 'Anonymous' : name,
    email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
    amount: amounts[(i * 3) % amounts.length],
    campaign: i % 5 === 0 ? '—' : c.title,
    cause: i % 5 === 0 ? 'General Fund' : c.category,
    method: methods[i % methods.length],
    status,
    date: d.toISOString(),
    receipt: status === 'success' ? (i % 6 === 0 ? 'pending' : 'issued') : 'not applicable',
    frequency: i % 4 === 1 ? 'monthly' : 'one-time',
  };
});

const vStatuses: VolunteerStatus[] = ['New', 'New', 'Reviewed', 'Shortlisted', 'Approved', 'Rejected', 'Completed', 'New', 'Approved', 'Reviewed', 'Shortlisted', 'New'];
const progNames = ['Education', 'Animal Welfare', 'Healthcare', 'Environment & Community', 'Women Empowerment', 'Food & Essentials', 'Emergency Relief', 'Elderly Care'];
const skills = ['Teaching, Maths', 'Photography, Social media', 'Nursing', 'Driving, Logistics', 'Graphic design', 'Veterinary assistant', 'Event management', 'Accounting', 'Counselling', 'Coding', 'Tailoring', 'First aid'];
export const demoVolunteers: VolunteerRow[] = vStatuses.map((status, i) => {
  const name = `${first[(i * 3 + 1) % first.length]} ${last[(i * 7 + 2) % last.length]}`;
  return {
    id: `vol_${i + 1}`, name, email: `${name.toLowerCase().replace(' ', '.')}@example.com`, phone: '+91 9XXXX XXXXX',
    city: ['Chennai', 'Vellore', 'Bengaluru', 'Pune', 'Delhi', 'Kolkata'][i % 6], skills: skills[i], programme: progNames[i % progNames.length],
    availability: ['Weekends', 'Weekday evenings', 'Flexible', '2–4 hrs/week'][i % 4], status,
    role: status === 'Approved' ? ['Tutor', 'Feeding route volunteer', 'Camp coordinator'][i % 3] : undefined,
    appliedOn: new Date(Date.UTC(2026, 8, 24) - i * 86400000 * 2.3).toISOString(),
  };
});

export const demoPartnerships: PartnershipRow[] = [
  { id: 'csr1', company: 'Example Technologies Pvt Ltd', contactPerson: 'R. Kumar', email: 'csr@example-tech.test', phone: '+91 9XXXX XXXXX', interest: 'Education', budget: '₹10–25 lakh', status: 'Proposal', receivedOn: '2026-09-20T09:12:00Z' },
  { id: 'csr2', company: 'Sample Foods Ltd', contactPerson: 'A. Fernandes', email: 'sustainability@samplefoods.test', phone: '+91 9XXXX XXXXX', interest: 'Food & Essentials', budget: '₹5–10 lakh', status: 'Discussion', receivedOn: '2026-09-11T11:40:00Z' },
  { id: 'csr3', company: 'Demo Logistics', contactPerson: 'S. Rao', email: 'people@demologistics.test', phone: '+91 9XXXX XXXXX', interest: 'Employee volunteering', budget: 'Under ₹5 lakh', status: 'New', receivedOn: '2026-09-24T06:05:00Z' },
  { id: 'csr4', company: 'Placeholder Bank', contactPerson: 'N. Shah', email: 'csr@placeholderbank.test', phone: '+91 9XXXX XXXXX', interest: 'Women Empowerment', budget: '₹25 lakh+', status: 'Contacted', receivedOn: '2026-09-02T10:00:00Z' },
  { id: 'csr5', company: 'Test Pharma', contactPerson: 'M. Thomas', email: 'csr@testpharma.test', phone: '+91 9XXXX XXXXX', interest: 'Healthcare', budget: '₹10–25 lakh', status: 'Active', receivedOn: '2026-06-15T10:00:00Z' },
  { id: 'csr6', company: 'Mock Retail Co', contactPerson: 'P. Verma', email: 'hello@mockretail.test', phone: '+91 9XXXX XXXXX', interest: 'Animal Welfare', budget: 'Under ₹5 lakh', status: 'Closed', receivedOn: '2026-04-10T10:00:00Z' },
];

export const demoMessages: MessageRow[] = [
  { id: 'm1', name: 'Kavya R', email: 'kavya@example.com', subject: 'Receipt for my donation', message: 'I donated last week but have not received my receipt. My reference is SSS-202609-04198.', receivedOn: '2026-09-25T08:00:00Z', status: 'New' },
  { id: 'm2', name: 'John P', email: 'john@example.com', subject: 'School partnership', message: 'Our school would like to organise a donation drive for education kits.', receivedOn: '2026-09-23T12:30:00Z', status: 'New' },
  { id: 'm3', name: 'Asha M', email: 'asha@example.com', subject: 'Injured dog near my building', message: 'There is an injured dog near the bus stop. Can your team help?', receivedOn: '2026-09-21T17:45:00Z', status: 'Replied' },
  { id: 'm4', name: 'Imran S', email: 'imran@example.com', subject: 'Monthly donation cancellation', message: 'Please help me cancel my monthly donation.', receivedOn: '2026-09-18T09:20:00Z', status: 'Closed' },
  { id: 'm5', name: 'Latha V', email: 'latha@example.com', subject: 'Volunteering for weekends', message: 'I can volunteer on weekends for the elderly care programme.', receivedOn: '2026-09-16T14:10:00Z', status: 'Replied' },
];

export const demoUsers: AdminUser[] = [
  { id: 'u1', name: 'Super Admin (demo)', email: 'super@shivshristi.demo', role: 'super_admin', active: true, lastLogin: '2026-09-26T05:12:00Z', mfa: true },
  { id: 'u2', name: 'Admin (demo)', email: 'admin@shivshristi.demo', role: 'admin', active: true, lastLogin: '2026-09-25T10:00:00Z', mfa: true },
  { id: 'u3', name: 'Finance (demo)', email: 'finance@shivshristi.demo', role: 'finance', active: true, lastLogin: '2026-09-24T07:30:00Z', mfa: true },
  { id: 'u4', name: 'Content Manager (demo)', email: 'content@shivshristi.demo', role: 'content_manager', active: true, lastLogin: '2026-09-23T11:00:00Z', mfa: false },
  { id: 'u5', name: 'Volunteer Coordinator (demo)', email: 'volunteers@shivshristi.demo', role: 'volunteer_coordinator', active: true, lastLogin: '2026-09-22T09:40:00Z', mfa: false },
];

export const demoAudit: AuditRow[] = [
  { id: 'l1', at: '2026-09-26T05:20:00Z', actor: 'super@shivshristi.demo', action: 'Signed in', entity: 'Session' },
  { id: 'l2', at: '2026-09-25T15:02:00Z', actor: 'content@shivshristi.demo', action: 'Published story', entity: 'Back to class after two years away' },
  { id: 'l3', at: '2026-09-25T11:48:00Z', actor: 'finance@shivshristi.demo', action: 'Exported donations CSV', entity: 'Donations (Sep 2026)' },
  { id: 'l4', at: '2026-09-24T09:15:00Z', actor: 'volunteers@shivshristi.demo', action: 'Approved volunteer', entity: 'vol_5' },
  { id: 'l5', at: '2026-09-23T18:30:00Z', actor: 'admin@shivshristi.demo', action: 'Paused campaign', entity: 'Community Health Camps' },
  { id: 'l6', at: '2026-09-22T08:05:00Z', actor: 'system', action: 'Webhook verified: payment.captured', entity: 'SSS-202609-04207' },
];

export const DEMO_PASSWORD = 'demo1234';
