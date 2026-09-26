import type { ReactNode } from 'react';
import { cn } from '@/utils/format';

export type Tone = 'plain' | 'neutral' | 'brand' | 'marigold' | 'leaf' | 'hibiscus' | 'ok' | 'warn' | 'danger';
const tones: Record<Tone, string> = {
  plain: '',
  neutral: 'bg-surface-2 text-muted',
  brand: 'bg-brand-soft text-brand-text',
  marigold: 'bg-marigold-soft text-[rgb(var(--warn))]',
  leaf: 'bg-leaf-soft text-leaf',
  hibiscus: 'bg-hibiscus-soft text-hibiscus',
  ok: 'bg-leaf-soft text-ok',
  warn: 'bg-marigold-soft text-warn',
  danger: 'bg-hibiscus-soft text-danger',
};

export function Badge({ tone = 'neutral', children, className, dot }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold', tones[tone], className)}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

const statusTone: Record<string, Tone> = {
  success: 'ok', active: 'ok', published: 'ok', approved: 'ok', issued: 'ok', completed: 'brand', adopted: 'brand', replied: 'brand',
  pending: 'warn', created: 'warn', draft: 'neutral', scheduled: 'marigold', paused: 'warn', reviewed: 'brand', shortlisted: 'marigold',
  failed: 'danger', rejected: 'danger', cancelled: 'neutral', refunded: 'neutral', archived: 'neutral', closed: 'neutral',
  new: 'hibiscus', contacted: 'brand', proposal: 'marigold', discussion: 'warn',
  'available for adoption': 'ok', 'needs foster': 'marigold', 'under treatment': 'warn', 'community animal': 'brand',
  'not applicable': 'neutral',
};
export const StatusBadge = ({ status }: { status: string }) => (
  <Badge tone={statusTone[status.toLowerCase()] ?? 'neutral'} dot className="capitalize">{status}</Badge>
);
