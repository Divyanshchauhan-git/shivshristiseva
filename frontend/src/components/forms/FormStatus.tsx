import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import type { SubmitState } from '@/hooks/useForm';
import { isMockApi } from '@/services/api';

export function FormSuccess({ title, text, reference, onReset, resetLabel = 'Send another', children }: { title: string; text: ReactNode; reference?: string; onReset?: () => void; resetLabel?: string; children?: ReactNode }) {
  return (
    <div role="status" className="flex flex-col items-center rounded-2xl border border-ok/30 bg-leaf-soft/60 px-6 py-10 text-center animate-rise">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-ok text-white"><CheckCircle2 className="h-7 w-7" aria-hidden="true" /></span>
      <h3 className="mt-4 text-2xl">{title}</h3>
      <p className="mt-2 max-w-md text-muted">{text}</p>
      {reference && <p className="mt-3 text-sm">Reference: <span className="select-all font-mono font-semibold">{reference}</span></p>}
      {isMockApi && <p className="mt-2 text-xs text-muted">Demo mode: nothing was sent. Connect the API to receive submissions.</p>}
      {children}
      {onReset && <Button variant="secondary" size="sm" className="mt-5" onClick={onReset}>{resetLabel}</Button>}
    </div>
  );
}

export function FormError({ submit }: { submit: SubmitState }) {
  if (submit.status !== 'error') return null;
  return <Alert tone="error" title="We couldn't send this yet">{submit.message}</Alert>;
}

export const PrivacyLine = () => (
  <p className="text-xs text-muted">We use your details only to respond to you and never sell or share them. See our <Link to="/legal/privacy" className="link">Privacy Policy</Link>.</p>
);
