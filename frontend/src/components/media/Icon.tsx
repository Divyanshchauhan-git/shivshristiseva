import {
  GraduationCap, Sparkles, HeartHandshake, Stethoscope, Wheat, Wrench, ShieldCheck, HandHeart, PawPrint, Siren, Sprout,
  Users, HeartPulse, type LucideIcon, Circle,
} from 'lucide-react';
import type { Theme } from '@/types';

const registry: Record<string, LucideIcon> = {
  GraduationCap, Sparkles, HeartHandshake, Stethoscope, Wheat, Wrench, ShieldCheck, HandHeart, PawPrint, Siren, Sprout, Users, HeartPulse,
};

export const themeIcon: Record<Theme, LucideIcon> = {
  education: GraduationCap, women: Sparkles, marriage: HeartHandshake, health: Stethoscope, food: Wheat, livelihood: Wrench,
  child: ShieldCheck, elderly: HandHeart, animals: PawPrint, emergency: Siren, environment: Sprout, community: Users, volunteer: HeartPulse,
};

export function Icon({ name, className, ...rest }: { name: string; className?: string; 'aria-hidden'?: boolean }) {
  const C = registry[name] ?? Circle;
  return <C className={className} aria-hidden="true" {...rest} />;
}
