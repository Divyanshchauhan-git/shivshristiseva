export interface WorkPillar {
  title: string;
  description: string;
  icon?: string;
}

export interface DomainMetric {
  value: string;
  label: string;
}

export interface GivingTier {
  amount: number;
  label: string;
  impact: string;
}

export interface DomainDetails {
  id: string;
  name: string;
  shortTag: string;
  tagline: string;
  quote?: { text: string; author: string; role: string };
  image: string;
  accentColor: string;
  bgGradient: string;
  pillars: WorkPillar[];
  metrics: DomainMetric[];
  givingTiers: GivingTier[];
  summaryStory: string;
}

export const domainWorkDetails: Record<string, DomainDetails> = {
  Women: {
    id: 'Women',
    name: 'Women Empowerment & Livelihoods',
    shortTag: 'Nari Shakti Initiative',
    tagline: 'Empowering women with vocational skills, micro-enterprise tools, health dignity, and financial independence.',
    image: '/images/women_empowerment.jpg',
    accentColor: '#BE4832',
    bgGradient: 'from-[#FAF2ED] via-[#FFF8F5] to-[#FDF4EF] dark:from-[#2B1713] dark:via-[#1F1412] dark:to-[#17100F]',
    quote: {
      text: 'Before joining Shivshristi Seva Sansthan, I had never stepped out to earn. Today, with my own sewing machine and training, I earn ₹12,000 every month and send my daughter to an English-medium school.',
      author: 'Sunita Devi',
      role: 'Artisan & SHG Leader, Batch of 2025',
    },
    summaryStory: 'We believe when you educate and empower a woman, you lift an entire family out of poverty. Our grassroots centres turn marginalisation into leadership.',
    pillars: [
      {
        title: 'Vocational Stitching & Handicraft Hubs',
        description: 'Permanent centres with modern pedal & electric sewing machines where women master tailoring, embroidery, bag stitching, and craft-making with certified trainers.',
      },
      {
        title: 'Shakti Self-Help Groups (SHGs) & Micro-Finance',
        description: 'Organising women into community savings collectives, providing financial literacy, zero-interest seed capital, and direct market access for their products.',
      },
      {
        title: 'Menstrual Health & Dignity (Project Udaan)',
        description: 'Distributing free eco-friendly sanitary kits, conducting monthly doctor-led reproductive health sessions, and shattering social taboos in peri-urban and rural areas.',
      },
      {
        title: 'Digital Literacy & Modern Enterprise',
        description: 'Hands-on training in smartphones, UPI payments, e-commerce listings, and basic computer office skills so women can sell goods directly online.',
      },
      {
        title: 'Legal Awareness & Protection Counseling',
        description: 'Free legal aid clinics, domestic counseling, and assistance with government welfare entitlements (Ladli Behna, PM Matru Vandana, Sukanya Samriddhi).',
      },
    ],
    metrics: [
      { value: '4,200+', label: 'Women Trained & Certified' },
      { value: '85+', label: 'Active Self-Help Groups' },
      { value: '25,000+', label: 'Sanitary Kits Distributed' },
      { value: '78%', label: 'Achieved Financial Self-Reliance' },
    ],
    givingTiers: [
      {
        amount: 500,
        label: 'Artisan Raw Materials',
        impact: 'Provides fabrics, thread sets, and cutting kits for 1 trainee woman for an entire month.',
      },
      {
        amount: 1200,
        label: 'Adolescent Hygiene Care',
        impact: 'Supplies year-round eco-friendly sanitary hygiene & wellness kits for 4 young girls.',
      },
      {
        amount: 3500,
        label: 'Full Vocational Course',
        impact: 'Covers 3 months of comprehensive stitching or computer certification tuition + materials.',
      },
      {
        amount: 7500,
        label: 'Micro-Enterprise Launch Kit',
        impact: 'Gifts a brand new heavy-duty sewing machine & initial inventory to launch a home business.',
      },
    ],
  },

  Education: {
    id: 'Education',
    name: 'Child Education & Learning Centres',
    shortTag: 'Vidya Jyoti Initiative',
    tagline: 'Ensuring every child in underserved communities has access to joyful learning, books, and after-school guidance.',
    image: '/images/child_education.jpg',
    accentColor: '#1A6B74',
    bgGradient: 'from-[#EDF6F7] via-[#F4FAFA] to-[#EDF6F7] dark:from-[#112427] dark:via-[#0F1E21] dark:to-[#0B171A]',
    quote: {
      text: 'The evening remedial classes helped my son pass his 10th board exams with first division. Shivshristi volunteers believed in him when we had lost hope.',
      author: 'Rameshwar Lal',
      role: 'Parent & Community Member',
    },
    summaryStory: 'We run community learning centres bridging learning gaps for first-generation learners, preventing dropouts and nurturing bright dreams.',
    pillars: [
      {
        title: 'Free Remedial Learning Centres',
        description: 'Safe daily study spaces with volunteer tutors focusing on foundational math, science, and languages for government school students.',
      },
      {
        title: 'Annual School Readiness & Kit Drives',
        description: 'Providing sturdy school bags, notebooks, geometry boxes, uniforms, and shoes so no child skips school due to lack of supplies.',
      },
      {
        title: 'STEM & Digital Classrooms',
        description: 'Interactive audio-visual learning with tablets and computers, sparking curiosity and scientific thinking in children.',
      },
      {
        title: 'Nutrition & Daily Healthy Snacks',
        description: 'Nutritious evening meals and clean drinking water provided at every study session to combat child undernutrition.',
      },
    ],
    metrics: [
      { value: '3,800+', label: 'Students Supported Daily' },
      { value: '98%', label: 'Class Transition Rate' },
      { value: '18', label: 'Active Study Centres' },
      { value: '1,200+', label: 'Scholarships Awarded' },
    ],
    givingTiers: [
      {
        amount: 500,
        label: 'School Supply Kit',
        impact: 'Supplies 1 child with notebooks, stationery, and geometry tools for an academic term.',
      },
      {
        amount: 1500,
        label: 'Backpack & Uniform Pack',
        impact: 'Provides durable school bag, weather-proof shoes, and complete uniform set.',
      },
      {
        amount: 3000,
        label: 'Digital Learning Tablet Access',
        impact: 'Funds educational software licenses and interactive tablet time for 3 children.',
      },
      {
        amount: 6000,
        label: 'One-Year Child Sponsorship',
        impact: 'Covers full tuition support, books, daily snacks, and mentorship for a whole year.',
      },
    ],
  },

  Animals: {
    id: 'Animals',
    name: 'Animal Welfare, Rescue & Shelter',
    shortTag: 'Jeeva Karuna Initiative',
    tagline: 'Treating the voiceless with dignity: 24/7 rescue, emergency treatments, sterilization, and loving community adoption.',
    image: '/images/animal_welfare.jpg',
    accentColor: '#2E7A57',
    bgGradient: 'from-[#EDF7F1] via-[#F4FBF7] to-[#EDF7F1] dark:from-[#11241C] dark:via-[#0F1E17] dark:to-[#0A1711]',
    quote: {
      text: 'Kaalu was hit by a truck and left on the highway. Shivshristi rescue ambulance arrived within 30 minutes, performed surgery, and nursed him back to full recovery.',
      author: 'Dr. Neha Verma',
      role: 'Chief Veterinary Officer',
    },
    summaryStory: 'We stand for kindness without boundaries. Our dedicated rescue team, ambulance, and trauma recovery centre protect hundreds of community animals monthly.',
    pillars: [
      {
        title: '24/7 Mobile Veterinary Ambulance',
        description: 'Equipped emergency response vehicle responding to accident calls, animal distress, and on-site wound dressings across the city.',
      },
      {
        title: 'Sterilization & Anti-Rabies Vaccination',
        description: 'Scientific, humane ABC (Animal Birth Control) and annual vaccination drives to create healthy, rabies-free neighborhoods.',
      },
      {
        title: 'Trauma Care & Shelter Rehabilitation',
        description: 'Inpatient medical facility for injured, paralytic, or orphaned dogs, cats, cows, and birds needing continuous nursing.',
      },
      {
        title: 'Daily Feeding Routes & Water Bowls',
        description: 'Feeding over 450+ stray animals daily and installing clean cement water troughs across summer heat zones.',
      },
    ],
    metrics: [
      { value: '12,500+', label: 'Animal Treatments Conducted' },
      { value: '3,400+', label: 'Anti-Rabies Vaccines Given' },
      { value: '450+', label: 'Stray Animals Fed Daily' },
      { value: '820+', label: 'Successful Pet Adoptions' },
    ],
    givingTiers: [
      {
        amount: 500,
        label: 'Daily Feeding Pack',
        impact: 'Feeds 15 street dogs nutritious boiled rice, broth, and eggs for a week.',
      },
      {
        amount: 1500,
        label: 'Emergency Treatment Course',
        impact: 'Covers antibiotics, wound dressing, painkillers, and saline for an injured animal.',
      },
      {
        amount: 3000,
        label: 'Sterilization & Rabies Vaccine',
        impact: 'Funds full humane surgical sterilization, post-op care, and rabies immunization.',
      },
      {
        amount: 5500,
        label: 'Critical Inpatient Surgery Support',
        impact: 'Supports life-saving surgery, x-rays, and 2-week sheltered recovery for accident cases.',
      },
    ],
  },

  Healthcare: {
    id: 'Healthcare',
    name: 'Healthcare, Screenings & Medicine Support',
    shortTag: 'Swasthya Seva Initiative',
    tagline: 'Taking doctors and diagnostic checkups directly to doorsteps in rural villages and underprivileged urban settlements.',
    image: '/images/child_education.jpg',
    accentColor: '#0F3D44',
    bgGradient: 'from-[#EDF5F6] via-[#F6FBFC] to-[#EDF5F6] dark:from-[#112427] dark:via-[#0F1E21] dark:to-[#0B171A]',
    summaryStory: 'No family should have to choose between food and medicine. Our weekly mobile clinics provide diagnostic screenings, doctor consultations, and free generic medicines.',
    pillars: [
      {
        title: 'Weekly Free Community Health Camps',
        description: 'General physicians, optometrists, and dental specialists providing diagnostics, BP/sugar checks, and health advice in remote villages.',
      },
      {
        title: 'Free Essential Medicines & Supplements',
        description: 'Dispensing verified generic medicines, iron-folic acid for pregnant mothers, and pediatric vitamins to low-income patients.',
      },
      {
        title: 'Cataract Screenings & Eye Surgeries',
        description: 'Partnering with eye hospitals to provide free vision testing, free spectacles, and safe cataract surgeries for elderly villagers.',
      },
      {
        title: 'Preventive Health & Hygiene Workshops',
        description: 'Educating families on clean drinking water, vector-borne disease prevention (dengue, malaria), and sanitation.',
      },
    ],
    metrics: [
      { value: '18,000+', label: 'Patients Treated for Free' },
      { value: '650+', label: 'Free Cataract Surgeries' },
      { value: '95+', label: 'Mobile Camps Organised' },
      { value: '4,500+', label: 'Free Spectacles Given' },
    ],
    givingTiers: [
      {
        amount: 600,
        label: 'Free Medicine Course',
        impact: 'Provides essential chronic medicines (BP, diabetes, pain) for 2 elderly patients.',
      },
      {
        amount: 1500,
        label: 'Eye Test & Prescription Glasses',
        impact: 'Funds full refraction eye testing and custom spectacles for 3 village elders.',
      },
      {
        amount: 3500,
        label: 'Community Mobile Camp Sponsor',
        impact: 'Supports diagnostic supplies and doctor allowances for a rural health camp for 80 people.',
      },
      {
        amount: 6000,
        label: 'Full Cataract Surgery Support',
        impact: 'Restores eyesight for an underprivileged elder with free IOL surgery and medications.',
      },
    ],
  },

  Food: {
    id: 'Food',
    name: 'Food Security & Nutrition Rations',
    shortTag: 'Annapurna Seva Initiative',
    tagline: 'Fighting hunger with dignity through monthly grocery kits for impoverished families, widows, and daily wagers.',
    image: '/images/women_empowerment.jpg',
    accentColor: '#EFA23A',
    bgGradient: 'from-[#FCF7ED] via-[#FEFAEF] to-[#FCF7ED] dark:from-[#2B2011] dark:via-[#1F180F] dark:to-[#17110A]',
    summaryStory: 'Nutritious food is a fundamental human right. Our balanced ration kits ensure no child or elder in our adopted clusters goes to bed hungry.',
    pillars: [
      {
        title: 'Dry Ration Monthly Kits',
        description: 'Comprehensive packages containing 10kg flour, 5kg rice, 2kg pulses, 1L cooking oil, spices, salt, and soap delivered directly.',
      },
      {
        title: 'Support for Widows & Destitute Seniors',
        description: 'Priority grocery security for vulnerable households with no earning members or medical infirmities.',
      },
      {
        title: 'Emergency Food Relief during Crises',
        description: 'Cooked meal distribution and dry provisions during seasonal floods, fire accidents, and winter cold waves.',
      },
    ],
    metrics: [
      { value: '32,000+', label: 'Ration Kits Handed Over' },
      { value: '1,400+', label: 'Families Supported Monthly' },
      { value: '120,000+', label: 'Cooked Meals Distributed' },
    ],
    givingTiers: [
      {
        amount: 750,
        label: 'Fortified Ration Kit (1 Person)',
        impact: 'Provides balanced groceries (grains, lentils, cooking oil, spices) for 3 weeks.',
      },
      {
        amount: 1600,
        label: 'Full Family Grocery Pack',
        impact: 'Supplies a family of 4 with a comprehensive 30-day staple ration kit.',
      },
      {
        amount: 4800,
        label: '3 Months Food Security',
        impact: 'Ensures uninterrupted nutritious meals for an elderly widow-headed household.',
      },
    ],
  },

  'General Fund': {
    id: 'General Fund',
    name: 'General Fund & Where the Need is Greatest',
    shortTag: 'Unrestricted Impact',
    tagline: 'Flexible funding that allows our team to respond quickly to critical emergencies, urgent medical needs, and operational resilience.',
    image: '/images/women_empowerment.jpg',
    accentColor: '#0F3D44',
    bgGradient: 'from-[#EDF5F6] via-[#F6FBFC] to-[#EDF5F6] dark:from-[#112427] dark:via-[#0F1E21] dark:to-[#0B171A]',
    summaryStory: 'Unrestricted contributions give us the agility to deploy resources immediately where lives are at risk without administrative bottlenecks.',
    pillars: [
      {
        title: 'Rapid Emergency Deployment',
        description: 'Immediate response when medical emergencies, accidents, or natural calamities strike.',
      },
      {
        title: 'Sustaining Field Personnel',
        description: 'Supporting committed field workers, animal handlers, and grassroots coordinators on the ground.',
      },
      {
        title: 'Institutional Transparency & Audits',
        description: 'Funding rigorous third-party auditing, verified documentation, and real-time donor accountability.',
      },
    ],
    metrics: [
      { value: '100%', label: 'Verified NGO Accountability' },
      { value: '80G', label: 'Income Tax Exemption' },
      { value: '24/7', label: 'Rapid Action Readiness' },
    ],
    givingTiers: [
      {
        amount: 500,
        label: 'Anywhere Needed',
        impact: 'Pooled together with other donors to cover immediate daily essentials in field centres.',
      },
      {
        amount: 2500,
        label: 'Community Crisis Support',
        impact: 'Provides emergency medical, transport, or shelter aid to individuals in critical distress.',
      },
      {
        amount: 5000,
        label: 'Sustaining Field Outreaches',
        impact: 'Funds fuel, logistics, and supplies for multi-day field operations across villages.',
      },
    ],
  },
};
