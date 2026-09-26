/* Shared domain types. These mirror the backend Pydantic schemas (backend/app/schemas). */

export type ID = string;

export type ProgrammeSlug =
  | 'education'
  | 'women-empowerment'
  | 'marriage-assistance'
  | 'healthcare'
  | 'food-essentials'
  | 'livelihood-skills'
  | 'child-protection'
  | 'elderly-care'
  | 'animal-welfare'
  | 'emergency-relief'
  | 'environment-community';

/** Visual theme used by the illustration system and category colour coding. */
export type Theme =
  | 'education' | 'women' | 'marriage' | 'health' | 'food' | 'livelihood'
  | 'child' | 'elderly' | 'animals' | 'emergency' | 'environment' | 'community' | 'volunteer';

export type PublishStatus = 'draft' | 'scheduled' | 'published' | 'archived';

export interface Metric {
  label: string;
  value: number;
  suffix?: string;
  period: string;
}

export interface Programme {
  id: ID;
  slug: ProgrammeSlug;
  title: string;
  short: string;
  theme: Theme;
  icon: string;
  summary: string;
  problem: string;
  approach: string[];
  whatWeDo: { title: string; text: string }[];
  whoWeSupport: string[];
  activities: string[];
  locations: string[];
  metrics: Metric[];
  sensitive?: string;
  volunteerCta?: string;
  status: PublishStatus;
}

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'archived';

export interface CampaignUpdate { date: string; title: string; text: string }

export interface Campaign {
  id: ID;
  slug: string;
  title: string;
  description: string;
  story: string[];
  whyNeeded: string[];
  programme: ProgrammeSlug;
  category: CampaignCategory;
  theme: Theme;
  goal: number;
  raised: number;
  supporters: number;
  startDate: string;
  endDate: string;
  urgent?: boolean;
  featured?: boolean;
  status: CampaignStatus;
  updates: CampaignUpdate[];
  image?: string;
}

export type CampaignCategory = 'Education' | 'Women' | 'Healthcare' | 'Animals' | 'Food' | 'Emergency' | 'Environment' | 'Other';

export type StoryCategory = 'Education' | 'Women' | 'Animals' | 'Healthcare' | 'Community' | 'Volunteer';
export type StoryKind = 'success' | 'animal' | 'volunteer' | 'field';

export interface Story {
  id: ID;
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  impact: string;
  category: StoryCategory;
  kind: StoryKind;
  programme: ProgrammeSlug;
  theme: Theme;
  location: string;
  date: string;
  author: string;
  tags: string[];
  /** Consent recorded for publishing; names are changed unless consent covers real names. */
  consent: 'recorded' | 'anonymised';
  status: PublishStatus;
}

export type EventCategory = 'Health camp' | 'Education drive' | 'Vaccination drive' | 'Food distribution' | 'Tree plantation' | 'Volunteer meetup' | 'Awareness';

export interface NGOEvent {
  id: ID;
  slug: string;
  title: string;
  category: EventCategory;
  theme: Theme;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  description: string;
  volunteersNeeded?: number;
  registrationOpen: boolean;
  status: PublishStatus;
}

export interface GalleryAlbum {
  id: ID;
  title: string;
  programme: ProgrammeSlug;
  theme: Theme;
  date: string;
  kind: 'photo' | 'video';
  items: { id: ID; caption: string; theme: Theme; seed: number }[];
  published: boolean;
}

export type AnimalStatus = 'Available for adoption' | 'Needs foster' | 'Under treatment' | 'Adopted' | 'Community animal';

export interface Animal {
  id: ID;
  code: string;
  name: string;
  species: 'Dog' | 'Cat' | 'Cow' | 'Bird' | 'Other';
  ageEstimate: string;
  gender: 'Male' | 'Female' | 'Unknown';
  area: string;
  status: AnimalStatus;
  health: string;
  vaccinated: boolean;
  sterilised: boolean;
  temperament: string;
  description: string;
  seed: number;
}

export interface ImpactRecord {
  year: number;
  programme: ProgrammeSlug;
  location: string;
  peopleSupported: number;
  childrenReached: number;
  womenSupported: number;
  animalsHelped: number;
  healthCamps: number;
  volunteers: number;
  campaigns: number;
  communities: number;
}

export interface DocumentItem {
  id: ID;
  title: string;
  category: 'Registration' | 'Tax' | 'Annual report' | 'Financial report' | 'Impact report' | 'Policy' | 'Legal';
  period?: string;
  verified: boolean;
  url?: string;
  note?: string;
}

export interface FAQ { q: string; a: string; group: string }

/* ---------- Transactions & forms ---------- */

export type DonationFrequency = 'one-time' | 'monthly';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';
export type PaymentStatus = 'created' | 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded';

export interface DonationRequest {
  cause: string;
  campaignSlug?: string;
  amount: number;
  frequency: DonationFrequency;
  donor: {
    name: string;
    email: string;
    phone: string;
    pan?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    wants80G: boolean;
    anonymous: boolean;
  };
  method: PaymentMethod;
  consent: boolean;
}

export interface CreateOrderResponse {
  donationId: string;
  reference: string;
  gatewayOrderId: string;
  amount: number;
  currency: 'INR';
  publicKey: string;
}

export interface DonationStatusResponse {
  donationId: string;
  reference: string;
  status: PaymentStatus;
  amount: number;
  frequency: DonationFrequency;
  cause: string;
  createdAt: string;
  receiptNumber?: string;
  donorName: string;
  donorEmail: string;
  method: PaymentMethod;
}

export interface VolunteerApplication {
  name: string; email: string; phone: string; age?: number; city: string;
  skills: string; interests: string[]; programme: string; availability: string; message?: string;
}

export interface PartnershipEnquiry {
  company: string; contactPerson: string; email: string; phone: string;
  interest: string; budget: string; message?: string;
}

export interface ContactMessage { name: string; email: string; phone?: string; subject: string; message: string }

export interface ApiResult { ok: true; reference: string }
