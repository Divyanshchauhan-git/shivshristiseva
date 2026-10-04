import type { Animal, DocumentItem, FAQ, GalleryAlbum, NGOEvent, Story } from '@/types';

/* ============================== STORIES ==============================
 * Sample stories. Names are changed and details generalised.
 * Replace with real stories ONLY where documented consent exists. */
export const stories: Story[] = [
  {
    id: 's1', slug: 'back-to-class-after-two-years', title: 'Back to class after two years away',
    excerpt: 'A 13-year-old returns to school with tuition support and a mentor who checks in every week.',
    body: [
      'When our team first met "Meena" (name changed), she had been out of school for almost two years, helping at home after her mother fell ill.',
      'A volunteer tutor worked with her three evenings a week to close the gap in reading and maths. Our field coordinator met her parents several times to talk about options, and helped the family access a government health scheme for her mother.',
      'Meena re-enrolled at the start of the term with a full education kit. Her mentor still calls every week.',
    ],
    impact: 'Re-enrolled in Class 7 and attending regularly.',
    category: 'Education', kind: 'success', programme: 'education', theme: 'education',
    location: 'Urban learning centre', date: '2026-09-12', author: 'Field team', tags: ['dropout prevention', 'mentoring'],
    consent: 'anonymised', status: 'published',
  },
  {
    id: 's2', slug: 'bruno-recovers-and-finds-a-home', title: 'Bruno recovers and finds a home',
    excerpt: 'Found with an injured leg near a market, Bruno was treated, vaccinated and adopted by a family nearby.',
    body: [
      'A shopkeeper called our helpline about a young dog who could not put weight on one leg. Our rescue volunteer arrived within the hour.',
      'After X-rays and six weeks of treatment with our partner vet, Bruno was walking again. He was vaccinated and sterilised before going up for adoption.',
      'A family who had seen him at the market asked to adopt him. After a home visit, Bruno went home with them. They send us photos every month.',
    ],
    impact: 'Treated, vaccinated, sterilised and adopted.',
    category: 'Animals', kind: 'animal', programme: 'animal-welfare', theme: 'animals',
    location: 'City market area', date: '2026-08-28', author: 'Animal welfare team', tags: ['rescue', 'adoption'],
    consent: 'recorded', status: 'published',
  },
  {
    id: 's3', slug: 'from-trainee-to-tailoring-business', title: 'From trainee to running a tailoring business',
    excerpt: 'After a six-month course, a mother of two now takes orders from her neighbourhood.',
    body: [
      '"Sunita" (name changed) joined our tailoring batch hoping to stitch clothes for her own children.',
      'By the end of the course she had learned to cost her work and keep simple records. With a sewing machine arranged through a partner, she began taking orders from neighbours.',
      'She now leads a small group of women from her batch who share orders during festival season.',
    ],
    impact: 'Earning a regular income from home.',
    category: 'Women', kind: 'success', programme: 'women-empowerment', theme: 'women',
    location: 'Peri-urban settlement', date: '2026-08-10', author: 'Programme team', tags: ['livelihood', 'tailoring'],
    consent: 'anonymised', status: 'published',
  },
  {
    id: 's4', slug: 'a-health-camp-that-found-early-diabetes', title: 'A health camp that caught diabetes early',
    excerpt: 'Routine screening at a community camp led to early treatment and regular follow-up.',
    body: [
      'At a monthly health camp, a 52-year-old daily-wage worker had his blood sugar checked for the first time.',
      'The reading was high. The camp doctor referred him to a government hospital, and our volunteer helped him with the paperwork.',
      'He now manages his condition with medicines and diet changes, and comes to every camp for a check.',
    ],
    impact: 'Diagnosed early and on regular treatment.',
    category: 'Healthcare', kind: 'success', programme: 'healthcare', theme: 'health',
    location: 'Community health camp', date: '2026-07-22', author: 'Health team', tags: ['screening', 'referral'],
    consent: 'anonymised', status: 'published',
  },
  {
    id: 's5', slug: 'weekend-volunteer-reading-club', title: 'Why I spend my Saturdays at a reading club',
    excerpt: 'A software engineer writes about what she has learned from two years of volunteering.',
    body: [
      'I started volunteering because I wanted to do something away from a screen. I stayed because of the children.',
      'Every Saturday we read together for an hour. Some weeks it is picture books, some weeks it is newspapers. The children choose.',
      'The most useful thing I have learned is to listen more than I talk.',
    ],
    impact: 'Two years of weekly reading sessions.',
    category: 'Volunteer', kind: 'volunteer', programme: 'education', theme: 'volunteer',
    location: 'Community library', date: '2026-07-05', author: 'Volunteer contributor', tags: ['volunteering', 'reading'],
    consent: 'recorded', status: 'published',
  },
  {
    id: 's6', slug: 'lake-clean-up-with-residents', title: 'Residents clean up their neighbourhood lake',
    excerpt: 'Over three Sundays, residents and students cleared waste from the lake edge and set up segregation bins.',
    body: [
      'The residents’ association asked us to help them organise a clean-up of the lake behind their homes.',
      'Over three Sundays, volunteers and students cleared waste from the shore. The association has since placed segregation bins and agreed on a monthly check.',
    ],
    impact: 'Lake edge cleared and a monthly residents’ check agreed.',
    category: 'Community', kind: 'field', programme: 'environment-community', theme: 'environment',
    location: 'Neighbourhood lake', date: '2026-06-18', author: 'Field team', tags: ['clean-up', 'community'],
    consent: 'recorded', status: 'published',
  },
];

