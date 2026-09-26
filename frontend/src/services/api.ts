/**
 * API service layer.
 *
 * When VITE_API_BASE_URL is set, every call goes to the FastAPI backend
 * (see backend/app/routers and docs/API.md for the contract).
 * When it is empty, calls resolve against built-in DEMO data so the UI can be
 * reviewed without a server. Nothing in mock mode is persisted or sent anywhere.
 */
import { programmes, programmeBySlug } from '@/data/programmes';
import { campaigns, campaignBySlug } from '@/data/campaigns';
import { albums, animals, documents, events, faqs, stories, updates } from '@/data/content';
import { impactRecords } from '@/data/impact';
import type {
  ApiResult, Campaign, ContactMessage, CreateOrderResponse, DocumentItem, DonationRequest, DonationStatusResponse,
  FAQ, GalleryAlbum, ImpactRecord, NGOEvent, PartnershipEnquiry, PaymentStatus, Programme, Story, VolunteerApplication, Animal,
} from '@/types';
import { safeSession } from '@/utils/storage';

const RAW = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '';
/** "/" means same origin (API behind the same domain at /api). Empty means demo data. */
const BASE = RAW.replace(/\/$/, '');
export const isMockApi = RAW.trim() === '';

export class ApiError extends Error {
  constructor(message: string, public status = 0, public fieldErrors?: Record<string, string>) { super(message); }
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(BASE + path, {
      ...init,
      credentials: 'include', // httpOnly session cookie for admin; harmless for public calls
      headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...(init.headers || {}) },
    });
  } catch {
    throw new ApiError('We could not reach the server. Check your connection and try again.');
  }
  if (!res.ok) {
    let body: { detail?: string | { msg: string; loc: string[] }[] } = {};
    try { body = await res.json(); } catch { /* non-JSON */ }
    const fieldErrors = Array.isArray(body.detail)
      ? Object.fromEntries(body.detail.map((d) => [String(d.loc[d.loc.length - 1]), d.msg])) : undefined;
    const msg = res.status === 429 ? 'Too many requests. Please wait a minute and try again.'
      : typeof body.detail === 'string' ? body.detail : 'Something went wrong. Please try again.';
    throw new ApiError(msg, res.status, fieldErrors);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms + Math.random() * 250));
const mock = async <T,>(value: T | undefined, ms?: number): Promise<T> => {
  await wait(ms);
  if (value === undefined) throw new ApiError('Not found', 404);
  return structuredClone(value);
};
const ref = (prefix: string) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

/* ------------------------------ Content ------------------------------ */
export const contentApi = {
  programmes: (): Promise<Programme[]> => (isMockApi ? mock(programmes) : http('/api/programmes')),
  programme: (slug: string): Promise<Programme> => (isMockApi ? mock(programmeBySlug(slug)) : http(`/api/programmes/${slug}`)),
  campaigns: (): Promise<Campaign[]> => (isMockApi ? mock(campaigns) : http('/api/campaigns')),
  campaign: (slug: string): Promise<Campaign> => (isMockApi ? mock(campaignBySlug(slug)) : http(`/api/campaigns/${slug}`)),
  stories: (): Promise<Story[]> => (isMockApi ? mock(stories) : http('/api/stories')),
  story: (slug: string): Promise<Story> => (isMockApi ? mock(stories.find((s) => s.slug === slug)) : http(`/api/stories/${slug}`)),
  events: (): Promise<NGOEvent[]> => (isMockApi ? mock(events) : http('/api/events')),
  event: (slug: string): Promise<NGOEvent> => (isMockApi ? mock(events.find((e) => e.slug === slug)) : http(`/api/events/${slug}`)),
  albums: (): Promise<GalleryAlbum[]> => (isMockApi ? mock(albums) : http('/api/gallery/albums')),
  animals: (): Promise<Animal[]> => (isMockApi ? mock(animals) : http('/api/animals/listings')),
  impact: (): Promise<ImpactRecord[]> => (isMockApi ? mock(impactRecords, 650) : http('/api/impact')),
  documents: (): Promise<DocumentItem[]> => (isMockApi ? mock(documents) : http('/api/documents')),
  faqs: (): Promise<FAQ[]> => (isMockApi ? mock(faqs, 200) : http('/api/faqs')),
  updates: () => (isMockApi ? mock(updates) : http<typeof updates>('/api/updates')),
};

/* ------------------------------ Forms ------------------------------ */
/** In demo mode, including the word "simulate-error" in any text field returns an error, to preview error states. */
const mockSubmit = async (payload: object, prefix: string): Promise<ApiResult> => {
  await wait(700);
  if (JSON.stringify(payload).includes('simulate-error')) throw new ApiError('Something went wrong. Please try again.', 500);
  return { ok: true, reference: ref(prefix) };
};

