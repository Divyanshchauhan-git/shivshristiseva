import type { ImpactRecord, ProgrammeSlug } from '@/types';

/**
 * SAMPLE impact dataset used to demonstrate the Impact dashboard.
 * Generated deterministically; these are NOT real outcomes.
 * The backend should return verified records from the `impact_metrics` table.
 */
export const IMPACT_IS_SAMPLE = true;
export const impactYears = [2023, 2024, 2025, 2026];
export const impactLocations = ['Urban centres', 'Peri-urban settlements', 'Rural blocks'];

const progs: ProgrammeSlug[] = [
  'education', 'women-empowerment', 'healthcare', 'food-essentials', 'livelihood-skills',
  'child-protection', 'elderly-care', 'animal-welfare', 'emergency-relief', 'environment-community',
];

// Small seeded PRNG so the sample data is stable between renders and builds.
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

const weight: Partial<Record<ProgrammeSlug, Partial<Record<keyof ImpactRecord, number>>>> = {
  education: { childrenReached: 1, peopleSupported: 1 },
  'women-empowerment': { womenSupported: 1, peopleSupported: 1 },
  healthcare: { healthCamps: 1, peopleSupported: 1.4 },
  'animal-welfare': { animalsHelped: 1 },
  'food-essentials': { peopleSupported: 1.6 },
  'emergency-relief': { peopleSupported: 1.2 },
};

export const impactRecords: ImpactRecord[] = (() => {
  const r = rng(42);
  const out: ImpactRecord[] = [];
  impactYears.forEach((year, yi) => {
    const growth = 0.55 + yi * 0.22;
    progs.forEach((programme) => {
      impactLocations.forEach((location) => {
        const w = weight[programme] ?? {};
        const n = (base: number, key: keyof ImpactRecord) => Math.round(base * growth * (w[key] ?? 0.08) * (0.7 + r() * 0.6));
        out.push({
          year, programme, location,
          peopleSupported: n(420, 'peopleSupported'),
          childrenReached: n(260, 'childrenReached'),
          womenSupported: n(120, 'womenSupported'),
          animalsHelped: n(55, 'animalsHelped'),
          healthCamps: n(5, 'healthCamps'),
          volunteers: Math.round(12 * growth * (0.6 + r() * 0.8)),
          campaigns: r() > 0.7 ? 1 : 0,
          communities: Math.round(2 * growth * (0.5 + r())),
        });
      });
    });
  });
  return out;
})();

/** Headline demo figures shown on the home page. */
export const headlineStats = [
  { label: 'People supported', value: 10000, suffix: '+', theme: 'community' as const },
  { label: 'Children reached', value: 2500, suffix: '+', theme: 'education' as const },
  { label: 'Women supported', value: 1200, suffix: '+', theme: 'women' as const },
  { label: 'Animals helped', value: 500, suffix: '+', theme: 'animals' as const },
  { label: 'Volunteers', value: 1000, suffix: '+', theme: 'volunteer' as const },
];
export const headlinePeriod = 'Sample figures · reporting period to be confirmed';
