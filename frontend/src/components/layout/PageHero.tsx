import type { ReactNode } from 'react';
import type { Theme } from '@/types';
import { Scene } from '@/components/media/Scene';
import { Breadcrumbs } from '@/components/ui/Section';

const heroThemeImages: Partial<Record<Theme, string>> = {
  community: '/images/hero_community.jpg',
  education: '/images/child_education.jpg',
  child: '/images/child_education.jpg',
  women: '/images/women_empowerment.jpg',
  livelihood: '/images/women_livelihood.jpg',
  animals: '/images/animal_rescue.jpg',
  health: '/images/healthcare_camp.jpg',
  elderly: '/images/healthcare_camp.jpg',
  volunteer: '/images/hero_community.jpg',
};

/** Interior page hero: deep peacock band with real photography bleeding in from the right. */
export function PageHero({ title, eyebrow, text, crumbs, theme = 'community', seed = 3, children }: {
  title: ReactNode; eyebrow?: string; text?: ReactNode; crumbs: { label: string; to?: string }[]; theme?: Theme; seed?: number; children?: ReactNode;
}) {
  const photo = heroThemeImages[theme];

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#072427] via-[#0B3B3E] to-[#0A3338] text-white">
      <div className="absolute inset-y-0 right-0 hidden w-[50%] md:block" aria-hidden="true">
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover object-center opacity-40 mix-blend-luminosity" />
        ) : (
          <Scene theme={theme} seed={seed} className="h-full w-full opacity-50" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#072427] via-[#072427]/70 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-28 md:hidden" aria-hidden="true">
        {photo ? (
          <img src={photo} alt="" className="h-full w-full object-cover opacity-25" />
        ) : (
          <Scene theme={theme} seed={seed} className="h-full w-full opacity-30" birds={false} />
        )}
      </div>
      <div className="container-page relative pb-16 pt-10 sm:pb-20 sm:pt-14 z-10">
        <Breadcrumbs items={crumbs} />
        <div className="mt-6 max-w-2xl animate-rise">
          {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-amber-400">{eyebrow}</p>}
          <h1 className="h-display text-white">{title}</h1>
          {text && <p className="mt-5 max-w-xl text-lg text-white/85 leading-relaxed">{text}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
