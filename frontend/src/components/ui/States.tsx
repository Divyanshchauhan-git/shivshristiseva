import type { ReactNode } from 'react';
import { RefreshCw, SearchX, WifiOff } from 'lucide-react';
import type { AsyncState } from '@/hooks/useAsync';
import { Button } from './Button';
import { cn } from '@/utils/format';

export function SkeletonCards({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-6 sm:grid-cols-2 lg:grid-cols-3', className)} role="status" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-[4/3] rounded-none" />
          <div className="space-y-3 p-5"><div className="skeleton h-4 w-1/3" /><div className="skeleton h-5 w-4/5" /><div className="skeleton h-4 w-full" /></div>
        </div>
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div role="status" className="space-y-3 py-6"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-4 w-full" /><div className="skeleton h-4 w-5/6" /><span className="sr-only">{label}</span></div>
  );
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand-text">{icon ?? <SearchX className="h-6 w-6" aria-hidden="true" />}</span>
      <h3 className="text-xl">{title}</h3>
      {text && <p className="mt-2 max-w-md text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="card flex flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-hibiscus-soft text-hibiscus"><WifiOff className="h-6 w-6" aria-hidden="true" /></span>
      <h3 className="text-xl">Something went wrong</h3>
      <p className="mt-2 max-w-md text-muted">{message || 'Please try again.'}</p>
      {onRetry && <Button variant="secondary" className="mt-5" onClick={onRetry} icon={<RefreshCw className="h-4 w-4" />}>Try again</Button>}
    </div>
  );
}

/** Renders loading / error / empty / success for any useAsync result. */
export function AsyncView<T>({ state, retry, loading, empty, isEmpty, children }: {
  state: AsyncState<T>; retry?: () => void; loading?: ReactNode; empty?: ReactNode; isEmpty?: (d: T) => boolean; children: (d: T) => ReactNode;
}) {
  if (state.status === 'loading') return <>{loading ?? <SkeletonCards />}</>;
  if (state.status === 'error') return <ErrorState message={state.error.message} onRetry={retry} />;
  const d = state.data;
  const emptyNow = isEmpty ? isEmpty(d) : Array.isArray(d) && d.length === 0;
  if (emptyNow) return <>{empty ?? <EmptyState title="Nothing here yet" />}</>;
  return <>{children(d)}</>;
}
