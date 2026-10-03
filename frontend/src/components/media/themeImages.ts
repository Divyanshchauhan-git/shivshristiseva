import type { Theme } from '@/types';

export const themeImages: Record<Theme, string[]> = {
  education: ['/images/child_education.jpg'],
  child: ['/images/child_education.jpg'],
  women: ['/images/women_empowerment.jpg', '/images/women_livelihood.jpg'],
  livelihood: ['/images/women_livelihood.jpg', '/images/women_empowerment.jpg'],
  animals: ['/images/animal_rescue.jpg', '/images/animal_welfare.jpg'],
  health: ['/images/healthcare_camp.jpg'],
  elderly: ['/images/elderly_care.jpg'],
  food: ['/images/food_distribution.jpg'],
  emergency: ['/images/emergency_relief.jpg'],
  environment: ['/images/environment_plantation.jpg'],
  marriage: ['/images/marriage_support.jpg'],
  volunteer: ['/images/volunteer_team.jpg', '/images/hero_community.jpg'],
  community: ['/images/hero_community.jpg', '/images/volunteer_team.jpg'],
};

export function getThemeImage(theme: Theme, seed: number = 0): string {
  const list = themeImages[theme] || ['/images/hero_community.jpg'];
  const index = Math.abs(seed) % list.length;
  return list[index];
}