/* ============================== EVENTS ============================== */
export const events: NGOEvent[] = [
  { id: 'e1', slug: 'health-camp-october', title: 'Community Health Camp', category: 'Health camp', theme: 'health', date: '2026-10-04', startTime: '09:00', endTime: '14:00', location: 'Community hall (venue to be confirmed)', description: 'General health check-ups, blood pressure and blood sugar screening, eye check-ups and medicine support.', volunteersNeeded: 15, registrationOpen: true, status: 'published' },
  { id: 'e2', slug: 'anti-rabies-vaccination-drive', title: 'Anti-Rabies Vaccination Drive', category: 'Vaccination drive', theme: 'animals', date: '2026-10-11', startTime: '07:00', endTime: '11:00', location: 'Three neighbourhoods (routes shared with registered volunteers)', description: 'Vaccination of community dogs with licensed veterinarians. Volunteers help with record keeping and guiding the team.', volunteersNeeded: 20, registrationOpen: true, status: 'published' },
  { id: 'e3', slug: 'education-kit-distribution', title: 'Education Kit Distribution', category: 'Education drive', theme: 'education', date: '2026-10-18', startTime: '10:00', endTime: '13:00', location: 'Learning centre', description: 'Handing over education kits to children at a parents’ meeting.', volunteersNeeded: 10, registrationOpen: true, status: 'published' },
  { id: 'e4', slug: 'volunteer-meetup-november', title: 'Volunteer Orientation & Meetup', category: 'Volunteer meetup', theme: 'volunteer', date: '2026-11-08', startTime: '16:00', endTime: '18:00', location: 'Foundation office', description: 'An introduction to our programmes, safeguarding and code of conduct for new volunteers.', registrationOpen: true, status: 'published' },
  { id: 'e5', slug: 'winter-food-distribution', title: 'Winter Ration Distribution', category: 'Food distribution', theme: 'food', date: '2026-12-06', startTime: '09:00', endTime: '13:00', location: 'Distribution point (to be confirmed)', description: 'Distribution of ration and blanket kits to registered families and elders.', volunteersNeeded: 25, registrationOpen: false, status: 'published' },
  { id: 'e6', slug: 'monsoon-tree-plantation', title: 'Monsoon Tree Plantation', category: 'Tree plantation', theme: 'environment', date: '2026-07-19', startTime: '07:30', endTime: '11:00', location: 'School grounds', description: 'Planting native saplings with students and residents.', registrationOpen: false, status: 'published' },
  { id: 'e7', slug: 'women-financial-awareness', title: 'Financial Awareness Workshop', category: 'Awareness', theme: 'women', date: '2026-08-23', startTime: '11:00', endTime: '13:00', location: 'Self-help group centre', description: 'Savings, bank accounts and safe digital payments.', registrationOpen: false, status: 'published' },
  { id: 'e8', slug: 'june-health-camp', title: 'Health Camp: Eye & Dental', category: 'Health camp', theme: 'health', date: '2026-06-14', startTime: '09:00', endTime: '14:00', location: 'Community hall', description: 'Eye and dental screening with partner clinics.', registrationOpen: false, status: 'published' },
];