export const formsApi = {
  volunteer: (d: VolunteerApplication) => (isMockApi ? mockSubmit(d, 'VOL') : http<ApiResult>('/api/volunteers', { method: 'POST', body: JSON.stringify(d) })),
  partnership: (d: PartnershipEnquiry) => (isMockApi ? mockSubmit(d, 'CSR') : http<ApiResult>('/api/partnerships', { method: 'POST', body: JSON.stringify(d) })),
  contact: (d: ContactMessage) => (isMockApi ? mockSubmit(d, 'MSG') : http<ApiResult>('/api/contact', { method: 'POST', body: JSON.stringify(d) })),
  newsletter: (email: string) => (isMockApi ? mockSubmit({ email }, 'SUB') : http<ApiResult>('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })),
  animalInterest: (d: { animalId: string; type: 'adopt' | 'foster'; name: string; email: string; phone: string; city: string; home: string; message?: string }) =>
    isMockApi ? mockSubmit(d, 'ADP') : http<ApiResult>('/api/animals/interest', { method: 'POST', body: JSON.stringify(d) }),
  eventRegistration: (d: { eventId: string; name: string; email: string; phone: string; asVolunteer: boolean }) =>
    isMockApi ? mockSubmit(d, 'EVT') : http<ApiResult>(`/api/events/${d.eventId}/register`, { method: 'POST', body: JSON.stringify(d) }),
  fundraiserInterest: (d: { name: string; email: string; phone: string; cause: string; goal: string; message?: string }) =>
    isMockApi ? mockSubmit(d, 'FUN') : http<ApiResult>('/api/fundraisers/interest', { method: 'POST', body: JSON.stringify(d) }),
};

/* ------------------------------ Donations ------------------------------
 * Flow (real): create-order → open gateway checkout with order id + PUBLIC key →
 * gateway calls back → POST /verify (server checks signature) → webhook is the
 * source of truth → poll GET /status. Card data never touches our servers. */
const DONATIONS_KEY = 'usf.demo.donations';
const readDemo = (): Record<string, DonationStatusResponse> => {
  try { return JSON.parse(safeSession.get(DONATIONS_KEY) || '{}'); } catch { return {}; }
};
const memoryDonations: Record<string, DonationStatusResponse> = readDemo();
const saveDemo = () => safeSession.set(DONATIONS_KEY, JSON.stringify(memoryDonations));

export const donationApi = {
  async createOrder(req: DonationRequest): Promise<CreateOrderResponse> {
    if (!isMockApi) return http('/api/donations/create-order', { method: 'POST', body: JSON.stringify(req) });
    await wait(600);
    const donationId = 'don_' + Math.random().toString(36).slice(2, 10);
    const d = new Date();
    const reference = `SSS-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 89999)}`;
    memoryDonations[donationId] = {
      donationId, reference, status: 'created', amount: req.amount, frequency: req.frequency, cause: req.cause,
      createdAt: d.toISOString(), donorName: req.donor.anonymous ? 'Anonymous donor' : req.donor.name, donorEmail: req.donor.email, method: req.method,
    };
    saveDemo();
    return { donationId, reference, gatewayOrderId: 'order_demo_' + donationId, amount: req.amount, currency: 'INR', publicKey: 'demo_public_key' };
  },

  /** Called with the gateway's callback payload; the server verifies the signature. `outcome` lets a closed checkout be recorded as cancelled. */
  async verify(donationId: string, payload: Record<string, string>, demoOutcome?: PaymentStatus): Promise<DonationStatusResponse> {
    if (!isMockApi) {
      if (demoOutcome === 'cancelled') return http(`/api/donations/${donationId}/cancel`, { method: 'POST' });
      return http(`/api/donations/${donationId}/verify`, { method: 'POST', body: JSON.stringify(payload) });
    }
    await wait(700);
    const d = memoryDonations[donationId];
    if (!d) throw new ApiError('Donation not found', 404);
    d.status = demoOutcome || 'success';
    if (d.status === 'success') d.receiptNumber = 'RCPT-' + d.reference.split('-').slice(1).join('');
    saveDemo();
    return { ...d };
  },

  async status(donationId: string): Promise<DonationStatusResponse> {
    if (!isMockApi) return http(`/api/donations/${donationId}/status`);
    await wait(400);
    const d = memoryDonations[donationId];
    if (!d) throw new ApiError('We could not find this donation. If you completed a payment, please contact us with your reference.', 404);
    return { ...d };
  },
};
