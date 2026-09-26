import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/utils/format';

const map = {
  info: { icon: Info, cls: 'border-brand-text/25 bg-brand-soft/60 text-fg', ic: 'text-brand-text' },
  success: { icon: CheckCircle2, cls: 'border-ok/30 bg-leaf-soft text-fg', ic: 'text-ok' },
  warning: { icon: AlertTriangle, cls: 'border-warn/30 bg-marigold-soft text-fg', ic: 'text-warn' },
  error: { icon: XCircle, cls: 'border-danger/30 bg-hibiscus-soft text-fg', ic: 'text-danger' },
};

export function Alert({ tone = 'info', title, children, className, role }: { tone?: keyof typeof map; title?: string; children?: ReactNode; className?: string; role?: 'alert' | 'status' }) {
  const { icon: I, cls, ic } = map[tone];
  return (
    <div role={role ?? (tone === 'error' ? 'alert' : 'status')} className={cn('flex gap-3 rounded-xl border p-4 text-sm', cls, className)}>
      <I className={cn('mt-0.5 h-5 w-5 shrink-0', ic)} aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && 'mt-0.5', 'text-muted [&_a]:link')}>{children}</div>}
      </div>
    </div>
  );
}