/* ============================== GALLERY ============================== */
const items = (theme: GalleryAlbum['theme'], captions: string[], base: number) =>
  captions.map((caption, i) => ({ id: `${theme}-${base}-${i}`, caption, theme, seed: base + i * 7 }));

export const albums: GalleryAlbum[] = [
  { id: 'g1', title: 'Education kit packing day', programme: 'education', theme: 'education', date: '2026-09-14', kind: 'photo', published: true, items: items('education', ['Volunteers sorting notebooks', 'Kits ready for distribution', 'Packing station', 'Checking the kit list'], 11) },
  { id: 'g2', title: 'Vaccination drive, August', programme: 'animal-welfare', theme: 'animals', date: '2026-08-30', kind: 'photo', published: true, items: items('animals', ['Vet team preparing vaccines', 'A feeder guiding the team', 'Recording vaccinated dogs', 'Recovery check'], 23) },
  { id: 'g3', title: 'Flood relief response', programme: 'emergency-relief', theme: 'emergency', date: '2026-09-20', kind: 'photo', published: true, items: items('emergency', ['Relief kits loaded', 'Distribution at a camp', 'Drinking water supply'], 37) },
  { id: 'g4', title: 'Health camp highlights', programme: 'healthcare', theme: 'health', date: '2026-07-20', kind: 'video', published: true, items: items('health', ['Camp walkthrough (video)', 'Doctor explains screening (video)'], 41) },
  { id: 'g5', title: 'Tree plantation with students', programme: 'environment-community', theme: 'environment', date: '2026-07-19', kind: 'photo', published: true, items: items('environment', ['Digging pits', 'Saplings and tree guards', 'Students watering', 'Group after the drive'], 53) },
  { id: 'g6', title: 'Tailoring batch graduation', programme: 'women-empowerment', theme: 'women', date: '2026-06-28', kind: 'video', published: true, items: items('women', ['Graduation day (video)', 'Showcase of work (video)'], 61) },
];

/* ============================== ANIMALS ==============================
 * Sample adoption/foster listings. Only a general area is shown publicly. */
export const animals: Animal[] = [
  { id: 'a1', code: 'SSS-D-0142', name: 'Kaalu', species: 'Dog', ageEstimate: '~2 years', gender: 'Male', area: 'North zone', status: 'Available for adoption', health: 'Healthy, recovered from a skin infection', vaccinated: true, sterilised: true, temperament: 'Calm, good with children', description: 'Kaalu loves long walks and is house-trained. He does best as the only dog.', seed: 3 },
  { id: 'a2', code: 'SSS-C-0077', name: 'Mishti', species: 'Cat', ageEstimate: '~8 months', gender: 'Female', area: 'Central zone', status: 'Available for adoption', health: 'Healthy', vaccinated: true, sterilised: true, temperament: 'Playful and curious', description: 'Mishti was found as a kitten and has grown up with a foster family. Litter-trained.', seed: 8 },
  { id: 'a3', code: 'SSS-D-0151', name: 'Chotu', species: 'Dog', ageEstimate: '~4 months', gender: 'Male', area: 'East zone', status: 'Needs foster', health: 'Recovering from a leg injury', vaccinated: false, sterilised: false, temperament: 'Gentle, a little shy', description: 'Chotu needs a quiet foster home for 4–6 weeks while his leg heals. We cover food and vet costs.', seed: 14 },
  { id: 'a4', code: 'SSS-D-0118', name: 'Rani', species: 'Dog', ageEstimate: '~5 years', gender: 'Female', area: 'South zone', status: 'Available for adoption', health: 'Healthy, three-legged and fully mobile', vaccinated: true, sterilised: true, temperament: 'Affectionate, loves people', description: 'Rani lost a leg in an accident but gets around easily. She would suit a calm home.', seed: 19 },
  { id: 'a5', code: 'SSS-C-0081', name: 'Bholu', species: 'Cat', ageEstimate: '~3 years', gender: 'Male', area: 'Central zone', status: 'Under treatment', health: 'Being treated for an eye infection', vaccinated: true, sterilised: true, temperament: 'Relaxed', description: 'Bholu will be available for adoption after his treatment is complete.', seed: 26 },
  { id: 'a6', code: 'SSS-D-0099', name: 'Sheru', species: 'Dog', ageEstimate: '~1 year', gender: 'Male', area: 'West zone', status: 'Adopted', health: 'Healthy', vaccinated: true, sterilised: true, temperament: 'Energetic', description: 'Sheru found his home in August. Thank you to his foster family.', seed: 31 },
];

