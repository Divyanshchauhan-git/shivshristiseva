import type { Theme } from '@/types';

export const themeImages: Record<Theme, string[]> = {
  education: ['/images/child_education.jpg'],
  child: ['/images/child_education.jpg'],
  women: [
    '/images/women_empowerment.jpg',
    '/images/women_livelihood.jpg',
    '/images/women_sewing_centre.jpg',
    '/images/women_artisan_crafts.jpg',
    '/images/women_shg_meeting.jpg',
    '/images/women_digital_literacy.jpg',
    '/images/women_health_dignity.jpg',
  ],
  livelihood: [
    '/images/women_livelihood.jpg',
    '/images/women_sewing_centre.jpg',
    '/images/women_artisan_crafts.jpg',
    '/images/women_empowerment.jpg',
    '/images/women_shg_meeting.jpg',
  ],
  animals: [
    '/images/animal_rescue.jpg',
    '/images/animal_street_feeding.jpg',
    '/images/animal_vet_clinic.jpg',
    '/images/animal_puppy_rescue.jpg',
    '/images/animal_vaccination_drive.jpg',
    '/images/animal_cat_care.jpg',
    '/images/animal_adoption_family.jpg',
    '/images/animal_welfare.jpg',
  ],
  health: ['/images/healthcare_camp.jpg', '/images/women_health_dignity.jpg'],
  elderly: ['/images/elderly_care.jpg'],
  food: ['/images/food_distribution.jpg', '/images/animal_street_feeding.jpg'],
  emergency: ['/images/emergency_relief.jpg'],
  environment: ['/images/environment_plantation.jpg'],
  marriage: ['/images/marriage_support.jpg'],
  volunteer: ['/images/volunteer_team.jpg', '/images/hero_community.jpg', '/images/animal_puppy_rescue.jpg'],
  community: ['/images/hero_community.jpg', '/images/volunteer_team.jpg', '/images/women_shg_meeting.jpg'],
};

export function getThemeImage(theme: Theme, seed: number = 0): string {
  const list = themeImages[theme] || ['/images/hero_community.jpg'];
  const index = Math.abs(seed) % list.length;
  return list[index];
}
