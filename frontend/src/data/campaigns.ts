import type { Campaign } from '@/types';

/** DEMO campaigns. Amounts, supporters and dates are sample values only. */
export const campaigns: Campaign[] = [
  {
    id: 'c1', slug: 'education-kits', title: 'Help Us Provide Education Kits',
    description: 'School bags, notebooks, stationery and geometry sets so children start the new term ready to learn.',
    story: [
      'At the start of every term, some children arrive at school without notebooks or a bag. Teachers tell us these children often stop asking questions and slowly fall behind.',
      'An education kit is a small thing, but it removes one reason for a child to feel left out. Each kit is packed by volunteers and handed over at a parents’ meeting, so families know what their child has received and why.',
    ],
    whyNeeded: [
      'Families facing income loss often cut back on school supplies first.',
      'Children without basic materials are more likely to miss school.',
      'Kits are distributed with a follow-up on attendance through our learning centres.',
    ],
    programme: 'education', category: 'Education', theme: 'education',
    goal: 500000, raised: 318500, supporters: 214, startDate: '2026-08-01', endDate: '2026-11-15',
    featured: true, status: 'active',
    updates: [
      { date: '2026-09-18', title: 'First 150 kits packed', text: 'Volunteers packed the first batch over the weekend. Distribution is planned at two learning centres next week.' },
      { date: '2026-08-20', title: 'Kit list finalised', text: 'We finalised the kit contents with teachers from partner schools.' },
    ],
  },
  {
    id: 'c2', slug: 'monsoon-flood-relief', title: 'Monsoon Flood Relief',
    description: 'Dry rations, drinking water, hygiene kits and tarpaulins for families displaced by flooding.',
    story: [
      'Heavy rain has flooded low-lying settlements, and families have moved to relief camps with only what they could carry.',
      'Our volunteers are working with local authorities to deliver relief kits where they are needed most.',
    ],
    whyNeeded: ['Families have lost food stocks and cooking fuel.', 'Clean drinking water is scarce in camps.', 'Hygiene kits help prevent disease outbreaks.'],
    programme: 'emergency-relief', category: 'Emergency', theme: 'emergency',
    goal: 750000, raised: 402000, supporters: 389, startDate: '2026-09-02', endDate: '2026-10-20',
    urgent: true, status: 'active',
    updates: [{ date: '2026-09-22', title: 'Relief kits reach two camps', text: 'The first 200 kits were distributed with support from the district team.' }],
  },
  {
    id: 'c3', slug: 'street-animal-vaccination', title: 'Vaccinate Community Dogs',
    description: 'Anti-rabies vaccination and health checks for community dogs, carried out with licensed veterinarians.',
    story: [
      'Vaccination protects animals and the people who live alongside them. Every vaccinated dog is marked and recorded.',
      'This drive is run with local feeders who know the animals and help us find them.',
    ],
    whyNeeded: ['Vaccination reduces the risk of rabies for animals and people.', 'Feeders know the animals but cannot afford vaccines.', 'Records help plan the next round of boosters.'],
    programme: 'animal-welfare', category: 'Animals', theme: 'animals',
    goal: 200000, raised: 146000, supporters: 172, startDate: '2026-07-15', endDate: '2026-10-31',
    status: 'active',
    updates: [{ date: '2026-09-10', title: '120 dogs vaccinated', text: 'Our second drive covered three neighbourhoods.' }],
  },
  {
    id: 'c4', slug: 'health-camp-series', title: 'Community Health Camps',
    description: 'Monthly health camps with screening, medicines and referrals in underserved neighbourhoods.',
    story: ['Each camp brings doctors, nurses and volunteers together for a day of check-ups, screening and follow-up.'],
    whyNeeded: ['Early screening catches conditions before they become serious.', 'Many patients cannot afford medicines.', 'Referral follow-up turns a check-up into treatment.'],
    programme: 'healthcare', category: 'Healthcare', theme: 'health',
    goal: 400000, raised: 122000, supporters: 96, startDate: '2026-09-01', endDate: '2026-12-31',
    status: 'active', updates: [],
  },
  {
    id: 'c5', slug: 'women-tailoring-batch', title: 'Tailoring Training for 40 Women',
    description: 'Sewing machines, materials and a trainer for a six-month tailoring and small-business course.',
    story: ['Women in this batch will learn tailoring, costing and selling, and leave with a plan for earning from their skill.'],
    whyNeeded: ['Training equipment is the main barrier to starting a batch.', 'Graduates can earn from home.', 'Each batch forms a peer support group.'],
    programme: 'women-empowerment', category: 'Women', theme: 'women',
    goal: 300000, raised: 211000, supporters: 131, startDate: '2026-07-01', endDate: '2026-10-15',
    status: 'active', updates: [],
  },
  {
    id: 'c6', slug: 'winter-ration-kits', title: 'Winter Ration & Blanket Kits',
    description: 'A month of dry rations and a warm blanket for families and older people living alone.',
    story: ['Winter is hardest for older people living alone and for daily-wage families whose work slows in the cold.'],
    whyNeeded: ['Work and income drop in winter months.', 'Older people are most at risk from the cold.', 'Kits are delivered by volunteers who check in on recipients.'],
    programme: 'food-essentials', category: 'Food', theme: 'food',
    goal: 600000, raised: 84000, supporters: 58, startDate: '2026-09-15', endDate: '2026-12-20',
    status: 'active', updates: [],
  },
  {
    id: 'c7', slug: 'native-tree-plantation', title: 'Plant 2,000 Native Trees',
    description: 'Native saplings, tree guards and two years of watering and care along roads and school grounds.',
    story: ['We plant only native species and arrange care for each sapling, so trees survive and grow.'],
    whyNeeded: ['Shade and green cover reduce heat in dense neighbourhoods.', 'Tree guards and watering improve survival rates.', 'Schools adopt and care for trees with their students.'],
    programme: 'environment-community', category: 'Environment', theme: 'environment',
    goal: 250000, raised: 250000, supporters: 204, startDate: '2026-05-01', endDate: '2026-08-31',
    status: 'completed', updates: [{ date: '2026-09-01', title: 'Goal reached', text: 'Thank you. Plantation is complete and watering has begun.' }],
  },
  {
    id: 'c8', slug: 'elderly-companion-care', title: 'Care Kits for Elders Living Alone',
    description: 'Medicines, spectacles and a monthly essentials kit for older people without family support.',
    story: ['Our volunteers visit each person every week. This campaign covers the essentials they tell us they need most.'],
    whyNeeded: ['Many cannot afford regular medicines.', 'Poor eyesight makes daily life harder and less safe.', 'Visits reduce isolation.'],
    programme: 'elderly-care', category: 'Other', theme: 'elderly',
    goal: 180000, raised: 67000, supporters: 49, startDate: '2026-08-15', endDate: '2026-12-15',
    status: 'active', updates: [],
  },
];

export const campaignBySlug = (slug: string) => campaigns.find((c) => c.slug === slug);
export const campaignCategories = ['Education', 'Women', 'Healthcare', 'Animals', 'Food', 'Emergency', 'Environment', 'Other'] as const;