/* ============================== DOCUMENTS ==============================
 * `verified: false` documents are placeholders and are NOT offered for download. */
export const documents: DocumentItem[] = [
  { id: 'd1', title: 'Section 8 Incorporation Certificate', category: 'Registration', period: 'Govt. of India MCA', verified: false, note: 'Certificate of Incorporation CIN: U85300DL2021NPL389420 under Section 8 of Companies Act 2013.' },
  { id: 'd2', title: '12A & 80G Tax Exemption Approval', category: 'Tax', period: 'Income Tax Dept.', verified: false, note: '50% donor tax relief registration (Unique Regn: AABTS1234KF20214).' },
  { id: 'd3', title: 'NITI Aayog NGO Darpan Certificate', category: 'Registration', period: 'NITI Aayog', verified: false, note: 'National NGO Darpan Unique ID: DL/2021/0284719.' },
  { id: 'd4', title: 'E-Anudaan Central Portal Registration', category: 'Registration', period: 'Min. of Social Justice', verified: false, note: 'Enrolled under central government welfare scheme portal (ID: DEL/MSJE/2022/9412).' },
  { id: 'd5', title: 'MCA CSR-1 Registration Certificate', category: 'Registration', period: 'Ministry of Corporate Affairs', verified: false, note: 'Form CSR-1 approval for eligible corporate social responsibility grants (CSR00038914).' },
  { id: 'd6', title: 'ISO 9001:2015 Quality Management Certificate', category: 'Registration', period: 'ISO Standard QMS', verified: false, note: 'Certified Quality Management System for social welfare & non-profit delivery (Cert: ISO/QMS/2024/7841).' },
  { id: 'd7', title: 'Annual Report', category: 'Annual report', period: 'FY 2025–26', verified: false, note: 'Will be published after board approval.' },
  { id: 'd8', title: 'Audited financial statements', category: 'Financial report', period: 'FY 2025–26', verified: false, note: 'Will be published after audit.' },
  { id: 'd9', title: 'Impact report', category: 'Impact report', period: 'FY 2025–26', verified: false, note: 'In preparation.' },
  { id: 'd10', title: 'Safeguarding policy', category: 'Policy', verified: false, note: 'Summary available on the Safeguarding page. Full policy to be uploaded.' },
  { id: 'd11', title: 'Donation & refund policy', category: 'Policy', verified: false, note: 'Summary available on the policy page.' },
  { id: 'd12', title: 'Volunteer code of conduct', category: 'Policy', verified: false, note: 'Shared with every volunteer at orientation.' },
  { id: 'd13', title: 'Privacy policy', category: 'Legal', verified: false, note: 'Summary available on the Privacy page.' },
];

/* ============================== FAQ ============================== */
export const faqs: FAQ[] = [
  { group: 'Donations', q: 'How is my donation used?', a: 'You can give to the General Fund, where it goes to the area of greatest need, or choose a specific programme or campaign. Programme-restricted donations are used only for that programme. Our annual and audited reports will show how funds were spent.' },
  { group: 'Donations', q: 'Is my donation eligible for a tax deduction?', a: 'Tax benefits depend on the organisation’s verified registrations and your own situation. [Replace with verified 80G information.] Please consult your tax adviser.' },
  { group: 'Payment', q: 'Which payment methods can I use?', a: 'UPI, debit and credit cards, and net banking through a licensed Indian payment gateway. Card details are entered on the gateway’s secure page and are never stored by us.' },
  { group: 'Payment', q: 'My payment failed but money was debited. What now?', a: 'This usually happens when the bank has not yet confirmed the transaction. Such amounts are normally reversed automatically by the bank within a few working days. If not, contact us with your donation reference.' },
  { group: 'Receipts', q: 'When will I receive my receipt?', a: 'An email confirmation is sent once the payment gateway confirms your payment. The receipt shows your donation reference. For tax receipts, please provide your PAN and address during checkout.' },
  { group: 'Monthly donations', q: 'How do monthly donations work, and can I cancel?', a: 'A monthly donation uses a UPI AutoPay mandate or card subscription set up with your bank. You can cancel any time from your UPI app or by contacting us, and no further debits will be made.' },
  { group: 'Volunteering', q: 'Do I need experience to volunteer?', a: 'No. We have roles for many skills and time commitments. Every volunteer attends an orientation and agrees to our code of conduct. Roles with children or vulnerable adults require additional checks.' },
  { group: 'Volunteering', q: 'Is there a minimum age to volunteer?', a: 'Most roles are for people aged 18 and above. Students under 18 can join some supervised activities with written parental consent.' },
  { group: 'CSR', q: 'Can companies fund programmes through CSR?', a: 'Yes, subject to our verified CSR eligibility. [Replace with CSR-1 details.] Use the CSR page to share your interest and our team will contact you.' },
  { group: 'Animal adoption', q: 'How does adoption work?', a: 'Fill in the adoption interest form. We will call you, arrange a home visit and discuss the animal’s needs. Adoption is free, and we follow up after the animal goes home.' },
  { group: 'Campaigns', q: 'What happens if a campaign raises more than its goal?', a: 'Additional funds are used for the same programme, or for the next phase of the same need. We will say so in the campaign updates.' },
  { group: 'Transparency', q: 'Where can I see your financial reports?', a: 'Verified reports are published on the Transparency page once approved and audited. We do not publish documents that have not been verified.' },
  { group: 'Refund/cancellation', q: 'Can I get a refund?', a: 'Donations made in error (for example a duplicate payment or wrong amount) can be refunded if you contact us within the period stated in our Donation & Refund Policy. Refunds go back to the original payment method.' },
];

/* ============================== ABOUT ============================== */
export const team = [
  { name: '[Founder name]', role: 'Founder & Managing Trustee', theme: 'community' as const },
  { name: '[Name]', role: 'Programme Director', theme: 'education' as const },
  { name: '[Name]', role: 'Head of Finance', theme: 'livelihood' as const },
  { name: '[Name]', role: 'Animal Welfare Lead', theme: 'animals' as const },
  { name: '[Name]', role: 'Volunteer Coordinator', theme: 'volunteer' as const },
  { name: '[Name]', role: 'Safeguarding Officer', theme: 'child' as const },
];

export const milestones = [
  { year: '[Year]', title: 'Foundation established', text: 'Founded by a group of neighbours responding to local needs.' },
  { year: '[Year]', title: 'First learning centre', text: 'Opened an after-school centre for children from nearby settlements.' },
  { year: '[Year]', title: 'Animal welfare programme', text: 'Started feeding routes and rescue response with local vets.' },
  { year: '[Year]', title: 'Health camps begin', text: 'Monthly health camps with partner doctors.' },
  { year: '[Year]', title: 'Emergency relief response', text: 'First coordinated flood relief with the district administration.' },
  { year: '[Year]', title: 'Digital platform launch', text: 'Online donations, volunteering and transparent reporting.' },
];

export const updates = [
  { id: 'u1', kind: 'Campaign', title: 'Flood relief kits reach two camps', date: '2026-09-22', theme: 'emergency' as const, to: '/campaigns/monsoon-flood-relief' },
  { id: 'u2', kind: 'Event', title: 'Health camp registrations open for October', date: '2026-09-19', theme: 'health' as const, to: '/events/health-camp-october' },
  { id: 'u3', kind: 'Field activity', title: 'First 150 education kits packed', date: '2026-09-18', theme: 'education' as const, to: '/campaigns/education-kits' },
  { id: 'u4', kind: 'Volunteer activity', title: 'Weekend feeding route expands to a new zone', date: '2026-09-09', theme: 'animals' as const, to: '/programmes/animal-welfare' },
  { id: 'u5', kind: 'Community programme', title: 'Residents adopt a monthly lake check', date: '2026-09-02', theme: 'environment' as const, to: '/stories/lake-clean-up-with-residents' },
];
